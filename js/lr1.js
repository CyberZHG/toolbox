/*jslint browser: true*/
/*global window, parseGrammar, calcFollows, constructLR1Automaton, genAutomatonLR1, $*/

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

    function showParsingTable(grammar, follows, automaton) {
        var i, j, k,
            keys = Object.keys(grammar),
            symbol,
            symbols = [],
            queue = [automaton],
            front = 0,
            node,
            nums,
            nodes = {'0': automaton},
            html = '',
            td,
            count;
        if (!follows) {
            return;
        }
        while (front < queue.length) {
            node = queue[front];
            front += 1;
            symbol = Object.keys(node.edges);
            for (j = 0; j < symbol.length; j += 1) {
                if (symbol[j] !== '$') {
                    if (keys.indexOf(symbol[j]) < 0 && symbols.indexOf(symbol[j]) < 0) {
                        symbols.push(symbol[j]);
                    }
                }
                if (!nodes.hasOwnProperty(node.edges[symbol[j]].num)) {
                    nodes[node.edges[symbol[j]].num] = node.edges[symbol[j]];
                    queue.push(node.edges[symbol[j]]);
                }
            }
        }
        symbols.sort();
        symbols.push('$');

        html += '<table class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th style="vertical-align: middle" class="text-center" rowspan="2">STATE</th>';
        html += '<th class="text-center" colspan="' + symbols.length + '">ACTION</th>';
        html += '<th class="text-center" colspan="' + keys.length + '">GOTO</th>';
        html += '</tr>';
        html += '<tr>';
        for (i = 0; i < symbols.length; i += 1) {
            html += '<th class="text-center">' + symbols[i] + '</th>';
        }
        for (i = 0; i < keys.length; i += 1) {
            html += '<th class="text-center">' + keys[i] + '</th>';
        }
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        nums = Object.keys(nodes);
        for (i = 0; i < nums.length; i += 1) {
            html += '<tr>';
            html += '<td class="text-center">' + nums[i] + '</td>';
            node = nodes[nums[i]];
            for (j = 0; j < symbols.length; j += 1) {
                td = '';
                count = 0;
                if (symbols[j] === '$' && node.accept) {
                    count += 1;
                    td += 'acc';
                }
                if (node.edges.hasOwnProperty(symbols[j])) {
                    if (count > 0) {
                        td += '<br>';
                    }
                    count += 1;
                    td += 's' + node.edges[symbols[j]].num;
                }
                if (node.reduces.hasOwnProperty(symbols[j])) {
                    for (k = 0; k < node.reduces[symbols[j]].length; k += 1) {
                        if (count > 0) {
                            td += '<br>';
                        }
                        count += 1;
                        td += 'r( ' + node.reduces[symbols[j]][k].head + ' -> ' + node.reduces[symbols[j]][k].body.join(' ') + ' )';
                    }
                }
                if (count > 1) {
                    html += '<td class="text-center text-danger">' + td + '</td>';
                } else {
                    html += '<td class="text-center">' + td + '</td>';
                }
            }
            for (j = 0; j < keys.length; j += 1) {
                if (node.edges.hasOwnProperty(keys[j])) {
                    html += '<td class="text-center">' + node.edges[keys[j]].num + '</td>';
                } else {
                    html += '<td></td>';
                }
            }
            html += '</td>';
        }
        html += '</tbody>';
        html += '</table>';
        $('#parsing_table').html(html);
    }

    $('#button_construct').click(function () {
        var grammar = parseGrammar($('#input_grammar').val()),
            follows = calcFollows(grammar),
            automaton = constructLR1Automaton(grammar),
            prefix = window.location.href.split('?')[0] + '?grammar=',
            input = b64EncodeUnicode($('#input_grammar').val());
        $('#input_url').val(prefix + input);
        $('#alert_error').hide();
        showParsingTable(grammar, follows, automaton);
        $('svg').attr("width", $('svg').parent().width());
        genAutomatonLR1('svg', automaton);
    });

    var input = getParameterByName('grammar');
    if (input) {
        input = b64DecodeUnicode(input);
        $('#input_grammar').val(input);
        $('#button_construct').click();
    }

});
