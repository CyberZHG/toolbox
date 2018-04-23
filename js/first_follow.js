/*jslint browser: true*/
/*global window, parseGrammar, calcNullables, calcFirsts, calcFollows, $*/

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

    $('#button_compute').click(function () {
        var grammar = parseGrammar($('#input_grammar').val()),
            nullables = calcNullables(grammar),
            firsts = calcFirsts(grammar, nullables),
            follows = calcFollows(grammar, nullables, firsts),
            symbols = Object.keys(follows),
            html = '',
            prefix = window.location.href.split('?')[0] + '?grammar=',
            input = b64EncodeUnicode($('#input_grammar').val());
        $('#input_url').val(prefix + input);
        $('#alert_error').hide();
        html += '<table class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th>Symbol</th>';
        html += '<th>Nullable</th>';
        html += '<th>First</th>';
        html += '<th>Follow</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        symbols.sort();
        symbols.forEach(function (symbol) {
            html += '<tr>';
            html += '<td>' + symbol + '</td>';
            html += '<td>' + nullables[symbol] + '</td>';
            html += '<td>' + firsts[symbol].join(' ') + '</td>';
            html += '<td>' + follows[symbol].join(' ') + '</td>';
            html += '</tr>';
        });
        html += '</tbody>';
        html += '</table>';
        $('#result_table').html(html);
    });

    var input = getParameterByName('grammar');
    if (input) {
        input = b64DecodeUnicode(input);
        $('#input_grammar').val(input);
        $('#button_compute').click();
    }

});
