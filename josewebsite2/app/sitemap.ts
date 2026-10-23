import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/music", "/links"].map((pathname) => ({
    url: `https://joseisaivaldez.com${pathname}`,
  }));
}
