// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2024, Tiny Tapeout LTD
// Author: Uri Shaked

import { createStore } from 'solid-js/store';

export interface Project {
  macro: string;
  address: number;
  title: string;
  author: string;
  repo: string;
  commit: string;
  clock_hz: number;
  danger_level?: 'high' | 'medium' | 'safe' | 'unknown';
  danger_reason?: string;
}

export const [shuttle, updateShuttle] = createStore({
  id: 'unknown',
  loading: true,
  projects: [] as Project[],
});

export async function loadShuttle(id: string) {
  updateShuttle({
    id,
    projects: [],
    loading: true,
  });
  try {
    const request = await fetch(
      `https://index.tinytapeout.com/${id}.json?fields=title,author,repo,address,macro,clock_hz,commit,danger_level,danger_reason`,
    );
    const shuttleIndex: { projects: Project[] } = await request.json();
    shuttleIndex.projects.sort((a, b) => a.title.localeCompare(b.title));
    updateShuttle({ projects: shuttleIndex.projects });
  } finally {
    updateShuttle({ loading: false });
  }
}
