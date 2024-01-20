import type { Metadata } from "next";

import "./globals.css";

// icon
import { FaRegKeyboard } from "react-icons/fa";

import Navbar from "@/components/Navbar";
import Wrapper from "@/components/Wrapper";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Typing",
  description: "Improve your typing speed",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Wrapper>
          <div className="relative h-screen px-6 block md:hidden">
            <div className="absolute top-0 left-0 ml-6">
              <FaRegKeyboard className="text-4xl" />
            </div>
            <div className="hv-center h-full">
              <h3 className="font-semibold text-2xl">
                This screen size is not supported. Please visit on a larger
                screen
              </h3>
            </div>
          </div>

          <div className="hidden md:flex px-8 flex-col gap-4 h-full">
            <Navbar />
            <div className="grid lg:grid-cols-12 gap-4">
              <div className="col-span-2 lg:block hidden">
                <Sidebar />
              </div>
              <div className="col-span-10">{children}</div>
            </div>
          </div>
        </Wrapper>
      </body>
    </html>
  );
}
