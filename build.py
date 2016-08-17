import os

PARTS_FOLDER = 'parts'
MAGIC_TITLE = 'FC32C705'
MAGIC_BODY = '75CAF6CF'

with open('template.html') as reader:
    template = reader.read()

for file_name in os.listdir(PARTS_FOLDER):
    file_path = os.path.join(PARTS_FOLDER, file_name)
    with open(file_path) as reader:
        title = reader.readline().strip()[4:-3].strip()
        html = template.replace(MAGIC_TITLE, title).replace(MAGIC_BODY, reader.read())
    with open(file_name, 'w') as writer:
        writer.write(html)
