// Trivial worker: echoes back a computed value so the page knows we ran.
self.onmessage = function (e) {
  self.postMessage({ echo: e.data, computed: e.data * 2 });
};
