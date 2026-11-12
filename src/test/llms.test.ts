import { expect, it } from 'vitest';
import { buildLlms, AI_GUIDES } from '../../scripts/build-llms';
import { readFileSync } from 'node:fs';
import { TRANSPARENCY_DISCLOSURE } from '../lib/business';
import policy from '../../supabase/functions/_shared/blog-index.json';

it('lists exactly the 21 approved indexed guides and the calculator, with the shared disclosure', () => {
  const text = buildLlms();
  expect(Object.keys(AI_GUIDES)).toHaveLength(21);
  expect(text.match(/^- \[/gm)).toHaveLength(22);
  expect(text.split('\n').length).toBeLessThan(120);
  expect(text).toContain(TRANSPARENCY_DISCLOSURE);
  for (const slug of Object.keys(AI_GUIDES)) expect(policy.indexed).toContain(slug);
  expect(readFileSync('public/llms.txt', 'utf8')).toBe(text);
});