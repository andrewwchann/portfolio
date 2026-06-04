from PIL import Image

src = "signature4.gif"
out = "signature4.gif"
still_out = "signature-still.png"
site_out = "signature.gif"

# Skip ~1s intro (full name already visible); end when name finishes drawing.
START_FRAME = 9
END_FRAME = 31

im = Image.open(src)
frames = []
durations = []

for i in range(START_FRAME, END_FRAME + 1):
    im.seek(i)
    durations.append(im.info.get("duration", 80))
    fr = im.convert("RGBA")
    alpha = fr.split()[3]
    transparent_mask = alpha.point(lambda a: 255 if a < 128 else 0)
    p = fr.convert("RGB").quantize(colors=255, method=Image.MEDIANCUT)
    p.paste(255, transparent_mask)
    frames.append(p)

frames[0].save(
    out,
    save_all=True,
    append_images=frames[1:],
    duration=durations,
    loop=1,
    disposal=2,
    transparency=255,
    optimize=False,
)

result = Image.open(out)
result.seek(result.n_frames - 1)
result.convert("RGBA").save(still_out, optimize=True)
result.save(site_out)

print("saved", out, "size", result.size, "frames", result.n_frames)
print("duration_ms", sum(durations))
print("saved", still_out)
print("saved", site_out)
