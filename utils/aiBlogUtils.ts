// utils/aiBlogUtils.ts

export interface Post {
  id: number;
  title: string;
  content: string;
  tags?: string[] | string; // Accepts array or comma-separated string
  [key: string]: any; // If you want to accept extra properties
}

// AI powered blog search
export function aiBlogSearch(
  posts: Post[],
  search: string,
  category?: string,
  activeTags?: string[]
): Post[] {
  return posts.filter((p) => {
    // Normalize tags to array
    let tags: string[] = [];
    if (typeof p.tags === "string") {
      tags = p.tags.split(",").map((t) => t.trim()).filter(Boolean);
    } else if (Array.isArray(p.tags)) {
      tags = p.tags;
    }

    const matchesCategory = !category || tags.includes(category);
    const matchesTags =
      !activeTags || activeTags.every((tag) => tags.includes(tag));
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesTags && matchesSearch;
  });
}

// For recommendations
export function getSuggestedPosts(posts: Post[]): Post[] {
  // Pick trending, random, or by AI score
  return posts.slice(0, 3);
}
