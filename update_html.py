import os

file_path = "index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    ('<input type="text" id="player-name-input" placeholder="プレイヤー名"', '<input type="text" id="player-name-input" data-i18n="player_name_placeholder" placeholder="プレイヤー名"'),
    ('id="title-battle-btn" class="primary-btn battle-start-btn" style="flex: 1; min-width: 180px; max-width: 280px; font-size: 1.6rem; padding: 1.2rem 1rem; letter-spacing: 2px;">バトル</button>', 'id="title-battle-btn" data-i18n="battle_btn" class="primary-btn battle-start-btn" style="flex: 1; min-width: 180px; max-width: 280px; font-size: 1.6rem; padding: 1.2rem 1rem; letter-spacing: 2px;">バトル</button>'),
    ('id="title-deck-btn" class="primary-btn battle-start-btn" style="flex: 1; min-width: 180px; max-width: 280px; font-size: 1.6rem; padding: 1.2rem 1rem; letter-spacing: 2px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);">デッキ</button>', 'id="title-deck-btn" data-i18n="deck_btn" class="primary-btn battle-start-btn" style="flex: 1; min-width: 180px; max-width: 280px; font-size: 1.6rem; padding: 1.2rem 1rem; letter-spacing: 2px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);">デッキ</button>'),
    ('id="title-record-btn" class="primary-btn battle-start-btn" style="flex: 1; min-width: 180px; max-width: 280px; font-size: 1.6rem; padding: 1.2rem 1rem; letter-spacing: 2px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); box-shadow: 0 10px 25px rgba(245, 158, 11, 0.4);">記録</button>', 'id="title-record-btn" data-i18n="record_btn" class="primary-btn battle-start-btn" style="flex: 1; min-width: 180px; max-width: 280px; font-size: 1.6rem; padding: 1.2rem 1rem; letter-spacing: 2px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); box-shadow: 0 10px 25px rgba(245, 158, 11, 0.4);">記録</button>'),
    ('id="title-rules-btn" class="primary-btn battle-start-btn" style="flex: 1; min-width: 180px; max-width: 280px; font-size: 1.4rem; padding: 1.2rem 1rem; letter-spacing: 1px; white-space: nowrap; background: linear-gradient(135deg, #10b981 0%, #047857 100%); box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);">EAT10とは？</button>', 'id="title-rules-btn" data-i18n="rules_btn" class="primary-btn battle-start-btn" style="flex: 1; min-width: 180px; max-width: 280px; font-size: 1.4rem; padding: 1.2rem 1rem; letter-spacing: 1px; white-space: nowrap; background: linear-gradient(135deg, #10b981 0%, #047857 100%); box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);">EAT10とは？</button>'),
    
    ('id="deck-list-top-back-btn" class="title-return-btn hidden">戻る</button>', 'id="deck-list-top-back-btn" data-i18n="return_btn" class="title-return-btn hidden">戻る</button>'),
    ('<h2 class="category-title" style="margin-bottom: 30px; font-size: 2.2rem;">デッキ一覧</h2>', '<h2 data-i18n="deck_list_title" class="category-title" style="margin-bottom: 30px; font-size: 2.2rem;">デッキ一覧</h2>'),
    ('id="deck-list-start-battle-btn" class="start-btn" style="padding: 15px 80px; font-size: 1.8rem; background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%); border: none; border-radius: 50px; color: white; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: transform 0.2s;">バトル開始！</button>', 'id="deck-list-start-battle-btn" data-i18n="battle_start_btn" class="start-btn" style="padding: 15px 80px; font-size: 1.8rem; background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%); border: none; border-radius: 50px; color: white; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: transform 0.2s;">バトル開始！</button>'),
    ('id="deck-list-back-btn" class="secondary-btn" style="padding: 15px 80px; font-size: 1.5rem; border: none; border-radius: 50px; color: white; font-weight: bold; cursor: pointer; background: #475569; transition: background 0.2s;">戻る</button>', 'id="deck-list-back-btn" data-i18n="return_btn" class="secondary-btn" style="padding: 15px 80px; font-size: 1.5rem; border: none; border-radius: 50px; color: white; font-weight: bold; cursor: pointer; background: #475569; transition: background 0.2s;">戻る</button>'),
    
    ('id="record-back-btn" class="title-return-btn">戻る</button>', 'id="record-back-btn" data-i18n="return_btn" class="title-return-btn">戻る</button>'),
    ('<h2 class="category-title" style="margin-bottom: 30px; font-size: 2.2rem;">記録</h2>', '<h2 data-i18n="record_title" class="category-title" style="margin-bottom: 30px; font-size: 2.2rem;">記録</h2>'),
    ('<h3 style="color: white; font-size: 1.5rem; text-align: center; margin-bottom: 20px; letter-spacing: 2px;">戦績記録</h3>', '<h3 data-i18n="battle_record_title" style="color: white; font-size: 1.5rem; text-align: center; margin-bottom: 20px; letter-spacing: 2px;">戦績記録</h3>'),
    ('<span style="font-size: 1.2rem; color: #94a3b8; font-weight: bold;">総バトル数</span>', '<span data-i18n="total_battles" style="font-size: 1.2rem; color: #94a3b8; font-weight: bold;">総バトル数</span>'),
    ('<span style="font-size: 1.2rem; color: #94a3b8; font-weight: bold;">勝利数</span>', '<span data-i18n="total_wins" style="font-size: 1.2rem; color: #94a3b8; font-weight: bold;">勝利数</span>'),
    ('<span style="font-size: 1.2rem; color: #94a3b8; font-weight: bold;">敗北数</span>', '<span data-i18n="total_losses" style="font-size: 1.2rem; color: #94a3b8; font-weight: bold;">敗北数</span>'),
    ('<span style="font-size: 1.2rem; color: #94a3b8; font-weight: bold;">引き分け数</span>', '<span data-i18n="total_draws" style="font-size: 1.2rem; color: #94a3b8; font-weight: bold;">引き分け数</span>'),
    ('<span style="font-size: 1.2rem; color: #94a3b8; font-weight: bold;">最大連勝数</span>', '<span data-i18n="max_streak" style="font-size: 1.2rem; color: #94a3b8; font-weight: bold;">最大連勝数</span>'),
    
    ('<h3 style="color: #fbbf24; font-size: 1.5rem; text-align: center; margin-bottom: 20px; letter-spacing: 2px;">🌍 CPU連勝 世界ランキング 🌍</h3>', '<h3 data-i18n="global_ranking_title" style="color: #fbbf24; font-size: 1.5rem; text-align: center; margin-bottom: 20px; letter-spacing: 2px;">🌍 CPU連勝 世界ランキング 🌍</h3>'),
    ('<div id="leaderboard-loading" style="text-align: center; color: #94a3b8; padding: 40px 0;">読み込み中...</div>', '<div id="leaderboard-loading" data-i18n="loading" style="text-align: center; color: #94a3b8; padding: 40px 0;">読み込み中...</div>'),
    ('<th style="padding: 10px; text-align: center; width: 60px; color: #fbbf24;">順位</th>', '<th data-i18n="rank_col" style="padding: 10px; text-align: center; width: 60px; color: #fbbf24;">順位</th>'),
    ('<th style="padding: 10px; text-align: left; color: #fbbf24;">プレイヤー名</th>', '<th data-i18n="name_col" style="padding: 10px; text-align: left; color: #fbbf24;">プレイヤー名</th>'),
    ('<th style="padding: 10px; text-align: right; color: #fbbf24;">連勝数</th>', '<th data-i18n="streak_col" style="padding: 10px; text-align: right; color: #fbbf24;">連勝数</th>'),
    
    ('id="how-to-back-btn" class="title-return-btn">戻る</button>', 'id="how-to-back-btn" data-i18n="return_btn" class="title-return-btn">戻る</button>'),
    ('<h2 style="color: white; font-size: 2rem; margin-bottom: 10px; text-shadow: 0 0 10px rgba(255,255,255,0.3);">EAT10とは？</h2>', '<h2 data-i18n="rules_btn" style="color: white; font-size: 2rem; margin-bottom: 10px; text-shadow: 0 0 10px rgba(255,255,255,0.3);">EAT10とは？</h2>'),
    ('id="how-to-card-list-btn" class="primary-btn battle-start-btn" style="padding: 0.8rem 2.5rem; font-size: 1.2rem; letter-spacing: 1px; background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%); box-shadow: 0 5px 15px rgba(168, 85, 247, 0.4);">カード一覧</button>', 'id="how-to-card-list-btn" data-i18n="card_list_btn" class="primary-btn battle-start-btn" style="padding: 0.8rem 2.5rem; font-size: 1.2rem; letter-spacing: 1px; background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%); box-shadow: 0 5px 15px rgba(168, 85, 247, 0.4);">カード一覧</button>'),
    
    ('id="card-list-back-btn" class="title-return-btn">戻る</button>', 'id="card-list-back-btn" data-i18n="return_btn" class="title-return-btn">戻る</button>'),
    ('<h2 class="category-title" style="margin-bottom: 30px; font-size: 2.2rem;">カード一覧</h2>', '<h2 data-i18n="card_list_btn" class="category-title" style="margin-bottom: 30px; font-size: 2.2rem;">カード一覧</h2>'),
    
    ('id="format-back-btn" class="title-return-btn">戻る</button>', 'id="format-back-btn" data-i18n="return_btn" class="title-return-btn">戻る</button>'),
    ('<h2 class="category-title" style="margin-top: 40px; margin-bottom: 30px; font-size: 2.2rem;">プレイ形式を選択</h2>', '<h2 data-i18n="format_title" class="category-title" style="margin-top: 40px; margin-bottom: 30px; font-size: 2.2rem;">プレイ形式を選択</h2>'),
    ('ひとりで遊ぶ<br><span class="mode-desc">CPUと対戦するモード</span>', '<span data-i18n="single_play">ひとりで遊ぶ</span><br><span data-i18n="single_play_desc" class="mode-desc">CPUと対戦するモード</span>'),
    ('友達と遊ぶ<br><span class="mode-desc">ルームIDを使って通信対戦</span>', '<span data-i18n="online_play">友達と遊ぶ</span><br><span data-i18n="online_play_desc" class="mode-desc">ルームIDを使って通信対戦</span>'),
    ('だれかと遊ぶ<br><span class="mode-desc">知らない人と自動マッチング</span>', '<span data-i18n="random_play">だれかと遊ぶ</span><br><span data-i18n="random_play_desc" class="mode-desc">知らない人と自動マッチング</span>'),
    
    ('id="random-match-back-btn" class="title-return-btn">戻る</button>', 'id="random-match-back-btn" data-i18n="return_btn" class="title-return-btn">戻る</button>'),
    ('<h2 class="category-title" style="margin-top: 100px; margin-bottom: 30px; font-size: 2.2rem;">だれかと遊ぶ</h2>', '<h2 data-i18n="random_play" class="category-title" style="margin-top: 100px; margin-bottom: 30px; font-size: 2.2rem;">だれかと遊ぶ</h2>'),
    ('<h3 style="color: white; font-size: 1.5rem; margin-bottom: 20px;">ランダムマッチング</h3>', '<h3 data-i18n="random_match_subtitle" style="color: white; font-size: 1.5rem; margin-bottom: 20px;">ランダムマッチング</h3>'),
    ('<p id="random-match-status" style="color: white; font-size: 1.2rem; margin-bottom: 20px;">対戦相手を探しています...</p>', '<p id="random-match-status" data-i18n="random_match_status" style="color: white; font-size: 1.2rem; margin-bottom: 20px;">対戦相手を探しています...</p>'),
    ('<p class="mode-desc" style="color: #94a3b8; font-size: 1rem; margin-bottom: 30px;">（ノーマルルール・シンプルモード）</p>', '<p data-i18n="random_match_desc" class="mode-desc" style="color: #94a3b8; font-size: 1rem; margin-bottom: 30px;">（ノーマルルール・シンプルモード）</p>'),
    
    ('id="rule-back-btn" class="title-return-btn">戻る</button>', 'id="rule-back-btn" data-i18n="return_btn" class="title-return-btn">戻る</button>'),
    ('<h2 id="start-screen-title" class="category-title" style="margin-top: 40px; margin-bottom: 10px; font-size: 2.2rem;">バトル設定</h2>', '<h2 id="start-screen-title" data-i18n="battle_settings_title" class="category-title" style="margin-top: 40px; margin-bottom: 10px; font-size: 2.2rem;">バトル設定</h2>'),
    ('<h3 id="rule-selection-title" class="section-title" style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 12px; letter-spacing: 2px; text-transform: uppercase;">1. ルールを選択</h3>', '<h3 id="rule-selection-title" data-i18n="rule_select_title" class="section-title" style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 12px; letter-spacing: 2px; text-transform: uppercase;">1. ルールを選択</h3>'),
    ('ノーマルルール<br><span class="mode-desc">固定10枚のデッキで対戦</span>', '<span data-i18n="normal_rule">ノーマルルール</span><br><span data-i18n="normal_rule_desc" class="mode-desc">固定10枚のデッキで対戦</span>'),
    ('デッキルール<br><span class="mode-desc">好きな10枚を組んで対戦</span>', '<span data-i18n="deck_rule">デッキルール</span><br><span data-i18n="deck_rule_desc" class="mode-desc">好きな10枚を組んで対戦</span>'),
    
    ('<h3 class="section-title" style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 12px; letter-spacing: 2px; text-transform: uppercase;">2. モードを選択</h3>', '<h3 data-i18n="mode_select_title" class="section-title" style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 12px; letter-spacing: 2px; text-transform: uppercase;">2. モードを選択</h3>'),
    ('シンプルモード<br><span class="mode-desc">5ラウンドで1試合を行う基本モード</span>', '<span data-i18n="simple_mode">シンプルモード</span><br><span data-i18n="simple_mode_desc" class="mode-desc">5ラウンドで1試合を行う基本モード</span>'),
    ('連勝モード<br><span class="mode-desc">負けるまで無限に続くサバイバル</span>', '<span data-i18n="streak_mode">連勝モード</span><br><span data-i18n="streak_mode_desc" class="mode-desc">負けるまで無限に続くサバイバル</span>'),
    
    ('<h3 class="section-title" style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 12px; letter-spacing: 2px; text-transform: uppercase;">3. プレイ人数</h3>', '<h3 data-i18n="player_count_title" class="section-title" style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 12px; letter-spacing: 2px; text-transform: uppercase;">3. プレイ人数</h3>'),
    ('2人プレイ<br><span class="mode-desc">1対1の対戦</span>', '<span data-i18n="player_2">2人プレイ</span><br><span data-i18n="player_2_desc" class="mode-desc">1対1の対戦</span>'),
    ('3人プレイ<br><span class="mode-desc">三つ巴の戦い</span>', '<span data-i18n="player_3">3人プレイ</span><br><span data-i18n="player_3_desc" class="mode-desc">三つ巴の戦い</span>'),
    ('4人プレイ<br><span class="mode-desc">大乱闘</span>', '<span data-i18n="player_4">4人プレイ</span><br><span data-i18n="player_4_desc" class="mode-desc">大乱闘</span>'),
    
    ('id="play-start-btn" class="primary-btn battle-start-btn" style="font-size: 1.6rem; padding: 1rem 3.5rem;">バトル開始！</button>', 'id="play-start-btn" data-i18n="battle_start_btn" class="primary-btn battle-start-btn" style="font-size: 1.6rem; padding: 1rem 3.5rem;">バトル開始！</button>'),
    
    ('id="lobby-back-btn" class="title-return-btn">戻る</button>', 'id="lobby-back-btn" data-i18n="return_btn" class="title-return-btn">戻る</button>'),
    ('<h2 class="category-title" style="margin-top: 40px; margin-bottom: 30px; font-size: 2.2rem;">オンラインロビー</h2>', '<h2 data-i18n="lobby_title" class="category-title" style="margin-top: 40px; margin-bottom: 30px; font-size: 2.2rem;">オンラインロビー</h2>'),
    ('id="show-host-panel-btn" class="primary-btn battle-start-btn" style="width: 100%; font-size: 1.5rem; padding: 20px;">部屋を作る</button>', 'id="show-host-panel-btn" data-i18n="create_room" class="primary-btn battle-start-btn" style="width: 100%; font-size: 1.5rem; padding: 20px;">部屋を作る</button>'),
    ('id="show-join-panel-btn" class="primary-btn battle-start-btn" style="width: 100%; font-size: 1.5rem; padding: 20px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);">部屋に入る</button>', 'id="show-join-panel-btn" data-i18n="join_room" class="primary-btn battle-start-btn" style="width: 100%; font-size: 1.5rem; padding: 20px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);">部屋に入る</button>'),
    
    ('<h3 style="color: white; margin-bottom: 20px;">部屋を作る</h3>', '<h3 data-i18n="create_room" style="color: white; margin-bottom: 20px;">部屋を作る</h3>'),
    ('<p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 20px; text-align: center;">ルームIDを発行して友達を待ちます。</p>', '<p data-i18n="create_room_desc" style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 20px; text-align: center;">ルームIDを発行して友達を待ちます。</p>'),
    ('<p style="color: #fbbf24; font-size: 0.9rem; margin-top: 15px;" class="blinking-text">参加者を待っています...</p>', '<p data-i18n="waiting_participants" style="color: #fbbf24; font-size: 0.9rem; margin-top: 15px;" class="blinking-text">参加者を待っています...</p>'),
    
    ('<h3 style="color: white; margin-bottom: 20px;">部屋に入る</h3>', '<h3 data-i18n="join_room" style="color: white; margin-bottom: 20px;">部屋に入る</h3>'),
    ('<p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 20px; text-align: center;">友達のRoom IDを入力して参加します。</p>', '<p data-i18n="join_room_desc" style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 20px; text-align: center;">友達のRoom IDを入力して参加します。</p>'),
    ('placeholder="Room ID (6桁)"', 'data-i18n="join_placeholder" placeholder="Room ID (6桁)"'),
    
    ('<h2 class="category-title" style="margin-top: 100px; margin-bottom: 30px; font-size: 2.2rem;">オンラインロビー</h2>', '<h2 data-i18n="lobby_title" class="category-title" style="margin-top: 100px; margin-bottom: 30px; font-size: 2.2rem;">オンラインロビー</h2>'),
    ('<p id="guest-wait-message" style="color: white; font-size: 1.5rem; margin-bottom: 20px;">ルールを設定中です</p>', '<p id="guest-wait-message" data-i18n="setting_rules" style="color: white; font-size: 1.5rem; margin-bottom: 20px;">ルールを設定中です</p>'),
    ('<p style="color: #94a3b8; font-size: 1rem; margin-bottom: 30px;">しばらくお待ちください...</p>', '<p data-i18n="wait_a_moment" style="color: #94a3b8; font-size: 1rem; margin-bottom: 30px;">しばらくお待ちください...</p>'),
    
    ('<h1 class="deck-title">デッキ構築</h1>', '<h1 data-i18n="deck_rule" class="deck-title">デッキ構築</h1>'),
    ('<div class="deck-count-badge">合計: <span id="deck-total-count">0</span>/10 枚</div>', '<div class="deck-count-badge"><span data-i18n="deck_total">合計</span>: <span id="deck-total-count">0</span>/10 枚</div>'),
    ('<p class="deck-desc">1〜10のカードから、同じカードは最大3枚まで選べます。</p>', '<p data-i18n="deck_desc" class="deck-desc">1〜10のカードから、同じカードは最大3枚まで選べます。</p>'),
    ('id="deck-back-btn" class="deck-action-btn back-btn">キャンセル</button>', 'id="deck-back-btn" data-i18n="cancel_btn" class="deck-action-btn back-btn">キャンセル</button>'),
    ('id="deck-save-btn" class="deck-action-btn start-btn" disabled>保存する</button>', 'id="deck-save-btn" data-i18n="save_btn" class="deck-action-btn start-btn" disabled>保存する</button>'),
    
    ('id="game-title-btn" class="title-return-btn">タイトルに戻る</button>', 'id="game-title-btn" data-i18n="return_title_btn" class="title-return-btn">タイトルに戻る</button>'),
    ('山札 <button id="view-cpu1-deck-btn" class="deck-view-btn hidden">デッキを見る</button>', '<span data-i18n="deck_view">山札</span> <button id="view-cpu1-deck-btn" data-i18n="deck_view_btn" class="deck-view-btn hidden">デッキを見る</button>'),
    ('山札 <button id="view-cpu2-deck-btn" class="deck-view-btn hidden">デッキを見る</button>', '<span data-i18n="deck_view">山札</span> <button id="view-cpu2-deck-btn" data-i18n="deck_view_btn" class="deck-view-btn hidden">デッキを見る</button>'),
    ('山札 <button id="view-cpu3-deck-btn" class="deck-view-btn hidden">デッキを見る</button>', '<span data-i18n="deck_view">山札</span> <button id="view-cpu3-deck-btn" data-i18n="deck_view_btn" class="deck-view-btn hidden">デッキを見る</button>'),
    ('山札 <button id="view-player-deck-btn" class="deck-view-btn">デッキを見る</button>', '<span data-i18n="deck_view">山札</span> <button id="view-player-deck-btn" data-i18n="deck_view_btn" class="deck-view-btn">デッキを見る</button>'),
    ('<div class="history-label">お墓</div>', '<div data-i18n="grave" class="history-label">お墓</div>'),
    
    ('<button id="ready-btn" class="ready-btn hidden" disabled>EAT？</button>', '<button id="ready-btn" data-i18n="ready_btn" class="ready-btn hidden" disabled>EAT？</button>'),
    ('<button id="next-match-btn" class="primary-btn hidden" style="margin-top: 30px; font-size: 1.5rem; padding: 1rem 3rem;">次のゲームへ</button>', '<button id="next-match-btn" data-i18n="next_match" class="primary-btn hidden" style="margin-top: 30px; font-size: 1.5rem; padding: 1rem 3rem;">次のゲームへ</button>'),
    ('<button id="restart-btn" class="primary-btn" style="margin-top: 30px; font-size: 1.5rem; padding: 1rem 3rem; background: linear-gradient(135deg, #10b981 0%, #047857 100%);">もう一戦</button>', '<button id="restart-btn" data-i18n="play_again" class="primary-btn" style="margin-top: 30px; font-size: 1.5rem; padding: 1rem 3rem; background: linear-gradient(135deg, #10b981 0%, #047857 100%);">もう一戦</button>'),
    ('<button id="end-title-btn" class="secondary-btn" style="margin-top: 20px; font-size: 1.2rem; padding: 0.8rem 2rem;">タイトルに戻る</button>', '<button id="end-title-btn" data-i18n="return_title_btn" class="secondary-btn" style="margin-top: 20px; font-size: 1.2rem; padding: 0.8rem 2rem;">タイトルに戻る</button>'),
    
    ('<h2 style="color: white; margin-top: 0; margin-bottom: 25px; text-align: center;">設定</h2>', '<h2 data-i18n="settings_title" style="color: white; margin-top: 0; margin-bottom: 25px; text-align: center;">設定</h2>'),
    ('<label style="color: #cbd5e1; display: block; margin-bottom: 10px; font-size: 1.1rem; font-weight: bold;">BGM 音量</label>', '<label data-i18n="bgm_volume" style="color: #cbd5e1; display: block; margin-bottom: 10px; font-size: 1.1rem; font-weight: bold;">BGM 音量</label>'),
    ('<label style="color: #cbd5e1; display: block; margin-bottom: 10px; font-size: 1.1rem; font-weight: bold;">SE 音量</label>', '<label data-i18n="se_volume" style="color: #cbd5e1; display: block; margin-bottom: 10px; font-size: 1.1rem; font-weight: bold;">SE 音量</label>'),
    ('<button id="reset-data-btn" style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #ef4444; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background=\'rgba(239, 68, 68, 0.4)\'" onmouseout="this.style.background=\'rgba(239, 68, 68, 0.2)\'">セーブデータをリセット</button>', '<button id="reset-data-btn" data-i18n="reset_data" style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #ef4444; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background=\'rgba(239, 68, 68, 0.4)\'" onmouseout="this.style.background=\'rgba(239, 68, 68, 0.2)\'">セーブデータをリセット</button>')
]

for old, new in replacements:
    content = content.replace(old, new)

# Add language dropdown in settings modal
lang_select_html = """
            <div style="margin-bottom: 20px;">
                <label data-i18n="language" style="color: #cbd5e1; display: block; margin-bottom: 10px; font-size: 1.1rem; font-weight: bold;">言語 / Language</label>
                <select id="language-select" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.5); color: white; border: 1px solid #3b82f6; border-radius: 8px; font-size: 1.1rem; outline: none;">
                    <option value="ja">日本語</option>
                    <option value="en">English</option>
                    <option value="zh">中文 (简体)</option>
                    <option value="ko">한국어</option>
                </select>
            </div>
            """
if 'id="bgm-volume"' in content and 'id="language-select"' not in content:
    # Insert before BGM volume
    content = content.replace('<div style="margin-bottom: 20px;">\n                <label data-i18n="bgm_volume"', lang_select_html + '<div style="margin-bottom: 20px;">\n                <label data-i18n="bgm_volume"')

# include i18n.js
if '<script src="i18n.js"></script>' not in content:
    content = content.replace('<script src="app.js"></script>', '<script src="i18n.js"></script>\n    <script src="app.js"></script>')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
