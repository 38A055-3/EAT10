document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.lang = window.currentLang; window.updateAllUIText();
    // --- State ---
    let playerHand = [];
    let cpuHand = [];
    let cpuDeck = [];
    let cpuHistory = [];
    let cpuScore = 0;
    
    // CPU2 State
    let cpu2Hand = [];
    let cpu2Deck = [];
    let cpu2History = [];
    let cpu2Score = 0;
    let cpu2PlayedCardVal = null;
    
    // CPU3 State
    let cpu3Hand = [];
    let cpu3Deck = [];
    let cpu3History = [];
    let cpu3Score = 0;
    let cpu3PlayedCardVal = null;
    
    // Core game state
    let playerDeck = [];
    let playerHistory = [];
    let playerScore = 0;
    let currentRound = 1;
    let isAnimating = false;
    let playerNextTurnModifier = 0;
    let cpuNextTurnModifier = 0;
    let cpu2NextTurnModifier = 0;
    let cpu3NextTurnModifier = 0;
    let selectedCardIndex = -1;
    let selectedCardValue = null;
    let isWinStreakMode = false;
    let winStreakCount = 0;
    const MAX_ROUNDS = 5;

    // --- Network State ---
    let peer = null;
    let conn = null;
    let isHost = false;
    let opponentName = 'CPU';
    let opponentIcon = '🤖';
    let opponentRating = 1500;
    let gameSeed = Math.floor(Math.random() * 1000000);
    
    function seededRandom() {
        if (!isOnlineMode) return Math.random();
        gameSeed = (gameSeed * 9301 + 49297) % 233280;
        return gameSeed / 233280;
    }
    let isOnlineMode = false;
    let myPlayedCardVal = null;
    let opponentPlayedCardVal = null;
    let mySpiderChoice = null;
    let opponentSpiderChoice = null;
    let opponentCustomDeck = null;
    let waitingForOpponentSpider = false;

    const CARD_DATA = {
        1: { 
            name: window.t('card_1_name'), 
            skillName: window.t('card_1_skill'), 
            ability: window.t('card_1_ability'),
            detailAbility: window.t('card_1_detail'),
            flavorText: window.t('card_1_flavor'),
            winningTargets: window.t('card_1_targets') || 'カエル、ヒト'
        },
        2: { 
            name: window.t('card_2_name'), 
            skillName: window.t('card_2_skill'), 
            ability: window.t('card_2_ability'),
            detailAbility: window.t('card_2_detail'),
            flavorText: window.t('card_2_flavor'),
            winningTargets: window.t('card_2_targets') || '出たカード次第'
        },
        3: { 
            name: window.t('card_3_name'), 
            skillName: window.t('card_3_skill'), 
            ability: window.t('card_3_ability'),
            detailAbility: window.t('card_3_detail'),
            flavorText: window.t('card_3_flavor'),
            winningTargets: window.t('card_3_targets') || 'ハナ、カエル'
        },
        4: { 
            name: window.t('card_4_name'), 
            skillName: window.t('card_4_skill'), 
            ability: window.t('card_4_ability'),
            detailAbility: window.t('card_4_detail'),
            flavorText: window.t('card_4_flavor'),
            winningTargets: window.t('card_4_targets') || 'ネズミ、ヘビ、クマ、ヒト'
        },
        5: { 
            name: window.t('card_5_name'), 
            skillName: window.t('card_5_skill'), 
            ability: window.t('card_5_ability'),
            detailAbility: window.t('card_5_detail'),
            flavorText: window.t('card_5_flavor'),
            winningTargets: window.t('card_5_targets') || 'ハナ、クモ'
        },
        6: { 
            name: window.t('card_6_name'), 
            skillName: window.t('card_6_skill'), 
            ability: window.t('card_6_ability'),
            detailAbility: window.t('card_6_detail'),
            flavorText: window.t('card_6_flavor'),
            winningTargets: window.t('card_6_targets') || 'ハナ、クモ、ネズミ、ネコ、クマ、ヒト'
        },
        7: { 
            name: window.t('card_7_name'), 
            skillName: window.t('card_7_skill'), 
            ability: window.t('card_7_ability'),
            detailAbility: window.t('card_7_detail'),
            flavorText: window.t('card_7_flavor'),
            winningTargets: window.t('card_7_targets') || 'ハナ、クモ、カエル、ネズミ'
        },
        8: { 
            name: window.t('card_8_name'), 
            skillName: window.t('card_8_skill'), 
            ability: window.t('card_8_ability'),
            detailAbility: window.t('card_8_detail'),
            flavorText: window.t('card_8_flavor'),
            winningTargets: window.t('card_8_targets') || 'ハナ、クモ、カエル、ネズミ、ヘビ、ネコ'
        },
        9: { 
            name: window.t('card_9_name'), 
            skillName: window.t('card_9_skill'), 
            ability: window.t('card_9_ability'),
            detailAbility: window.t('card_9_detail'),
            flavorText: window.t('card_9_flavor'),
            winningTargets: window.t('card_9_targets') || 'ハナ、クモ、ネズミ、ネコ、イノシシ'
        },
        10: { 
            name: window.t('card_10_name'), 
            skillName: window.t('card_10_skill'), 
            ability: window.t('card_10_ability'),
            detailAbility: window.t('card_10_detail'),
            flavorText: window.t('card_10_flavor'),
            winningTargets: window.t('card_10_targets') || 'ハナ、クモ、ネズミ、ネコ、イノシシ、クマ'
        }
    };

    // --- DOM Elements ---
    const screens = {
        title: document.getElementById('title-screen'),
        myRoom: document.getElementById('my-room-screen'),
        format: document.getElementById('format-screen'),
        guestWait: document.getElementById('guest-wait-screen'),
        randomMatch: document.getElementById('random-match-screen'),
        start: document.getElementById('start-screen'),
        lobby: document.getElementById('lobby-screen'),
        game: document.getElementById('game-screen'),
        end: document.getElementById('end-screen'),
        deckBuilder: document.getElementById('deck-builder-screen'),
        deckList: document.getElementById('deck-list-screen'),
        record: document.getElementById('record-screen'),
        howToPlay: document.getElementById('how-to-play-screen'),
        cardList: document.getElementById('card-list-screen')
    };

    const ui = {
        deckListGrid: document.getElementById('deck-list-grid'),
        playerHand: document.getElementById('player-hand'),
        cpuHand: document.getElementById('cpu1-hand'),
        cpu2Hand: document.getElementById('cpu2-hand'),
        cpu3Hand: document.getElementById('cpu3-hand'),
        playerHistory: document.getElementById('player-history'),
        cpuHistory: document.getElementById('cpu1-history'),
        cpu2History: document.getElementById('cpu2-history'),
        cpu3History: document.getElementById('cpu3-history'),
        playerScore: document.getElementById('player-score'),
        cpuScore: document.getElementById('cpu1-score'),
        cpu2Score: document.getElementById('cpu2-score'),
        cpu3Score: document.getElementById('cpu3-score'),
        roundNumber: document.getElementById('round-number'),
        playerPlayedSlot: document.getElementById('player-played-card'),
        cpuPlayedSlot: document.getElementById('cpu1-played-card'),
        cpu2PlayedSlot: document.getElementById('cpu2-played-card'),
        cpu3PlayedSlot: document.getElementById('cpu3-played-card'),
        roundResult: document.getElementById('round-result'),
        finalPlayerScore: document.getElementById('final-player-score'),
        finalCpuScore: document.getElementById('final-cpu1-score'),
        finalCpu2Score: document.getElementById('final-cpu2-score'),
        finalCpu3Score: document.getElementById('final-cpu3-score'),
        finalTitle: document.getElementById('final-result-title'),
        cpuDeckCount: document.getElementById('cpu1-deck-count'),
        cpu2DeckCount: document.getElementById('cpu2-deck-count'),
        cpu3DeckCount: document.getElementById('cpu3-deck-count'),
        playerDeckCount: document.getElementById('player-deck-count'),
        cpuDeckUi: document.getElementById('cpu1-deck-ui'),
        cpu2DeckUi: document.getElementById('cpu2-deck-ui'),
        cpu3DeckUi: document.getElementById('cpu3-deck-ui'),
        playerDeckUi: document.getElementById('player-deck-ui'),
        readyBtn: document.getElementById('ready-btn'),
        eatShout: document.getElementById('eat-shout'),
        playerModifierBadge: document.getElementById('player-modifier-badge'),
        cpuModifierBadge: document.getElementById('cpu1-modifier-badge'),
        cpu2ModifierBadge: document.getElementById('cpu2-modifier-badge'),
        cpu3ModifierBadge: document.getElementById('cpu3-modifier-badge'),
        hoverInfoPanel: document.getElementById('hover-info-panel'),
        hoverCardPreview: document.getElementById('hover-card-preview'),
        winStreakIndicator: document.getElementById('win-streak-indicator'),
        winStreakCountUI: document.getElementById('win-streak-count'),
        nextMatchBtn: document.getElementById('next-match-btn'),
        deckSaveBtn: document.getElementById('deck-save-btn'),
        deckListBattleBtnContainer: document.getElementById('deck-list-battle-btn-container'),
        deckListStartBattleBtn: document.getElementById('deck-list-start-battle-btn')
    };

    // --- Deck Builder State ---
    let isBattleDeckSelection = false;
    let currentMode = 'normal';
    let currentCustomDeck = [];
    let currentCpuCustomDeck = [];
    let currentCpu2CustomDeck = [];
    let currentCpu3CustomDeck = [];
    
    let customDecks = [];
    const savedDecks = localStorage.getItem('eat10_custom_decks');
    if (savedDecks) {
        try { customDecks = JSON.parse(savedDecks); } 
        catch(e) { customDecks = Array(10).fill(null); }
        
        if (customDecks.every(deck => deck === null)) {
            customDecks[0] = { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1 };
        }
    } else {
        // 移行措置
        const oldDeck = localStorage.getItem('eat10_custom_deck');
        customDecks = Array(10).fill(null);
        if (oldDeck) { 
            try { customDecks[0] = JSON.parse(oldDeck); } catch(e){} 
        } else {
            customDecks[0] = { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1 };
        }
    }

    let customDeckNames = [];
    const savedNames = localStorage.getItem('eat10_custom_deck_names');
    if (savedNames) {
        try { customDeckNames = JSON.parse(savedNames); } 
        catch(e) { customDeckNames = Array(10).fill(''); }
    }
    for (let i = 0; i < 10; i++) {
        let name = customDeckNames[i];
        if (!name || name.match(/^(デッキ|Deck|卡组|덱) \d+$/)) {
            customDeckNames[i] = (window.t('deck_btn') + ' ' + (i + 1));
        }
    }
    
    let activeDeckIndex = parseInt(localStorage.getItem('eat10_active_deck_index') || '0', 10);
    let editingDeckIndex = -1;
    let deckBuilderCounts = {};

    let playerName = localStorage.getItem('eat10_player_name') || window.t('player_name_fallback');
    const playerNameInput = document.getElementById('player-name-input');
    const playerIconBtn = document.getElementById('player-icon-btn');
    const playerNameTooltip = document.getElementById('player-name-tooltip');
    
    if (playerNameInput) {
        playerNameInput.value = playerName;
        playerNameInput.addEventListener('input', (e) => {
            playerName = e.target.value.trim() || window.t('player_name_fallback');
            localStorage.setItem('eat10_player_name', playerName);
            if (playerIconBtn) playerIconBtn.title = playerName;
            if (playerNameTooltip) playerNameTooltip.innerText = playerName;
        });
    }

    const availableIcons = ['ha.png', 'tyo.png', 'ku.png', 'ka.png', 'ne.png', 'he.png', 'ne2.png', 'i.png', 'ku2.png', 'hi.png'];
    const availableColors = [
        'rgba(239, 68, 68, 0.8)',    // 赤 (Red)
        'rgba(59, 130, 246, 0.8)',   // 青 (Blue)
        'rgba(234, 179, 8, 0.8)',    // 黄 (Yellow)
        'rgba(34, 197, 94, 0.8)',    // 緑 (Green)
        'rgba(168, 85, 247, 0.8)',   // 紫 (Purple)
        'rgba(249, 115, 22, 0.8)',   // オレンジ (Orange)
        'rgba(14, 165, 233, 0.8)',   // 水色 (Light Blue)
        'rgba(236, 72, 153, 0.8)',   // ピンク (Pink)
        'rgba(0, 0, 0, 0.8)',        // 黒 (Black)
        'rgba(255, 255, 255, 0.8)'   // 白 (White)
    ];
    let playerIcon = localStorage.getItem('eat10_player_icon') || 'ha.png';
    let playerColor = localStorage.getItem('eat10_player_color') || 'rgba(0,0,0,0.5)';
    const iconSelectionContainer = document.getElementById('icon-selection-container');
    const colorSelectionContainer = document.getElementById('color-selection-container');
    
    if (playerIconBtn) {
        playerIconBtn.title = playerName;
        if (playerNameTooltip) playerNameTooltip.innerText = playerName;
        playerIconBtn.style.background = playerColor;
        playerIconBtn.innerHTML = `<img src="${playerIcon}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%; transform: scale(1.15);">`;
        playerIconBtn.addEventListener('click', () => {
            switchScreen('myRoom');
        });
    }

    function updateIconSelectionBackgrounds() {
        if (!iconSelectionContainer) return;
        Array.from(iconSelectionContainer.children).forEach(child => {
            child.style.background = playerColor;
        });
    }

    if (iconSelectionContainer) {
        iconSelectionContainer.innerHTML = '';
        availableIcons.forEach(iconPath => {
            const btn = document.createElement('div');
            btn.style.width = '60px';
            btn.style.height = '60px';
            btn.style.borderRadius = '50%';
            btn.style.cursor = 'pointer';
            btn.style.border = playerIcon === iconPath ? '3px solid #a855f7' : '2px solid rgba(255,255,255,0.2)';
            btn.style.background = playerColor;
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.overflow = 'hidden';
            btn.style.transition = 'background 0.2s';
            btn.innerHTML = `<img src="${iconPath}" style="width: 100%; height: 100%; object-fit: contain; transform: scale(1.15);">`;
            
            btn.addEventListener('click', () => {
                playerIcon = iconPath;
                localStorage.setItem('eat10_player_icon', playerIcon);
                if (playerIconBtn) {
                    playerIconBtn.innerHTML = `<img src="${playerIcon}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%; transform: scale(1.15);">`;
                }
                Array.from(iconSelectionContainer.children).forEach((child, index) => {
                    child.style.border = availableIcons[index] === playerIcon ? '3px solid #a855f7' : '2px solid rgba(255,255,255,0.2)';
                });
            });
            iconSelectionContainer.appendChild(btn);
        });
    }

    if (colorSelectionContainer) {
        colorSelectionContainer.innerHTML = '';
        availableColors.forEach(colorVal => {
            const btn = document.createElement('div');
            btn.style.width = '40px';
            btn.style.height = '40px';
            btn.style.borderRadius = '50%';
            btn.style.cursor = 'pointer';
            btn.style.background = colorVal;
            btn.style.border = playerColor === colorVal ? '3px solid #a855f7' : '2px solid rgba(255,255,255,0.2)';
            btn.style.transition = 'transform 0.2s';
            
            btn.addEventListener('mouseover', () => btn.style.transform = 'scale(1.1)');
            btn.addEventListener('mouseout', () => btn.style.transform = 'scale(1)');
            
            btn.addEventListener('click', () => {
                playerColor = colorVal;
                localStorage.setItem('eat10_player_color', playerColor);
                if (playerIconBtn) {
                    playerIconBtn.style.background = playerColor;
                }
                updateIconSelectionBackgrounds();
                Array.from(colorSelectionContainer.children).forEach((child, index) => {
                    child.style.border = availableColors[index] === playerColor ? '3px solid #a855f7' : '2px solid rgba(255,255,255,0.2)';
                });
            });
            colorSelectionContainer.appendChild(btn);
        });
    }

    const myRoomBackBtn = document.getElementById('my-room-back-btn');
    if (myRoomBackBtn) {
        myRoomBackBtn.addEventListener('click', () => {
            switchScreen('title');
        });
    }

    function saveDecks() {
        localStorage.setItem('eat10_custom_decks', JSON.stringify(customDecks));
        localStorage.setItem('eat10_active_deck_index', activeDeckIndex.toString());
        localStorage.setItem('eat10_custom_deck_names', JSON.stringify(customDeckNames));
    }

    let selectedRule = 'normal';
    let selectedMode = 'simple';
    let selectedFormat = 'single';
    let selectedPlayerCount = 2;

    let stats = { totalBattles: 0, wins: 0, losses: 0, draws: 0, maxWinStreak: 0, rating: 1500 };
    const savedStats = localStorage.getItem('eat10_stats');
    if (savedStats) {
        try { 
            stats = JSON.parse(savedStats); 
            if (typeof stats.rating === 'undefined') stats.rating = 1500;
        } catch(e) {}
    }

    function saveStats() {
        localStorage.setItem('eat10_stats', JSON.stringify(stats));
    }

    // --- Initialization ---
    document.getElementById('title-battle-btn').addEventListener('click', () => {
        switchScreen('format');
    });
    
    document.getElementById('title-deck-btn').addEventListener('click', () => {
        isBattleDeckSelection = false;
        switchScreen('deckList');
        renderDeckList();
    });

    const titleRecordBtn = document.getElementById('title-record-btn');
    if (titleRecordBtn) {
        titleRecordBtn.addEventListener('click', () => {
            document.getElementById('stat-total-battles').textContent = stats.totalBattles;
            document.getElementById('stat-wins').textContent = stats.wins;
            document.getElementById('stat-losses').textContent = stats.losses;
            document.getElementById('stat-draws').textContent = stats.draws;
            document.getElementById('stat-max-streak').textContent = stats.maxWinStreak;
            
            const statRatingEl = document.getElementById('stat-rating');
            if (statRatingEl) statRatingEl.textContent = Math.floor(stats.rating || 1500);
            
            // Reset to streak leaderboard on open
            currentLeaderboardMode = 'streak';
            updateLeaderboardToggleUI();
            
            switchScreen('record');
        });
    }

    let currentLeaderboardMode = 'streak'; // 'streak' or 'rate'
    const rankingStreakBtn = document.getElementById('ranking-streak-btn');
    const rankingRateBtn = document.getElementById('ranking-rate-btn');

    function updateLeaderboardToggleUI() {
        if (rankingStreakBtn && rankingRateBtn) {
            if (currentLeaderboardMode === 'streak') {
                rankingStreakBtn.style.background = 'rgba(251, 191, 36, 0.2)';
                rankingStreakBtn.style.color = '#fbbf24';
                rankingRateBtn.style.background = 'transparent';
                rankingRateBtn.style.color = 'white';
            } else {
                rankingRateBtn.style.background = 'rgba(59, 130, 246, 0.2)';
                rankingRateBtn.style.color = '#3b82f6';
                rankingStreakBtn.style.background = 'transparent';
                rankingStreakBtn.style.color = 'white';
            }
        }
        fetchGlobalRanking();
    }

    if (rankingStreakBtn) {
        rankingStreakBtn.addEventListener('click', () => {
            if (currentLeaderboardMode !== 'streak') {
                currentLeaderboardMode = 'streak';
                updateLeaderboardToggleUI();
            }
        });
    }
    
    if (rankingRateBtn) {
        rankingRateBtn.addEventListener('click', () => {
            if (currentLeaderboardMode !== 'rate') {
                currentLeaderboardMode = 'rate';
                updateLeaderboardToggleUI();
            }
        });
    }

    const recordBackBtn = document.getElementById('record-back-btn');
    if (recordBackBtn) {
        recordBackBtn.addEventListener('click', () => {
            switchScreen('title');
        });
    }

    let previousScreenForHelp = 'title';

    const titleRulesBtn = document.getElementById('title-rules-btn');
    if (titleRulesBtn) {
        titleRulesBtn.addEventListener('click', () => {
            previousScreenForHelp = 'title';
            switchScreen('howToPlay');
        });
    }

    const gameHelpBtn = document.getElementById('game-help-btn');
    if (gameHelpBtn) {
        gameHelpBtn.addEventListener('click', () => {
            previousScreenForHelp = 'game';
            switchScreen('howToPlay');
        });
    }

    const howToBackBtn = document.getElementById('how-to-back-btn');
    if (howToBackBtn) {
        howToBackBtn.addEventListener('click', () => {
            switchScreen(previousScreenForHelp);
        });
    }

    const howToCardListBtn = document.getElementById('how-to-card-list-btn');
    if (howToCardListBtn) {
        howToCardListBtn.addEventListener('click', () => {
            switchScreen('cardList');
            renderAllCards();
        });
    }

    const cardListBackBtn = document.getElementById('card-list-back-btn');
    if (cardListBackBtn) {
        cardListBackBtn.addEventListener('click', () => {
            switchScreen('howToPlay');
        });
    }

    function renderAllCards() {
        const grid = document.getElementById('all-cards-grid');
        if (!grid) return;
        grid.innerHTML = '';
        
        for (let i = 1; i <= 10; i++) {
            const cardWrap = document.createElement('div');
            cardWrap.className = 'deck-card-wrapper';
            cardWrap.style.alignItems = 'center';
            cardWrap.style.gap = '15px';
            
            const preview = document.createElement('div');
            preview.className = 'hover-preview-card deck-preview';
            preview.dataset.value = i;
            preview.style.cursor = 'default';
            // Disable scale animation on hover for pure listing
            preview.style.transition = 'none';
            
            const info = document.createElement('div');
            info.style.color = 'white';
            info.style.textAlign = 'center';
            info.innerHTML = `<div class="card-name-btn" style="font-weight:bold; color: #a855f7; font-size: 1.2rem; margin-top: 5px; cursor: pointer; padding: 5px; background: rgba(0,0,0,0.3); border-radius: 4px; display: inline-block;">${CARD_DATA[i].name} <span style="font-size: 0.8rem; color: #94a3b8;">(詳細)</span></div>`;
            
            info.querySelector('.card-name-btn').addEventListener('click', () => {
                openCardDetailModal(i);
            });
            
            cardWrap.appendChild(preview);
            cardWrap.appendChild(info);
            
            grid.appendChild(cardWrap);
        }
    }

    const cardDetailModal = document.getElementById('card-detail-modal');
    const closeCardDetailBtn = document.getElementById('close-card-detail-btn');
    if (closeCardDetailBtn) {
        closeCardDetailBtn.addEventListener('click', () => {
            cardDetailModal.style.opacity = '0';
            cardDetailModal.style.pointerEvents = 'none';
        });
    }

    function openCardDetailModal(cardId) {
        const data = CARD_DATA[cardId];
        if (!data) return;
        
        const modal = document.getElementById('card-detail-modal');
        document.getElementById('detail-card-preview').dataset.value = cardId;
        document.getElementById('detail-card-name').textContent = data.name;
        document.getElementById('detail-card-power').textContent = cardId;
        document.getElementById('detail-card-skill').textContent = data.skillName;
        
        // 詳細情報があれば表示、なければプレースホルダー
        document.getElementById('detail-card-ability').textContent = data.detailAbility || data.ability.replace(/<[^>]*>?/gm, ''); // タグ除去した簡易テキスト
        
        const flavorEl = document.getElementById('detail-card-flavor');
        if (data.flavorText) {
            flavorEl.style.display = 'block';
            flavorEl.textContent = data.flavorText;
        } else {
            flavorEl.style.display = 'none';
        }
        

        
        modal.classList.remove('hidden');
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'auto';
    }

    document.getElementById('deck-list-back-btn').addEventListener('click', () => {
        if (isBattleDeckSelection) {
            switchScreen('start');
        } else {
            switchScreen('title');
        }
    });

    document.getElementById('deck-list-top-back-btn').addEventListener('click', () => {
        if (isBattleDeckSelection) {
            switchScreen('start');
        } else {
            switchScreen('title');
        }
    });

    document.getElementById('rule-back-btn').addEventListener('click', () => {
        if (peer) {
            peer.destroy();
            peer = null;
        }
        conn = null;
        switchScreen('format');
    });

    const formatBackBtn = document.getElementById('format-back-btn');
    if (formatBackBtn) {
        formatBackBtn.addEventListener('click', () => {
            switchScreen('title');
        });
    }

    const randomMatchBackBtn = document.getElementById('random-match-back-btn');
    if (randomMatchBackBtn) {
        randomMatchBackBtn.addEventListener('click', () => {
            if (peer) { peer.destroy(); peer = null; }
            if (scanPeer) { scanPeer.destroy(); scanPeer = null; }
            switchScreen('format');
        });
    }
    
    function showDeckPreviewModal(deckArray, titleText = window.t('check_btn')) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0'; overlay.style.left = '0';
        overlay.style.width = '100vw'; overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.85)';
        overlay.style.zIndex = '1000';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        
        let html = `<div style="background: rgba(30, 41, 59, 0.95); padding: 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); max-width: 90vw; width: 600px; max-height: 80vh; overflow-y: auto;">
            <h2 style="color: white; margin-bottom: 20px; text-align: center;">${titleText}</h2>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-bottom: 20px;">`;
            
        const sortedDeck = [...deckArray].sort((a,b) => a - b);
        sortedDeck.forEach(val => {
            html += `<div class="hover-preview-card" data-value="${val}" style="width:100px; height:140px; transform:none; margin:0;"></div>`;
        });
        
        html += `</div>
            <div style="text-align: center;"><button id="close-deck-view" style="padding: 10px 30px; background: #475569; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">閉じる</button></div>
        </div>`;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        document.getElementById('close-deck-view').onclick = () => {
            document.body.removeChild(overlay);
        };
    }

    // Rule selection buttons
    const ruleBtns = {
        normal: document.getElementById('normal-rule-btn'),
        deck: document.getElementById('deck-rule-btn')
    };

    ruleBtns.normal.addEventListener('click', () => {
        selectedRule = 'normal';
        ruleBtns.normal.classList.add('active');
        ruleBtns.deck.classList.remove('active');
        if (isOnlineMode && isHost && conn) conn.send({ type: 'sync_ui', target: 'rule', value: 'normal' });
    });

    ruleBtns.deck.addEventListener('click', () => {
        selectedRule = 'deck';
        ruleBtns.deck.classList.add('active');
        ruleBtns.normal.classList.remove('active');
        if (isOnlineMode && isHost && conn) conn.send({ type: 'sync_ui', target: 'rule', value: 'deck' });
    });

    // Mode selection buttons
    const modeBtns = {
        simple: document.getElementById('simple-mode-btn'),
        streak: document.getElementById('streak-mode-btn')
    };

    modeBtns.simple.addEventListener('click', () => {
        selectedMode = 'simple';
        modeBtns.simple.classList.add('active');
        modeBtns.streak.classList.remove('active');
        if (isOnlineMode && isHost && conn) conn.send({ type: 'sync_ui', target: 'mode', value: 'simple' });
    });

    modeBtns.streak.addEventListener('click', () => {
        selectedMode = 'streak';
        modeBtns.streak.classList.add('active');
        modeBtns.simple.classList.remove('active');
        if (isOnlineMode && isHost && conn) conn.send({ type: 'sync_ui', target: 'mode', value: 'streak' });
    });

    // Player Count selection buttons
    const playerCountBtns = {
        2: document.getElementById('player-count-2'),
        3: document.getElementById('player-count-3'),
        4: document.getElementById('player-count-4')
    };

    if (playerCountBtns[2]) {
        [2, 3, 4].forEach(count => {
            playerCountBtns[count].addEventListener('click', () => {
                selectedPlayerCount = count;
                [2, 3, 4].forEach(c => playerCountBtns[c].classList.remove('active'));
                playerCountBtns[count].classList.add('active');
                if (isOnlineMode && isHost && conn) conn.send({ type: 'sync_ui', target: 'players', value: count });
            });
        });
    }

    function resetStartScreenUI() {
        const startBtn = document.getElementById('play-start-btn');
        if (startBtn) {
            startBtn.textContent = window.t('battle_start_btn');
            startBtn.disabled = false;
            startBtn.style.opacity = '1';
            startBtn.style.cursor = 'pointer';
        }
        document.querySelectorAll('.select-toggle').forEach(btn => {
            btn.style.pointerEvents = '';
        });
    }

    function resetLobbyScreenUI() {
        document.getElementById('lobby-action-selection').classList.remove('hidden');
        document.getElementById('lobby-container').classList.add('hidden');
        document.getElementById('host-panel').classList.add('hidden');
        document.getElementById('join-panel').classList.add('hidden');
        
        const createBtn = document.getElementById('create-room-btn');
        if (createBtn) {
            createBtn.disabled = false;
            createBtn.textContent = 'CREATE ROOM';
            createBtn.classList.remove('hidden');
        }
        
        document.getElementById('host-waiting-area').classList.add('hidden');
        document.getElementById('join-room-input').value = '';
        document.getElementById('join-error-msg').classList.add('hidden');
        
        const joinBtn = document.getElementById('join-room-btn');
        if (joinBtn) {
            joinBtn.disabled = false;
            joinBtn.textContent = 'JOIN ROOM';
        }
    }

    // Format selection buttons
    const formatBtns = {
        single: document.getElementById('single-format-btn'),
        online: document.getElementById('online-format-btn'),
        random: document.getElementById('random-format-btn')
    };

    if (formatBtns.single && formatBtns.online) {
        formatBtns.single.addEventListener('click', () => {
            resetStartScreenUI();
            selectedFormat = 'single';
            isOnlineMode = false;
            const hostInfo = document.getElementById('host-lobby-info');
            if (hostInfo) hostInfo.classList.add('hidden');
            
            const playerSelectionSection = document.getElementById('player-selection-section');
            if (playerSelectionSection) playerSelectionSection.style.display = 'block';
            
            if (playerCountBtns[3]) playerCountBtns[3].style.display = 'block';
            if (playerCountBtns[4]) playerCountBtns[4].style.display = 'block';
            switchScreen('start');
        });

        formatBtns.online.addEventListener('click', () => {
            resetStartScreenUI();
            resetLobbyScreenUI();
            selectedFormat = 'online';
            isOnlineMode = true;
            if (playerCountBtns[3]) playerCountBtns[3].style.display = 'block';
            if (playerCountBtns[4]) playerCountBtns[4].style.display = 'block';
            switchScreen('lobby');
        });

        if (formatBtns.random) {
            formatBtns.random.addEventListener('click', () => {
                resetStartScreenUI();
                selectedFormat = 'random';
                isOnlineMode = true;
                selectedRule = 'normal';
                
                if (playerCountBtns[3]) playerCountBtns[3].style.display = 'none';
                if (playerCountBtns[4]) playerCountBtns[4].style.display = 'none';
                selectedPlayerCount = 2;
                [2, 3, 4].forEach(c => playerCountBtns[c].classList.remove('active'));
                if (playerCountBtns[2]) playerCountBtns[2].classList.add('active');
                
                switchScreen('start');
            });
        }
    }

    // Battle Start!
    document.getElementById('play-start-btn').addEventListener('click', () => {
        if (selectedMode === 'simple') {
            isWinStreakMode = false;
        } else {
            isWinStreakMode = true;
            winStreakCount = 0;
        }
        currentMode = selectedRule;
        
        if (selectedFormat === 'random') {
            if (selectedRule === 'deck') {
                isBattleDeckSelection = true;
                switchScreen('deckList');
                renderDeckList();
            } else {
                switchScreen('randomMatch');
                startRandomMatch('normal');
            }
            return;
        }

        if (isOnlineMode) {
            if (selectedRule === 'deck') {
                opponentCustomDeck = null;
                currentCustomDeck = null;
                conn.send({ type: 'deck_selection_phase', mode: selectedMode });
                isBattleDeckSelection = true;
                switchScreen('deckList');
                renderDeckList();
            } else {
                conn.send({ type: 'start', rule: 'normal', mode: selectedMode });
                startGame('normal');
            }
            return;
        }

        if (selectedRule === 'deck') {
            isBattleDeckSelection = true;
            switchScreen('deckList');
            renderDeckList();
        } else {
            startGame('normal');
        }
    });

    // --- Online Lobby Logic ---
    document.getElementById('lobby-back-btn').addEventListener('click', () => {
        const actionSelection = document.getElementById('lobby-action-selection');
        if (actionSelection && actionSelection.classList.contains('hidden')) {
            // We are inside host or join panel. Go back to action selection.
            if (peer) {
                peer.destroy();
                peer = null;
            }
            actionSelection.classList.remove('hidden');
            document.getElementById('lobby-container').classList.add('hidden');
            
            const createBtn = document.getElementById('create-room-btn');
            createBtn.disabled = false;
            createBtn.textContent = 'CREATE ROOM';
            createBtn.classList.remove('hidden');
            document.getElementById('host-waiting-area').classList.add('hidden');
            
            document.getElementById('join-room-input').value = '';
            document.getElementById('join-error-msg').classList.add('hidden');
            
            const joinBtn = document.getElementById('join-room-btn');
            if (joinBtn) {
                joinBtn.disabled = false;
                joinBtn.textContent = 'JOIN ROOM';
            }
        } else {
            // Go back to format screen
            if (peer) {
                peer.destroy();
                peer = null;
            }
            switchScreen('format');
        }
    });

    document.getElementById('show-host-panel-btn').addEventListener('click', () => {
        document.getElementById('lobby-action-selection').classList.add('hidden');
        document.getElementById('lobby-container').classList.remove('hidden');
        document.getElementById('host-panel').classList.remove('hidden');
        document.getElementById('join-panel').classList.add('hidden');
    });

    document.getElementById('show-join-panel-btn').addEventListener('click', () => {
        document.getElementById('lobby-action-selection').classList.add('hidden');
        document.getElementById('lobby-container').classList.remove('hidden');
        document.getElementById('host-panel').classList.add('hidden');
        document.getElementById('join-panel').classList.remove('hidden');
    });

    document.getElementById('create-room-btn').addEventListener('click', () => {
        const createBtn = document.getElementById('create-room-btn');
        createBtn.disabled = true;
        createBtn.textContent = 'Creating...';
        
        const roomId = Math.floor(100000 + Math.random() * 900000).toString();
        peer = new Peer(roomId);

        peer.on('open', (id) => {
            document.getElementById('host-room-id').textContent = id;
            createBtn.classList.add('hidden');
            document.getElementById('host-waiting-area').classList.remove('hidden');
            isHost = true;
        });

        peer.on('connection', (connection) => {
            conn = connection;
            setupConnection();
        });

        peer.on('error', (err) => {
            alert('Failed to create room: ' + err.type);
            createBtn.disabled = false;
            createBtn.textContent = 'CREATE ROOM';
        });
    });

    document.getElementById('join-room-btn').addEventListener('click', () => {
        const joinInput = document.getElementById('join-room-input').value.trim();
        const joinBtn = document.getElementById('join-room-btn');
        const errorMsg = document.getElementById('join-error-msg');
        
        if (joinInput.length !== 6) {
            errorMsg.textContent = window.t('invalid_room_id');
            errorMsg.classList.remove('hidden');
            return;
        }
        
        errorMsg.classList.add('hidden');
        joinBtn.disabled = true;
        joinBtn.textContent = 'Connecting...';

        peer = new Peer();
        peer.on('open', () => {
            conn = peer.connect(joinInput);
            conn.on('open', () => {
                isHost = false;
                setupConnection();
            });
            conn.on('error', () => {
                errorMsg.textContent = window.t('conn_failed');
                errorMsg.classList.remove('hidden');
                joinBtn.disabled = false;
                joinBtn.textContent = 'JOIN ROOM';
            });
        });
        peer.on('error', (err) => {
            errorMsg.textContent = window.t('conn_error') + err.type;
            errorMsg.classList.remove('hidden');
            joinBtn.disabled = false;
            joinBtn.textContent = 'JOIN ROOM';
        });
    });

    // --- Random Matchmaking Logic ---
    let scanPeer = null;
    let currentRoomIndex = 1;
    let isMatched = false;
    let randomMatchRule = 'normal';

    function startRandomMatch(rule) {
        randomMatchRule = rule;
        isMatched = false;
        currentRoomIndex = 1;
        const statusEl = document.getElementById('random-match-status');
        if (statusEl) statusEl.textContent = '対戦相手を探しています...';
        
        const descEl = document.querySelector('#random-match-screen .mode-desc');
        if (descEl) {
            descEl.textContent = rule === 'deck' ? window.t('rule_deck_simple') : window.t('rule_normal_simple');
        }
        
        scanNextRoom();
    }

    function scanNextRoom() {
        if (selectedFormat !== 'random') return;
        if (currentRoomIndex > 100) {
            alert(window.t('no_match_found'));
            switchScreen('start');
            return;
        }
        
        if (scanPeer) { scanPeer.destroy(); scanPeer = null; }
        
        scanPeer = new Peer();
        scanPeer.on('open', () => {
            if (selectedFormat !== 'random') return;
            const targetId = 'eat10_public_' + randomMatchRule + '_' + currentRoomIndex;
            const tempConn = scanPeer.connect(targetId, { reliable: true });
            let handled = false;
            
            tempConn.on('open', () => {
                handled = true;
                tempConn.on('data', (data) => {
                    if (data.type === 'busy') {
                        tempConn.close();
                        currentRoomIndex++;
                        scanNextRoom();
                    } else if (data.type === 'accept') {
                        isMatched = true;
                        peer = scanPeer;
                        conn = tempConn;
                        isHost = false;
                        setupConnection();
                    }
                });
            });

            scanPeer.on('error', (err) => {
                if (!handled && err.type === 'peer-unavailable') {
                    handled = true;
                    scanPeer.destroy();
                    scanPeer = null;
                    if (selectedFormat === 'random') {
                        becomeRoomHost(targetId);
                    }
                }
            });
            
            setTimeout(() => {
                if (!handled) {
                    handled = true;
                    currentRoomIndex++;
                    scanNextRoom();
                }
            }, 3000);
        });
    }

    function becomeRoomHost(roomId) {
        if (peer) { peer.destroy(); }
        peer = new Peer(roomId);
        
        peer.on('open', () => {
            if (selectedFormat !== 'random') {
                peer.destroy();
                return;
            }
            const statusEl = document.getElementById('random-match-status');
            if (statusEl) statusEl.textContent = window.t('room_created_waiting');
        });
        
        peer.on('connection', (tempConn) => {
            if (isMatched) {
                tempConn.on('open', () => {
                    tempConn.send({ type: 'busy' });
                    setTimeout(() => tempConn.close(), 500);
                });
                return;
            }
            
            isMatched = true;
            conn = tempConn;
            isHost = true;
            
            conn.on('open', () => {
                conn.send({ type: 'accept' });
                setupConnection();
            });
        });
        
        peer.on('error', (err) => {
            if (err.type === 'unavailable-id') {
                currentRoomIndex++;
                scanNextRoom();
            }
        });
    }

    function setupConnection() {
        conn.on('data', handleNetworkData);
        conn.on('close', () => {
            alert('Opponent disconnected.');
            switchScreen('title');
        });

        // Send handshake
        const handshakeData = {
            type: 'init',
            name: playerName,
            icon: playerIcon,
            rating: stats.rating || 1500,
            seed: gameSeed
        };
        if (selectedFormat === 'random' && currentMode === 'deck') {
            handshakeData.deck = currentCustomDeck;
        }

        conn.send(handshakeData);
    }

    function handleNetworkData(data) {
        if (data.type === 'init') {
            opponentName = data.name || 'Opponent';
            opponentIcon = data.icon || 'ha.png';
            opponentRating = data.rating || 1500;
            if (data.deck) opponentCustomDeck = data.deck;
            if (data.seed !== undefined && !isHost) {
                gameSeed = data.seed;
            }
            
            if (isHost) {
                if (selectedFormat === 'random') {
                    setTimeout(() => {
                        conn.send({ type: 'start', rule: currentMode, mode: 'simple', deck: currentCustomDeck });
                        startGame(currentMode, currentMode === 'deck' ? currentCustomDeck : null);
                    }, 500);
                } else {
                    const hostInfo = document.getElementById('host-lobby-info');
                    const hostOppName = document.getElementById('host-lobby-opponent-name');
                    if (hostInfo && hostOppName) {
                        hostInfo.classList.remove('hidden');
                        hostOppName.textContent = window.t('opponent_joined').replace('{0}', opponentName);
                    }
                    switchScreen('start');
                }
            } else {
                if (selectedFormat !== 'random') {
                    const hostInfo = document.getElementById('host-lobby-info');
                    const hostOppName = document.getElementById('host-lobby-opponent-name');
                    if (hostInfo && hostOppName) {
                        hostInfo.classList.remove('hidden');
                        hostOppName.textContent = window.t('host_label').replace('{0}', opponentName);
                    }
                    
                    const startBtn = document.getElementById('play-start-btn');
                    if (startBtn) {
                        startBtn.textContent = window.t('host_wait');
                        startBtn.disabled = true;
                        startBtn.style.opacity = '0.7';
                        startBtn.style.cursor = 'not-allowed';
                    }
                    
                    document.querySelectorAll('.select-toggle').forEach(btn => {
                        btn.style.pointerEvents = 'none';
                    });
                    
                    switchScreen('start');
                }
            }
        } else if (data.type === 'start') {
            currentMode = data.rule;
            isWinStreakMode = (data.mode === 'streak');
            if (currentMode === 'deck' && data.deck) {
                opponentCustomDeck = data.deck;
            }
            startGame(currentMode, currentMode === 'deck' ? currentCustomDeck : null);
        } else if (data.type === 'deck_selection_phase') {
            currentMode = 'deck';
            isWinStreakMode = (data.mode === 'streak');
            opponentCustomDeck = null;
            currentCustomDeck = null;
            isBattleDeckSelection = true;
            switchScreen('deckList');
            renderDeckList();
        } else if (data.type === 'deck_ready') {
            opponentCustomDeck = data.deck;
            if (currentCustomDeck && currentCustomDeck.length === 10) {
                startGame('deck', currentCustomDeck);
            }
        } else if (data.type === 'play_card') {
            opponentPlayedCardVal = data.value;
            checkBothPlayed();
        } else if (data.type === 'spider_choice') {
            opponentSpiderChoice = data;
            if (waitingForOpponentSpider) {
                waitingForOpponentSpider = false;
                resolveOpponentSpiderChoice();
            }
        } else if (data.type === 'play_again') {
            if (confirm(opponentName + ' wants to play again. Accept?')) {
                startGame(currentMode, currentMode === 'deck' ? currentCustomDeck : null);
            } else {
                switchScreen('title');
            }
        } else if (data.type === 'sync_ui') {
            if (data.target === 'rule') {
                selectedRule = data.value;
                document.getElementById('normal-rule-btn').classList.remove('active');
                document.getElementById('deck-rule-btn').classList.remove('active');
                if (data.value === 'normal') document.getElementById('normal-rule-btn').classList.add('active');
                if (data.value === 'deck') document.getElementById('deck-rule-btn').classList.add('active');
            } else if (data.target === 'mode') {
                selectedMode = data.value;
                document.getElementById('simple-mode-btn').classList.remove('active');
                document.getElementById('streak-mode-btn').classList.remove('active');
                if (data.value === 'simple') document.getElementById('simple-mode-btn').classList.add('active');
                if (data.value === 'streak') document.getElementById('streak-mode-btn').classList.add('active');
            } else if (data.target === 'players') {
                selectedPlayerCount = data.value;
                [2, 3, 4].forEach(c => {
                    const btn = document.getElementById('player-count-' + c);
                    if (btn) btn.classList.remove('active');
                });
                const activeBtn = document.getElementById('player-count-' + data.value);
                if (activeBtn) activeBtn.classList.add('active');
            }
        }
    }

    document.getElementById('restart-btn').addEventListener('click', () => {
        if (isOnlineMode) {
            if (selectedFormat === 'random') {
                if (peer) {
                    peer.destroy();
                    peer = null;
                }
                switchScreen('start');
            } else {
                if (isHost) {
                    switchScreen('start');
                } else {
                    const guestWaitMsg = document.getElementById('guest-wait-message');
                    const guestLobbyHostName = document.getElementById('guest-lobby-host-name');
                    if (guestLobbyHostName) guestLobbyHostName.textContent = opponentName;
                    if (guestWaitMsg) guestWaitMsg.textContent = window.t('setting_rules');
                    switchScreen('guestWait');
                }
            }
        } else {
            startGame(currentMode, currentMode === 'deck' ? currentCustomDeck : null);
        }
    });

    document.getElementById('next-match-btn').addEventListener('click', () => {
        if (isOnlineMode && conn) {
            conn.send({ type: 'play_again' });
            ui.finalTitle.textContent = window.t('waiting_participants');
            document.getElementById('next-match-btn').classList.add('hidden');
        } else {
            startGame(currentMode, currentMode === 'deck' ? currentCustomDeck : null);
        }
    });

    document.getElementById('deck-back-btn').addEventListener('click', () => {
        switchScreen('deckList');
    });
    
    document.getElementById('deck-save-btn').addEventListener('click', () => {
        customDecks[editingDeckIndex] = { ...deckBuilderCounts };
        saveDecks();
        switchScreen('deckList');
        renderDeckList();
    });

    document.getElementById('deck-list-start-battle-btn').addEventListener('click', () => {
        const deckData = customDecks[activeDeckIndex];
        if (!deckData) {
            alert(window.t('empty_deck_error').replace('{0}', (activeDeckIndex + 1)));
            return;
        }
        currentCustomDeck = [];
        for (let i = 1; i <= 10; i++) {
            for (let j = 0; j < (deckData[i] || 0); j++) {
                currentCustomDeck.push(i);
            }
        }
        if (currentCustomDeck.length !== 10) {
            alert(window.t('invalid_deck_error'));
            return;
        }
        
        if (selectedFormat === 'random') {
            currentMode = 'deck';
            switchScreen('randomMatch');
            startRandomMatch('deck');
            return;
        }
        
        if (isOnlineMode) {
            conn.send({ type: 'deck_ready', deck: currentCustomDeck });
            if (opponentCustomDeck && opponentCustomDeck.length === 10) {
                startGame('deck', currentCustomDeck);
            } else {
                switchScreen('guestWait');
            }
        } else {
            startGame('deck', currentCustomDeck);
        }
    });

    document.getElementById('game-title-btn').addEventListener('click', () => {
        switchScreen('title');
    });

    document.getElementById('end-title-btn').addEventListener('click', () => {
        switchScreen('title');
    });

    function renderDeckList() {
        const bottomBackContainer = document.getElementById('deck-list-bottom-back-container');
        if (bottomBackContainer && bottomBackContainer.parentNode === ui.deckListGrid) {
            ui.deckListGrid.parentElement.appendChild(bottomBackContainer);
        }
        ui.deckListGrid.innerHTML = '';
        
        // Change layout for English, but keep 1fr on mobile
        if (window.innerWidth <= 700) {
            ui.deckListGrid.style.gridTemplateColumns = '1fr';
            ui.deckListGrid.style.maxWidth = '100%';
        } else if (window.currentLang === 'en') {
            ui.deckListGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            ui.deckListGrid.style.maxWidth = '1100px';
        } else {
            ui.deckListGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';
            ui.deckListGrid.style.maxWidth = '1300px';
        }

        const titleEl = document.querySelector('#deck-list-screen .category-title');
        if (titleEl) {
            titleEl.textContent = isBattleDeckSelection ? 'バトルで使用するデッキを選択' : 'デッキ一覧';
        }
        const topBackBtn = document.getElementById('deck-list-top-back-btn');

        if (isBattleDeckSelection) {
            ui.deckListBattleBtnContainer.classList.remove('hidden');
            if (topBackBtn) topBackBtn.classList.remove('hidden');
            if (bottomBackContainer) bottomBackContainer.classList.add('hidden');
        } else {
            ui.deckListBattleBtnContainer.classList.add('hidden');
            if (topBackBtn) topBackBtn.classList.add('hidden');
            if (bottomBackContainer) bottomBackContainer.classList.remove('hidden');
        }
        
        for (let i = 0; i < 10; i++) {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.gap = '5px';
            if (window.currentLang === 'en') {
                wrapper.style.transform = 'scale(0.85)';
                wrapper.style.transformOrigin = 'top center';
                wrapper.style.marginBottom = '-20px';
            }

            const isActive = (i === activeDeckIndex);
            const deckData = customDecks[i];
            
            const header = document.createElement('div');
            header.className = 'slot-header';
            header.style.borderBottom = 'none';
            header.style.marginBottom = '0';
            header.style.paddingBottom = '0';
            header.style.minHeight = '48px';
            header.style.alignItems = 'flex-end';
            
            const nameContainer = document.createElement('div');
            nameContainer.style.display = 'flex';
            nameContainer.style.alignItems = 'center';
            nameContainer.style.gap = '4px';
            
            const nameSpan = document.createElement('span');
            const nameStr = customDeckNames[i] || '';
            if (nameStr.length > 8) {
                nameSpan.innerHTML = nameStr.slice(0, 8) + '<br>' + nameStr.slice(8);
            } else {
                nameSpan.textContent = nameStr;
            }
            nameSpan.style.display = 'inline-block';
            nameSpan.style.fontSize = '0.95rem';
            nameSpan.style.lineHeight = '1.2';
            nameContainer.appendChild(nameSpan);
            
            const renameBtn = document.createElement('button');
            renameBtn.textContent = '✎';
            renameBtn.style.background = 'transparent';
            renameBtn.style.border = 'none';
            renameBtn.style.color = 'rgba(255,255,255,0.6)';
            renameBtn.style.cursor = 'pointer';
            renameBtn.style.fontSize = '1.1rem';
            renameBtn.onclick = () => {
                let newName = prompt(window.t('input_deck_name'), customDeckNames[i]);
                if (newName !== null) {
                    newName = newName.trim();
                    if (newName.length > 10) {
                        newName = newName.substring(0, 10);
                    }
                    if (newName !== '') {
                        customDeckNames[i] = newName;
                        saveDecks();
                        renderDeckList();
                    }
                }
            };
            nameContainer.appendChild(renameBtn);
            header.appendChild(nameContainer);
            
            if (isActive) {
                const badge = document.createElement('span');
                badge.className = 'active-badge';
                badge.textContent = window.t('in_use');
                header.appendChild(badge);
            }
            
            const slot = document.createElement('div');
            slot.className = `deck-slot ${isActive ? 'active' : ''}`;
            
            const content = document.createElement('div');
            content.className = 'slot-content';
            
            if (deckData) {
                if (!isActive) {
                    const selectBtn = document.createElement('button');
                    selectBtn.className = 'slot-action-btn slot-btn-select';
                    selectBtn.textContent = window.t('use_this');
                    selectBtn.onclick = () => {
                        activeDeckIndex = i;
                        saveDecks();
                        renderDeckList();
                    };
                    content.appendChild(selectBtn);
                }
                
                const actionsRow = document.createElement('div');
                actionsRow.className = 'slot-actions-row';
                
                const viewBtn = document.createElement('button');
                viewBtn.className = 'slot-action-btn slot-btn-view';
                viewBtn.textContent = window.t('check_btn');
                viewBtn.onclick = () => {
                    let deckArray = [];
                    for(let k=1; k<=10; k++) {
                        for(let j=0; j<(deckData[k]||0); j++) {
                            deckArray.push(k);
                        }
                    }
                    showDeckPreviewModal(deckArray, (customDeckNames[i] || `デッキ${i+1}`) + ' の中身');
                };
                actionsRow.appendChild(viewBtn);
                
                const editBtn = document.createElement('button');
                editBtn.className = 'slot-action-btn slot-btn-edit';
                editBtn.textContent = window.t('edit_btn');
                editBtn.onclick = () => {
                    editingDeckIndex = i;
                    deckBuilderCounts = { ...deckData };
                    openDeckBuilder();
                };
                actionsRow.appendChild(editBtn);
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'slot-action-btn slot-btn-delete';
                deleteBtn.textContent = window.t('delete_btn');
                deleteBtn.onclick = () => {
                    if (confirm((window.t('deck_btn') + ' ' + (i + 1)) + ' を本当に削除しますか？')) {
                        customDecks[i] = null;
                        if (activeDeckIndex === i) {
                            activeDeckIndex = 0; // とりあえず0に戻す
                        }
                        saveDecks();
                        renderDeckList();
                    }
                };
                actionsRow.appendChild(deleteBtn);
                
                content.appendChild(actionsRow);
            } else {
                const createBtn = document.createElement('button');
                createBtn.className = 'slot-action-btn slot-btn-create';
                createBtn.textContent = window.t('create_new_btn');
                createBtn.onclick = () => {
                    editingDeckIndex = i;
                    deckBuilderCounts = {};
                    for(let k=1; k<=10; k++) deckBuilderCounts[k] = 0;
                    openDeckBuilder();
                };
                content.appendChild(createBtn);
            }
            
            slot.appendChild(content);
            wrapper.appendChild(header);
            wrapper.appendChild(slot);
            ui.deckListGrid.appendChild(wrapper);
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
    }

    function openDeckBuilder() {
        switchScreen('deckBuilder');
        renderDeckBuilder();
    }

    function renderDeckBuilder() {
        const grid = document.getElementById('deck-builder-grid');
        grid.innerHTML = '';
        let totalCount = 0;

        for (let i = 1; i <= 10; i++) {
            totalCount += deckBuilderCounts[i];
        }

        for (let i = 1; i <= 10; i++) {
            const cardWrap = document.createElement('div');
            cardWrap.className = 'deck-card-wrapper';
            
            const preview = document.createElement('div');
            preview.className = 'hover-preview-card deck-preview';
            preview.dataset.value = i;
            
            const controls = document.createElement('div');
            controls.className = 'deck-controls';
            
            const minusBtn = document.createElement('button');
            minusBtn.className = 'deck-btn';
            minusBtn.textContent = '−';
            minusBtn.disabled = deckBuilderCounts[i] === 0;
            minusBtn.onclick = () => {
                if (deckBuilderCounts[i] > 0) {
                    deckBuilderCounts[i]--;
                    renderDeckBuilder();
                }
            };
            
            const countDisplay = document.createElement('div');
            countDisplay.className = 'deck-card-count';
            countDisplay.textContent = deckBuilderCounts[i];
            
            const plusBtn = document.createElement('button');
            plusBtn.className = 'deck-btn';
            plusBtn.textContent = '＋';
            plusBtn.disabled = deckBuilderCounts[i] >= 3 || totalCount >= 10;
            plusBtn.onclick = () => {
                if (deckBuilderCounts[i] < 3 && totalCount < 10) {
                    deckBuilderCounts[i]++;
                    renderDeckBuilder();
                }
            };
            
            controls.appendChild(minusBtn);
            controls.appendChild(countDisplay);
            controls.appendChild(plusBtn);
            
            cardWrap.appendChild(preview);
            cardWrap.appendChild(controls);
            grid.appendChild(cardWrap);
        }
        
        const countBadge = document.getElementById('deck-total-count');
        countBadge.textContent = totalCount;
        const badgeContainer = countBadge.parentElement;
        const startBtn = document.getElementById('deck-save-btn');
        
        if (totalCount === 10) {
            badgeContainer.classList.add('valid');
            startBtn.disabled = false;
        } else {
            badgeContainer.classList.remove('valid');
            startBtn.disabled = true;
        }
    }

    function generateCpuCustomDeck() {
        let deck = [];
        const counts = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0};
        while(deck.length < 10) {
            let val = Math.floor(seededRandom() * 10) + 1;
            if (counts[val] < 3) {
                counts[val]++;
                deck.push(val);
            }
        }
        return deck;
    }

    const viewDeckBtn = document.getElementById('view-deck-btn');
    if (viewDeckBtn) {
        viewDeckBtn.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0'; overlay.style.left = '0';
            overlay.style.width = '100vw'; overlay.style.height = '100vh';
            overlay.style.background = 'rgba(0,0,0,0.85)';
            overlay.style.zIndex = '1000';
            overlay.style.display = 'flex';
            overlay.style.flexDirection = 'column';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            
            let html = `<div style="background: rgba(30, 41, 59, 0.95); padding: 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); max-width: 90vw; width: 600px; max-height: 80vh; overflow-y: auto;">
                <h2 style="color: white; margin-bottom: 20px; text-align: center;">あなたが組んだデッキ</h2>
                <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-bottom: 20px;">`;
                
            const sortedDeck = [...currentCustomDeck].sort((a,b) => a - b);
            sortedDeck.forEach(val => {
                html += `<div class="hover-preview-card" data-value="${val}" style="width:100px; height:140px; transform:none; margin:0;"></div>`;
            });
            
            html += `</div>
                <div style="text-align: center;"><button id="close-deck-view" style="padding: 10px 30px; background: #475569; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">閉じる</button></div>
            </div>`;
            
            overlay.innerHTML = html;
            document.body.appendChild(overlay);
            
            document.getElementById('close-deck-view').onclick = () => {
                document.body.removeChild(overlay);
            };
        });
    }

    const viewCpuDeckBtn1 = document.getElementById('view-cpu1-deck-btn');
    const viewCpuDeckBtn2 = document.getElementById('view-cpu2-deck-btn');
    const viewCpuDeckBtn3 = document.getElementById('view-cpu3-deck-btn');
    
    const showCpuDeckHandler = (e) => {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0'; overlay.style.left = '0';
        overlay.style.width = '100vw'; overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.85)';
        overlay.style.zIndex = '1000';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        
        let html = `<div style="background: rgba(30, 41, 59, 0.95); padding: 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); max-width: 90vw; width: 600px; max-height: 80vh; overflow-y: auto;">
            <h2 style="color: white; margin-bottom: 20px; text-align: center;">相手のデッキ</h2>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-bottom: 20px;">`;
            
        let targetDeck = currentCpuCustomDeck;
        if (e.currentTarget.id === 'view-cpu2-deck-btn') targetDeck = currentCpu2CustomDeck;
        else if (e.currentTarget.id === 'view-cpu3-deck-btn') targetDeck = currentCpu3CustomDeck;
            
        const sortedDeck = [...targetDeck].sort((a,b) => a - b);
        sortedDeck.forEach(val => {
            html += `<div class="hover-preview-card" data-value="${val}" style="width:100px; height:140px; transform:none; margin:0;"></div>`;
        });
        
        html += `</div>
            <div style="text-align: center;"><button id="close-cpu-deck-view" style="padding: 10px 30px; background: #475569; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">閉じる</button></div>
        </div>`;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        
        document.getElementById('close-cpu-deck-view').onclick = () => {
            document.body.removeChild(overlay);
        };
    };

    if (viewCpuDeckBtn1) viewCpuDeckBtn1.addEventListener('click', showCpuDeckHandler);
    if (viewCpuDeckBtn2) viewCpuDeckBtn2.addEventListener('click', showCpuDeckHandler);
    if (viewCpuDeckBtn3) viewCpuDeckBtn3.addEventListener('click', showCpuDeckHandler);

    ui.readyBtn.addEventListener('click', async () => {
        if (selectedCardIndex === -1 || isAnimating) return;
        isAnimating = true;
        ui.readyBtn.classList.add('hidden-btn');

        // Disable all cards
        document.querySelectorAll('.player-card').forEach(c => {
            c.classList.add('disabled');
        });

        const cardElement = ui.playerHand.querySelector(`.player-card[data-index="${selectedCardIndex}"]`);
        
        const value = selectedCardValue;
        const index = selectedCardIndex;

        // Remove from state
        playerHand.splice(index, 1);
        myPlayedCardVal = value;

        // Reset selection state
        selectedCardIndex = -1;
        selectedCardValue = null;

        if (isOnlineMode) {
            conn.send({ type: 'play_card', value: value });
            document.getElementById('waiting-network-msg').classList.remove('hidden');
            setTimeout(() => { if (cardElement) cardElement.classList.add('hidden-card'); }, 500);
            checkBothPlayed();
        } else {
            // 2. CPUs play card
            const cpuIndex = Math.floor(Math.random() * cpuHand.length);
            const cpuValue = cpuHand[cpuIndex];
            cpuHand.splice(cpuIndex, 1);
            const cpuCardElement = ui.cpuHand.children[cpuIndex];
            cpuCardElement.classList.add('played-anim');

            let cpu2Value = null, cpu2CardElement = null;
            if (selectedPlayerCount >= 3) {
                const c2Idx = Math.floor(Math.random() * cpu2Hand.length);
                cpu2Value = cpu2Hand[c2Idx];
                cpu2Hand.splice(c2Idx, 1);
                cpu2CardElement = ui.cpu2Hand.children[c2Idx];
                if (cpu2CardElement) cpu2CardElement.classList.add('played-anim');
            }

            let cpu3Value = null, cpu3CardElement = null;
            if (selectedPlayerCount >= 4) {
                const c3Idx = Math.floor(Math.random() * cpu3Hand.length);
                cpu3Value = cpu3Hand[c3Idx];
                cpu3Hand.splice(c3Idx, 1);
                cpu3CardElement = ui.cpu3Hand.children[c3Idx];
                if (cpu3CardElement) cpu3CardElement.classList.add('played-anim');
            }

            // Wait for play animation
            await sleep(500);
            
            if (cardElement) cardElement.classList.add('hidden-card');
            if (cpuCardElement) cpuCardElement.classList.add('hidden-card');
            if (cpu2CardElement) cpu2CardElement.classList.add('hidden-card');
            if (cpu3CardElement) cpu3CardElement.classList.add('hidden-card');

            // 3. Show cards in battlefield
            showBattleCards(value, cpuValue, cpu2Value, cpu3Value);
        }
    });

    async function checkBothPlayed() {
        if (myPlayedCardVal !== null && opponentPlayedCardVal !== null) {
            document.getElementById('waiting-network-msg').classList.add('hidden');
            
            document.querySelectorAll('.player-card.played-anim, .cpu-card.played-anim').forEach(el => {
                el.classList.add('hidden-card');
            });
            
            let pVal = myPlayedCardVal;
            let cVal = opponentPlayedCardVal;
            myPlayedCardVal = null;
            opponentPlayedCardVal = null;
            
            // Adjust CPU hand visual to remove 1 card
            if (ui.cpuHand.children.length > 0) {
                const cpuCardElement = ui.cpuHand.children[0];
                cpuCardElement.classList.add('played-anim');
                await sleep(500);
                cpuCardElement.classList.add('hidden-card');
                cpuHand.splice(0, 1); // just remove one from array since it's hidden anyway
            } else {
                await sleep(300);
            }
            
            showBattleCards(pVal, cVal);
        }
    }

    // --- Global Ranking (Firebase) ---
    const firebaseConfig = {
        apiKey: "AIzaSyAzwhvtUH1qTRk3XzWLDhFwE3CC4GWCu8g",
        authDomain: "eat10-ae108.firebaseapp.com",
        projectId: "eat10-ae108",
        storageBucket: "eat10-ae108.firebasestorage.app",
        messagingSenderId: "709463551998",
        appId: "1:709463551998:web:b4ad17988b176cdf729aaf"
    };
    
    // Initialize Firebase if not already initialized
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.database();

    function submitGlobalScore(name, streak, icon, color) {
        if (!name || streak <= 0) return;
        const playerRef = db.ref('leaderboard/' + encodeURIComponent(name));
        
        playerRef.once('value').then((snapshot) => {
            const existingData = snapshot.val();
            if (!existingData || streak > existingData.streak) {
                playerRef.set({
                    name: name,
                    icon: icon || 'ha.png',
                    color: color || 'rgba(0,0,0,0.5)',
                    streak: streak,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
            }
        }).catch(err => console.error("Firebase update failed:", err));
    }

    function submitGlobalRatingScore(name, rating, icon, color) {
        if (!name || rating <= 0) return;
        const playerRef = db.ref('rate_leaderboard/' + encodeURIComponent(name));
        
        playerRef.set({
            name: name,
            icon: icon || 'ha.png',
            color: color || 'rgba(0,0,0,0.5)',
            rating: Math.floor(rating),
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).catch(err => console.error("Firebase rating update failed:", err));
    }

    function fetchGlobalRanking() {
        const loadingEl = document.getElementById('leaderboard-loading');
        const tableEl = document.getElementById('leaderboard-table');
        const tbody = document.getElementById('leaderboard-tbody');
        const valueCol = document.getElementById('leaderboard-value-col');
        
        if (!loadingEl || !tableEl || !tbody) return;
        
        loadingEl.style.display = 'block';
        tableEl.style.display = 'none';
        
        // Push local max streak if exists
        if (stats.maxWinStreak > 0) {
            submitGlobalScore(playerName, stats.maxWinStreak, playerIcon, playerColor);
        }
        if (stats.rating && stats.rating !== 1500) {
            submitGlobalRatingScore(playerName, stats.rating, playerIcon, playerColor);
        }
        
        if (valueCol) {
            valueCol.textContent = currentLeaderboardMode === 'streak' ? window.t('streak_col') : 'レート';
        }
        
        const dbPath = currentLeaderboardMode === 'streak' ? 'leaderboard' : 'rate_leaderboard';
        const orderBy = currentLeaderboardMode === 'streak' ? 'streak' : 'rating';
        
        db.ref(dbPath).orderByChild(orderBy).limitToLast(10).once('value')
            .then((snapshot) => {
                let data = [];
                snapshot.forEach((childSnapshot) => {
                    data.push(childSnapshot.val());
                });
                
                // Sort descending (Firebase returns ascending when using orderByChild)
                data.sort((a, b) => b[orderBy] - a[orderBy]);
                
                tbody.innerHTML = '';
                
                if (data.length === 0) {
                    loadingEl.style.display = 'none';
                    tableEl.style.display = 'none';
                    return;
                }

                data.forEach((entry, index) => {
                    const tr = document.createElement('tr');
                    tr.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
                    if (entry.name === playerName) {
                        tr.style.background = 'rgba(168, 85, 247, 0.2)'; // Highlight player
                    }
                    
                    let rankText = window.t('rank_nth').replace('{0}', (index + 1));
                    if (index === 0) rankText = window.t('rank_1');
                    if (index === 1) rankText = window.t('rank_2');
                    if (index === 2) rankText = window.t('rank_3');
                    
                    tr.innerHTML = `
                        <td style="padding: 12px; text-align: center; font-weight: bold; color: ${index < 3 ? '#fbbf24' : '#94a3b8'};">${rankText}</td>
                        <td style="padding: 12px; font-weight: bold; color: white;">
                            <span style="display:inline-flex; align-items:center; margin-right:8px; vertical-align: middle;">
                                ${entry.icon && entry.icon.endsWith('.png') ? `<div style="background: ${entry.color || 'rgba(0,0,0,0.5)'}; border-radius: 50%; display: flex; width: 36px; height: 36px; align-items: center; justify-content: center; overflow: hidden; border: 1px solid rgba(255,255,255,0.2);"><img src="${entry.icon}" style="width: 100%; height: 100%; object-fit: contain; transform: scale(1.15);"></div>` : `<span style="font-size:1.2rem;">${entry.icon || 'ha.png'}</span>`}
                            </span> ${entry.name}
                        </td>
                        <td style="padding: 12px; text-align: right; font-size: 1.2rem; font-weight: bold; font-family: 'Outfit', sans-serif; color: ${currentLeaderboardMode === 'streak' ? '#4ade80' : '#3b82f6'};">${entry[orderBy]}</td>
                    `;
                    tbody.appendChild(tr);
                });
                
                loadingEl.style.display = 'none';
                tableEl.style.display = 'table';
            }).catch(err => {
                console.error("Firebase fetch failed:", err);
                loadingEl.innerText = "読み込みエラー";
            });
    }

    function switchScreen(screenName) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        const targetScreen = screens[screenName];
        targetScreen.classList.add('active');
        targetScreen.scrollTop = 0;
        
        if (screenName === 'start') {
            const modeSelection = document.getElementById('mode-selection-section');
            const ruleTitle = document.getElementById('rule-selection-title');
            const ruleContainer = document.getElementById('rule-selection-container');
            const startTitle = document.getElementById('start-screen-title');
            
            if (isOnlineMode) {
                if (startTitle) startTitle.textContent = window.t('lobby_title');
                if (modeSelection) modeSelection.classList.add('hidden');
                if (ruleTitle) ruleTitle.classList.add('hidden');
                if (ruleContainer) ruleContainer.style.flexDirection = 'column';
                selectedMode = 'simple'; // Online mode forces simple mode
            } else {
                if (startTitle) startTitle.textContent = window.t('battle_settings_title');
                if (modeSelection) modeSelection.classList.remove('hidden');
                if (ruleTitle) ruleTitle.classList.remove('hidden');
                if (ruleContainer) ruleContainer.style.flexDirection = 'row';
            }
        } else if (screenName === 'title') {
            fetchGlobalRanking();
        } else if (screenName === 'lobby') {
            const actionSelection = document.getElementById('lobby-action-selection');
            const lobbyContainer = document.getElementById('lobby-container');
            if (actionSelection) actionSelection.classList.remove('hidden');
            if (lobbyContainer) lobbyContainer.classList.add('hidden');
        }
    }

    function startGame(mode = 'normal', customDeck = null) {
        if (isWinStreakMode) {
            ui.winStreakIndicator.classList.remove('hidden');
            ui.winStreakCountUI.textContent = winStreakCount;
        } else {
            ui.winStreakIndicator.classList.add('hidden');
        }

        // Reset State
        const playerNameDisplay = document.getElementById('player-name-display');
        if (playerNameDisplay) {
            playerNameDisplay.textContent = playerName;
        }

        const gameTitleBtn = document.getElementById('game-title-btn');
        if (gameTitleBtn) {
            if (isOnlineMode) {
                gameTitleBtn.classList.add('hidden');
            } else {
                gameTitleBtn.classList.remove('hidden');
            }
        }

        const cpuNameDisplays = document.querySelectorAll('.player-label');
        cpuNameDisplays.forEach(el => {
            if (el.id === 'player-name-display') {
                const iconHtml = playerIcon.endsWith('.png') ? `<img src="${playerIcon}" style="width: 32px; height: 32px; vertical-align: middle; border-radius: 50%; object-fit: contain; transform: scale(1.15);">` : playerIcon;
                el.innerHTML = `<span id="player-icon-display" style="display:inline-flex; align-items:center; justify-content:center; margin-right: 5px;">${iconHtml}</span> YOU`;
            } else if (el.id === 'cpu1-name-display') {
                if (selectedPlayerCount > 2) {
                    el.innerHTML = `<span id="cpu1-icon-display" style="display:inline-flex; align-items:center; justify-content:center; margin-right: 5px;">🤖</span> CPU 1`;
                } else {
                    const oppIconHtml = (opponentIcon && opponentIcon.endsWith('.png')) ? `<img src="${opponentIcon}" style="width: 32px; height: 32px; vertical-align: middle; border-radius: 50%; object-fit: contain; transform: scale(1.15);">` : (opponentIcon || '🤖');
                    el.innerHTML = `<span id="cpu1-icon-display" style="display:inline-flex; align-items:center; justify-content:center; margin-right: 5px;">${isOnlineMode ? oppIconHtml : '🤖'}</span> ${isOnlineMode ? opponentName : 'CPU'}`;
                }
            } else if (el.id === 'cpu2-name-display') {
                el.innerHTML = `<span id="cpu2-icon-display" style="display:inline-flex; align-items:center; justify-content:center; margin-right: 5px;">🤖</span> CPU 2`;
            } else if (el.id === 'cpu3-name-display') {
                el.innerHTML = `<span id="cpu3-icon-display" style="display:inline-flex; align-items:center; justify-content:center; margin-right: 5px;">🤖</span> CPU 3`;
            }
        });

        const viewBtn = document.getElementById('view-deck-btn');
        const viewCpuBtn1 = document.getElementById('view-cpu1-deck-btn');
        if (mode === 'normal') {
            currentCustomDeck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            currentCpuCustomDeck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            playerDeck = [...currentCustomDeck];
            cpuDeck = [...currentCpuCustomDeck];
            currentCpu2CustomDeck = [...currentCpuCustomDeck];
            currentCpu3CustomDeck = [...currentCpuCustomDeck];
            cpu2Deck = [...currentCpu2CustomDeck];
            cpu3Deck = [...currentCpu3CustomDeck];
            if (viewBtn) viewBtn.classList.remove('hidden');
            if (viewCpuBtn1) viewCpuBtn1.classList.remove('hidden');
            if (document.getElementById('view-cpu2-deck-btn')) document.getElementById('view-cpu2-deck-btn').classList.remove('hidden');
            if (document.getElementById('view-cpu3-deck-btn')) document.getElementById('view-cpu3-deck-btn').classList.remove('hidden');
        } else {
            playerDeck = [...customDeck];
            if (isOnlineMode && opponentCustomDeck) {
                currentCpuCustomDeck = [...opponentCustomDeck];
            } else {
                currentCpuCustomDeck = generateCpuCustomDeck();
            }
            cpuDeck = [...currentCpuCustomDeck];
            currentCpu2CustomDeck = generateCpuCustomDeck();
            currentCpu3CustomDeck = generateCpuCustomDeck();
            cpu2Deck = [...currentCpu2CustomDeck];
            cpu3Deck = [...currentCpu3CustomDeck];
            if (viewBtn) viewBtn.classList.remove('hidden');
            if (viewCpuBtn1) viewCpuBtn1.classList.remove('hidden');
            if (document.getElementById('view-cpu2-deck-btn')) document.getElementById('view-cpu2-deck-btn').classList.remove('hidden');
            if (document.getElementById('view-cpu3-deck-btn')) document.getElementById('view-cpu3-deck-btn').classList.remove('hidden');
        }
        if (isHost || !isOnlineMode) {
            shuffleArray(playerDeck);
            shuffleArray(cpuDeck);
            shuffleArray(cpu2Deck);
            shuffleArray(cpu3Deck);
        } else {
            // Guest shuffles in reverse order to match Host's PRNG calls
            shuffleArray(cpuDeck);
            shuffleArray(playerDeck);
            shuffleArray(cpu2Deck);
            shuffleArray(cpu3Deck);
        }
        
        playerHand = playerDeck.splice(0, 5);
        cpuHand = cpuDeck.splice(0, 5);
        cpu2Hand = cpu2Deck.splice(0, 5);
        cpu3Hand = cpu3Deck.splice(0, 5);
        playerHistory = [];
        cpuHistory = [];
        cpu2History = [];
        cpu3History = [];
        playerScore = 0;
        cpuScore = 0;
        cpu2Score = 0;
        cpu3Score = 0;
        currentRound = 1;
        isAnimating = false;
        playerNextTurnModifier = 0;
        cpuNextTurnModifier = 0;
        cpu2NextTurnModifier = 0;
        cpu3NextTurnModifier = 0;
        cpu2PlayedCardVal = null;
        cpu3PlayedCardVal = null;
        selectedCardIndex = -1;
        selectedCardValue = null;
        if (ui.readyBtn) ui.readyBtn.classList.add('hidden-btn');

        updateScoreBoard();
        ui.roundNumber.textContent = currentRound;
        ui.cpuDeckCount.textContent = cpuDeck.length;
        ui.cpu2DeckCount.textContent = cpu2Deck.length;
        ui.cpu3DeckCount.textContent = cpu3Deck.length;
        ui.playerDeckCount.textContent = playerDeck.length;
        ui.cpuDeckUi.classList.remove('empty');
        ui.cpu2DeckUi.classList.remove('empty');
        ui.cpu3DeckUi.classList.remove('empty');
        ui.playerDeckUi.classList.remove('empty');
        clearBattlefield();

        // UI visibility based on player count
        document.body.classList.toggle('multiplayer-mode', selectedPlayerCount >= 3);
        document.body.classList.toggle('four-player-layout', selectedPlayerCount >= 3);
        document.getElementById('cpu2-area').classList.toggle('hidden', selectedPlayerCount < 3);
        document.getElementById('cpu3-area').classList.toggle('hidden', selectedPlayerCount < 4);
        document.getElementById('cpu2-played-card').classList.toggle('hidden', selectedPlayerCount < 3);
        document.getElementById('cpu3-played-card').classList.toggle('hidden', selectedPlayerCount < 4);
        document.getElementById('final-score-cpu2').classList.toggle('hidden', selectedPlayerCount < 3);
        document.getElementById('final-score-cpu3').classList.toggle('hidden', selectedPlayerCount < 4);

        renderHistory();
        switchScreen('game');
        
        playStartAnimation();
    }

    function playStartAnimation() {
        isAnimating = true;

        // 先に手札を描画し、全て透明にしておく
        renderHands();
        const playerCardElements = Array.from(ui.playerHand.children);
        const cpuCardElements = Array.from(ui.cpuHand.children);
        const cpu2CardElements = ui.cpu2Hand ? Array.from(ui.cpu2Hand.children) : [];
        const cpu3CardElements = ui.cpu3Hand ? Array.from(ui.cpu3Hand.children) : [];
        
        playerCardElements.forEach(el => el.style.opacity = '0');
        cpuCardElements.forEach(el => el.style.opacity = '0');
        cpu2CardElements.forEach(el => el.style.opacity = '0');
        cpu3CardElements.forEach(el => el.style.opacity = '0');

        // シャッフル演出
        ui.playerDeckUi.classList.add('shuffling');
        ui.cpuDeckUi.classList.add('shuffling');
        if (selectedPlayerCount >= 3) ui.cpu2DeckUi.classList.add('shuffling');
        if (selectedPlayerCount >= 4) ui.cpu3DeckUi.classList.add('shuffling');

        setTimeout(() => {
            ui.playerDeckUi.classList.remove('shuffling');
            ui.cpuDeckUi.classList.remove('shuffling');
            if (selectedPlayerCount >= 3) ui.cpu2DeckUi.classList.remove('shuffling');
            if (selectedPlayerCount >= 4) ui.cpu3DeckUi.classList.remove('shuffling');
            
            // 配布演出開始
            dealCardsAnimation(playerCardElements, cpuCardElements, cpu2CardElements, cpu3CardElements);
        }, 800); 
    }

    function dealCardsAnimation(playerCardElements, cpuCardElements, cpu2CardElements, cpu3CardElements) {
        let dealtCount = 0;

        function createAndAnimateDealCard(deckUi, targetEl, index) {
            const deckRect = deckUi.getBoundingClientRect();
            const targetRect = targetEl.getBoundingClientRect();
            
            const card = document.createElement('div');
            card.className = 'dealing-card';
            card.style.left = deckRect.left + 'px';
            card.style.top = deckRect.top + 'px';
            card.innerHTML = '<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.3); font-size:1.2rem; font-weight:bold;">EAT<br>10</div>';
            document.body.appendChild(card);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    card.style.left = targetRect.left + 'px';
                    card.style.top = targetRect.top + 'px';
                });
            });

            setTimeout(() => {
                card.remove();
                targetEl.style.transition = 'opacity 0.2s';
                targetEl.style.opacity = '1';
                dealtCount++;
                let totalExpected = 5 * 2;
                if (selectedPlayerCount >= 3) totalExpected += 5;
                if (selectedPlayerCount >= 4) totalExpected += 5;

                if (dealtCount === totalExpected) {
                    isAnimating = false;
                    setTimeout(() => {
                        const allEls = [...playerCardElements, ...cpuCardElements, ...cpu2CardElements, ...cpu3CardElements];
                        allEls.forEach(el => {
                            if (el) {
                                el.style.transition = '';
                                el.style.opacity = '';
                            }
                        });
                    }, 200);
                }
            }, 400);
        }

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createAndAnimateDealCard(ui.playerDeckUi, playerCardElements[i], i);
                
                if (selectedPlayerCount < 3) {
                    createAndAnimateDealCard(ui.cpuDeckUi, cpuCardElements[i], i);
                } else {
                    // Simulate completion without animation
                    setTimeout(() => {
                        dealtCount++;
                        if (cpu2CardElements[i]) dealtCount++;
                        if (cpu3CardElements[i]) dealtCount++;
                        
                        let totalExpected = 5 * 2;
                        if (selectedPlayerCount >= 3) totalExpected += 5;
                        if (selectedPlayerCount >= 4) totalExpected += 5;
                        
                        if (dealtCount === totalExpected) {
                            isAnimating = false;
                        }
                    }, 400);
                }
            }, i * 150); 
        }
    }

    function renderHands() {
        ui.playerHand.innerHTML = '';
        ui.cpuHand.innerHTML = '';
        if (ui.cpu2Hand) ui.cpu2Hand.innerHTML = '';
        if (ui.cpu3Hand) ui.cpu3Hand.innerHTML = '';

        // Update Modifiers UI
        if (playerNextTurnModifier !== 0) {
            ui.playerModifierBadge.textContent = playerNextTurnModifier > 0 ? `+${playerNextTurnModifier}` : `${playerNextTurnModifier}`;
            ui.playerModifierBadge.className = `modifier-badge ${playerNextTurnModifier < 0 ? 'negative' : ''}`;
        } else {
            ui.playerModifierBadge.className = 'modifier-badge hidden';
        }

        if (cpuNextTurnModifier !== 0) {
            ui.cpuModifierBadge.textContent = cpuNextTurnModifier > 0 ? `+${cpuNextTurnModifier}` : `${cpuNextTurnModifier}`;
            ui.cpuModifierBadge.className = `modifier-badge ${cpuNextTurnModifier < 0 ? 'negative' : ''}`;
        } else {
            ui.cpuModifierBadge.className = 'modifier-badge hidden';
        }

        if (ui.cpu2ModifierBadge) {
            if (cpu2NextTurnModifier !== 0) {
                ui.cpu2ModifierBadge.textContent = cpu2NextTurnModifier > 0 ? `+${cpu2NextTurnModifier}` : `${cpu2NextTurnModifier}`;
                ui.cpu2ModifierBadge.className = `modifier-badge ${cpu2NextTurnModifier < 0 ? 'negative' : ''}`;
            } else {
                ui.cpu2ModifierBadge.className = 'modifier-badge hidden';
            }
        }

        if (ui.cpu3ModifierBadge) {
            if (cpu3NextTurnModifier !== 0) {
                ui.cpu3ModifierBadge.textContent = cpu3NextTurnModifier > 0 ? `+${cpu3NextTurnModifier}` : `${cpu3NextTurnModifier}`;
                ui.cpu3ModifierBadge.className = `modifier-badge ${cpu3NextTurnModifier < 0 ? 'negative' : ''}`;
            } else {
                ui.cpu3ModifierBadge.className = 'modifier-badge hidden';
            }
        }

        // Player cards
        playerHand.forEach((value, index) => {
            let displayValue = value + playerNextTurnModifier;

            const card = document.createElement('div');
            card.className = 'game-card player-card';
            card.dataset.value = value;
            card.dataset.index = index;
            card.innerHTML = `
                <div class="card-number">${displayValue}</div>
                <div class="card-name">${CARD_DATA[value].name}</div>
                <div class="card-ability">${CARD_DATA[value].ability}</div>
            `;
            card.addEventListener('click', () => handlePlayerCardClick(card, value, index));
            card.addEventListener('mouseenter', () => showHoverInfo(value));
            card.addEventListener('mouseleave', hideHoverInfo);
            card.addEventListener('touchstart', () => showHoverInfo(value), {passive: true});
            card.addEventListener('touchend', hideHoverInfo, {passive: true});
            card.addEventListener('touchcancel', hideHoverInfo, {passive: true});
            ui.playerHand.appendChild(card);
        });

        // CPU cards (face down)
        cpuHand.forEach((value, index) => {
            const card = document.createElement('div');
            card.className = 'game-card cpu-card';
            card.dataset.index = index;
            ui.cpuHand.appendChild(card);
        });

        if (ui.cpu2Hand && selectedPlayerCount >= 3) {
            cpu2Hand.forEach((value, index) => {
                const card = document.createElement('div');
                card.className = 'game-card cpu-card';
                card.dataset.index = index;
                ui.cpu2Hand.appendChild(card);
            });
        }

        if (ui.cpu3Hand && selectedPlayerCount >= 4) {
            cpu3Hand.forEach((value, index) => {
                const card = document.createElement('div');
                card.className = 'game-card cpu-card';
                card.dataset.index = index;
                ui.cpu3Hand.appendChild(card);
            });
        }
    }

    function renderHistory() {
        ui.playerHistory.innerHTML = '';
        ui.cpuHistory.innerHTML = '';
        if (ui.cpu2History) ui.cpu2History.innerHTML = '';
        if (ui.cpu3History) ui.cpu3History.innerHTML = '';

        playerHistory.forEach(item => {
            const card = document.createElement('div');
            card.className = `history-card ${item.result}`;
            card.dataset.value = item.value;
            card.innerHTML = `
                ${item.value}
            `;
            card.addEventListener('mouseenter', () => showHoverInfo(item.value));
            card.addEventListener('mouseleave', hideHoverInfo);
            card.addEventListener('touchstart', () => showHoverInfo(item.value), {passive: true});
            card.addEventListener('touchend', hideHoverInfo, {passive: true});
            card.addEventListener('touchcancel', hideHoverInfo, {passive: true});
            ui.playerHistory.appendChild(card);
        });

        cpuHistory.forEach(item => {
            const card = document.createElement('div');
            card.className = `history-card ${item.result}`;
            card.dataset.value = item.value;
            card.innerHTML = `${item.value}`;
            card.addEventListener('mouseenter', () => showHoverInfo(item.value));
            card.addEventListener('mouseleave', hideHoverInfo);
            card.addEventListener('touchstart', () => showHoverInfo(item.value), {passive: true});
            card.addEventListener('touchend', hideHoverInfo, {passive: true});
            card.addEventListener('touchcancel', hideHoverInfo, {passive: true});
            ui.cpuHistory.appendChild(card);
        });

        if (ui.cpu2History && selectedPlayerCount >= 3) {
            cpu2History.forEach(item => {
                const card = document.createElement('div');
                card.className = `history-card ${item.result}`;
                card.dataset.value = item.value;
                card.innerHTML = `${item.value}`;
                card.addEventListener('mouseenter', () => showHoverInfo(item.value));
                card.addEventListener('mouseleave', hideHoverInfo);
                card.addEventListener('touchstart', () => showHoverInfo(item.value), {passive: true});
                card.addEventListener('touchend', hideHoverInfo, {passive: true});
                card.addEventListener('touchcancel', hideHoverInfo, {passive: true});
                ui.cpu2History.appendChild(card);
            });
        }

        if (ui.cpu3History && selectedPlayerCount >= 4) {
            cpu3History.forEach(item => {
                const card = document.createElement('div');
                card.className = `history-card ${item.result}`;
                card.dataset.value = item.value;
                card.innerHTML = `${item.value}`;
                card.addEventListener('mouseenter', () => showHoverInfo(item.value));
                card.addEventListener('mouseleave', hideHoverInfo);
                card.addEventListener('touchstart', () => showHoverInfo(item.value), {passive: true});
                card.addEventListener('touchend', hideHoverInfo, {passive: true});
                card.addEventListener('touchcancel', hideHoverInfo, {passive: true});
                ui.cpu3History.appendChild(card);
            });
        }
    }

    // --- Game Logic ---
    async function handlePlayerCardClick(cardElement, value, index) {
        if (isAnimating) return;

        // If already selected, deselect
        if (selectedCardIndex === index) {
            cardElement.classList.remove('selected-in-hand');
            ui.playerPlayedSlot.innerHTML = '<div class="placeholder">?</div>';
            selectedCardIndex = -1;
            selectedCardValue = null;
            ui.readyBtn.classList.add('hidden-btn');
            return;
        }

        // Deselect previous
        if (selectedCardIndex !== -1) {
            const prevCard = ui.playerHand.querySelector(`.player-card[data-index="${selectedCardIndex}"]`);
            if (prevCard) prevCard.classList.remove('selected-in-hand');
        }

        // Select new
        selectedCardIndex = index;
        selectedCardValue = value;
        cardElement.classList.add('selected-in-hand');
        
        // Show in center
        let displayValue = value + playerNextTurnModifier;
        let modifierHtml = '';
        if (playerNextTurnModifier !== 0) {
            const modStr = playerNextTurnModifier > 0 ? `+${playerNextTurnModifier}` : `${playerNextTurnModifier}`;
            const modClass = playerNextTurnModifier < 0 ? 'negative' : '';
            modifierHtml = `<div class="played-modifier-badge ${modClass}">${modStr}</div>`;
        }
        ui.playerPlayedSlot.innerHTML = `<div class="battle-card" data-value="${value}"><div class="card-number">${displayValue}</div><div class="card-name">${CARD_DATA[value].name}</div><div class="card-ability">${CARD_DATA[value].ability}</div></div>${modifierHtml}`;
        
        ui.readyBtn.classList.remove('hidden-btn');
    }

    async function showBattleCards(playerVal, cpuVal, cpu2Val = null, cpu3Val = null) {
        // Render player card (update just in case)
        let displayValue = playerVal + playerNextTurnModifier;
        let pModifierHtml = '';
        if (playerNextTurnModifier !== 0) {
            const modStr = playerNextTurnModifier > 0 ? `+${playerNextTurnModifier}` : `${playerNextTurnModifier}`;
            const modClass = playerNextTurnModifier < 0 ? 'negative' : '';
            pModifierHtml = `<div class="played-modifier-badge ${modClass}">${modStr}</div>`;
        }
        ui.playerPlayedSlot.innerHTML = `<div class="battle-card" data-value="${playerVal}"><div class="card-number">${displayValue}</div><div class="card-name">${CARD_DATA[playerVal].name}</div><div class="card-ability">${CARD_DATA[playerVal].ability}</div></div>
        <div class="skill-banner skill-banner-player reveal-anim">${CARD_DATA[playerVal].skillName}</div>${pModifierHtml}`;
        
        // Render CPU cards face down then reveal
        ui.cpuPlayedSlot.innerHTML = `<div class="battle-card card-back reveal-anim"></div>`;
        if (ui.cpu2PlayedSlot && cpu2Val !== null) ui.cpu2PlayedSlot.innerHTML = `<div class="battle-card card-back reveal-anim"></div>`;
        if (ui.cpu3PlayedSlot && cpu3Val !== null) ui.cpu3PlayedSlot.innerHTML = `<div class="battle-card card-back reveal-anim"></div>`;

        // Wait for reveal animation
        await sleep(600);
        
        // Replace with actual CPU cards
        function getCpuCardHtml(val, modifier) {
            let cpuDisplayValue = val + modifier;
            let cModifierHtml = '';
            if (modifier !== 0) {
                const modStr = modifier > 0 ? `+${modifier}` : `${modifier}`;
                const modClass = modifier < 0 ? 'negative' : '';
                cModifierHtml = `<div class="played-modifier-badge ${modClass}">${modStr}</div>`;
            }
            return `<div class="battle-card cpu-card" data-value="${val}"><div class="card-number">${cpuDisplayValue}</div><div class="card-name">${CARD_DATA[val].name}</div><div class="card-ability">${CARD_DATA[val].ability}</div></div>
            <div class="skill-banner skill-banner-cpu reveal-anim">${CARD_DATA[val].skillName}</div>${cModifierHtml}`;
        }

        ui.cpuPlayedSlot.innerHTML = getCpuCardHtml(cpuVal, cpuNextTurnModifier);
        if (ui.cpu2PlayedSlot && cpu2Val !== null) ui.cpu2PlayedSlot.innerHTML = getCpuCardHtml(cpu2Val, cpu2NextTurnModifier);
        if (ui.cpu3PlayedSlot && cpu3Val !== null) ui.cpu3PlayedSlot.innerHTML = getCpuCardHtml(cpu3Val, cpu3NextTurnModifier);

        // EAT Shout
        ui.eatShout.classList.remove('hidden-anim');
        await sleep(800);
        ui.eatShout.classList.add('hidden-anim');

        // 4. Determine Winner
        await sleep(200);
        resolveRound(playerVal, cpuVal, cpu2Val, cpu3Val);
    }

    function waitForPlayerTargetSelection(activeOpponents, message) {
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
    }

    async function resolveRound(originalPlayerVal, originalCpuVal, originalCpu2Val, originalCpu3Val) {
        const playerCardEl = ui.playerPlayedSlot.querySelector('.battle-card');
        const cpuCardEl = ui.cpuPlayedSlot.querySelector('.battle-card');
        const cpu2CardEl = ui.cpu2PlayedSlot ? ui.cpu2PlayedSlot.querySelector('.battle-card') : null;
        const cpu3CardEl = ui.cpu3PlayedSlot ? ui.cpu3PlayedSlot.querySelector('.battle-card') : null;
        
        const playerBanner = ui.playerPlayedSlot.querySelector('.skill-banner');
        const cpuBanner = ui.cpuPlayedSlot.querySelector('.skill-banner');
        const cpu2Banner = ui.cpu2PlayedSlot ? ui.cpu2PlayedSlot.querySelector('.skill-banner') : null;
        const cpu3Banner = ui.cpu3PlayedSlot ? ui.cpu3PlayedSlot.querySelector('.skill-banner') : null;
        
        // Active opponents
        const hasCpu2 = selectedPlayerCount >= 3;
        const hasCpu3 = selectedPlayerCount >= 4;

        // --- Ability Phase ---
        let playerSkill = Number(originalPlayerVal);
        let cpuSkill = Number(originalCpuVal);
        let cpu2Skill = hasCpu2 ? Number(originalCpu2Val) : null;
        let cpu3Skill = hasCpu3 ? Number(originalCpu3Val) : null;

        let playerVal = Number(originalPlayerVal);
        let cpuVal = Number(originalCpuVal);
        let cpu2Val = hasCpu2 ? Number(originalCpu2Val) : null;
        let cpu3Val = hasCpu3 ? Number(originalCpu3Val) : null;
        
        // 1. Transform Phase (2: チョウ)
        let playerNeedsSlot = false;
        let cpuNeedsSlot = false;
        let cpu2NeedsSlot = false;
        let cpu3NeedsSlot = false;

        function evaluateButterfly(deck) {
            return Number(deck[deck.length - 1]);
        }

        if (playerSkill === 2 && playerDeck.length > 0) {
            playerVal = evaluateButterfly(playerDeck);
            playerSkill = playerVal;
            playerNeedsSlot = true;
        }
        if (cpuSkill === 2 && cpuDeck.length > 0) {
            cpuVal = evaluateButterfly(cpuDeck);
            cpuSkill = cpuVal;
            cpuNeedsSlot = true;
        }
        if (hasCpu2 && cpu2Skill === 2 && cpu2Deck.length > 0) {
            cpu2Val = evaluateButterfly(cpu2Deck);
            cpu2Skill = cpu2Val;
            cpu2NeedsSlot = true;
        }
        if (hasCpu3 && cpu3Skill === 2 && cpu3Deck.length > 0) {
            cpu3Val = evaluateButterfly(cpu3Deck);
            cpu3Skill = cpu3Val;
            cpu3NeedsSlot = true;
        }

        if (playerNeedsSlot || cpuNeedsSlot || cpu2NeedsSlot || cpu3NeedsSlot) {
            const slotPromises = [];
            if (playerNeedsSlot) slotPromises.push(playSlotAnimation(playerCardEl, playerVal));
            if (cpuNeedsSlot) slotPromises.push(playSlotAnimation(cpuCardEl, cpuVal));
            if (cpu2NeedsSlot) slotPromises.push(playSlotAnimation(cpu2CardEl, cpu2Val));
            if (cpu3NeedsSlot) slotPromises.push(playSlotAnimation(cpu3CardEl, cpu3Val));
            await Promise.all(slotPromises);

            if (playerNeedsSlot && playerBanner) playerBanner.textContent = CARD_DATA[playerVal].skillName;
            if (cpuNeedsSlot && cpuBanner) cpuBanner.textContent = CARD_DATA[cpuVal].skillName;
            if (cpu2NeedsSlot && cpu2Banner) cpu2Banner.textContent = CARD_DATA[cpu2Val].skillName;
            if (cpu3NeedsSlot && cpu3Banner) cpu3Banner.textContent = CARD_DATA[cpu3Val].skillName;
            
            if (isHost || !isOnlineMode) {
                if (playerNeedsSlot) shuffleArray(playerDeck);
                if (cpuNeedsSlot) shuffleArray(cpuDeck);
                if (cpu2NeedsSlot) shuffleArray(cpu2Deck);
                if (cpu3NeedsSlot) shuffleArray(cpu3Deck);
            } else {
                if (cpuNeedsSlot) shuffleArray(cpuDeck);
                if (playerNeedsSlot) shuffleArray(playerDeck);
                if (cpu2NeedsSlot) shuffleArray(cpu2Deck);
                if (cpu3NeedsSlot) shuffleArray(cpu3Deck);
            }
        }

        // Apply Next Turn Modifiers
        let pBaseNum = playerVal;
        let cBaseNum = cpuVal;
        let c2BaseNum = hasCpu2 ? cpu2Val : null;
        let c3BaseNum = hasCpu3 ? cpu3Val : null;
        
        playerVal += playerNextTurnModifier;
        cpuVal += cpuNextTurnModifier;
        if (hasCpu2) cpu2Val += cpu2NextTurnModifier;
        if (hasCpu3) cpu3Val += cpu3NextTurnModifier;
        
        // Update display with modifiers
        if (playerNextTurnModifier !== 0 && playerCardEl) {
            playerCardEl.querySelector('.card-number').textContent = `${playerVal}`;
        }
        if (cpuNextTurnModifier !== 0 && cpuCardEl) {
            cpuCardEl.querySelector('.card-number').textContent = `${cpuVal}`;
        }
        if (hasCpu2 && cpu2NextTurnModifier !== 0 && cpu2CardEl) {
            cpu2CardEl.querySelector('.card-number').textContent = `${cpu2Val}`;
        }
        if (hasCpu3 && cpu3NextTurnModifier !== 0 && cpu3CardEl) {
            cpu3CardEl.querySelector('.card-number').textContent = `${cpu3Val}`;
        }

        let newPlayerNextTurnModifier = 0;
        let newCpuNextTurnModifier = 0;
        let newCpu2NextTurnModifier = 0;
        let newCpu3NextTurnModifier = 0;
        playerNextTurnModifier = 0;
        cpuNextTurnModifier = 0;
        cpu2NextTurnModifier = 0;
        cpu3NextTurnModifier = 0;

        let effectivePlayerSkill = playerSkill;
        let effectiveCpuSkill = cpuSkill;
        let effectiveCpu2Skill = cpu2Skill;
        let effectiveCpu3Skill = cpu3Skill;

        // Helper arrays for active players
        const activePlayers = [
            { id: 'player', skill: effectivePlayerSkill, val: playerVal, baseNum: pBaseNum, el: playerCardEl, banner: playerBanner },
            { id: 'cpu', skill: effectiveCpuSkill, val: cpuVal, baseNum: cBaseNum, el: cpuCardEl, banner: cpuBanner }
        ];
        if (hasCpu2) activePlayers.push({ id: 'cpu2', skill: effectiveCpu2Skill, val: cpu2Val, baseNum: c2BaseNum, el: cpu2CardEl, banner: cpu2Banner });
        if (hasCpu3) activePlayers.push({ id: 'cpu3', skill: effectiveCpu3Skill, val: cpu3Val, baseNum: c3BaseNum, el: cpu3CardEl, banner: cpu3Banner });

        // 2. Skill Copy (7: ネコ)
        let copyTriggered = false;
        const copiedSkills = new Map();
        
        for (const p of activePlayers) {
            if (p.skill === 7) {
                const opponents = activePlayers.filter(op => op.id !== p.id);
                let targetId = null;
                if (p.id === 'player' && activePlayers.length >= 3) {
                    targetId = await waitForPlayerTargetSelection(opponents, window.t('target_select_7'));
                } else {
                    // Auto-target highest baseNum
                    const highestOpponent = opponents.reduce((prev, curr) => (curr.baseNum > prev.baseNum ? curr : prev));
                    targetId = highestOpponent.id;
                }
                
                const targetOpponent = opponents.find(op => op.id === targetId);
                if (targetOpponent && targetOpponent.skill !== 0) {
                    copiedSkills.set(p.id, targetOpponent.skill);
                    copyTriggered = true;
                } else {
                    copiedSkills.set(p.id, 0);
                }
            } else {
                copiedSkills.set(p.id, p.skill);
            }
        }
        
        if (copyTriggered) {
            await sleep(500);
            for (const p of activePlayers) {
                if (p.skill === 7 && copiedSkills.get(p.id) !== 0) {
                    p.el.classList.add('copy-anim');
                    if (p.banner) p.banner.textContent = CARD_DATA[copiedSkills.get(p.id)].skillName;
                }
                p.skill = copiedSkills.get(p.id);
            }
            await sleep(500);
        }

        // Update effective skills
        effectivePlayerSkill = activePlayers[0].skill;
        effectiveCpuSkill = activePlayers[1].skill;
        if (hasCpu2) effectiveCpu2Skill = activePlayers[2].skill;
        if (hasCpu3) effectiveCpu3Skill = activePlayers[3].skill;

        // 3. Skill Nullification (8: イノシシ)
        let abilityTriggered = false;
        const nullifiedIds = new Set();
        
        for (const p of activePlayers) {
            if (p.skill === 8) {
                const opponents = activePlayers.filter(op => op.id !== p.id);
                let targetId = null;
                
                if (activePlayers.length >= 3) {
                    if (p.id === 'player') {
                        targetId = await waitForPlayerTargetSelection(opponents, window.t('target_select_8'));
                    } else {
                        // CPU selects random target in 3-4 player mode
                        targetId = opponents[Math.floor(Math.random() * opponents.length)].id;
                    }
                    if (targetId) nullifiedIds.add(targetId);
                } else {
                    // In 2 player mode, nullify all (which is 1)
                    opponents.forEach(op => nullifiedIds.add(op.id));
                }
                
                abilityTriggered = true;
            }
        }

        if (abilityTriggered) {
            await sleep(500);
            for (const p of activePlayers) {
                if (nullifiedIds.has(p.id)) {
                    p.el.classList.add('nullified-anim');
                    const abilityEl = p.el.querySelector('.card-ability');
                    if (abilityEl) abilityEl.innerHTML = '<span style="color: #ef4444; font-weight: bold; font-size: 0.7rem; display: block; margin-top: 5px;">' + window.t('invalid_target') + '</span>';
                    p.skill = 0;
                }
            }
            await sleep(500);
        }

        effectivePlayerSkill = activePlayers[0].skill;
        effectiveCpuSkill = activePlayers[1].skill;
        if (hasCpu2) effectiveCpu2Skill = activePlayers[2].skill;
        if (hasCpu3) effectiveCpu3Skill = activePlayers[3].skill;

        // 3. Resolve active skills
        let reverseStrength = false;
        for (const p of activePlayers) {
            if (p.skill === 4) reverseStrength = !reverseStrength;
            if (p.skill === 5) {
                if (p.id === 'player') newPlayerNextTurnModifier += 2;
                else if (p.id === 'cpu') newCpuNextTurnModifier += 2;
                else if (p.id === 'cpu2') newCpu2NextTurnModifier += 2;
                else if (p.id === 'cpu3') newCpu3NextTurnModifier += 2;
            }
            if (p.skill === 9) {
                if (p.id === 'player') newPlayerNextTurnModifier -= 1;
                else if (p.id === 'cpu') newCpuNextTurnModifier -= 1;
                else if (p.id === 'cpu2') newCpu2NextTurnModifier -= 1;
                else if (p.id === 'cpu3') newCpu3NextTurnModifier -= 1;
            }
        }

        // 4. Determine Winner
        const winners = [];
        
        // 1: ハナ (Win if any opponent plays 10)
        const someonePlayed10 = activePlayers.some(p => p.baseNum === 10);
        const hanaPlayers = activePlayers.filter(p => p.skill === 1 && someonePlayed10);
        if (hanaPlayers.length > 0) {
            hanaPlayers.forEach(p => winners.push(p.id));
        } else {
            // 6: ヘビ (Win if smallest number)
            const minVal = Math.min(...activePlayers.map(p => p.val));
            const smallestPlayers = activePlayers.filter(p => p.val === minVal);
            
            const snakePlayers = activePlayers.filter(p => p.skill === 6 && smallestPlayers.some(sp => sp.id === p.id));
            if (snakePlayers.length > 0) {
                smallestPlayers.forEach(p => winners.push(p.id));
            } else {
                // Normal resolution
                const targetVal = reverseStrength ? minVal : Math.max(...activePlayers.map(p => p.val));
                const topPlayers = activePlayers.filter(p => p.val === targetVal);
                topPlayers.forEach(p => winners.push(p.id));
            }
        }

        // Setup next turn modifiers
        playerNextTurnModifier = newPlayerNextTurnModifier;
        cpuNextTurnModifier = newCpuNextTurnModifier;
        cpu2NextTurnModifier = newCpu2NextTurnModifier;
        cpu3NextTurnModifier = newCpu3NextTurnModifier;

        // If everyone tied, it's a DRAW
        const isAllDraw = winners.length === activePlayers.length;

        activePlayers.forEach(p => {
            p.result = isAllDraw ? 'draw' : (winners.includes(p.id) ? 'win' : 'lose');
        });

        // Points
        if (!isAllDraw) {
            winners.forEach(winnerId => {
                if (winnerId === 'player') playerScore++;
                if (winnerId === 'cpu') cpuScore++;
                if (winnerId === 'cpu2') cpu2Score++;
                if (winnerId === 'cpu3') cpu3Score++;
            });
            
            // Hito (10) penalty
            activePlayers.forEach(p => {
                if (p.result === 'lose' && p.skill === 10) {
                    if (p.id === 'player') playerScore = Math.max(0, playerScore - 1);
                    if (p.id === 'cpu') cpuScore = Math.max(0, cpuScore - 1);
                    if (p.id === 'cpu2') cpu2Score = Math.max(0, cpu2Score - 1);
                    if (p.id === 'cpu3') cpu3Score = Math.max(0, cpu3Score - 1);
                }
            });
        }
        
        const myResult = activePlayers.find(p => p.id === 'player').result;
        let resultText = myResult === 'win' ? 'WIN' : (myResult === 'lose' ? 'LOSE' : 'DRAW');
        let resultClass = myResult === 'win' ? 'win-text' : (myResult === 'lose' ? 'lose-text' : 'draw-text');

        activePlayers.forEach(p => {
            if (p.result === 'win') p.el.classList.add('winner-card');
            if (p.result === 'lose') p.el.classList.add('loser-card');
        });

        // Add to history
        playerHistory.push({ value: originalPlayerVal, result: activePlayers.find(p => p.id === 'player').result });
        cpuHistory.push({ value: originalCpuVal, result: activePlayers.find(p => p.id === 'cpu').result });
        if (hasCpu2) cpu2History.push({ value: originalCpu2Val, result: activePlayers.find(p => p.id === 'cpu2').result });
        if (hasCpu3) cpu3History.push({ value: originalCpu3Val, result: activePlayers.find(p => p.id === 'cpu3').result });

        updateScoreBoard();
        renderHistory();

        ui.roundResult.textContent = resultText;
        ui.roundResult.className = `round-result-message ${resultClass}`;

        // Wait a bit to show result
        await sleep(1500);

        // 5. Cleanup and Next Round
        ui.roundResult.classList.add('hidden-anim');
        ui.roundResult.className = 'round-result-message hidden-anim';
        
        // Slide out cards
        activePlayers.forEach(p => {
            if (p.el) {
                p.el.style.transform = p.id === 'player' ? 'translateY(100vh)' : 'translateY(-100vh)';
                p.el.style.opacity = '0';
            }
        });
        
        await sleep(300);
        clearBattlefield();

        // Spider ability (3: クモ)
        for (const p of activePlayers) {
            if (p.skill === 3) {
                if (p.id === 'player') await handleSpiderAbility(true);
                // CPU spider ability is currently hardcoded for CPU1 in handleSpiderAbility.
                // We'd need to adapt handleSpiderAbility if we wanted CPU2 and CPU3 to have it.
                // For now, let's let any CPU with Spider trigger the same CPU logic.
                else await handleSpiderAbility(false, p.id); 
            }
        }

        if (currentRound < MAX_ROUNDS) {
            if (playerDeck.length > 0) playerHand.push(playerDeck.pop());
            if (cpuDeck.length > 0) cpuHand.push(cpuDeck.pop());
            if (hasCpu2 && cpu2Deck.length > 0) cpu2Hand.push(cpu2Deck.pop());
            if (hasCpu3 && cpu3Deck.length > 0) cpu3Hand.push(cpu3Deck.pop());
            
            ui.cpuDeckCount.textContent = cpuDeck.length;
            if (hasCpu2) ui.cpu2DeckCount.textContent = cpu2Deck.length;
            if (hasCpu3) ui.cpu3DeckCount.textContent = cpu3Deck.length;
            ui.playerDeckCount.textContent = playerDeck.length;
            
            if (cpuDeck.length === 0) ui.cpuDeckUi.classList.add('empty');
            if (hasCpu2 && cpu2Deck.length === 0) ui.cpu2DeckUi.classList.add('empty');
            if (hasCpu3 && cpu3Deck.length === 0) ui.cpu3DeckUi.classList.add('empty');
            if (playerDeck.length === 0) ui.playerDeckUi.classList.add('empty');

            renderHands();
            
            // ドローアニメーション
            const pNewIndex = playerHand.length - 1;
            const cNewIndex = cpuHand.length - 1;
            const c2NewIndex = cpu2Hand.length - 1;
            const c3NewIndex = cpu3Hand.length - 1;
            
            // スパイダー効果等で手札上限(5枚)のままドローが発生しない場合もあるため、ドローしたインデックスが有効か確認
            if (pNewIndex >= 0 && ui.playerHand.children[pNewIndex]) {
                ui.playerHand.children[pNewIndex].style.opacity = '0';
            }
            if (cNewIndex >= 0 && ui.cpuHand.children[cNewIndex]) {
                ui.cpuHand.children[cNewIndex].style.opacity = '0';
            }
            if (hasCpu2 && c2NewIndex >= 0 && ui.cpu2Hand.children[c2NewIndex]) {
                ui.cpu2Hand.children[c2NewIndex].style.opacity = '0';
            }
            if (hasCpu3 && c3NewIndex >= 0 && ui.cpu3Hand.children[c3NewIndex]) {
                ui.cpu3Hand.children[c3NewIndex].style.opacity = '0';
            }

            await drawSingleCardAnimation(pNewIndex, cNewIndex, hasCpu2 ? c2NewIndex : -1, hasCpu3 ? c3NewIndex : -1);

            currentRound++;
            ui.roundNumber.textContent = currentRound;
            isAnimating = false;
        } else {
            renderHands();
            endGame();
        }
    }

    async function drawSingleCardAnimation(playerIndex, cpuIndex, cpu2Index = -1, cpu3Index = -1) {
        return new Promise(resolve => {
            const playerDeckRect = ui.playerDeckUi.getBoundingClientRect();
            const cpuDeckRect = ui.cpuDeckUi.getBoundingClientRect();
            const cpu2DeckRect = ui.cpu2DeckUi ? ui.cpu2DeckUi.getBoundingClientRect() : null;
            const cpu3DeckRect = ui.cpu3DeckUi ? ui.cpu3DeckUi.getBoundingClientRect() : null;

            const pTargetEl = (playerIndex >= 0 && ui.playerHand.children[playerIndex]) ? ui.playerHand.children[playerIndex] : null;
            const cTargetEl = (cpuIndex >= 0 && ui.cpuHand.children[cpuIndex]) ? ui.cpuHand.children[cpuIndex] : null;
            const c2TargetEl = (cpu2Index >= 0 && ui.cpu2Hand && ui.cpu2Hand.children[cpu2Index]) ? ui.cpu2Hand.children[cpu2Index] : null;
            const c3TargetEl = (cpu3Index >= 0 && ui.cpu3Hand && ui.cpu3Hand.children[cpu3Index]) ? ui.cpu3Hand.children[cpu3Index] : null;

            if (!pTargetEl && !cTargetEl && !c2TargetEl && !c3TargetEl) {
                resolve();
                return;
            }

            let completedCount = 0;
            const targetCount = (pTargetEl ? 1 : 0) + (cTargetEl ? 1 : 0) + (c2TargetEl ? 1 : 0) + (c3TargetEl ? 1 : 0);

            function createAndAnimateCard(startRect, targetEl, isPlayer) {
                if (!startRect || !targetEl) return;
                
                const targetRect = targetEl.getBoundingClientRect();
                const card = document.createElement('div');
                card.className = 'dealing-card';
                card.style.left = startRect.left + 'px';
                card.style.top = startRect.top + 'px';
                card.innerHTML = '<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.3); font-size:1.2rem; font-weight:bold;">EAT<br>10</div>';
                document.body.appendChild(card);

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        card.style.left = targetRect.left + 'px';
                        card.style.top = targetRect.top + 'px';
                    });
                });

                setTimeout(() => {
                    card.remove();
                    targetEl.style.transition = 'opacity 0.2s';
                    targetEl.style.opacity = '1';
                    
                    setTimeout(() => { 
                        targetEl.style.transition = ''; 
                        targetEl.style.opacity = ''; 
                    }, 200);

                    completedCount++;
                    if (completedCount >= targetCount) {
                        resolve();
                    }
                }, 400);
            }

            if (cTargetEl && selectedPlayerCount < 3) createAndAnimateCard(cpuDeckRect, cTargetEl, false);
            else if (cTargetEl) completedCount++;

            if (c2TargetEl && selectedPlayerCount < 3) setTimeout(() => createAndAnimateCard(cpu2DeckRect, c2TargetEl, false), 50);
            else if (c2TargetEl) completedCount++;

            if (c3TargetEl && selectedPlayerCount < 3) setTimeout(() => createAndAnimateCard(cpu3DeckRect, c3TargetEl, false), 100);
            else if (c3TargetEl) completedCount++;

            if (pTargetEl) {
                setTimeout(() => {
                    createAndAnimateCard(playerDeckRect, pTargetEl, true);
                }, 150); // CPUのドローから少し遅らせて引く
            }
            
            // Resolve immediately if only skipped CPUs were targetted
            if (completedCount >= targetCount) {
                resolve();
            }
        });
    }

    async function playSlotAnimation(cardEl, finalVal) {
        return new Promise(resolve => {
            let iterations = 0;
            const intervalTime = 30; // faster speed
            const maxIterations = 30; // ~0.9s total
            const interval = setInterval(() => {
                iterations++;
                const randomVal = Math.floor(Math.random() * 10) + 1;
                cardEl.dataset.value = randomVal;
                cardEl.innerHTML = `<div class="card-number" style="opacity: 0.5; filter: blur(2px);">${randomVal}</div><div class="card-name">${window.t('transforming')}</div><div class="card-ability"></div>`;
                
                if (iterations >= maxIterations) {
                    clearInterval(interval);
                    cardEl.dataset.value = finalVal;
                    // Final reveal flash
                    cardEl.innerHTML = `<div class="card-number" style="color: #fcd34d; font-size: 3.5rem; text-shadow: 0 0 15px #fcd34d, 0 0 30px #f59e0b; transition: all 0.2s;">${finalVal}</div><div class="card-name" style="color: #fcd34d; font-weight: 800;">${window.t('transformed').replace('{0}', CARD_DATA[finalVal].name)}</div><div class="card-ability">${CARD_DATA[finalVal].ability}</div>`;
                    
                    cardEl.classList.add('final-glow');
                    
                    // Reset styling after a short delay
                    setTimeout(() => {
                        cardEl.innerHTML = `<div class="card-number">${finalVal}</div><div class="card-name">${window.t('transformed').replace('{0}', CARD_DATA[finalVal].name)}</div><div class="card-ability">${CARD_DATA[finalVal].ability}</div>`;
                        resolve();
                    }, 600);
                }
            }, intervalTime);
        });
    }

    async function handleSpiderAbility(isPlayer) {
        if (isPlayer) {
            const hasValidGrave = playerHistory.slice(0, -1).some(item => item.value != 3);
            if (!hasValidGrave || playerHand.length === 0) {
                if (isOnlineMode && conn) {
                    conn.send({ type: 'spider_choice', handVal: null, graveVal: null });
                }
                return;
            }
            
            return new Promise(resolve => {
                const overlay = document.createElement('div');
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100vw';
                overlay.style.height = '100vh';
                overlay.style.backgroundColor = 'rgba(0,0,0,0.85)';
                overlay.style.zIndex = '9999';
                overlay.style.display = 'flex';
                overlay.style.flexDirection = 'column';
                overlay.style.alignItems = 'center';
                overlay.style.justifyContent = 'center';
                overlay.style.color = 'white';

                overlay.innerHTML = `
                    <div style="background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(255,255,255,0.2); padding: 40px; border-radius: 20px; max-width: 95vw; display: flex; flex-wrap: wrap; gap: 40px; justify-content: center; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
                        <!-- Left Column -->
                        <div style="flex: 1; min-width: 300px; display: flex; flex-direction: column; align-items: center;">
                            <h2 style="margin-bottom: 20px; font-size: 1.8rem; color: white;">${window.t('spider_thread')}</h2>
                            
                            <p style="margin-bottom: 10px; color: #ccc; font-weight: bold;">${window.t('hand_spider')}</p>
                            <div id="spider-hand-container" style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px; flex-wrap: wrap;"></div>
                            
                            <p style="margin-bottom: 10px; color: #ccc; font-weight: bold;">${window.t('grave_spider')}</p>
                            <div id="spider-grave-container" style="display: flex; gap: 10px; justify-content: center; margin-bottom: 10px; flex-wrap: wrap;"></div>
                        </div>

                        <!-- Right Column -->
                        <div style="flex: 1; min-width: 280px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px; background: rgba(0,0,0,0.3); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                            <h3 style="margin-bottom: 30px; color: white; font-weight: 600;">${window.t('prepare_exchange')}</h3>
                            
                            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 40px;">
                                <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                                    <span style="font-size: 0.8rem; color: #ef4444;">${window.t('discard_btn')}</span>
                                    <div id="preview-discard" class="game-card" style="width: 80px; height: 112px; display: flex; justify-content: center; align-items: center; border: 2px dashed rgba(255,255,255,0.3); background-color: transparent;">?</div>
                                </div>
                                <div style="font-size: 2rem; color: white;">➔</div>
                                <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                                    <span style="font-size: 0.8rem; color: #10b981;">${window.t('pickup_btn')}</span>
                                    <div id="preview-pickup" class="game-card" style="width: 80px; height: 112px; display: flex; justify-content: center; align-items: center; border: 2px dashed rgba(255,255,255,0.3); background-color: transparent;">?</div>
                                </div>
                            </div>

                            <button id="spider-confirm" class="primary-btn" disabled style="opacity: 0.5; pointer-events: none; width: 100%;">${window.t('exchange_btn')}</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(overlay);

                const handContainer = overlay.querySelector('#spider-hand-container');
                const graveContainer = overlay.querySelector('#spider-grave-container');
                const confirmBtn = overlay.querySelector('#spider-confirm');

                let selectedHandIdx = -1;
                let selectedGraveIdx = -1;

                function checkReady() {
                    if (selectedHandIdx !== -1 && selectedGraveIdx !== -1) {
                        confirmBtn.disabled = false;
                        confirmBtn.style.opacity = '1';
                        confirmBtn.style.pointerEvents = 'auto';
                    }
                }

                function updatePreview() {
                    const previewDiscard = overlay.querySelector('#preview-discard');
                    const previewPickup = overlay.querySelector('#preview-pickup');
                    
                    if (selectedHandIdx !== -1) {
                        const val = playerHand[selectedHandIdx];
                        previewDiscard.dataset.value = val;
                        previewDiscard.innerHTML = '';
                        previewDiscard.style.border = 'none';
                    }
                    if (selectedGraveIdx !== -1) {
                        const val = playerHistory[selectedGraveIdx].value;
                        previewPickup.dataset.value = val;
                        previewPickup.innerHTML = '';
                        previewPickup.style.border = 'none';
                    }
                }

                function createMiniCard(val, isHand, index) {
                    const btn = document.createElement('div');
                    btn.className = 'game-card';
                    btn.dataset.value = val;
                    btn.style.width = '60px';
                    btn.style.height = '84px';
                    btn.style.cursor = 'pointer';
                    btn.style.outline = '3px solid transparent';
                    btn.style.outlineOffset = '2px';
                    btn.style.transition = 'all 0.2s';
                    
                    btn.onclick = () => {
                        const container = isHand ? handContainer : graveContainer;
                        Array.from(container.children).forEach(c => {
                            c.style.outline = '3px solid transparent';
                            c.style.transform = 'scale(1)';
                        });
                        btn.style.outline = '3px solid var(--accent-gradient)';
                        btn.style.transform = 'scale(1.1)';
                        
                        if (isHand) selectedHandIdx = index;
                        else selectedGraveIdx = index;
                        
                        updatePreview();
                        checkReady();
                    };
                    return btn;
                }

                playerHand.forEach((val, idx) => {
                    handContainer.appendChild(createMiniCard(val, true, idx));
                });

                playerHistory.forEach((item, idx) => {
                    if (idx === playerHistory.length - 1) return;
                    if (item.value == 3) return;
                    graveContainer.appendChild(createMiniCard(item.value, false, idx));
                });

                confirmBtn.onclick = () => {
                    const handVal = playerHand[selectedHandIdx];
                    const graveItem = playerHistory[selectedGraveIdx];
                    
                    playerHand.splice(selectedHandIdx, 1);
                    playerHand.push(graveItem.value);
                    
                    playerHistory.splice(selectedGraveIdx, 1);
                    playerHistory.push({ value: handVal, result: graveItem.result });
                    
                    if (isOnlineMode && conn) {
                        conn.send({ type: 'spider_choice', handVal, graveVal: graveItem.value });
                    }
                    
                    document.body.removeChild(overlay);
                    renderHands();
                    renderHistory();
                    resolve();
                };
            });
        } else {
            if (isOnlineMode) {
                return new Promise(resolve => {
                    // 既に選択を受信している場合
                    if (opponentSpiderChoice) {
                        applyOpponentSpiderChoice(resolve);
                    } else {
                        // 待つ
                        waitingForOpponentSpider = true;
                        window.resolveOpponentSpiderChoice = () => applyOpponentSpiderChoice(resolve);
                    }
                });
            } else {
                const validGraveIndices = [];
                cpuHistory.forEach((item, idx) => {
                    if (idx === cpuHistory.length - 1) return;
                    if (item.value != 3) validGraveIndices.push(idx);
                });
                if (validGraveIndices.length === 0 || cpuHand.length === 0) return Promise.resolve();
                const handIdx = Math.floor(Math.random() * cpuHand.length);
                const graveIdx = validGraveIndices[Math.floor(Math.random() * validGraveIndices.length)];
                
                const handVal = cpuHand[handIdx];
                const graveItem = cpuHistory[graveIdx];
                
                cpuHand.splice(handIdx, 1);
                cpuHand.push(graveItem.value);
                
                cpuHistory.splice(graveIdx, 1);
                cpuHistory.push({ value: handVal, result: graveItem.result });
                renderHistory();
                return Promise.resolve();
            }
        }
    }

    function applyOpponentSpiderChoice(resolve) {
        if (!opponentSpiderChoice) { resolve(); return; }
        const handVal = opponentSpiderChoice.handVal;
        const graveVal = opponentSpiderChoice.graveVal;
        
        const handIdx = cpuHand.indexOf(handVal);
        const graveIdx = cpuHistory.findIndex(h => h.value === graveVal);
        
        if (handIdx !== -1 && graveIdx !== -1) {
            const graveItem = cpuHistory[graveIdx];
            cpuHand.splice(handIdx, 1);
            cpuHand.push(graveItem.value);
            
            cpuHistory.splice(graveIdx, 1);
            cpuHistory.push({ value: handVal, result: graveItem.result });
            renderHistory();
        }
        
        opponentSpiderChoice = null;
        resolve();
    }

    function clearBattlefield() {
        let pModifierHtml = '';
        if (playerNextTurnModifier !== 0) {
            const modStr = playerNextTurnModifier > 0 ? `+${playerNextTurnModifier}` : `${playerNextTurnModifier}`;
            const modClass = playerNextTurnModifier < 0 ? 'negative' : '';
            pModifierHtml = `<div class="played-modifier-badge ${modClass}">${modStr}</div>`;
        }
        ui.playerPlayedSlot.innerHTML = `<div class="placeholder">?</div>${pModifierHtml}`;
        
        let cModifierHtml = '';
        if (cpuNextTurnModifier !== 0) {
            const modStr = cpuNextTurnModifier > 0 ? `+${cpuNextTurnModifier}` : `${cpuNextTurnModifier}`;
            const modClass = cpuNextTurnModifier < 0 ? 'negative' : '';
            cModifierHtml = `<div class="played-modifier-badge ${modClass}">${modStr}</div>`;
        }
        ui.cpuPlayedSlot.innerHTML = `<div class="placeholder">?</div>${cModifierHtml}`;

        if (ui.cpu2PlayedSlot && selectedPlayerCount >= 3) {
            let c2ModifierHtml = '';
            if (cpu2NextTurnModifier !== 0) {
                const modStr = cpu2NextTurnModifier > 0 ? `+${cpu2NextTurnModifier}` : `${cpu2NextTurnModifier}`;
                const modClass = cpu2NextTurnModifier < 0 ? 'negative' : '';
                c2ModifierHtml = `<div class="played-modifier-badge ${modClass}">${modStr}</div>`;
            }
            ui.cpu2PlayedSlot.innerHTML = `<div class="placeholder">?</div>${c2ModifierHtml}`;
        }

        if (ui.cpu3PlayedSlot && selectedPlayerCount >= 4) {
            let c3ModifierHtml = '';
            if (cpu3NextTurnModifier !== 0) {
                const modStr = cpu3NextTurnModifier > 0 ? `+${cpu3NextTurnModifier}` : `${cpu3NextTurnModifier}`;
                const modClass = cpu3NextTurnModifier < 0 ? 'negative' : '';
                c3ModifierHtml = `<div class="played-modifier-badge ${modClass}">${modStr}</div>`;
            }
            ui.cpu3PlayedSlot.innerHTML = `<div class="placeholder">?</div>${c3ModifierHtml}`;
        }
    }

    function updateScoreBoard() {
        if (ui.playerScore) ui.playerScore.textContent = playerScore;
        if (ui.cpuScore) ui.cpuScore.textContent = cpuScore;
        if (ui.cpu2Score) ui.cpu2Score.textContent = cpu2Score;
        if (ui.cpu3Score) ui.cpu3Score.textContent = cpu3Score;
    }

    function endGame() {
        ui.finalPlayerScore.textContent = playerScore;
        ui.finalCpuScore.textContent = cpuScore;
        
        const finalCpu2ScoreBox = document.getElementById('final-score-cpu2');
        const finalCpu3ScoreBox = document.getElementById('final-score-cpu3');
        if (finalCpu2ScoreBox && ui.finalCpu2Score) {
            ui.finalCpu2Score.textContent = cpu2Score;
            if (selectedPlayerCount >= 3) finalCpu2ScoreBox.classList.remove('hidden');
            else finalCpu2ScoreBox.classList.add('hidden');
        }
        if (finalCpu3ScoreBox && ui.finalCpu3Score) {
            ui.finalCpu3Score.textContent = cpu3Score;
            if (selectedPlayerCount >= 4) finalCpu3ScoreBox.classList.remove('hidden');
            else finalCpu3ScoreBox.classList.add('hidden');
        }

        let maxCpuScore = cpuScore;
        if (selectedPlayerCount >= 3) maxCpuScore = Math.max(maxCpuScore, cpu2Score);
        if (selectedPlayerCount >= 4) maxCpuScore = Math.max(maxCpuScore, cpu3Score);

        const restartBtn = document.getElementById('restart-btn');
        const endTitleBtn = document.getElementById('end-title-btn');
        
        if (restartBtn) {
            if (isOnlineMode) {
                restartBtn.textContent = window.t('back_to_settings');
            } else {
                restartBtn.textContent = window.t('play_again');
            }
        }
        
        if (endTitleBtn) {
            if (isOnlineMode) {
                endTitleBtn.classList.add('hidden');
            } else {
                endTitleBtn.classList.remove('hidden');
            }
        }
        
        stats.totalBattles++;
        
        // --- Elo Rating Logic for Online Matches ---
        if (isOnlineMode) {
            const K = 32;
            const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - stats.rating) / 400));
            let actualScore = 0.5; // Draw
            if (playerScore > maxCpuScore) {
                actualScore = 1.0; // Win
            } else if (maxCpuScore > playerScore) {
                actualScore = 0.0; // Lose
            }
            
            stats.rating = Math.max(0, Math.floor(stats.rating + K * (actualScore - expectedScore)));
            submitGlobalRatingScore(playerName, stats.rating, playerIcon, playerColor);
            saveStats();
        }
        
        if (playerScore > maxCpuScore) {
            stats.wins++;
        } else if (maxCpuScore > playerScore) {
            stats.losses++;
        } else {
            stats.draws++;
        }
        
        if (isWinStreakMode) {
            if (playerScore > maxCpuScore) {
                winStreakCount++;
                if (winStreakCount > stats.maxWinStreak) {
                    stats.maxWinStreak = winStreakCount;
                    submitGlobalScore(playerName, stats.maxWinStreak, playerIcon, playerColor);
                }
                ui.finalTitle.textContent = 'WIN';
                ui.finalTitle.style.color = 'var(--win-color)';
                ui.nextMatchBtn.classList.remove('hidden');
                restartBtn.classList.add('hidden');
            } else if (playerScore === maxCpuScore) {
                ui.finalTitle.textContent = 'DRAW';
                ui.finalTitle.style.color = 'var(--draw-color)';
                ui.nextMatchBtn.classList.add('hidden');
                restartBtn.classList.remove('hidden');
                // Reset streak count for next time
                winStreakCount = 0;
            } else {
                ui.finalTitle.textContent = 'LOSE';
                ui.finalTitle.style.color = 'var(--lose-color)';
                ui.nextMatchBtn.classList.add('hidden');
                restartBtn.classList.remove('hidden');
                // Reset streak count for next time
                winStreakCount = 0;
            }
        } else {
            ui.nextMatchBtn.classList.add('hidden');
            restartBtn.classList.remove('hidden');
            
            if (selectedPlayerCount >= 3) {
                let allScores = [{id: 'player', score: playerScore}, {id: 'cpu', score: cpuScore}];
                if (selectedPlayerCount >= 3) allScores.push({id: 'cpu2', score: cpu2Score});
                if (selectedPlayerCount >= 4) allScores.push({id: 'cpu3', score: cpu3Score});
                
                allScores.sort((a, b) => b.score - a.score);
                
                let rank = 1;
                let currentRank = 1;
                let prevScore = allScores[0].score;
                for (let i = 0; i < allScores.length; i++) {
                    if (allScores[i].score < prevScore) {
                        currentRank = i + 1;
                        prevScore = allScores[i].score;
                    }
                    
                    let rankEl = null;
                    if (allScores[i].id === 'player') rankEl = document.getElementById('final-player-rank');
                    if (allScores[i].id === 'cpu') rankEl = document.getElementById('final-cpu1-rank');
                    if (allScores[i].id === 'cpu2') rankEl = document.getElementById('final-cpu2-rank');
                    if (allScores[i].id === 'cpu3') rankEl = document.getElementById('final-cpu3-rank');
                    
                    if (rankEl) {
                        rankEl.textContent = `${currentRank}位`;
                        rankEl.style.display = 'block';
                        
                        if (currentRank === 1) rankEl.style.color = 'var(--win-color)';
                        else if (currentRank === allScores.length) rankEl.style.color = 'var(--lose-color)';
                        else rankEl.style.color = 'var(--draw-color)';
                    }
                    
                    if (allScores[i].id === 'player') {
                        rank = currentRank;
                    }
                }
                
                ui.finalTitle.textContent = `${rank}位`;
                if (rank === 1) {
                    ui.finalTitle.style.color = 'var(--win-color)';
                } else if (rank === allScores.length) {
                    ui.finalTitle.style.color = 'var(--lose-color)';
                } else {
                    ui.finalTitle.style.color = 'var(--draw-color)';
                }
            } else {
                if (playerScore > maxCpuScore) {
                    ui.finalTitle.textContent = 'VICTORY';
                    ui.finalTitle.style.color = 'var(--win-color)';
                } else if (maxCpuScore > playerScore) {
                    ui.finalTitle.textContent = 'DEFEAT';
                    ui.finalTitle.style.color = 'var(--lose-color)';
                } else {
                    ui.finalTitle.textContent = 'DRAW';
                    ui.finalTitle.style.color = 'var(--draw-color)';
                }
            }
        }
        
        saveStats();

        setTimeout(() => {
            switchScreen('end');
        }, 500);
    }

    // --- Utils ---
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function waitForClick(element) {
        return new Promise(resolve => {
            const handler = () => {
                element.removeEventListener('click', handler);
                resolve();
            };
            element.addEventListener('click', handler);
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function showHoverInfo(value) {
        if (!ui.hoverInfoPanel) return;
        
        const textPreview = document.getElementById('hover-text-preview');
        const card = CARD_DATA[value];
        
        if (textPreview && card) {
            ui.hoverCardPreview.classList.add('hidden');
            
            textPreview.innerHTML = `
                <h3 style="color: #fbcfe8; margin-top: 0; margin-bottom: 10px; font-size: 1.5rem; text-align: center; border-bottom: 1px solid rgba(236,72,153,0.3); padding-bottom: 10px;">${card.name}</h3>
                <div style="margin-bottom: 10px;">
                    <span style="color: #94a3b8; font-size: 0.9rem;">${window.t('strength_label')}</span><span style="font-size: 1.2rem; font-weight: bold; color: white;">${value}</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <span style="color: #94a3b8; font-size: 0.9rem;">${window.t('skill_label')}</span><span style="font-size: 1.1rem; color: #fbbf24; font-weight: bold;">${card.skillName}</span>
                </div>
                <div style="font-size: 0.95rem; line-height: 1.5; color: #e2e8f0;">
                    ${card.detailAbility}
                </div>
            `;
            
            textPreview.classList.remove('hidden');
        } else {
            ui.hoverCardPreview.classList.remove('hidden');
            if (textPreview) textPreview.classList.add('hidden');
            ui.hoverCardPreview.dataset.value = value;
        }
        
        ui.hoverInfoPanel.classList.remove('hidden');
    }

    function hideHoverInfo() {
        if (!ui.hoverInfoPanel) return;
        ui.hoverInfoPanel.classList.add('hidden');
    }

    // --- Title Background Animation ---
    const titleBgImages = ['ha.png', 'tyo.png', 'ku.png', 'ka.png', 'ne.png', 'he.png', 'ne2.png', 'i.png', 'ku2.png', 'hi.png'];
    let titleBgInterval = null;

    function startTitleBgAnimation() {
        const container = document.getElementById('title-bg-animation');
        if (!container) return;

        if (titleBgInterval) clearInterval(titleBgInterval);
        
        container.style.opacity = '1';
        
        const spawnImage = () => {
            if (!screens.title.classList.contains('active')) return;
            
            const imgName = titleBgImages[Math.floor(Math.random() * titleBgImages.length)];
            const img = document.createElement('img');
            img.src = imgName;
            img.className = 'floating-bg-image';
            
            const topPos = Math.random() * 70; // 0% to 70%
            const scale = 0.4 + Math.random() * 0.8; // 0.4x to 1.2x
            const duration = 12 + Math.random() * 20; // 12s to 32s
            
            img.style.top = `${topPos}%`;
            img.style.width = `${scale * 150}px`;
            img.style.animationDuration = `${duration}s`;
            
            // Random depth and opacity
            img.style.zIndex = Math.random() > 0.5 ? 0 : 2; 
            img.style.opacity = (0.2 + Math.random() * 0.4).toString();
            
            container.appendChild(img);
            
            setTimeout(() => {
                if (img.parentNode) {
                    img.parentNode.removeChild(img);
                }
            }, duration * 1000);
            
            titleBgInterval = setTimeout(spawnImage, 2000 + Math.random() * 3000);
        };
        
        spawnImage();
    }
    
    // Start animation initially if title screen is active
    if (screens.title.classList.contains('active')) {
        startTitleBgAnimation();
    }
    
    // Hook into switchScreen to restart animation if needed
    const originalSwitchScreen = switchScreen;
    switchScreen = function(screenName) {
        originalSwitchScreen(screenName);
        const container = document.getElementById('title-bg-animation');
        if (screenName === 'title') {
            startTitleBgAnimation();
        } else {
            if (container) container.style.opacity = '0';
            if (titleBgInterval) {
                clearTimeout(titleBgInterval);
                titleBgInterval = null;
            }
        }
    };

    // --- Settings Modal Logic ---
    const settingsBtn = document.getElementById('title-settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const resetDataBtn = document.getElementById('reset-data-btn');
        const langSelect = document.getElementById('language-select');
        if (langSelect) {
            langSelect.value = window.currentLang;
            langSelect.addEventListener('change', (e) => {
                localStorage.setItem('eat10_lang', e.target.value);
                location.reload();
            });
        }


    if (settingsBtn && settingsModal && closeSettingsBtn && resetDataBtn) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
            // Allow display block to apply before changing opacity for transition
            setTimeout(() => {
                settingsModal.style.opacity = '1';
                settingsModal.style.pointerEvents = 'auto';
            }, 10);
        });

        const closeSettings = () => {
            settingsModal.style.opacity = '0';
            settingsModal.style.pointerEvents = 'none';
            setTimeout(() => {
                settingsModal.classList.add('hidden');
            }, 300);
        };

        closeSettingsBtn.addEventListener('click', closeSettings);

        fetchGlobalRanking();

        resetDataBtn.addEventListener('click', () => {
            if (confirm(window.t('reset_confirm'))) {
                localStorage.removeItem('eat10_stats');
                localStorage.removeItem('eat10_profile');
                localStorage.removeItem('eat10_decks');
                alert(window.t('reset_done'));
                location.reload();
            }
        });
    }

});
