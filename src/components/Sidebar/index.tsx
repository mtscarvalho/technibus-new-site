import { Ads } from "@/components/Ads";
import { MostRead } from "@/components/MostRead";

export function Sidebar() {
  return (
    <aside className="space-y-6">
      <Ads className="max-lg:hidden" position="sidebar-top" />
      <MostRead />
      <Ads className="max-lg:hidden" position="sidebar-middle" />
      <Ads className="max-lg:hidden" position="sidebar-bottom-premium" />
    </aside>
  );
}
