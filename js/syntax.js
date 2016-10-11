/*jslint browser: true*/
/*global require, exports*/

function parseGrammar(text) {
    'use strict';
    var index = 0,
        grammar = {},
        head = null,
        tokens = text.split(/\s+/).filter(function (token) {
            return token.length > 0;
        });
    while (index < tokens.length) {
        if (index + 1 < tokens.length && tokens[index + 1] === '->') {
            head = tokens[index];
            index += 2;
            grammar[head] = [[]];
        } else if (tokens[index] === '|') {
            grammar[head].push([]);
            index += 1;
        } else {
            grammar[head][grammar[head].length - 1].push(tokens[index]);
            index += 1;
        }
    }
    return grammar;
}

function leftFactoring(grammar) {
    'use strict';
    var i, j, k, l,
        generation,
        longest,
        hasPrefix,
        helperName,
        keys = Object.keys(grammar);

    function arrayEqual(a, b) {
        var idx;
        if (a.length !== b.length) {
            return false;
        }
        for (idx = 0; idx < a.length; idx += 1) {
            if (a[idx] !== b[idx]) {
                return false;
            }
        }
        return true;
    }

    for (i = 0; i < keys.length; i += 1) {
        helperName = keys[i] + "'";
        hasPrefix = true;
        while (hasPrefix) {
            hasPrefix = false;
            longest = [];
            generation = grammar[keys[i]];
            for (j = 0; j < generation.length; j += 1) {
                for (k = j + 1; k < generation.length; k += 1) {
                    for (l = 0; l < generation[j].length && l < generation[k].length; l += 1) {
                        if (generation[j][l] !== generation[k][l]) {
                            break;
                        }
                    }
                    if (l > 0) {
                        hasPrefix = true;
                        if (l > longest.length) {
                            longest = generation[j].slice(0, l);
                        }
                    }
                }
            }
            if (hasPrefix) {
                while (grammar.hasOwnProperty(helperName)) {
                    helperName += "'";
                }
                grammar[helperName] = [];
                for (j = 0, k = 0; k < generation.length; k += 1) {
                    if (generation[k].length >= longest.length && arrayEqual(generation[k].slice(0, longest.length), longest)) {
                        if (generation[k].length === longest.length) {
                            grammar[helperName].push(['ϵ']);
                        } else {
                            grammar[helperName].push(generation[k].slice(longest.length));
                        }
                    } else {
                        grammar[keys[i]][j] = grammar[keys[i]][k];
                        j += 1;
                    }
                }
                grammar[keys[i]] = [longest.concat([helperName])].concat(grammar[keys[i]].slice(0, j));
            }
        }
    }
    return grammar;
}

function eliminateLeftRecursion(grammar) {
    'use strict';
    var i, j, k, l,
        extended,
        hasDirectRec,
        helperName,
        keys = Object.keys(grammar);
    for (i = 0; i < keys.length; i += 1) {
        for (j = 0; j < i; j += 1) {
            extended = [];
            for (k = 0; k < grammar[keys[i]].length; k += 1) {
                if (grammar[keys[i]][k].length > 0 && grammar[keys[i]][k][0] === keys[j]) {
                    for (l = 0; l < grammar[keys[j]].length; l += 1) {
                        extended.push(grammar[keys[j]][l].concat(grammar[keys[i]][k].slice(1)));
                    }
                } else if (grammar[keys[i]][k].length > 0) {
                    extended.push(grammar[keys[i]][k]);
                }
            }
            grammar[keys[i]] = extended;
        }
        hasDirectRec = false;
        for (k = 0; k < grammar[keys[i]].length; k += 1) {
            if (grammar[keys[i]][k].length > 0 && grammar[keys[i]][k][0] === keys[i]) {
                hasDirectRec = true;
                break;
            }
        }
        if (hasDirectRec) {
            helperName = keys[i] + "'";
            while (grammar.hasOwnProperty(helperName)) {
                helperName += "'";
            }
            grammar[helperName] = [];
            for (j = 0, k = 0; k < grammar[keys[i]].length; k += 1) {
                if (grammar[keys[i]][k].length > 0) {
                    if (grammar[keys[i]][k][0] === keys[i]) {
                        grammar[helperName].push(grammar[keys[i]][k].slice(1).concat([helperName]));
                    } else {
                        if (grammar[keys[i]][k].length === 1 && grammar[keys[i]][k][0] === 'ϵ') {
                            grammar[keys[i]][k] = [helperName];
                        } else {
                            grammar[keys[i]][k].push(helperName);
                        }
                        grammar[keys[i]][j] = grammar[keys[i]][k];
                        j += 1;
                    }
                }
            }
            grammar[keys[i]] = grammar[keys[i]].slice(0, j);
            grammar[helperName].push(['ϵ']);
        }
    }
    return grammar;
}

function toPretty(grammar) {
    'use strict';
    var i, j,
        pretty = '',
        left = 0,
        keys = Object.keys(grammar);

    function space(num) {
        var s = '';
        while (num > 0) {
            s += ' ';
            num -= 1;
        }
        return s;
    }

    keys.forEach(function (key) {
        if (key.length > left) {
            left = key.length;
        }
    });
    for (i = 0; i < keys.length; i += 1) {
        for (j = 0; j < grammar[keys[i]].length; j += 1) {
            if (j === 0) {
                pretty += space(left - keys[i].length);
                pretty += keys[i];
                pretty += ' -> ';
            } else {
                pretty += space(left);
                pretty += '  | ';
            }
            pretty += grammar[keys[i]][j].join(' ') + '\n';
        }
    }

    return pretty;
}

function calcNullables(grammar) {
    'use strict';
    var i, j, k,
        nullables = {},
        keys = Object.keys(grammar);
    for (i = 0; i < keys.length; i += 1) {
        for (j = 0; j < grammar[keys[i]].length; j += 1) {
            for (k = 0; k < grammar[keys[i]][j].length; k += 1) {
                if (!grammar.hasOwnProperty(grammar[keys[i]][j][k])) {
                    nullables[grammar[keys[i]][j][k]] = false;
                }
            }
        }
    }
    if (nullables.hasOwnProperty('ϵ')) {
        nullables['ϵ'] = true;
    }
    function calcRec(key, path) {
        var ii, jj;
        if (path.indexOf(key) >= 0) {
            return false;
        }
        path = path.concat([key]);
        if (nullables.hasOwnProperty(key)) {
            return nullables[key];
        }
        for (ii = 0; ii < grammar[key].length; ii += 1) {
            for (jj = 0; jj < grammar[key][ii].length; jj += 1) {
                if (!calcRec(grammar[key][ii][jj], path)) {
                    break;
                }
            }
            if (jj === grammar[key][ii].length) {
                nullables[key] = true;
                return true;
            }
        }
        nullables[key] = false;
        return false;
    }
    keys.forEach(function (key) {
        calcRec(key, []);
    });
    return nullables;
}

function calcFirsts(grammar, preNullables) {
    'use strict';
    var i, j, k,
        nullables = preNullables || calcNullables(grammar),
        firsts = {},
        finished = false,
        keys = Object.keys(grammar);
    for (i = 0; i < keys.length; i += 1) {
        for (j = 0; j < grammar[keys[i]].length; j += 1) {
            for (k = 0; k < grammar[keys[i]][j].length; k += 1) {
                if (!grammar.hasOwnProperty(grammar[keys[i]][j][k])) {
                    firsts[grammar[keys[i]][j][k]] = [grammar[keys[i]][j][k]];
                }
            }
        }
    }
    function calcRec(key, path) {
        var ii, jj, kk, first;
        if (!grammar.hasOwnProperty(key)) {
            return firsts[key];
        }
        if (path.indexOf(key) >= 0) {
            return firsts[key];
        }
        path = path.concat([key]);
        if (!firsts.hasOwnProperty(key)) {
            firsts[key] = [];
            finished = false;
        }
        for (ii = 0; ii < grammar[key].length; ii += 1) {
            for (jj = 0; jj < grammar[key][ii].length; jj += 1) {
                first = calcRec(grammar[key][ii][jj], path);
                for (kk = 0; kk < first.length; kk += 1) {
                    if (firsts[key].indexOf(first[kk]) < 0) {
                        firsts[key].push(first[kk]);
                        finished = false;
                    }
                }
                if (!nullables[grammar[key][ii][jj]]) {
                    break;
                }
            }
        }
        return firsts[key];
    }
    while (!finished) {
        finished = true;
        for (i = 0; i < keys.length; i += 1) {
            calcRec(keys[i], []);
        }
    }
    Object.keys(firsts).forEach(function (key) {
        firsts[key].sort();
    });
    return firsts;
}

function calcFollows(grammar, preNullables, preFirsts) {
    'use strict';
    var i,
        nullables = preNullables || calcNullables(grammar),
        firsts = preFirsts || calcFirsts(grammar),
        follows = {},
        finished = false,
        keys = Object.keys(grammar);
    for (i = 0; i < keys.length; i += 1) {
        if (i === 0) {
            follows[keys[i]] = ['$'];
        } else {
            follows[keys[i]] = [];
        }
    }
    function calc(key) {
        var ii, jj, kk, ll, mid, first;
        for (ii = 0; ii < grammar[key].length; ii += 1) {
            for (jj = 0; jj < grammar[key][ii].length; jj += 1) {
                // A -> aBb
                mid = grammar[key][ii][jj];
                if (grammar.hasOwnProperty(mid)) {
                    for (kk = jj + 1; kk < grammar[key][ii].length; kk += 1) {
                        first = firsts[grammar[key][ii][kk]];
                        for (ll = 0; ll < first.length; ll += 1) {
                            if (first[ll] !== 'ϵ' && follows[mid].indexOf(first[ll]) < 0) {
                                follows[mid].push(first[ll]);
                                finished = false;
                            }
                        }
                        if (!nullables[grammar[key][ii][kk]]) {
                            break;
                        }
                    }
                    if (kk === grammar[key][ii].length) {
                        for (ll = 0; ll < follows[key].length; ll += 1) {
                            if (follows[mid].indexOf(follows[key][ll]) < 0) {
                                follows[mid].push(follows[key][ll]);
                                finished = false;
                            }
                        }
                    }
                }
            }
        }
    }
    while (!finished) {
        finished = true;
        for (i = 0; i < keys.length; i += 1) {
            calc(keys[i]);
        }
    }
    keys.forEach(function (key) {
        follows[key].sort();
    });
    return follows;
}

if (typeof require === 'function') {
    exports.parseGrammar = parseGrammar;
    exports.leftFactoring = leftFactoring;
    exports.eliminateLeftRecursion = eliminateLeftRecursion;
    exports.calcNullables = calcNullables;
    exports.calcFirsts = calcFirsts;
    exports.calcFollows = calcFollows;
}
