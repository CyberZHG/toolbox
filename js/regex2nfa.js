/*jslint browser: true*/
/*global regexToNfa, genAutomataSVG, $*/

$(document).ready(function () {
    'use strict';

    $('#button_convert').click(function () {
        var start = regexToNfa($('#input_regex').val());
        if (typeof start === 'string') {
            // TODO
        } else {
            $('svg').attr("width", $('svg').parent().width());
            genAutomataSVG('svg', start);
        }
    });

});
