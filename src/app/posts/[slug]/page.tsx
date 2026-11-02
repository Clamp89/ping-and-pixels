import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import ReactMarkdown from "react-markdown"; // Adjust if you use a different markdown parser
import { notFound } from "next/navigation";

export default async function PostPage({ params }: { params: { slug: string } }) {
  // Fetch your post data from Supabase
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen pb-24">
      {/* 
        HEADER SECTION
        Constrained width, centered, with bottom margin for whitespace 
      */}
      <header className="max-w-3xl mx-auto px-6 pt-16 pb-8">
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

      {/* 
        HERO IMAGE SECTION
        Slightly wider than the text for a premium editorial look 
      */}
      <div className="max-w-5xl mx-auto px-4 mb-12">
        <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
          <Image
            src={post.image_url || "/backdrop.jpg"} // Falls back to your public/backdrop.jpg
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* 
        MARKDOWN CONTENT SECTION
        Constrained width + Tailwind Typography (prose) activated
      */}
      <article className="max-w-3xl mx-auto px-6 prose prose-invert prose-lg prose-emerald hover:prose-a:text-emerald-400">
        <ReactMarkdown>
          {post.content}
        </ReactMarkdown>
      </article>

      {/* 
        RECOMMENDED GEAR / AFFILIATE SECTION
        Kept in the same constrained layout 
      */}
      {post.affiliate_link && (
        <div className="max-w-3xl mx-auto px-6 mt-16">
          <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
            <h3 className="text-emerald-400 font-bold mb-2 uppercase text-sm tracking-wider">Featured Item</h3>
            <p className="text-gray-300 mb-4 text-sm">Check out the current price for the gear mentioned in this article.</p>
            <a 
              href={post.affiliate_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-2 px-6 rounded transition-colors"
            >
              Check Current Price
            </a>
          </div>
        </div>
      )}
    </main>
  );
}