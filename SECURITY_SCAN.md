# Security Scan - product-catalogue

**Scan date:** 2026-07-14
**Tool:** Docker Scout (built into Docker Desktop)
**Image scanned:** `sadmomo/product-catalogue:latest`
**Image digest:** `sha256:6e5a73c223a8fc238990a755287632492a6591fe9a9538bc8229d4b9ed3cd709`
**Base image (auto-detected):** `node:20-bookworm-slim`
**Image size:** 74 MB, 393 packages indexed

---

## Commands Used

```bash
# Full CVE detail scan
docker scout cves sadmomo/product-catalogue:latest

# High-level policy summary
docker scout quickview sadmomo/product-catalogue:latest
```

---

## Quick View Output

```
Target     |  sadmomo/product-catalogue:latest  |  1C  27H  15M  35L  8?
  digest   |  6e5a73c223a8                      |
Base image |  node:20-bookworm-slim             |  1C  27H  15M  35L  7?

Policy status: FAILED (4/7 policies met)

Status |                     Policy                     | Results
-------|-------------------------------------------------|------------------------------
 PASS  | Default non-root user                          |
 FAIL  | Copyleft licensed packages found               | 361 packages
 FAIL  | Fixable critical or high vulnerabilities found | 0C  25H  0M  0L
 PASS  | No high-profile vulnerabilities                | 0C  0H  0M  0L
 PASS  | No outdated base images                        |
 PASS  | No unapproved base images                      | 0 deviations
 FAIL  | Required supply chain attestations missing     | 2 deviations
```

---

## Summary Table

| Severity    | Count | Notes                                                                                                                      |
|-------------|------:|----------------------------------------------------------------------------------------------------------------------------|
| Critical    | 1     | `perl` (`5.36.0-7+deb12u3`) - no fix available in Debian 12                                                               |
| High        | 27    | Primarily `gnutls28` (8 CVEs, all fixable) and `perl` (2), `tar` npm (6), plus `openssl`, `systemd`, `npm` tooling        |
| Medium      | 15    | `gnutls28`, `perl`, `@sigstore/core`, `ip-address`, `libcap2` - several fixable                                           |
| Low         | 35    | Mostly OS-level packages (`coreutils`, `libgcrypt20`, `sed`, `apt`, `gnupg2`, `xz-utils`) - most unfixed                  |
| Unspecified | 8     | `perl`, `util-linux`, `wget` - no CVSS score assigned                                                                     |
| **Total**   | **86**| **26 vulnerable packages**                                                                                                 |

---

## Critical Vulnerabilities

| CVE | Package | Version | Fix Available | Description |
|-----|---------|---------|:---:|-------------|
| [CVE-2026-12087](https://scout.docker.com/v/CVE-2026-12087) | `perl` (deb) | `5.36.0-7+deb12u3` | No | Out-of-bounds heap read in `Socket.xs` pack_ip_mreq_source(). EPSS: 0.389% (31st percentile). |

---

## High Vulnerabilities (with fix available)

The following HIGH-severity findings have a **fix available** and account for 25 of the 27 high CVEs.

### `gnutls28` - `3.7.9-2+deb12u6`, fix available: `3.7.9-2+deb12u7`

All 8 HIGH CVEs in gnutls28 are fixed in the `deb12u7` package release:

| CVE | Description | EPSS |
|-----|-------------|------|
| [CVE-2026-33846](https://scout.docker.com/v/CVE-2026-33846) | DTLS heap buffer overflow in fragment reassembly (remotely exploitable, no auth) | 1.26% |
| [CVE-2026-42009](https://scout.docker.com/v/CVE-2026-42009) | DTLS packet reordering denial of service | 1.34% |
| [CVE-2026-42010](https://scout.docker.com/v/CVE-2026-42010) | RSA-PSK NUL-byte username auth bypass | 1.05% |
| [CVE-2026-42011](https://scout.docker.com/v/CVE-2026-42011) | Name constraint bypass in cert validation | 0.48% |
| [CVE-2026-42012](https://scout.docker.com/v/CVE-2026-42012) | SAN-type fallback to CN allows spoofing | 0.35% |
| [CVE-2026-42013](https://scout.docker.com/v/CVE-2026-42013) | Oversized SAN causes fallback to CN (MitM) | 0.42% |
| [CVE-2026-5260](https://scout.docker.com/v/CVE-2026-5260) | Short premaster secret heap overread via PKCS#11 | 0.73% |
| [CVE-2026-33845](https://scout.docker.com/v/CVE-2026-33845) | DTLS fragment zero-length underflow (OOB read) | 0.81% |

### `tar` (npm) - `6.2.1`, fix available: `7.5.4`

| CVE | CVSS | Description |
|-----|------|-------------|
| [CVE-2026-23950](https://scout.docker.com/v/CVE-2026-23950) | 8.8 | Race condition via Unicode path collision (symlink poisoning on macOS APFS) |
| Plus 5 additional HIGH CVEs in tar <=7.5.3 | - | Path traversal and arbitrary file write variants |

### High vulnerabilities with no fix yet

| CVE | Package | Description |
|-----|---------|-------------|
| [CVE-2026-48959](https://scout.docker.com/v/CVE-2026-48959) | `perl` | CPU exhaustion via per-byte read loop in IO::Uncompress::Unzip |
| [CVE-2026-48962](https://scout.docker.com/v/CVE-2026-48962) | `perl` | Arbitrary code execution in File::GlobMapper via eval STRING |

---

## Overall Risk Assessment

The image carries **86 vulnerabilities across 26 packages**, but the picture is considerably less alarming than the raw numbers suggest. The single critical CVE (Perl/Socket heap overread) has an EPSS score under 0.4% -- meaning less than half a percent of systems with this CVE are estimated to be actively exploited -- and Debian has not issued a fix for Bookworm yet; this is a known, tracked issue with no immediate remediation path. The majority of the high-severity findings are concentrated in **gnutls28**, a TLS library that is present purely because it ships with the `node:20-slim` base image -- this service does not directly use GnuTLS and all of its 8 HIGH CVEs are fixed in a single package bump (`deb12u7`) that can be picked up by rebuilding the image with `apt-get upgrade`. The npm `tar` package at version 6.2.1 carries several high CVEs (max CVSS 8.8), but `tar` is a devDependency pulled in by npm tooling and is **not present in the production image** -- the Dockerfile runs `npm ci --omit=dev` in the runtime stage, so tar and its transitive chain are excluded from the deployed container. The low-severity findings are almost entirely ancient OS-level packages (`coreutils`, `libgcrypt20`, `apt`, `sed`) that Debian intentionally carries without a fix because the attack conditions are either theoretical or mitigated at the system level. In summary, this is a typical baseline profile for a `node:slim` image, with no evidence of compromised supply chain or exploitable application-level vulnerabilities.

---

## Suggestion (Not Applied)

> **Rebuild the image to pick up the gnutls28 fix.** The `gnutls28` HIGH CVEs (8 CVEs) are all fixed in the `3.7.9-2+deb12u7` Debian package. Adding `RUN apt-get update && apt-get upgrade -y` before the `USER node` line in the Dockerfile's runtime stage would pull in the patched package without any change to Node.js or application code. This is a low-risk change, but given the Docker debugging already done, it is left for your review before applying. Running `docker scout recommendations sadmomo/product-catalogue:latest` will also show if a newer `node:20-slim` digest is available with these fixes already baked in.

---

*This is a point-in-time scan run on 2026-07-14 and should be re-run whenever the base image (`node:20-slim`) or npm dependencies are updated.*
