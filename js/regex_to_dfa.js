/*jslint browser: true*/
/*global require, exports*/

/** This section sets the 'regex' variable to the regex you want to use.
 * All of the relevant regexes are in the main repo README.
 */

const a2z = "a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z";
const A2Z = "A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z";
const r0to9 = "0|1|2|3|4|5|6|7|8|9";
const alphanum = `${a2z}|${A2Z}|${r0to9}`;

const key_chars = `(${a2z})`;
const catch_all =
  "(0|1|2|3|4|5|6|7|8|9|a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z|A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|!|\"|#|$|%|&|'|\\(|\\)|\\*|\\+|,|-|.|/|:|;|<|=|>|\\?|@|[|\\\\|]|^|_|`|{|\\||}|~| |\t|\n|\r|\x0b|\x0c)";
const catch_all_without_semicolon =
  "(0|1|2|3|4|5|6|7|8|9|a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z|A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|!|\"|#|$|%|&|'|\\(|\\)|\\*|\\+|,|-|.|/|:|<|=|>|\\?|@|[|\\\\|]|^|_|`|{|\\||}|~| |\t|\n|\r|\x0b|\x0c)";

const email_chars = `${alphanum}|_|.|-`;
const base_64 = `(${alphanum}|\\+|/|=)`;
const word_char = `(${alphanum}|_)`;

// let to_from_regex_old = '(\r\n|\x80)(to|from):([A-Za-z0-9 _."@-]+<)?[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.]+>?\r\n';
// let regex = `\r\ndkim-signature:(${key_chars}=${catch_all_without_semicolon}+; )+bh=${base_64}+; `;
// let sig_regex = `${catch_all_without_semicolon}\r\ndkim-signature:(${key_chars}=${catch_all_without_semicolon}+; )+bh=${base_64}+; `;
// let order_invariant_regex_raw = `((\\n|\x80|^)(((from):([A-Za-z0-9 _."@-]+<)?[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.]+>)?|(subject:[a-zA-Z 0-9]+)?|((to):([A-Za-z0-9 _."@-]+<)?[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.]+>)?|(dkim-signature:((a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z)=(0|1|2|3|4|5|6|7|8|9|a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z|A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|!|"|#|$|%|&|\'|\\(|\\)|\\*|\\+|,|-|.|/|:|<|=|>|\\?|@|[|\\\\|]|^|_|`|{|\\||}|~| |\t|\n|\r|\x0B|\f)+; ))?)(\\r))+` // Uses a-z syntax instead of | for each char

const a2z_nosep = "abcdefghijklmnopqrstuvwxyz";
const A2Z_nosep = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const r0to9_nosep = "0123456789";

// Note that in order to specify this string in regex, we must use \\ to escape \'s i.e. in the \r\n
let order_invariant_header_regex_raw = `(((\\n|^)(((from):([A-Za-z0-9 _."@-]+<)?[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.]+>)?|(subject:[a-zA-Z 0-9]+)?|((to):([A-Za-z0-9 _."@-]+<)?[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.]+>)?)(\\r))+)`;

// Note that this is not complete and very case specific i.e. can only handle a-z and not a-c.
function regexToMinDFASpec(str) {
  // Replace all A-Z with A2Z etc
  let combined_nosep = str
    .replaceAll("A-Z", A2Z_nosep)
    .replaceAll("a-z", a2z_nosep)
    .replaceAll("0-9", r0to9_nosep)
    .replaceAll("\\w", A2Z_nosep + r0to9_nosep + a2z_nosep);

  function addPipeInsideBrackets(str) {
    let result = "";
    let insideBrackets = false;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "[") {
        result += str[i];
        insideBrackets = true;
        continue;
      } else if (str[i] === "]") {
        insideBrackets = false;
      }
      result += insideBrackets ? "|" + str[i] : str[i];
    }
    return result.replaceAll("[|", "[").replaceAll("[", "(").replaceAll("]", ")");
  }

  function checkIfBracketsHavePipes(str) {
    let result = true;
    let insideBrackets = false;
    let indexAt = 0;
    for (let i = 0; i < str.length; i++) {
      if (indexAt >= str.length) break;
      if (str[indexAt] === "[") {
        insideBrackets = true;
        indexAt++;
        continue;
      } else if (str[indexAt] === "]") {
        insideBrackets = false;
      }
      if (insideBrackets) {
        if (str[indexAt] === "|") {
          indexAt++;
        } else {
          result = false;
          return result;
        }
      }
      if (str[indexAt] === "\\") {
        indexAt++;
      }
      indexAt++;
    }
    return result;
  }

  let combined;
  if (!checkIfBracketsHavePipes(combined_nosep)) {
    console.log("Adding pipes within brackets between everything!");
    combined = addPipeInsideBrackets(combined_nosep);
    console.log(checkIfBracketsHavePipes(combined), " if false, did not add brackets correctly!");
  } else {
    combined = combined_nosep;
  }

  return combined;
}

// TODO: Add to test
// let order_invariant_header_regex_raw = `(((\\n|^)(((from):([A-Za-z0-9 _."@-]+<)?[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.]+>)?|(subject:[a-zA-Z 0-9]+)?|((to):([A-Za-z0-9 _."@-]+<)?[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.]+>)?)(\\r))+)`;
// let raw_regex = order_invariant_header_regex_raw;
// let regex = regexToMinDFASpec(raw_regex);
// console.log(raw_regex, "\n", regex);

// let order_invariant_regex_raw = `((\\n|\x80|^)(((from):([A-Za-z0-9 _."@-]+<)?[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.]+>)?|(subject:[a-zA-Z 0-9]+)?|((to):([A-Za-z0-9 _."@-]+<)?[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.]+>)?|(dkim-signature:((a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z)=(0|1|2|3|4|5|6|7|8|9|a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z|A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|!|"|#|$|%|&|\'|\\(|\\)|\\*|\\+|,|-|.|/|:|<|=|>|\\?|@|[|\\\\|]|^|_|\`|{|\\||}|~| |\t|\n|\r|\x0B|\f)+; ))?)(\\r))+` // Uses a-z syntax instead of | for each char

// let old_regex = '(\r\n|\x80)(to|from):([A-Za-z0-9 _."@-]+<)?[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.]+>?\r\n';
// let regex = `(\n|^)(to|from):((${email_chars}|"|@| )+<)?(${email_chars})+@(${email_chars})+>?\r`;
// let regex = `(\r\n|^)(to|from):((${email_chars}|"|@| )+<)?(${email_chars})+@(${email_chars})+>?\r\n`;
// let regex = `\r\ndkim-signature:(${key_chars}=${catch_all_without_semicolon}+; )+bh=${base_64}+; `;
// console.log(regex);
// 'dkim-signature:((a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z)=(0|1|2|3|4|5|6|7|8|9|a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z|A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|!|"|#|$|%|&|\'|\\(|\\)|\\*|\\+|,|-|.|/|:|<|=|>|\\?|@|[|\\\\|]|^|_|`|{|\\||}|~| |\t|\n|\r|\x0B|\f)+; )+bh=(a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z|A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|0|1|2|3|4|5|6|7|8|9|\\+|/|=)+; '
// let regex = STRING_PRESELECTOR + `${word_char}+`;
// let regex = 'hello(0|1|2|3|4|5|6|7|8|9)+world';
// console.log(regex);
// console.log(Buffer.from(regex).toString('base64'));

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

// let gen_graph = function (regex) {
//     let nfa = regexToNfa(regex);
//     let dfa = minDfa(nfaToDfa(nfa));
//     var i,
//         j,
//         states = {},
//         nodes = [],
//         stack = [dfa],
//         symbols = [],
//         top;

//     while (stack.length > 0) {
//         top = stack.pop();
//         if (!states.hasOwnProperty(top.id)) {
//             states[top.id] = top;
//             top.nature = toNature(top.id);
//             nodes.push(top);
//             for (i = 0; i < top.edges.length; i += 1) {
//                 if (top.edges[i][0] !== "ϵ" && symbols.indexOf(top.edges[i][0]) < 0) {
//                     symbols.push(top.edges[i][0]);
//                 }
//                 stack.push(top.edges[i][1]);
//             }
//         }
//     }
//     nodes.sort(function (a, b) {
//         return a.nature - b.nature;
//     });
//     symbols.sort();

//     let graph = [];
//     for (let i = 0; i < nodes.length; i += 1) {
//         let curr = {};
//         curr.type = nodes[i].type;
//         curr.edges = {};
//         for (let j = 0; j < symbols.length; j += 1) {
//             if (nodes[i].trans.hasOwnProperty(symbols[j])) {
//                 curr.edges[symbols[j]] = nodes[i].trans[symbols[j]].nature - 1;
//             }
//         }
//         graph[nodes[i].nature - 1] = curr;
//     }

//     console.log(JSON.stringify(graph));
//     return JSON.stringify(graph);
// };

if (typeof require === "function") {
  exports.regexToMinDFASpec = regexToMinDFASpec;
  exports.toNature = toNature;
}
