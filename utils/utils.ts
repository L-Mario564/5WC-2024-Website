/**
 * Wraps tables parsed from markdown to make them responsive
 */
export function wrapTables(querySelector: string) {
  const content = document.querySelector(querySelector);
  const tables = document.querySelectorAll('table');

  if (!content) return;

  tables.forEach((el) => {
    const div = document.createElement('div');
    div.style.overflowX = 'auto';
    div.appendChild(el.cloneNode(true));

    if (content.contains(el)) {
      content.replaceChild(div, el);
    }
  });
}
