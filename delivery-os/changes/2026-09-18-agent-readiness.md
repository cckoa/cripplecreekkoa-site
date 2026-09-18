# Agent readiness improvements

- Outcome: improve the public site's recoverability and machine-readable discovery for web agents.
- Owner: CCKOA site owner.
- Authoritative inputs: the existing `index.html`, the public domain `https://cripplecreekkoa.com/`, and the requested Ora audit findings.
- Data boundary: public campground information only; no guest, employee, credential, reservation, or payment data.
- Scope: add a public sitemap, `llms.txt`, an agent-friendly 404 document, and on-page brand/schema discoverability signals. Preserve the existing visual design and booking behavior.
- Success criteria: the new files validate locally; all listed URLs are public and accurate; unknown paths remain HTTP 404; the homepage retains its current visual/content behavior; the live deployment is verified after publishing.
- Review level: low-risk public static-site change with SEO/content review.
- Approval gate: site owner approval before merging/publishing.
- Rollback/manual fallback: revert the added files and the small metadata block in `index.html`; if the 404 page causes a Pages issue, remove `404.html` and restore the previous default response.
- Validation plan: run `node --test tests/agent-readiness.test.mjs`; inspect the generated XML/text/HTML; after publication, check `/`, `/sitemap.xml`, `/llms.txt`, `/404.html`, and a nonexistent path with HTTP requests.
- Known platform limitation: GitHub Pages static hosting cannot vary the root response on `Accept: text/markdown` or author custom `Vary` headers. That requirement needs an edge/server migration (or proxy) and remains explicitly unresolved here.
