import re

file_path = "i18n.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

def insert_dict(lang, key, val):
    global content
    # The language key does NOT have quotes around it in i18n.js (e.g., `ja: {`)
    pattern = rf"({lang}:\s*{{)"
    # Escape single quotes in the value to avoid syntax errors
    val_escaped = val.replace("'", "\\'")
    content = re.sub(pattern, rf"\1\n        {key}: '{val_escaped}',", content)

missing = {
    'rules_intro': {
        'ja': 'EAT10は食物連鎖を元にした生物バトルゲーム！！<br>数字の強さだけが全てじゃない。ターンを重ねるごとに心理戦に変わっていく弱肉強食ゲーム！！',
        'en': 'EAT10 is a biological battle game based on the food chain!!<br>Numbers aren\'t everything. It\'s a survival of the fittest game that turns into a mind game as turns progress!!',
        'zh': 'EAT10是一款基于食物链的生物对战游戏！！<br>数字大小并不决定一切。随着回合的进行，这将变成一场心理战，真正的弱肉强食！！',
        'ko': 'EAT10은 먹이사슬을 기반으로 한 생물 배틀 게임입니다!!<br>숫자의 강함이 전부는 아닙니다. 턴이 거듭될수록 심리전으로 변하는 약육강식 게임!!'
    },
    'rules_main_point': {
        'ja': 'カードを同時に出して数字が大きい方の勝ち！！',
        'en': 'Play cards at the same time, the larger number wins!!',
        'zh': '同时出牌，数字大的一方获胜！！',
        'ko': '카드를 동시에 내고 숫자가 큰 쪽이 승리!!'
    },
    'rules_step1': {
        'ja': '10枚のカードをシャッフルし、上から５枚引いて手札とする。',
        'en': 'Shuffle 10 cards and draw the top 5 to form your hand.',
        'zh': '将10张牌洗牌，从最上面抽5张作为手牌。',
        'ko': '10장의 카드를 섞고, 위에서 5장을 뽑아 패로 삼습니다.'
    },
    'rules_step2': {
        'ja': '各プレイヤーは同時にカードを場に出す。',
        'en': 'Each player plays a card to the field simultaneously.',
        'zh': '每位玩家同时将卡牌打出到场上。',
        'ko': '각 플레이어는 동시에 카드를 필드에 냅니다.'
    },
    'rules_step3': {
        'ja': '右上の数字が一番大きいプレイヤーに１p。<br><span style="color: #fbbf24; font-size: 0.9rem;">ただし、わざ次第で小さい数字でも勝てるようになる。</span>',
        'en': '1 point to the player with the largest number.<br><span style="color: #fbbf24; font-size: 0.9rem;">However, depending on skills, you can win even with a smaller number.</span>',
        'zh': '右上角数字最大的玩家获得1分。<br><span style="color: #fbbf24; font-size: 0.9rem;">但是，通过技能即使数字小也能获胜。</span>',
        'ko': '오른쪽 위 숫자가 가장 큰 플레이어에게 1점.<br><span style="color: #fbbf24; font-size: 0.9rem;">단, 기술에 따라 작은 숫자라도 이길 수 있습니다.</span>'
    },
    'rules_step4': {
        'ja': '出したカードはお墓に行き、カードを１枚引いてターン終了。<br><span style="color: #34d399; font-weight: bold;">合計５ターンで一番ポイントを取ったプレイヤーの勝利。</span>',
        'en': 'The played card goes to the grave. Draw 1 card and end the turn.<br><span style="color: #34d399; font-weight: bold;">The player with the most points after 5 turns wins.</span>',
        'zh': '打出的牌进入墓地，抽1张牌结束回合。<br><span style="color: #34d399; font-weight: bold;">5个回合后得分最多的玩家获胜。</span>',
        'ko': '낸 카드는 무덤으로 가고, 카드 1장을 뽑아 턴을 종료합니다.<br><span style="color: #34d399; font-weight: bold;">총 5턴 동안 가장 많은 포인트를 얻은 플레이어가 승리.</span>'
    },
    'rules_details_title': {
        'ja': '細かいルール',
        'en': 'Detailed Rules',
        'zh': '详细规则',
        'ko': '상세 규칙'
    },
    'rules_detail1': {
        'ja': '同じ数字の場合DRAWとなりポイントは入らない。',
        'en': 'If the numbers are the same, it\'s a DRAW and no points are awarded.',
        'zh': '如果数字相同则为平局(DRAW)，不记分。',
        'ko': '같은 숫자인 경우 무승부(DRAW)가 되어 포인트가 들어오지 않습니다.'
    },
    'rules_detail2': {
        'ja': '所持ポイントは０より小さい数字にならない。',
        'en': 'Your points will not fall below 0.',
        'zh': '持有分数不会低于0。',
        'ko': '소지 포인트는 0보다 작아지지 않습니다.'
    },
    'rules_detail3': {
        'ja': '後出し系のわざ（チョウ・ネコ・イノシシ）のわざを使う順番は、数字が小さいカードから優先して使える。',
        'en': 'Late-activating skills (Butterfly, Cat, Boar) trigger in order from the smallest number card first.',
        'zh': '后发制人技能（蝴蝶、猫、野猪）的触发顺序，优先从数字较小的卡牌开始。',
        'ko': '후발 기술(나비, 고양이, 멧돼지)을 사용하는 순서는 숫자가 작은 카드부터 우선하여 사용합니다.'
    },
}

for key, val_dict in missing.items():
    for lang in ['ja', 'en', 'zh', 'ko']:
        insert_dict(lang, key, val_dict[lang])

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
