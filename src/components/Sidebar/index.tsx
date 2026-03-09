import { Ads } from "@/components/Ads";
import { MostRead } from "@/components/MostRead";

export function Sidebar() {
  return (
    <aside className="space-y-6">
      <Ads className="max-lg:hidden" variant="sidebarTopo" />
      <MostRead />
      <Ads className="max-lg:hidden" variant="sidebarMeio" />
      <Ads className="max-lg:hidden" variant="sidebarMeio2" />
      <Ads className="max-lg:hidden" variant="sidebarBase" />
    </aside>
  );
}
