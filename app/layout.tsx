import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Car | Acceso",
  description: "Accede a tu espacio Global Car.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
