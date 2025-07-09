// AuthorBio.tsx
import Image from "next/image";
import { Author } from "@/types/blog";
import { AboutUsData } from "@/redux/services/aboutUsApi"; // adjust as needed

export default function AuthorBio({
  author,
  logo,
  aboutUs,
}: {
  author: Author | undefined;
  logo: string;
  aboutUs?: AboutUsData;
}) {
  return (
    <div className="flex items-center gap-3 mt-8 bg-blue-50 p-3 rounded-lg shadow">
      <Image
        src={author?.avatar || logo}
        alt={author?.name || aboutUs?.title || "Author"}
        width={48}
        height={48}
        className="rounded-full bg-white object-contain"
      />
      <div>
        <div className="font-semibold">{author?.name || aboutUs?.title || "Author"}</div>
        <div className="text-gray-600 text-sm">{author?.bio || aboutUs?.about || ""}</div>
      </div>
    </div>
  );
}
