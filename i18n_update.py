import re

file_path = "i18n.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

def insert_dict(lang, key, val):
    global content
    pattern = rf"('{lang}':\s*{{)"
    content = re.sub(pattern, rf"\1\n            '{key}': '{val}',", content)

missing = {
    'target_select_7': {'ja': 'ネコ(7)のコピー対象を選んでください', 'en': 'Select target to copy for Cat(7)', 'zh': '请选择猫(7)的复制目标', 'ko': '고양이(7)의 복사 대상을 선택하세요'},
    'target_select_8': {'ja': 'イノシシ(8)の無効化対象を選んでください', 'en': 'Select target to nullify for Boar(8)', 'zh': '请选择野猪(8)的无效化目标', 'ko': '멧돼지(8)의 무효화 대상을 선택하세요'},
    'spider_thread': {'ja': '蜘蛛の糸', 'en': 'Spider Web', 'zh': '蜘蛛网', 'ko': '거미줄'},
    'hand_spider': {'ja': '手札', 'en': 'Hand', 'zh': '手牌', 'ko': '패'},
    'grave_spider': {'ja': 'お墓', 'en': 'Grave', 'zh': '墓地', 'ko': '무덤'},
    'prepare_exchange': {'ja': '交換の準備', 'en': 'Prepare to Exchange', 'zh': '准备交换', 'ko': '교환 준비'},
    'discard_btn': {'ja': '【捨てる】', 'en': '[Discard]', 'zh': '【丢弃】', 'ko': '【버리기】'},
    'pickup_btn': {'ja': '【拾う】', 'en': '[Pick Up]', 'zh': '【捡起】', 'ko': '【줍기】'},
    'exchange_btn': {'ja': '交換する', 'en': 'Exchange', 'zh': '交换', 'ko': '교환'},
    'back_to_settings': {'ja': '設定に戻る', 'en': 'Back to Settings', 'zh': '返回设置', 'ko': '설정으로 돌아가기'},
    'play_again': {'ja': 'もう一戦', 'en': 'Play Again', 'zh': '再来一局', 'ko': '다시 하기'},
    'deck_preview_title': {'ja': '{0} の中身', 'en': 'Contents of {0}', 'zh': '{0} 的内容', 'ko': '{0} 의 내용'},
    'deck_confirm_delete': {'ja': 'デッキ {0} を本当に削除しますか？', 'en': 'Are you sure you want to delete deck {0}?', 'zh': '确定要删除牌组 {0} 吗？', 'ko': '덱 {0} 을(를) 정말 삭제하시겠습니까?'},
    'empty_deck_error': {'ja': '選択中のデッキ（デッキ {0}）が未作成です。', 'en': 'Selected deck (Deck {0}) is empty.', 'zh': '选中的牌组（牌组 {0}）为空。', 'ko': '선택한 덱(덱 {0})이 비어 있습니다.'},
    'invalid_deck_error': {'ja': '選択中のデッキの枚数が10枚ではありません。編集してください。', 'en': 'The selected deck must have exactly 10 cards. Please edit it.', 'zh': '选中的牌组必须正好是10张牌。请编辑。', 'ko': '선택한 덱은 10장이어야 합니다. 편집해주세요.'},
    'input_deck_name': {'ja': 'デッキ名を入力してください（最大10文字）', 'en': 'Enter deck name (max 10 chars)', 'zh': '请输入牌组名称（最多10个字符）', 'ko': '덱 이름을 입력하세요 (최대 10자)'},
    'cpu_deck_title': {'ja': '相手のデッキ', 'en': 'Opponent Deck', 'zh': '对手的牌组', 'ko': '상대 덱'},
    'your_deck_title': {'ja': 'あなたが組んだデッキ', 'en': 'Your Deck', 'zh': '你的牌组', 'ko': '당신의 덱'},
    'close_btn': {'ja': '閉じる', 'en': 'Close', 'zh': '关闭', 'ko': '닫기'},
    'battle_start_btn': {'ja': 'バトル開始！', 'en': 'Start Battle!', 'zh': '开始战斗！', 'ko': '배틀 시작!'},
    'invalid_room_id': {'ja': '6桁のRoom IDを入力してください。', 'en': 'Please enter a 6-digit Room ID.', 'zh': '请输入6位房间号。', 'ko': '6자리 Room ID를 입력하세요.'},
    'conn_failed': {'ja': '接続に失敗しました。IDを確認してください。', 'en': 'Connection failed. Check the ID.', 'zh': '连接失败，请检查ID。', 'ko': '연결 실패. ID를 확인하세요.'},
    'conn_error': {'ja': '接続エラー: ', 'en': 'Connection Error: ', 'zh': '连接错误: ', 'ko': '연결 오류: '},
    'no_match_found': {'ja': '現在マッチングできる部屋が見つかりませんでした。時間をおいて再度お試しください。', 'en': 'No match found. Please try again later.', 'zh': '目前没有找到匹配的房间，请稍后再试。', 'ko': '현재 매칭할 방을 찾을 수 없습니다. 나중에 다시 시도하세요.'},
    'room_created_waiting': {'ja': '部屋を作成しました。相手を待っています...', 'en': 'Room created. Waiting for opponent...', 'zh': '房间已创建，正在等待对手...', 'ko': '방이 생성되었습니다. 상대를 기다리는 중...'},
    'opponent_joined': {'ja': '{0} が参加しました！', 'en': '{0} joined!', 'zh': '{0} 加入了！', 'ko': '{0} 참가!'},
    'host_label': {'ja': 'ホスト: {0}', 'en': 'Host: {0}', 'zh': '房主: {0}', 'ko': '호스트: {0}'},
    'host_wait': {'ja': 'ホストの準備待ち...', 'en': 'Waiting for host...', 'zh': '等待房主准备...', 'ko': '호스트 준비 대기 중...'},
    'in_use': {'ja': '使用中', 'en': 'In Use', 'zh': '使用中', 'ko': '사용 중'},
    'use_this': {'ja': 'これを使う', 'en': 'Use This', 'zh': '使用这个', 'ko': '이것을 사용'},
    'check_btn': {'ja': '確認', 'en': 'Check', 'zh': '确认', 'ko': '확인'},
    'edit_btn': {'ja': '編集', 'en': 'Edit', 'zh': '编辑', 'ko': '편집'},
    'delete_btn': {'ja': '削除', 'en': 'Delete', 'zh': '删除', 'ko': '삭제'},
    'create_new_btn': {'ja': '新規作成', 'en': 'Create New', 'zh': '新建', 'ko': '새로 만들기'},
    'strength_label': {'ja': '強さ：', 'en': 'STR:', 'zh': '力量：', 'ko': '힘:'},
    'skill_label': {'ja': 'わざ：', 'en': 'SKILL:', 'zh': '技能：', 'ko': '기술:'},
    'deck_select_battle': {'ja': 'バトルで使用するデッキを選択', 'en': 'Select Deck for Battle', 'zh': '选择战斗牌组', 'ko': '배틀에 사용할 덱 선택'},
    'deck_select_normal': {'ja': 'デッキ一覧', 'en': 'Deck List', 'zh': '牌组列表', 'ko': '덱 목록'},
    'rule_deck_simple': {'ja': '（デッキルール・シンプルモード）', 'en': '(Deck Rule / Simple Mode)', 'zh': '（牌组规则・简单模式）', 'ko': '（덱 규칙・심플 모드）'},
    'rule_normal_simple': {'ja': '（ノーマルルール・シンプルモード）', 'en': '(Normal Rule / Simple Mode)', 'zh': '（普通规则・简单模式）', 'ko': '（노멀 규칙・심플 모드）'},
    'transforming': {'ja': 'チョウ(変身中...)', 'en': 'Butterfly(Transforming...)', 'zh': '蝴蝶(变形中...)', 'ko': '나비(변신중...)'},
    'transformed': {'ja': 'チョウ(変身:{0})', 'en': 'Butterfly(Transformed:{0})', 'zh': '蝴蝶(变形:{0})', 'ko': '나비(변신:{0})'},
    'invalid_target': {'ja': '× 無効 ×', 'en': 'x Null x', 'zh': 'x 无效 x', 'ko': 'x 무효 x'},
    'player_name_fallback': {'ja': 'プレイヤー名', 'en': 'Player', 'zh': '玩家名', 'ko': '플레이어'},
    'rank_1': {'ja': '🥇 1位', 'en': '🥇 1st', 'zh': '🥇 1名', 'ko': '🥇 1위'},
    'rank_2': {'ja': '🥈 2位', 'en': '🥈 2nd', 'zh': '🥈 2名', 'ko': '🥈 2위'},
    'rank_3': {'ja': '🥉 3位', 'en': '🥉 3rd', 'zh': '🥉 3名', 'ko': '🥉 3위'},
    'rank_nth': {'ja': '{0}位', 'en': '{0}th', 'zh': '{0}名', 'ko': '{0}위'},
    'detail_text': {'ja': '(詳細)', 'en': '(Detail)', 'zh': '(详细)', 'ko': '(상세)'},
}

for key, val_dict in missing.items():
    for lang in ['ja', 'en', 'zh', 'ko']:
        insert_dict(lang, key, val_dict[lang])

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
