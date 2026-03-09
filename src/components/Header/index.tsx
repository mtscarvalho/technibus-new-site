import { fetchAllCategories } from "@/collections/Categories/data";

import { Button } from "@/components/Button";
import { Menu } from "@/components/Menu";
import { Topbar } from "@/components/Topbar";
import { fetchTopbar } from "@/components/Topbar/data";

export async function Header() {
  const categories = await fetchAllCategories();
  const topbar = await fetchTopbar();

  return (
    <header>
      <Button variant="neutral" className="skip-to-main" asChild>
        <a href="#conteudo">Pular para o conteúdo</a>
      </Button>
      <Topbar {...topbar} />
      <Menu categories={categories} />
    </header>
  );
}
