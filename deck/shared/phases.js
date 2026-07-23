/* Slide-04 shared pieces: a small animated GPU (die + pipe + HBM) whose
   thermal state can be driven, echoing the slide-02 anatomy. */
var PH = {
  model: "70B dense · BF16",
  caption: "Same model. Same GPU. Two different workloads.",

  gpuHTML: function (id) {
    var tiles = "";
    for (var i = 0; i < 24; i++) tiles += "<i></i>";
    var kvcap = "";
    return '<div class="phgpu" id="' + id + '">' +
      '<div class="ph-die"><div class="ph-tiles">' + tiles + "</div>" +
      '<div class="ph-lab">Processor</div><div class="ph-util">util <b>—</b></div></div>' +
      '<div class="ph-pipe"><i></i><i></i><i></i><i></i><i></i><div class="ph-plab">HBM ⇄ die</div></div>' +
      '<div class="ph-hbm">' +
      '<div class="ph-w">weights<br>140 GB</div>' +
      '<div class="ph-kv"><span class="ph-kvlab">KV</span><div class="ph-kvrows"></div></div>' +
      '<div class="ph-batch">batch</div>' +
      '<div class="ph-lab">HBM</div></div>' +
      "</div>";
  },

  mix: function (c1, c2, t) {
    return "rgb(" + Math.round(c1[0] + (c2[0] - c1[0]) * t) + "," +
      Math.round(c1[1] + (c2[1] - c1[1]) * t) + "," + Math.round(c1[2] + (c2[2] - c1[2]) * t) + ")";
  },

  // h: 0 = idle blue, 1 = saturated red
  setDie: function (gpu, h) {
    var col = PH.mix([57, 135, 229], [224, 75, 56], h);
    gpu.querySelectorAll(".ph-tiles i").forEach(function (t, i) {
      t.style.background = col;
      t.style.opacity = 0.25 + 0.75 * h * ((i * 37) % 10 > 1 ? 1 : 0.55);
    });
    var die = gpu.querySelector(".ph-die");
    die.style.borderColor = col;
    die.style.boxShadow = h > 0.4 ? "0 0 " + (26 * h) + "px " + PH.mix([57, 135, 229], [224, 75, 56], h).replace("rgb", "rgba").replace(")", ",0.7)") : "none";
  },
  setUtil: function (gpu, text) {
    gpu.querySelector(".ph-util b").textContent = text;
  },
  setPipe: function (gpu, h) {
    var col = PH.mix([47, 214, 176], [224, 75, 56], h);
    var pipe = gpu.querySelector(".ph-pipe");
    pipe.style.borderColor = col;
    pipe.style.boxShadow = h > 0.4 ? "0 0 " + (24 * h) + "px rgba(224,75,56," + 0.7 * h + ")" : "none";
    pipe.querySelectorAll("i").forEach(function (d) {
      d.style.background = col;
      d.style.animationDuration = (1.3 - h * 1.05) + "s";
    });
  },
  addKV: function (gpu, warn) {
    var rows = gpu.querySelector(".ph-kvrows");
    if (rows.children.length >= 12) {
      gpu.querySelector(".ph-kv").classList.add("full");
      gpu.querySelector(".ph-batch").classList.add("squeezed");
      return;
    }
    var r = document.createElement("b");
    rows.appendChild(r);
    if (rows.children.length >= 9 || warn) gpu.querySelector(".ph-kv").classList.add("warn");
  },
  clearKV: function (gpu) {
    gpu.querySelector(".ph-kvrows").innerHTML = "";
    gpu.querySelector(".ph-kv").classList.remove("warn", "full");
    gpu.querySelector(".ph-batch").classList.remove("squeezed");
  },
  reset: function (gpu) {
    PH.setDie(gpu, 0); PH.setPipe(gpu, 0); PH.setUtil(gpu, "—"); PH.clearKV(gpu);
  },
};
