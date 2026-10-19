import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

// Tells Next.js not to statically prerender this dynamic database page
export const instant = false;

export default async function HomePage() {
  // Fetch all published posts, ordering by newest first
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      excerpt,
      created_at,
      categories!inner(name, slug)
    `)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(12);

  // Force TypeScript to ignore Supabase's strict type inference
  const posts = data as any[] | null;

  if (error) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="p-4 bg-red-950/50 border border-red-800 rounded-lg text-red-200">
          <h2 className="font-bold mb-1">Database Connection Error</h2>
          <p className="text-sm">{error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 md:py-16">
      {/* Editorial Hero Section */}
      <div className="text-center mb-14 border-b border-slate-800/80 pb-12 pt-4">
        {/* Live Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-md shadow-lg shadow-emerald-950/50">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Tech &amp; Gaming Feed
        </div>

        {/* Dual-Tone Neon Gradient Title */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 drop-shadow-sm">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-emerald-400">
            Ping
          </span>{" "}
          <span className="text-slate-600 font-light">&amp;</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Pixels
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
          The latest in gaming news, patch notes, and hardware breakdowns.
        </p>
      </div>

      {/* Mixed Post Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts?.map((post: any) => {
          const category = post.categories as any;
          const isGaming = category?.slug === "gaming";

          return (
            <article
              key={post.id}
              className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm backdrop-blur-sm"
            >
              <div>
                {/* Category Badge & Date */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                      isGaming
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50"
                        : "bg-cyan-950/60 text-cyan-400 border border-cyan-800/50"
                    }`}
                  >
                    {category?.name}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Title & Excerpt */}
                <h2 className="text-xl font-bold text-slate-100 mb-3 hover:text-emerald-400 transition-colors leading-snug">
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-sm text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              {/* Read More Link */}
              <Link
                href={`/posts/${post.slug}`}
                className="text-sm font-semibold text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 transition-colors group"
              >
                Read Article
                <span
                  aria-hidden="true"
                  className="group-hover:translate-x-0.5 transition-transform"
                >
                  &rarr;
                </span>
              </Link>
            </article>
          );
        })}
      </div>

      {/* Empty State */}
      {posts?.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
          No posts published yet. Time to start writing!
        </div>
      )}
    </main>
  );
}