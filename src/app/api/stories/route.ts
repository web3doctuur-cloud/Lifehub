import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "love";
  const page = searchParams.get("page") || "1";
  
  // Using Gutendex - free public domain books API
  const res = await fetch(`https://gutendex.com/books/?search=${query}&page=${page}`);
  const data = await res.json();

  // Format for download
  const stories = data.results.map((book: any) => ({
    id: book.id,
    title: book.title,
    author: book.authors[0]?.name || "Unknown",
    downloadUrl: book.formats["text/plain"] || book.formats["application/pdf"],
    cover: book.formats["image/jpeg"] || "",
  }));

  return NextResponse.json(stories);
}