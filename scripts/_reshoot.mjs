import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new", args: ["--window-size=1400,900"],
});
const out = "/private/tmp/claude-501/-Users-junyi-internal-pre/ccaa11e1-c750-49f2-bf84-9bb995cd404f/scratchpad";
for (const [p, waits] of [["2-matmul.html", [4000, 14000]], ["8-spotlight.html", [2500, 4500]]]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 880 });
  await page.goto(`http://localhost:8000/attention/${p}`, { waitUntil: "load" });
  let t = 0;
  for (let n = 0; n < waits.length; n++) {
    await new Promise(r => setTimeout(r, waits[n] - t)); t = waits[n];
    await page.screenshot({ path: `${out}/fix-${p.replace(".html","")}-${n}.png` });
  }
  await page.close();
}
await browser.close();
console.log("done");
