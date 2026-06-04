const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldHtml = `                <div class="final-score-box" style="position: relative; padding-top: 15px;">
                    <div id="final-player-rank" style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); font-weight: bold; color: #fbbf24; font-size: 1.2rem; text-shadow: 0 2px 4px rgba(0,0,0,0.8); display: none;">1位</div>
                    <span class="label">YOU</span>
                    <span id="final-player-score" class="score-value">5</span>
                </div>
                <div class="final-score-box" style="position: relative; padding-top: 15px;">
                    <div id="final-cpu1-rank" style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); font-weight: bold; color: #fbbf24; font-size: 1.2rem; text-shadow: 0 2px 4px rgba(0,0,0,0.8); display: none;">1位</div>
                    <span id="final-cpu1-name" class="label">CPU 1</span>
                    <span id="final-cpu1-score" class="score-value">0</span>
                </div>
                <div id="final-score-cpu2" class="final-score-box hidden" style="position: relative; padding-top: 15px;">
                    <div id="final-cpu2-rank" style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); font-weight: bold; color: #fbbf24; font-size: 1.2rem; text-shadow: 0 2px 4px rgba(0,0,0,0.8); display: none;">1位</div>
                    <span id="final-cpu2-name" class="label">CPU 2</span>
                    <span id="final-cpu2-score" class="score-value">0</span>
                </div>
                <div id="final-score-cpu3" class="final-score-box hidden" style="position: relative; padding-top: 15px;">
                    <div id="final-cpu3-rank" style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); font-weight: bold; color: #fbbf24; font-size: 1.2rem; text-shadow: 0 2px 4px rgba(0,0,0,0.8); display: none;">1位</div>
                    <span id="final-cpu3-name" class="label">CPU 3</span>
                    <span id="final-cpu3-score" class="score-value">0</span>
                </div>`;

const newHtml = `                <div class="final-score-box">
                    <div id="final-player-rank" style="font-weight: bold; font-size: 1.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.8); display: none; margin-bottom: 5px;">1位</div>
                    <span class="label">YOU</span>
                    <span id="final-player-score" class="score-value">5</span>
                </div>
                <div class="final-score-box">
                    <div id="final-cpu1-rank" style="font-weight: bold; font-size: 1.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.8); display: none; margin-bottom: 5px;">1位</div>
                    <span id="final-cpu1-name" class="label">CPU 1</span>
                    <span id="final-cpu1-score" class="score-value">0</span>
                </div>
                <div id="final-score-cpu2" class="final-score-box hidden">
                    <div id="final-cpu2-rank" style="font-weight: bold; font-size: 1.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.8); display: none; margin-bottom: 5px;">1位</div>
                    <span id="final-cpu2-name" class="label">CPU 2</span>
                    <span id="final-cpu2-score" class="score-value">0</span>
                </div>
                <div id="final-score-cpu3" class="final-score-box hidden">
                    <div id="final-cpu3-rank" style="font-weight: bold; font-size: 1.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.8); display: none; margin-bottom: 5px;">1位</div>
                    <span id="final-cpu3-name" class="label">CPU 3</span>
                    <span id="final-cpu3-score" class="score-value">0</span>
                </div>`;

if(code.includes(oldHtml)) {
    fs.writeFileSync('index.html', code.replace(oldHtml, newHtml));
    console.log("Replaced successfully.");
} else {
    console.log("Could not find html to replace.");
}
