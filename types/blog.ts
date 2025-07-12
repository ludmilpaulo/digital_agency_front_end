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
  is_approved: boolean;            // For moderation
  created_at: string;
  created_date: string;
  replies?: Comment[];              // Nested comments (optional)
}

// Blog Post
export interface Post {
  id: number;
  title: string;
  content: string;
 category?: { name: string } | string | null;            // "Tech", "News", etc
  image?: string | null;
  published_date: string;
  author?: Author;                  // Reference to Author
  excerpt?: string | null;          // For summary in cards/lists
  tags?: string;                    // "SEO, Marketing, Development"
  categories?: string;
  markdown?: string;                // Optional markdown content
  comments_count?: number;          // Optional count for UI
  comments?: Comment[];             // Array of comments (if embedded)
  is_published?: boolean;           // For admin
  is_featured?: boolean;            // For "trending", etc
}

// types.ts
export interface User {
  id: number;
  email: string;
  username: string;
  token?: string; // JWT token for auth
  first_name?: string; // Optional for user profile
  last_name?: string; // Optional for user profile
  is_active?: boolean; // Optional for admin
  is_staff?: boolean; // Optional for admin
  date_joined?: string; // Optional for user profile
  last_login?: string; // Optional for user profile
  avatar?: string | null; // URL to user's avatar image
  bio?: string | null; // User's bio or description
  groups: string[]; 
  user_id: number;// or number[] if using PKs
  // ...any other fields
}

