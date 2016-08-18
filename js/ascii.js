/*jslint browser: true*/
/*global $*/

$(document).ready(function () {
    'use strict';
    var i, encoded, html,
        specialChars = {
            '0': 'NUL',
            '1': 'SOH',
            '2': 'STX',
            '3': 'ETX',
            '4': 'EOT',
            '5': 'ENQ',
            '6': 'ACK',
            '7': 'BEL',
            '8': 'BS',
            '9': 'TAB',
            '10': 'LF',
            '11': 'VT',
            '12': 'FF',
            '13': 'CR',
            '14': 'SO',
            '15': 'SI',
            '16': 'DLE',
            '17': 'DC1',
            '18': 'DC2',
            '19': 'DC3',
            '20': 'DC4',
            '21': 'NAK',
            '22': 'SYN',
            '23': 'ETB',
            '24': 'CAN',
            '25': 'EM',
            '26': 'SUB',
            '27': 'ESC',
            '28': 'FS',
            '29': 'GS',
            '30': 'RS',
            '31': 'US',
            '32': 'Space',
            '127': 'DEL'
        },
        ascii = document.getElementById('ascii');
    html = '';
    html += '<div class="row table-title">';
    html += '<span class="col-xs-2">Bin</span>';
    html += '<span class="col-xs-2">Oct</span>';
    html += '<span class="col-xs-2">Dec</span>';
    html += '<span class="col-xs-2">Hex</span>';
    html += '<span class="col-xs-2">Char</span>';
    html += '<span class="col-xs-2">HTML</span>';
    html += '</div>';

    function paddingLeft(str, len) {
        var pad;
        if (str.length === len) {
            return str;
        }
        pad = new [].constructor((len - str.length) + 1);
        return pad.join('0') + str;
    }

    function htmlEncode(html) {
        return document.createElement('a').appendChild(document.createTextNode(html)).parentNode.innerHTML;
    }


    for (i = 0; i < 128; i += 1) {
        html += '<div class="row">';
        html += '<span class="col-xs-2">' + paddingLeft(i.toString(2), 8) + '</span>';
        html += '<span class="col-xs-2">' + paddingLeft(i.toString(8), 3) + '</span>';
        html += '<span class="col-xs-2">' + paddingLeft(i.toString(10), 3) + '</span>';
        html += '<span class="col-xs-2">' + paddingLeft(i.toString(16), 2) + '</span>';
        if (specialChars.hasOwnProperty(i.toString())) {
            html += '<span class="col-xs-2">' + specialChars[i.toString()] + '</span>';
        } else {
            html += '<span class="col-xs-2">' + String.fromCharCode(i) + '</span>';
        }
        encoded = htmlEncode(String.fromCharCode(i));
        if (!encoded || encoded[0] !== '&') {
            encoded = '&#' + i;
        }
        html += '<span class="col-xs-2">' + htmlEncode(encoded) + '</span>';
        html += '</div>';
    }
    ascii.innerHTML = html;
});
