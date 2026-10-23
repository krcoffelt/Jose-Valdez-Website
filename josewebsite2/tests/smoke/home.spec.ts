import { expect, test } from "@playwright/test";
import path from "node:path";

const title = "You're Not Done Moving (Live)";
const audioFile = path.join(process.cwd(), "public/media/youre-not-done-moving-live.mp3");

test("loader completes and releases scrolling even when hero image fails", async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as Window & { layoutShiftScore: number };
    state.layoutShiftScore = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) state.layoutShiftScore += (entry as PerformanceEntry & { value: number }).value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.route("**/_next/image?*facetune*", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator(".loader-screen")).toHaveCount(0, { timeout: 8000 });
  await expect(page.locator("body")).not.toHaveClass(/site-loader-active/);
  expect(await page.evaluate(() => (window as Window & { layoutShiftScore: number }).layoutShiftScore)).toBeLessThan(0.01);
});

test("homepage media stays unloaded until requested", async ({ page }) => {
  const videoRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes(".mp4")) videoRequests.push(request.url());
  });
  await page.goto("/");
  await expect(page.locator(".loader-screen")).toHaveCount(0, { timeout: 8000 });
  await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  expect(videoRequests).toEqual([]);
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.getByRole("button", { name: `Play ${title} by Woodlands Worship`, exact: true }).click();
  await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0);
  expect(videoRequests.length).toBeGreaterThan(0);
  await page.locator("video").evaluate((video: HTMLVideoElement) => video.pause());
});

test("portfolio stays centered, hovers without scrolling, and opens a playable card", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".loader-screen")).toHaveCount(0, { timeout: 8000 });
  const heading = page.getByRole("heading", { name: "Music Portfolio", exact: true });
  await heading.scrollIntoViewIfNeeded();
  const rail = page.locator("[data-song-rail]");
  await expect(rail).toBeVisible();
  await rail.scrollIntoViewIfNeeded();
  const position = await rail.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return { center: bounds.left + bounds.width / 2, viewport: document.documentElement.clientWidth, scroll: element.scrollLeft, width: element.clientWidth, total: element.scrollWidth };
  });
  expect(Math.abs(position.center - position.viewport / 2)).toBeLessThan(2);
  const centered = rail.getByRole("button", { name: `Open ${title}`, exact: true }).nth(1);
  const bounds = await centered.boundingBox();
  expect(bounds).not.toBeNull();
  // Move the pointer directly; locator.hover() may itself scroll transformed ancestors.
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await expect.poll(() => rail.evaluate((element) => element.scrollLeft)).toBe(position.scroll);
  await page.mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await expect(rail.locator('button[aria-label="Play You\'re Not Done Moving (Live)"][tabindex="0"]')).toBeVisible();
  await expect(rail.locator('button[aria-label="Play You\'re Not Done Moving (Live)"][tabindex="0"]')).toBeEnabled();
  await rail.evaluate((element) => { element.scrollLeft += 300; });
  await expect.poll(() => rail.evaluate((element) => element.scrollLeft)).toBeGreaterThan(position.scroll + 250);
});

test("catalog audio plays, pauses, advances, and reports failed playback", async ({ page }) => {
  await page.route("**/storage/v1/object/public/Music/**", (route) => route.fulfill({ path: audioFile, contentType: "audio/mpeg" }));
  await page.goto("/music");
  await expect(page.locator(".loader-screen")).toHaveCount(0, { timeout: 8000 });
  await page.getByRole("button", { name: `Play ${title}`, exact: true }).click();
  await expect.poll(() => page.locator("audio").evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeGreaterThan(0);
  const dock = page.getByRole("region", { name: "Audio player" });
  await dock.getByRole("button", { name: "Pause", exact: true }).click();
  await expect.poll(() => page.locator("audio").evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(true);
  const before = await page.locator("audio").getAttribute("src");
  await dock.getByRole("button", { name: "Next", exact: true }).click();
  await expect.poll(() => page.locator("audio").getAttribute("src")).not.toBe(before);
  await expect.poll(() => page.locator("audio").evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeGreaterThan(0);
  await page.route("**/storage/v1/object/public/Music/**", (route) => route.abort());
  await dock.getByRole("button", { name: "Next", exact: true }).click();
  await expect(dock.getByRole("alert")).toBeVisible();
  await expect(dock.getByRole("button", { name: "Play", exact: true })).toBeVisible();
});

test("mobile layout fits and reduced-motion loader unlocks the page", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".loader-screen")).toHaveCount(0, { timeout: 8000 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("heading", { name: "Music Portfolio", exact: true }).scrollIntoViewIfNeeded();
  await expect(page.locator("[data-song-rail]")).toBeVisible();
  await expect(page.locator("body")).not.toHaveClass(/site-loader-active/);
});
