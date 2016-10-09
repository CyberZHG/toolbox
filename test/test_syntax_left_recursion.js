/*jslint node: true */
/*global describe, it */
'use strict';
var assert = require('assert');
var syntax = require('../js/syntax');

describe('Syntax', function () {
    describe('#eliminateLeftRecursion', function () {
        it('Example', function () {
            var actual = syntax.eliminateLeftRecursion(syntax.parseGrammar('S -> A a | b  A -> A c | S d | ϵ')),
                expected = {
                    S: [
                        ['A', 'a'],
                        ['b']
                    ],
                    A: [
                        ['b', 'd', "A'"],
                        ["A'"]
                    ],
                    "A'": [
                        ['c', "A'"],
                        ['a', 'd', "A'"],
                        ['ϵ']
                    ]
                };
            assert.deepEqual(expected, actual);
        });

        it('Example 4.2.1', function () {
            var actual = syntax.eliminateLeftRecursion(syntax.parseGrammar('S -> S S + | S S * | a')),
                expected = {
                    S: [
                        ['a', 'S\'']
                    ],
                    'S\'': [
                        ['S', '+', 'S\''],
                        ['S', '*', 'S\''],
                        ['ϵ']
                    ]
                };
            assert.deepEqual(expected, actual);
        });

        it('Example 4.2.2 (a)', function () {
            var actual = syntax.eliminateLeftRecursion(syntax.parseGrammar('S -> 0 S 1 | 0 1')),
                expected = {
                    S: [
                        ['0', 'S', '1'],
                        ['0', '1']
                    ]
                };
            assert.deepEqual(expected, actual);
        });

        it('Example 4.2.2 (b)', function () {
            var actual = syntax.eliminateLeftRecursion(syntax.parseGrammar('S -> + S S | * S S | a')),
                expected = {
                    S: [
                        ['+', 'S', 'S'],
                        ['*', 'S', 'S'],
                        ['a']
                    ]
                };
            assert.deepEqual(expected, actual);
        });

        it('Example 4.2.2 (c)', function () {
            var actual = syntax.eliminateLeftRecursion(syntax.parseGrammar('S -> S ( S ) S | ϵ')),
                expected = {
                    S: [
                        ['S\'']
                    ],
                    'S\'': [
                        ['(', 'S', ')', 'S', 'S\''],
                        ['ϵ']
                    ]
                };
            assert.deepEqual(expected, actual);
        });

        it('Example 4.2.2 (d)', function () {
            var actual = syntax.eliminateLeftRecursion(syntax.parseGrammar('S -> S + S | S S | ( S ) | S * | a')),
                expected = {
                    S: [
                        ['(', 'S', ')', 'S\''],
                        ['a', 'S\'']
                    ],
                    'S\'': [
                        ['+', 'S', 'S\''],
                        ['S', 'S\''],
                        ['*', 'S\''],
                        ['ϵ']
                    ]
                };
            assert.deepEqual(expected, actual);
        });

        it('Example 4.2.2 (e)', function () {
            var actual = syntax.eliminateLeftRecursion(syntax.parseGrammar('S -> ( L ) | a L -> L , S | S')),
                expected = {
                    S: [
                        ['(', 'L', ')'],
                        ['a']
                    ],
                    L: [
                        ['(', 'L', ')', 'L\''],
                        ['a', 'L\'']
                    ],
                    'L\'': [
                        [',', 'S', 'L\''],
                        ['ϵ']
                    ]
                };
            assert.deepEqual(expected, actual);
        });

        it('Example 4.2.2 (f)', function () {
            var actual = syntax.eliminateLeftRecursion(syntax.parseGrammar('S -> a S b S | b S a S | ϵ')),
                expected = {
                    S: [
                        ['a', 'S', 'b', 'S'],
                        ['b', 'S', 'a', 'S'],
                        ['ϵ']
                    ]
                };
            assert.deepEqual(expected, actual);
        });

        it('Example 4.2.2 (g)', function () {
            var actual = syntax.eliminateLeftRecursion(syntax.parseGrammar(
                    'bexpr -> bexpr or bterm | bterm\n' +
                        'bterm -> bterm and bfactor | bfactor\n' +
                        'bfactor -> not bfactor | ( bexpr ) | true | false'
                )),
                expected = {
                    bexpr: [
                        ['bterm', 'bexpr\'']
                    ],
                    bterm: [
                        ['bfactor', 'bterm\'']
                    ],
                    bfactor: [
                        ['not', 'bfactor'],
                        ['(', 'bexpr', ')'],
                        ['true'],
                        ['false']
                    ],
                    'bexpr\'': [
                        ['or', 'bterm', 'bexpr\''],
                        ['ϵ']
                    ],
                    'bterm\'': [
                        ['and', 'bfactor', 'bterm\''], ['ϵ']
                    ]
                };
            assert.deepEqual(expected, actual);
        });

    });
});
