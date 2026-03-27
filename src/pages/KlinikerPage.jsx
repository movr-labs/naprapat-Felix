import sourceHtml from '../content/kliniker-source.html?raw';
import { HtmlPage } from '../lib/HtmlPage';

export function KlinikerPage() {
  return <HtmlPage rawHtml={sourceHtml} />;
}
