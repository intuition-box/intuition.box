'use client';

import { Badge } from '@waveso/ui/badge';
import { Button } from '@waveso/ui/button';
import { Masonry, MasonryItem } from '@waveso/ui/masonry';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  getCardColumnWidth,
} from '@/components/card';
import {
  ExternalLink,
  Clock,
  CheckCircle,
  Zap,
  CircleDashed,
  PlayCircle,
  Eye,
  CreditCard,
} from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import type { Mission } from '@/lib/github/fetch-missions-data';
import { MISSIONS_PROJECT_URL } from '@/lib/github/constants';

type BadgeVariant = ComponentProps<typeof Badge>['variant'];

interface StatusToken {
  variant: BadgeVariant;
  icon: ReactNode;
}

const STATUS_TOKENS: Record<string, StatusToken> = {
  Ideas: { variant: 'secondary', icon: <Zap className="size-3" /> },
  Backlog: { variant: 'outline', icon: <CircleDashed className="size-3" /> },
  'Application open': { variant: 'success', icon: <Clock className="size-3" /> },
  'In progress': { variant: 'warning', icon: <PlayCircle className="size-3" /> },
  'In review': { variant: 'default', icon: <Eye className="size-3" /> },
  'Pending Payment': { variant: 'warning', icon: <CreditCard className="size-3" /> },
  Paid: { variant: 'success', icon: <CheckCircle className="size-3" /> },
};

function getStatusToken(status: string): StatusToken {
  return STATUS_TOKENS[status] ?? { variant: 'secondary', icon: <Clock className="size-3" /> };
}

interface MissionsGridProps {
  missions: Mission[];
}

export function MissionsGrid({ missions }: MissionsGridProps) {
  return (
    <Masonry columnWidth={getCardColumnWidth('default')} gap={6}>
      {missions.map((mission) => {
        const status = getStatusToken(mission.status);
        // Prefer the actual issue URL; fall back to the project-board pane
        // when GitHub didn't return a content URL (drafts have none).
        const href =
          mission.url ??
          `${MISSIONS_PROJECT_URL}?pane=issue&itemId=${mission.databaseId ?? mission.id}`;

        return (
          <MasonryItem key={mission.id}>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={status.variant} className="gap-1">
                    {status.icon}
                    {mission.status}
                  </Badge>
                  {mission.priority && (
                    <Badge variant="outline">{mission.priority}</Badge>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight mt-2">
                  {mission.title}
                </CardTitle>
              </CardHeader>

              {(mission.body || mission.labels.length > 0) && (
                <CardContent className="flex flex-col gap-3">
                  {mission.body && (
                    <p className="text-sm text-fd-muted-foreground line-clamp-3 m-0">
                      {mission.body}
                    </p>
                  )}
                  {mission.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {mission.labels.slice(0, 3).map((label) => (
                        <Badge key={label.name} variant="outline">
                          {label.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}

              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  render={
                    <a href={href} target="_blank" rel="noopener noreferrer" />
                  }
                >
                  <ExternalLink className="size-4 mr-2" />
                  {mission.url ? 'View Issue' : 'View on Project Board'}
                </Button>
              </CardFooter>
            </Card>
          </MasonryItem>
        );
      })}
    </Masonry>
  );
}
