/*jslint browser: true*/
/*global $*/

$(document).ready(function () {
    'use strict';

    function b64EncodeUnicode(str) {
        return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            match = match.prototype; // For jslint.
            return String.fromCharCode('0x' + p1);
        }));
    }

    function b64DecodeUnicode(str) {
        return decodeURIComponent(Array.prototype.map.call(window.atob(str), function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    $('#button_encode').click(function () {
        $('#text_target').val(b64EncodeUnicode($('#text_source').val()));
    });

    $('#button_decode').click(function () {
        try {
            $('#text_target').val(b64DecodeUnicode($('#text_source').val()));
        } catch (e) {
            $('#text_target').val(e);
        }
    });

});
