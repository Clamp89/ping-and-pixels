import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import AffiliateCard from '@/components/AffiliateCard';
import ReactMarkdown from 'react-markdown';

// Tells Next.js not to statically prerender this dynamic database page
export const instant = false;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch the single post matching the slug along with its category name
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      categories!inner(name)
    `)
    .eq('slug', slug)
    .single();

  // If no post is found or there is a database error, trigger the Next.js 404 page
  if (error || !post) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
      {/* Article Header */}
      <div className="mb-10 border-b border-slate-800 pb-8">
        <span className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-3 block">
          {post.categories.name}
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 mb-6 tracking-tight leading-tight">
          {post.title}
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed">
          {post.excerpt}
        </p>
      </div>

      {/* Article Body: Parsed Markdown with Increased Line Spacing */}
      <div className="prose prose-invert prose-emerald prose-lg max-w-none mb-16 prose-p:leading-loose prose-li:leading-loose prose-headings:leading-tight tracking-wide">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Affiliate Integration Zone */}
      {post.affiliate_link_1 && (
        <div className="mt-12 border-t border-slate-800 pt-12">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">
            Recommended Gear
          </h3>
          <AffiliateCard 
            title="Featured Item" 
            description="Check out the current price for the gear mentioned in this article." 
            affiliateUrl={post.affiliate_link_1} 
          />
        </div>
      )}
    </main>
  );
}