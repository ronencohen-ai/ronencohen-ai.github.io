# -*- coding: utf-8 -*-
"""תמונת שיתוף 1200x630 ואייקונים בשפה של האתר (Fredoka, שחור, צהוב שמש). עברית מצוירת מילה-מילה מימין לשמאל."""
import os
from PIL import Image, ImageDraw, ImageFont
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F=os.path.join(ROOT,"..","קרוסלה","fonts")
BG=(8,8,11); INK=(245,246,250); SUN=(61,185,255); SOFT=(164,169,186); WA=(31,175,90)
heb=lambda w: w if all(ord(c)<128 for c in w) else w[::-1]
def line(d,font,words,right,y,gap):
    x=right
    for w,c in words:
        t=heb(w); x-=d.textlength(t,font=font); d.text((x,y),t,font=font,fill=c); x-=gap
def rounded(im,r):
    m=Image.new("L",im.size,0); ImageDraw.Draw(m).rounded_rectangle((0,0,*im.size),r,fill=255); im.putalpha(m); return im
og=Image.new("RGB",(1200,630),BG)
for i,(t,y) in enumerate([("abufrahi",70),("einav",160)]):
    im=rounded(Image.open(os.path.join(ROOT,"media",t+".webp")).convert("RGB").resize((196,348)),22)
    og.paste(im,(40+i*210,y),im)
d=ImageDraw.Draw(og)
big=ImageFont.truetype(os.path.join(F,"Fredoka-Bold.ttf"),104)
line(d,big,[("סרטוני",INK),("AI",INK)],1150,120,26)
line(d,big,[("שעוצרים",INK),("את",INK)],1150,250,26)
line(d,big,[("הגלילה.",SUN)],1150,380,26)
d.text((40,560),"רונן כהן"[::-1]+"  ·  ronencohen.ai",font=ImageFont.truetype(os.path.join(F,"Fredoka-SemiBold.ttf"),30),fill=SOFT)
og.save(os.path.join(ROOT,"img","og.jpg"),quality=86)
for size,name in [(32,"favicon-32.png"),(180,"apple-touch-icon.png"),(512,"icon-512.png")]:
    im=Image.new("RGB",(size,size),BG); d=ImageDraw.Draw(im)
    f=ImageFont.truetype(os.path.join(F,"Fredoka-Bold.ttf"),int(size*.62))
    t=heb("ר"); bb=d.textbbox((0,0),t,font=f)
    d.text(((size-(bb[2]-bb[0]))/2-bb[0],(size-(bb[3]-bb[1]))/2-bb[1]),t,font=f,fill=SUN)
    im.save(os.path.join(ROOT,"img",name))
print("ok")
