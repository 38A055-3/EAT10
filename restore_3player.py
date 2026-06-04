import re

file_path = "app.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target1 = """    const playerCountBtns = {
        2: document.getElementById('player-count-2'),
        4: document.getElementById('player-count-4')
    };

    if (playerCountBtns[2]) {
        [2, 4].forEach(count => {"""

replacement1 = """    const playerCountBtns = {
        2: document.getElementById('player-count-2'),
        3: document.getElementById('player-count-3'),
        4: document.getElementById('player-count-4')
    };

    if (playerCountBtns[2]) {
        [2, 3, 4].forEach(count => {"""

if target1 in content:
    content = content.replace(target1, replacement1)

target2 = """                [2, 4].forEach(c => playerCountBtns[c].classList.remove('active'));"""

replacement2 = """                [2, 3, 4].forEach(c => playerCountBtns[c].classList.remove('active'));"""

if target2 in content:
    content = content.replace(target2, replacement2)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated app.js")
