import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WingOver | Wings, sandwiches, and sauces",
  description: "Crispy wings, stacked sandwiches, and sauces with something to say."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
