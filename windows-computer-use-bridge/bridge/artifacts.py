from __future__ import annotations

import base64
from pathlib import Path
from typing import Any

# Inline content field names recognised for extraction and persistence.
_CONTENT_KEYS = ("text", "content", "data", "base64_content")

# Default root: <project-root>/data/tasks/
_DEFAULT_ARTIFACTS_ROOT = Path(__file__).parent.parent / "data" / "tasks"


def persist_result_artifacts(
    task_id: str,
    result: dict[str, Any],
    artifacts_root: Path | None = None,
) -> dict[str, Any]:
    """Persist inline artifact/screenshot content to disk and rewrite the result.

    For every item in ``result["artifacts"]`` and ``result["screenshots"]`` that
    carries a recognised inline-content field (``text``, ``content``, ``data``,
    ``base64_content``) and a ``filename``, the content is written to:

        <artifacts_root>/<task_id>/<filename>

    The inline-content key is then removed from the item dictionary and a ``path``
    key is inserted with the absolute path to the saved file.  All other metadata
    fields on the item are preserved as-is.

    Items that lack a ``filename`` or a recognisable content key are returned
    unchanged.

    Returns a shallow copy of ``result`` with the artifact/screenshot arrays
    replaced by their rewritten counterparts.
    """
    root = artifacts_root if artifacts_root is not None else _DEFAULT_ARTIFACTS_ROOT
    task_dir = root / task_id

    new_result = dict(result)
    for array_key in ("artifacts", "screenshots"):
        items = result.get(array_key)
        if not items:
            continue
        new_result[array_key] = [_persist_item(item, task_dir) for item in items]

    return new_result


def _persist_item(item: Any, task_dir: Path) -> Any:
    """Write a single artifact item to disk and return the rewritten dict."""
    if not isinstance(item, dict):
        return item

    filename = item.get("filename")
    content_key = next((k for k in _CONTENT_KEYS if k in item), None)

    if not filename or not content_key:
        return item

    task_dir.mkdir(parents=True, exist_ok=True)
    dest = task_dir / filename

    raw = item[content_key]
    if content_key == "base64_content":
        dest.write_bytes(base64.b64decode(raw))
    else:
        dest.write_text(str(raw), encoding="utf-8")

    rewritten = {k: v for k, v in item.items() if k != content_key}
    rewritten["path"] = str(dest)
    return rewritten
