import { Kanit } from "next/font/google";

export const fontSans = Kanit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["200", "400", "500", "600", "700", "800", "900"],
});
