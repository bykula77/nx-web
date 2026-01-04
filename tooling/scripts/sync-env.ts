#!/usr/bin/env tsx
/**
 * Sync environment variables from .env.example to .env.local
 *
 * Usage: pnpm sync-env
 *
 * This script:
 * 1. Reads .env.example to get all required variables
 * 2. Reads existing .env.local values (if any)
 * 3. Adds missing variables to .env.local (preserving existing values)
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = resolve(__dirname, '../..');
const examplePath = resolve(rootDir, '.env.example');
const localPath = resolve(rootDir, '.env.local');

interface EnvEntry {
  key: string;
  value: string;
  comment?: string;
}

/**
 * Parse an env file into structured entries
 */
function parseEnvFile(content: string): EnvEntry[] {
  const lines = content.split('\n');
  const entries: EnvEntry[] = [];
  let currentComment: string | undefined;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      currentComment = undefined;
      continue;
    }

    // Capture comments
    if (trimmed.startsWith('#')) {
      currentComment = trimmed;
      // Add comment-only entries to preserve structure
      entries.push({ key: '', value: '', comment: currentComment });
      currentComment = undefined;
      continue;
    }

    // Parse key=value
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      entries.push({
        key: key.trim(),
        value: value.trim(),
        comment: currentComment,
      });
      currentComment = undefined;
    }
  }

  return entries;
}

/**
 * Convert entries back to env file format
 */
function stringifyEnvEntries(entries: EnvEntry[]): string {
  const lines: string[] = [];

  for (const entry of entries) {
    if (entry.comment && !entry.key) {
      lines.push(entry.comment);
    } else if (entry.key) {
      lines.push(`${entry.key}=${entry.value}`);
    }
  }

  return lines.join('\n') + '\n';
}

async function main(): Promise<void> {
  console.log('🔄 Syncing environment variables...\n');

  // Check if .env.example exists
  if (!existsSync(examplePath)) {
    console.error('❌ .env.example not found');
    process.exit(1);
  }

  // Read example file
  const exampleContent = readFileSync(examplePath, 'utf-8');
  const exampleEntries = parseEnvFile(exampleContent);

  // Read existing local file (if exists)
  let localEntries: EnvEntry[] = [];
  if (existsSync(localPath)) {
    const localContent = readFileSync(localPath, 'utf-8');
    localEntries = parseEnvFile(localContent);
    console.log('📄 Found existing .env.local');
  } else {
    console.log('📄 Creating new .env.local');
  }

  // Build a map of existing values
  const existingValues = new Map<string, string>();
  for (const entry of localEntries) {
    if (entry.key) {
      existingValues.set(entry.key, entry.value);
    }
  }

  // Build final entries, preserving existing values
  const finalEntries: EnvEntry[] = [];
  const addedKeys: string[] = [];
  const preservedKeys: string[] = [];

  for (const entry of exampleEntries) {
    if (!entry.key) {
      // Keep comments
      finalEntries.push(entry);
    } else {
      // Check if we have an existing value
      const existingValue = existingValues.get(entry.key);
      if (existingValue !== undefined && existingValue !== '') {
        // Preserve existing value
        finalEntries.push({ ...entry, value: existingValue });
        preservedKeys.push(entry.key);
      } else {
        // Use example value (or empty)
        finalEntries.push(entry);
        if (!existingValues.has(entry.key)) {
          addedKeys.push(entry.key);
        }
      }
    }
  }

  // Write the result
  writeFileSync(localPath, stringifyEnvEntries(finalEntries), 'utf-8');

  // Report results
  console.log('');
  if (addedKeys.length > 0) {
    console.log(`➕ Added ${addedKeys.length} new variable(s):`);
    addedKeys.forEach((key) => console.log(`   • ${key}`));
  }
  if (preservedKeys.length > 0) {
    console.log(`✓  Preserved ${preservedKeys.length} existing value(s)`);
  }
  console.log('');
  console.log(`✅ Synced .env.local with .env.example`);
  console.log(`📁 Output: ${localPath}\n`);
}

main();

