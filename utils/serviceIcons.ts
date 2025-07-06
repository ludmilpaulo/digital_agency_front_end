// utils/serviceIcons.ts

import { 
  FaCode, 
  FaMobileAlt, 
  FaBullhorn, 
  FaCloud, 
  FaCogs, 
  FaRocket, 
  FaChartLine 
} from "react-icons/fa";

// You can use a union type for better intellisense:
export type ServiceIconKey =
  | "FaCode"
  | "FaMobileAlt"
  | "FaBullhorn"
  | "FaCloud"
  | "FaCogs"
  | "FaRocket"
  | "FaChartLine";

export const SERVICE_ICONS: Record<ServiceIconKey, JSX.Element> = {
  FaCode: <FaCode 
  className="text-blue-600 text-5xl mb-3" />,
  FaMobileAlt: <FaMobileAlt className="text-green-600 text-5xl mb-3" />,
  FaBullhorn: <FaBullhorn className="text-pink-600 text-5xl mb-3" />,
  FaCloud: <FaCloud className="text-purple-600 text-5xl mb-3" />,
  FaCogs: <FaCogs className="text-yellow-600 text-5xl mb-3" />,
  FaRocket: <FaRocket className="text-red-600 text-5xl mb-3" />,
  FaChartLine: <FaChartLine className="text-blue-500 text-5xl mb-3" />,
};
