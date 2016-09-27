/*jslint node: true */
/*global describe, it */
'use strict';
var assert = require('assert');
var lexical = require('../js/lexical');

describe('Lexical', function () {
    describe('#regexToNfa', function () {
        it('Empty', function () {
            var actual = lexical.regexToNfa('ϵ'),
                nodes = [
                    {
                        'id': 0,
                        'type': 'start',
                        'edges': []
                    },
                    {
                        'id': 1,
                        'type': 'accept',
                        'edges': []
                    }
                ];
            nodes[0].edges.push(['ϵ', nodes[1]]);
            assert.deepEqual(nodes[0], actual);
        });

        it('Text', function () {
            var actual = lexical.regexToNfa('a'),
                nodes = [
                    {
                        'id': 0,
                        'type': 'start',
                        'edges': []
                    },
                    {
                        'id': 1,
                        'type': 'accept',
                        'edges': []
                    }
                ];
            nodes[0].edges.push(['a', nodes[1]]);
            assert.deepEqual(nodes[0], actual);
        });

        it('Cat 2', function () {
            var actual = lexical.regexToNfa('ab'),
                nodes = [
                    {
                        'id': 0,
                        'type': 'start',
                        'edges': []
                    },
                    {
                        'id': 1,
                        'type': '',
                        'edges': []
                    },
                    {
                        'id': 2,
                        'type': 'accept',
                        'edges': []
                    }
                ];
            nodes[0].edges.push(['a', nodes[1]]);
            nodes[1].edges.push(['b', nodes[2]]);
            assert.deepEqual(nodes[0], actual);
        });

        it('Cat 3', function () {
            var actual = lexical.regexToNfa('abc'),
                nodes = [
                    {
                        'id': 0,
                        'type': 'start',
                        'edges': []
                    },
                    {
                        'id': 1,
                        'type': '',
                        'edges': []
                    },
                    {
                        'id': 2,
                        'type': '',
                        'edges': []
                    },
                    {
                        'id': 3,
                        'type': 'accept',
                        'edges': []
                    }
                ];
            nodes[0].edges.push(['a', nodes[1]]);
            nodes[1].edges.push(['b', nodes[2]]);
            nodes[2].edges.push(['c', nodes[3]]);
            assert.deepEqual(nodes[0], actual);
        });

        it('Or', function () {
            var actual = lexical.regexToNfa('a|b'),
                nodes = [
                    {
                        'id': 0,
                        'type': 'start',
                        'edges': []
                    },
                    {
                        'id': 1,
                        'type': '',
                        'edges': []
                    },
                    {
                        'id': 2,
                        'type': '',
                        'edges': []
                    },
                    {
                        'id': 3,
                        'type': '',
                        'edges': []
                    },
                    {
                        'id': 4,
                        'type': '',
                        'edges': []
                    },
                    {
                        'id': 5,
                        'type': 'accept',
                        'edges': []
                    }
                ];
            nodes[0].edges.push(['ϵ', nodes[1]]);
            nodes[0].edges.push(['ϵ', nodes[3]]);
            nodes[1].edges.push(['a', nodes[2]]);
            nodes[3].edges.push(['b', nodes[4]]);
            nodes[2].edges.push(['ϵ', nodes[5]]);
            nodes[4].edges.push(['ϵ', nodes[5]]);
            assert.deepEqual(nodes[0], actual);
        });

        it('Star', function () {
            var actual = lexical.regexToNfa('a*'),
                nodes = [
                    {
                        'id': 0,
                        'type': 'start',
                        'edges': []
                    },
                    {
                        'id': 1,
                        'type': '',
                        'edges': []
                    },
                    {
                        'id': 2,
                        'type': '',
                        'edges': []
                    },
                    {
                        'id': 3,
                        'type': 'accept',
                        'edges': []
                    }
                ];
            nodes[0].edges.push(['ϵ', nodes[1]]);
            nodes[0].edges.push(['ϵ', nodes[3]]);
            nodes[1].edges.push(['a', nodes[2]]);
            nodes[2].edges.push(['ϵ', nodes[1]]);
            nodes[2].edges.push(['ϵ', nodes[3]]);
            assert.deepEqual(nodes[0], actual);
        });

        /*function toNodes(start) {
            var ids = {},
                front,
                node,
                nodes = [],
                queue = [start];
            for (front = 0; front < queue.length; front += 1) {
                node = queue[front];
                if (!ids.hasOwnProperty(node.id)) {
                    ids[node.id] = node;
                    node.edges.forEach(function (edge) {
                        queue.push(edge[1]);
                    });
                }
            }
            Object.keys(ids).forEach(function (key) {
                ids[key].edges = [];
                nodes.push(ids[key]);
            });
            console.log(nodes);
            return nodes;
        }

        function toEdges(start) {
            var ids = {},
                front,
                node,
                nodes = [],
                queue = [start];
            for (front = 0; front < queue.length; front += 1) {
                node = queue[front];
                if (!ids.hasOwnProperty(node.id)) {
                    ids[node.id] = node;
                    node.edges.forEach(function (edge) {
                        queue.push(edge[1]);
                    });
                }
            }
            Object.keys(ids).forEach(function (key) {
                ids[key].edges.forEach(function (edge) {
                    console.log('nodes[' + key + '].edges.push([\'' + edge[0] + '\', nodes[' + edge[1].id + ']]);');
                });
            });
            return nodes;
        }*/

        it('Example 3.7.3 (a)', function () {
            var actual = lexical.regexToNfa('(a|b)*'),
                nodes = [
                    {type: 'start', edges: [], id: 0},
                    {type: '', edges: [], id: 1},
                    {type: '', edges: [], id: 2},
                    {type: '', edges: [], id: 3},
                    {type: '', edges: [], id: 4},
                    {type: '', edges: [], id: 5},
                    {type: '', edges: [], id: 6},
                    {type: 'accept', edges: [], id: 7}
                ];
            nodes[0].edges.push(['ϵ', nodes[1]]);
            nodes[0].edges.push(['ϵ', nodes[7]]);
            nodes[1].edges.push(['ϵ', nodes[2]]);
            nodes[1].edges.push(['ϵ', nodes[4]]);
            nodes[2].edges.push(['a', nodes[3]]);
            nodes[3].edges.push(['ϵ', nodes[6]]);
            nodes[4].edges.push(['b', nodes[5]]);
            nodes[5].edges.push(['ϵ', nodes[6]]);
            nodes[6].edges.push(['ϵ', nodes[1]]);
            nodes[6].edges.push(['ϵ', nodes[7]]);
            assert.deepEqual(nodes[0], actual);
        });

        it('Example 3.7.3 (b)', function () {
            var actual = lexical.regexToNfa('(a*|b*)*'),
                nodes = [
                    {type: 'start', edges: [], id: 0},
                    {type: '', edges: [], id: 1},
                    {type: '', edges: [], id: 2},
                    {type: '', edges: [], id: 3},
                    {type: '', edges: [], id: 4},
                    {type: '', edges: [], id: 5},
                    {type: '', edges: [], id: 6},
                    {type: '', edges: [], id: 7},
                    {type: '', edges: [], id: 8},
                    {type: '', edges: [], id: 9},
                    {type: '', edges: [], id: 10},
                    {type: 'accept', edges: [], id: 11}
                ];
            nodes[0].edges.push(['ϵ', nodes[1]]);
            nodes[0].edges.push(['ϵ', nodes[11]]);
            nodes[1].edges.push(['ϵ', nodes[2]]);
            nodes[1].edges.push(['ϵ', nodes[6]]);
            nodes[2].edges.push(['ϵ', nodes[3]]);
            nodes[2].edges.push(['ϵ', nodes[5]]);
            nodes[3].edges.push(['a', nodes[4]]);
            nodes[4].edges.push(['ϵ', nodes[3]]);
            nodes[4].edges.push(['ϵ', nodes[5]]);
            nodes[5].edges.push(['ϵ', nodes[10]]);
            nodes[6].edges.push(['ϵ', nodes[7]]);
            nodes[6].edges.push(['ϵ', nodes[9]]);
            nodes[7].edges.push(['b', nodes[8]]);
            nodes[8].edges.push(['ϵ', nodes[7]]);
            nodes[8].edges.push(['ϵ', nodes[9]]);
            nodes[9].edges.push(['ϵ', nodes[10]]);
            nodes[10].edges.push(['ϵ', nodes[1]]);
            nodes[10].edges.push(['ϵ', nodes[11]]);
            assert.deepEqual(nodes[0], actual);
        });

        it('Example 3.7.3 (c)', function () {
            var actual = lexical.regexToNfa('((ϵ|a)b*)*'),
                nodes = [
                    {type: 'start', edges: [], id: 0},
                    {type: '', edges: [], id: 1},
                    {type: '', edges: [], id: 2},
                    {type: '', edges: [], id: 3},
                    {type: '', edges: [], id: 4},
                    {type: '', edges: [], id: 5},
                    {type: '', edges: [], id: 6},
                    {type: '', edges: [], id: 7},
                    {type: '', edges: [], id: 8},
                    {type: '', edges: [], id: 9},
                    {type: 'accept', edges: [], id: 10}
                ];
            nodes[0].edges.push(['ϵ', nodes[1]]);
            nodes[0].edges.push(['ϵ', nodes[10]]);
            nodes[1].edges.push(['ϵ', nodes[2]]);
            nodes[1].edges.push(['ϵ', nodes[4]]);
            nodes[2].edges.push(['ϵ', nodes[3]]);
            nodes[3].edges.push(['ϵ', nodes[6]]);
            nodes[4].edges.push(['a', nodes[5]]);
            nodes[5].edges.push(['ϵ', nodes[6]]);
            nodes[6].edges.push(['ϵ', nodes[7]]);
            nodes[6].edges.push(['ϵ', nodes[9]]);
            nodes[7].edges.push(['b', nodes[8]]);
            nodes[8].edges.push(['ϵ', nodes[7]]);
            nodes[8].edges.push(['ϵ', nodes[9]]);
            nodes[9].edges.push(['ϵ', nodes[1]]);
            nodes[9].edges.push(['ϵ', nodes[10]]);
            assert.deepEqual(nodes[0], actual);
        });

        it('Example 3.7.3 (d)', function () {
            var actual = lexical.regexToNfa('(a|b)*abb(a|b)*'),
                nodes = [
                    {type: 'start', edges: [], id: 0},
                    {type: '', edges: [], id: 1},
                    {type: '', edges: [], id: 2},
                    {type: '', edges: [], id: 3},
                    {type: '', edges: [], id: 4},
                    {type: '', edges: [], id: 5},
                    {type: '', edges: [], id: 6},
                    {type: '', edges: [], id: 7},
                    {type: '', edges: [], id: 8},
                    {type: '', edges: [], id: 9},
                    {type: '', edges: [], id: 10},
                    {type: '', edges: [], id: 11},
                    {type: '', edges: [], id: 12},
                    {type: '', edges: [], id: 13},
                    {type: '', edges: [], id: 14},
                    {type: '', edges: [], id: 15},
                    {type: '', edges: [], id: 16},
                    {type: 'accept', edges: [], id: 17}
                ];
            nodes[0].edges.push(['ϵ', nodes[1]]);
            nodes[0].edges.push(['ϵ', nodes[7]]);
            nodes[1].edges.push(['ϵ', nodes[2]]);
            nodes[1].edges.push(['ϵ', nodes[4]]);
            nodes[2].edges.push(['a', nodes[3]]);
            nodes[3].edges.push(['ϵ', nodes[6]]);
            nodes[4].edges.push(['b', nodes[5]]);
            nodes[5].edges.push(['ϵ', nodes[6]]);
            nodes[6].edges.push(['ϵ', nodes[1]]);
            nodes[6].edges.push(['ϵ', nodes[7]]);
            nodes[7].edges.push(['a', nodes[8]]);
            nodes[8].edges.push(['b', nodes[9]]);
            nodes[9].edges.push(['b', nodes[10]]);
            nodes[10].edges.push(['ϵ', nodes[11]]);
            nodes[10].edges.push(['ϵ', nodes[17]]);
            nodes[11].edges.push(['ϵ', nodes[12]]);
            nodes[11].edges.push(['ϵ', nodes[14]]);
            nodes[12].edges.push(['a', nodes[13]]);
            nodes[13].edges.push(['ϵ', nodes[16]]);
            nodes[14].edges.push(['b', nodes[15]]);
            nodes[15].edges.push(['ϵ', nodes[16]]);
            nodes[16].edges.push(['ϵ', nodes[11]]);
            nodes[16].edges.push(['ϵ', nodes[17]]);
            assert.deepEqual(nodes[0], actual);
        });

    });
});
