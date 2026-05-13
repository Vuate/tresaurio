// XSS prevention utilities for user-controlled string inputs.
// Whitelist approach: reject anything that doesn't match safe patterns.

// Matches API key labels, wallet labels, alert names — alphanumeric + safe punctuation, max 50 chars.
const LABEL_RE = /^[a-zA-Z0-9_\- ]{1,50}$/;

// Matches dashboard template names — slightly more permissive, max 100 chars.
const TEMPLATE_NAME_RE = /^[a-zA-Z0-9_\-\s.,()!]{1,100}$/;

// Detects HTML tags, javascript: URIs, and data: URIs regardless of field type.
const DANGEROUS_RE = /<[^>]*>|javascript\s*:|data\s*:/i;

export function isValidLabel(value: string): boolean {
  return LABEL_RE.test(value);
}

export function isValidTemplateName(value: string): boolean {
  return TEMPLATE_NAME_RE.test(value);
}

export function containsDangerousContent(value: string): boolean {
  return DANGEROUS_RE.test(value);
}

// Strips HTML tags and trims — used for free-text fields (e.g. display name)
// that allow a broader character set but must never store raw markup.
export function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/data\s*:/gi, "")
    .trim();
}
