import type { Portfolio } from "@/lib/types";
import { LilacStudio } from "./LilacStudio";
import { VioletNight } from "./VioletNight";
import {
  CoastEditorial,
  CrimsonAtelier,
  PolaroidNavy,
  SolarPop,
  TealBoard,
} from "./ExtraThemes";
import { BurgundyStudio, SocialPress } from "./PressThemes";

export function PortfolioView({
  portfolio,
  shareUrl,
}: {
  portfolio: Portfolio;
  shareUrl?: string;
}) {
  switch (portfolio.appearance.themeId) {
    case "violet-night":
      return <VioletNight portfolio={portfolio} shareUrl={shareUrl} />;
    case "coast-editorial":
      return <CoastEditorial portfolio={portfolio} shareUrl={shareUrl} />;
    case "polaroid-navy":
      return <PolaroidNavy portfolio={portfolio} shareUrl={shareUrl} />;
    case "solar-pop":
      return <SolarPop portfolio={portfolio} shareUrl={shareUrl} />;
    case "crimson-atelier":
      return <CrimsonAtelier portfolio={portfolio} shareUrl={shareUrl} />;
    case "teal-board":
      return <TealBoard portfolio={portfolio} shareUrl={shareUrl} />;
    case "social-press":
      return <SocialPress portfolio={portfolio} shareUrl={shareUrl} />;
    case "burgundy-studio":
      return <BurgundyStudio portfolio={portfolio} shareUrl={shareUrl} />;
    default:
      return <LilacStudio portfolio={portfolio} shareUrl={shareUrl} />;
  }
}
