import os
from time import sleep, strftime, gmtime

TEMPLATE_FILE = 'template.html'
PARTS_FOLDER = 'parts'
MAGIC_TITLE = 'FC32C705'
MAGIC_BODY = '75CAF6CF'
MAGIC_CSS = 'EAC9ED81'
MAGIC_JS = 'BB33DD4B'
MAGIC_TEMPLATE = '3B893512'

def update(last={}):
    last_modified = os.path.getmtime(TEMPLATE_FILE)
    if MAGIC_TEMPLATE in last and last[MAGIC_TEMPLATE] != last_modified:
        last = {}
    if MAGIC_TEMPLATE not in last:
        with open(TEMPLATE_FILE) as reader:
            template = reader.read()
    last[MAGIC_TEMPLATE] = last_modified
    has_modification = False
    for file_name in os.listdir(PARTS_FOLDER):
        if file_name[-5:] != '.html':
            continue
        file_path = os.path.join(PARTS_FOLDER, file_name)
        last_modified = os.path.getmtime(file_path)
        if file_name in last and last_modified == last[file_name]:
            continue
        if file_name in last:
            print(last[file_name], last_modified)
        has_modification = True
        last[file_name] = last_modified
        print(strftime("%Y-%m-%d %H:%M:%S", gmtime()) + ' Starting: ' + file_name)
        with open(file_path) as reader:
            title = reader.readline().strip()[4:-3].strip()
            prefix = file_name[:-5]
            css_path = 'css/' + prefix + '.css'
            if not os.path.exists(css_path):
                with open(css_path, 'w') as writer:
                    pass
            js_path = 'js/' + prefix + '.js'
            if not os.path.exists(js_path):
                with open(js_path, 'w') as writer:
                    pass
            html = template.replace(MAGIC_TITLE, title) \
                           .replace(MAGIC_BODY, reader.read()) \
                           .replace(MAGIC_CSS, prefix) \
                           .replace(MAGIC_JS, prefix)
        with open(file_name, 'w') as writer:
            writer.write(html)
        print(strftime("%Y-%m-%d %H:%M:%S", gmtime()) + ' Finished: ' + file_name)
    if has_modification:
        print("Modification detected")
        with open('sitemap.txt', 'w') as writer:
            print("Writing sitemap")
            writer.write('https://mindfa.onrender.com/\n')
            for file_name in os.listdir(PARTS_FOLDER):
                if file_name[-5:] != '.html':
                    continue
                writer.write('https://mindfa.onrender.com/' + file_name[:-5] + '\n')
    print("Done!")
    return last

# If we are passed the arg parameter --live, then run update() in a while true loop
import sys

if sys.argv and sys.argv[1] == '--live':
    last = {}
    while True:
        last = update(last)
        sleep(3)

update()
