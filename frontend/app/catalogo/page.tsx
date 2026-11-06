import type { Metadata } from "next";
import GlobalCarDashboard from "../components/GlobalCarDashboard";
import "./auth.css";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "Global Car | Catálogo",
  description: "Explora automóviles, repuestos y accesorios Global Car.",
};

export default function CatalogoPage() {
  return <GlobalCarDashboard />;
}
