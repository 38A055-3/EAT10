const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');
const oldFunc = `    function waitForPlayerTargetSelection(activeOpponents, message) {
        return new Promise((resolve) => {
            const msgEl = document.getElementById('target-selection-msg');
            const descEl = document.getElementById('target-selection-desc');
            
            if (descEl) descEl.textContent = message;
            if (msgEl) msgEl.classList.remove('hidden');
            
            const cleanup = () => {
                activeOpponents.forEach(op => {
                    op.el.classList.remove('target-selectable');
                    op.el.removeEventListener('click', op._clickHandler);
                });
                if (msgEl) msgEl.classList.add('hidden');
            };

            activeOpponents.forEach(op => {
                op.el.classList.add('target-selectable');
                op._clickHandler = () => {
                    cleanup();
                    resolve(op.id);
                };
                op.el.addEventListener('click', op._clickHandler);
            });
        });
    }`;
const newFunc = `    function waitForPlayerTargetSelection(activeOpponents, message) {
        return new Promise((resolve) => {
            const modal = document.getElementById('target-selection-modal');
            const title = document.getElementById('target-selection-title');
            const container = document.getElementById('target-selection-container');
            
            if (title) title.textContent = message;
            if (container) {
                container.innerHTML = '';
                activeOpponents.forEach(op => {
                    const btn = document.createElement('button');
                    btn.className = 'primary-btn';
                    let nameText = op.id === 'cpu' ? 'CPU 1' : (op.id === 'cpu2' ? 'CPU 2' : 'CPU 3');
                    if (isOnlineMode && op.id === 'cpu') nameText = opponentName;
                    btn.textContent = nameText;
                    btn.style.fontSize = '1.2rem';
                    btn.style.padding = '15px 30px';
                    
                    btn.addEventListener('click', () => {
                        modal.classList.add('hidden');
                        modal.style.opacity = '0';
                        modal.style.pointerEvents = 'none';
                        resolve(op.id);
                    });
                    
                    container.appendChild(btn);
                });
            }
            
            if (modal) {
                modal.classList.remove('hidden');
                modal.style.opacity = '1';
                modal.style.pointerEvents = 'auto';
            }
        });
    }`;
if(code.includes(oldFunc)) {
    fs.writeFileSync('app.js', code.replace(oldFunc, newFunc));
    console.log("Replaced successfully.");
} else {
    console.log("Could not find function to replace.");
}
