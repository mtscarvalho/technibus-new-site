import { fetchMenu } from "@/globals/MainMenu/data";

import { Menu } from "@/components/Menu";

export async function Header() {
  const menu = await fetchMenu();

  return (
    <header>
      <Menu menu={menu} />
    </header>
  );
}
