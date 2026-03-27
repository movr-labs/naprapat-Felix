import sourceHtml from '../content/index-source.html?raw';
import { HtmlPage } from '../lib/HtmlPage';
import { setupHomePage } from '../setup/homeSetup';

export function HomePage() {
  return <HtmlPage rawHtml={sourceHtml} setup={setupHomePage} />;
}
