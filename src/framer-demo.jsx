import React from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";

function Demo() {
  const [visible, setVisible] = React.useState(true);
  const [reported, setReported] = React.useState(false);

  return (
    <div>
      <motion.div
        className="box"
        animate={{ x: [0, 220, 0], rotate: [0, 180, 360], borderRadius: ["12%", "50%", "12%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        onUpdate={() => {
          if (!reported) {
            setReported(true);
            window.reportPass("framer-loop", "motion.div animating (onUpdate fired)");
          }
        }}
      />
      <motion.div
        className="box box-spring"
        drag
        dragConstraints={{ left: -80, right: 80, top: -40, bottom: 40 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
      >
        drag me
      </motion.div>
      <div className="row">
        <button onClick={() => setVisible((v) => !v)}>Toggle enter/exit (AnimatePresence)</button>
        <AnimatePresence>
          {visible && (
            <motion.div
              className="box box-presence"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

try {
  const root = createRoot(document.getElementById("react-root"));
  root.render(<Demo />);
  window.reportPass("framer-mount", "React root mounted, Framer Motion components rendered");
} catch (e) {
  window.reportFail("framer-mount", e.message);
}
