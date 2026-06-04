import re

file_path = "i18n.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

def insert_dict(lang, key, val):
    global content
    pattern = rf"({lang}:\s*{{)"
    val_escaped = val.replace("'", "\\'")
    if f"{key}:" not in content.split(f"{lang}:")[1].split("}")[0]:
        content = re.sub(pattern, rf"\1\n        {key}: '{val_escaped}',", content)

missing = {
    'target_select_7': {
        'ja': 'ネコ(7)のコピー対象を選んでください', 'en': 'Select target to copy for Cat (7)', 'zh': '请选择猫(7)的复制目标', 'ko': '고양이(7)의 복사 대상을 선택하세요'
    },
    'target_select_8': {
        'ja': 'イノシシ(8)の無効化対象を選んでください', 'en': 'Select target to nullify for Boar (8)', 'zh': '请选择野猪(8)的无效化目标', 'ko': '멧돼지(8)의 무효화 대상을 선택하세요'
    },
    'invalid_target': {
        'ja': '× 無効 ×', 'en': '× Invalid ×', 'zh': '× 无效 ×', 'ko': '× 무효 ×'
    },
    'back_to_settings': {
        'ja': '設定に戻る', 'en': 'Back to Settings', 'zh': '返回设置', 'ko': '설정으로 돌아가기'
    },
    'player_name_fallback': {
        'ja': 'プレイヤー名', 'en': 'Player Name', 'zh': '玩家名称', 'ko': '플레이어 이름'
    },
    'detail_text': {
        'ja': '(詳細)', 'en': '(Details)', 'zh': '(详细)', 'ko': '(상세)'
    },
    'check_btn': {
        'ja': '確認', 'en': 'View', 'zh': '查看', 'ko': '확인'
    },
    'close_btn': {
        'ja': '閉じる', 'en': 'Close', 'zh': '关闭', 'ko': '닫기'
    },
    'invalid_room_id': {
        'ja': '6桁のRoom IDを入力してください。', 'en': 'Please enter a 6-digit Room ID.', 'zh': '请输入6位数的房间ID。', 'ko': '6자리의 Room ID를 입력해주세요.'
    },
    'conn_failed': {
        'ja': '接続に失敗しました。IDを確認してください。', 'en': 'Connection failed. Please check the ID.', 'zh': '连接失败。请检查ID。', 'ko': '연결에 실패했습니다. ID를 확인해주세요.'
    },
    'conn_error': {
        'ja': '接続エラー: ', 'en': 'Connection Error: ', 'zh': '连接错误: ', 'ko': '연결 오류: '
    },
    'rule_deck_simple': {
        'ja': '（デッキルール・シンプルモード）', 'en': '(Deck Rule / Simple Mode)', 'zh': '（卡组规则・简单模式）', 'ko': '（덱 룰・심플 모드）'
    },
    'rule_normal_simple': {
        'ja': '（ノーマルルール・シンプルモード）', 'en': '(Normal Rule / Simple Mode)', 'zh': '（普通规则・简单模式）', 'ko': '（노멀 룰・심플 모드）'
    },
    'no_match_found': {
        'ja': '現在マッチングできる部屋が見つかりませんでした。時間をおいて再度お試しください。', 'en': 'No match found currently. Please try again later.', 'zh': '目前未找到可匹配的房间。请稍后再试。', 'ko': '현재 매칭 가능한 방을 찾을 수 없습니다. 잠시 후 다시 시도해주세요.'
    },
    'room_created_waiting': {
        'ja': '部屋を作成しました。相手を待っています...', 'en': 'Room created. Waiting for opponent...', 'zh': '房间已创建。正在等待对手...', 'ko': '방을 만들었습니다. 상대를 기다리는 중...'
    },
    'opponent_joined': {
        'ja': '{0} が参加しました！', 'en': '{0} joined!', 'zh': '{0} 加入了房间！', 'ko': '{0} 님이 참가했습니다!'
    },
    'host_wait': {
        'ja': 'ホストの準備待ち...', 'en': 'Waiting for host...', 'zh': '正在等待房主准备...', 'ko': '호스트의 준비를 기다리는 중...'
    },
    'empty_deck_error': {
        'ja': '選択中のデッキ（デッキ {0}）が未作成です。空いているスロットで「新規作成」を行い、「これを使う」を選んでください。',
        'en': 'Selected deck (Deck {0}) is empty. Create a new deck and click "Use This".',
        'zh': '所选卡组（卡组 {0}）未创建。请在空位点击“新建”并选择“使用此卡组”。',
        'ko': '선택한 덱(덱 {0})이 비어 있습니다. "새로 만들기"를 누르고 "이 덱 사용"을 선택해주세요.'
    },
    'invalid_deck_error': {
        'ja': '選択中のデッキの枚数が10枚ではありません。編集してください。', 'en': 'Selected deck must have exactly 10 cards. Please edit.', 'zh': '所选卡组的卡牌数量不是10张。请重新编辑。', 'ko': '선택한 덱의 카드 수가 10장이 아닙니다. 편집해주세요.'
    },
    'input_deck_name': {
        'ja': 'デッキ名を入力してください（最大10文字）', 'en': 'Enter deck name (max 10 chars)', 'zh': '请输入卡组名称（最多10个字符）', 'ko': '덱 이름을 입력하세요 (최대 10자)'
    },
    'in_use': {
        'ja': '使用中', 'en': 'In Use', 'zh': '使用中', 'ko': '사용 중'
    },
    'use_this': {
        'ja': 'これを使う', 'en': 'Use This', 'zh': '使用此卡组', 'ko': '이 덱 사용'
    },
    'edit_btn': {
        'ja': '編集', 'en': 'Edit', 'zh': '编辑', 'ko': '편집'
    },
    'delete_btn': {
        'ja': '削除', 'en': 'Delete', 'zh': '删除', 'ko': '삭제'
    },
    'deck_confirm_delete': {
        'ja': 'デッキ {0} を本当に削除しますか？', 'en': 'Are you sure you want to delete Deck {0}?', 'zh': '确定要删除卡组 {0} 吗？', 'ko': '덱 {0}을(를) 정말 삭제하시겠습니까?'
    },
    'create_new_btn': {
        'ja': '新規作成', 'en': 'Create New', 'zh': '新建', 'ko': '새로 만들기'
    },
    'your_deck_title': {
        'ja': 'あなたが組んだデッキ', 'en': 'Your Deck', 'zh': '你的卡组', 'ko': '당신이 구성한 덱'
    },
    'cpu_deck_title': {
        'ja': '相手のデッキ', 'en': "Opponent's Deck", 'zh': '对手的卡组', 'ko': '상대의 덱'
    },
    'rank_1': {
        'ja': '🥇 1位', 'en': '🥇 1st', 'zh': '🥇 第1名', 'ko': '🥇 1위'
    },
    'rank_2': {
        'ja': '🥈 2位', 'en': '🥈 2nd', 'zh': '🥈 第2名', 'ko': '🥈 2위'
    },
    'rank_3': {
        'ja': '🥉 3位', 'en': '🥉 3rd', 'zh': '🥉 第3名', 'ko': '🥉 3위'
    },
    'rank_nth': {
        'ja': '{0}位', 'en': '{0}th', 'zh': '第{0}名', 'ko': '{0}위'
    },
    'transforming': {
        'ja': 'チョウ(変身中...)', 'en': 'Butterfly(Transforming...)', 'zh': '蝴蝶(变身中...)', 'ko': '나비(변신 중...)'
    },
    'transformed': {
        'ja': 'チョウ(変身:{0})', 'en': 'Butterfly({0})', 'zh': '蝴蝶(变身:{0})', 'ko': '나비({0})'
    },
    'spider_thread': {
        'ja': '蜘蛛の糸', 'en': 'Spider Thread', 'zh': '蜘蛛丝', 'ko': '거미줄'
    },
    'hand_spider': {
        'ja': '手札', 'en': 'Hand', 'zh': '手牌', 'ko': '패'
    },
    'grave_spider': {
        'ja': 'お墓', 'en': 'Grave', 'zh': '墓地', 'ko': '무덤'
    },
    'prepare_exchange': {
        'ja': '交換の準備', 'en': 'Prepare to Swap', 'zh': '准备交换', 'ko': '교환 준비'
    },
    'discard_btn': {
        'ja': '【捨てる】', 'en': '[Discard]', 'zh': '【丢弃】', 'ko': '【버리기】'
    },
    'pickup_btn': {
        'ja': '【拾う】', 'en': '[Pick Up]', 'zh': '【拾取】', 'ko': '【줍기】'
    },
    'exchange_btn': {
        'ja': '交換する', 'en': 'Swap', 'zh': '交换', 'ko': '교환하기'
    },
    'strength_label': {
        'ja': '強さ：', 'en': 'Power: ', 'zh': '强度：', 'ko': '강함：'
    },
    'skill_label': {
        'ja': 'わざ：', 'en': 'Skill: ', 'zh': '技能：', 'ko': '스킬：'
    }
}

for key, val_dict in missing.items():
    for lang in ['ja', 'en', 'zh', 'ko']:
        insert_dict(lang, key, val_dict[lang])

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
