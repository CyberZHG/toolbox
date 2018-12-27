/*jslint browser: true*/
/*global window, Set, parseGrammar, $*/

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

    function parseCode(code) {
        return code.split(' ').filter(function (token) {
            return token.length > 0;
        });
    }

    function constructCYKParsingTable(grammar, code) {
        var i, j, k, l, li, ri,
            key = '',
            keys = Object.keys(grammar),
            inverse = {},
            table = [];
        // Record inverse grammar
        for (i = 0; i < keys.length; i += 1) {
            for (j = 0; j < grammar[keys[i]].length; j += 1) {
                key = grammar[keys[i]][j].join(' ');
                if (!inverse.hasOwnProperty(key)) {
                    inverse[key] = [];
                }
                inverse[key].push(keys[i]);
            }
        }
        // Initiliaze table and diagonal
        for (i = 0; i < code.length; i += 1) {
            table.push([]);
            for (j = 0; j < code.length; j += 1) {
                table[i].push([]);
            }
            if (inverse.hasOwnProperty(code[i])) {
                table[i][i] = table[i][i].concat(inverse[code[i]]);
            }
        }
        // Extend by dynamic programming
        for (l = 1; l < code.length; l += 1) {
            for (i = 0; i + l < code.length; i += 1) {
                j = i + l;
                for (k = i; k < j; k += 1) {
                    for (li = 0; li < table[i][k].length; li += 1) {
                        for (ri = 0; ri < table[k + 1][j].length; ri += 1) {
                            key = table[i][k][li] + ' ' + table[k + 1][j][ri];
                            if (inverse.hasOwnProperty(key)) {
                                table[i][j] = table[i][j].concat(inverse[key]);
                            }
                        }
                    }
                }
                table[i][j] = Array.from(new Set(table[i][j]));
            }
        }
        return table;
    }

    function showParsingTable(code, table) {
        var i, j,
            html = '';
        html += '<table class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th>j \\ i</th>';
        for (i = 0; i < code.length; i += 1) {
            html += '<th>' + i + '</th>';
        }
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        for (j = 0; j < code.length; j += 1) {
            html += '<tr>';
            html += '<td>' + j + '</td>';
            for (i = 0; i < code.length; i += 1) {
                html += '<td>' + table[i][j].join(' ') + '</td>';
            }
            html += '</tr>';
        }
        html += '</tbody>';
        html += '</table>';
        $('#parsing_table').html(html);
    }

    $('#button_construct').click(function () {
        var grammar = parseGrammar($('#input_grammar').val()),
            code = parseCode($('#input_code').val()),
            table = constructCYKParsingTable(grammar, code),
            prefix = window.location.href.split('?')[0] + '?grammar=',
            input = b64EncodeUnicode($('#input_grammar').val());
        $('#input_url').val(prefix + input);
        $('#alert_error').hide();
        showParsingTable(code, table);
    });

    var input = getParameterByName('grammar');
    if (input) {
        input = b64DecodeUnicode(input);
        $('#input_grammar').val(input);
        $('#button_construct').click();
    }

});
