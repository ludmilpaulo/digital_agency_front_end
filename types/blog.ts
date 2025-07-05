// Author is useful for bios, avatars, admin etc
export interface Author {
  id: number;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  email?: string | null;
  is_admin?: boolean;
}

// Blog Comment (supports threaded comments)
export interface Comment {
  id: number;
  post: number;
  parent?: number | null;           // Parent comment id (for threading)
  name: string;
  email: string;
  content: string;
  created_date: string;
  replies?: Comment[];              // Nested comments (optional)
}

// Blog Post
export interface Post {
  id: number;
  title: string;
  content: string;
  category: string;              // "Tech", "News", etc
  image?: string | null;
  published_date: string;
  author?: Author;                  // Reference to Author
  excerpt?: string | null;          // For summary in cards/lists
  tags?: string;                    // "SEO, Marketing, Development"
  categories?: string;              // "Tech, News"
  comments_count?: number;          // Optional count for UI
  comments?: Comment[];             // Array of comments (if embedded)
  is_published?: boolean;           // For admin
  is_featured?: boolean;            // For "trending", etc
}
