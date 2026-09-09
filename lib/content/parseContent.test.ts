import assert from "node:assert/strict";
import { extractJsonFromGitHubContents } from "./parseContent.ts";

const siteContent = {
  version: 1,
  updatedAt: "2026-09-09T00:00:00.000Z",
  stations: [{ id: "station-grand-central", title: "Grand Central Hub" }],
  lines: [{ id: "ee-line", label: "Computers & Electronics" }],
  resume: { name: "Malachi McDonald" },
  contact: { email: "malachimcd1@gmail.com" },
};

const wrappedBase64 = Buffer.from(JSON.stringify(siteContent), "utf8")
  .toString("base64")
  .replace(/(.{40})/g, "$1\n");

const githubEnvelope = {
  name: "site-content.json",
  path: "data/site-content.json",
  sha: "abc123",
  encoding: "base64",
  content: wrappedBase64,
};

const fromEnvelope = extractJsonFromGitHubContents(githubEnvelope);
assert.deepEqual(fromEnvelope, siteContent, "should decode GitHub Contents API base64 envelopes, including newline wrapping");

const fromRaw = extractJsonFromGitHubContents(siteContent);
assert.deepEqual(fromRaw, siteContent, "should pass through raw SiteContent JSON unchanged");

const stub = { version: 1, stations: [], lines: [], resume: null, contact: null };
assert.deepEqual(extractJsonFromGitHubContents(stub), stub, "should not treat the local placeholder file as a GitHub envelope");

console.log("parseContent tests passed");
