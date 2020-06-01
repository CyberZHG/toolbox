/*jslint browser: true*/
/*global require, exports*/

/**
 * Structure:
 * grammar {key => head, value => array of body}
 * body {array of string}
 */
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
                    if (firsts[key].indexOf(first[kk]) < 0 && first[kk] !== 'ϵ') {
                        firsts[key].push(first[kk]);
                        finished = false;
                    }
                }
                if (!nullables[grammar[key][ii][jj]]) {
                    break;
                }
            }
            if (jj === grammar[key][ii].length) {
                if (firsts[key].indexOf('ϵ') < 0) {
                    firsts[key].push('ϵ');
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

function constructLL1ParsingTable(grammar) {
    'use strict';
    var i, j, k, l, first, follow,
        table = {},
        keys = Object.keys(grammar),
        nullables = calcNullables(grammar),
        firsts = calcFirsts(grammar, nullables),
        follows = calcFollows(grammar, nullables, firsts);
    for (i = 0; i < keys.length; i += 1) {
        table[keys[i]] = {};
        for (j = 0; j < grammar[keys[i]].length; j += 1) {
            for (k = 0; k < grammar[keys[i]][j].length; k += 1) {
                first = firsts[grammar[keys[i]][j][k]];
                for (l = 0; l < first.length; l += 1) {
                    if (first[l] !== 'ϵ') {
                        if (!table[keys[i]].hasOwnProperty(first[l])) {
                            table[keys[i]][first[l]] = [];
                        }
                        table[keys[i]][first[l]].push(grammar[keys[i]][j]);
                    }
                }
                if (!nullables[grammar[keys[i]][j][k]]) {
                    break;
                }
            }
            if (k === grammar[keys[i]][j].length) {
                follow = follows[keys[i]];
                for (l = 0; l < follow.length; l += 1) {
                    if (!table[keys[i]].hasOwnProperty(follow[l])) {
                        table[keys[i]][follow[l]] = [];
                    }
                    table[keys[i]][follow[l]].push(grammar[keys[i]][j]);
                }
            }
        }
    }
    return table;
}

function isSameItem(a, b) {
    'use strict';
    var i;
    if (a.head !== b.head || a.body.length !== b.body.length) {
        return false;
    }
    for (i = 0; i < a.body.length; i += 1) {
        if (a.body[i] !== b.body[i]) {
            return false;
        }
    }
    return true;
}

function isInItems(item, items) {
    'use strict';
    var i;
    for (i = 0; i < items.length; i += 1) {
        if (isSameItem(item, items[i])) {
            return true;
        }
    }
    return false;
}

/**
 * Structure
 * item.head {string}
 *     .body {array of string}
 * closure.kernel {array of item}
 *        .nonkernel {array of item}
 */
function calcClosure(grammar, items) {
    'use strict';
    var i, j, k, key, item,
        closure = {};
    closure.kernel = [].concat(items);
    closure.nonkernel = [];
    for (i = 0; i < items.length; i += 1) {
        for (j = 0; j < items[i].body.length; j += 1) {
            if (items[i].body[j] === '.' && j + 1 < items[i].body.length) {
                key = items[i].body[j + 1];
                if (grammar.hasOwnProperty(key)) {
                    for (k = 0; k < grammar[key].length; k += 1) {
                        item = {
                            head: key,
                            body: ['.'].concat(grammar[key][k])
                        };
                        if (grammar[key][k].length === 1 && grammar[key][k][0] === 'ϵ') {
                            item.body = ['.'];
                        }
                        if (!isInItems(item, closure.nonkernel)) {
                            closure.nonkernel.push(item);
                            items.push(item);
                        }
                    }
                }
                break;
            }
        }
    }
    return closure;
}

function generateKernelKey(items) {
    'use strict';
    var i, j,
        key = '';
    items.sort();
    for (i = 0; i < items.length; i += 1) {
        if (i > 0) {
            key += ' | ';
        }
        key += items[i].head + ' ->';
        for (j = 0; j < items[i].body.length; j += 1) {
            key += ' ' + items[i].body[j];
        }
    }
    return key;
}

function constructLR0Automaton(grammar) {
    'use strict';
    var i, j, k,
        key,
        keys = Object.keys(grammar),
        follows = calcFollows(grammar),
        automaton,
        queue,
        front = 0,
        closure,
        item,
        items,
        kernel,
        kernels = {},
        start;
    if (keys.length === 0) {
        return null;
    }
    start = keys[0] + "'";
    while (grammar.hasOwnProperty(start)) {
        start += "'";
    }
    automaton = calcClosure(grammar, [{
        head: start,
        body: ['.', keys[0]]
    }]);
    automaton.num = 0;
    automaton.key = generateKernelKey(automaton.kernel);
    automaton.edges = {};
    kernels[automaton.key] = automaton;
    queue = [automaton];
    while (front < queue.length) {
        closure = queue[front];
        front += 1;
        items = closure.kernel.concat(closure.nonkernel);
        keys = [];
        for (i = 0; i < items.length; i += 1) {
            for (j = 0; j < items[i].body.length; j += 1) {
                if (items[i].body[j] === '.') {
                    j += 1;
                    if (j < items[i].body.length && keys.indexOf(items[i].body[j]) < 0) {
                        keys.push(items[i].body[j]);
                    }
                    break;
                }
            }
            if (j === items[i].body.length && items[i].head === start) {
                closure.accept = true;
            }
        }
        for (i = 0; i < keys.length; i += 1) {
            kernel = [];
            for (j = 0; j < items.length; j += 1) {
                for (k = 0; k < items[j].body.length; k += 1) {
                    if (items[j].body[k] === '.') {
                        if (k + 1 < items[j].body.length && items[j].body[k + 1] === keys[i]) {
                            item = {
                                head: items[j].head,
                                body: items[j].body.slice(0, k)
                                    .concat([items[j].body[k + 1]])
                                    .concat([items[j].body[k]])
                                    .concat(items[j].body.slice(k + 2))
                            };
                            kernel.push(item);
                        }
                        break;
                    }
                }
            }
            if (kernel.length > 0) {
                key = generateKernelKey(kernel);
                if (kernels.hasOwnProperty(key)) {
                    closure.edges[keys[i]] = kernels[key];
                } else {
                    kernel = calcClosure(grammar, kernel);
                    kernel.num = Object.keys(kernels).length;
                    kernel.key = key;
                    kernel.edges = {};
                    kernels[key] = kernel;
                    closure.edges[keys[i]] = kernel;
                    queue.push(kernel);
                }
            }
        }
        closure.reduces = {};
        for (i = 0; i < closure.kernel.length; i += 1) {
            if (closure.kernel[i].head !== start && closure.kernel[i].body[closure.kernel[i].body.length - 1] === '.') {
                for (j = 0; j < follows[closure.kernel[i].head].length; j += 1) {
                    if (!closure.reduces.hasOwnProperty(follows[closure.kernel[i].head][j])) {
                        closure.reduces[follows[closure.kernel[i].head][j]] = [];
                    }
                    closure.reduces[follows[closure.kernel[i].head][j]].push({
                        head: closure.kernel[i].head,
                        body: closure.kernel[i].body.slice(0, closure.kernel[i].body.length - 1)
                    });
                }
            }
        }
    }
    return automaton;
}

function indexOfItems(item, items) {
    'use strict';
    var i;
    for (i = 0; i < items.length; i += 1) {
        if (isSameItem(item, items[i])) {
            return i;
        }
    }
    return -1;
}

/**
 * Structure
 * item.head {string}
 *     .body {array of string}
 *     .lookahead {array of string}
 * closure.kernel {array of item}
 *        .nonkernel {array of item}
 */
function calcLR1Closure(grammar, items, preNullables, preFirsts) {
    'use strict';
    var i, j, k, l, m, hasNewItem, key, item, index, first, lookahead,
        nullables = preNullables || calcNullables(grammar),
        firsts = preFirsts || calcFirsts(grammar, nullables),
        closure = {};
    closure.kernel = [].concat(items);
    closure.nonkernel = [];
    while (true) {
        hasNewItem = false;
        for (i = 0; i < items.length; i += 1) {
            for (j = 0; j < items[i].body.length; j += 1) {
                if (items[i].body[j] === '.' && j + 1 < items[i].body.length) {
                    key = items[i].body[j + 1];
                    if (grammar.hasOwnProperty(key)) {
                        for (k = 0; k < grammar[key].length; k += 1) {
                            item = {
                                head: key,
                                body: ['.'].concat(grammar[key][k])
                            };
                            if (grammar[key][k].length === 1 && grammar[key][k][0] === 'ϵ') {
                                item.body = ['.'];
                            }
                            lookahead = [];
                            for (l = j + 2; l < items[i].body.length; l += 1) {
                                first = firsts[items[i].body[l]];
                                for (m = 0; m < first.length; m += 1) {
                                    if (first[m] !== 'ϵ' && lookahead.indexOf(first[m]) < 0) {
                                        lookahead.push(first[m]);
                                    }
                                }
                                if (!nullables[items[i].body[l]]) {
                                    break;
                                }
                            }
                            if (l === items[i].body.length) {
                                for (m = 0; m < items[i].lookahead.length; m += 1) {
                                    if (lookahead.indexOf(items[i].lookahead[m]) < 0) {
                                        lookahead.push(items[i].lookahead[m]);
                                    }
                                }
                            }
                            item.lookahead = lookahead;
                            index = indexOfItems(item, closure.nonkernel);
                            if (index < 0) {
                                closure.nonkernel.push(item);
                                items.push(item);
                                hasNewItem = true;
                            } else {
                                for (m = 0; m < item.lookahead.length; m += 1) {
                                    if (closure.nonkernel[index].lookahead.indexOf(item.lookahead[m]) < 0) {
                                        closure.nonkernel[index].lookahead.push(item.lookahead[m]);
                                        hasNewItem = true;
                                    }
                                }
                            }
                        }
                    }
                    break;
                }
            }
        }
        if (!hasNewItem) {
            break;
        }
    }
    for (i = 0; i < closure.nonkernel.length; i += 1) {
        closure.nonkernel[i].lookahead.sort();
    }
    return closure;
}

function generateLR1KernelKey(items) {
    'use strict';
    var i, j,
        key = '';
    items.sort();
    for (i = 0; i < items.length; i += 1) {
        if (i > 0) {
            key += ' | ';
        }
        key += items[i].head + ' ->';
        for (j = 0; j < items[i].body.length; j += 1) {
            key += ' ' + items[i].body[j];
        }
        key += ', ' + items[i].lookahead.join('/');
    }
    return key;
}

function constructLR1Automaton(grammar) {
    'use strict';
    var i, j, k,
        key,
        keys = Object.keys(grammar),
        nullables = calcNullables(grammar),
        firsts = calcFirsts(grammar, nullables),
        follows = calcFollows(grammar, nullables, firsts),
        automaton,
        queue,
        front = 0,
        closure,
        item,
        items,
        kernel,
        kernels = {},
        start;
    if (keys.length === 0) {
        return null;
    }
    start = keys[0] + "'";
    while (grammar.hasOwnProperty(start)) {
        start += "'";
    }
    automaton = calcLR1Closure(grammar, [{
        head: start,
        body: ['.', keys[0]],
        lookahead: ['$']
    }], nullables, firsts);
    automaton.num = 0;
    automaton.key = generateLR1KernelKey(automaton.kernel);
    automaton.edges = {};
    kernels[automaton.key] = automaton;
    queue = [automaton];
    while (front < queue.length) {
        closure = queue[front];
        front += 1;
        items = closure.kernel.concat(closure.nonkernel);
        keys = [];
        for (i = 0; i < items.length; i += 1) {
            for (j = 0; j < items[i].body.length; j += 1) {
                if (items[i].body[j] === '.') {
                    j += 1;
                    if (j < items[i].body.length && keys.indexOf(items[i].body[j]) < 0) {
                        keys.push(items[i].body[j]);
                    }
                    break;
                }
            }
            if (j === items[i].body.length && items[i].head === start) {
                closure.accept = true;
            }
        }
        for (i = 0; i < keys.length; i += 1) {
            kernel = [];
            for (j = 0; j < items.length; j += 1) {
                for (k = 0; k < items[j].body.length; k += 1) {
                    if (items[j].body[k] === '.') {
                        if (k + 1 < items[j].body.length && items[j].body[k + 1] === keys[i]) {
                            item = {
                                head: items[j].head,
                                body: items[j].body.slice(0, k)
                                    .concat([items[j].body[k + 1]])
                                    .concat([items[j].body[k]])
                                    .concat(items[j].body.slice(k + 2)),
                                lookahead: [].concat(items[j].lookahead)
                            };
                            kernel.push(item);
                        }
                        break;
                    }
                }
            }
            if (kernel.length > 0) {
                key = generateLR1KernelKey(kernel);
                if (kernels.hasOwnProperty(key)) {
                    closure.edges[keys[i]] = kernels[key];
                } else {
                    kernel = calcLR1Closure(grammar, kernel, nullables, firsts);
                    kernel.num = Object.keys(kernels).length;
                    kernel.key = key;
                    kernel.edges = {};
                    kernels[key] = kernel;
                    closure.edges[keys[i]] = kernel;
                    queue.push(kernel);
                }
            }
        }
        closure.reduces = {};
        for (i = 0; i < closure.kernel.length; i += 1) {
            if (closure.kernel[i].head !== start && closure.kernel[i].body[closure.kernel[i].body.length - 1] === '.') {
                for (j = 0; j < follows[closure.kernel[i].head].length; j += 1) {
                    if (closure.kernel[i].lookahead.indexOf(follows[closure.kernel[i].head][j]) >= 0) {
                        if (!closure.reduces.hasOwnProperty(follows[closure.kernel[i].head][j])) {
                            closure.reduces[follows[closure.kernel[i].head][j]] = [];
                        }
                        closure.reduces[follows[closure.kernel[i].head][j]].push({
                            head: closure.kernel[i].head,
                            body: closure.kernel[i].body.slice(0, closure.kernel[i].body.length - 1)
                        });
                    }
                }
            }
        }
    }
    return automaton;
}

function isLookaheadEqual(a, b) {
    'use strict';
    var i, j;
    if (a.length !== b.length) {
        return false;
    }
    for (i = 0; i < a.length; i += 1) {
        if (a[i].lookahead.length !== b[i].lookahead.length) {
            return false;
        }
        a[i].lookahead.sort();
        b[i].lookahead.sort();
        for (j = 0; j < a[i].lookahead.length; j += 1) {
            if (a[i].lookahead[j] !== b[i].lookahead[j]) {
                return false;
            }
        }
    }
    return true;
}

function mergeLookahead(a, b) {
    'use strict';
    var i, j;
    for (i = 0; i < a.length; i += 1) {
        for (j = 0; j < b[i].lookahead.length; j += 1) {
            if (a[i].lookahead.indexOf(b[i].lookahead[j]) < 0) {
                a[i].lookahead.push(b[i].lookahead[j]);
            }
        }
        a[i].lookahead.sort();
    }
}

function constructLALRAutomaton(grammar) {
    'use strict';
    var i, j, k,
        key,
        keys = Object.keys(grammar),
        nullables = calcNullables(grammar),
        firsts = calcFirsts(grammar, nullables),
        follows = calcFollows(grammar, nullables, firsts),
        automaton,
        queue,
        front = 0,
        closure,
        item,
        items,
        kernel,
        kernels = {},
        kernelCount = 0,
        start;
    if (keys.length === 0) {
        return null;
    }
    start = keys[0] + "'";
    while (grammar.hasOwnProperty(start)) {
        start += "'";
    }
    automaton = calcLR1Closure(grammar, [{
        head: start,
        body: ['.', keys[0]],
        lookahead: ['$']
    }], nullables, firsts);
    automaton.num = 0;
    automaton.key = generateKernelKey(automaton.kernel);
    automaton.edges = {};
    kernels[automaton.key] = automaton;
    queue = [automaton];
    while (front < queue.length) {
        closure = queue[front];
        front += 1;
        items = closure.kernel.concat(closure.nonkernel);
        keys = [];
        for (i = 0; i < items.length; i += 1) {
            for (j = 0; j < items[i].body.length; j += 1) {
                if (items[i].body[j] === '.') {
                    j += 1;
                    if (j < items[i].body.length && keys.indexOf(items[i].body[j]) < 0) {
                        keys.push(items[i].body[j]);
                    }
                    break;
                }
            }
            if (j === items[i].body.length && items[i].head === start) {
                closure.accept = true;
            }
        }
        for (i = 0; i < keys.length; i += 1) {
            kernel = [];
            for (j = 0; j < items.length; j += 1) {
                for (k = 0; k < items[j].body.length; k += 1) {
                    if (items[j].body[k] === '.') {
                        if (k + 1 < items[j].body.length && items[j].body[k + 1] === keys[i]) {
                            item = {
                                head: items[j].head,
                                body: items[j].body.slice(0, k)
                                    .concat([items[j].body[k + 1]])
                                    .concat([items[j].body[k]])
                                    .concat(items[j].body.slice(k + 2)),
                                lookahead: [].concat(items[j].lookahead)
                            };
                            kernel.push(item);
                        }
                        break;
                    }
                }
            }
            if (kernel.length > 0) {
                key = generateKernelKey(kernel);
                if (kernels.hasOwnProperty(key)) {
                    if (!isLookaheadEqual(kernel, kernels[key])) {
                        mergeLookahead(kernels[key].kernel, kernel);
                        kernel = kernels[key].kernel;
                        delete kernels[key].kernel;
                        delete kernels[key].nonkernel;
                        kernel = calcLR1Closure(grammar, kernel, nullables, firsts);
                        kernels[key].kernel = kernel.kernel;
                        kernels[key].nonkernel = kernel.nonkernel;
                    }
                } else {
                    kernel = calcLR1Closure(grammar, kernel, nullables, firsts);
                    kernelCount += 1;
                    kernel.num = kernelCount;
                    kernel.key = key;
                    kernel.edges = {};
                    kernels[key] = kernel;
                    queue.push(kernel);
                }
                closure.edges[keys[i]] = key;
            }
        }
    }
    keys = Object.keys(kernels);
    for (k = 0; k < keys.length; k += 1) {
        key = Object.keys(kernels[keys[k]].edges);
        for (j = 0; j < key.length; j += 1) {
            kernels[keys[k]].edges[key[j]] = kernels[kernels[keys[k]].edges[key[j]]];
        }
        closure = kernels[keys[k]];
        closure.reduces = {};
        for (i = 0; i < closure.kernel.length; i += 1) {
            if (closure.kernel[i].head !== start && closure.kernel[i].body[closure.kernel[i].body.length - 1] === '.') {
                for (j = 0; j < follows[closure.kernel[i].head].length; j += 1) {
                    if (closure.kernel[i].lookahead.indexOf(follows[closure.kernel[i].head][j]) >= 0) {
                        if (!closure.reduces.hasOwnProperty(follows[closure.kernel[i].head][j])) {
                            closure.reduces[follows[closure.kernel[i].head][j]] = [];
                        }
                        closure.reduces[follows[closure.kernel[i].head][j]].push({
                            head: closure.kernel[i].head,
                            body: closure.kernel[i].body.slice(0, closure.kernel[i].body.length - 1)
                        });
                    }
                }
            }
        }
    }
    return automaton;
}

if (typeof require === 'function') {
    exports.parseGrammar = parseGrammar;
    exports.leftFactoring = leftFactoring;
    exports.eliminateLeftRecursion = eliminateLeftRecursion;
    exports.calcNullables = calcNullables;
    exports.calcFirsts = calcFirsts;
    exports.calcFollows = calcFollows;
    exports.constructLL1ParsingTable = constructLL1ParsingTable;
    exports.calcClosure = calcClosure;
    exports.constructLR0Automaton = constructLR0Automaton;
    exports.calcLR1Closure = calcLR1Closure;
    exports.constructLR1Automaton = constructLR1Automaton;
    exports.constructLALRAutomaton = constructLALRAutomaton;
}
