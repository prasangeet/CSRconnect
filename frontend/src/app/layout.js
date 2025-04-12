import { Poppins, Inter } from "next/font/google"; // Import Poppins font
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// Initialize Poppins font
const poppins = Poppins({
  weight: ["400", "600"], // You can specify the weights you want
  subsets: ["latin"], // Add subsets you need // CSS variable for applying the font
});

const inter = Inter({
  weight: ['400', '600'],
  subsets: ["latin"]
})

export const metadata = {
  title: "CSR Connect | Empowering Sustainable Collaboration",
  description:
    "CSR Connect is a platform to link companies with academic research aligned to Sustainable Development Goals (SDGs), enabling impactful Corporate Social Responsibility initiatives.",
  keywords: [
    "CSR",
    "Sustainable Development Goals",
    "SDGs",
    "Academic Research",
    "Corporate Responsibility",
    "Research Collaboration",
    "University Projects",
    "Social Impact",
    "Next.js",
    "Django",
  ],
  authors: [{ name: "Prasangeet Dongre" }],
  creator: "Prasangeet Dongre",
  publisher: "IIT Jodhpur",
  metadataBase: new URL("https://csrconnect.in"), // change to your domain
  openGraph: {
    title: "CSR Connect | Empowering Sustainable Collaboration",
    description:
      "Linking corporate initiatives with SDG-aligned academic research projects to create lasting impact.",
    url: "https://csrconnect.in",
    siteName: "CSR Connect",
    images: [
      {
        url: "https://csrconnect.in/og-image.png", // Replace with actual image URL
        width: 1200,
        height: 630,
        alt: "CSR Connect Preview Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CSR Connect",
    description:
      "Platform bridging the gap between CSR initiatives and sustainable academic research.",
    creator: "@prasangeetdgr", // replace with your Twitter handle if any
    images: ["https://csrconnect.in/og-image.png"], // Replace with actual image
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased h-full`}>
        <Toaster />
        <main>{children}</main>
      </body>
    </html>
  );
}
