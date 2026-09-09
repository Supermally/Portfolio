import { promises as fs } from "fs";
import path from "path";
import { DEFAULT_CONTENT } from "./defaults";
import { extractJsonFromGitHubContents } from "./parseContent";
import type { SiteContent } from "./types";

const CONTENT_PATH = "data/site-content.json";

function repoSettings() {
  const [owner, repo] = (process.env.GITHUB_CONTENT_REPO || "Supermally/Portfolio").split("/");
  return { owner, repo, branch: process.env.GITHUB_CONTENT_BRANCH || "main", token: process.env.GITHUB_CONTENT_TOKEN || "" };
}

function isContent(value: unknown): value is SiteContent {
  const item = value as Partial<SiteContent> | null;
  return !!item && item.version === 1 && Array.isArray(item.stations) && item.stations.length > 0 && Array.isArray(item.lines) && !!item.resume && !!item.contact;
}

function normalizeContent(content: SiteContent): SiteContent {
  return {
    ...DEFAULT_CONTENT,
    ...content,
    featured: { ...DEFAULT_CONTENT.featured, ...(content.featured || {}) },
    resume: { ...DEFAULT_CONTENT.resume, ...content.resume, pdfUrl: content.resume.pdfUrl === "/assets/resume-placeholder.pdf" ? DEFAULT_CONTENT.resume.pdfUrl : content.resume.pdfUrl },
    contact: { ...DEFAULT_CONTENT.contact, ...content.contact },
    lines: content.lines.map((line, index) => ({ ...DEFAULT_CONTENT.lines[index], ...line })),
  };
}

async function readGitHubContent(): Promise<SiteContent | null> {
  const { owner, repo, branch, token } = repoSettings();
  const headers: HeadersInit = { Accept: "application/vnd.github+json", "User-Agent": "grand-central-admin" };
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${CONTENT_PATH}?ref=${encodeURIComponent(branch)}`, { headers, cache: "no-store" });
    if (!response.ok) return null;
    const parsed = extractJsonFromGitHubContents(await response.json());
    return isContent(parsed) ? normalizeContent(parsed) : null;
  } catch {
    return null;
  }
}

async function readLocalContent(): Promise<SiteContent | null> {
  try {
    const parsed = JSON.parse(await fs.readFile(path.join(process.cwd(), CONTENT_PATH), "utf8"));
    return isContent(parsed) ? normalizeContent(parsed) : null;
  } catch { return null; }
}

export async function getSiteContent() {
  const settings = repoSettings();
  if (settings.token) return (await readGitHubContent()) || (await readLocalContent()) || DEFAULT_CONTENT;
  return (await readLocalContent()) || DEFAULT_CONTENT;
}

export async function saveSiteContent(input: SiteContent) {
  const content: SiteContent = { ...input, version: 1, updatedAt: new Date().toISOString() };
  if (!isContent(content)) throw new Error("The submitted content is incomplete.");
  const { owner, repo, branch, token } = repoSettings();

  if (!token) {
    if (process.env.NODE_ENV === "production") throw new Error("GITHUB_CONTENT_TOKEN is not configured.");
    await fs.writeFile(path.join(process.cwd(), CONTENT_PATH), JSON.stringify(content, null, 2) + "\n", "utf8");
    return content;
  }

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${CONTENT_PATH}`;
  const headers = { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}`, "Content-Type": "application/json", "User-Agent": "grand-central-admin" };
  const existing = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, { headers, cache: "no-store" });
  const existingJson = existing.ok ? await existing.json() : null;
  const response = await fetch(apiUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify({ message: `Update portfolio content (${new Date().toISOString()})`, content: Buffer.from(JSON.stringify(content, null, 2) + "\n").toString("base64"), branch, ...(existingJson?.sha ? { sha: existingJson.sha } : {}) })
  });
  if (!response.ok) throw new Error(`GitHub rejected the update (${response.status}).`);
  return content;
}
