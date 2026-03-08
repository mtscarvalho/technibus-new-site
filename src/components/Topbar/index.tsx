import { Topbar as TopbarGlobalType } from "@/payload-types";

import { Countdown } from "@/components/Countdown";
import { RichText } from "@/components/RichText";

type TopbarProps = TopbarGlobalType;

export function Topbar({ enable, content, countdownDate, backgroundColor, theme }: TopbarProps) {
  if (!enable) return null;

  return (
    <div className="text-primary py-3" data-theme={theme} style={{ background: backgroundColor }}>
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
          {content && <RichText data={content} />}
          {countdownDate && <Countdown className="max-lg:order-last max-lg:basis-full" targetDate={countdownDate} />}
        </div>
      </div>
    </div>
  );
}
