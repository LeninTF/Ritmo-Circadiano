# Constraints

Last reviewed: 2026-10-16 by @LeninTF

Status: the repo has no code yet. The commands below are the contract; the `check:*` npm scripts and CI jobs get wired in when `package.json` and the Nx workspace exist.

## Floor (always enforced, blocks immediately)

- No new suppression comments: `@ts-ignore`, `eslint-disable`, `istanbul ignore`, `nosemgrep`, `gitleaks:allow`
- No unimplemented stubs: `throw new Error("Not implemented")`, empty `catch {}`
- No skipped or deleted tests without a reason in the commit message
- No secrets in source
- No PII (`correo`, `hash_clave`, names) in aggregates, logs or CSV exports. The RF16 anti-PII test must keep passing (CLAUDE.md section 6)
- This file does not get weakened to make a change pass

## Enforced with numbers

| Dimension | Rule | Why this number | Checked by | Runs at | Mode |
|-----------|------|-----------------|-----------|---------|------|
| Types | Zero errors, TS strict | Already required by CLAUDE.md | `npx nx affected -t typecheck` | every edit | block |
| Lint | Zero errors | Project config is the contract | `npx nx affected -t lint` | every edit | block |
| Secrets | No findings | Participants' health data and VAPID/JWT keys | `gitleaks detect --redact --no-banner` | every edit | block |
| Coverage: domain | `libs/domain` ≥ 70% | Agreed in CLAUDE.md; the formulas (RN04, RN05, RN09) must be exact | `npx nx test domain --coverage` | task end, CI | block |
| Coverage: changed lines | ≥ 80% covered | Forces a test per change without punishing config lines | `npx nx affected -t test --coverage` + `git diff` vs lcov | task end, CI | warn until 2026-10-30, then block |
| Security: code | No high findings | Auth, JWT and k-anonymity code is the risk | `semgrep scan --config p/default --config p/owasp-top-ten` | CI | warn until 2026-10-30, then block |
| Security: deps | Nothing at high or above | Below high is mostly noise | `osv-scanner scan source -r .` | CI | warn until 2026-10-30, then block |

External check: osv-scanner and Semgrep read outside rule sets, so the bar is not judged only by this project's own tests.

Time budget: edit loop under 5s on the changed file; task end under 90s; everything else in CI.

## Measured, not yet enforced

| Metric | Today | Direction |
|--------|-------|-----------|
| Project coverage | no code yet | record at first merge to `develop`, must not fall (tolerance 0.5%) |

Run `/constraints ratchet` after the first code lands.

## Not set up (and why)

- Accessibility (axe-core) and performance (Lighthouse CI): CLAUDE.md plans both, but they need a running PWA URL. Add them to this file when a preview deploy exists.
- Architecture boundaries and mutation testing: not picked.

## Exceptions

| ID | Rule | Path | Reason | Owner | Expires |
|----|------|------|--------|-------|---------|
| EX-01 | Security: deps | `package-lock.json` (`braces` 3.0.3, GHSA-vfj7-8cjw-p6xm, CVSS 8.7) | Sin version corregida. Solo dev (via `webpack-dev-server`); no llega al bundle ni al API. Ignorado en `osv-scanner.toml` | @LeninTF | 2026-11-30 |
| EX-02 | Security: deps | `package-lock.json` (`sprintf-js` 1.0.3, GHSA-hp3w-g68c-fv3c, CVSS 6.9) | Sin version corregida. Solo dev (via `ts-jest`); no llega al bundle ni al API. Ignorado en `osv-scanner.toml` | @LeninTF | 2026-11-30 |
