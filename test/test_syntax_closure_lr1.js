/*jslint node: true */
/*global describe, it */
'use strict';
var assert = require('assert');
var syntax = require('../js/syntax');

describe('Syntax', function () {
    describe('#Closure LR(1)', function () {
        it('Example | I0', function () {
            var grammar = syntax.parseGrammar(
                    "S' -> S\n" +
                        "S -> C C\n" +
                        "C -> c C | d\n"
                ),
                items = [
                    {
                        head: 'S\'',
                        body: ['.', 'S'],
                        lookahead: ['$']
                    }
                ],
                actual = syntax.calcLR1Closure(grammar, items),
                expect = {
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
                    ]
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I1', function () {
            var grammar = syntax.parseGrammar(
                    "S' -> S\n" +
                        "S -> C C\n" +
                        "C -> c C | d\n"
                ),
                items = [
                    {
                        head: 'S\'',
                        body: ['S', '.'],
                        lookahead: ['$']
                    }
                ],
                actual = syntax.calcLR1Closure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'S\'',
                            body: ['S', '.'],
                            lookahead: ['$']
                        }
                    ],
                    nonkernel: [],
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I2', function () {
            var grammar = syntax.parseGrammar(
                    "S' -> S\n" +
                        "S -> C C\n" +
                        "C -> c C | d\n"
                ),
                items = [
                    {
                        head: 'S',
                        body: ['C', '.', 'C'],
                        lookahead: ['$']
                    }
                ],
                actual = syntax.calcLR1Closure(grammar, items),
                expect = {
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
                    ]
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I3', function () {
            var grammar = syntax.parseGrammar(
                    "S' -> S\n" +
                        "S -> C C\n" +
                        "C -> c C | d\n"
                ),
                items = [
                    {
                        head: 'C',
                        body: ['c', '.', 'C'],
                        lookahead: ['c', 'd']
                    }
                ],
                actual = syntax.calcLR1Closure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'C',
                            body: ['c', '.', 'C'],
                            lookahead: ['c', 'd']
                        }
                    ],
                    nonkernel: [
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
                    ]
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I4', function () {
            var grammar = syntax.parseGrammar(
                    "S' -> S\n" +
                        "S -> C C\n" +
                        "C -> c C | d\n"
                ),
                items = [
                    {
                        head: 'C',
                        body: ['d', '.'],
                        lookahead: ['c', 'd']
                    }
                ],
                actual = syntax.calcLR1Closure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'C',
                            body: ['d', '.'],
                            lookahead: ['c', 'd']
                        }
                    ],
                    nonkernel: []
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I5', function () {
            var grammar = syntax.parseGrammar(
                    "S' -> S\n" +
                        "S -> C C\n" +
                        "C -> c C | d\n"
                ),
                items = [
                    {
                        head: 'S',
                        body: ['C', 'C', '.'],
                        lookahead: ['$']
                    }
                ],
                actual = syntax.calcLR1Closure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'S',
                            body: ['C', 'C', '.'],
                            lookahead: ['$']
                        }
                    ],
                    nonkernel: []
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I6', function () {
            var grammar = syntax.parseGrammar(
                    "S' -> S\n" +
                        "S -> C C\n" +
                        "C -> c C | d\n"
                ),
                items = [
                    {
                        head: 'C',
                        body: ['c', '.', 'C'],
                        lookahead: ['$']
                    }
                ],
                actual = syntax.calcLR1Closure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'C',
                            body: ['c', '.', 'C'],
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
                    ]
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I7', function () {
            var grammar = syntax.parseGrammar(
                    "S' -> S\n" +
                        "S -> C C\n" +
                        "C -> c C | d\n"
                ),
                items = [
                    {
                        head: 'C',
                        body: ['d', '.'],
                        lookahead: ['$']
                    }
                ],
                actual = syntax.calcLR1Closure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'C',
                            body: ['d', '.'],
                            lookahead: ['$']
                        }
                    ],
                    nonkernel: []
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I8', function () {
            var grammar = syntax.parseGrammar(
                    "S' -> S\n" +
                        "S -> C C\n" +
                        "C -> c C | d\n"
                ),
                items = [
                    {
                        head: 'C',
                        body: ['c', 'C', '.'],
                        lookahead: ['c', 'd']
                    }
                ],
                actual = syntax.calcLR1Closure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'C',
                            body: ['c', 'C', '.'],
                            lookahead: ['c', 'd']
                        }
                    ],
                    nonkernel: []
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I9', function () {
            var grammar = syntax.parseGrammar(
                    "S' -> S\n" +
                        "S -> C C\n" +
                        "C -> c C | d\n"
                ),
                items = [
                    {
                        head: 'C',
                        body: ['c', 'C', '.'],
                        lookahead: ['$']
                    }
                ],
                actual = syntax.calcLR1Closure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'C',
                            body: ['c', 'C', '.'],
                            lookahead: ['$']
                        }
                    ],
                    nonkernel: []
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

    });
});
