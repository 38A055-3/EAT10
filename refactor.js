const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// The goal of this script is to replace the single cpu logic with an array of cpus logic.
// However, since it's hard to do AST manipulation perfectly in a quick script, 
// I will output the functions I need to rewrite.
