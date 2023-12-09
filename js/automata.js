/*jslint browser: true*/
/*global d3, dagreD3*/

/**
 * @param {string} svgId The id of the svg tag, which should contains a `g` tag.
 * @param {object} start @see regexToNfa().
 * @return {void}
 */
function genAutomataSVG(svgId, start) {
  "use strict";

  // Function to recursively replace escape characters in edge labels
  const escapeMap = { n: "\n", r: "\r", t: "\t", v: "\v", f: "\f" };

  var ids = {},
    node,
    next,
    i,
    front = 0,
    queue = [start],
    g = new dagreD3.graphlib.Graph().setGraph({}),
    svg = d3.select(svgId),
    inner = svg.select("g"),
    zoom,
    render = new dagreD3.render();

  zoom = d3.behavior.zoom().on("zoom", function () {
    inner.attr("transform", "translate(" + d3.event.translate + ")" + "scale(" + d3.event.scale + ")");
  });
  svg.call(zoom);
  g.setNode(-1, { shape: "text", label: "start" });
  while (front < queue.length) {
    node = queue[front];
    ids[node.id] = node;
    if (node === start) {
      g.setEdge(-1, node.id, { label: "" });
    }
    if (node.type === "" || node.type === "start") {
      node.type = "normal";
    }
    g.setNode(node.id, { shape: node.type, label: node.id });
    for (i = 0; i < node.edges.length; i += 1) {
      next = node.edges[i][1];
      var label = node.edges[i][0];
      for (var escapeKey in escapeMap) {
        label = label.replace("\\" + escapeKey, "\\\\" + escapeKey);
      }
      g.setEdge(node.id, next.id, { label: label });
      if (!ids.hasOwnProperty(next.id)) {
        queue.push(next);
      }
    }
    front += 1;
  }

  for (let index = 0; index < Object.keys(ids).length; index++) {
    d3.selectAll(".node" + index.toString())
      .on("mouseover", function (event) {
        d3.selectAll("#ellipse" + index.toString())
          .transition()
          .duration("50")
          .attr("fill", "#419488")
          .attr("fill-opacity", "1");
      })
      .on("mouseout", function (d, i) {
        d3.selectAll("#ellipse" + index.toString())
          .transition()
          .duration("50")
          .attr("fill", "white")
          .attr("fill-opacity", "0");
      });
  }

  render.shapes().text = function (parent, bbox, node) {
    var w = bbox.width,
      h = bbox.height,
      rx = Math.min(w / 2, h / 2),
      ry = rx,
      point = { x: w / 2, y: h / 2 },
      shapeSvg = parent
        .insert("ellipse", ":first-child")
        .attr("cx", point.x)
        .attr("cy", point.y)
        .attr("rx", rx)
        .attr("ry", ry)
        .attr("fill-opacity", "0")
        .attr("stroke-opacity", "0")
        .attr("transform", "translate(" + -w / 2 + "," + -h / 2 + ")");

    node.intersect = function (point) {
      return dagreD3.intersect.ellipse(node, rx, ry, point);
    };
    return shapeSvg;
  };

  render.shapes().normal = function (parent, bbox, node) {
    var w = bbox.width,
      h = bbox.height,
      rx = Math.min(w / 2, h / 2),
      ry = rx,
      point = { x: w / 2, y: h / 2 },
      shapeSvg = parent
        .insert("ellipse", ":first-child")
        .attr("cx", point.x)
        .attr("cy", point.y)
        .attr("rx", rx)
        .attr("ry", ry)
        .attr("fill", "white")
        .attr("fill-opacity", "0")
        .attr("stroke", "black")
        .attr("transform", "translate(" + -w / 2 + "," + -h / 2 + ")")
        .attr("id", "ellipse" + node.label)
        .on("mouseover", function (d, i) {
          d3.select(this)
            .transition()
            .duration("50")
            .attr("fill", "#419488")
            .attr("fill-opacity", "1");
          d3.selectAll(".node" + node.label).style(
            "background-color",
            "#419488"
          );
        })
        .on("mouseout", function (d, i) {
          d3.select(this)
            .transition()
            .duration("50")
            .attr("fill", "white")
            .attr("fill-opacity", "0");
          d3.selectAll(".node" + node.label).style("background-color", null);
        });

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
      point = { x: w / 2, y: h / 2 },
      shapeSvg = parent
        .insert("ellipse", ":first-child")
        .attr("cx", point.x)
        .attr("cy", point.y)
        .attr("rx", rx - 2)
        .attr("ry", ry - 2)
        .attr("accept", "")
        .attr("fill", "white")
        .attr("fill-opacity", "0")
        .attr("stroke", "black")
        .attr("transform", "translate(" + -w / 2 + "," + -h / 2 + ")")
        .attr("id", "ellipse" + node.label)
        .on("mouseover", function (d, i) {
          d3.selectAll("#ellipse" + node.label)
            .transition()
            .duration("50")
            .attr("fill", "#419488")
            .attr("fill-opacity", "1");
          d3.selectAll(".node" + node.label).style(
            "background-color",
            "#419488"
          );
        })
        .on("mouseout", function (d, i) {
          d3.selectAll("#ellipse" + node.label)
            .transition()
            .duration("50")
            .attr("fill", "white")
            .attr("fill-opacity", "0");
          d3.selectAll(".node" + node.label).style("background-color", null);
        });
    shapeSvg = parent
      .insert("ellipse", ":first-child")
      .attr("cx", point.x)
      .attr("cy", point.y)
      .attr("rx", rx)
      .attr("ry", ry)
      .attr("accept", "")
      .attr("fill", "white")
      .attr("fill-opacity", "0")
      .attr("stroke", "black")
      .attr("transform", "translate(" + -w / 2 + "," + -h / 2 + ")")
      .attr("id", "ellipse" + node.label)
      .on("mouseover", function (d, i) {
        d3.selectAll("#ellipse" + node.label)
          .transition()
          .duration("50")
          .attr("fill", "#419488")
          .attr("fill-opacity", "1");
        d3.selectAll(".node" + node.label).style("background-color", "#419488");
      })
      .on("mouseout", function (d, i) {
        d3.selectAll("#ellipse" + node.label)
          .transition()
          .duration("50")
          .attr("fill", "white")
          .attr("fill-opacity", "0");
        d3.selectAll(".node" + node.label).style("background-color", null);
      });

    node.intersect = function (point) {
      return dagreD3.intersect.ellipse(node, rx, ry, point);
    };
    return shapeSvg;
  };
  g.graph().rankdir = "LR";
  render(inner, g);
  svg.attr("height", g.graph().height * 1.5 + 40);
  var hscale = svg.attr("height") / g.graph().height;
  var wscale = svg.attr("width") / (g.graph().width+40);
  var scale = hscale;
  if (hscale > wscale) {
    scale = wscale;
  }
  zoom.scale(scale).event(svg);
  zoom
    .translate([(svg.attr("width") - g.graph().width * scale) / 2, 10])
    .event(svg);
}

function genAutomatonLR0(svgId, start) {
  "use strict";
  var ids = {},
    node,
    label,
    keys,
    next,
    i,
    front = 0,
    queue = [start],
    g = new dagreD3.graphlib.Graph().setGraph({}),
    svg = d3.select(svgId),
    inner = svg.select("g"),
    zoom,
    render = new dagreD3.render();

  zoom = d3.behavior.zoom().on("zoom", function () {
    inner.attr("transform", "translate(" + d3.event.translate + ")" + "scale(" + d3.event.scale + ")");
  });
  svg.call(zoom);

  function prettyPrintItem(item) {
    return item.head + " -> " + item.body.join(" ");
  }

  function prettyPrintItems(items) {
    return items.map(prettyPrintItem, items).join("\n");
  }

  while (front < queue.length) {
    node = queue[front];
    ids[node.key] = node;
    label = "I" + node.num + "\n===\n" + prettyPrintItems(node.kernel) + "\n---\n" + prettyPrintItems(node.nonkernel);
    g.setNode(node.key, { shape: "rect", label: label });
    keys = Object.keys(node.edges);
    for (i = 0; i < keys.length; i += 1) {
      next = node.edges[keys[i]];
      g.setEdge(node.key, next.key, { label: keys[i] });
      if (!ids.hasOwnProperty(next.key)) {
        queue.push(next);
      }
    }
    if (node.accept) {
      g.setNode(node.key + "_accept", { shape: "text", label: "accept" });
      g.setEdge(node.key, node.key + "_accept", { label: "$" });
    }
    front += 1;
  }

  render.shapes().text = function (parent, bbox, node) {
    var w = bbox.width,
      h = bbox.height,
      rx = Math.min(w / 2, h / 2),
      ry = rx,
      point = { x: w / 2, y: h / 2 },
      shapeSvg = parent
        .insert("ellipse", ":first-child")
        .attr("cx", point.x)
        .attr("cy", point.y)
        .attr("rx", rx)
        .attr("ry", ry)
        .attr("fill-opacity", "0")
        .attr("stroke-opacity", "0")
        .attr("transform", "translate(" + -w / 2 + "," + -h / 2 + ")");

    node.intersect = function (point) {
      return dagreD3.intersect.ellipse(node, rx, ry, point);
    };
    return shapeSvg;
  };

  g.graph().rankdir = "LR";
  render(inner, g);
  svg.attr("height", g.graph().height * 1.5 + 40);
  var hscale = svg.attr("height") / g.graph().height;
  var wscale = svg.attr("width") / (g.graph().width + 40);
  var scale = hscale;
  if (hscale > wscale) {
    scale = wscale;
  }
  zoom.scale(scale).event(svg);
  zoom
    .translate([(svg.attr("width") - g.graph().width * scale) / 2, 10])
    .event(svg);
}

function genAutomatonLR1(svgId, start) {
  "use strict";
  var ids = {},
    node,
    label,
    keys,
    next,
    i,
    front = 0,
    queue = [start],
    g = new dagreD3.graphlib.Graph().setGraph({}),
    svg = d3.select(svgId),
    inner = svg.select("g"),
    zoom,
    render = new dagreD3.render();

  zoom = d3.behavior.zoom().on("zoom", function () {
    inner.attr("transform", "translate(" + d3.event.translate + ")" + "scale(" + d3.event.scale + ")");
  });
  svg.call(zoom);

  function prettyPrintItem(item) {
    return item.head + " -> " + item.body.join(" ") + ", " + item.lookahead.join("/");
  }

  function prettyPrintItems(items) {
    return items.map(prettyPrintItem, items).join("\n");
  }

  while (front < queue.length) {
    node = queue[front];
    ids[node.key] = node;
    label = "I" + node.num + "\n===\n" + prettyPrintItems(node.kernel) + "\n---\n" + prettyPrintItems(node.nonkernel);
    g.setNode(node.key, { shape: "rect", label: label });
    keys = Object.keys(node.edges);
    for (i = 0; i < keys.length; i += 1) {
      next = node.edges[keys[i]];
      g.setEdge(node.key, next.key, { label: keys[i] });
      if (!ids.hasOwnProperty(next.key)) {
        queue.push(next);
      }
    }
    if (node.accept) {
      g.setNode(node.key + "_accept", { shape: "text", label: "accept" });
      g.setEdge(node.key, node.key + "_accept", { label: "$" });
    }
    front += 1;
  }

  render.shapes().text = function (parent, bbox, node) {
    var w = bbox.width,
      h = bbox.height,
      rx = Math.min(w / 2, h / 2),
      ry = rx,
      point = { x: w / 2, y: h / 2 },
      shapeSvg = parent
        .insert("ellipse", ":first-child")
        .attr("cx", point.x)
        .attr("cy", point.y)
        .attr("rx", rx)
        .attr("ry", ry)
        .attr("fill-opacity", "0")
        .attr("stroke-opacity", "0")
        .attr("transform", "translate(" + -w / 2 + "," + -h / 2 + ")");

    node.intersect = function (point) {
      return dagreD3.intersect.ellipse(node, rx, ry, point);
    };
    return shapeSvg;
  };

  g.graph().rankdir = "LR";
  render(inner, g);
  svg.attr("height", g.graph().height * 1.5 + 40);
  var hscale = svg.attr("height") / g.graph().height;
  var wscale = svg.attr("width") / (g.graph().width + 40);
  var scale = hscale;
  if (hscale > wscale) {
    scale = wscale;
  }
  zoom.scale(scale).event(svg);
  zoom
    .translate([(svg.attr("width") - g.graph().width * scale) / 2, 10])
    .event(svg);
}
