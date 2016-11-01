/*jslint node: true */
/*global describe, it */
'use strict';
var assert = require('assert');
var syntax = require('../js/syntax');

describe('Syntax', function () {
    describe('#LR(0) Automaton', function () {
        it('Example', function () {
            var grammar = syntax.parseGrammar(
                    "E -> E + T | T\n" +
                        "T -> T * F | F\n" +
                        "F -> ( E ) | id\n"
                ),
                actual = syntax.constructLR0Automaton(grammar),
                automaton = [
                    {
                        num: 0,
                        key: "E' -> . E",
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
                        reduces: {}
                    },
                    {
                        num: 1,
                        key: "E' -> E . | E -> E . + T",
                        accept: true,
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
                        reduces: {}
                    },
                    {
                        num: 2,
                        key: 'E -> T . | T -> T . * F',
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
                        reduces: {
                            "$": [
                                {
                                    "head": "E",
                                    "body": ["T"]
                                }
                            ],
                            ")": [
                                {
                                    "head": "E",
                                    "body": ["T"]
                                }
                            ],
                            "+": [
                                {
                                    "head": "E",
                                    "body": ["T"]
                                }
                            ]
                        }
                    },
                    {
                        num: 3,
                        key: 'T -> F .',
                        kernel: [
                            {
                                head: 'T',
                                body: ['F', '.']
                            }
                        ],
                        nonkernel: [],
                        reduces: {
                            "$": [
                                {
                                    "head": "T",
                                    "body": ["F"]
                                }
                            ],
                            ")": [
                                {
                                    "head": "T",
                                    "body": ["F"]
                                }
                            ],
                            "*": [
                                {
                                    "head": "T",
                                    "body": ["F"]
                                }
                            ],
                            "+": [
                                {
                                    "head": "T",
                                    "body": ["F"]
                                }
                            ]
                        }
                    },
                    {
                        num: 4,
                        key: 'F -> ( . E )',
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
                        reduces: {}
                    },
                    {
                        num: 5,
                        key: 'F -> id .',
                        kernel: [
                            {
                                head: 'F',
                                body: ['id', '.']
                            }
                        ],
                        nonkernel: [],
                        reduces: {
                            "$": [
                                {
                                    "head": "F",
                                    "body": ["id"]
                                }
                            ],
                            ")": [
                                {
                                    "head": "F",
                                    "body": ["id"]
                                }
                            ],
                            "*": [
                                {
                                    "head": "F",
                                    "body": ["id"]
                                }
                            ],
                            "+": [
                                {
                                    "head": "F",
                                    "body": ["id"]
                                }
                            ]
                        }
                    },
                    {
                        num: 6,
                        key: 'E -> E + . T',
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
                        reduces: {}
                    },
                    {
                        num: 7,
                        key: 'T -> T * . F',
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
                        reduces: {}
                    },
                    {
                        num: 8,
                        key: 'F -> ( E . ) | E -> E . + T',
                        kernel: [
                            {
                                head: 'F',
                                body: ['(', 'E', '.', ')']
                            },
                            {
                                head: 'E',
                                body: ['E', '.', '+', 'T']
                            }
                        ],
                        nonkernel: [],
                        reduces: {}
                    },
                    {
                        num: 9,
                        key: 'E -> E + T . | T -> T . * F',
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
                        reduces: {
                            "$": [
                                {
                                    "head": "E",
                                    "body": ["E", "+", "T"]
                                }
                            ],
                            ")": [
                                {
                                    "head": "E",
                                    "body": ["E", "+", "T"]
                                }
                            ],
                            "+": [
                                {
                                    "head": "E",
                                    "body": ["E", "+", "T"]
                                }
                            ]
                        }
                    },
                    {
                        num: 10,
                        key: 'T -> T * F .',
                        kernel: [
                            {
                                head: 'T',
                                body: ['T', '*', 'F', '.']
                            }
                        ],
                        nonkernel: [],
                        reduces: {
                            "$": [
                                {
                                    "head": "T",
                                    "body": ["T", "*", "F"]
                                }
                            ],
                            ")": [
                                {
                                    "head": "T",
                                    "body": ["T", "*", "F"]
                                }
                            ],
                            "*": [
                                {
                                    "head": "T",
                                    "body": ["T", "*", "F"]
                                }
                            ],
                            "+": [
                                {
                                    "head": "T",
                                    "body": ["T", "*", "F"]
                                }
                            ]
                        }
                    },
                    {
                        num: 11,
                        key: 'F -> ( E ) .',
                        kernel: [
                            {
                                head: 'F',
                                body: ['(', 'E', ')', '.']
                            }
                        ],
                        nonkernel: [],
                        reduces: {
                            "$": [
                                {
                                    "head": "F",
                                    "body": ["(", "E", ")"]
                                }
                            ],
                            ")": [
                                {
                                    "head": "F",
                                    "body": ["(", "E", ")"]
                                }
                            ],
                            "*": [
                                {
                                    "head": "F",
                                    "body": ["(", "E", ")"]
                                }
                            ],
                            "+": [
                                {
                                    "head": "F",
                                    "body": ["(", "E", ")"]
                                }
                            ]
                        }
                    }
                ];
            automaton[0].edges = {
                'E': automaton[1],
                'T': automaton[2],
                'F': automaton[3],
                '(': automaton[4],
                'id': automaton[5]
            };
            automaton[1].edges = {
                '+': automaton[6]
            };
            automaton[2].edges = {
                '*': automaton[7]
            };
            automaton[3].edges = {};
            automaton[4].edges = {
                '(': automaton[4],
                'E': automaton[8],
                'T': automaton[2],
                'F': automaton[3],
                'id': automaton[5]
            };
            automaton[5].edges = {};
            automaton[6].edges = {
                'T': automaton[9],
                'F': automaton[3],
                '(': automaton[4],
                'id': automaton[5]
            };
            automaton[7].edges = {
                'F': automaton[10],
                '(': automaton[4],
                'id': automaton[5]
            };
            automaton[8].edges = {
                '+': automaton[6],
                ')': automaton[11]
            };
            automaton[9].edges = {
                '*': automaton[7]
            };
            automaton[10].edges = {};
            automaton[11].edges = {};
            assert.deepEqual(automaton[0], actual);
        });

    });
});
