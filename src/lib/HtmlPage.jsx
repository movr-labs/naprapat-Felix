import { useEffect, useMemo, useRef } from 'react';
import { parseHtmlPage } from './parseHtmlPage';

export function HtmlPage({ rawHtml, setup }) {
  const parsed = useMemo(() => parseHtmlPage(rawHtml), [rawHtml]);
  const containerRef = useRef(null);

  useEffect(() => {
    document.title = parsed.title;
  }, [parsed.title]);

  useEffect(() => {
    if (!parsed.styles) return undefined;

    const styleTag = document.createElement('style');
    styleTag.dataset.reactPageStyles = parsed.title;
    styleTag.textContent = parsed.styles;
    document.head.appendChild(styleTag);

    return () => {
      styleTag.remove();
    };
  }, [parsed.styles, parsed.title]);

  useEffect(() => {
    if (!containerRef.current || !setup) return undefined;
    return setup(containerRef.current);
  }, [setup, parsed.body]);

  return <div ref={containerRef} style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: parsed.body }} />;
}
