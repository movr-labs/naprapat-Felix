import sourceHtml from '../content/om-naprapat-source.html?raw';
import { HtmlPage } from '../lib/HtmlPage';
import { setupFaqPage } from '../setup/faqSetup';

export function OmNaprapatPage() {
  return <HtmlPage rawHtml={sourceHtml} setup={setupFaqPage} />;
}
