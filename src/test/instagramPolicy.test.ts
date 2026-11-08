import { describe, expect, it } from 'vitest';
import { israelSlot, isGuidePost, PROTECTED_GUIDE_IDS } from '../../supabase/functions/instagram-daily-post/policy';

describe('Instagram Israel daily slot', () => {
  it('allows winter 20:00 Israel and rejects night and other hours', () => {
    expect(israelSlot(new Date('2026-11-08T18:00:00Z'))).toEqual({ date: '2026-11-08', allowed: true });
    expect(israelSlot(new Date('2026-11-08T18:01:00Z')).allowed).toBe(false);
    expect(israelSlot(new Date('2026-11-08T00:00:00Z')).allowed).toBe(false);
  });
  it('uses summer Israel time rather than a fixed UTC offset', () => {
    expect(israelSlot(new Date('2027-07-08T17:00:00Z')).allowed).toBe(true);
    expect(israelSlot(new Date('2027-07-08T18:00:00Z')).allowed).toBe(false);
  });
  it('preserves all four already scheduled guide carousels', () => {
    expect(PROTECTED_GUIDE_IDS).toHaveLength(4);
    for (const id of PROTECTED_GUIDE_IDS) expect(isGuidePost({ id })).toBe(true);
  });
  it('excludes generic posts and retains the requested guide topics', () => {
    expect(isGuidePost({ id: 'generic', title: 'אימון בבית: רושמים כדי להתקדם' })).toBe(false);
    for (const caption of ['קריאטין', 'חלבון', 'מגנזיום', 'תוספי תזונה', 'iHerb']) expect(isGuidePost({ id: caption, caption })).toBe(true);
  });
});