import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
}
const truncateText = (htmlContent: string, maxLength: number) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  const plainText = tempDiv.textContent || "";
  return plainText.length > maxLength
    ? `${plainText.substring(0, maxLength)}...`
    : plainText;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  image,
  link,
}) => {
  const truncatedDescription = truncateText(description, 100);
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <Link
        href={{
          pathname: "/projectDetails",
          query: {
            title: title,
            image: image,
            description: description,
          },
        }}
      >
        <Image
          src={image}
          alt={title}
          width={400}
          height={250}
          className="w-full"
        />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{title}</div>
          <div className="mt-2">{truncatedDescription}</div>
        </div>
        <button className="w-full mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors hover:bg-yellow-600">
          View Details
        </button>
      </Link>
    </div>
  );
};

export default ProjectCard;
