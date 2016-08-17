/*jslint browser: true*/
/*global $*/

$(document).ready(function () {
    'use strict';

    var i, j, s, div_num = document.getElementById('div_num');

    function dec2hex(c) {
        if (c < 10) {
            return String.fromCharCode('0'.charCodeAt(0) + c);
        }
        return String.fromCharCode('A'.charCodeAt(0) + c - 10);
    }

    div_num.innerHTML += '<div class="row">';
    for (i = 0; i < 480; i += 1) {
        s = '';
        for (j = 0; j < 8; j += 1) {
            s += dec2hex(Math.floor(Math.random() * 16));
        }
        div_num.innerHTML += '<span class="col-lg-1 col-md-2 col-sm-3 col-xs-4">' + s + '</span>';
    }
    div_num.innerHTML += '</div>';
});
