# intuition.box

The community hub for [Intuition Box DAO](https://intuition.box) — governance, treasury, missions, and builder ecosystem built on the [Intuition](https://intuition.systems) trust layer.

## Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Content:** [Fumadocs](https://fumadocs.dev) with MDX collections
- **UI:** [@waveso/ui](https://github.com/waveso/ui) + [Tailwind CSS](https://tailwindcss.com)
- **Data:** GitHub Projects API (missions), ICS calendar feed (events)

## Getting Started

```bash
# Clone
git clone https://github.com/intuition-box/intuition.box.git
cd intuition.box

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your GITHUB_TOKEN to .env

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/
│   ├── (home)/          # Landing page, blog, missions
│   ├── docs/            # Documentation pages
│   └── api/search/      # Search API route
├── components/
│   ├── github/galaxy/   # Contributor galaxy visualization
│   ├── events/          # Community calendar
│   └── backgrounds/     # Visual effects (dark veil, iridescence)
├── lib/
│   ├── github/          # GitHub API client & data fetching
│   ├── calendar/        # ICS calendar parsing
│   └── source.ts        # Fumadocs content source adapter
content/
├── docs/                # Documentation (MDX)
└── blog/                # Blog posts (MDX)
```

## Key Features

- **Missions Board** — GitHub Projects integration showing available bounties, applications, and rewards
- **Contributor Galaxy** — Interactive visualization of the builder network
- **Community Calendar** — Weekly event grid parsed from ICS feeds
- **Documentation** — DAO governance, FAQ, and mission guides
- **Blog** — Ecosystem updates and grant announcements

## Content

Documentation and blog posts live in `content/` as MDX files. See [Fumadocs docs](https://fumadocs.dev/docs/mdx) for authoring guides.

## Links

- [Intuition Portal](https://portal.intuition.systems)
- [Governance Forum](https://atlas.discourse.group/c/governance/intuition-box/35)
- [Grant Applications](https://atlas.discourse.group/c/ecosystem-development/grant-applications/36)
- [Mission Board](https://github.com/orgs/intuition-box/projects/21)
- [Discord](https://discord.gg/0xintuition)

## License

See [LICENSE](./LICENSE) for details.
