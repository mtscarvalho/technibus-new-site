"use client";

import { useRef } from "react";
import ReactDOMServer from "react-dom/server";
import { Swiper, SwiperProps, SwiperSlide } from "swiper/react";

import { Post } from "@/payload-types";

import { A11y, Autoplay, EffectFade, Pagination } from "swiper/modules";

import { cn } from "@/utilities/cn";

import "swiper/css";
import "swiper/css/effect-fade";

import { Card } from "../Card";

type FeaturedPostsProps = {
  posts: Post[];
};

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);

  const onAutoplayTimeLeft = (_: unknown, __: number, progress: number) => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${(1 - progress) * 100}%`;
    }
  };

  const swiperOptions: SwiperProps = {
    modules: [Pagination, A11y, EffectFade, Autoplay],
    effect: "fade",
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    onAutoplayTimeLeft,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: (index, className) =>
        ReactDOMServer.renderToStaticMarkup(
          <span className={cn("aria-current:bg-primary group border-brand-primary grid size-6 cursor-pointer place-items-center rounded-full border-2 bg-transparent", className)}>
            <span className="group-aria-current:bg-brand-primary block size-3 rounded-full bg-transparent" />
            <span className="sr-only">Página {index + 1}</span>
          </span>,
        ),
    },
  };

  return (
    <div>
      <div className="bg-primary flex flex-col rounded-lg">
        <div className="relative">
          <div className="absolute top-1 left-0 z-20 mx-1 h-1 w-full overflow-hidden rounded-t-lg bg-white/20">
            <div ref={progressBarRef} className="bg-brand-blue-500 h-full w-0 transition-[width] duration-100 ease-linear" />
          </div>

          <Swiper className="overflow-visible" {...swiperOptions}>
            {posts?.map((post) => (
              <SwiperSlide className="bg-primary h-auto! p-1" key={post.id}>
                <Card {...post} size="lg" />
              </SwiperSlide>
            ))}

            <div className="swiper-pagination z-10 mx-auto mt-2 flex max-w-max justify-center gap-4 rounded-3xl p-2.5" />
          </Swiper>
        </div>
      </div>
    </div>
  );
}
