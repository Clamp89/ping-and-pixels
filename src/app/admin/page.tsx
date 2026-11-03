"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Post Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [affiliate1, setAffiliate1] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [status, setStatus] = useState({ type: "", message: "" });

  // Check session and load categories on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchCategories();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchCategories();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    if (data) {
      setCategories(data);
      setCategoryId(data[0]?.id || ""); // Default to first category
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setStatus({ type: "error", message: error.message });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Handle Hero Image Upload to Supabase Storage bucket 'article-images'
  async function handleHeroImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('article-images')
        .getPublicUrl(fileName);

      setImageUrl(data.publicUrl);
      setStatus({ type: "success", message: "Hero image uploaded successfully!" });
    } catch (error: any) {
      setStatus({ type: "error", message: "Error uploading hero image: " + error.message });
    } finally {
      setUploading(false);
    }
  }

  // Handle inserting an image into the markdown body content
  async function handleContentImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `body-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('article-images')
        .getPublicUrl(fileName);

      // Automatically append markdown image tag into the textarea content
      setContent((prev) => prev + `\n\n![Article Image](${data.publicUrl})\n\n`);
      setStatus({ type: "success", message: "Body image inserted into markdown!" });
    } catch (error: any) {
      setStatus({ type: "error", message: "Error uploading content image: " + error.message });
    }
  }

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Publishing..." });

    const { error } = await supabase.from("posts").insert({
      title,
      slug,
      excerpt,
      content,
      category_id: categoryId,
      affiliate_link_1: affiliate1 || null,
      featured_image_url: imageUrl || null,
      is_published: true,
    });

    if (error) {
      setStatus({ type: "error", message: error.message });
    } else {
      setStatus({ type: "success", message: "Post published successfully!" });
      setTitle(""); 
      setSlug(""); 
      setExcerpt(""); 
      setContent(""); 
      setAffiliate1(""); 
      setImageUrl("");
    }
  };

  // ---------------- UI: Login Screen ----------------
  if (!session) {
    return (
      <main className="max-w-md mx-auto px-4 py-20">
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-xl">
          <h1 className="text-2xl font-bold text-slate-100 mb-6">Admin Login</h1>
          {status.message && <p className="text-red-400 text-sm mb-4">{status.message}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 focus:border-emerald-500 outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 focus:border-emerald-500 outline-none"
              required
            />
            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-lg transition-colors">
              Sign In
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ---------------- UI: Admin Dashboard ----------------
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Writer Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Logged in as {session.user.email}</p>
        </div>
        <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-slate-200 border border-slate-700 px-4 py-2 rounded-lg">
          Log Out
        </button>
      </div>

      {status.message && (
        <div className={`p-4 mb-6 rounded-lg ${status.type === 'error' ? 'bg-red-950/50 text-red-400 border border-red-800' : 'bg-emerald-950/50 text-emerald-400 border border-emerald-800'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handlePublish} className="space-y-6 bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Post Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">URL Slug (e.g., best-gpu-2026)</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 font-mono text-sm" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100" required>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Affiliate Link (Optional)</label>
            <input type="url" value={affiliate1} onChange={(e) => setAffiliate1(e.target.value)} placeholder="https://amzn.to/..." className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100" />
          </div>
        </div>

        {/* Hero Image Upload Field */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Hero Image (Top of Page)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleHeroImageUpload}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-500 file:text-slate-950 hover:file:bg-emerald-400 cursor-pointer"
          />
          {uploading && <p className="text-emerald-400 text-sm mt-2">Uploading hero image...</p>}
          {imageUrl && <p className="text-slate-400 text-xs mt-2 truncate">Hero Image Attached: {imageUrl}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Short Excerpt (Shows on homepage)</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100" required />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-slate-400">Markdown Content</label>
            <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold py-1.5 px-3 rounded-lg border border-slate-700 transition-colors">
              <span>+ Insert Image into Body</span>
              <input type="file" accept="image/*" onChange={handleContentImageUpload} className="hidden" />
            </label>
          </div>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 font-mono text-sm" required />
        </div>

        <button type="submit" disabled={status.type === 'loading'} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-lg transition-colors disabled:opacity-50 text-lg shadow-lg hover:shadow-emerald-500/20">
          {status.type === 'loading' ? 'Publishing to Database...' : 'Publish Post Live'}
        </button>
      </form>
    </main>
  );
}