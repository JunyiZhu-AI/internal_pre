// Screenshot each attention variant at two timepoints + collect console errors.
import puppeteer from "puppeteer-core";

const PAGES = ["index.html", "1-pipeline.html", "2-matmul.html", "3-softmax.html",
  "4-graph.html", "5-formula.html", "6-isometric.html", "7-terminal.html", "8-spotlight.html"];
const outDir = process.argv[2] || ".";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--window-size=1400,900"],
});

for (const p of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 880 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(`http://localhost:8000/attention/${p}`, { waitUntil: "load" });
  const base = p.replace(".html", "");
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({ path: `${outDir}/att-${base}-a.png` });
  await new Promise((r) => setTimeout(r, 5000));
  await page.screenshot({ path: `${outDir}/att-${base}-b.png` });
  console.log(`${p}: ${errors.length ? "ERRORS: " + errors.join(" | ") : "no console errors"}`);
  await page.close();
}
await browser.close();
