export type HeroSlideType = "image" | "video" | "youtube";

export interface HeroSlide {
  id: string;
  type: HeroSlideType;
  media_url: string;
  title: string | null;
  subtitle: string | null;
  order_index: number;
  created_at?: string;
}

export interface AlbumImage {
  id: string;
  album_id: string;
  image_url: string;
  order_index: number;
  created_at?: string;
}

export interface Album {
  id: string;
  title: string;
  cover_image: string | null;
  created_at?: string;
  album_images?: AlbumImage[];
}

export type MediaCenterItemType = "video" | "photo" | "magazine";

export interface MediaCenterItem {
  id: string;
  type: MediaCenterItemType;
  title: string;
  media_url: string;
  thumbnail_url: string | null;
  pages: number | null;
  order_index: number;
  created_at?: string;
}

const absoluteUrlPattern = /^https?:\/\//i;

export function storagePublicUrl(bucket: string, pathOrUrl: string | null) {
  if (!pathOrUrl) return "";
  if (absoluteUrlPattern.test(pathOrUrl)) return pathOrUrl;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return pathOrUrl;

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${pathOrUrl}`;
}

export function heroMediaUrl(slide: Pick<HeroSlide, "type" | "media_url">) {
  return slide.type === "youtube"
    ? slide.media_url
    : storagePublicUrl("hero-media", slide.media_url);
}

export function galleryImageUrl(pathOrUrl: string | null) {
  return storagePublicUrl("gallery-images", pathOrUrl);
}

export function mediaCenterUrl(pathOrUrl: string | null) {
  return storagePublicUrl("media-center", pathOrUrl);
}

export function toYoutubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    let id = "";

    if (parsed.hostname.includes("youtu.be")) {
      id = parsed.pathname.replace("/", "");
    } else if (parsed.pathname.startsWith("/shorts/")) {
      id = parsed.pathname.split("/")[2] ?? "";
    } else if (parsed.pathname.startsWith("/embed/")) {
      id = parsed.pathname.split("/")[2] ?? "";
    } else {
      id = parsed.searchParams.get("v") ?? "";
    }

    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}` : url;
  } catch {
    return url;
  }
}

export function isStoragePath(pathOrUrl: string | null | undefined) {
  return Boolean(pathOrUrl && !absoluteUrlPattern.test(pathOrUrl));
}
