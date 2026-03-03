import { fetchAllCategories } from "@/collections/Categories/data";

import { Menu } from "@/components/Menu";
import { Topbar } from "@/components/Topbar";
import { fetchTopbar } from "@/components/Topbar/data";

export async function Header() {
  const categories = await fetchAllCategories();
  const topbar = await fetchTopbar();

  return (
    <header>
      <Topbar {...topbar} />
      <Menu categories={categories} />
    </header>
  );
}
