const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const screens = [
    {id: 'deck-list-screen', btn: 'deck-list-top-back-btn'},
    {id: 'record-screen', btn: 'record-back-btn'},
    {id: 'how-to-play-screen', btn: 'how-to-back-btn'},
    {id: 'card-list-screen', btn: 'card-list-back-btn'},
    {id: 'format-screen', btn: 'format-back-btn'},
    {id: 'random-match-screen', btn: 'random-match-back-btn'},
    {id: 'start-screen', btn: 'rule-back-btn'},
    {id: 'lobby-screen', btn: 'lobby-back-btn'},
    {id: 'game-screen', btn: 'game-title-btn'}
];

for (const screen of screens) {
    const btnRegex = new RegExp(`(\\s*<button id="${screen.btn}".*?</button>)`);
    const match = html.match(btnRegex);
    
    if (!match) {
        console.log(`Could not find button ${screen.btn}`);
        continue;
    }
    
    const btnHtml = match[1];
    
    // Remove original button
    html = html.replace(btnHtml, '');
    
    if (screen.id === 'deck-list-screen') {
        continue; // Already has a bottom button
    }
    
    const screenStart = html.indexOf(`id="${screen.id}"`);
    if (screenStart === -1) continue;
    
    const divStart = html.lastIndexOf('<div', screenStart);
    
    let depth = 0;
    let i = divStart;
    while (i < html.length) {
        if (html.startsWith('<div', i)) {
            depth++;
        } else if (html.startsWith('</div', i)) {
            depth--;
            if (depth === 0) {
                // Insert button here
                html = html.slice(0, i) + btnHtml + '\n        ' + html.slice(i);
                break;
            }
        }
        i++;
    }
}

fs.writeFileSync('index.html', html);
console.log('Done!');
