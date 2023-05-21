/*jslint browser: true*/
/*global require, exports*/
// import { STRING_PRESELECTOR } from "../src/helpers/constants.ts";
// import { minDfa, nfaToDfa, regexToNfa } from "./lexical";

/** This section defines helper regex components -- to edit the regex used, edit the return
 * of the test_regex function.
 * All of the relevant regexes are in the main repo README.
 */

// Helper components
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

const a2z_nosep = "abcdefghijklmnopqrstuvwxyz";
const A2Z_nosep = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const a2f_nosep = "abcdef";
const A2F_nosep = "ABCDEF";
const r0to9_nosep = "0123456789";

// TODO: Note that this is replicated code in lexical.js as well
// Note that ^ has to be manually replaced with \x80 in the regex
const escapeMap = { n: "\n", r: "\r", t: "\t", v: "\v", f: "\f", "^": String.fromCharCode(128) };
let whitespace = Object.values(escapeMap);
const slash_s = whitespace.join("|");

// The test_regex function whose return needs to be edited
// Note that in order to specify some strings in regex, we must use \\ to escape \'s i.e. in the \r\n being expressed as a \ then an r character, not a single \r character
function test_regex() {
  // let to_from_regex_old = '(\r\n|\x80)(to|from):([A-Za-z0-9 _."@-]+<)?[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.]+>?\r\n';
  // let regex = `\r\ndkim-signature:(${key_chars}=${catch_all_without_semicolon}+; )+bh=${base_64}+; `;
  // let order_invariant_regex_raw = `((\\n|\x80|^)(((from):([A-Za-z0-9 _."@-]+<)?[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.]+>)?|(subject:[a-zA-Z 0-9]+)?|((to):([A-Za-z0-9 _."@-]+<)?[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.]+>)?|(dkim-signature:((a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z)=(0|1|2|3|4|5|6|7|8|9|a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z|A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|!|"|#|$|%|&|\'|\\(|\\)|\\*|\\+|,|-|.|/|:|<|=|>|\\?|@|[|\\\\|]|^|_|`|{|\\||}|~| |\t|\n|\r|\x0B|\f)+; ))?)(\\r))+` // Uses a-z syntax instead of | for each char
  let email_address_regex = `([a-zA-Z0-9._%\\+-=]+@[a-zA-Z0-9.-]+)`;

  // ------- HEADER/SIGNATURE REGEX --------
  let order_invariant_header_regex_raw = `(((\\n|^)(((from):([A-Za-z0-9 _."@-]+<)?[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.]+>)?|(subject:[a-zA-Z 0-9]+)?|((to):([A-Za-z0-9 _."@-]+<)?[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.]+>)?)(\\r))+)\\n`;
  let sig_regex = `\r\ndkim-signature:(${key_chars}=${catch_all_without_semicolon}+; )+bh=${base_64}+; `;
  // let full_header_regex = order_invariant_header_regex_raw + sig_regex;
  // let raw_regex = order_invariant_header_regex_raw;
  // let regex = regexToMinDFASpec(raw_regex) + sig_regex;
  // console.log(format_regex_printable(sig_regex));

  // -------- SUBJECT REGEXES --------
  // This raw subject line (with \\ replaced with \) can be put into regexr.com to test new match strings and sanity check that it works
  // TODO: Other valid chars in email addresses: #$%!^/&*, outlined at https://ladedu.com/valid-characters-for-email-addresses-the-complete-list/ and in the RFC

  // -- SEND SPECIFIC REGEXES --
  // let send_specific_raw_subject_regex = `((\r\n)|^)subject:[Ss]end (\$)?[0-9]+(.[0-9]+)? [a-zA-Z]+ to (${email_address_regex}|0x[0-9a-fA_F]+)\r\n`;
  // let raw_subject_regex = `((\r\n)|^)subject:[a-zA-Z]+ (\\$)?[0-9]+(.[0-9]+)? [a-zA-Z]+ to (([a-zA-Z0-9._%\\+-=]+@[a-zA-Z0-9.-]+)|0x[0-9]+)\r\n`;
  // Input: ((\\r\\n)|^)subject:[Ss]end (\$)?[0-9]+(.[0-9]+)? [a-zA-Z]+ to (([a-zA-Z0-9._%\+-=]+@[a-zA-Z0-9.-]+)|0x[0-9]+)\\r\\n
  // This can be pasted into the first line of https://zkregex.com/min_dfa (after replacing \\ -> \)
  // ((\\r\\n)|\^)subject:[Ss]end (\$)?[0-9]+(\.[0-9])? (ETH|DAI|USDC|eth|usdc|dai) to (([a-zA-Z0-9\._%\+-]+@[a-zA-Z0-9\.-]+.[a-zA-Z0-9]+)|0x[0-9]+)\\r\\n
  // console.log(raw_subject_regex);

  // -- GENERIC COMMANDS --
  let raw_subject_regex = `((\r\n)|^)subject:[a-zA-Z]+ (\$)?[0-9]+(.[0-9]+)? [a-zA-Z]+ to (${email_address_regex}|0x[0-9a-fA_F]+)\r\n`;

  // -------- OTHER FIELD REGEXES --------
  let raw_from_regex = `(\r\n|^)from:([A-Za-z0-9 _.,"@-]+)<[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+>\r\n`;
  // let message_id_regex = `(\r\n|^)message-id:<[=@.\\+_-a-zA-Z0-9]+>\r\n`;
  let regex = regexToMinDFASpec(raw_subject_regex);
  // console.log(format_regex_printable(regex));

  // console.log(raw_regex, "\n", regex);
  // let order_invariant_header_regex_raw = `(((\\n|^)(((from):([A-Za-z0-9 _."@-]+<)?[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.]+>)?|(subject:[a-zA-Z 0-9]+)?|((to):([A-Za-z0-9 _."@-]+<)?[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.]+>)?)(\\r))+)`;
  // let order_invariant_full_regex_raw = `(dkim-signature:((a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z)=(0|1|2|3|4|5|6|7|8|9|a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z|A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|!|"|#|$|%|&|\'|\\(|\\)|\\*|\\+|,|-|.|/|:|<|=|>|\\?|@|[|\\\\|]|^|_|\`|{|\\||}|~| |\t|\n|\r|\x0B|\f)+; ))?)(\\r))+` // Uses a-z syntax instead of | for each char
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
  return regex;
}

// Escapes and prints regexes (might be buggy)
function format_regex_printable(s) {
  const escaped_string_json = JSON.stringify(s);
  const escaped_string = escaped_string_json.slice(1, escaped_string_json.length - 1);
  return escaped_string
    .replaceAll("\\\\\\\\", "\\")
    .replaceAll("\\\\", "\\")
    .replaceAll("\\|", "\\\\|")
    .replaceAll("/", "\\/")
    .replaceAll("\u000b", "\\♥")
    .replaceAll("|[|", "|\\[|")
    .replaceAll("|]|", "|\\]|")
    .replaceAll("|.|", "|\\.|")
    .replaceAll("|$|", "|\\$|")
    .replaceAll("|^|", "|\\^|");
  //   let escaped = escape_whitespace(escape_whitespace(s.replaceAll("\\\\", "ZZZZZZZ")));
  //   let fixed = escaped.replaceAll("\\(", "(").replaceAll("\\)", ")").replaceAll("\\+", "+").replaceAll("\\*", "*").replaceAll("\\?", "?");
}

// Note that this is not complete and very case specific i.e. can only handle a-z and a-f, and not a-c.
// This function expands [] sections to convert values for https://zkregex.com/min_dfa
// The input is a regex with [] and special characters (i.e. the first line of min_dfa tool)
// The output is expanded regexes without any special characters
function regexToMinDFASpec(str) {
  // Replace all A-Z with A2Z etc
  // TODO: Upstream this to min_dfa
  let combined_nosep = str
    .replaceAll("A-Z", A2Z_nosep)
    .replaceAll("a-z", a2z_nosep)
    .replaceAll("A-F", A2F_nosep)
    .replaceAll("a-f", a2f_nosep)
    .replaceAll("0-9", r0to9_nosep)
    .replaceAll("\\w", A2Z_nosep + r0to9_nosep + a2z_nosep + "_")
    .replaceAll("\\d", r0to9_nosep)
    .replaceAll("\\s", slash_s);
  // .replaceAll("\\w", A2Z_nosep + r0to9_nosep + a2z_nosep); // I think that there's also an underscore here

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
      let str_to_add = str[i];
      if (str[i] === "\\") {
        i++;
        str_to_add += str[i];
      }
      result += insideBrackets ? "|" + str_to_add : str_to_add;
    }
    return result.replaceAll("[|", "[").replaceAll("[", "(").replaceAll("]", ")");
  }

  //   function makeCurlyBracesFallback(str) {
  //     let result = "";
  //     let insideBrackets = false;
  //     for (let i = 0; i < str.length; i++) {
  //       if (str[i] === "{") {
  //         result += str[i];
  //         insideBrackets = true;
  //         continue;
  //       } else if (str[i] === "}") {
  //         insideBrackets = false;
  //       }
  //       result += insideBrackets ? "|" + str[i] : str[i];
  //     }
  //     return result.replaceAll("[|", "[").replaceAll("[", "(").replaceAll("]", ")");
  //   }

  function checkIfBracketsHavePipes(str) {
    let result = true;
    let insideBrackets = false;
    let insideParens = false;
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
      if (str[indexAt] === "(") {
        insideParens = true;
      } else if (str[indexAt] === ")") {
        insideParens = false;
      }
      if (insideBrackets) {
        if (str[indexAt] === "|") {
          indexAt++;
        } else {
          result = false;
          return result;
        }
      }
      if (!insideParens && str[indexAt] === "|") {
        console.log("Error: | outside of parens!");
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
    // console.log("Adding pipes within brackets between everything!");
    combined = addPipeInsideBrackets(combined_nosep);
    if (!checkIfBracketsHavePipes(combined)) {
      console.log("Did not add brackets correctly!");
    }
  } else {
    combined = combined_nosep;
  }

  return combined;
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

function printGraphForRegex(regex) {
  let nfa = regexToNfa(regex);
  let dfa = minDfa(nfaToDfa(nfa));

  var i,
    j,
    states = {},
    nodes = [],
    stack = [dfa],
    symbols = [],
    top;

  console.log("DFA: ", dfa);

  while (stack.length > 0) {
    top = stack.pop();
    if (!states.hasOwnProperty(top.id)) {
      states[top.id] = top;
      console.log("TOP: ", top, top.id);
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

  let graph = [];
  for (let i = 0; i < nodes.length; i += 1) {
    let curr = {};
    curr.type = nodes[i].type;
    curr.edges = {};
    for (let j = 0; j < symbols.length; j += 1) {
      if (nodes[i].trans.hasOwnProperty(symbols[j])) {
        curr.edges[symbols[j]] = nodes[i].trans[symbols[j]].nature - 1;
      }
    }
    graph[nodes[i].nature - 1] = curr;
  }

  console.log(JSON.stringify(graph));
  return JSON.stringify(graph);
}

// let regex = test_regex();
// printGraphForRegex(regex);

if (typeof require === "function") {
  exports.regexToMinDFASpec = regexToMinDFASpec;
  exports.toNature = toNature;
}
