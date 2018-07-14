/*jslint node: true */
/*global describe, it */
'use strict';
var assert = require('assert');
var lexical = require('../js/lexical');

describe('Lexical', function () {
    describe('#minDfa', function () {
        it('ϵ', function () {
            var nfa = lexical.regexToNfa('ϵ'),
                dfa = lexical.nfaToDfa(nfa),
                minDfa = lexical.minDfa(dfa);
            assert.equal(minDfa.key, 'A');
            assert.equal(minDfa.edges.length, 0);
        });

        it('(a|b)*', function () {
            var nfa = lexical.regexToNfa('(a|b)*'),
                dfa = lexical.nfaToDfa(nfa),
                minDfa = lexical.minDfa(dfa);
            assert.equal(minDfa.key, 'A,B,C');
            assert.equal(minDfa.edges.length, 1);
            assert.equal(minDfa.trans['a,b'].key, 'A,B,C');
        });

        it('(a|b)+', function () {
            var nfa = lexical.regexToNfa('(a|b)+'),
                dfa = lexical.nfaToDfa(nfa),
                minDfa = lexical.minDfa(dfa);
            assert.equal(minDfa.key, 'A');
            assert.equal(minDfa.edges.length, 1);
            assert.equal(minDfa.trans['a,b'].key, 'B,C,D,E');
            assert.equal(minDfa.trans['a,b'].edges.length, 1);
            assert.equal(minDfa.trans['a,b'].trans['a,b'].key, 'B,C,D,E');
        });

        it('a(b|c)*', function () {
            var nfa = lexical.regexToNfa('a(b|c)*'),
                dfa = lexical.nfaToDfa(nfa),
                minDfa = lexical.minDfa(dfa);
            assert.equal(minDfa.key, 'A');
            assert.equal(minDfa.edges.length, 1);
            assert.equal(minDfa.trans.a.key, 'B,C,D');
            assert.equal(minDfa.trans.a.edges.length, 1);
            assert.equal(minDfa.trans.a.trans['b,c'].key, 'B,C,D');
        });

        it('(a|b)*(c|d)*', function () {
            var nfa = lexical.regexToNfa('(a|b)*(c|d)*'),
                dfa = lexical.nfaToDfa(nfa),
                minDfa = lexical.minDfa(dfa);
            assert.equal(minDfa.key, 'A,B,C');
            assert.equal(minDfa.edges.length, 2);
            assert.equal(minDfa.trans['a,b'].key, 'A,B,C');
            assert.equal(minDfa.trans['c,d'].key, 'D,E');
            assert.equal(minDfa.trans['c,d'].edges.length, 1);
            assert.equal(minDfa.trans['c,d'].trans['c,d'].key, 'D,E');
        });

        it('ab|b', function () {
            var nfa = lexical.regexToNfa('ab|b'),
                dfa = lexical.nfaToDfa(nfa),
                minDfa = lexical.minDfa(dfa);
            assert.equal(minDfa.key, 'A');
            assert.equal(minDfa.edges.length, 2);
            assert.equal(minDfa.trans.a.key, 'B');
            assert.equal(minDfa.trans.b.key, 'C,D');
            assert.equal(minDfa.trans.a.edges.length, 1);
            assert.equal(minDfa.trans.a.trans.b.key, 'C,D');
        });

    });
});
