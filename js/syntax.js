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
    console.log(keys, left);
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

if (typeof require === 'function') {
    exports.parseGrammar = parseGrammar;
    exports.eliminateLeftRecursion = eliminateLeftRecursion;
}
