# מעדכן את האתר מהאינסטגרם: צפיות ועוקבים לכל הסרטונים, וסרטון חדש נכנס לבד עם וידאו ופוסטר.
# רץ כל בוקר ב-GitHub Actions (‎.github/workflows/sync-instagram.yml). דורש IG_TOKEN ו-ffmpeg.
# שדות שרונן כתב ידנית (כותרת, הסבר, קטגוריה, הצמדה) לא נדרסים לעולם.
# ריל חדש מקבל קטגוריה לבד לפי הכיתוב (category_of), וצפיות החודש נמשכות מהחשבון.
import json, os, re, subprocess, sys, tempfile, urllib.parse, urllib.request
from datetime import date, datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "reels.json")
MEDIA = os.path.join(ROOT, "media")
API = "https://graph.instagram.com/v23.0"
TOKEN = os.environ.get("IG_TOKEN", "")
FIXTURE = os.environ.get("IG_FIXTURE")  # לבדיקה מקומית בלי רשת: קובץ JSON של תשובות


def fetch(path, **params):
    if FIXTURE:
        return json.load(open(FIXTURE, encoding="utf-8")).get(path, {})
    params["access_token"] = TOKEN
    url = path if path.startswith("http") else f"{API}/{path}?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=60) as r:
        return json.load(r)


def all_media():
    out, page = [], fetch("me/media", fields="id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp", limit=50)
    while True:
        out += page.get("data", [])
        nxt = page.get("paging", {}).get("next")
        if not nxt or FIXTURE:
            return out
        page = fetch(nxt)


def views_of(media_id):
    try:
        d = fetch(f"{media_id}/insights", metric="views")
        return int(d["data"][0]["values"][0]["value"])
    except Exception:
        return None


def code_of(url):
    m = re.search(r"/(?:reel|p)/([A-Za-z0-9_-]+)", url or "")
    return m.group(1) if m else None


def title_of(caption):
    line = (caption or "").strip().split("\n")[0]
    line = re.sub(r"[#@]\S+", "", line).strip(" -·|")
    return (line[:58] + "…") if len(line) > 60 else (line or "סרטון חדש")


ME = "ronencohen.ai"
ADS = re.compile(r"פרסומת|קמפיין|קולקציה|בשיתוף|שיתוף פעולה|#ad|#מודעה|#ממומן|לקוח", re.I)
CLIPS = re.compile(r"קליפ|מזמור|שיר|🎵|🎶", re.I)


def category_of(caption):
    """ריל חדש נכנס לבד לקטגוריה: מותג מתויג (@) או מילת פרסומת = פרסומות; שיר/קליפ = קליפים; כל השאר = ויראלי."""
    c = caption or ""
    tags = [t.lower() for t in re.findall(r"@([\w.]+)", c) if t.lower() != ME]
    if tags or ADS.search(c):
        return "ads"
    if CLIPS.search(c):
        return "clips"
    return "viral"


def month_views():
    """צפיות בחשבון ב-30 הימים האחרונים."""
    try:
        now = int(datetime.now(timezone.utc).timestamp())
        d = fetch("me/insights", metric="views", period="day", metric_type="total_value", since=now - 30 * 86400, until=now)
        return int(d["data"][0]["total_value"]["value"])
    except Exception:
        return None


def encode(src_url, key):
    """מוריד ומקודד כמו בצינור של גרסה ב': תצוגה שקטה 8 שניות (720), גרסה מלאה עם סאונד, ופוסטר."""
    os.makedirs(MEDIA, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        raw = os.path.join(tmp, "src.mp4")
        urllib.request.urlretrieve(src_url, raw)
        full = os.path.join(MEDIA, f"{key}.full.mp4")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-vf", "scale=540:960:force_original_aspect_ratio=increase,crop=540:960,fps=30",
                        "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-maxrate", "1400k", "-bufsize", "2800k", "-pix_fmt", "yuv420p",
                        "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", full], check=True)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", full, "-t", "8", "-an", "-vf", "scale=-2:720:flags=lanczos",
                        "-c:v", "libx264", "-preset", "slow", "-b:v", "1200k", "-maxrate", "1600k", "-bufsize", "2400k",
                        "-pix_fmt", "yuv420p", "-movflags", "+faststart", os.path.join(MEDIA, f"{key}.mp4")], check=True)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "1.2", "-i", full, "-frames:v", "1", "-vf", "scale=405:720", "-q:v", "72",
                        os.path.join(MEDIA, f"{key}.webp")], check=True)
    return f"media/{key}.mp4", f"media/{key}.webp", f"media/{key}.full.mp4"


def main():
    if not TOKEN and not FIXTURE:
        sys.exit("חסר IG_TOKEN")
    data = json.load(open(DATA, encoding="utf-8"))
    reels = data["reels"]
    known = {code_of(r.get("ig")): r for r in reels if code_of(r.get("ig"))}
    skip = set(data.get("skip", []))  # קודים שרונן לא רוצה באתר
    since = data.get("sync_since", "2000-01-01")

    me = fetch("me", fields="username,followers_count,media_count")
    total, videos, added, changed = 0, 0, [], False
    for m in all_media():
        if m.get("media_type") != "VIDEO":
            continue
        videos += 1
        code = code_of(m.get("permalink"))
        v = views_of(m["id"])
        total += v or 0
        r = known.get(code)
        if r:
            if v is not None and v != r.get("views"):
                r["views"] = v; changed = True
            continue
        day = (m.get("timestamp") or "")[:10]
        if not code or code in skip or day < since or not m.get("media_url"):
            continue
        key = "ig_" + code
        try:
            video, poster, full = encode(m["media_url"], key)
        except Exception as e:
            print("דילוג, הקידוד נכשל:", code, e)
            continue
        cat = category_of(m.get("caption"))
        r = {"id": key, "cat": cat, "cats": [cat], "date": day, "title": title_of(m.get("caption")),
             "views": v, "video": video, "full": full, "poster": poster, "ig": m.get("permalink"), "auto": True}
        reels.insert(0, r); known[code] = r; added.append(code); changed = True

    stats = data.setdefault("stats", {})
    if me.get("followers_count"):
        stats["followers"] = me["followers_count"]
    if total > stats.get("views", 0):
        stats["views"] = total
    mv = month_views()
    if mv:
        stats["month_views"] = mv
    stats["reels"] = max(videos, len(reels))
    data["updated"] = date.today().isoformat()
    json.dump(data, open(DATA, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"עוקבים {stats.get('followers')} · צפיות {stats.get('views')} · חדשים {len(added)} {added}")


if __name__ == "__main__":
    main()
