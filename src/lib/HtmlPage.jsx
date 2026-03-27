import { useEffect, useMemo, useRef } from 'react';
import { parseHtmlPage } from './parseHtmlPage';

const sharedMobileNavStyles = `
  nav.has-mobile-nav .nav-toggle {
    display: none;
    appearance: none;
    border: 1px solid rgba(180,220,200,0.7);
    background: rgba(255,255,255,0.92);
    color: #1a6641;
    width: 44px;
    height: 44px;
    border-radius: 14px;
    cursor: pointer;
    padding: 0;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(26,102,65,0.08);
  }

  nav.has-mobile-nav .nav-toggle:focus-visible {
    outline: 2px solid rgba(26,102,65,0.35);
    outline-offset: 2px;
  }

  nav.has-mobile-nav .nav-toggle-bars {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  nav.has-mobile-nav .nav-toggle-bar {
    width: 18px;
    height: 2px;
    border-radius: 999px;
    background: currentColor;
    transition: transform .2s ease, opacity .2s ease;
    transform-origin: center;
  }

  nav.has-mobile-nav.menu-open .nav-toggle-bar:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  nav.has-mobile-nav.menu-open .nav-toggle-bar:nth-child(2) {
    opacity: 0;
  }

  nav.has-mobile-nav.menu-open .nav-toggle-bar:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  @media (max-width: 760px) {
    nav.has-mobile-nav {
      display: grid !important;
      grid-template-columns: 1fr auto;
      align-items: center !important;
      gap: 12px !important;
      padding: 12px 16px !important;
    }

    nav.has-mobile-nav .nav-logo {
      min-width: 0;
    }

    nav.has-mobile-nav .nav-logo-name {
      display: none !important;
    }

    nav.has-mobile-nav .nav-toggle {
      display: inline-flex;
    }

    nav.has-mobile-nav .nav-links {
      grid-column: 1 / -1;
      width: 100% !important;
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 0 !important;
      overflow: hidden;
      max-height: 0;
      opacity: 0;
      padding-top: 0;
      pointer-events: none;
      transition: max-height .25s ease, opacity .2s ease, padding-top .2s ease;
    }

    nav.has-mobile-nav.menu-open .nav-links {
      max-height: 320px;
      opacity: 1;
      padding-top: 8px;
      pointer-events: auto;
    }

    nav.has-mobile-nav .nav-links a {
      width: 100%;
      padding: 12px 0;
      font-size: 15px !important;
      border-top: 1px solid rgba(180,220,200,0.45);
    }

    nav.has-mobile-nav .nav-links .nav-cta {
      display: none !important;
    }
  }
`;

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
    const styleTag = document.createElement('style');
    styleTag.dataset.reactPageStyles = 'shared-mobile-nav';
    styleTag.textContent = sharedMobileNavStyles;
    document.head.appendChild(styleTag);

    return () => {
      styleTag.remove();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const nav = container.querySelector('nav');
    const navLinks = nav?.querySelector('.nav-links');
    if (!nav || !navLinks) return undefined;

    nav.classList.add('has-mobile-nav');

    if (!navLinks.id) {
      navLinks.id = `nav-links-${Math.random().toString(36).slice(2, 10)}`;
    }

    let toggle = nav.querySelector('.nav-toggle');
    let createdToggle = false;

    if (!toggle) {
      createdToggle = true;
      toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'nav-toggle';
      toggle.innerHTML = `
        <span class="nav-toggle-bars" aria-hidden="true">
          <span class="nav-toggle-bar"></span>
          <span class="nav-toggle-bar"></span>
          <span class="nav-toggle-bar"></span>
        </span>
      `;
      nav.insertBefore(toggle, navLinks);
    }

    const closeMenu = () => {
      nav.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Öppna meny');
    };

    const openMenu = () => {
      nav.classList.add('menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Stäng meny');
    };

    const toggleMenu = () => {
      if (nav.classList.contains('menu-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    toggle.setAttribute('aria-controls', navLinks.id);
    closeMenu();

    const handleLinkClick = () => {
      closeMenu();
    };

    const handleMediaChange = event => {
      if (event.matches) closeMenu();
    };

    toggle.addEventListener('click', toggleMenu);
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', handleLinkClick);
    });

    const mediaQueryList = window.matchMedia('(min-width: 761px)');
    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', handleMediaChange);
    } else if (typeof mediaQueryList.addListener === 'function') {
      mediaQueryList.addListener(handleMediaChange);
    }

    return () => {
      toggle.removeEventListener('click', toggleMenu);
      navLinks.querySelectorAll('a').forEach(link => {
        link.removeEventListener('click', handleLinkClick);
      });

      if (typeof mediaQueryList.removeEventListener === 'function') {
        mediaQueryList.removeEventListener('change', handleMediaChange);
      } else if (typeof mediaQueryList.removeListener === 'function') {
        mediaQueryList.removeListener(handleMediaChange);
      }

      closeMenu();
      nav.classList.remove('has-mobile-nav');

      if (createdToggle) {
        toggle.remove();
      }
    };
  }, [parsed.body]);

  useEffect(() => {
    if (!containerRef.current || !setup) return undefined;
    return setup(containerRef.current);
  }, [setup, parsed.body]);

  return <div ref={containerRef} style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: parsed.body }} />;
}
