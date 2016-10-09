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

if (typeof require === 'function') {
    exports.parseGrammar = parseGrammar;
}
