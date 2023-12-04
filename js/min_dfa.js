/*jslint browser: true*/
/*global window, regexToNfa, nfaToDfa, minDfa, genAutomataSVG, $*/

$(document).ready(function () {
  "use strict";

  function b64EncodeUnicode(str) {
    return window.btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        match = match.prototype; // For jslint.
        return String.fromCharCode("0x" + p1);
      })
    );
  }

  function b64DecodeUnicode(str) {
    return decodeURIComponent(
      Array.prototype.map
        .call(window.atob(str.replace(" ", "+")), function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }

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
      return "";
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  function toNature(col) {
    var i,
      j,
      base = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      result = 0;
    if ("1" <= col[0] && col[0] <= "9") {
      result = parseInt(col, 10);
    } else {
      for (i = 0, j = col.length - 1; i < col.length; i += 1, j -= 1) {
        result += Math.pow(base.length, j) * (base.indexOf(col[i]) + 1);
      }
    }
    return result;
  }

  function groupKeys(keys) {
    var groupedKeys = "";
    var keysArray = keys.split(",");
    if (keysArray.length <= 1) {
      return keys;
    }

    groupedKeys += keysArray[0];
    let i = 1;
    while (i < keysArray.length) {
      // a-z: 97-122, A-Z: 65-90, 0-9: 48-57
      // We have a sequence
      if (
        parseInt(keysArray[i].charCodeAt(0)) ==
        parseInt(keysArray[i - 1].charCodeAt(0)) + 1
      ) {
        if (i == keysArray.length - 1) {
          groupedKeys += "-" + keysArray[i];
        }
        i++;
        continue;
      } // We dont have a sequence
      else {
        // Did we just end a sequence?
        if (
          parseInt(keysArray[i].charCodeAt(0)) ==
          parseInt(keysArray[i - 1].charCodeAt(0)) + 1
        ) {
          groupedKeys += "-" + keysArray[i - 1];
        } else if (
          i > 2 &&
          parseInt(keysArray[i - 1].charCodeAt(0)) ==
            parseInt(keysArray[i - 2].charCodeAt(0)) + 1
        ) {
          groupedKeys += "-" + keysArray[i - 1];
          groupedKeys += "," + keysArray[i];
        } else {
          groupedKeys += "," + keysArray[i];
        }
      }
      i++;
    }
    return groupedKeys;
  }

  function genDfaTable(start) {
    var i,
      j,
      states = {},
      nodes = [],
      stack = [start],
      symbols = [],
      top,
      html = "";
    while (stack.length > 0) {
      top = stack.pop();
      if (!states.hasOwnProperty(top.id)) {
        states[top.id] = top;
        top.nature = toNature(top.id);
        nodes.push(top);
        for (i = 0; i < top.edges.length; i += 1) {
          if (top.edges[i][0] !== "ϵ" && symbols.indexOf(top.edges[i][0]) < 0) {
            symbols.push(top.edges[i][0]);
          }
          stack.push(top.edges[i][1]);
        }
      }
    }
    nodes.sort(function (a, b) {
      return a.nature - b.nature;
    });
    symbols.sort();
    html += '<table class="table">';
    html += "<thead>";
    html += "<tr>";
    html += "<th>DFA STATE</th>";
    html += "<th>Min-DFA STATE</th>";
    html += "<th>TYPE</th>";
    for (i = 0; i < symbols.length; i += 1) {
      html += "<th>" + symbols[i] + "</th>";
    }
    html += "</tr>";
    html += "</thead>";
    html += "<tbody>";
    for (i = 0; i < nodes.length; i += 1) {
      html += "<tr>";
      html += "<td>{" + groupKeys(nodes[i].key) + "}</td>";
      html += '<td class="node' + nodes[i].id + '">' + nodes[i].id + "</td>";
      html += "<td>" + nodes[i].type + "</td>";
      for (j = 0; j < symbols.length; j += 1) {
        if (nodes[i].trans.hasOwnProperty(symbols[j])) {
          html += '<td class="node' + nodes[i].trans[symbols[j]].id + '">';
          html += nodes[i].trans[symbols[j]].id;
          html += "</td>";
        } else {
          html += "<td></td>";
        }
      }
      html += "</tr>";
    }
    html += "</tbody>";
    html += "</table>";
    return html;
  }

  $("#button_convert").click(function () {
    // Check the values of the input elements
    const inputRegex = $("#input_regex").val();
    const inputRegexRaw = $("#input_regex_raw").val();
    let inputValue = "";

    // Both input elements have characters
    if (inputRegexRaw || inputRegex) {
      // Determine the input value to process
      inputValue = inputRegexRaw ? regexToMinDFASpec(inputRegexRaw) : inputRegex;
      if (inputRegexRaw) {
        $("#input_regex").val(inputValue);
      }
    } else {
      $("#p_error").text("Error: You must fill at least one field. Consider this raw regex: ([a-zA-Z0-9\\+]+b*)*");
      $("#alert_error").show();
      return;
    }

    var nfa = regexToNfa(inputValue),
      dfa,
      url,
      prefix = window.location.href.split("?")[0] + "?regex=",
      input = b64EncodeUnicode($("#input_regex").val());
    $("#input_url").val(prefix + input);
    $("#alert_error").hide();
    if (typeof nfa === "string") {
      $("#p_error").text(nfa);
      $("#alert_error").show();
      return;
    } else {
      dfa = minDfa(nfaToDfa(nfa));
      // console.log("DFA: ", JSON.stringify(dfa));
      $("#dfa_table").html(genDfaTable(dfa));
      $("svg").attr("width", $("svg").parent().width());
      genAutomataSVG("svg", dfa);
      url = prefix.replace("min_dfa", "nfa2dfa") + input;
      $("#dfa_link").html('DFA: <a href="' + url + '" target="_blank" >' + url + "</a>");
    }
  });

  var input = getParameterByName("regex");
  if (input) {
    input = b64DecodeUnicode(input);
    $("#input_regex").val(input);
    $("#button_convert").click();
  }
});
