const CARD_DATA = {
    1: { name: 'ハナ' }, 2: { name: 'チョウ' }, 3: { name: 'クモ' }, 4: { name: 'カエル' }, 5: { name: 'ネズミ' },
    6: { name: 'ヘビ' }, 7: { name: 'ネコ' }, 8: { name: 'イノシシ' }, 9: { name: 'クマ' }, 10: { name: 'ヒト' }
};

let playerDeck = [5];
let cpuDeck = [5];
let playerNextTurnModifier = 0;
let cpuNextTurnModifier = 0;

function testRound(originalPlayerVal, originalCpuVal) {
    let playerSkill = originalPlayerVal;
    let cpuSkill = originalCpuVal;
    let playerVal = originalPlayerVal;
    let cpuVal = originalCpuVal;
    
    if (playerSkill === 2 && playerDeck.length > 0) {
        playerVal = playerDeck[playerDeck.length - 1]; // peek top
        playerSkill = playerVal;
    }
    if (cpuSkill === 2 && cpuDeck.length > 0) {
        cpuVal = cpuDeck[cpuDeck.length - 1];
        cpuSkill = cpuVal;
    }

    let pBaseNum = playerVal;
    let cBaseNum = cpuVal;
    playerVal += playerNextTurnModifier;
    cpuVal += cpuNextTurnModifier;
    
    let effectivePlayerSkill = playerSkill;
    let effectiveCpuSkill = cpuSkill;

    let pWinByHana = (effectivePlayerSkill === 1 && cBaseNum === 10);
    let cWinByHana = (effectiveCpuSkill === 1 && pBaseNum === 10);

    let playerWins = false;
    let cpuWins = false;

    if (pWinByHana && !cWinByHana) {
        playerWins = true;
    } else if (cWinByHana && !pWinByHana) {
        cpuWins = true;
    } else if (playerVal === cpuVal) {
        console.log("Draw block entered!");
    } else {
        console.log("Else block entered!");
    }
}
testRound(2, 5);
