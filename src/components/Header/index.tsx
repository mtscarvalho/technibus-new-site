import { fetchAllCategories } from "@/collections/Categories/data";
import { Menu } from "@/components/Menu";

export async function Header() {
  const categories = await fetchAllCategories();

  return (
    <header>
      <Menu categories={categories} />
    </header>
  );
}
