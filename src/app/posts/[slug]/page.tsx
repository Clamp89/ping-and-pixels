import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import ReactMarkdown from "react-markdown"; 
import { notFound } from "next/navigation";

export const instant = false;

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen pb-24">
      
      {/* 1. HERO IMAGE (Moved to the very top for an editorial feel) */}
      <div className="w-full max-w-6xl mx-auto pt-6 px-4 mb-10">
        <div className="relative w-full h-[250px] md:h-[450px] rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
          <Image
            src={post.image_url || "/backdrop.jpg"} 
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* 2. HEADER (Flows directly into the content now) */}
      <header className="max-w-3xl mx-auto px-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-emerald-400 font-semibold tracking-wider uppercase text-sm">
            {post.category || "Gaming"}
          </span>
          <span className="text-gray-500 text-sm">•</span>
          <span className="text-gray-400 text-sm">
            {new Date(post.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {post.title}
        </h1>
        
        <p className="text-xl text-gray-300 leading-relaxed">
          {post.excerpt}
        </p>
      </header>

      {/* 3. AFFILIATE BANNER (Moved up for better clicks, styled horizontally) */}
      {post.affiliate_link ? (
        <div className="max-w-3xl mx-auto px-6 mb-12">
          <div className="p-6 rounded-xl border border-emerald-900/50 bg-emerald-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div>
              <h3 className="text-emerald-400 font-bold mb-1 uppercase text-sm tracking-wider">Featured Gear</h3>
              <p className="text-gray-300 text-sm m-0">Check out the current price for the gear mentioned in this article.</p>
            </div>
            <a 
              href={post.affiliate_link}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-2 px-6 rounded transition-colors"
            >
              Check Price
            </a>
          </div>
        </div>
      ) : null}

      {/* 4. ARTICLE CONTENT */}
      <article className="max-w-3xl mx-auto px-6 prose prose-invert prose-lg prose-emerald hover:prose-a:text-emerald-400">
        <ReactMarkdown>
          {post.content}
        </ReactMarkdown>
      </article>
    </main>
  );
}