import { Logger } from '@nestjs/common';

const logger = new Logger('InputSanitizer');

/**
 * Known prompt injection patterns.
 * These are checked case-insensitively against user input before it is
 * interpolated into prompt templates.
 */
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /ignore\s+(all\s+)?above\s+instructions/i,
  /disregard\s+(all\s+)?previous/i,
  /forget\s+(all\s+)?(your|prior|previous)\s+instructions/i,
  /you\s+are\s+now\s+a\s+different\s+(ai|assistant|bot)/i,
  /new\s+system\s+prompt/i,
  /override\s+system\s+prompt/i,
  /\[system\]/i,
  /\[INST\]/i,
  /<\|im_start\|>/i,
  /<<\s*SYS\s*>>/i,
];

export interface SanitizationResult {
  sanitized: string;
  wasFlagged: boolean;
  matchedPatterns: string[];
}

/**
 * Checks user input for known prompt-injection patterns.
 * Returns the original input (we do NOT silently alter it) together with
 * a flag and the list of matched pattern descriptions so the caller can
 * decide how to handle it (log, reject, add a guardrail wrapper, etc.).
 */
export function sanitizeInput(input: string): SanitizationResult {
  const matchedPatterns: string[] = [];

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      matchedPatterns.push(pattern.source);
    }
  }

  if (matchedPatterns.length > 0) {
    logger.warn(
      `Potential prompt injection detected (${matchedPatterns.length} pattern(s) matched)`,
    );
  }

  return {
    sanitized: input,
    wasFlagged: matchedPatterns.length > 0,
    matchedPatterns,
  };
}

/**
 * Wraps user input with delimiters that make injection harder.
 * The system prompt should instruct the model to treat content
 * between these delimiters as opaque user data.
 */
export function wrapUserInput(input: string): string {
  return `<user_input>\n${input}\n</user_input>`;
}
