import re

file_path = "i18n.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('"3. プレイ人数"', '"プレイ人数"')
content = content.replace('"3. Player Count"', '"Player Count"')
content = content.replace('"3. 游玩人数"', '"游玩人数"')
content = content.replace('"3. 플레이 인원"', '"플레이 인원"')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
