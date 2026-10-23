"""Replaces the default Capacitor icons and splash images with Ribbon's: a bone-colored ribbon on deep red."""
import glob, os
from PIL import Image, ImageDraw

RED = (125, 21, 25, 255)
BONE = (236, 232, 225, 255)
res = os.path.join(os.path.dirname(__file__), '..', 'android', 'app', 'src', 'main', 'res')

def ribbon(draw, cx, cy, h, color):
    w = h * 0.5
    x0, x1 = cx - w / 2, cx + w / 2
    y0, y1 = cy - h / 2, cy + h / 2
    draw.polygon([(x0, y0), (x1, y0), (x1, y1), (cx, y1 - h * 0.24), (x0, y1)], fill=color)

def square_icon(size, round_mask):
    ss = size * 4
    im = Image.new('RGBA', (ss, ss), RED)
    ribbon(ImageDraw.Draw(im), ss / 2, ss / 2, ss * 0.5, BONE)
    if round_mask:
        m = Image.new('L', (ss, ss), 0)
        ImageDraw.Draw(m).ellipse((0, 0, ss - 1, ss - 1), fill=255)
        im.putalpha(m)
    return im.resize((size, size), Image.LANCZOS)

def foreground(size):
    ss = size * 4
    im = Image.new('RGBA', (ss, ss), (0, 0, 0, 0))
    ribbon(ImageDraw.Draw(im), ss / 2, ss / 2, ss * 0.42, BONE)
    return im.resize((size, size), Image.LANCZOS)

def splash(w, h):
    im = Image.new('RGBA', (w, h), RED)
    ribbon(ImageDraw.Draw(im), w / 2, h / 2, min(w, h) * 0.22, BONE)
    return im

count = 0
for d in glob.glob(os.path.join(res, 'mipmap-*')):
    for name, kind in (('ic_launcher.png', 'sq'), ('ic_launcher_round.png', 'rd'), ('ic_launcher_foreground.png', 'fg')):
        p = os.path.join(d, name)
        if not os.path.exists(p):
            continue
        s = Image.open(p).size[0]
        img = square_icon(s, False) if kind == 'sq' else square_icon(s, True) if kind == 'rd' else foreground(s)
        img.save(p)
        count += 1
for p in glob.glob(os.path.join(res, 'drawable*', 'splash.png')):
    w, h = Image.open(p).size
    splash(w, h).save(p)
    count += 1
print('Replaced', count, 'images')
