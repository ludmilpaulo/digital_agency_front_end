import Image from "next/image";
import { Author } from "@/types/blog";

export default function AuthorBio({ author }: { author: Author | undefined }) {
  if (!author) return null;
  return (
    <div className="flex items-center gap-3 mt-8 bg-blue-50 p-3 rounded-lg shadow">
      <Image src={author.avatar || "/default-avatar.png"} alt={author.name || "Author"} width={48} height={48} className="rounded-full" />
      <div>
        <div className="font-semibold">{author.name}</div>
        <div className="text-gray-600 text-sm">{author.bio}</div>
      </div>
    </div>
  );
}
