import re

file_path = "app.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Currently in app.js:
#    let customDeckNames = JSON.parse(localStorage.getItem('eat10_custom_deck_names') || '[]');
#    for (let i = 0; i < 10; i++) {
#        if (!customDeckNames[i]) customDeckNames[i] = (window.t('deck_btn') + ' ' + (i + 1));
#    }

# We want to change the display logic to use window.t() for defaults, but not save defaults to localStorage if we can avoid it, 
# OR just dynamically translate when displaying if it matches ANY known default.
# The easiest way: when generating the list or names, if the name matches a known default (e.g., "デッキ 1", "Deck 1", "卡组 1", "덱 1") 
# or is empty, we force it to the CURRENT language's default.

replacement = """    let customDeckNames = JSON.parse(localStorage.getItem('eat10_custom_deck_names') || '[]');
    for (let i = 0; i < 10; i++) {
        let name = customDeckNames[i];
        if (!name || name.match(/^(デッキ|Deck|卡组|덱) \\d+$/)) {
            customDeckNames[i] = (window.t('deck_btn') + ' ' + (i + 1));
        }
    }"""

target = """    let customDeckNames = JSON.parse(localStorage.getItem('eat10_custom_deck_names') || '[]');
    for (let i = 0; i < 10; i++) {
        if (!customDeckNames[i]) customDeckNames[i] = (window.t('deck_btn') + ' ' + (i + 1));
    }"""

content = content.replace(target, replacement)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
