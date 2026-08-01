import re

with open('src/data/regulations.ts', 'rb') as f:
    data = f.read()

# We need to find the second occurrence of:
# "id": "國軍退除役官兵就學補助生活津貼及獎勵辦法_pdf"
# And delete that entire object in the array.

content = data.decode('utf-8', errors='ignore')

pattern = r'\{\s*"id":\s*"國軍退除役官兵就學補助生活津貼及獎勵辦法_pdf"'
matches = list(re.finditer(pattern, content))

if len(matches) < 2:
    print(f"Error: Found only {len(matches)} occurrences. Cannot delete the second one.")
    exit(1)

# Get the second match
match = matches[1]
start = match.start()

# Find the matching closing brace for this object
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

# Now, we want to remove this object and any leading/trailing commas or spaces
# Let's inspect the text around it
prefix = content[:start]
suffix = content[end:]

# Clean up commas
# If there is a comma before the object, we can remove it. Or if there's a comma after.
# Let's see: typically, we have:
#   },
#   {
#     "id": "國軍退除役官兵就學補助生活津貼及獎勵辦法_pdf", ...
#   },
#   {
#     "id": "國軍退除役官兵輔導委員會...", ...
#   }
# If we remove the second object, we should check if there's a comma right after it.
# Let's print the prefix end and suffix start to be sure.

print("TEXT TO REMOVE:")
print(content[start:end][:200] + " ... " + content[start:end][-200:])

print("\nPREFIX END:")
print(repr(prefix[-20:]))
print("\nSUFFIX START:")
print(repr(suffix[:20]))

# Let's perform the cut
# If suffix starts with a comma, e.g. ",\n  {", we remove the comma.
# Or if prefix ends with a comma, e.g. "},\n  ", we remove the comma.
new_content = prefix
# Let's check if the object is followed by a comma
if suffix.strip().startswith(','):
    # Remove the comma and spaces
    comma_index = suffix.find(',')
    new_content += suffix[comma_index + 1:]
else:
    # If not followed by a comma, it might be the last element.
    # In that case, we should remove the leading comma from the prefix if it exists.
    # Let's check if prefix ends with a comma (ignoring whitespace)
    prefix_stripped = prefix.rstrip()
    if prefix_stripped.endswith(','):
        new_content = prefix_stripped[:-1] + suffix
    else:
        new_content += suffix

# Write the updated content back in UTF-8
# Wait, let's keep the original file's encoding (which was mostly UTF-8 but had the invalid byte at 80538).
# Wait, did we ignore errors when decoding? Yes.
# Let's write it back using utf-8 encoding.
# Wait! Let's check if there are other invalid bytes.
# If we write it back, let's check if the byte at 80538 is still there or if it was removed or replaced.
# In the original file, the byte at 80538 was inside the second occurrence!
# Let's check: is position 80538 inside the second occurrence?
# Yes! The second occurrence was from character 69615 to 75583 (when decoded). In bytes, it starts around 70000.
# So the invalid byte was inside the second occurrence.
# Thus, deleting the second occurrence will naturally remove the invalid byte!
# Let's check if it compiles after writing.
with open('src/data/regulations.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\nSuccessfully updated src/data/regulations.ts")
