import os
import re

file_path = "app.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    ("'ネコ(7)のコピー対象を選んでください'", "window.t('target_select_7')"),
    ("'イノシシ(8)の無効化対象を選んでください'", "window.t('target_select_8')"),
    ("'<span style=\"color: #ef4444; font-weight: bold; font-size: 0.7rem; display: block; margin-top: 5px;\">× 無効 ×</span>'", "'<span style=\"color: #ef4444; font-weight: bold; font-size: 0.7rem; display: block; margin-top: 5px;\">' + window.t('invalid_target') + '</span>'"),
    ("'設定に戻る'", "window.t('back_to_settings')"),
    ("'もう一戦'", "window.t('play_again')"),
    ("'デッキ ' + (i + 1)", "(window.t('deck_btn') + ' ' + (i + 1))"),
    ("|| 'プレイヤー名'", "|| window.t('player_name_fallback')"),
    ("'<span style=\"font-size: 0.8rem; color: #94a3b8;\">(詳細)</span>'", "'<span style=\"font-size: 0.8rem; color: #94a3b8;\">' + window.t('detail_text') + '</span>'"),
    ("'デッキ確認'", "window.t('check_btn')"),
    ("'閉じる'", "window.t('close_btn')"),
    ("'バトル開始！'", "window.t('battle_start_btn')"),
    ("'6桁のRoom IDを入力してください。'", "window.t('invalid_room_id')"),
    ("'接続に失敗しました。IDを確認してください。'", "window.t('conn_failed')"),
    ("'接続エラー: ' + err.type", "window.t('conn_error') + err.type"),
    ("'（デッキルール・シンプルモード）'", "window.t('rule_deck_simple')"),
    ("'（ノーマルルール・シンプルモード）'", "window.t('rule_normal_simple')"),
    ("'現在マッチングできる部屋が見つかりませんでした。時間をおいて再度お試しください。'", "window.t('no_match_found')"),
    ("'部屋を作成しました。相手を待っています...'", "window.t('room_created_waiting')"),
    ("opponentName + ' が参加しました！'", "window.t('opponent_joined').replace('{0}', opponentName)"),
    ("'ホスト: ' + opponentName", "window.t('host_label').replace('{0}', opponentName)"),
    ("'ホストの準備待ち...'", "window.t('host_wait')"),
    ("'ルールを設定中です'", "window.t('setting_rules')"),
    ("'相手を待っています...'", "window.t('waiting_participants')"),
    ("'選択中のデッキ（デッキ ' + (activeDeckIndex + 1) + '）が未作成です。空いているスロットで「新規作成」を行い、「これを使う」を選んでください。'", "window.t('empty_deck_error').replace('{0}', (activeDeckIndex + 1))"),
    ("'選択中のデッキの枚数が10枚ではありません。編集してください。'", "window.t('invalid_deck_error')"),
    ("'デッキ名を入力してください（最大10文字）'", "window.t('input_deck_name')"),
    ("'使用中'", "window.t('in_use')"),
    ("'これを使う'", "window.t('use_this')"),
    ("'確認'", "window.t('check_btn')"),
    ("'編集'", "window.t('edit_btn')"),
    ("'削除'", "window.t('delete_btn')"),
    ("'デッキ ' + (i + 1) + ' を本当に削除しますか？'", "window.t('deck_confirm_delete').replace('{0}', (i + 1))"),
    ("'新規作成'", "window.t('create_new_btn')"),
    ("'あなたが組んだデッキ'", "window.t('your_deck_title')"),
    ("'相手のデッキ'", "window.t('cpu_deck_title')"),
    ("'🥇 1位'", "window.t('rank_1')"),
    ("'🥈 2位'", "window.t('rank_2')"),
    ("'🥉 3位'", "window.t('rank_3')"),
    ("(index + 1) + '位'", "window.t('rank_nth').replace('{0}', (index + 1))"),
    ("'オンラインロビー'", "window.t('lobby_title')"),
    ("'バトル設定'", "window.t('battle_settings_title')"),
    ("チョウ(変身中...)", "${window.t('transforming')}"),
    ("チョウ(変身:${CARD_DATA[finalVal].name})", "${window.t('transformed').replace('{0}', CARD_DATA[finalVal].name)}"),
    (">蜘蛛の糸<", ">${window.t('spider_thread')}<"),
    (">手札<", ">${window.t('hand_spider')}<"),
    (">お墓<", ">${window.t('grave_spider')}<"),
    (">交換の準備<", ">${window.t('prepare_exchange')}<"),
    (">【捨てる】<", ">${window.t('discard_btn')}<"),
    (">【拾う】<", ">${window.t('pickup_btn')}<"),
    (">交換する<", ">${window.t('exchange_btn')}<"),
    (">強さ：<", ">${window.t('strength_label')}<"),
    (">わざ：<", ">${window.t('skill_label')}<"),
]

for old, new in replacements:
    content = content.replace(old, new)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
