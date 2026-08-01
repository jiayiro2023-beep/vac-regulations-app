import re

with open('src/data/regulations.ts', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'\{\s*"id":\s*"([^"]+)",\s*"filename":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"category":\s*"([^"]+)"'
matches = re.findall(pattern, content)
for i, m in enumerate(matches):
    print(f"{i+1}. ID: {m[0]} | Title: {m[2]}")
