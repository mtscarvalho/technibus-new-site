type AdsProps = {
  variant: "sidebarTopo" | "sidebarMeio" | "sidebarMeio2" | "sidebarBase" | "principalMobile" | "principalDesktop";
  className?: string;
};

export function Ads({ variant, className }: AdsProps) {
  switch (variant) {
    case "sidebarTopo":
      return (
        // /334660191/TB-barra_direita-300xX-topo
        <div id="div-gpt-ad-1773058261868-0" className={className} style={{ minWidth: 300, minHeight: 250 }} />
      );

    case "sidebarMeio":
      return (
        // /334660191/TB-barra_direita-300xX-meio
        <div id="div-gpt-ad-1773055055101-0" className={className} style={{ minWidth: 300, minHeight: 250 }} />
      );

    case "sidebarMeio2":
      return (
        // /334660191/TB-barra_direita-300xX-meio-2
        <div id="div-gpt-ad-1773055055713-0" className={className} style={{ minWidth: 300, minHeight: 250 }} />
      );

    case "sidebarBase":
      return (
        // /334660191/TB-barra_direita-300xX-base
        <div id="div-gpt-ad-1773055047019-0" className={className} style={{ minWidth: 300, minHeight: 250 }} />
      );

    case "principalMobile":
      return (
        // /334660191/TB-principal-320xX-mobile
        <div id="div-gpt-ad-1773055056838-0" className={className} style={{ minWidth: 320, minHeight: 50 }} />
      );

    case "principalDesktop":
      return (
        // /334660191/TB-principal-970xX-desktop
        <div id="div-gpt-ad-1773055057390-0" className={className} style={{ minWidth: 728, minHeight: 90 }} />
      );

    default:
      return <div />;
  }
}
