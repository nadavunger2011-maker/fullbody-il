import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AdminDashboard from '../pages/AdminDashboard';

const requests = vi.hoisted(() => ({ pending: [] as Array<(value: { data: [] }) => void> }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: { getSession: async () => ({ data: { session: { user: { id: 'admin-test' } } } }) },
    from: () => {
      const query = {
        select: () => query,
        order: () => query,
        gte: () => query,
        limit: () => query,
        then: (resolve: (value: { data: [] }) => void) => requests.pending.push(resolve),
      };
      return query;
    },
  },
}));

let root: Root | undefined;
const container = document.createElement('div');
afterEach(() => { act(() => root?.unmount()); container.replaceChildren(); requests.pending.length = 0; });

async function resolveFetch() {
  // Analytics query resolves first, followed by the ad-spend query.
  await act(async () => { requests.pending.splice(0).forEach(resolve => resolve({ data: [] })); });
  await act(async () => { requests.pending.splice(0).forEach(resolve => resolve({ data: [] })); });
}

it('keeps hook order stable when loading completes and when the date range reloads', async () => {
  root = createRoot(container);
  await act(async () => { root?.render(<MemoryRouter><HelmetProvider><AdminDashboard /></HelmetProvider></MemoryRouter>); });
  expect(container.querySelector('header')).toBeNull();
  await resolveFetch();
  expect(container.querySelector('header')).not.toBeNull();
  const rangeButton = Array.from(container.querySelectorAll('button')).find(button => button.textContent === '7 ימים');
  expect(rangeButton).toBeDefined();
  await act(async () => { rangeButton?.click(); });
  expect(container.querySelector('header')).toBeNull();
  await resolveFetch();
  expect(container.querySelector('header')).not.toBeNull();
});