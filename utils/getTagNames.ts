export function getTagNames(tags: any): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags.map(tag =>
      typeof tag === "string" ? tag : tag?.name || ""
    ).filter(Boolean);
  }
  if (typeof tags === "string") {
    return tags.split(",").map(s => s.trim()).filter(Boolean);
  }
  return [];
}
