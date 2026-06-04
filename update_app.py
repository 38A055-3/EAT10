import re

file_path = "app.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update CARD_DATA
new_card_data = """    const CARD_DATA = {
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
    };"""
content = re.sub(r'    const CARD_DATA = \{[\s\S]*?\n    \};\n', new_card_data + '\n', content)

# 2. Update init text
if "window.updateAllUIText();" not in content:
    content = content.replace("document.addEventListener('DOMContentLoaded', () => {", "document.addEventListener('DOMContentLoaded', () => {\n    window.updateAllUIText();")

# 3. Dynamic texts replacement
content = content.replace("'WIN!'", "window.t('win_text')")
content = content.replace("'LOSE'", "window.t('lose_text')")
content = content.replace("'DRAW'", "window.t('draw_text')")
content = content.replace("winStreakCount + '連勝中'", "`\${winStreakCount}` + window.t('streak_count').replace('{0}', '')") # fallback for dynamic
content = content.replace("winStreakCount + '連勝！'", "window.t('streak_count').replace('{0}', winStreakCount)")
content = content.replace("'GAME OVER - ' + winStreakCount + '連勝で終了'", "'GAME OVER - ' + window.t('streak_count').replace('{0}', winStreakCount)")

content = content.replace("'相手を探しています...'", "window.t('random_match_status')")
content = content.replace("'参加者を待っています...'", "window.t('waiting_participants')")

# 4. Settings language change listener
lang_listener = """
        const langSelect = document.getElementById('language-select');
        if (langSelect) {
            langSelect.value = window.currentLang;
            langSelect.addEventListener('change', (e) => {
                localStorage.setItem('eat10_lang', e.target.value);
                location.reload();
            });
        }
"""
if "const langSelect" not in content:
    content = content.replace("const resetDataBtn = document.getElementById('reset-data-btn');", "const resetDataBtn = document.getElementById('reset-data-btn');" + lang_listener)

content = content.replace("'本当にセーブデータをリセットしますか？この操作は取り消せません。'", "window.t('reset_confirm')")
content = content.replace("'セーブデータをリセットしました。画面を再読み込みします。'", "window.t('reset_done')")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
