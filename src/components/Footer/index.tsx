import Link from "next/link";

// import { fetchSocials } from "@/globals/Social/data";
import { getCurrentYear } from "@/utilities/get-current-year";

import { Button } from "@/components/Button";

export async function Footer() {
  //   const socialFetch = await fetchSocials();

  //   const socials = [
  //     { ...socialFetch.facebook, icon: Facebook },
  //     { ...socialFetch.youtube, icon: YouTube },
  //     { ...socialFetch.instagram, icon: Instagram },
  //     { ...socialFetch.threads, icon: Threads },
  //     { ...socialFetch.x, icon: X },
  //     { ...socialFetch.linkedin, icon: LinkedIn },
  //     { ...socialFetch.tiktok, icon: TikTok },
  //     { ...socialFetch.whatsapp, icon: WhatsApp },
  //   ];

  return (
    <footer className="bg-default text-primary py-12" data-theme="dark">
      <div className="container grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Boilerplate</h2>
          <p className="text-sm">
            © {getCurrentYear()} Boilerplate . <br />
            Todos os direitos reservados. <br />
            Site criado por Jogajunto
          </p>
          {/* {socials.length > 0 && (
            <ul className="flex flex-wrap">
              {socials.map(
                ({ url, title, icon: Icon }) =>
                  url && (
                    <li key={title}>
                      <Link className="block p-1" href={url} aria-label={title}>
                        <Icon className="size-6" />
                      </Link>
                    </li>
                  ),
              )}
            </ul>
          )} */}
        </div>
        <div className="space-y-2">
          <h2 className="border-default text-primary-secondary border-b pb-3 font-semibold">Gotex Show</h2>
          <ul className="-translate-x-3">
            <li>
              <Button size="sm" variant="subtle" asChild>
                <Link href="/">Lero</Link>
              </Button>
            </li>
            <li>
              <Button size="sm" variant="subtle" asChild>
                <Link href="/">Lero</Link>
              </Button>
            </li>
            <li>
              <Button size="sm" variant="subtle" asChild>
                <Link href="/">Lero</Link>
              </Button>
            </li>
            <li>
              <Button size="sm" variant="subtle" asChild>
                <Link href="/">Lero</Link>
              </Button>
            </li>
            <li>
              <Button size="sm" variant="subtle" asChild>
                <Link href="/">Lero</Link>
              </Button>
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <h2 className="border-default text-primary-secondary border-b pb-3 font-semibold">Gotex Show</h2>
          <ul className="-translate-x-3">
            <li>
              <Button size="sm" variant="subtle" asChild>
                <Link href="/">Lero</Link>
              </Button>
            </li>
            <li>
              <Button size="sm" variant="subtle" asChild>
                <Link href="/">Lero</Link>
              </Button>
            </li>
            <li>
              <Button size="sm" variant="subtle" asChild>
                <Link href="/">Lero</Link>
              </Button>
            </li>
            <li>
              <Button size="sm" variant="subtle" asChild>
                <Link href="/">Lero</Link>
              </Button>
            </li>
            <li>
              <Button size="sm" variant="subtle" asChild>
                <Link href="/">Lero</Link>
              </Button>
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <h2 className="border-default text-primary-secondary border-b pb-3 font-semibold">Gotex Show</h2>
          <ul className="-translate-x-3">
            <li>
              <Button size="sm" variant="subtle" asChild>
                <Link href="/">Lero</Link>
              </Button>
            </li>
            <li>
              <Button size="sm" variant="subtle" asChild>
                <Link href="/">Lero</Link>
              </Button>
            </li>
            <li>
              <Button size="sm" variant="subtle" asChild>
                <Link href="/">Lero</Link>
              </Button>
            </li>
            <li>
              <Button size="sm" variant="subtle" asChild>
                <Link href="/">Lero</Link>
              </Button>
            </li>
            <li>
              <Button size="sm" variant="subtle" asChild>
                <Link href="/">Lero</Link>
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
