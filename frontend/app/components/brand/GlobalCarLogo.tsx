import Image from "next/image";
import type { LoginTheme } from "../../services/theme.service";

type GlobalCarLogoProps = {
  theme: LoginTheme;
  className?: string;
};

const logoSources: Record<LoginTheme, string> = {
  light: "/images/global-car-light.png",
  dark: "/images/global-car-dark.png",
};

export default function GlobalCarLogo({ theme, className }: GlobalCarLogoProps) {
  return (
    <Image
      className={className}
      src={logoSources[theme]}
      width={445}
      height={276}
      alt="Emblema Global Car"
      priority
    />
  );
}
