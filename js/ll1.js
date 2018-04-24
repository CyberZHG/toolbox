/*jslint browser: true*/
/*global window, parseGrammar, constructLL1ParsingTable, $*/

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

    function showParsingTable(grammar, table) {
        var i, j, k,
            keys = Object.keys(grammar),
            symbol,
            symbols = [],
            html = '';
        for (i = 0; i < keys.length; i += 1) {
            symbol = Object.keys(table[keys[i]]);
            for (j = 0; j < symbol.length; j += 1) {
                if (symbol[j] !== '$' && symbols.indexOf(symbol[j]) < 0) {
                    symbols.push(symbol[j]);
                }
            }
        }
        symbols.sort();
        symbols.push('$');
        html += '<table class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th>Head</th>';
        for (i = 0; i < symbols.length; i += 1) {
            html += '<th>' + symbols[i] + '</th>';
        }
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        for (i = 0; i < keys.length; i += 1) {
            html += '<tr>';
            html += '<td>' + keys[i] + '</td>';
            for (j = 0; j < symbols.length; j += 1) {
                if (table[keys[i]].hasOwnProperty(symbols[j])) {
                    if (table[keys[i]][symbols[j]].length > 1) {
                        html += '<td class="text-danger">';
                    } else {
                        html += '<td>';
                    }
                    for (k = 0; k < table[keys[i]][symbols[j]].length; k += 1) {
                        if (k > 0) {
                            html += '<br>';
                        }
                        html += [keys[i], '->'].concat(table[keys[i]][symbols[j]][k]).join(' ');
                    }
                    html += '</td>';
                } else {
                    html += '<td></td>';
                }
            }
            html += '</tr>';
        }
        html += '</tbody>';
        html += '</table>';
        $('#parsing_table').html(html);
    }

    $('#button_construct').click(function () {
        var grammar = parseGrammar($('#input_grammar').val()),
            table = constructLL1ParsingTable(grammar),
            prefix = window.location.href.split('?')[0] + '?grammar=',
            input = b64EncodeUnicode($('#input_grammar').val());
        $('#input_url').val(prefix + input);
        $('#alert_error').hide();
        showParsingTable(grammar, table);
    });

    var input = getParameterByName('grammar');
    if (input) {
        input = b64DecodeUnicode(input);
        $('#input_grammar').val(input);
        $('#button_construct').click();
    }

});
