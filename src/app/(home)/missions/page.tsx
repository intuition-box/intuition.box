import { Button } from '@waveso/ui/button';
import { Card, CardContent } from '@waveso/ui/card';
import { ExternalLink, Clock, CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';
import { GRANTS_URL } from '@/lib/github/constants';
import { fetchMissionsData, type Mission } from '@/lib/github/fetch-missions-data';

// Status badge styling
function getStatusBadge(status: string) {
  const statusColors = {
    'Ideas': 'bg-gray-100 text-gray-800',
    'Backlog': 'bg-blue-100 text-blue-800',
    'Application open': 'bg-green-100 text-green-800',
    'In progress': 'bg-yellow-100 text-yellow-800',
    'In review': 'bg-purple-100 text-purple-800',
    'Pending Payment': 'bg-orange-100 text-orange-800',
    'Paid': 'bg-emerald-100 text-emerald-800'
  };

  return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
}

// Status icon
function getStatusIcon(status: string) {
  switch (status) {
    case 'Ideas':
      return <Zap className="size-4" />;
    case 'Application open':
      return <Clock className="size-4" />;
    case 'In progress':
      return <Clock className="size-4" />;
    case 'Paid':
      return <CheckCircle className="size-4" />;
    default:
      return <Clock className="size-4" />;
  }
}

export default async function MissionsPage() {
  const missions = await fetchMissionsData();

  // Filter for open missions by default
  const openMissions = missions.filter(mission =>
    ['Ideas', 'Backlog', 'Application open', 'In progress'].includes(mission.status)
  );

  // Check if we're using fallback data (indicated by fallback-* ids)
  const usingFallbackData = missions.some(mission => mission.id.startsWith('fallback-'));

  return (
    <div className="min-h-screen bg-gradient-to-b from-fd-background to-fd-muted/20">
      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto py-16 px-8 text-center">
        <h1 className="text-5xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-linear-[103deg] from-fd-primary from-15% to-fd-muted-foreground to-85%">
          Missions
        </h1>
        <p className="text-lg text-fd-muted-foreground max-w-2xl mx-auto mb-8">
          Open contributions that serve the whole builder community
        </p>
      </section>

      {/* Notice for fallback data */}
      {usingFallbackData && (
        <section className="max-w-6xl mx-auto px-8 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p>
              📡 <strong>Demo Mode:</strong> Showing example missions. To display live data from GitHub, set up a GITHUB_TOKEN environment variable.
            </p>
          </div>
        </section>
      )}

      {/* Missions Grid */}
      <section className="max-w-6xl mx-auto py-8 px-8">
        {openMissions.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Available Missions</h2>
              <div className="text-sm text-fd-muted-foreground">
                {openMissions.length} mission{openMissions.length !== 1 ? 's' : ''} available
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {openMissions.map((mission) => (
                <Card key={mission.id} className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`${getStatusBadge(mission.status)} flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium`}
                      >
                        {getStatusIcon(mission.status)}
                        {mission.status}
                      </div>
                      {mission.priority && (
                        <div className="text-xs border border-fd-border rounded-md px-2 py-1 font-medium">
                          {mission.priority}
                        </div>
                      )}
                    </div>

                    <h3 className="font-semibold text-lg mb-3 leading-tight">
                      {mission.title}
                    </h3>

                    {mission.body && (
                      <p className="text-sm text-fd-muted-foreground mb-4 line-clamp-3 flex-grow">
                        {mission.body.slice(0, 150)}...
                      </p>
                    )}

                    {mission.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {mission.labels.slice(0, 3).map((label) => (
                          <div key={label.name} className="text-xs border border-fd-border rounded-md px-2 py-1 font-medium">
                            {label.name}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto">
                      {mission.url ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          render={<a href={mission.url} target="_blank" rel="noopener noreferrer" />}
                        >
                          <ExternalLink className="size-4 mr-2" />
                          View on GitHub
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full" disabled>
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">No Missions Available</h2>
            <p className="text-fd-muted-foreground mb-6">
              Check back soon for new missions or explore other opportunities.
            </p>
            <Button
              variant="outline"
              render={<a href={GRANTS_URL} target="_blank" rel="noopener noreferrer" />}
            >
              Explore Grants Instead
            </Button>
          </div>
        )}
      </section>

      {/* CTAs Section */}
      <section className="max-w-5xl mx-auto py-16 px-8">
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">How do missions work?</h3>
              <p className="text-sm text-fd-muted-foreground mb-4">
                Learn about our mission process, rewards, and how to get started.
              </p>
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/docs" />}
              >
                Read Documentation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Looking for bigger scope?</h3>
              <p className="text-sm text-fd-muted-foreground mb-4">
                Apply for grants with larger rewards and longer-term projects.
              </p>
              <Button
                variant="outline"
                size="sm"
                render={<a href={GRANTS_URL} target="_blank" rel="noopener noreferrer" />}
              >
                View Grants
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Have an idea?</h3>
              <p className="text-sm text-fd-muted-foreground mb-4">
                Submit your own mission ideas to help grow the ecosystem.
              </p>
              <Button
                variant="outline"
                size="sm"
                render={<a href="https://github.com/orgs/intuition-box/projects/21" target="_blank" rel="noopener noreferrer" />}
              >
                Propose Mission
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}