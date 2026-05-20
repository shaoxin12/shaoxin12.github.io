'use client';

import { useEffect, useRef } from 'react';

export default function Giscus({ term }: { term: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'yangshaoxin12/yangshaoxin12.github.io');
    script.setAttribute('data-repo-id', 'R_kgDOSiCCLw');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDOSiCCL84C9cSq');
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', term);
    script.setAttribute('data-reactions-enabled', '0');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'light');
    script.setAttribute('data-lang', document.documentElement.lang);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    container.appendChild(script);

    return () => {
      loadedRef.current = false;
    };
  }, [term]);

  return <div className="giscus-container" ref={containerRef} />;
}
