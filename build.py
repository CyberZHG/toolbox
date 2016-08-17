import os
from time import sleep, strftime, gmtime

PARTS_FOLDER = 'parts'
MAGIC_TITLE = 'FC32C705'
MAGIC_BODY = '75CAF6CF'
MAGIC_CSS = 'EAC9ED81'
MAGIC_JS = 'BB33DD4B'

with open('template.html') as reader:
    template = reader.read()

last = {}
while True:
    sleep(3)
    for file_name in os.listdir(PARTS_FOLDER):
        if file_name[-5:] != '.html':
            continue
        file_path = os.path.join(PARTS_FOLDER, file_name)
        last_modified = os.path.getmtime(file_path)
        if file_name in last and last_modified == last[file_name]:
            continue
        last[file_name] = last_modified
        print(strftime("%Y-%m-%d %H:%M:%S", gmtime()) + ' ' + file_name)
        with open(file_path) as reader:
            title = reader.readline().strip()[4:-3].strip()
            prefix = file_name[:-5]
            html = template.replace(MAGIC_TITLE, title) \
                           .replace(MAGIC_BODY, reader.read()) \
                           .replace(MAGIC_CSS, prefix) \
                           .replace(MAGIC_JS, prefix)
        with open(file_name, 'w') as writer:
            writer.write(html)
