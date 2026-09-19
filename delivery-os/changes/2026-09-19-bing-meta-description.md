# Bing metadata refinement

- Outcome: shorten the homepage meta description after Bing Live URL inspection reported that it was too long.
- Owner: CCKOA site owner.
- Authoritative input: Bing Webmaster Tools Live URL inspection and the current homepage metadata.
- Data boundary: public campground description only.
- Scope: replace the homepage description with a concise 143-character description; preserve visible content and layout.
- Success criteria: description is 120–160 characters, remains accurate, and the existing agent-readiness tests pass.
- Review level: low-risk metadata-only change.
- Approval gate: owner review in Bing Live URL inspection.
- Rollback/manual fallback: restore the prior description if search-preview testing shows a better approved variant.
- Validation plan: run the agent-readiness tests, push the commit, then rerun Bing Live URL inspection and request indexing if the result is clean.
