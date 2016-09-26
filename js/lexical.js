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
        if (text.length === 0) {
            return 'Error: empty input at ' + begin + '.';
        }
        var i,
            sub,
            last = 0,
            node = {'begin': begin, 'end': end},
            tempNode,
            stack = 0,
            parts = [];
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

if (typeof require === 'function') {
    exports.parseRegex = parseRegex;
}
