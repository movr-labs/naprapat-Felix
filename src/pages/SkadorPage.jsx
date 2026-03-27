import sourceHtml from '../content/skador-source.html?raw';
import { HtmlPage } from '../lib/HtmlPage';
import { setupSkadorPage } from '../setup/skadorSetup';

export function SkadorPage() {
  return <HtmlPage rawHtml={sourceHtml} setup={setupSkadorPage} />;
}
