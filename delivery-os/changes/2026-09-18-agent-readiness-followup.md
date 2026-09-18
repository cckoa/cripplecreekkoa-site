# Agent readiness follow-up

- Outcome: complete the remaining public agent-readiness work after the first GitHub Pages release.
- Owner: CCKOA site owner.
- Authoritative inputs: current `index.html`, current public URLs, the Ora findings supplied by the owner, and the Cloudflare Worker connected to `cckoa/cripplecreekkoa-site`.
- Data boundary: public campground information only; no guest, employee, credential, reservation, or payment data.
- Scope: add trust anchor pages, organization contact schema, a robots file, a Markdown homepage representation, and an edge Worker that negotiates HTML versus Markdown and returns Markdown 404s.
- Success criteria: HTML remains the default response; `Accept: text/markdown` returns nonempty Markdown with `Content-Type: text/markdown` and `Vary: Accept`; unknown Markdown requests return HTTP 404 with a linked recovery body; trust pages are each at least 500 characters; schema includes address and contactPoint; tests pass.
- Review level: material hosting behavior with low-risk public content; deterministic tests plus live endpoint verification.
- Approval gate: owner must attach `cripplecreekkoa.com` to the Worker only after the temporary Worker URL and production behavior are verified.
- Rollback/manual fallback: detach the custom domain and return DNS to the GitHub Pages configuration; revert this commit to restore the static-only site.
- Validation plan: run `node --test tests/agent-readiness.test.mjs`; deploy through the connected Cloudflare build; test HTML, Markdown, 404, trust pages, sitemap, and robots responses on the temporary Worker URL before attaching the production domain.
