const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');
code = code.replace(/closeSettingsBtn\.addEventListener\('click', closeSettings\);/g, 
"closeSettingsBtn.addEventListener('click', closeSettings);\n\n    fetchGlobalRanking();");
fs.writeFileSync('app.js', code);
