import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const downloadUrl = searchParams.get("downloadUrl");
  
  // If downloadUrl is provided, fetch book content
  if (downloadUrl) {
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.status}`);
      }
      
      let content = await response.text();
      
      // Clean up Project Gutenberg headers/footers
      const startMarkers = [
        "*** START OF THE PROJECT GUTENBERG EBOOK",
        "***START OF THE PROJECT GUTENBERG EBOOK",
        "*** START OF THIS PROJECT GUTENBERG EBOOK",
        "***START OF THIS PROJECT GUTENBERG EBOOK"
      ];
      
      const endMarkers = [
        "*** END OF THE PROJECT GUTENBERG EBOOK",
        "***END OF THE PROJECT GUTENBERG EBOOK",
        "*** END OF THIS PROJECT GUTENBERG EBOOK",
        "***END OF THIS PROJECT GUTENBERG EBOOK"
      ];
      
      let startIndex = -1;
      for (const marker of startMarkers) {
        const index = content.indexOf(marker);
        if (index !== -1) {
          startIndex = index;
          break;
        }
      }
      
      let endIndex = -1;
      for (const marker of endMarkers) {
        const index = content.indexOf(marker);
        if (index !== -1) {
          endIndex = index;
          break;
        }
      }
      
      if (startIndex !== -1 && endIndex !== -1) {
        const headerEnd = content.indexOf("\n\n", startIndex);
        if (headerEnd !== -1) {
          const footerStart = content.lastIndexOf("\n\n", endIndex);
          if (footerStart !== -1) {
            content = content.substring(headerEnd + 2, footerStart);
          }
        }
      }
      
      if (content.length > 500000) {
        content = content.substring(0, 500000) + "\n\n... [Content truncated for performance] ...";
      }
      
      return NextResponse.json({ content });
    } catch (error) {
      console.error("Error fetching book content:", error);
      return NextResponse.json({ error: "Failed to fetch book content" }, { status: 500 });
    }
  }
  
  // Otherwise, search for books
  const searchQuery = query || "love";
  const page = searchParams.get("page") || "1";
  
  try {
    const res = await fetch(`https://gutendex.com/books/?search=${encodeURIComponent(searchQuery)}&page=${page}`);
    if (!res.ok) {
      throw new Error(`Gutendex API responded with status ${res.status}`);
    }
    
    const data = await res.json();
    
    const stories = data.results.map((book: any) => ({
      id: book.id,
      title: book.title,
      author: book.authors[0]?.name || "Unknown",
      downloadUrl: book.formats["text/plain"] || 
                    book.formats["text/plain; charset=utf-8"] || 
                    book.formats["application/pdf"] || 
                    "",
      cover: book.formats["image/jpeg"] || "",
    }));
    
    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}