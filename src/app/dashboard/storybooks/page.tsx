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
  textContent?: string;
}

export default function StorybooksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [readingBook, setReadingBook] = useState<Story | null>(null);
  const [readingContent, setReadingContent] = useState<string>("");
  const [isReading, setIsReading] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);

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
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // For Firefox, append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    
    // Small delay before removing the link
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  } catch (error) {
    console.error("Error downloading story:", error);
    // Fallback: open in new tab
    window.open(url, '_blank');
  } finally {
    setDownloadingId(null);
  }
};
  const readStory = async (story: Story) => {
  if (!story.downloadUrl) {
    alert("This book is not available for reading online.");
    return;
  }
  
  setReadingBook(story);
  setIsReading(true);
  setLoadingContent(true);
  
  try {
    // Use the same API endpoint with downloadUrl parameter
    const res = await fetch(`/api/stories?downloadUrl=${encodeURIComponent(story.downloadUrl)}`);
    if (!res.ok) throw new Error("Failed to fetch book content");
    const data = await res.json();
    setReadingContent(data.content || "Unable to load book content.");
  } catch (error) {
    console.error("Error loading book content:", error);
    setReadingContent("Failed to load book content. Please try downloading the book instead.");
  } finally {
    setLoadingContent(false);
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
              Discover thousands of free classic books from Project Gutenberg. Read online or download your favorites.
            </p>
            
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
                  
                  {story.downloadUrl && (
                    <div className="absolute top-2 right-2 bg-lilac-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      Available
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2 group-hover:text-lilac-400 transition">
                    {story.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    by {story.author}
                  </p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => readStory(story)}
                      disabled={!story.downloadUrl}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-lilac-600/10 border border-lilac-600/30 text-lilac-400 rounded-lg hover:bg-lilac-600 hover:text-white transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Read</span>
                    </button>
                    
                    <button
                      onClick={() => downloadStory(story.downloadUrl, story.title, story.id)}
                      disabled={downloadingId === story.id || !story.downloadUrl}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-200 disabled:opacity-50"
                    >
                      {downloadingId === story.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reading Modal */}
      {isReading && readingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fadeIn">
          <div className="bg-gray-900 rounded-xl border border-gray-800 max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-white">{readingBook.title}</h3>
                <p className="text-sm text-gray-400">by {readingBook.author}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadStory(readingBook.downloadUrl, readingBook.title, readingBook.id)}
                  className="p-2 text-gray-400 hover:text-lilac-400 transition"
                  title="Download"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsReading(false)}
                  className="p-2 text-gray-400 hover:text-white transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Reading Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingContent ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-lilac-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400">Loading book content...</p>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                    {readingContent}
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-4 text-center text-xs text-gray-500">
              <p>Public Domain Book • Provided by Project Gutenberg</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="container mx-auto px-4 py-8 text-center border-t border-gray-800 mt-8">
        <p className="text-gray-500 text-sm">
          Books provided by Project Gutenberg • Free public domain classics
        </p>
      </div>
    </div>
  );
}