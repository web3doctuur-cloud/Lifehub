"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Story {
  id: string;
  title: string;
  author: string;
  downloadUrl: string;
  cover: string;
}

export default function StorybooksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchStories("adventure");
    }
  }, [status, router]);

  const fetchStories = async (query: string) => {
    if (!query.trim()) {
      query = "adventure";
    }
    
    setLoading(true);
    try {
      const res = await fetch(`/api/stories?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to fetch stories");
      const data = await res.json();
      setStories(data);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadStory = async (url: string, title: string, id: string) => {
    if (!url) {
      alert("Download not available for this book");
      return;
    }
    
    setDownloadingId(id);
    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading story:", error);
      alert("Failed to download story. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      fetchStories(search);
    }
  };

  const popularGenres = ["Adventure", "Fantasy", "Mystery", "Romance", "Science Fiction", "Classic"];

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lilac-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 py-16 border-b border-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-lilac-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-lilac-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-lilac-600/10 border border-lilac-600/30 rounded-full mb-6">
              <svg className="w-5 h-5 text-lilac-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-lilac-400 text-sm">Free Public Domain Books</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Storybook <span className="gradient-text">Explorer</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              Discover thousands of free classic books from Project Gutenberg. Search, read, and download your favorites.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search stories (e.g., fantasy, love, mystery, classic)..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-lilac-500 focus:ring-1 focus:ring-lilac-500 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-lilac-600 hover:bg-lilac-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Popular Genres */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {popularGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => {
                setSearch(genre.toLowerCase());
                fetchStories(genre.toLowerCase());
              }}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-lilac-400 rounded-lg border border-gray-800 transition-all duration-200 text-sm"
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-lilac-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Discovering stories for you...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-gray-400 text-lg">No stories found. Try a different search term!</p>
            <button
              onClick={() => fetchStories("adventure")}
              className="mt-4 text-lilac-400 hover:text-lilac-300 transition"
            >
              Browse adventure stories →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stories.map((story: Story) => (
              <div
                key={story.id}
                className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-lilac-500/50 transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                {/* Book Cover */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                  {story.cover ? (
                    <img
                      src={story.cover}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <svg className="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <p className="text-gray-600 text-sm mt-2">No Cover Available</p>
                    </div>
                  )}
                  
                  {/* Download Badge */}
                  {story.downloadUrl && (
                    <div className="absolute top-2 right-2 bg-lilac-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      Available
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2 group-hover:text-lilac-400 transition">
                    {story.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    by {story.author}
                  </p>
                  
                  <button
                    onClick={() => downloadStory(story.downloadUrl, story.title, story.id)}
                    disabled={downloadingId === story.id}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-lilac-600/10 border border-lilac-600/30 text-lilac-400 rounded-lg hover:bg-lilac-600 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloadingId === story.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Download Book</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="container mx-auto px-4 py-8 text-center border-t border-gray-800 mt-8">
        <p className="text-gray-500 text-sm">
          Books provided by Project Gutenberg • Free public domain classics
        </p>
      </div>
    </div>
  );
}