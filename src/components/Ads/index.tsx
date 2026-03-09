type AdsProps = {
  variant: "sidebarTopo" | "sidebarMeio" | "sidebarMeio2" | "sidebarBase" | "principalMobile" | "principalDesktop";
  className?: string;
};

export function Ads({ variant, className }: AdsProps) {
  switch (variant) {
    case "sidebarTopo":
      return <div id="div-gpt-ad-1469728895277-2" className={className} style={{ minWidth: 300, minHeight: 250 }} />;

    case "sidebarMeio":
      return <div id="div-gpt-ad-1469728895277-1" className={className} style={{ minWidth: 300, minHeight: 250 }} />;

    case "sidebarMeio2":
      return <div id="div-gpt-ad-1469728895277-3" className={className} style={{ minWidth: 300, minHeight: 250 }} />;

    case "sidebarBase":
      return <div id="div-gpt-ad-1469728895277-0" className={className} style={{ minWidth: 300, minHeight: 250 }} />;

    case "principalMobile":
      return <div id="div-gpt-ad-1469728895277-4" className={className} style={{ minWidth: 320, minHeight: 50 }} />;

    case "principalDesktop":
      return <div id="div-gpt-ad-1469728895277-5" className={className} style={{ minWidth: 728, minHeight: 90 }} />;

    default:
      return <div />;
  }
}
