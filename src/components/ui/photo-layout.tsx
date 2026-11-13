"use client";

import Image from "next/image";
import type { MediaItem, PhotoLayout } from "@/lib/diary/types";
import { blurDataURL, cn } from "@/lib/utils";

type Props = {
  media: MediaItem[];
  layout?: PhotoLayout;
  className?: string;
};

function Frame({
  item,
  className,
  sizes,
}: {
  item: MediaItem;
  className?: string;
  sizes: string;
}) {
  if (item.type === "video") {
    return (
      <div className={cn("relative overflow-hidden bg-[var(--bg-elevated)]", className)}>
        <video
          className="h-full w-full object-cover"
          controls
          playsInline
          poster={item.poster}
          preload="metadata"
        >
          <source src={item.src} />
        </video>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-[var(--bg-elevated)]", className)}>
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes={sizes}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className="object-cover"
      />
      {item.caption && (
        <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-xs text-white">
          {item.caption}
        </p>
      )}
    </div>
  );
}

export function PhotoLayoutView({ media, layout = "single", className }: Props) {
  const photos = media.filter((m) => m.type === "image" || m.type === "video");
  if (photos.length === 0) return null;

  const mode =
    photos.length === 1
      ? "single"
      : layout === "single" && photos.length > 1
        ? "grid"
        : layout;

  if (mode === "single" || photos.length === 1) {
    return (
      <div className={className}>
        <Frame
          item={photos[0]}
          className="aspect-[16/11] w-full"
          sizes="(max-width:768px) 100vw, 640px"
        />
      </div>
    );
  }

  if (mode === "split") {
    return (
      <div className={cn("grid grid-cols-2 gap-1", className)}>
        {photos.slice(0, 2).map((p) => (
          <Frame
            key={p.src}
            item={p}
            className="aspect-[3/4]"
            sizes="(max-width:768px) 50vw, 320px"
          />
        ))}
      </div>
    );
  }

  if (mode === "stack") {
    return (
      <div className={cn("relative mx-auto h-80 w-full max-w-sm", className)}>
        {photos.slice(0, 3).map((p, i) => (
          <div
            key={p.src}
            className="absolute inset-x-8 top-2 overflow-hidden border border-[var(--line)] shadow-[var(--photo-shadow)]"
            style={{
              transform: `rotate(${(i - 1) * 4}deg) translateY(${i * 14}px)`,
              zIndex: 3 - i,
            }}
          >
            <Frame item={p} className="aspect-[3/4]" sizes="280px" />
          </div>
        ))}
      </div>
    );
  }

  if (mode === "collage") {
    if (photos.length === 2) {
      return (
        <div className={cn("grid grid-cols-2 gap-1", className)}>
          <Frame item={photos[0]} className="aspect-[3/4]" sizes="50vw" />
          <Frame item={photos[1]} className="aspect-[3/4]" sizes="50vw" />
        </div>
      );
    }
    if (photos.length === 3) {
      return (
        <div
          className={cn(
            "grid h-[420px] grid-cols-2 grid-rows-2 gap-1 sm:h-[480px]",
            className,
          )}
        >
          <Frame
            item={photos[0]}
            className="row-span-2 h-full"
            sizes="50vw"
          />
          <Frame item={photos[1]} className="h-full" sizes="50vw" />
          <Frame item={photos[2]} className="h-full" sizes="50vw" />
        </div>
      );
    }
    return (
      <div className={cn("grid grid-cols-2 gap-1", className)}>
        <Frame item={photos[0]} className="aspect-square" sizes="50vw" />
        <Frame item={photos[1]} className="aspect-square" sizes="50vw" />
        <Frame item={photos[2]} className="aspect-square" sizes="50vw" />
        <Frame item={photos[3]} className="aspect-square" sizes="50vw" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-1",
        photos.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3",
        className,
      )}
    >
      {photos.map((p) => (
        <Frame
          key={p.src}
          item={p}
          className="aspect-square"
          sizes="(max-width:768px) 50vw, 220px"
        />
      ))}
    </div>
  );
}

export const LAYOUT_OPTIONS: {
  id: PhotoLayout;
  label: string;
  hint: string;
}[] = [
  { id: "single", label: "Single", hint: "One hero photo" },
  { id: "split", label: "Split", hint: "Side by side" },
  { id: "collage", label: "Collage", hint: "Mixed sizes" },
  { id: "grid", label: "Grid", hint: "Equal tiles" },
  { id: "stack", label: "Stack", hint: "Layered cards" },
];
