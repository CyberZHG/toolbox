/*jslint browser: true*/
/*global $*/

$(document).ready(function () {
    'use strict';

    $('#button_encode').click(function () {
        $('#text_target').val(encodeURIComponent($('#text_source').val()));
    });

    $('#button_decode').click(function () {
        try {
            $('#text_target').val(decodeURIComponent($('#text_source').val()));
        } catch (e) {
            $('#text_target').val(e);
        }
    });

});
