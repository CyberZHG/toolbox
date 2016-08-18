import os
from time import sleep, strftime, gmtime

TEMPLATE_FILE = 'template.html'
PARTS_FOLDER = 'parts'
MAGIC_TITLE = 'FC32C705'
MAGIC_BODY = '75CAF6CF'
MAGIC_CSS = 'EAC9ED81'
MAGIC_JS = 'BB33DD4B'
MAGIC_TEMPLATE = '3B893512'

last = {}
while True:
    sleep(3)
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
        has_modification = True
        last[file_name] = last_modified
        print(strftime("%Y-%m-%d %H:%M:%S", gmtime()) + ' ' + file_name)
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
    if has_modification:
        with open('sitemap.txt', 'w') as writer:
            writer.write('https://cyberzhg.github.io/toolbox/\n')
            for file_name in os.listdir(PARTS_FOLDER):
                if file_name[-5:] != '.html':
                    continue
                writer.write('https://cyberzhg.github.io/toolbox/' + file_name[:-5] + '\n')
