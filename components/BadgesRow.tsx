// components/BadgesRow.tsx
"use client";
const badges = [
  {
    label: "Proudly South African",
    img: "https://upload.wikimedia.org/wikipedia/commons/a/af/Flag_of_South_Africa.svg",
    alt: "Proudly South African",
  },
  {
    label: "Top Rated Digital Agency",
    img: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
    alt: "Top Rated Digital Agency",
  },
  {
    label: "Google Partner",
    img: "https://upload.wikimedia.org/wikipedia/commons/2/28/Google_Partners_logo.svg",
    alt: "Google Partner",
  },
];

export default function BadgesRow() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-10 py-9 max-w-3xl mx-auto">
      {badges.map((b, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <img
            src={b.img}
            alt={b.alt}
            width={50}
            height={50}
            className="rounded bg-white p-2 shadow-md"
            style={{ minWidth: 50, minHeight: 50, objectFit: "contain" }}
          />
          <span className="text-xs text-blue-900 font-semibold">{b.label}</span>
        </div>
      ))}
    </div>
  );
}
