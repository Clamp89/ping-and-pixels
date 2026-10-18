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
  const [categories, setCategories] = useState<any[]>([]);
  const [status, setStatus] = useState({ type: "", message: "" });

  // Check session and load categories on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchCategories();
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchCategories();
    });
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
      is_published: true,
    });

    if (error) {
      setStatus({ type: "error", message: error.message });
    } else {
      setStatus({ type: "success", message: "Post published successfully!" });
      setTitle(""); setSlug(""); setExcerpt(""); setContent(""); setAffiliate1("");
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

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Short Excerpt (Shows on homepage)</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Markdown Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 font-mono text-sm" required />
        </div>

        <button type="submit" disabled={status.type === 'loading'} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-lg transition-colors disabled:opacity-50 text-lg shadow-lg hover:shadow-emerald-500/20">
          {status.type === 'loading' ? 'Publishing to Database...' : 'Publish Post Live'}
        </button>
      </form>
    </main>
  );
}