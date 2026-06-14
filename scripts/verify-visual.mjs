import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const appUrl = "http://127.0.0.1:5173/";
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const outputDir = new URL("../artifacts/", import.meta.url);

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: chromePath,
  args: ["--no-sandbox", "--disable-gpu"]
});

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 940 }, deviceScaleFactor: 1 });
  const desktopErrors = collectConsoleErrors(desktop);

  await desktop.goto(appUrl, { waitUntil: "domcontentloaded" });
  await desktop.waitForSelector("canvas", { timeout: 15000 });
  await desktop.waitForTimeout(1200);

  const desktopMetrics = await collectPageMetrics(desktop);
  assert(desktopMetrics.title === "Atomix Lab", "Desktop title should be Atomix Lab.");
  assert(desktopMetrics.canvasCount >= 1, "Desktop should render at least one WebGL canvas.");
  assert(desktopMetrics.canvases[0]?.nonBlackSamples > 0, "Desktop atom canvas should not be blank.");
  assert(desktopMetrics.hasAtomixBrand, "Desktop should show Atomix Lab branding.");

  await desktop.screenshot({ path: artifactPath("desktop-dashboard.png"), fullPage: false });

  await desktop.getByTestId("open-periodic-table").click();
  await desktop.getByTestId("periodic-H").waitFor({ state: "visible", timeout: 5000 });
  const periodicCellCount = await desktop.locator("[data-testid^='periodic-']").count();
  assert(periodicCellCount === 118, `Periodic table should render 118 elements, got ${periodicCellCount}.`);
  await desktop.waitForTimeout(350);
  await desktop.screenshot({ path: artifactPath("desktop-periodic-full.png"), fullPage: false });
  await desktop.getByTestId("periodic-Og").click();
  await desktop.waitForTimeout(600);
  const selectedText = await desktop.locator(".element-identity").innerText();
  assert(selectedText.includes("Og"), "Selecting Oganesson from the periodic table should update the dashboard.");
  const ogMetrics = await collectPageMetrics(desktop);
  assert(ogMetrics.canvases[0]?.nonBlackSamples > 0, "Oganesson atom canvas should not be blank.");

  await desktop.getByTestId("start-today-experiment").click();
  await desktop.getByText("오늘의 실험: H₂O 만들기").waitFor({ state: "visible", timeout: 5000 });
  await desktop.getByTestId("palette-H").click();
  await desktop.getByTestId("palette-O").click();
  await desktop.getByTestId("palette-H").click();
  await desktop.getByTestId("molecule-success").waitFor({ state: "visible", timeout: 5000 });
  const successText = await desktop.getByTestId("molecule-success").innerText();
  assert(successText.includes("Water"), "Water molecule success toast should appear.");
  await desktop.waitForTimeout(900);
  const moleculeMetrics = await collectPageMetrics(desktop);
  assert(moleculeMetrics.canvases[0]?.nonBlackSamples > 0, "Molecule canvas should not be blank.");
  await desktop.screenshot({ path: artifactPath("desktop-lab-water.png"), fullPage: false });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true
  });
  const mobileErrors = collectConsoleErrors(mobile);

  await mobile.goto(appUrl, { waitUntil: "domcontentloaded" });
  await mobile.waitForSelector("canvas", { timeout: 15000 });
  await mobile.waitForTimeout(1200);
  const mobileMetrics = await collectPageMetrics(mobile);
  assert(mobileMetrics.canvasCount >= 1, "Mobile should render a WebGL canvas.");
  assert(mobileMetrics.canvases[0]?.nonBlackSamples > 0, "Mobile atom canvas should not be blank.");
  assert(
    mobileMetrics.scrollWidth <= mobileMetrics.viewportWidth + 4,
    `Mobile layout should not overflow horizontally. scrollWidth=${mobileMetrics.scrollWidth}, viewport=${mobileMetrics.viewportWidth}`
  );
  await mobile.screenshot({ path: artifactPath("mobile-dashboard.png"), fullPage: false });

  assert(desktopErrors.length === 0, `Desktop console errors: ${desktopErrors.join("\n")}`);
  assert(mobileErrors.length === 0, `Mobile console errors: ${mobileErrors.join("\n")}`);

  console.log(
    JSON.stringify(
      {
        status: "ok",
        desktopMetrics,
        moleculeMetrics,
        mobileMetrics,
        screenshots: [
          "artifacts/desktop-dashboard.png",
          "artifacts/desktop-periodic-full.png",
          "artifacts/desktop-lab-water.png",
          "artifacts/mobile-dashboard.png"
        ]
      },
      null,
      2
    )
  );
} finally {
  await browser.close();
}

function collectConsoleErrors(page) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
  return errors;
}

function artifactPath(filename) {
  return fileURLToPath(new URL(filename, outputDir));
}

async function collectPageMetrics(page) {
  return page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll("canvas")).map((canvas) => {
      const rect = canvas.getBoundingClientRect();
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      const samples = [];
      let nonBlackSamples = 0;

      if (gl) {
        const points = [
          [0.5, 0.5],
          [0.45, 0.5],
          [0.55, 0.5],
          [0.5, 0.42],
          [0.5, 0.58]
        ];

        for (const [xRatio, yRatio] of points) {
          const pixels = new Uint8Array(4);
          const x = Math.floor(canvas.width * xRatio);
          const y = Math.floor(canvas.height * yRatio);
          gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
          const sample = Array.from(pixels);
          samples.push(sample);
          if (sample[0] + sample[1] + sample[2] > 24) {
            nonBlackSamples += 1;
          }
        }
      }

      return {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        samples,
        nonBlackSamples
      };
    });

    return {
      title: document.title,
      hasAtomixBrand: document.body.innerText.includes("Atomix Lab"),
      canvasCount: canvases.length,
      canvases,
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth
    };
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
