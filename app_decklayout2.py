import re

file_path = "app.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target1 = """    function renderDeckList() {
        ui.deckListGrid.innerHTML = '';
        
        // Change layout for English"""

replacement1 = """    function renderDeckList() {
        const bottomBackContainer = document.getElementById('deck-list-bottom-back-container');
        if (bottomBackContainer && bottomBackContainer.parentNode === ui.deckListGrid) {
            ui.deckListGrid.parentElement.appendChild(bottomBackContainer);
        }
        ui.deckListGrid.innerHTML = '';
        
        // Change layout for English"""

if target1 in content:
    content = content.replace(target1, replacement1)

target2 = """        for (let i = 0; i < 10; i++) {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.gap = '5px';"""

replacement2 = """        for (let i = 0; i < 10; i++) {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.gap = '5px';
            if (window.currentLang === 'en') {
                wrapper.style.transform = 'scale(0.85)';
                wrapper.style.transformOrigin = 'top center';
                wrapper.style.marginBottom = '-20px';
            }"""

if target2 in content:
    content = content.replace(target2, replacement2)

target3 = """            ui.deckListGrid.appendChild(wrapper);
        }
    }"""

replacement3 = """            ui.deckListGrid.appendChild(wrapper);
        }
        
        if (window.currentLang === 'en' && !isBattleDeckSelection) {
            if (bottomBackContainer) {
                ui.deckListGrid.appendChild(bottomBackContainer);
                bottomBackContainer.style.gridColumn = '3';
                bottomBackContainer.style.gridRow = '4';
                bottomBackContainer.style.marginTop = '0';
                bottomBackContainer.style.paddingBottom = '0';
                bottomBackContainer.style.alignItems = 'flex-start';
                bottomBackContainer.style.height = '100%';
            }
        } else {
            if (bottomBackContainer) {
                ui.deckListGrid.parentElement.appendChild(bottomBackContainer);
                bottomBackContainer.style.gridColumn = 'auto';
                bottomBackContainer.style.gridRow = 'auto';
                bottomBackContainer.style.marginTop = '40px';
                bottomBackContainer.style.paddingBottom = '60px';
                bottomBackContainer.style.alignItems = 'center';
                bottomBackContainer.style.height = 'auto';
            }
        }
    }"""

if target3 in content:
    content = content.replace(target3, replacement3)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
