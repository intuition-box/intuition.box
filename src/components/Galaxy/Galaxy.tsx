import React, { useEffect, useMemo, useState } from "react";
import GalaxyBackground from "./GalaxyBackground";
import styles from "./Galaxy.module.css";
import ContributorCards from "./ContributorCards";
import CommitsOrbit from "./Commits";
import type { Commit as CommitOrbitType } from "./Commits";
import ProjectsOrbit, { Project as ProjectFull } from "./ProjectsOrbit";
import ProjectCard from "./ProjectCard";
import { fetchHybridActivity, HybridResult } from "../../utils/gitActivity";
import MobileBottomSheet from "./MobileBottomSheet";

const ORG = "intuition-box";

type ContributorCardItem = {
  id: string;
  summary: string;
  projects?: (string | { id: string; name: string; url?: string })[];
  onClick?: () => void;
  avatarUrl?: string;
  profileUrl?: string;
};
type CommitItem = CommitOrbitType;

const participantColors = ["#ffb4b4","#a7d8ff","#c7a7ff","#94e2c4","#ffe4a7","#ffa7d6","#aef3e3","#ffc7a7"];
const projectColors = ["#01c3a8","#ffb741","#a63d2a","#1890ff","#8a55e6","#f56c6c"];
const commitColors = participantColors;

export default function Galaxy() {
  const [data, setData] = useState<HybridResult | null>(null);

  const [activeContrib, setActiveContrib] =
    useState<ContributorCardItem | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const res = await fetchHybridActivity(ORG, {
        repoLimit: 6,
        perRepoCommitList: 2,
      });
      if (!cancel) setData(res);
    })();
    return () => { cancel = true; };
  }, []);

  const contributorsByLogin = useMemo(() => {
    const m = new Map<string, { avatarUrl?: string; last?: Date }>();
    (data?.contributors ?? []).forEach((c) => {
      m.set(c.login, { avatarUrl: c.avatarUrl, last: c.date });
    });
    return m;
  }, [data]);

  const perRepoAuthors = useMemo(() => {
    const map = new Map<
      string,
      Array<{ login: string; avatarUrl?: string; last?: Date }>
    >();
    if (data?.commits?.length) {
      const groups = new Map<
        string,
        Map<string, { login: string; avatarUrl?: string; last: Date }>
      >();
      for (const c of data.commits) {
        const repo = c.repo;
        if (!repo || !c.author || !c.date) continue;
        const login = c.author;
        const last = c.date;
        const avatarUrl = contributorsByLogin.get(login)?.avatarUrl;
        const g = groups.get(repo) ?? new Map();
        groups.set(repo, g);
        const prev = g.get(login);
        if (!prev || (prev.last?.getTime() ?? 0) < last.getTime())
          g.set(login, { login, avatarUrl, last });
      }
      for (const [repo, g] of groups) {
        const arr = Array.from(g.values()).sort(
          (a, b) => (b.last?.getTime() ?? 0) - (a.last?.getTime() ?? 0)
        );
        map.set(repo, arr);
      }
      return map;
    }
    if (data?.contributorProjects) {
      const inverse = new Map<string, Set<string>>();
      Object.entries(data.contributorProjects).forEach(([login, repos]) => {
        repos.forEach((repo) => {
          const set = inverse.get(repo) ?? new Set<string>();
          set.add(login);
          inverse.set(repo, set);
        });
      });
      for (const [repo, logins] of inverse) {
        const arr = Array.from(logins)
          .map((login) => {
            const info = contributorsByLogin.get(login);
            return { login, avatarUrl: info?.avatarUrl, last: info?.last };
          })
          .sort((a, b) => (b.last?.getTime() ?? 0) - (a.last?.getTime() ?? 0));
        map.set(repo, arr);
      }
    }
    return map;
  }, [data, contributorsByLogin]);

  const contribItems: ContributorCardItem[] = useMemo(() => {
    const src = data?.contributors ?? [];
    const map = data?.contributorProjects ?? {};
    return src.map((c) => {
      const login = c.login;
      const projs = (map[login] || []).slice(0, 6).map((name: string) => ({
        id: name,
        name,
        url: `https://github.com/${ORG}/${name}`,
      }));
      return {
        id: login,
        summary: `Last activity: ${c.date.toISOString().slice(0,10)}`,
        projects: projs,
        avatarUrl: c.avatarUrl,
        profileUrl: `https://github.com/${login}`,
        onClick: () => window.open(`https://github.com/${login}`, "_blank", "noopener,noreferrer"),
      };
    });
  }, [data]);

  const projects: ProjectFull[] = useMemo(() => {
    const src = (data?.projects ?? []).slice(0, 6);
    return src.map((p: any, i: number) => {
      const repoName: string = p.name;
      const authors = perRepoAuthors.get(repoName) ?? [];
      return {
        id: repoName,
        title: repoName,
        desc: "",
        color: projectColors[i % projectColors.length],
        date: (p.updatedAt || p.pushedAt || p.date || new Date()).toString(),
        url: p.htmlUrl || `https://github.com/${ORG}/${repoName}`,
        category: "",
        participants: authors.slice(0, 4).map((c, j) => ({
          name: c.login,
          color: participantColors[j % participantColors.length],
          avatarUrl: c.avatarUrl,
        })),
      };
    });
  }, [data, perRepoAuthors]);

  const commits: CommitItem[] = useMemo(() => {
    type RawCommit = {
      id?: string;
      sha?: string;
      message?: string;
      htmlUrl?: string;
      url?: string;
      commitUrl?: string;
      repo?: string;
      date?: Date;
      author?: string;
    };
    const raw: RawCommit[] =
      (data as any)?.recentCommits ?? (data as any)?.commits ?? [];
    const out: CommitItem[] = [];
    for (let i = 0; i < Math.min(raw.length, 8); i++) {
      const c = raw[i];
      const sha = c.sha ?? c.id ?? "";
      const url =
        c.htmlUrl ??
        c.url ??
        c.commitUrl ??
        (sha && c.repo ? `https://github.com/${ORG}/${c.repo}/commit/${sha}` : undefined);

      if (!url) continue;

      out.push({
        id: sha || `c-${i}`,
        name: sha ? sha.slice(0, 7) : c.message?.slice(0, 7) ?? "commit",
        url,
        color: commitColors[i % commitColors.length],
      });
    }
    return out;
  }, [data]);

  return (
    <div className={`${styles.galaxyWrapper} galaxy-scope`}>
      <GalaxyBackground title="INTUITION.BOX" />

      <ContributorCards items={contribItems} onAvatarOpen={setActiveContrib} />

      {commits.length > 0 && <CommitsOrbit commits={commits} />}
      <ProjectsOrbit projects={projects} />
      <ProjectCard projects={projects} />

      <MobileBottomSheet
        open={!!activeContrib}
        onClose={() => setActiveContrib(null)}
        borderColor="#5ec2e7"
        title={activeContrib?.id}
        headerSlot={
          activeContrib && (
            <>
              <div className="slotAvatar">
                {activeContrib.avatarUrl ? (
                  <img src={activeContrib.avatarUrl} alt="" />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {activeContrib.id?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
              </div>
              <div className="slotText">
                <div className="slotName">{activeContrib.id}</div>
                <div className="slotSub">
                  Last activity:{" "}
                  {activeContrib.summary?.replace(/^Last activity:\s*/i, "")}
                </div>
              </div>
            </>
          )
        }
      >
        {activeContrib && (
          <div style={{ display: "grid", gap: 12 }}>
            {activeContrib.projects?.length ? (
              <div>
                <div style={{ fontWeight: 600, margin: "6px 0" }}>Projects</div>
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "grid",
                    gap: 8,
                  }}
                >
                  {activeContrib.projects.slice(0, 8).map((p, i) => {
                    const name = typeof p === "string" ? p : p.name;
                    const url = typeof p === "string" ? undefined : p.url;
                    return (
                      <li
                        key={`${name}-${i}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 4,
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.05))",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
                            flex: "0 0 auto",
                          }}
                        />
                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            {name}
                          </a>
                        ) : (
                          <span>{name}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div style={{ opacity: 0.75 }}>No recent project found</div>
            )}

            {activeContrib.profileUrl && (
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <a
                  href={activeContrib.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,.12)",
                    textDecoration: "none",
                  }}
                >
                  View GitHub
                </a>
              </div>
            )}
          </div>
        )}
      </MobileBottomSheet>

      {data?.error && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            fontSize: 12,
            opacity: 0.7,
          }}
        >
          {data.error}
        </div>
      )}
    </div>
  );
}
