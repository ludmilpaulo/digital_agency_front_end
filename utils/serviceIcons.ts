// utils/serviceIcons.ts
import {
  FaCode, FaMobileAlt, FaBullhorn, FaCloud, FaCogs, FaRocket
} from "react-icons/fa";

export const SERVICE_ICONS: Record<string, JSX.Element> = {
  FaCode: <FaCode className="text-blue-400 text-5xl" />,
  FaMobileAlt: <FaMobileAlt className="text-green-400 text-5xl" />,
  FaBullhorn: <FaBullhorn className="text-pink-400 text-5xl" />,
  FaCloud: <FaCloud className="text-yellow-400 text-5xl" />,
  FaCogs: <FaCogs className="text-yellow-600 text-5xl" />,
  FaRocket: <FaRocket className="text-red-500 text-5xl" />,
};
