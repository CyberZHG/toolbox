/*jslint browser: true*/
/*global window, $*/

$(document).ready(function () {
    'use strict';

    function getLastYear() {
        return new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    }

    function getISOString(date) {
        return date.toISOString().split('.')[0] + 'Z';
    }

    function objToQuery(obj) {
        var parts = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
            }
        }
        return parts.join('&');
    }

    $('#button_gen').click(function () {
        var url = 'https://api.github.com/repos/',
            owner = $('#owner').val(),
            repo = $('#repo').val(),
            author = $('#author').val(),
            prev = getISOString(getLastYear()),
            now = getISOString(new Date()),
            params = {};
        url += owner + '/' + repo + '/commits';
        params['since'] = prev;
        params['until'] = now;
        if (author) {
            params['author'] = author;
        }
        url += '?' + objToQuery(params);
        console.log(url);
    });

});
