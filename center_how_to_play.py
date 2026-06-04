import re

file_path = "index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# I will change `#how-to-play-screen` to display: flex
target = """        <!-- How to Play Screen -->
        <div id="how-to-play-screen" class="screen" style="display: block; text-align: center; padding-top: 25px; overflow-y: auto; padding-bottom: 25px;">
            <button id="how-to-back-btn" data-i18n="return_btn" class="title-return-btn">戻る</button>"""

replacement = """        <!-- How to Play Screen -->
        <div id="how-to-play-screen" class="screen" style="display: flex; flex-direction: column; align-items: center; padding: 40px 0; overflow-y: auto;">
            <button id="how-to-back-btn" data-i18n="return_btn" class="title-return-btn" style="z-index: 10;">戻る</button>
            <div style="margin: auto 0; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px 0;">"""

if target in content:
    content = content.replace(target, replacement)
else:
    print("Target 1 not found")

target2 = """                <div style="text-align: center; margin-top: 15px;">
                    <button id="open-card-list-btn" data-i18n="card_list_btn" class="primary-btn" style="padding: 10px 40px; font-size: 1.2rem; background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%); border: none; border-radius: 50px; color: white; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: transform 0.2s;">カード一覧</button>
                </div>
            </div>
        </div>

        <!-- Deck List Screen -->"""

replacement2 = """                <div style="text-align: center; margin-top: 15px;">
                    <button id="open-card-list-btn" data-i18n="card_list_btn" class="primary-btn" style="padding: 10px 40px; font-size: 1.2rem; background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%); border: none; border-radius: 50px; color: white; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: transform 0.2s;">カード一覧</button>
                </div>
            </div>
            </div>
        </div>

        <!-- Deck List Screen -->"""

if target2 in content:
    content = content.replace(target2, replacement2)
else:
    print("Target 2 not found")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated index.html")
