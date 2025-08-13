import React from "react";
import SciFiPanel from "./SciFiPanel";
import styles from "./WhyPanel.module.css";

const CHECK_ITEMS: string[] = [
  "Shared inventory & access to digital fabrication tools",
  "Safety: protect people & machines",
  "Operations: clean, maintain, improve",
  "Knowledge: document & share",
  "Able to make (almost) anything",
  "Network assistance: operational, educational, technical, financial & logistical",
  "Commercial use: prototype without disrupting & grow beyond the lab",
  "+ 12 other conditions of the FabLab Charter",
];

export default function WhyPanel() {
  return (
    <SciFiPanel variant="large">
      <h2>WHY FABLAB ?</h2>

      <div className={styles.grid}>
        {/* Left : Charter */}
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Context & Origin</h3>
          <p className={styles.cardIntro}>The FabLab Charter</p>

          <div className={styles.correction} aria-live="polite">
            <div className={styles.correctionLabel}>Global network of</div>

            <div className={styles.swap}>
              <div className={styles.badRow}>
                <span className={styles.inlineCross} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <rect
                      x="2.5"
                      y="2.5"
                      width="19"
                      height="19"
                      rx="6"
                      className={styles.iconBoxBad}
                    />
                    <path d="M8 8l8 8M16 8l-8 8" className={styles.iconCross} />
                  </svg>
                </span>
                <span className={styles.bodyFont}>local labs</span>
                <i className={styles.strikeLine} aria-hidden="true" />
              </div>

              <div className={styles.goodRow}>
                <span className={styles.inlineCheck} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <rect
                      x="2.5"
                      y="2.5"
                      width="19"
                      height="19"
                      rx="6"
                      className={styles.iconBox}
                    />
                    <path d="M6 12.5l4 4 8-9" className={styles.iconTick} />
                  </svg>
                </span>
                <span className={styles.bodyFont}>
                  online and decentralized labs
                </span>
              </div>
            </div>
          </div>

          <ul className={styles.checklist}>
            {CHECK_ITEMS.map((txt, i) => (
              <li className={styles.checkItem} key={i}>
                <span className={styles.checkIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <rect
                      x="2.5"
                      y="2.5"
                      width="19"
                      height="19"
                      rx="6"
                      className={styles.iconBox}
                    />
                    <path d="M6 12.5l4 4 8-9" className={styles.iconTick} />
                  </svg>
                </span>
                <span className={styles.checkLabel}>{txt}</span>
              </li>
            ))}
          </ul>
          <button className={styles.manifestoBtn}>
            Read the FabLab.b0x Manifesto
          </button>
        </section>

        {/* Right : Org values */}
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Our Values</h3>
          <p className={styles.cardIntro}>Ethereum org values exemple</p>

          <div className={styles.accordion}>
            <details className={styles.accordionItem} open>
              <summary className={styles.accordionSummary}>
                Decentralization
                <div className={styles.voteSummary}>
                  <div className={`${styles.voteMini} ${styles.voteFor}`}>
                    <div className={styles.voteMiniIcon}>
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="6" r="3" fill="var(--icon-color)" />
                        <path
                          d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                          fill="var(--icon-color)"
                        />
                      </svg>
                    </div>
                    <span className={styles.voteMiniNumber}>1672</span>
                  </div>
                  <div className={`${styles.voteMini} ${styles.voteAgainst}`}>
                    <div className={styles.voteMiniIcon}>
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="6" r="3" fill="var(--icon-color)" />
                        <path
                          d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                          fill="var(--icon-color)"
                        />
                      </svg>
                    </div>
                    <span className={styles.voteMiniNumber}>245</span>
                  </div>
                </div>
              </summary>
              <p className={styles.accordionBody}>
                Decentralization is viewed as essential to preventing
                censorship, increasing transparency, and creating more resilient
                systems. It’s a response to centralized systems that can be
                manipulated, controlled, or restricted by governments or large
                entities.
              </p>
            </details>

            <details className={styles.accordionItem}>
              <summary className={styles.accordionSummary}>
                Innovation and Experimentation
                <div className={styles.voteSummary}>
                  <div className={`${styles.voteMini} ${styles.voteFor}`}>
                    <div className={styles.voteMiniIcon}>
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="6" r="3" fill="var(--icon-color)" />
                        <path
                          d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                          fill="var(--icon-color)"
                        />
                      </svg>
                    </div>
                    <span className={styles.voteMiniNumber}>1672</span>
                  </div>
                  <div className={`${styles.voteMini} ${styles.voteAgainst}`}>
                    <div className={styles.voteMiniIcon}>
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="6" r="3" fill="var(--icon-color)" />
                        <path
                          d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                          fill="var(--icon-color)"
                        />
                      </svg>
                    </div>
                    <span className={styles.voteMiniNumber}>245</span>
                  </div>
                </div>
              </summary>
              <p className={styles.accordionBody}>
                The Ethereum community fosters a culture of experimentation and
                continuous improvement that embraces cutting-edge technologies.
                Ethereum values technical progress and disruption, welcoming new
                ideas that challenge traditional systems. Developers can
                experiment with innovative financial products and money legos,
                governance systems, and even new social structures.
              </p>
            </details>

            <details className={styles.accordionItem}>
              <summary className={styles.accordionSummary}>
                Community and Collaboration
                <div className={styles.voteSummary}>
                  <div className={`${styles.voteMini} ${styles.voteFor}`}>
                    <div className={styles.voteMiniIcon}>
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="6" r="3" fill="var(--icon-color)" />
                        <path
                          d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                          fill="var(--icon-color)"
                        />
                      </svg>
                    </div>
                    <span className={styles.voteMiniNumber}>1672</span>
                  </div>
                  <div className={`${styles.voteMini} ${styles.voteAgainst}`}>
                    <div className={styles.voteMiniIcon}>
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="6" r="3" fill="var(--icon-color)" />
                        <path
                          d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                          fill="var(--icon-color)"
                        />
                      </svg>
                    </div>
                    <span className={styles.voteMiniNumber}>245</span>
                  </div>
                </div>
              </summary>
              <p className={styles.accordionBody}>
                Collaboration is seen in the various Ethereum Improvement
                Proposals (EIPs), as well as governance via All Core Devs (ACD)
                calls and the various research forums and grants programs. The
                community continually engages in public discussions to shape the
                future of the protocol, creating a shared vision and sense of
                responsibility.
              </p>
            </details>

            <details className={styles.accordionItem}>
              <summary className={styles.accordionSummary}>
                Economic Inclusivity and Empowerment
                <div className={styles.voteSummary}>
                  <div className={`${styles.voteMini} ${styles.voteFor}`}>
                    <div className={styles.voteMiniIcon}>
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="6" r="3" fill="var(--icon-color)" />
                        <path
                          d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                          fill="var(--icon-color)"
                        />
                      </svg>
                    </div>
                    <span className={styles.voteMiniNumber}>1672</span>
                  </div>
                  <div className={`${styles.voteMini} ${styles.voteAgainst}`}>
                    <div className={styles.voteMiniIcon}>
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="6" r="3" fill="var(--icon-color)" />
                        <path
                          d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                          fill="var(--icon-color)"
                        />
                      </svg>
                    </div>
                    <span className={styles.voteMiniNumber}>245</span>
                  </div>
                </div>
              </summary>
              <p className={styles.accordionBody}>
                Ethereum’s ecosystem, particularly DeFi, aims to create a more
                inclusive financial system. It opens access to financial
                services for individuals and regions that might be underserved
                or excluded by traditional banking systems. Ethereum allows
                people to engage in lending, borrowing, trading, and saving
                without the need for intermediaries.
              </p>
            </details>

            <details className={styles.accordionItem}>
              <summary className={styles.accordionSummary}>
                Resilience and Antifragility
                <div className={styles.voteSummary}>
                  <div className={`${styles.voteMini} ${styles.voteFor}`}>
                    <div className={styles.voteMiniIcon}>
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="6" r="3" fill="var(--icon-color)" />
                        <path
                          d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                          fill="var(--icon-color)"
                        />
                      </svg>
                    </div>
                    <span className={styles.voteMiniNumber}>1672</span>
                  </div>
                  <div className={`${styles.voteMini} ${styles.voteAgainst}`}>
                    <div className={styles.voteMiniIcon}>
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="6" r="3" fill="var(--icon-color)" />
                        <path
                          d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                          fill="var(--icon-color)"
                        />
                      </svg>
                    </div>
                    <span className={styles.voteMiniNumber}>245</span>
                  </div>
                </div>
              </summary>
              <p className={styles.accordionBody}>
                Ethereum values the idea of resilience, both in terms of its
                technology and the community that supports it. By designing a
                network that can withstand attacks, failures, and external
                pressures, Ethereum emphasizes robustness.
              </p>
            </details>
          </div>
        </section>
      </div>
    </SciFiPanel>
  );
}
