// Click through a deck page step by step, verifying the engine pauses between
// steps, completes, loops, and resets. Screenshots each paused state.
import puppeteer from "puppeteer-core";

const page_ = process.argv[2] || "01-qkt-matmul.html";
const outDir = process.argv[3] || ".";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--window-size=1400,900"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 880 });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
await page.goto(`http://localhost:8000/deck/${page_}`, { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 800));

const state = () => page.evaluate(() => {
  const tl = DECK._tl();
  return { paused: tl.paused(), progress: +tl.progress().toFixed(3) };
});

async function shot(name) {
  await page.screenshot({ path: `${outDir}/deck-${name}.png` });
}

console.log("initial:", JSON.stringify(await state()));
await shot("step0");

for (let s = 1; s <= 7; s++) {
  await page.mouse.click(700, 400);
  // wait for the step's motion to finish (engine pauses at the next mark)
  for (let w = 0; w < 40; w++) {
    await new Promise((r) => setTimeout(r, 250));
    const st = await state();
    if (st.paused || st.progress >= 1) break;
  }
  const st = await state();
  console.log(`after click ${s}:`, JSON.stringify(st));
  await shot(`step${s}`);
  if (st.progress >= 1) { console.log(`page complete after ${s} clicks`); break; }
}

// impatient double-click test: reset, click twice fast, expect state = end of step 2
await page.click("#dk-reset");
await new Promise((r) => setTimeout(r, 300));
await page.mouse.click(700, 400);
await new Promise((r) => setTimeout(r, 200));
await page.mouse.click(700, 400); // mid-motion: should snap to end of step 1
await new Promise((r) => setTimeout(r, 400));
console.log("after fast double-click:", JSON.stringify(await state()));

// loop test
await page.click("#dk-loop");
await new Promise((r) => setTimeout(r, 4000));
const loopSt = await state();
console.log("looping (should be unpaused):", JSON.stringify(loopSt));

// reset test
await page.click("#dk-reset");
await new Promise((r) => setTimeout(r, 400));
console.log("after reset:", JSON.stringify(await state()));
await shot("after-reset");

console.log(errors.length ? "ERRORS: " + errors.join(" | ") : "no console errors");
await browser.close();
