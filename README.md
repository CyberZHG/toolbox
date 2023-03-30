# Regex DFA Toolbox

Forked from [github.com/CyberZHG/toolbox/](https://github.com/CyberZHG/toolbox/). This fork is deployed at [mindfa.onrender.com/min_dfa](https://mindfa.onrender.com/min_dfa).

This lets you change the min dfa tool to add a little bit more parsing for simple regexes.

In order to live-rebuild with hot reload, run

```
python3 build.py --live
```

To just build once (i.e. for server deployment), run

```
python3 build.py
```

Note that you should only make modifications in the parts/ folder, the .html in the top level will be rebuilt. You may also need to add new js files to the \_header file for some reason.
