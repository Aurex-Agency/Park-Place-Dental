"use client";

import type { ReactNode } from "react";
import { Footer } from "./footer";
import { MobileBottomBar } from "./mobile-bottom-bar";
import { MobileDrawer } from "./mobile-drawer";
import { Nav } from "./nav";
import { ShellChromeProvider, useShellChrome } from "./shell-chrome";
import { SkipLink } from "./skip-link";

function ShellBody({ children }: { children: ReactNode }) {
  const { drawerOpen, heroTransparent } = useShellChrome();

  return (
    // pb clears the fixed mobile bottom bar so it never covers the last
    // element on the page; inert while the drawer is open so it — and
    // everything in it, including Nav's own trigger — drops out of the tab
    // order and the a11y tree (the drawer, portaled separately, is the one
    // thing left interactive).
    <div data-shell-content inert={drawerOpen || undefined} className="pb-[4.5rem] xl:pb-0">
      <Nav />
      <main id="main-content" tabIndex={-1} className={heroTransparent ? "" : "pt-[var(--nav-h)]"}>
        {children}
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
}

/**
 * The real site chrome — Nav, footer, mobile bottom bar, mobile drawer.
 * app/(marketing)/layout.tsx wraps every marketing route in this, and
 * app/dev/shell reuses it as-is so that harness reviews the actual shell,
 * not a re-implementation of it.
 */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <ShellChromeProvider>
      <SkipLink />
      <ShellBody>{children}</ShellBody>
      <MobileDrawer />
    </ShellChromeProvider>
  );
}
