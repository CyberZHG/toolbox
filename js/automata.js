/*jslint browser: true*/
/*global d3, dagreD3*/

/**
 * @param {string} svgId The id of the svg tag, which should contains a `g` tag.
 * @param {object} start @see regexToNfa().
 * @return {void}
 */
function genAutomataSVG(svgId, start) {
    'use strict';
    var ids = {},
        node,
        next,
        i,
        front = 0,
        queue = [start],
        g = new dagreD3.graphlib.Graph().setGraph({}),
        svg = d3.select(svgId),
        inner = svg.select('g'),
        zoom,
        render = new dagreD3.render();

    zoom = d3.behavior.zoom().on("zoom", function () {
        inner.attr("transform", "translate(" + d3.event.translate + ")" + "scale(" + d3.event.scale + ")");
    });
    svg.call(zoom);
    while (front < queue.length) {
        node = queue[front];
        ids[node.id] = node;
        if (node.type === '' || node.type === 'start') {
            node.type = 'normal';
        }
        g.setNode(node.id, {shape: node.type, label: node.id});
        for (i = 0; i < node.edges.length; i += 1) {
            next = node.edges[i][1];
            g.setEdge(node.id, next.id, {label: node.edges[i][0]});
            if (!ids.hasOwnProperty(next.id)) {
                queue.push(next);
            }
        }
        front += 1;
    }

    render.shapes().normal = function (parent, bbox, node) {
        var w = bbox.width,
            h = bbox.height,
            rx = Math.min(w / 2, h / 2),
            ry = rx,
            point = {x: w / 2, y: h / 2},
            shapeSvg = parent
                .insert("ellipse", ":first-child")
                .attr("cx", point.x)
                .attr("cy", point.y)
                .attr("rx", rx)
                .attr("ry", ry)
                .attr("fill", "white")
                .attr("fill-opacity", "0")
                .attr("stroke", "black")
                .attr("transform", "translate(" + (-w / 2) + "," + (-h / 2) + ")");

        node.intersect = function (point) {
            return dagreD3.intersect.ellipse(node, rx, ry, point);
        };
        return shapeSvg;
    };

    render.shapes().accept = function (parent, bbox, node) {
        var w = bbox.width,
            h = bbox.height,
            rx = Math.min(w / 2, h / 2),
            ry = rx,
            point = {x: w / 2, y: h / 2},
            shapeSvg = parent
                .insert("ellipse", ":first-child")
                .attr("cx", point.x)
                .attr("cy", point.y)
                .attr("rx", rx)
                .attr("ry", ry)
                .attr("accept", '')
                .attr("fill", "white")
                .attr("fill-opacity", "0")
                .attr("stroke", "black")
                .attr("transform", "translate(" + (-w / 2) + "," + (-h / 2) + ")");
        shapeSvg = parent
            .insert("ellipse", ":first-child")
            .attr("cx", point.x)
            .attr("cy", point.y)
            .attr("rx", rx - 2)
            .attr("ry", ry - 2)
            .attr("accept", '')
            .attr("fill", "white")
            .attr("fill-opacity", "0")
            .attr("stroke", "black")
            .attr("transform", "translate(" + (-w / 2) + "," + (-h / 2) + ")");

        node.intersect = function (point) {
            return dagreD3.intersect.ellipse(node, rx, ry, point);
        };
        return shapeSvg;
    };
    g.graph().rankdir = 'LR';
    render(inner, g);
    zoom
        .translate([(svg.attr("width") - g.graph().width) / 2, 20])
        .event(svg);
    svg.attr('height', g.graph().height * 1.5 + 40);
}
