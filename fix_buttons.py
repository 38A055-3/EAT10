import re

with open('index.html', 'r') as f:
    html = f.read()

# Define the screens and their button IDs
screens = [
    ('deck-list-screen', 'deck-list-top-back-btn'),
    ('record-screen', 'record-back-btn'),
    ('how-to-play-screen', 'how-to-back-btn'),
    ('card-list-screen', 'card-list-back-btn'),
    ('format-screen', 'format-back-btn'),
    ('random-match-screen', 'random-match-back-btn'),
    ('start-screen', 'rule-back-btn'),
    ('lobby-screen', 'lobby-back-btn'),
    ('game-screen', 'game-title-btn')
]

for screen_id, btn_id in screens:
    # 1. Find the button HTML and remove it from its original place
    btn_pattern = r'(\s*<button id="' + btn_id + r'".*?</button>)'
    btn_match = re.search(btn_pattern, html)
    if not btn_match:
        print(f"Could not find button {btn_id}")
        continue
    
    btn_html = btn_match.group(1)
    
    if screen_id == 'deck-list-screen':
        # deck-list-screen already has a bottom button, so just remove the top one
        html = html.replace(btn_html, '')
        continue
        
    html = html.replace(btn_html, '')
    
    # 2. Find the closing </div> of the screen
    # Since screens are direct children of app-container, we can find the start of the screen,
    # and then find its matching closing div. But regex matching nested divs is hard.
    # Alternatively, we can find the next screen's id, and insert the button right before the closing div before it!
    # A simpler way: we know each screen ends right before `<!-- Next Screen Name -->` or the end of app-container.
    # Actually, we can use a stack to find the closing div of the screen.
    
    screen_start = html.find(f'id="{screen_id}"')
    if screen_start == -1:
        continue
        
    # Find the <div that contains the id
    div_start = html.rfind('<div', 0, screen_start)
    
    # Simple nested tag parser
    depth = 0
    i = div_start
    while i < len(html):
        if html.startswith('<div', i):
            depth += 1
        elif html.startswith('</div', i):
            depth -= 1
            if depth == 0:
                # We found the closing div of the screen!
                # Insert the button HTML right before this closing div
                html = html[:i] + btn_html + '\n    ' + html[i:]
                break
        i += 1

with open('index.html', 'w') as f:
    f.write(html)
print("Done!")
