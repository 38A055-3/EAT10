const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const buttons = [
    {id: 'record-back-btn', screenId: 'record-screen'},
    {id: 'how-to-back-btn', screenId: 'how-to-play-screen'},
    {id: 'card-list-back-btn', screenId: 'card-list-screen'},
    {id: 'format-back-btn', screenId: 'format-screen'},
    {id: 'random-match-back-btn', screenId: 'random-match-screen'},
    {id: 'rule-back-btn', screenId: 'start-screen'},
    {id: 'lobby-back-btn', screenId: 'lobby-screen'},
    {id: 'game-title-btn', screenId: 'game-screen'}
];

for (const b of buttons) {
    const btnRegex = new RegExp(`\\s*<button id="${b.id}" class="title-return-btn"[^>]*>.*?</button>`);
    const match = html.match(btnRegex);
    if (!match) {
        console.log("Missing " + b.id);
        continue;
    }
    const btnHtml = match[0];
    
    // Remove it from the current position
    html = html.replace(btnHtml, '');
    
    // Find the end of the screen div
    const screenIndex = html.indexOf(`id="${b.screenId}"`);
    if (screenIndex === -1) {
        console.log("Missing " + b.screenId);
        continue;
    }
    
    const divStart = html.lastIndexOf('<div', screenIndex);
    let depth = 0;
    let i = divStart;
    while (i < html.length) {
        if (html.substring(i, i+4) === '<div') {
            depth++;
        } else if (html.substring(i, i+5) === '</div') {
            depth--;
            if (depth === 0) {
                // Insert the button HTML before the closing div
                html = html.substring(0, i) + btnHtml + '\n        ' + html.substring(i);
                break;
            }
        }
        i++;
    }
}

fs.writeFileSync('index.html', html);
console.log("Done");
