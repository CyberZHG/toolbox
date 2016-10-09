/*jslint node: true */
/*global describe, it */
'use strict';
var assert = require('assert');
var syntax = require('../js/syntax');

describe('Syntax', function () {
    describe('#leftFactoring', function () {
        it('Example', function () {
            var actual = syntax.leftFactoring(syntax.parseGrammar('S -> i E t S | i E t S e S | a  E -> b')),
                expected = {
                    S: [
                        ['i', 'E', 't', 'S', 'S\''],
                        [ 'a' ]
                    ],
                    E: [
                        ['b']
                    ],
                    'S\'': [
                        ['ϵ'],
                        ['e', 'S']
                    ]
                };
            assert.deepEqual(expected, actual);
        });

        it('Example 4.2.1', function () {
            var actual = syntax.leftFactoring(syntax.parseGrammar('S -> S S + | S S * | a')),
                expected = {
                    S: [
                        ['S', 'S', 'S\''],
                        ['a']
                    ],
                    'S\'': [
                        ['+'],
                        ['*']
                    ]
                };
            assert.deepEqual(expected, actual);
        });

        it('Example 4.2.2 (a)', function () {
            var actual = syntax.leftFactoring(syntax.parseGrammar('S -> 0 S 1 | 0 1')),
                expected = {
                    S: [
                        ['0', 'S\'']
                    ],
                    'S\'': [
                        ['S', '1'],
                        ['1']
                    ]
                };
            assert.deepEqual(expected, actual);
        });

        it('Example 4.2.2 (b)', function () {
            var actual = syntax.leftFactoring(syntax.parseGrammar('S -> + S S | * S S | a')),
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
            var actual = syntax.leftFactoring(syntax.parseGrammar('S -> S ( S ) S | ϵ')),
                expected = {
                    S: [
                        ['S', '(', 'S', ')', 'S'],
                        ['ϵ']
                    ]
                };
            assert.deepEqual(expected, actual);
        });

        it('Example 4.2.2 (d)', function () {
            var actual = syntax.leftFactoring(syntax.parseGrammar('S -> S + S | S S | ( S ) | S * | a')),
                expected =  {
                    S: [
                        ['S', 'S\''],
                        ['(', 'S', ')'],
                        ['a']
                    ],
                    'S\'': [
                        ['+', 'S'],
                        ['S'],
                        ['*']
                    ]
                };
            assert.deepEqual(expected, actual);
        });

        it('Example 4.2.2 (e)', function () {
            var actual = syntax.leftFactoring(syntax.parseGrammar('S -> ( L ) | a L -> L , S | S')),
                expected = {
                    S: [
                        ['(', 'L', ')'],
                        ['a']
                    ],
                    L: [
                        ['L', ',', 'S'],
                        ['S']
                    ]
                };
            assert.deepEqual(expected, actual);
        });

        it('Example 4.2.2 (f)', function () {
            var actual = syntax.leftFactoring(syntax.parseGrammar('S -> a S b S | b S a S | ϵ')),
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
            var actual = syntax.leftFactoring(syntax.parseGrammar(
                    'bexpr -> bexpr or bterm | bterm\n' +
                        'bterm -> bterm and bfactor | bfactor\n' +
                        'bfactor -> not bfactor | ( bexpr ) | true | false'
                )),
                expected = {
                    bexpr: [
                        ['bexpr', 'or', 'bterm'],
                        ['bterm']
                    ],
                    bterm: [
                        ['bterm', 'and', 'bfactor'],
                        ['bfactor']
                    ],
                    bfactor: [
                        ['not', 'bfactor'],
                        ['(', 'bexpr', ')'],
                        ['true'],
                        ['false']
                    ]
                };
            assert.deepEqual(expected, actual);
        });

    });
});
