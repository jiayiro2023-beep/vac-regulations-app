import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/regulations.ts', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Locate the array of objects
# Let's find matches for ID '國軍退除役官兵就學補助生活津貼及獎勵辦法_pdf'
matches = list(re.finditer(r'\{\s*"id":\s*"國軍退除役官兵就學補助生活津貼及獎勵辦法_pdf"', content))

for idx, match in enumerate(matches):
    start = match.start()
    brace_count = 0
    end = start
    for i in range(start, len(content)):
        if content[i] == '{':
            brace_count += 1
        elif content[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                end = i + 1
                break
    
    obj_str = content[start:end]
    print(f"\n========================================\nOCCURRENCE {idx+1}\n========================================")
    
    # We want to parse the JSON or extract the fields
    # Let's use regex to find articles
    # articles: [ { "title": "...", "content": "..." }, ... ]
    articles_part_match = re.search(r'"articles":\s*\[(.*?)\]\s*(?=\,\s*"|$)', obj_str, re.DOTALL)
    if not articles_part_match:
        print("No articles array found!")
        continue
        
    articles_part = articles_part_match.group(1)
    # Find all { "title": ..., "content": ... }
    article_items = re.findall(r'\{\s*"title":\s*"(.*?)",\s*"content":\s*"(.*?)"\s*\}', articles_part, re.DOTALL)
    print(f"Total articles: {len(article_items)}")
    for i, (title, art_content) in enumerate(article_items):
        clean_content = art_content.replace('\\n', '\n').replace('\\"', '"')
        print(f"\n--- Article {i+1}: {title} ---")
        print(clean_content)
