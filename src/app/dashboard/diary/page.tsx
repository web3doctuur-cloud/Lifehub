"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DiaryEntry {
  id: string;
  content: string;
  mood: string;
  date: string;
}

export default function DiaryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const moodOptions = [
    { value: "happy", emoji: "😊", label: "Happy", color: "text-caribbean-green" },
    { value: "excited", emoji: "🎉", label: "Excited", color: "text-mint" },
    { value: "neutral", emoji: "😐", label: "Neutral", color: "text-stone" },
    { value: "sad", emoji: "😢", label: "Sad", color: "text-blue-400" },
    { value: "grateful", emoji: "🙏", label: "Grateful", color: "text-mountain-meadow" },
    { value: "loved", emoji: "❤️", label: "Loved", color: "text-red-400" },
    { value: "stressed", emoji: "😫", label: "Stressed", color: "text-purple-400" },
    { value: "peaceful", emoji: "😌", label: "Peaceful", color: "text-pistachio" },
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchEntries();
    }
  }, [status, router]);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/diary");
      if (!res.ok) throw new Error("Failed to fetch entries");
      const data = await res.json();
      setEntries(data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const addEntry = async () => {
    if (!content.trim()) {
      alert("Please write something about your day!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/diary", {
        method: "POST",
        body: JSON.stringify({ content, mood }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setContent("");
        setMood("neutral");
        await fetchEntries();
      }
    } catch (error) {
      console.error("Error adding entry:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id: string) => {
    if (confirm("Are you sure you want to delete this diary entry?")) {
      setDeletingId(id);
      try {
        const res = await fetch(`/api/diary?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          await fetchEntries();
        }
      } catch (error) {
        console.error("Error deleting entry:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getMoodEmoji = (moodValue: string) => {
    const mood = moodOptions.find(m => m.value === moodValue);
    return mood ? mood.emoji : "😐";
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMood === "all" || entry.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  const stats = {
    total: entries.length,
    averageLength: entries.length > 0 
      ? Math.round(entries.reduce((acc, entry) => acc + getWordCount(entry.content), 0) / entries.length)
      : 0,
    mostCommonMood: entries.length > 0
      ? entries.reduce((acc, entry) => {
          acc[entry.mood] = (acc[entry.mood] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      : {},
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-rich-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-caribbean-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-anti-flash-white/70">Loading your diary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rich-black">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-dark-green via-rich-black to-bangladesh-green py-12 border-b border-caribbean-green/20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-caribbean-green/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-mountain-meadow/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-mint/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-caribbean-green/10 border border-caribbean-green/30 rounded-full mb-6 backdrop-blur-sm">
              <svg className="w-5 h-5 text-caribbean-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-caribbean-green text-sm font-medium">Personal Journal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-anti-flash-white mb-4">
              Digital <span className="text-caribbean-green">Diary</span>
            </h1>
            <p className="text-lg text-anti-flash-white/60">
              Document your journey, track your moods, and reflect on your personal growth.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-dark-green/50 backdrop-blur-sm rounded-xl p-6 border border-caribbean-green/20 hover:border-caribbean-green/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-anti-flash-white/50 text-sm mb-1">Total Entries</p>
                  <p className="text-3xl font-bold text-anti-flash-white">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-caribbean-green/10 rounded-lg flex items-center justify-center border border-caribbean-green/20">
                  <svg className="w-6 h-6 text-caribbean-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-dark-green/50 backdrop-blur-sm rounded-xl p-6 border border-caribbean-green/20 hover:border-caribbean-green/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-anti-flash-white/50 text-sm mb-1">Avg. Entry Length</p>
                  <p className="text-3xl font-bold text-mint">{stats.averageLength}</p>
                  <p className="text-xs text-stone">words</p>
                </div>
                <div className="w-12 h-12 bg-mint/10 rounded-lg flex items-center justify-center border border-mint/20">
                  <svg className="w-6 h-6 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-dark-green/50 backdrop-blur-sm rounded-xl p-6 border border-caribbean-green/20 hover:border-caribbean-green/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-anti-flash-white/50 text-sm mb-1">Most Common Mood</p>
                  <p className="text-3xl font-bold text-caribbean-green">
                    {Object.keys(stats.mostCommonMood).length > 0
                      ? getMoodEmoji(Object.entries(stats.mostCommonMood).sort((a,b) => b[1] - a[1])[0][0])
                      : "😐"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-caribbean-green/10 rounded-lg flex items-center justify-center border border-caribbean-green/20">
                  <svg className="w-6 h-6 text-caribbean-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Add Entry Form */}
          <div className="bg-dark-green/50 backdrop-blur-sm rounded-xl border border-caribbean-green/20 p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-6 h-6 text-caribbean-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h2 className="text-2xl font-semibold text-anti-flash-white">How was your day?</h2>
            </div>
            
            <div className="mb-4">
              <label className="block text-anti-flash-white/60 text-sm mb-2">How are you feeling?</label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {moodOptions.map((moodOption) => (
                  <button
                    key={moodOption.value}
                    onClick={() => setMood(moodOption.value)}
                    className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                      mood === moodOption.value
                        ? "bg-caribbean-green/20 border border-caribbean-green"
                        : "bg-forest/40 border border-caribbean-green/20 hover:bg-forest/60"
                    }`}
                  >
                    <span className="text-2xl">{moodOption.emoji}</span>
                    <span className={`text-xs mt-1 ${mood === moodOption.value ? "text-caribbean-green" : "text-anti-flash-white/60"}`}>
                      {moodOption.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <textarea
              placeholder="Write about your day... What happened? How did you feel? What are you grateful for?"
              className="w-full bg-rich-black/80 border border-caribbean-green/20 rounded-lg p-4 mb-4 text-anti-flash-white placeholder-stone focus:outline-none focus:border-caribbean-green focus:ring-1 focus:ring-caribbean-green transition-all"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-stone">
                {getWordCount(content)} words • {content.length} characters
              </div>
              <button
                onClick={addEntry}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-caribbean-green hover:bg-mint text-rich-black rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none font-medium shadow-lg shadow-caribbean-green/20"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-rich-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>Save Entry</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search diary entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 bg-dark-green/50 backdrop-blur-sm border border-caribbean-green/20 rounded-lg text-anti-flash-white placeholder-stone focus:outline-none focus:border-caribbean-green focus:ring-1 focus:ring-caribbean-green transition-all"
              />
            </div>
            
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="px-4 py-2 bg-dark-green/50 backdrop-blur-sm border border-caribbean-green/20 rounded-lg text-anti-flash-white focus:outline-none focus:border-caribbean-green focus:ring-1 focus:ring-caribbean-green transition-all"
            >
              <option value="all">All Moods</option>
              {moodOptions.map(mood => (
                <option key={mood.value} value={mood.value}>
                  {mood.emoji} {mood.label}
                </option>
              ))}
            </select>
          </div>

          {/* Entries List */}
          {filteredEntries.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-24 h-24 mx-auto text-stone mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-anti-flash-white/60 text-lg">
                {searchTerm || selectedMood !== "all" 
                  ? "No entries match your search." 
                  : "No diary entries yet. Start writing about your day above!"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="bg-dark-green/50 backdrop-blur-sm rounded-xl border border-caribbean-green/20 p-5 hover:border-caribbean-green/50 transition-all duration-300 animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                      <div>
                        <p className="text-sm text-anti-flash-white/60">
                          {new Date(entry.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      disabled={deletingId === entry.id}
                      className="p-1 text-stone hover:text-red-400 transition disabled:opacity-50"
                    >
                      {deletingId === entry.id ? (
                        <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-anti-flash-white/80 leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>
                  <div className="mt-3 text-xs text-stone">
                    {getWordCount(entry.content)} words
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}