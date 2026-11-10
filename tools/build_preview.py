# בונה את preview.html לתצוגה ב-claude.ai מתוך index.html
# זהירות: \b אחרי head, אחרת גם <header> נמחק והתפריט העליון מתפרק (10.11)
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
s = (root / 'index.html').read_text(encoding='utf-8')
s = re.sub(r'<!doctype html>\s*', '', s, flags=re.I)
s = re.sub(r'</?(html|head|body)\b[^>]*>', '', s)
s = re.sub(r'<meta charset[^>]*>|<meta name="viewport"[^>]*>', '', s)
s = re.sub(r'<title>.*?</title>', '', s, count=1, flags=re.S)
assert s.count('<header') == 1 and s.count('</header>') == 1
s = '<title>אתר רונן כהן AI</title>\n<style>:root:not([dir=ltr]){direction:rtl}html{background:#08080B}</style>\n' + s
(root / 'preview.html').write_text(s, encoding='utf-8')
print('preview.html ok')
