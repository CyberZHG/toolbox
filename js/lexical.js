/*jslint browser: true*/
/*global require, exports*/

/**
 * Try parsing simple regular expression to syntax tree.
 *
 * Grammars:
 *   Empty: S -> ϵ
 *   Cat:   S -> S S
 *   Or:    S -> S | S
 *   Star:  S -> S *
 *   Text:  S -> [0-9a-zA-Z]
 *   S -> ( S )
 *
 * @param {string} text The input regular expression
 * @return {string|object} Returns a string that is an error message if failed to parse the expression,
 *                         otherwise returns an object which is the syntax tree.
 */
function parseRegex(text) {
    'use strict';
    function parseSub(text, begin, end, first) {
        var i,
            sub,
            last = 0,
            node = {'begin': begin, 'end': end},
            tempNode,
            stack = 0,
            parts = [];
        if (text.length === 0) {
            return 'Error: empty input at ' + begin + '.';
        }
        if (first) {
            for (i = 0; i <= text.length; i += 1) {
                if (i === text.length || (text[i] === '|' && stack === 0)) {
                    if (last === 0 && i === text.length) {
                        return parseSub(text, begin + last, begin + i, false);
                    }
                    sub = parseSub(text.substr(last, i - last), begin + last, begin + i, true);
                    if (typeof sub === 'string') {
                        return sub;
                    }
                    parts.push(sub);
                    last = i + 1;
                } else if (text[i] === '(') {
                    stack += 1;
                } else if (text[i] === ')') {
                    stack -= 1;
                }
            }
            if (parts.length === 1) {
                return parts[0];
            }
            node.type = 'or';
            node.parts = parts;
        } else {
            for (i = 0; i < text.length; i += 1) {
                if (text[i] === '(') {
                    last = i + 1;
                    i += 1;
                    stack = 1;
                    while (i < text.length && stack !== 0) {
                        if (text[i] === '(') {
                            stack += 1;
                        } else if (text[i] === ')') {
                            stack -= 1;
                        }
                        i += 1;
                    }
                    if (stack !== 0) {
                        return 'Error: missing right bracket for ' + (begin + last) + '.';
                    }
                    i -= 1;
                    sub = parseSub(text.substr(last, i - last), begin + last, begin + i, true);
                    if (typeof sub === 'string') {
                        return sub;
                    }
                    sub.begin -= 1;
                    sub.end += 1;
                    parts.push(sub);
                } else if (text[i] === '*') {
                    if (parts.length === 0) {
                        return 'Error: unexpected * at ' + (begin + i) + '.';
                    }
                    tempNode = {'begin': parts[parts.length - 1].begin, 'end': parts[parts.length - 1].end + 1};
                    tempNode.type = 'star';
                    tempNode.sub = parts[parts.length - 1];
                    parts[parts.length - 1] = tempNode;
                } else if (text[i] === 'ϵ') {
                    tempNode = {'begin': begin + i, 'end': begin + i + 1};
                    tempNode.type = 'empty';
                    parts.push(tempNode);
                } else {
                    tempNode = {'begin': begin + i, 'end': begin + i + 1};
                    tempNode.type = 'text';
                    tempNode.text = text[i];
                    parts.push(tempNode);
                }
            }
            if (parts.length === 1) {
                return parts[0];
            }
            node.type = 'cat';
            node.parts = parts;
        }
        return node;
    }
    return parseSub(text, 0, text.length, true);
}

/**
 * Convert regular expression to nondeterministic finite automaton.
 *
 * @param {string} text @see parseRegex()
 * @return {object|string}
 */
function regexToNfa(text) {
    'use strict';
    function generateGraph(node, start, end, count) {
        var i, last, temp, tempStart, tempEnd;
        if (!start.hasOwnProperty('id')) {
            start.id = count;
            count += 1;
        }
        switch (node.type) {
        case 'empty':
            start.edges.push(['ϵ', end]);
            break;
        case 'text':
            start.edges.push([node.text, end]);
            break;
        case 'cat':
            last = start;
            for (i = 0; i < node.parts.length - 1; i += 1) {
                temp = {'type': '', 'edges': []};
                count = generateGraph(node.parts[i], last, temp, count);
                last = temp;
            }
            count = generateGraph(node.parts[node.parts.length - 1], last, end, count);
            break;
        case 'or':
            for (i = 0; i < node.parts.length; i += 1) {
                tempStart = {'type': '', 'edges': []};
                tempEnd = {'type': '', 'edges': [['ϵ', end]]};
                start.edges.push(['ϵ', tempStart]);
                count = generateGraph(node.parts[i], tempStart, tempEnd, count);
            }
            break;
        case 'star':
            tempStart = {'type': '', 'edges': []};
            tempEnd = {'type': '', 'edges': [['ϵ', tempStart], ['ϵ', end]]};
            start.edges.push(['ϵ', tempStart]);
            start.edges.push(['ϵ', end]);
            count = generateGraph(node.sub, tempStart, tempEnd, count);
            break;
        }
        if (!end.hasOwnProperty('id')) {
            end.id = count;
            count += 1;
        }
        return count;
    }
    var ast = parseRegex(text),
        start = {'type': 'start', 'edges': []},
        accept = {'type': 'accept', 'edges': []};
    if (typeof ast === 'string') {
        return ast;
    }
    generateGraph(ast, start, accept, 0);
    return start;
}

/**
 * Convert nondeterministic finite automaton to deterministic finite automaton.
 *
 * @param {object} nfa @see regexToNfa(), the function assumes that the given NFA is valid.
 * @return {object} dfa Returns the first element of the DFA.
 */
function nfaToDfa(nfa) {
    'use strict';
    function getClosure(nodes) {
        var i,
            closure = [],
            stack = [],
            symbols = [],
            type = '',
            top;
        for (i = 0; i < nodes.length; i += 1) {
            stack.push(nodes[i]);
            closure.push(nodes[i]);
            if (nodes[i].type === 'accept') {
                type = 'accept';
            }
        }
        while (stack.length > 0) {
            top = stack.pop();
            for (i = 0; i < top.edges.length; i += 1) {
                if (top.edges[i][0] === 'ϵ') {
                    if (closure.indexOf(top.edges[i][1]) < 0) {
                        stack.push(top.edges[i][1]);
                        closure.push(top.edges[i][1]);
                        if (top.edges[i][1].type === 'accept') {
                            type = 'accept';
                        }
                    }
                } else {
                    if (symbols.indexOf(top.edges[i][0]) < 0) {
                        symbols.push(top.edges[i][0]);
                    }
                }
            }
        }
        closure.sort(function (a, b) {
            return a.id - b.id;
        });
        symbols.sort();
        return {
            'key': closure.map(function (x) {
                return x.id;
            }).join(','),
            'items': closure,
            'symbols': symbols,
            'type': type,
            'edges': [],
            'trans': {}
        };
    }
    function getClosedMove(closure, symbol) {
        var i,
            j,
            node,
            nexts = [];
        for (i = 0; i < closure.items.length; i += 1) {
            node = closure.items[i];
            for (j = 0; j < node.edges.length; j += 1) {
                if (symbol === node.edges[j][0]) {
                    if (nexts.indexOf(node.edges[j][1]) < 0) {
                        nexts.push(node.edges[j][1]);
                    }
                }
            }
        }
        return getClosure(nexts);
    }
    function toAlphaCount(n) {
        var a = 'A'.charCodeAt(0),
            z = 'Z'.charCodeAt(0),
            len = z - a + 1,
            s = '';
        while (n >= 0) {
            s = String.fromCharCode(n % len + a) + s;
            n = Math.floor(n / len) - 1;
        }
        return s;
    }
    var i,
        first = getClosure([nfa]),
        states = {},
        front = 0,
        top,
        closure,
        queue = [first],
        count = 0;
    first.id = toAlphaCount(count);
    states[first.key] = first;
    while (front < queue.length) {
        top = queue[front];
        front += 1;
        for (i = 0; i < top.symbols.length; i += 1) {
            closure = getClosedMove(top, top.symbols[i]);
            if (!states.hasOwnProperty(closure.key)) {
                count += 1;
                closure.id = toAlphaCount(count);
                states[closure.key] = closure;
                queue.push(closure);
            }
            top.trans[top.symbols[i]] = states[closure.key];
            top.edges.push([top.symbols[i], states[closure.key]]);
        }
    }
    return first;
}

if (typeof require === 'function') {
    exports.parseRegex = parseRegex;
    exports.regexToNfa = regexToNfa;
}
