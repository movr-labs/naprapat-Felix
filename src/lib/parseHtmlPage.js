const EVENT_ATTR_PATTERN = /\s(onclick|onkeydown|onsubmit)="[^"]*"/g;
const SCRIPT_PATTERN = /<script[\s\S]*?<\/script>/gi;

export function parseHtmlPage(rawHtml) {
  const title = rawHtml.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? 'Hittanaprapat.se';
  const styles = rawHtml.match(/<style>([\s\S]*?)<\/style>/i)?.[1]?.trim() ?? '';
  const body = rawHtml
    .match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1]
    ?.replace(SCRIPT_PATTERN, '')
    .replace(EVENT_ATTR_PATTERN, '')
    .trim() ?? '';

  return { title, styles, body };
}
