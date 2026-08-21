"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  // Never changes after mount — there's nothing to re-subscribe to, this
  // just needs one flip from the server snapshot to the client snapshot.
  return () => {};
}

function getServerSnapshot() {
  return false;
}

function getClientSnapshot() {
  return true;
}

/**
 * True once the component has mounted on the client, false during SSR and
 * during the client's first (pre-hydration) render — the two agree, so
 * nothing here can cause a hydration mismatch. Exists specifically for
 * client-only rendering (e.g. a createPortal target that doesn't exist
 * during SSR) without the `setState` in a mount effect anti-pattern
 * (react-hooks/set-state-in-effect) a naive `useState(false)` + `useEffect`
 * version trips.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
