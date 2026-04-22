import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const downloadUrl = searchParams.get("url");
  
  if (!downloadUrl) {
    return NextResponse.json({ error: "No download URL provided" }, { status: 400 });
  }
  
  try {
    // Fetch the book content
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
      // Find the end of the header (after the start marker line)
      const headerEnd = content.indexOf("\n\n", startIndex);
      if (headerEnd !== -1) {
        // Find the beginning of the footer
        const footerStart = content.lastIndexOf("\n\n", endIndex);
        if (footerStart !== -1) {
          content = content.substring(headerEnd + 2, footerStart);
        }
      }
    }
    
    // Limit content size for performance (first 500KB is plenty for reading)
    if (content.length > 500000) {
      content = content.substring(0, 500000) + "\n\n... [Content truncated for performance] ...";
    }
    
    return NextResponse.json({ content, id: params.id });
  } catch (error) {
    console.error("Error fetching book content:", error);
    return NextResponse.json({ error: "Failed to fetch book content" }, { status: 500 });
  }
}