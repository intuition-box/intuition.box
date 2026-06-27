"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { Search, Play, BookOpen } from 'lucide-react';
export type Tutorial = {
  url: string;
  data: {
    title: string;
    description?: string;
    category?: string;
    tags?: string[];
    youtube_id?: string;
  };
};

export function LearnClient({ tutorials }: { tutorials: Tutorial[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filteredTutorials = useMemo(() => {
    let result = tutorials;

    // Filter by Category
    if (category !== 'all') {
      result = result.filter(t => {
        const cat = ((t.data.category as string) || 'tutorial').toLowerCase();
        return cat === category;
      });
    }

    // Filter by Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t => {
        return t.data.title.toLowerCase().includes(q) || 
               (t.data.description && t.data.description.toLowerCase().includes(q)) ||
               (t.data.tags && (t.data.tags as string[]).some(tag => tag.toLowerCase().includes(q)));
      });
    }

    return result;
  }, [tutorials, search, category]);

  return (
    <>
      {/* Header Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-16 pb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-fd-foreground mb-3">Learn</h1>
        <p className="text-xl text-fd-muted-foreground mb-12">Step-by-step tutorials and interactive guides.</p>
        
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fd-muted-foreground" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search in learn..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-fd-border bg-fd-background text-sm focus:outline-none focus:ring-2 focus:ring-fd-primary transition-all"
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto bg-fd-muted/50 p-1 rounded-xl">
            {['all', 'tutorial', 'workshop'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
                  category === cat 
                    ? "bg-fd-background text-fd-foreground shadow-sm" 
                    : "text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-background/50"
                )}
              >
                {cat === 'all' ? 'All' : cat + 's'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 pb-16">
        {filteredTutorials.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-fd-border rounded-2xl">
            <p className="text-fd-muted-foreground">No content found. Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map((post) => {
              const cat = (post.data.category as string) || 'Tutorial'; 
              const isWorkshop = cat.toLowerCase() === 'workshop';
              
              const allTags = (post.data.tags as string[]) || [];
              const displayTags = allTags.slice(0, 3);
              
              return (
                <Link key={post.url} href={post.url} className="group no-underline outline-none">
                  <article className="flex flex-col h-full bg-fd-card rounded-2xl border border-fd-border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.04)] focus-visible:ring-2 focus-visible:ring-fd-primary">
                    
                    {/* Thumbnail Area */}
                    <div className="aspect-[16/9] w-full bg-fd-muted relative overflow-hidden">
                      {post.data.youtube_id ? (
                        <>
                          {/* YouTube Thumbnail */}
                          <img 
                            src={`https://img.youtube.com/vi/${post.data.youtube_id}/hqdefault.jpg`} 
                            alt={post.data.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {/* Subtle overlay to make it look cohesive */}
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        </>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-fd-primary/10 to-fd-accent/20 group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-30 text-fd-primary">
                            {isWorkshop ? <Play className="w-12 h-12" /> : <BookOpen className="w-12 h-12" />}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      {/* Tags Row */}
                      {displayTags.length > 0 && (
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          {displayTags.map((tag, idx) => (
                            <span key={idx} className="text-[11px] font-medium text-fd-muted-foreground bg-fd-secondary px-2 py-1 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h2 className="text-lg font-bold text-fd-foreground mb-2 group-hover:text-fd-primary transition-colors line-clamp-2">
                        {post.data.title}
                      </h2>

                      {/* Description */}
                      {post.data.description && (
                        <p className="text-sm text-fd-muted-foreground line-clamp-2 mb-4 flex-1">
                          {post.data.description}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="pt-4 mt-auto border-t border-fd-border/50 flex items-center justify-between text-sm text-fd-muted-foreground font-medium">
                        {/* Category Pill */}
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide",
                          isWorkshop 
                            ? "bg-orange-500/10 text-orange-600 dark:text-orange-400" 
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        )}>
                          {cat}
                        </span>

                        {/* CTA & Arrow */}
                        <div className="flex items-center gap-2 group-hover:text-fd-primary transition-colors">
                          <span className="text-xs font-semibold">{isWorkshop ? 'Watch' : 'Read'}</span>
                          <div className="w-6 h-6 rounded-full bg-fd-accent flex items-center justify-center group-hover:bg-fd-primary group-hover:text-fd-primary-foreground transition-colors">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
