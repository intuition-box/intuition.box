import React, { useEffect, useMemo, useState } from "react";
import GalaxyBackground from "./GalaxyBackground";
import styles from "./Galaxy.module.css";
import ContributorCards from "./ContributorCards";
import CommitsOrbit from "./Commits";
import type { Commit as CommitOrbitType } from "./Commits";
import ProjectsOrbit, { Project as ProjectFull } from "./ProjectsOrbit";
import ProjectCard from "./ProjectCard";
import { fetchHybridActivity, HybridResult } from "../../utils/gitActivity";

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

  useEffect(() => {
    let cancel = false;
    (async () => {
      const res = await fetchHybridActivity(ORG, { repoLimit: 6, perRepoCommitList: 2 });
      if (!cancel) setData(res);
    })();
    return () => { cancel = true; };
  }, []);

  // Contributeurs
  const contribItems: ContributorCardItem[] = useMemo(() => {
    const src = data?.contributors ?? [];
    const map = data?.contributorProjects ?? {};
    return src.map(c => {
      const login = c.login;
      const projs = (map[login] || []).slice(0, 6).map((name: string) => ({
        id: name,
        name,
        url: `https://github.com/${ORG}/${name}`
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
    return src.map((p: any, i: number) => ({
      id: p.name,
      title: p.name,
      desc: "",
      color: projectColors[i % projectColors.length],
      date: (p.updatedAt || p.pushedAt || new Date()).toString(),
      url: p.htmlUrl || `https://github.com/${ORG}/${p.name}`,
      category: "",
      participants: (p.topContributors ?? data?.contributors ?? []).slice(0, 4).map((c: any, j: number) => ({
        name: c.login,
        color: participantColors[j % participantColors.length],
        avatarUrl: c.avatarUrl
      })),
    }));
  }, [data]);

  const commits: CommitItem[] = useMemo(() => {
    type RawCommit = {
      id?: string; sha?: string; message?: string;
      htmlUrl?: string; url?: string; commitUrl?: string;
      repo?: string;
    };

    const raw: RawCommit[] =
      (data as any)?.recentCommits ??
      (data as any)?.commits ??
      [];

    // 🔒 Pas de fallback: on ne garde QUE ceux avec URL
    const out: CommitItem[] = [];
    for (let i = 0; i < Math.min(raw.length, 8); i++) {
      const c = raw[i];
      const sha = c.sha ?? c.id ?? "";
      const url =
        c.htmlUrl ??
        c.url ??
        c.commitUrl ??
        (sha && c.repo ? `https://github.com/${ORG}/${c.repo}/commit/${sha}` : undefined);

      if (!url) continue; // ⚡️ skip si pas d’URL

      out.push({
        id: sha || `c-${i}`,
        name: sha ? sha.slice(0, 7) : (c.message?.slice(0, 7) ?? "commit"),
        url,
        color: commitColors[i % commitColors.length],
      });
    }
    return out;
  }, [data]);

  return (
    <div className={`${styles.galaxyWrapper} galaxy-scope`}>
      <GalaxyBackground title="INTUITION.BOX" />
      <ContributorCards items={contribItems} />
      {commits.length > 0 && <CommitsOrbit commits={commits} />}
      <ProjectsOrbit projects={projects} />
      <ProjectCard projects={projects} />
      {data?.error && (
        <div style={{position:"absolute", bottom: 8, left: 8, fontSize: 12, opacity:.7}}>
          {data.error}
        </div>
      )}
    </div>
  );
}
