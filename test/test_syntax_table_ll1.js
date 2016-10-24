/*jslint node: true */
/*global describe, it */
'use strict';
var assert = require('assert');
var syntax = require('../js/syntax');

describe('Syntax', function () {
    describe('#LL(1) Parsing Table', function () {
        it('Example', function () {
            var grammar = syntax.parseGrammar(
                    "E -> T E'\n" +
                        "T -> F T'\n" +
                        "E' -> + T E' | ϵ\n" +
                        "T' -> * F T' | ϵ\n" +
                        "F -> ( E ) | id\n"
                ),
                actual = syntax.constructLL1ParsingTable(grammar),
                expect = {
                    'E': {
                        '(': [
                            ['T', 'E\'']
                        ],
                        'id': [
                            ['T', 'E\'']
                        ]
                    },
                    'E\'': {
                        '$': [
                            ['ϵ']
                        ],
                        ')': [
                            ['ϵ']
                        ],
                        '+': [
                            ['+', 'T', 'E\'']
                        ]
                    },
                    'F': {
                        '(': [
                            ['(', 'E', ')']
                        ],
                        'id': [
                            ['id']
                        ]
                    },
                    'T': {
                        '(': [
                            ['F', 'T\'']
                        ],
                        'id': [
                            ['F', 'T\'']
                        ],
                    },
                    'T\'': {
                        '$': [
                            ['ϵ']
                        ],
                        ')': [
                            ['ϵ']
                        ],
                        '*': [
                            ['*', 'F', 'T\'']
                        ],
                        '+': [
                            ['ϵ']
                        ],
                    }
                };
            assert.deepEqual(expect, actual);
        });

        it('Example', function () {
            var grammar = syntax.parseGrammar(
                    "S -> i E t S S' | a\n" +
                        "S' -> e S | ϵ\n" +
                        "E -> b\n"
                ),
                actual = syntax.constructLL1ParsingTable(grammar),
                expect = {
                    'E': {
                        'b': [
                            ['b']
                        ]
                    },
                    'S': {
                        'a': [
                            ['a']
                        ],
                        'i': [
                            ['i', 'E', 't', 'S', 'S\'']
                        ]
                    },
                    'S\'': {
                        '$': [
                            ['ϵ']
                        ],
                        'e': [
                            ['e', 'S'],
                            ['ϵ']
                        ]
                    }
                };
            assert.deepEqual(expect, actual);
        });

    });
});
