import re
import sys

html = sys.stdin.read()

html = re.sub(
    r"BLOGGIF\(([^)]+)\)",
    lambda m: (
        f'<img src="{m.group(1)}" '
        f'alt="" class="post-gif">'
    ),
    html,
)

html = re.sub(
    r"BLOGGODBOLT\(([^)]+)\)",
    lambda m: (
        f'<iframe class="godbolt" '
        f'src="{m.group(1)}" '
        f'loading="lazy"></iframe>'
    ),
    html,
)

sys.stdout.write(html)
