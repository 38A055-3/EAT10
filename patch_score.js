const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');
css = css.replace(/position: absolute;\s*bottom: 75px;\s*left: 50%;\s*transform: translateX\(-50%\);\s*width: 100%;\s*justify-content: center;\s*background: transparent;\s*border: none;\s*box-shadow: none;/g, 
'grid-column: 1 / 4; grid-row: 1; align-self: start; justify-self: center; margin-bottom: 0;');
fs.writeFileSync('style.css', css);
