import { expect, test, type Page } from "@playwright/test";

const EVIDENCE = "docs/evidence";

async function open(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    if (m.location().url.endsWith("/favicon.ico")) return;
    errors.push(m.text());
  });
  await page.goto("/");
  await page.waitForFunction(() => Boolean(window.trackAToy), null, {
    timeout: 30_000,
  });
  await page.waitForTimeout(900);
  return errors;
}

test("the globe draws and the first toy is loaded", async ({ page }) => {
  const errors = await open(page);
  const state = await page.evaluate(() => ({
    toy: window.trackAToy!.toyId(),
    stage: window.trackAToy!.stageIndex(),
    count: window.trackAToy!.stageCount(),
    problems: window.trackAToy!.problems,
  }));
  expect(state.problems).toEqual([]);
  expect(state.toy).toBe("wooden-blocks");
  expect(state.stage).toBe(0);
  expect(state.count).toBeGreaterThanOrEqual(5);
  await expect(page.locator(".card__title")).not.toBeEmpty();
  await page.screenshot({ path: `${EVIDENCE}/01-blocks-start.png` });
  expect(errors).toEqual([]);
});

test("all seven toys are offered and each one loads a journey", async ({
  page,
}) => {
  const errors = await open(page);
  const buttons = page.locator(".picker__toy");
  await expect(buttons).toHaveCount(7);
  for (const name of [
    "Wooden blocks",
    "LEGO bricks",
    "A birthday balloon",
    "A unicorn and a dinosaur",
    "Barbie",
    "A monster truck",
    "A walkie talkie",
  ]) {
    await page.getByRole("button", { name, exact: false }).first().click();
    await page.waitForTimeout(350);
    await expect(page.locator(".panel__toy")).toHaveText(name);
    const count = await page.evaluate(() => window.trackAToy!.stageCount());
    expect(count).toBeGreaterThanOrEqual(5);
  }
  expect(errors).toEqual([]);
});

test("the balloon follows helium out past the sky", async ({ page }) => {
  const errors = await open(page);
  await page
    .getByRole("button", { name: "A birthday balloon" })
    .first()
    .click();
  await page.waitForTimeout(400);
  const count = await page.evaluate(() => window.trackAToy!.stageCount());
  for (let i = 0; i < count - 1; i++) {
    await page.getByRole("button", { name: /Next stop/ }).click();
    await page.waitForTimeout(260);
  }
  await expect(page.locator(".card__place")).toContainText("Space");
  await expect(
    page.getByRole("button", { name: "Journey complete" }),
  ).toBeVisible();
  await page.screenshot({ path: `${EVIDENCE}/02-balloon-space.png` });
  expect(errors).toEqual([]);
});

test("every measured fact shows a badge and a source", async ({ page }) => {
  const errors = await open(page);
  await page.getByRole("button", { name: "A monster truck" }).first().click();
  await page.waitForTimeout(400);
  const badges = page.locator(".fact__badge--measured");
  expect(await badges.count()).toBeGreaterThan(0);
  await page.locator(".card__sources summary").click();
  await expect(page.locator(".card__sourcelist a").first()).toHaveAttribute(
    "href",
    /^https:\/\//,
  );
  await page.screenshot({ path: `${EVIDENCE}/03-truck-sources.png` });
  expect(errors).toEqual([]);
});

test("the journey adds up the kilometres travelled", async ({ page }) => {
  await open(page);
  await page.getByRole("button", { name: "A walkie talkie" }).first().click();
  await page.waitForTimeout(400);
  await expect(page.locator(".controls__distance")).toContainText(
    "The journey starts here",
  );
  await page.getByRole("button", { name: /Next stop/ }).click();
  await page.waitForTimeout(400);
  await expect(page.locator(".controls__distance")).toContainText("km");
  const km = await page.evaluate(() => window.trackAToy!.routeKm());
  expect(km).toBeGreaterThan(10_000);
  await page.screenshot({ path: `${EVIDENCE}/04-walkie.png` });
});

test("it works on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  const next = page.getByRole("button", { name: /Next stop/ });
  await expect(next).toBeVisible();
  expect((await next.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({ path: `${EVIDENCE}/05-phone.png` });
});
