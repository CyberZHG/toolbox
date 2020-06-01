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
        var i, j, k, l, currentLength,
            newGenerations;
        for (i = 0; i < keys.length; i += 1) {
            for (j = 0; j < grammar[keys[i]].length; j += 1) {
                if (grammar[keys[i]][j].indexOf(term) >= 0) {
                    newGenerations = [[]];
                    for (k = 0; k < grammar[keys[i]][j].length; k += 1) {
                        if (grammar[keys[i]][j][k] !== term) {
                            for (l = 0; l < newGenerations.length; l += 1) {
                                newGenerations[l].push(grammar[keys[i]][j][k]);
                            }
                        } else {
                            currentLength = newGenerations.length;
                            for (l = 0; l < currentLength; l += 1) {
                                newGenerations.push(newGenerations[l].slice());
                                newGenerations[l].push(grammar[keys[i]][j][k]);
                            }
                        }
                    }
                    for (l = 0; l < newGenerations.length; l += 1) {
                        if (newGenerations[l].length === 0) {
                            newGenerations[l] = ['ϵ'];
                        }
                        addNewGeneration(grammar, keys[i], newGenerations[l]);
                    }
                }
            }
        }
        return grammar;
    }

    function removeEmpties(grammar) {
        var i, j,
            hasEmpty = true,
            keys = Object.keys(grammar);
        while (hasEmpty) {
            hasEmpty = false;
            for (i = 1; i < keys.length; i += 1) {
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

    function removeUnreachable(grammar) {
        var i, j, front = 0, term,
            keys = Object.keys(grammar),
            queue = [keys[0]],
            reachable = {};
        reachable[keys[0]] = true;
        while (front < queue.length) {
            for (i = 0; i < grammar[queue[front]].length; i += 1) {
                for (j = 0; j < grammar[queue[front]][i].length; j += 1) {
                    term = grammar[queue[front]][i][j];
                    if (grammar.hasOwnProperty(term) && !reachable.hasOwnProperty(term)) {
                        queue.push(term);
                        reachable[term] = true;
                    }
                }
            }
            front += 1;
        }
        for (i = 0; i < keys.length; i += 1) {
            if (!reachable.hasOwnProperty(keys[i])) {
                delete grammar[keys[i]];
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
            linked = removeUnreachable(converted),
            pretty = toPretty(linked),
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
