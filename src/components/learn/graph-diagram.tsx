import type { GraphDiagramKind } from '@/lib/learn';

interface GraphDiagramProps {
  kind: GraphDiagramKind;
  title: string;
  description?: string;
}

interface DiagramNode {
  x: number;
  y: number;
  label: string;
  tone?: 'brand' | 'quiet' | 'warm';
}

interface DiagramDefinition {
  nodes: readonly DiagramNode[];
  edges: readonly [number, number][];
  signalNodes?: readonly number[];
}

const diagrams: Record<GraphDiagramKind, DiagramDefinition> = {
  overview: {
    nodes: [
      { x: 90, y: 138, label: 'Concept', tone: 'quiet' },
      { x: 280, y: 72, label: 'Relationship', tone: 'brand' },
      { x: 470, y: 138, label: 'Claim', tone: 'brand' },
      { x: 280, y: 214, label: 'Signal', tone: 'warm' },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [1, 3],
    ],
    signalNodes: [2, 3],
  },
  atom: {
    nodes: [
      { x: 100, y: 140, label: 'Metadata', tone: 'quiet' },
      { x: 320, y: 140, label: 'Atom ID', tone: 'brand' },
      { x: 540, y: 140, label: 'Vault', tone: 'warm' },
    ],
    edges: [
      [0, 1],
      [1, 2],
    ],
    signalNodes: [1],
  },
  triple: {
    nodes: [
      { x: 90, y: 140, label: 'Subject', tone: 'quiet' },
      { x: 320, y: 140, label: 'Predicate', tone: 'brand' },
      { x: 550, y: 140, label: 'Object', tone: 'quiet' },
    ],
    edges: [
      [0, 1],
      [1, 2],
    ],
    signalNodes: [1],
  },
  signal: {
    nodes: [
      { x: 100, y: 140, label: 'Claim', tone: 'brand' },
      { x: 340, y: 76, label: 'Agreement', tone: 'brand' },
      { x: 340, y: 204, label: 'Disagreement', tone: 'warm' },
      { x: 570, y: 140, label: 'Shares', tone: 'quiet' },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
    ],
    signalNodes: [1, 2],
  },
  'use-case': {
    nodes: [
      { x: 80, y: 140, label: 'Problem', tone: 'quiet' },
      { x: 250, y: 140, label: 'Graph model', tone: 'brand' },
      { x: 430, y: 140, label: 'Signal', tone: 'warm' },
      { x: 600, y: 140, label: 'Product', tone: 'brand' },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    signalNodes: [2],
  },
  'read-write': {
    nodes: [
      { x: 90, y: 140, label: 'Search', tone: 'quiet' },
      { x: 275, y: 140, label: 'Resolve IDs', tone: 'brand' },
      { x: 460, y: 76, label: 'Reuse', tone: 'brand' },
      { x: 460, y: 204, label: 'Prepare', tone: 'warm' },
      { x: 630, y: 204, label: 'Simulate', tone: 'quiet' },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
      [3, 4],
    ],
    signalNodes: [1, 4],
  },
  'small-app': {
    nodes: [
      { x: 90, y: 140, label: 'User need', tone: 'quiet' },
      { x: 275, y: 140, label: 'Graph query', tone: 'brand' },
      { x: 460, y: 140, label: 'App state', tone: 'brand' },
      { x: 630, y: 140, label: 'Decision', tone: 'warm' },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    signalNodes: [2],
  },
};

const nodeWidth = 124;
const nodeHeight = 54;

export function GraphDiagram({
  kind,
  title,
  description,
}: GraphDiagramProps) {
  const diagram = diagrams[kind];
  const markerId = 'learn-arrow-' + kind;

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-2xl border border-fd-border bg-fd-card/60">
      <svg
        viewBox="0 0 720 280"
        role="img"
        aria-labelledby={markerId + '-title ' + markerId + '-description'}
        className="h-auto min-h-56 w-full"
      >
        <title id={markerId + '-title'}>{title}</title>
        <desc id={markerId + '-description'}>
          {description ?? 'A semantic Intuition graph diagram.'}
        </desc>
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgb(141 241 201 / 0.5)" />
          </marker>
          <radialGradient id={markerId + '-glow'}>
            <stop offset="0%" stopColor="rgb(141 241 201 / 0.28)" />
            <stop offset="100%" stopColor="rgb(141 241 201 / 0)" />
          </radialGradient>
        </defs>

        <g aria-hidden>
          {diagram.edges.map(([from, to]) => {
            const start = diagram.nodes[from];
            const end = diagram.nodes[to];
            return (
              <line
                key={from + '-' + to}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="rgb(141 241 201 / 0.3)"
                strokeWidth="1.5"
                markerEnd={'url(#' + markerId + ')'}
              />
            );
          })}
          {diagram.signalNodes?.map((index) => {
            const node = diagram.nodes[index];
            return (
              <circle
                key={'signal-' + index}
                cx={node.x}
                cy={node.y}
                r="48"
                fill={'url(#' + markerId + '-glow)'}
                className="learn-graph-pulse"
              />
            );
          })}
        </g>

        {diagram.nodes.map((node, index) => (
          <g
            key={node.label + '-' + index}
            transform={
              'translate(' +
              (node.x - nodeWidth / 2) +
              ' ' +
              (node.y - nodeHeight / 2) +
              ')'
            }
          >
            <rect
              width={nodeWidth}
              height={nodeHeight}
              rx="15"
              fill={
                node.tone === 'brand'
                  ? 'rgb(16 29 24)'
                  : node.tone === 'warm'
                    ? 'rgb(29 28 10)'
                    : 'rgb(18 18 18)'
              }
              stroke={
                node.tone === 'brand'
                  ? 'rgb(141 241 201 / 0.55)'
                  : node.tone === 'warm'
                    ? 'rgb(254 244 44 / 0.35)'
                    : 'rgb(102 102 102 / 0.28)'
              }
            />
            <text
              x={nodeWidth / 2}
              y={nodeHeight / 2 + 5}
              textAnchor="middle"
              fill={
                node.tone === 'brand'
                  ? 'rgb(141 241 201)'
                  : node.tone === 'warm'
                    ? 'rgb(254 244 44)'
                    : 'rgb(235 235 235)'
              }
              fontSize="14"
              fontWeight="600"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="border-t border-fd-border px-5 py-4">
        <p className="m-0 text-sm font-medium text-fd-foreground">{title}</p>
        {description && (
          <p className="mt-1 text-sm leading-6 text-fd-muted-foreground">
            {description}
          </p>
        )}
      </figcaption>
    </figure>
  );
}
