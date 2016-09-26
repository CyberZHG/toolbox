/*jslint node: true */
/*global describe, it */
'use strict';
var assert = require('assert');
var lexical = require('../js/lexical');

describe('Lexical', function () {
    describe('#parseRegex', function () {
        it('Empty', function () {
            var actual = lexical.parseRegex('ϵ'),
                expected = {
                    'begin': 0,
                    'end': 1,
                    'type': 'empty'
                };
            assert.deepEqual(expected, actual);
        });

        it('Text', function () {
            var actual = lexical.parseRegex('a'),
                expected = {
                    'begin': 0,
                    'end': 1,
                    'type': 'text',
                    'text': 'a'
                };
            assert.deepEqual(expected, actual);
        });

        it('Cat', function () {
            var actual = lexical.parseRegex('ab'),
                expected = {
                    'begin': 0,
                    'end': 2,
                    'type': 'cat',
                    'parts': [
                        {
                            'begin': 0,
                            'end': 1,
                            'type': 'text',
                            'text': 'a'
                        },
                        {
                            'begin': 1,
                            'end': 2,
                            'type': 'text',
                            'text': 'b'
                        }
                    ]
                };
            assert.deepEqual(expected, actual);
        });

        it('Or', function () {
            var actual = lexical.parseRegex('a|b'),
                expected = {
                    'begin': 0,
                    'end': 3,
                    'type': 'or',
                    'parts': [
                        {
                            'begin': 0,
                            'end': 1,
                            'type': 'text',
                            'text': 'a'
                        },
                        {
                            'begin': 2,
                            'end': 3,
                            'type': 'text',
                            'text': 'b'
                        }
                    ]
                };
            assert.deepEqual(expected, actual);
        });

        it('Brackets', function () {
            var actual = lexical.parseRegex('(a)'),
                expected = {
                    'begin': 0,
                    'end': 3,
                    'type': 'text',
                    'text': 'a'
                };
            assert.deepEqual(expected, actual);
        });

        it('Star', function () {
            var actual = lexical.parseRegex('a*'),
                expected = {
                    'begin': 0,
                    'end': 2,
                    'type': 'star',
                    'sub': {
                        'begin': 0,
                        'end': 1,
                        'type': 'text',
                        'text': 'a'
                    }
                };
            assert.deepEqual(expected, actual);
        });

        it('Example 3.7.3 (a)', function () {
            var actual = lexical.parseRegex('(a|b)*'),
                expected = {
                    'begin': 0,
                    'end': 6,
                    'type': 'star',
                    'sub': {
                        'begin': 0,
                        'end': 5,
                        'type': 'or',
                        'parts': [
                            {
                                'begin': 1,
                                'end': 2,
                                'type': 'text',
                                'text': 'a'
                            },
                            {
                                'begin': 3,
                                'end': 4,
                                'type': 'text',
                                'text': 'b'
                            }
                        ]
                    }
                };
            assert.deepEqual(expected, actual);
        });

        it('Example 3.7.3 (b)', function () {
            var actual = lexical.parseRegex('(a*|b*)*'),
                expected = {
                    'begin': 0,
                    'end': 8,
                    'type': 'star',
                    'sub': {
                        'begin': 0,
                        'end': 7,
                        'type': 'or',
                        'parts': [
                            {
                                'begin': 1,
                                'end': 3,
                                'type': 'star',
                                'sub': {
                                    'begin': 1,
                                    'end': 2,
                                    'type': 'text',
                                    'text': 'a'
                                }
                            },
                            {
                                'begin': 4,
                                'end': 6,
                                'type': 'star',
                                'sub': {
                                    'begin': 4,
                                    'end': 5,
                                    'type': 'text',
                                    'text': 'b'
                                }
                            }
                        ]
                    }
                };
            assert.deepEqual(expected, actual);
        });

        it('Example 3.7.3 (c)', function () {
            var actual = lexical.parseRegex('((ϵ|a)b*)*'),
                expected = {
                    'begin': 0,
                    'end': 10,
                    'type': 'star',
                    'sub': {
                        'begin': 0,
                        'end': 9,
                        'type': 'cat',
                        'parts': [
                            {
                                'begin': 1,
                                'end': 6,
                                'type': 'or',
                                'parts': [
                                    {
                                        'begin': 2,
                                        'end': 3,
                                        'type': 'empty'
                                    },
                                    {
                                        'begin': 4,
                                        'end': 5,
                                        'type': 'text',
                                        'text': 'a'
                                    }
                                ]
                            },
                            {
                                'begin': 6,
                                'end': 8,
                                'type': 'star',
                                'sub': {
                                    'begin': 6,
                                    'end': 7,
                                    'type': 'text',
                                    'text': 'b'
                                }
                            }
                        ]
                    }
                };
            assert.deepEqual(expected, actual);
        });

        it('Example 3.7.3 (d)', function () {
            var actual = lexical.parseRegex('(a|b)*abb(a|b)*'),
                expected = {
                    'begin': 0,
                    'end': 15,
                    'type': 'cat',
                    'parts': [
                        {
                            'begin': 0,
                            'end': 6,
                            'type': 'star',
                            'sub': {
                                'begin': 0,
                                'end': 5,
                                'type': 'or',
                                'parts': [
                                    {
                                        'begin': 1,
                                        'end': 2,
                                        'type': 'text',
                                        'text': 'a'
                                    },
                                    {
                                        'begin': 3,
                                        'end': 4,
                                        'type': 'text',
                                        'text': 'b'
                                    }
                                ]
                            }
                        },
                        {
                            'begin': 6,
                            'end': 7,
                            'type': 'text',
                            'text': 'a'
                        },
                        {
                            'begin': 7,
                            'end': 8,
                            'type': 'text',
                            'text': 'b'
                        },
                        {
                            'begin': 8,
                            'end': 9,
                            'type': 'text',
                            'text': 'b'
                        },
                        {
                            'begin': 9,
                            'end': 15,
                            'type': 'star',
                            'sub': {
                                'begin': 9,
                                'end': 14,
                                'type': 'or',
                                'parts': [
                                    {
                                        'begin': 10,
                                        'end': 11,
                                        'type': 'text',
                                        'text': 'a'
                                    },
                                    {
                                        'begin': 12,
                                        'end': 13,
                                        'type': 'text',
                                        'text': 'b'
                                    }
                                ]
                            }
                        }
                    ]
                };
            assert.deepEqual(expected, actual);
        });

    });
});
