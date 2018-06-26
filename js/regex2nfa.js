/*jslint browser: true*/
/*global window, regexToNfa, genAutomataSVG, $*/

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

    $('#button_convert').click(function () {
        var url,
            start = regexToNfa($('#input_regex').val()),
            prefix = window.location.href.split('?')[0] + '?regex=',
            input = b64EncodeUnicode($('#input_regex').val());
        $('#input_url').val(prefix + input);
        $('#alert_error').hide();
        if (typeof start === 'string') {
            $('#p_error').text(start);
            $('#alert_error').show();
        } else {
            $('svg').attr("width", $('svg').parent().width());
            genAutomataSVG('svg', start);
            url = prefix.replace('regex2nfa', 'nfa2dfa') + input;
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
