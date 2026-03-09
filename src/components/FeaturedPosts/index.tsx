"use client";

import ReactDOMServer from "react-dom/server";
import { Swiper, SwiperProps, SwiperSlide } from "swiper/react";

import { Post } from "@/payload-types";

import { A11y, EffectFade, Pagination } from "swiper/modules";

import { cn } from "@/utilities/cn";

import "swiper/css";
import "swiper/css/effect-fade";
import { Card } from "../Card";

type FeaturedPostsProps = {
  posts: Post[];
};

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  const swiperOptions: SwiperProps = {
    modules: [Pagination, A11y, EffectFade],
    effect: "fade",
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: (index, className) =>
        ReactDOMServer.renderToStaticMarkup(
          <span className={cn("aria-current:bg-primary group border-brand-primary grid size-6 cursor-pointer place-items-center rounded-full border-2 bg-transparent", className)}>
            <span className="group-aria-current:bg-brand-primary block size-3 rounded-full bg-transparent"></span>
            <span className="sr-only">Página {index + 1}</span>
          </span>,
        ),
    },
  };

  return (
    <div className="">
      <div className="bg-primary flex flex-col rounded-lg">
        <div className="relative">
          <Swiper className="overflow-visible" {...swiperOptions}>
            {posts?.map((post) => (
              <SwiperSlide className="bg-primary h-auto! p-1" key={post.id}>
                <Card {...post} size="lg" />
              </SwiperSlide>
            ))}
            <div className="swiper-pagination z-10 mx-auto mt-4 flex max-w-max justify-center gap-4 rounded-3xl bg-linear-to-t p-2.5"></div>
          </Swiper>
        </div>
      </div>
    </div>
  );
}
