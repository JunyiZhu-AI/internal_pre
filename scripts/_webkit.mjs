import { webkit } from "playwright-core";
const pages = process.argv.slice(3);
const out = process.argv[2];
const browser = await webkit.launch();
for (const p of pages) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 880 } });
  const errs = [];
  page.on("pageerror", e => errs.push("PAGEERROR: " + e.message));
  page.on("console", m => { if (m.type() === "error" && !m.text().includes("favicon")) errs.push("CONSOLE: " + m.text()); });
  try {
    await page.goto(`http://localhost:8000/deck/${p}.html`, { waitUntil: "load", timeout: 15000 });
    await page.waitForTimeout(700);
    let done = 0;
    for (let c = 0; c < 5; c++) {
      await page.mouse.click(700, 60);
      for (let w = 0; w < 40; w++) {
        await page.waitForTimeout(200);
        const st = await page.evaluate(() => window.DECK && DECK._tl() ? { p: DECK._tl().paused(), g: DECK._tl().progress() } : null);
        if (!st || st.p || st.g >= 1) break;
      }
      done++;
      const fin = await page.evaluate(() => window.DECK && DECK._tl() ? DECK._tl().progress() >= 1 : "NO_TL");
      if (fin === true || fin === "NO_TL") { if (fin === "NO_TL") errs.push("NO TIMELINE REGISTERED"); break; }
    }
    await page.screenshot({ path: `${out}/wk-${p}.png` });
    console.log(p, "clicks:" + done, errs.length ? "| " + [...new Set(errs)].join(" || ").slice(0, 300) : "| clean");
  } catch (e) { console.log(p, "EXCEPTION:", e.message.slice(0, 150)); }
  await page.close();
}
await browser.close();
