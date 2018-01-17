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
        var key, parts = [];
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
            }
        }
        return parts.join('&');
    }

    function getBuckets(commits) {
        var i, j, date, buckets = [];
        for (i = 0; i < 7; i += 1) {
            buckets.push([]);
            for (j = 0; j < 24; j += 1) {
                buckets[i].push(0);
            }
        }
        for (i = 0; i < commits.length; i += 1) {
            date = new Date(commits[i].commit.author.date);
            buckets[date.getDay()][date.getHours()] += 1;
        }
        return buckets;
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
        params.since = prev;
        params.until = now;
        if (author) {
            params.author = author;
        }
        url += '?' + objToQuery(params);
    });

});
