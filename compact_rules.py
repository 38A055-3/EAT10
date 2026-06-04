import re

file_path = "index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target = """        <!-- How to Play Screen -->
        <div id="how-to-play-screen" class="screen" style="display: block; text-align: center; padding-top: 40px; overflow-y: auto; padding-bottom: 40px;">
            <button id="how-to-back-btn" data-i18n="return_btn" class="title-return-btn">戻る</button>
            <h2 data-i18n="rules_btn" style="color: white; font-size: 2rem; margin-bottom: 10px; text-shadow: 0 0 10px rgba(255,255,255,0.3);">EAT10とは？</h2>
            
            <p data-i18n="rules_intro" style="color: #fbbf24; font-size: 1.1rem; text-align: center; font-weight: bold; margin-top: 0; margin-bottom: 35px; margin-left: auto; margin-right: auto; line-height: 1.5; max-width: 90%;">EAT10は食物連鎖を元にした生物バトルゲーム！！<br>数字の強さだけが全てじゃない。ターンを重ねるごとに心理戦に変わっていく弱肉強食ゲーム！！</p>

            <div style="background: rgba(30, 41, 59, 0.9); border-radius: 12px; padding: 35px 40px; max-width: 800px; width: 90%; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: left;">
                <h3 data-i18n="rules_main_point" style="color: white; font-size: 1.4rem; margin-top: 0; margin-bottom: 25px; text-align: center; letter-spacing: 1px;">カードを同時に出して数字が大きい方の勝ち！！</h3>
                
                <div style="display: flex; flex-direction: column; gap: 18px;">
                    <div style="display: flex; gap: 12px; align-items: flex-start;">
                        <div style="background: #3b82f6; color: white; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 0.9rem;">1</div>
                        <div data-i18n="rules_step1" style="color: #e2e8f0; font-size: 1rem; line-height: 1.6; padding-top: 2px;">10枚のカードをシャッフルし、上から５枚引いて手札とする。</div>
                    </div>
                    <div style="display: flex; gap: 12px; align-items: flex-start;">
                        <div style="background: #3b82f6; color: white; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 0.9rem;">2</div>
                        <div data-i18n="rules_step2" style="color: #e2e8f0; font-size: 1rem; line-height: 1.6; padding-top: 2px;">各プレイヤーは同時にカードを場に出す。</div>
                    </div>
                    <div style="display: flex; gap: 12px; align-items: flex-start;">
                        <div style="background: #3b82f6; color: white; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 0.9rem;">3</div>
                        <div data-i18n="rules_step3" style="color: #e2e8f0; font-size: 1rem; line-height: 1.6; padding-top: 2px;">右上の数字が一番大きいプレイヤーに１p。<br><span style="color: #fbbf24; font-size: 0.9rem;">ただし、わざ次第で小さい数字でも勝てるようになる。</span></div>
                    </div>
                    <div style="display: flex; gap: 12px; align-items: flex-start;">
                        <div style="background: #3b82f6; color: white; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 0.9rem;">4</div>
                        <div data-i18n="rules_step4" style="color: #e2e8f0; font-size: 1rem; line-height: 1.6; padding-top: 2px;">出したカードはお墓に行き、カードを１枚引いてターン終了。<br><span style="color: #34d399; font-weight: bold;">合計５ターンで一番ポイントを取ったプレイヤーの勝利。</span></div>
                    </div>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
                    <h4 data-i18n="rules_details_title" style="color: #cbd5e1; font-size: 1.1rem; margin-bottom: 12px; margin-top: 0;">細かいルール</h4>
                    <ul style="color: #94a3b8; font-size: 0.9rem; line-height: 1.7; padding-left: 20px; margin-bottom: 0;">
                        <li data-i18n="rules_detail1">同じ数字の場合DRAWとなりポイントは入らない。</li>
                        <li data-i18n="rules_detail2">所持ポイントは０より小さい数字にならない。</li>
                        <li data-i18n="rules_detail3">後出し系のわざ（チョウ・ネコ・イノシシ）のわざを使う順番は、数字が小さいカードから優先して使える。</li>
                    </ul>
                </div>

                <div style="text-align: center; margin-top: 25px;">"""

replacement = """        <!-- How to Play Screen -->
        <div id="how-to-play-screen" class="screen" style="display: block; text-align: center; padding-top: 25px; overflow-y: auto; padding-bottom: 25px;">
            <button id="how-to-back-btn" data-i18n="return_btn" class="title-return-btn">戻る</button>
            <h2 data-i18n="rules_btn" style="color: white; font-size: 1.6rem; margin-bottom: 8px; text-shadow: 0 0 10px rgba(255,255,255,0.3);">EAT10とは？</h2>
            
            <p data-i18n="rules_intro" style="color: #fbbf24; font-size: 0.95rem; text-align: center; font-weight: bold; margin-top: 0; margin-bottom: 15px; margin-left: auto; margin-right: auto; line-height: 1.3; max-width: 90%;">EAT10は食物連鎖を元にした生物バトルゲーム！！<br>数字の強さだけが全てじゃない。ターンを重ねるごとに心理戦に変わっていく弱肉強食ゲーム！！</p>

            <div style="background: rgba(30, 41, 59, 0.9); border-radius: 12px; padding: 20px 30px; max-width: 800px; width: 90%; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: left;">
                <h3 data-i18n="rules_main_point" style="color: white; font-size: 1.2rem; margin-top: 0; margin-bottom: 15px; text-align: center; letter-spacing: 1px;">カードを同時に出して数字が大きい方の勝ち！！</h3>
                
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; gap: 12px; align-items: flex-start;">
                        <div style="background: #3b82f6; color: white; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 0.85rem;">1</div>
                        <div data-i18n="rules_step1" style="color: #e2e8f0; font-size: 0.9rem; line-height: 1.4; padding-top: 2px;">10枚のカードをシャッフルし、上から５枚引いて手札とする。</div>
                    </div>
                    <div style="display: flex; gap: 12px; align-items: flex-start;">
                        <div style="background: #3b82f6; color: white; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 0.85rem;">2</div>
                        <div data-i18n="rules_step2" style="color: #e2e8f0; font-size: 0.9rem; line-height: 1.4; padding-top: 2px;">各プレイヤーは同時にカードを場に出す。</div>
                    </div>
                    <div style="display: flex; gap: 12px; align-items: flex-start;">
                        <div style="background: #3b82f6; color: white; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 0.85rem;">3</div>
                        <div data-i18n="rules_step3" style="color: #e2e8f0; font-size: 0.9rem; line-height: 1.4; padding-top: 2px;">右上の数字が一番大きいプレイヤーに１p。<br><span style="color: #fbbf24; font-size: 0.85rem;">ただし、わざ次第で小さい数字でも勝てるようになる。</span></div>
                    </div>
                    <div style="display: flex; gap: 12px; align-items: flex-start;">
                        <div style="background: #3b82f6; color: white; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 0.85rem;">4</div>
                        <div data-i18n="rules_step4" style="color: #e2e8f0; font-size: 0.9rem; line-height: 1.4; padding-top: 2px;">出したカードはお墓に行き、カードを１枚引いてターン終了。<br><span style="color: #34d399; font-weight: bold;">合計５ターンで一番ポイントを取ったプレイヤーの勝利。</span></div>
                    </div>
                </div>

                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
                    <h4 data-i18n="rules_details_title" style="color: #cbd5e1; font-size: 1rem; margin-bottom: 8px; margin-top: 0;">細かいルール</h4>
                    <ul style="color: #94a3b8; font-size: 0.85rem; line-height: 1.4; padding-left: 20px; margin-bottom: 0;">
                        <li data-i18n="rules_detail1">同じ数字の場合DRAWとなりポイントは入らない。</li>
                        <li data-i18n="rules_detail2">所持ポイントは０より小さい数字にならない。</li>
                        <li data-i18n="rules_detail3">後出し系のわざ（チョウ・ネコ・イノシシ）のわざを使う順番は、数字が小さいカードから優先して使える。</li>
                    </ul>
                </div>

                <div style="text-align: center; margin-top: 15px;">"""

if target in content:
    content = content.replace(target, replacement)
else:
    print("Target not found")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated index.html")
