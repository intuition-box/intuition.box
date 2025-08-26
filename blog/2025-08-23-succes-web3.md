---
slug: web3-success-playbook
title: How to Be Successful in Web3
authors: [slorber, yangshun]
tags: [web3, open-source, learning, community, career]
---

> Web3 rewards people who **ship**, **share**, and **iterate in public**.  
> Here’s a tight playbook you can actually follow.

If you only remember three things, make them these:

1. **Build in public**  
2. **Ask for help the right way**  
3. **Don’t get stuck — go get it**

---

## 1) Build in public

**Why it works:** credibility and opportunity in web3 are public-goods. When you share your process, you attract collaborators, reviewers, testers, and—eventually—users.

### What to share
- **Daily or weekly progress notes:** one screenshot, one insight, one next step.
- **Decisions & trade-offs:** why you chose Protocol A over B.
- **Roadmap & scope cuts:** show what you’re not building (yet).
- **Post-mortems:** bugs, gas surprises, RPC issues—teach what bit you.

### Where to share
- GitHub (issues, PRs, Releases)
- Farcaster / X (short progress logs)
- Mirror / blog (long-form writeups)
- Discord / Telegram (feedback loops)
- Testnet links + minimal repro repos

### Minimal cadence (copy this)
- **Ship** something small 2–3×/week.
- **Log** it publicly in ≤ 5 bullets.
- **Ask** for 1 concrete review per week.

:::tip Proof-of-work, not promises
Screenshots, PR links, contracts, and testnet txs beat roadmaps every time.
:::

---

## 2) How to ask for help (so people *want* to help)

**Goal:** make it easy to say “yes” in under 60 seconds.

### Help request checklist
- **Context (1–2 lines):** what you’re building and what you expect to happen.
- **Minimal repro:** link to a tiny repo, gist, or code block. No private monoliths.
- **Exact error or behavior:** paste logs/tx hash, include network (testnet/mainnet).
- **What you tried:** 3 bullets max (docs you read, flags you flipped).
- **The question:** one sentence. (“How do I sign typed data with wagmi v2?”)

### Pasteable template
```text
**What I’m building:** <one-liner>
**Problem:** <expected vs actual, with version numbers>
**Minimal repro:** <link to small repo/gist + steps to run>
**Tried:** 1) ... 2) ... 3) ...
**Question:** <one clear ask>
**Environment:** Node x.y, <chain>, <lib versions>
