/*jslint node: true */
/*global describe, it */
'use strict';
var assert = require('assert');
var syntax = require('../js/syntax');

describe('Syntax', function () {
    describe('#first&follow', function () {
        it('Grammar 4.28', function () {
            var grammar = syntax.parseGrammar(
                    "E -> T E'\n" +
                        "T -> F T'\n" +
                        "E' -> + T E' | ϵ\n" +
                        "T' -> * F T' | ϵ\n" +
                        "F -> ( E ) | id\n"
                ),
                keys = Object.keys(grammar),
                nullables = syntax.calcNullables(grammar),
                firsts = syntax.calcFirsts(grammar, nullables),
                follows = syntax.calcFollows(grammar, nullables, firsts),
                expectFirsts = {
                    E: ['(', 'id'],
                    T: ['(', 'id'],
                    F: ['(', 'id'],
                    'E\'': ['+', 'ϵ'],
                    'T\'': ['*', 'ϵ']
                },
                expectFollows = {
                    E: ['$', ')'],
                    'E\'': ['$', ')'],
                    T: ['$', ')', '+'],
                    'T\'': ['$', ')', '+'],
                    F: ['$', ')', '*', '+']
                };
            keys.forEach(function (key) {
                assert.deepEqual(expectFirsts[key], firsts[key]);
            });
            assert.deepEqual(expectFollows, follows);
        });

        it('#11', function () {
            var grammar = syntax.parseGrammar(
                    "S -> A B C D\n" +
                        "A -> b | ϵ\n" +
                        "B -> c\n" +
                        "C -> d\n" +
                        "D -> e\n"
                ),
                keys = Object.keys(grammar),
                nullables = syntax.calcNullables(grammar),
                firsts = syntax.calcFirsts(grammar, nullables),
                follows = syntax.calcFollows(grammar, nullables, firsts),
                expectFirsts = {
                    S: ['b', 'c'],
                    A: ['b', 'ϵ'],
                    B: ['c'],
                    C: ['d'],
                    D: ['e']
                },
                expectFollows = {
                    S: ['$'],
                    A: ['c'],
                    B: ['d'],
                    C: ['e'],
                    D: ['$']
                };
            keys.forEach(function (key) {
                assert.deepEqual(expectFirsts[key], firsts[key]);
            });
            assert.deepEqual(expectFollows, follows);
        });

    });
});
