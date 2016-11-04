/*jslint node: true */
/*global describe, it */
'use strict';
var assert = require('assert');
var syntax = require('../js/syntax');

describe('Syntax', function () {
    describe('#Closure LR(0)', function () {
        it('Example | I0', function () {
            var grammar = syntax.parseGrammar(
                    "E' -> E\n" +
                        "E -> E + T | T\n" +
                        "T -> T * F | F\n" +
                        "F -> ( E ) | id\n"
                ),
                items = [
                    {
                        head: 'E\'',
                        body: ['.', 'E']
                    }
                ],
                actual = syntax.calcClosure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'E\'',
                            body: ['.', 'E']
                        }
                    ],
                    nonkernel: [
                        {
                            head: 'E',
                            body: ['.', 'E', '+', 'T']
                        },
                        {
                            head: 'E',
                            body: ['.', 'T']
                        },
                        {
                            head: 'T',
                            body: ['.', 'T', '*', 'F']
                        },
                        {
                            head: 'T',
                            body: ['.', 'F']
                        },
                        {
                            head: 'F',
                            body: ['.', '(', 'E', ')']
                        },
                        {
                            head: 'F',
                            body: ['.', 'id']
                        }
                    ],
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I1', function () {
            var grammar = syntax.parseGrammar(
                    "E' -> E\n" +
                        "E -> E + T | T\n" +
                        "T -> T * F | F\n" +
                        "F -> ( E ) | id\n"
                ),
                items = [
                    {
                        head: 'E\'',
                        body: ['E', '.']
                    },
                    {
                        head: 'E',
                        body: ['E', '.', '+', 'T']
                    }
                ],
                actual = syntax.calcClosure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'E\'',
                            body: ['E', '.']
                        },
                        {
                            head: 'E',
                            body: ['E', '.', '+', 'T']
                        }
                    ],
                    nonkernel: [],
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I2', function () {
            var grammar = syntax.parseGrammar(
                    "E' -> E\n" +
                        "E -> E + T | T\n" +
                        "T -> T * F | F\n" +
                        "F -> ( E ) | id\n"
                ),
                items = [
                    {
                        head: 'E',
                        body: ['T', '.']
                    },
                    {
                        head: 'T',
                        body: ['T', '.', '*', 'F']
                    }
                ],
                actual = syntax.calcClosure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'E',
                            body: ['T', '.']
                        },
                        {
                            head: 'T',
                            body: ['T', '.', '*', 'F']
                        }
                    ],
                    nonkernel: [],
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I3', function () {
            var grammar = syntax.parseGrammar(
                    "E' -> E\n" +
                        "E -> E + T | T\n" +
                        "T -> T * F | F\n" +
                        "F -> ( E ) | id\n"
                ),
                items = [
                    {
                        head: 'T',
                        body: ['F', '.']
                    }
                ],
                actual = syntax.calcClosure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'T',
                            body: ['F', '.']
                        }
                    ],
                    nonkernel: [],
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I4', function () {
            var grammar = syntax.parseGrammar(
                    "E' -> E\n" +
                        "E -> E + T | T\n" +
                        "T -> T * F | F\n" +
                        "F -> ( E ) | id\n"
                ),
                items = [
                    {
                        head: 'F',
                        body: ['(', '.', 'E', ')']
                    }
                ],
                actual = syntax.calcClosure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'F',
                            body: ['(', '.', 'E', ')']
                        }
                    ],
                    nonkernel: [
                        {
                            head: 'E',
                            body: ['.', 'E', '+', 'T']
                        },
                        {
                            head: 'E',
                            body: ['.', 'T']
                        },
                        {
                            head: 'T',
                            body: ['.', 'T', '*', 'F']
                        },
                        {
                            head: 'T',
                            body: ['.', 'F']
                        },
                        {
                            head: 'F',
                            body: ['.', '(', 'E', ')']
                        },
                        {
                            head: 'F',
                            body: ['.', 'id']
                        }
                    ],
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I5', function () {
            var grammar = syntax.parseGrammar(
                    "E' -> E\n" +
                        "E -> E + T | T\n" +
                        "T -> T * F | F\n" +
                        "F -> ( E ) | id\n"
                ),
                items = [
                    {
                        head: 'F',
                        body: ['id', '.']
                    }
                ],
                actual = syntax.calcClosure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'F',
                            body: ['id', '.']
                        }
                    ],
                    nonkernel: [],
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I6', function () {
            var grammar = syntax.parseGrammar(
                    "E' -> E\n" +
                        "E -> E + T | T\n" +
                        "T -> T * F | F\n" +
                        "F -> ( E ) | id\n"
                ),
                items = [
                    {
                        head: 'E',
                        body: ['E', '+', '.', 'T']
                    }
                ],
                actual = syntax.calcClosure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'E',
                            body: ['E', '+', '.', 'T']
                        }
                    ],
                    nonkernel: [
                        {
                            head: 'T',
                            body: ['.', 'T', '*', 'F']
                        },
                        {
                            head: 'T',
                            body: ['.', 'F']
                        },
                        {
                            head: 'F',
                            body: ['.', '(', 'E', ')']
                        },
                        {
                            head: 'F',
                            body: ['.', 'id']
                        }
                    ],
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I7', function () {
            var grammar = syntax.parseGrammar(
                    "E' -> E\n" +
                        "E -> E + T | T\n" +
                        "T -> T * F | F\n" +
                        "F -> ( E ) | id\n"
                ),
                items = [
                    {
                        head: 'T',
                        body: ['T', '*', '.', 'F']
                    }
                ],
                actual = syntax.calcClosure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'T',
                            body: ['T', '*', '.', 'F']
                        }
                    ],
                    nonkernel: [
                        {
                            head: 'F',
                            body: ['.', '(', 'E', ')']
                        },
                        {
                            head: 'F',
                            body: ['.', 'id']
                        }
                    ],
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I8', function () {
            var grammar = syntax.parseGrammar(
                    "E' -> E\n" +
                        "E -> E + T | T\n" +
                        "T -> T * F | F\n" +
                        "F -> ( E ) | id\n"
                ),
                items = [
                    {
                        head: 'E',
                        body: ['E', '.', '+', 'T']
                    },
                    {
                        head: 'F',
                        body: ['(', 'E', '.', ')']
                    }
                ],
                actual = syntax.calcClosure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'E',
                            body: ['E', '.', '+', 'T']
                        },
                        {
                            head: 'F',
                            body: ['(', 'E', '.', ')']
                        }
                    ],
                    nonkernel: [],
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I9', function () {
            var grammar = syntax.parseGrammar(
                    "E' -> E\n" +
                        "E -> E + T | T\n" +
                        "T -> T * F | F\n" +
                        "F -> ( E ) | id\n"
                ),
                items = [
                    {
                        head: 'E',
                        body: ['E', '+', 'T', '.']
                    },
                    {
                        head: 'T',
                        body: ['T', '.', '*', 'F']
                    }
                ],
                actual = syntax.calcClosure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'E',
                            body: ['E', '+', 'T', '.']
                        },
                        {
                            head: 'T',
                            body: ['T', '.', '*', 'F']
                        }
                    ],
                    nonkernel: [],
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I10', function () {
            var grammar = syntax.parseGrammar(
                    "E' -> E\n" +
                        "E -> E + T | T\n" +
                        "T -> T * F | F\n" +
                        "F -> ( E ) | id\n"
                ),
                items = [
                    {
                        head: 'T',
                        body: ['T', '*', 'F', '.']
                    }
                ],
                actual = syntax.calcClosure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'T',
                            body: ['T', '*', 'F', '.']
                        }
                    ],
                    nonkernel: [],
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

        it('Example | I11', function () {
            var grammar = syntax.parseGrammar(
                    "E' -> E\n" +
                        "E -> E + T | T\n" +
                        "T -> T * F | F\n" +
                        "F -> ( E ) | id\n"
                ),
                items = [
                    {
                        head: 'F',
                        body: ['(', 'E', ')', '.']
                    }
                ],
                actual = syntax.calcClosure(grammar, items),
                expect = {
                    kernel: [
                        {
                            head: 'F',
                            body: ['(', 'E', ')', '.']
                        }
                    ],
                    nonkernel: [],
                };
            assert.deepEqual(expect.kernel, actual.kernel);
            assert.deepEqual(expect.nonkernel, actual.nonkernel);
        });

    });
});
