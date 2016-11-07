/*jslint node: true */
/*global describe, it */
'use strict';
var assert = require('assert');
var syntax = require('../js/syntax');

describe('Syntax', function () {
    describe('#LALR Automaton', function () {
        it('Example', function () {
            var grammar = syntax.parseGrammar(
                    "S -> C C\n" +
                        "C -> c C | d\n"
                ),
                actual = syntax.constructLALRAutomaton(grammar),
                automaton = [
                    {
                        num: 0,
                        key: "S' -> . S",
                        kernel: [
                            {
                                head: 'S\'',
                                body: ['.', 'S'],
                                lookahead: ['$']
                            }
                        ],
                        nonkernel: [
                            {
                                head: 'S',
                                body: ['.', 'C', 'C'],
                                lookahead: ['$']
                            },
                            {
                                head: 'C',
                                body: ['.', 'c', 'C'],
                                lookahead: ['c', 'd']
                            },
                            {
                                head: 'C',
                                body: ['.', 'd'],
                                lookahead: ['c', 'd']
                            }
                        ],
                        reduces: {}
                    },
                    {
                        num: 1,
                        key: "S' -> S .",
                        accept: true,
                        kernel: [
                            {
                                head: 'S\'',
                                body: ['S', '.'],
                                lookahead: ['$']
                            }
                        ],
                        nonkernel: [],
                        reduces: {}
                    },
                    {
                        num: 2,
                        key: 'S -> C . C',
                        kernel: [
                            {
                                head: 'S',
                                body: ['C', '.', 'C'],
                                lookahead: ['$']
                            }
                        ],
                        nonkernel: [
                            {
                                head: 'C',
                                body: ['.', 'c', 'C'],
                                lookahead: ['$']
                            },
                            {
                                head: 'C',
                                body: ['.', 'd'],
                                lookahead: ['$']
                            }
                        ],
                        reduces: {}
                    },
                    {
                        num: 3,
                        key: 'C -> c . C',
                        kernel: [
                            {
                                head: 'C',
                                body: ['c', '.', 'C'],
                                lookahead: ['$', 'c', 'd']
                            }
                        ],
                        nonkernel: [
                            {
                                head: 'C',
                                body: ['.', 'c', 'C'],
                                lookahead: ['$', 'c', 'd']
                            },
                            {
                                head: 'C',
                                body: ['.', 'd'],
                                lookahead: ['$', 'c', 'd']
                            }
                        ],
                        reduces: {}
                    },
                    {
                        num: 4,
                        key: 'C -> d .',
                        kernel: [
                            {
                                head: 'C',
                                body: ['d', '.'],
                                lookahead: ['$', 'c', 'd']
                            }
                        ],
                        nonkernel: [],
                        reduces: {
                            '$': [{
                                head: 'C',
                                body: ['d']
                            }],
                            'c': [{
                                head: 'C',
                                body: ['d']
                            }],
                            'd': [{
                                head: 'C',
                                body: ['d']
                            }]
                        }
                    },
                    {
                        num: 5,
                        key: 'S -> C C .',
                        kernel: [
                            {
                                head: 'S',
                                body: ['C', 'C', '.'],
                                lookahead: ['$']
                            }
                        ],
                        nonkernel: [],
                        reduces: {
                            '$': [{
                                head: 'S',
                                body: ['C', 'C']
                            }]
                        }
                    },
                    {
                        num: 6,
                        key: 'C -> c C .',
                        kernel: [
                            {
                                head: 'C',
                                body: ['c', 'C', '.'],
                                lookahead: ['$', 'c', 'd']
                            }
                        ],
                        nonkernel: [],
                        reduces: {
                            '$': [{
                                head: 'C',
                                body: ['c', 'C']
                            }],
                            'c': [{
                                head: 'C',
                                body: ['c', 'C']
                            }],
                            'd': [{
                                head: 'C',
                                body: ['c', 'C']
                            }]
                        }
                    },
                ];
            automaton[0].edges = {
                'S': automaton[1],
                'C': automaton[2],
                'c': automaton[3],
                'd': automaton[4]
            };
            automaton[1].edges = {};
            automaton[2].edges = {
                'C': automaton[5],
                'c': automaton[3],
                'd': automaton[4],
            };
            automaton[3].edges = {
                'C': automaton[6],
                'c': automaton[3],
                'd': automaton[4]
            };
            automaton[4].edges = {};
            automaton[5].edges = {};
            automaton[6].edges = {};
            assert.deepEqual(automaton[0], actual);
        });

    });
});
