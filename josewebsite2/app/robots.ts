import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/test-portfolio", "/api/"] },
    sitemap: "https://joseisaivaldez.com/sitemap.xml",
  };
}
