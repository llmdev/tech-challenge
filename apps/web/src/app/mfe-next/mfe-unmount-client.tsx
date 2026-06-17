"use client";

import { useEffect } from "react";

export default function MfeUnmountClient() {
  useEffect(() => {
    try {
      // If the mfe exposes lifecycles on globalThis, try to unmount it.
      // @ts-ignore
      const mfe = (globalThis as any).mfeNext;
      if (mfe && typeof mfe.unmount === "function") {
        mfe.unmount({}).catch(() => {});
      }

      // Also remove the MFE root element if it exists
      const el = document.getElementById("mfe-next-root");
      if (el && el.parentNode) el.parentNode.removeChild(el);

      // Remove any script tag that might have injected the MFE bundle
      const scripts = Array.from(document.querySelectorAll('script[src*="mfe-next"]'));
      scripts.forEach((s) => s.parentNode && s.parentNode.removeChild(s));
    } catch (e) {
      // ignore
    }
  }, []);

  return null;
}
