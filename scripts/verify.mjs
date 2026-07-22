import puppeteer from "puppeteer-core";

const PAGES = [
  "css-animations.html",
  "gsap.html",
  "anime.html",
  "motion-one.html",
  "framer-motion.html",
  "lottie.html",
  "video.html",
  "boundaries.html",
];

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--autoplay-policy=no-user-gesture-required", "--window-size=1280,900"],
});

const shotDir = process.argv[2] || ".";
let failures = 0;

for (const p of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://localhost:8000/${p}`, { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, 6000)); // past the 5s NO SIGNAL deadline
  const badges = await page.evaluate(() =>
    [...document.querySelectorAll("[data-check]")].map(
      (c) => c.dataset.check + ": " + c.querySelector(".badge").textContent
    )
  );
  console.log(`\n=== ${p} ===`);
  for (const b of badges) {
    console.log("  " + b);
    if (!b.includes("PASS")) failures++;
  }
  if (errors.length) console.log("  PAGE ERRORS: " + errors.join(" ; "));
  await page.screenshot({ path: `${shotDir}/${p.replace(".html", "")}.png` });
  await page.close();
}

await browser.close();
console.log(`\nDone. ${failures} non-PASS badge(s).`);
