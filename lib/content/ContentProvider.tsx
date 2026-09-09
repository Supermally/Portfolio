"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_CONTENT } from "./defaults";
import type { SiteContent } from "./types";

type ContentContextValue = SiteContent & { loading: boolean; refresh: () => Promise<void> };
const ContentContext = createContext<ContentContextValue>({ ...DEFAULT_CONTENT, loading: true, refresh: async () => {} });

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const response = await fetch("/api/content", { cache: "no-store" });
      if (response.ok) setContent(await response.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void refresh(); }, []);
  const value = useMemo(() => ({ ...content, loading, refresh }), [content, loading]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useSiteContent() {
  return useContext(ContentContext);
}
