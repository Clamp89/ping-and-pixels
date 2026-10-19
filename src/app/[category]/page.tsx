import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { notFound } from "next/navigation";

export const instant = false;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (category !== "tech" && category !== "gaming") {
    notFound();
  }

  const isGaming = category === "gaming";

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
    .eq("categories.slug", category)
    .order("created_at", { ascending: false });

  const posts = data as any[] | null;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 md:py-16">
      {/* Dynamic Category Hero Section */}
      <div className="mb-14 border-b border-slate-800/80 pb-10">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border backdrop-blur-md ${
          isGaming 
            ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-400" 
            : "border-cyan-500/30 bg-cyan-950/40 text-cyan-400"
        }`}>
          <span className={`w-2 h-2 rounded-full ${isGaming ? "bg-emerald-400 animate-pulse" : "bg-cyan-400 animate-pulse"}`} />
          {category} HUB
        </div>

        <h1 className={`text-4xl md:text-6xl font-black tracking-tight mb-3 capitalize text-transparent bg-clip-text bg-gradient-to-r ${
          isGaming 
            ? "from-white via-slate-100 to-emerald-400" 
            : "from-white via-slate-100 to-cyan-400"
        }`}>
          {category} News &amp; Reviews
        </h1>

        <p className="text-base md:text-lg text-slate-400">
          Latest updates, detailed breakdowns, and coverage in {category}.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts?.map((post: any) => {
          const postCategory = post.categories as any;

          return (
            <article
              key={post.id}
              className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm backdrop-blur-sm"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                    postCategory.slug === 'gaming' 
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50' 
                      : 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/50'
                  }`}>
                    {postCategory.name}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-slate-100 mb-3 hover:text-emerald-400 transition-colors leading-snug">
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-sm text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <Link
                href={`/posts/${post.slug}`}
                className="text-sm font-semibold text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 transition-colors group"
              >
                Read Article 
                <span aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform">
                  &rarr;
                </span>
              </Link>
            </article>
          );
        })}
      </div>

      {posts?.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
          No {category} posts published yet.
        </div>
      )}
    </main>
  );
}