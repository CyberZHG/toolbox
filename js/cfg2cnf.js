/*jslint browser: true*/
/*global window, parseGrammar, leftFactoring, eliminateLeftRecursion, toPretty, $*/

$(document).ready(function () {
    'use strict';

    function b64EncodeUnicode(str) {
        return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            match = match.prototype; // For jslint.
            return String.fromCharCode('0x' + p1);
        }));
    }

    function b64DecodeUnicode(str) {
        return decodeURIComponent(Array.prototype.map.call(window.atob(str.replace(' ', '+')), function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    function arrayEqual(a, b) {
        var idx;
        if (a.length !== b.length) {
            return false;
        }
        for (idx = 0; idx < a.length; idx += 1) {
            if (a[idx] !== b[idx]) {
                return false;
            }
        }
        return true;
    }

    function addNewGeneration(grammar, key, newGeneration) {
        var idx;
        for (idx = 0; idx < grammar[key].length; idx += 1) {
            if (arrayEqual(newGeneration, grammar[key][idx])) {
                return;
            }
        }
        grammar[key].push(newGeneration);
    }

    function getHelperKey(index) {
        return 'H' + index;
    }

    function getHelperIndex(grammar, index) {
        while (grammar.hasOwnProperty(getHelperKey(index))) {
            index += 1;
        }
        return index;
    }

    function removeEmpty(grammar, keys, term) {
        var i, j, k,
            newGeneration;
        for (i = 0; i < keys.length; i += 1) {
            for (j = 0; j < grammar[keys[i]].length; j += 1) {
                if (grammar[keys[i]][j].indexOf(term) >= 0) {
                    newGeneration = [];
                    for (k = 0; k < grammar[keys[i]][j].length; k += 1) {
                        if (grammar[keys[i]][j][k] !== term) {
                            newGeneration.push(grammar[keys[i]][j][k]);
                        }
                    }
                    if (newGeneration.length === 0) {
                        newGeneration = ['ϵ'];
                    }
                    addNewGeneration(grammar, keys[i], newGeneration);
                }
            }
        }
        return grammar;
    }

    function removeEmpties(grammar) {
        var i, j,
            // extended = {},
            // helperIndex = 0,
            hasEmpty = true,
            keys = Object.keys(grammar);
        // helperIndex = getHelperIndex(grammar, helperIndex);
        // extended[getHelperKey(helperIndex)] = [[keys[0]]];
        // grammar = Object.assign({}, extended, grammar);
        // keys = Object.keys(grammar);
        while (hasEmpty) {
            hasEmpty = false;
            for (i = 0; i < keys.length; i += 1) {
                for (j = 0; j < grammar[keys[i]].length; j += 1) {
                    if (grammar[keys[i]][j].length === 1 && grammar[keys[i]][j][0] === 'ϵ') {
                        grammar[keys[i]].splice(j, 1);
                        j -= 1;
                        grammar = removeEmpty(grammar, keys, keys[i]);
                        hasEmpty = true;
                    }
                }
            }
        }
        return grammar;
    }

    function removeSingles(grammar) {
        var i, j, k,
            key,
            hasSingle = true,
            keys = Object.keys(grammar);
        while (hasSingle) {
            hasSingle = false;
            for (i = 0; i < keys.length; i += 1) {
                for (j = 0; j < grammar[keys[i]].length; j += 1) {
                    if (grammar[keys[i]][j].length === 1 && grammar.hasOwnProperty(grammar[keys[i]][j][0])) {
                        key = grammar[keys[i]][j][0];
                        grammar[keys[i]].splice(j, 1);
                        for (k = 0; k < grammar[key].length; k += 1) {
                            addNewGeneration(grammar, keys[i], grammar[key][k]);
                        }
                        hasSingle = true;
                    }
                }
            }
        }
        return grammar;
    }

    function converGrammar(grammar) {
        var i, j, k, last,
            term,
            key,
            helperIndex = 0,
            singles = {},
            multis = {},
            keys = Object.keys(grammar);
        for (i = 0; i < keys.length; i += 1) {
            if (grammar[keys[i]].length === 1) {
                if (grammar[keys[i]][0].length === 1) {
                    term = grammar[keys[i]][0][0];
                    if (term !== 'ϵ' && !grammar.hasOwnProperty(term)) {
                        singles[term] = keys[i];
                    }
                }
            }
        }
        for (i = 0; i < keys.length; i += 1) {
            if (grammar[keys[i]].length === 1) {
                multis[grammar[keys[i]][0].join(' ')] = keys[i];
            }
        }
        for (i = 0; i < keys.length; i += 1) {
            for (j = 0; j < grammar[keys[i]].length; j += 1) {
                if (grammar[keys[i]][j].length === 2) {
                    for (k = 0; k < 2; k += 1) {
                        if (!grammar.hasOwnProperty(grammar[keys[i]][j][k])) {
                            if (!singles.hasOwnProperty(grammar[keys[i]][j][k])) {
                                helperIndex = getHelperIndex(grammar, helperIndex);
                                key = getHelperKey(helperIndex);
                                keys.push(key);
                                grammar[key] = [[grammar[keys[i]][j][k]]];
                                singles[grammar[keys[i]][j][k]] = key;
                            }
                            grammar[keys[i]][j][k] = singles[grammar[keys[i]][j][k]];
                        }
                    }
                } else if (grammar[keys[i]][j].length > 2) {
                    last = grammar[keys[i]][j].length - 1;
                    if (!grammar.hasOwnProperty(grammar[keys[i]][j][last])) {
                        if (!singles.hasOwnProperty(grammar[keys[i]][j][last])) {
                            helperIndex = getHelperIndex(grammar, helperIndex);
                            key = getHelperKey(helperIndex);
                            keys.push(key);
                            grammar[key] = [[grammar[keys[i]][j][last]]];
                            singles[grammar[keys[i]][j][last]] = key;
                        }
                        grammar[keys[i]][j][last] = singles[grammar[keys[i]][j][last]];
                    }
                    term = grammar[keys[i]][j].slice(0, last).join(' ');
                    if (!multis.hasOwnProperty(term)) {
                        helperIndex = getHelperIndex(grammar, helperIndex);
                        key = getHelperKey(helperIndex);
                        keys.push(key);
                        grammar[key] = [grammar[keys[i]][j].slice(0, last)];
                        multis[term] = key;
                    }
                    grammar[keys[i]][j] = [multis[term], grammar[keys[i]][j][last]];
                }
            }
        }
        return grammar;
    }

    function getParameterByName(name) {
        var url = window.location.href,
            regex,
            results;
        name = name.replace(/[\[\]]/g, "\\$&");
        regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return '';
        }
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    $('#button_convert').click(function () {
        var grammar = parseGrammar($('#input_grammar').val()),
            emptied = removeEmpties(grammar),
            singled = removeSingles(emptied),
            converted = converGrammar(singled),
            pretty = toPretty(converted),
            prefix = window.location.href.split('?')[0] + '?grammar=',
            input = b64EncodeUnicode($('#input_grammar').val());
        $('#input_url').val(prefix + input);
        $('#alert_error').hide();
        $('#output_grammar').text(pretty);
    });

    var input = getParameterByName('grammar');
    if (input) {
        input = b64DecodeUnicode(input);
        $('#input_grammar').val(input);
        $('#button_convert').click();
    }

});
