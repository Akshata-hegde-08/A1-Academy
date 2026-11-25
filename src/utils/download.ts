import { ResourceItem } from '../data/curriculum';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function downloadResourceFile(
  item: ResourceItem,
  subjectName: string,
  cycleName: string,
  categoryTitle: string,
): void {
  if (!item.downloadable) return;

  const sectionsHtml = (item.previewPages ?? [])
    .map(
      (page) => `
      <section style="margin-bottom: 24px; padding: 18px; border: 1px solid #cbd5e1; border-radius: 10px; background: #ffffff;">
        <h2 style="margin: 0 0 10px; font-size: 18px; color: #0f172a;">${escapeHtml(page.heading)}</h2>
        <ul style="margin: 0 0 12px 20px; padding: 0; color: #334155; line-height: 1.6;">
          ${page.bullets.map((b) => `<li style="margin-bottom: 6px;">${escapeHtml(b)}</li>`).join('')}
        </ul>
        ${
          page.formulaOrCode
            ? `<pre style="margin: 0; padding: 12px; background: #0f172a; color: #e2e8f0; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 13px;">${escapeHtml(page.formulaOrCode)}</pre>`
            : ''
        }
      </section>
    `,
    )
    .join('');

  const htmlDoc = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(item.title)} — A1 ACADEMY</title>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; max-width: 820px; margin: 32px auto; padding: 0 20px; background: #f8fafc; color: #0f172a;">
  <header style="border-bottom: 2px solid #cbd5e1; padding-bottom: 16px; margin-bottom: 24px;">
    <p style="margin: 0 0 6px; font-size: 12px; color: #475569; letter-spacing: 0.04em;">A1 ACADEMY · ${escapeHtml(cycleName)} · ${escapeHtml(subjectName)} · ${escapeHtml(categoryTitle)}</p>
    <h1 style="margin: 0 0 8px; font-size: 24px; color: #0f172a;">${escapeHtml(item.title)}</h1>
    <p style="margin: 0; font-size: 14px; color: #475569;">${escapeHtml(item.previewSummary)}</p>
    ${item.isSample ? '<p style="margin: 10px 0 0; font-size: 12px; color: #1d4ed8;">Sample Content — Educational Demonstration Sheet</p>' : ''}
  </header>
  ${sectionsHtml}
  <footer style="margin-top: 32px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px;">
    Downloaded from A1 ACADEMY — Your First Engineering Hub.
  </footer>
</body>
</html>`;

  const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const safeName = item.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  anchor.href = url;
  anchor.download = `${safeName || 'a1-academy-study-guide'}.html`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
