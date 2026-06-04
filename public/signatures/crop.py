from PIL import Image
src = "signature_4.gif"
out = "signature4.gif"
im = Image.open(src)
n = im.n_frames
# Tight box around "Andrew Chan" + walking figure, above the red watermark.
# box = (39, 11, 310, 120)  # left, top, right, bottom
box = (35, 11, 370, 120)  # left, top, right, bottom
frames = []
durations = []
for i in range(n):
    im.seek(i)
    durations.append(im.info.get("duration", 80))
    fr = im.convert("RGBA").crop(box)
    alpha = fr.split()[3]
    transparent_mask = alpha.point(lambda a: 255 if a < 128 else 0)
    p = fr.convert("RGB").quantize(colors=255, method=Image.MEDIANCUT)
    # Reserve palette index 255 for transparency.
    p.paste(255, transparent_mask)
    frames.append(p)
frames[0].save(
    out,
    save_all=True,
    append_images=frames[1:],
    duration=durations,
    loop=0,
    disposal=2,
    transparency=255,
    optimize=False,
)
result = Image.open(out)
print("saved", out, "size", result.size, "frames", result.n_frames)
