import { expect, test } from "@playwright/test";

test("home page smoke: no console errors and carousel interaction works", async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().startsWith("Failed to load resource")) {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.getByRole("link", { name: "JOSÉ ISAÍ VALDEZ" })).toBeVisible();

  const main = page.locator("main");
  const portfolioHeading = main.getByRole("heading", { name: "Music Portfolio" }).first();
  await portfolioHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(450);
  const openCard = main.getByRole("button", { name: /^Open / }).first();
  await expect(openCard).toBeVisible({ timeout: 15_000 });
  await openCard.scrollIntoViewIfNeeded();
  await openCard.click();
  await page.waitForTimeout(450);
  let playCandidates = main.locator('button[aria-label^="Play "][tabindex="0"]');
  if ((await playCandidates.count()) === 0) {
    // First tap can center the card; second tap flips it open.
    await openCard.click();
    await page.waitForTimeout(450);
    playCandidates = main.locator('button[aria-label^="Play "][tabindex="0"]');
  }

  const playButton = playCandidates.first();
  await expect(playButton).toBeVisible();
  if (!(await playButton.isDisabled())) {
    await playButton.click({ force: true });
  }

  await expect(main.locator('a[tabindex="0"]', { hasText: "APPLE MUSIC" }).first()).toBeVisible();

  expect(
    consoleErrors,
    `Unexpected console errors:\n${consoleErrors.join("\n")}`
  ).toEqual([]);
  expect(
    pageErrors,
    `Unexpected page errors:\n${pageErrors.join("\n")}`
  ).toEqual([]);
});
