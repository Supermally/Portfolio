/**
 * GitHub's Contents API returns either raw file JSON (Accept: raw)
 * or a metadata envelope with newline-wrapped base64 `content`.
 * The admin save path always writes that envelope; the public reader
 * must accept both or published portfolio updates never go live.
 */
export function extractJsonFromGitHubContents(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") return payload;

  const body = payload as { content?: unknown; encoding?: unknown; version?: unknown };
  if (body.encoding !== "base64" || typeof body.content !== "string" || body.version === 1) {
    return payload;
  }

  const decoded = Buffer.from(body.content.replace(/\s/g, ""), "base64").toString("utf8");
  return JSON.parse(decoded);
}
