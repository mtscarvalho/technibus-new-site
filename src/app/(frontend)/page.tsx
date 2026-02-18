import { createMetadata } from "@/utilities/create-metadata";

import { Button } from "@/components/Button";

export function generateMetadata() {
  return createMetadata({
    path: "/",
    title: "Minha empresa | Slogan",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  });
}

export default function Page() {
  return (
    <main>
      <section className="bg-secondary py-24">
        <div className="container grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">Lorem ipsum dolor sit amet</h1>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum harum adipisci quisquam perferendis molestiae voluptate ea debitis consequatur porro repellat?</p>
            </div>
            <Button size="md" variant="primary">
              Inscreva-se
            </Button>
          </div>
          <div></div>
        </div>
      </section>
    </main>
  );
}
