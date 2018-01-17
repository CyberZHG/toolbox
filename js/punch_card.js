/*jslint browser: true*/
/*global window, $*/

$(document).ready(function () {
    'use strict';

    var buckets = [];

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
        var i, j, date;
        if (buckets.length === 0) {
            for (i = 0; i < 7; i += 1) {
                buckets.push([]);
                for (j = 0; j < 24; j += 1) {
                    buckets[i].push(0);
                }
            }
        }
        for (i = 0; i < commits.length; i += 1) {
            date = new Date(commits[i].commit.author.date);
            buckets[date.getDay()][date.getHours()] += 1;
        }
        return buckets;
    }

    function drawPunchCard(buckets) {
        var i, j,
            maxCommitCnt = 0,
            days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
            canvas = $('#canvas_card'),
            context = canvas[0].getContext('2d'),
            width = canvas.width(),
            height = canvas.height(),
            widthInt = width / 26,
            heightInt = height / 9;
        for (i = 0; i < buckets.length; i += 1) {
            for (j = 0; j < buckets[i].length; j += 1) {
                if (buckets[i][j] > maxCommitCnt) {
                    maxCommitCnt = buckets[i][j];
                }
            }
        }
        maxCommitCnt += 1e-6;
        context.clearRect(0, 0, width, height);
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        for (i = 0; i < days.length; i += 1) {
            context.fillText(days[i], widthInt, heightInt * (i + 1));
        }
        for (j = 0; j < 24; j += 1) {
            context.fillText(j, widthInt * (j + 2), heightInt * 8);
        }
        for (i = 0; i < buckets.length; i += 1) {
            for (j = 0; j < buckets[i].length; j += 1) {
                if (buckets[i][j] !== 0) {
                    context.beginPath();
                    context.arc(
                        widthInt * (j + 2),
                        heightInt * (i + 1),
                        Math.min(widthInt, heightInt) * 0.45 * Math.sqrt(buckets[i][j] / maxCommitCnt),
                        0,
                        2 * Math.PI
                    );
                    context.fillStyle = 'rgba(0, 0, 0, ' + (0.4 + 0.6 * buckets[i][j] / maxCommitCnt) + ')';
                    context.fill();
                }
            }
        }
    }

    function queryCommits(url, page) {
        $.getJSON(url + '&page=' + page, function (commits) {
            if (commits.length > 0) {
                drawPunchCard(getBuckets(commits));
                queryCommits(url, page + 1);
            }
        });
    }

    $('#button_gen').click(function () {
        var url = 'https://api.github.com/repos/',
            owner = $('#owner').val(),
            repo = $('#repo').val(),
            author = $('#author').val(),
            prev = getISOString(getLastYear()),
            now = getISOString(new Date()),
            canvas = $('#canvas_card'),
            width = canvas.parent().width(),
            height = canvas.parent().width() * 0.4,
            params = {};
        canvas.attr('width', width);
        canvas.attr('height', height);
        url += owner + '/' + repo + '/commits';
        params.since = prev;
        params.until = now;
        if (author) {
            params.author = author;
        }
        url += '?' + objToQuery(params);
        queryCommits(url, 1);
    });

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

    if (getParameterByName('owner') && getParameterByName('repo')) {
        $('#owner').val(getParameterByName('owner'));
        $('#repo').val(getParameterByName('repo'));
        $('#button_gen').click();
    }

});
