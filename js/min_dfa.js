/*jslint browser: true*/
/*global window, regexToNfa, nfaToDfa, minDfa, genAutomataSVG, $*/

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

    function toNature(col) {
        var i,
            j,
            base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            result = 0;
        if ('1' <= col[0] && col[0] <= '9') {
            result = parseInt(col, 10);
        } else {
            for (i = 0, j = col.length - 1; i < col.length; i += 1, j -= 1) {
                result += Math.pow(base.length, j) * (base.indexOf(col[i]) + 1);
            }
        }
        return result;
    }

    function genDfaTable(start) {
        var i,
            j,
            states = {},
            nodes = [],
            stack = [start],
            symbols = [],
            top,
            html = '';
        while (stack.length > 0) {
            top = stack.pop();
            if (!states.hasOwnProperty(top.id)) {
                states[top.id] = top;
                top.nature = toNature(top.id);
                nodes.push(top);
                for (i = 0; i < top.edges.length; i += 1) {
                    if (top.edges[i][0] !== 'ϵ' && symbols.indexOf(top.edges[i][0]) < 0) {
                        symbols.push(top.edges[i][0]);
                    }
                    stack.push(top.edges[i][1]);
                }
            }
        }
        nodes.sort(function (a, b) {
            return a.nature - b.nature;
        });
        symbols.sort();
        html += '<table class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th>DFA STATE</th>';
        html += '<th>Min-DFA STATE</th>';
        html += '<th>TYPE</th>';
        for (i = 0; i < symbols.length; i += 1) {
            html += '<th>' + symbols[i] + '</th>';
        }
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        for (i = 0; i < nodes.length; i += 1) {
            html += '<tr>';
            html += '<td>{' + nodes[i].key + '}</td>';
            html += '<td>' + nodes[i].id + '</td>';
            html += '<td>' + nodes[i].type + '</td>';
            for (j = 0; j < symbols.length; j += 1) {
                html += '<td>';
                if (nodes[i].trans.hasOwnProperty(symbols[j])) {
                    html += nodes[i].trans[symbols[j]].id;
                }
                html += '</td>';
            }
            html += '</tr>';
        }
        html += '</tbody>';
        html += '</table>';
        return html;
    }

    $('#button_convert').click(function () {
        var nfa = regexToNfa($('#input_regex').val()),
            dfa,
            url,
            prefix = window.location.href.split('?')[0] + '?regex=',
            input = b64EncodeUnicode($('#input_regex').val());
        $('#input_url').val(prefix + input);
        $('#alert_error').hide();
        if (typeof nfa === 'string') {
            $('#p_error').text(nfa);
            $('#alert_error').show();
        } else {
            dfa = minDfa(nfaToDfa(nfa));
            $('#dfa_table').html(genDfaTable(dfa));
            $('svg').attr('width', $('svg').parent().width());
            genAutomataSVG('svg', dfa);
            url = prefix.replace('min_dfa', 'nfa2dfa') + input;
            $('#dfa_link').html('DFA: <a href="' + url + '" target="_blank" >' + url + '</a>');
        }
    });

    var input = getParameterByName('regex');
    if (input) {
        input = b64DecodeUnicode(input);
        $('#input_regex').val(input);
        $('#button_convert').click();
    }

});
