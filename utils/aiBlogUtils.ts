// Example: AI powered blog search
export function aiBlogSearch(posts, search, category, activeTags) {
  // TODO: Integrate GPT or similar for advanced search. Here: simple fallback.
  return posts.filter(
    p =>
      (!category || p.tags?.includes(category)) &&
      (p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.content.toLowerCase().includes(search.toLowerCase()))
  );
}
// For recommendations
export function getSuggestedPosts(posts) {
  // Pick trending, random, or by AI score
  return posts.slice(0, 3);
}
