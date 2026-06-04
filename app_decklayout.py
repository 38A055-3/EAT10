import re

file_path = "app.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target = """    function renderDeckList() {
        ui.deckListGrid.innerHTML = '';
        const titleEl = document.querySelector('#deck-list-screen .category-title');"""

replacement = """    function renderDeckList() {
        ui.deckListGrid.innerHTML = '';
        
        // Change layout for English
        if (window.currentLang === 'en') {
            ui.deckListGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            ui.deckListGrid.style.maxWidth = '800px';
        } else {
            ui.deckListGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';
            ui.deckListGrid.style.maxWidth = '1300px';
        }

        const titleEl = document.querySelector('#deck-list-screen .category-title');"""

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Target not found")
