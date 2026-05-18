import VisualizerPageHeader from "../components/VisualizerPageHeader";
import { useState } from "react";
import "../Array/array.css";
import "./stack.css";

function normalizeSnapshot(snapshot, capacity) {
  const out = new Array(capacity);
  for (let i = 0; i < capacity; i++) {
    out[i] = typeof snapshot[i] !== "undefined" ? snapshot[i] : undefined;
  }
  return out;
}

function StackVisualizer() {
  const [stackArr, setStackArr] = useState([]);
  const [capacity, setCapacity] = useState(0);
  const [topIndex, setTopIndex] = useState(-1);
  const [sSteps, setSSteps] = useState([]);
  const [sIndex, setSIndex] = useState(0);
  const [sOriginal, setSOriginal] = useState({ arr: [], top: -1 });
  const [capInput, setCapInput] = useState("");
  const [note, setNote] = useState("");
  const [opsVisible, setOpsVisible] = useState(false);
  const [inputMode, setInputMode] = useState(null);
  const [valInput, setValInput] = useState("");
  const [controlsVisible, setControlsVisible] = useState(false);
  const [stepDesc, setStepDesc] = useState("");
  const [previewStep, setPreviewStep] = useState(null);
  const [highlights, setHighlights] = useState([]);

  const getView = () => {
    if (previewStep) {
      return {
        arr: normalizeSnapshot(previewStep.arr || [], capacity),
        top: typeof previewStep.top === "number" ? previewStep.top : -1,
        highlights: previewStep.highlights || [],
      };
    }
    return { arr: stackArr, top: topIndex, highlights };
  };

  const pushStep = (list, arrSnap, topSnap, hl = [], desc = "") => {
    list.push({
      arr: normalizeSnapshot(arrSnap || [], capacity),
      top: typeof topSnap === "number" ? topSnap : -1,
      highlights: [...hl],
      desc: desc || "",
    });
  };

  const handleCreate = () => {
    const n = parseInt(capInput, 10);
    if (isNaN(n) || n <= 0) {
      alert("Enter valid capacity");
      return;
    }
    setCapacity(n);
    setStackArr(new Array(n).fill(undefined));
    setTopIndex(-1);
    setSSteps([]);
    setSIndex(0);
    setSOriginal({ arr: new Array(n).fill(undefined), top: -1 });
    setInputMode(null);
    setOpsVisible(true);
    setNote("Stack created empty. Use Push to add elements.");
    setPreviewStep(null);
    setControlsVisible(false);
    setStepDesc("");
  };

  const startOperation = (gen) => {
    setSOriginal({ arr: [...stackArr], top: topIndex });
    setSSteps(gen);
    setSIndex(0);
    setControlsVisible(true);
    setPreviewStep(gen[0]);
    setStepDesc(gen[0].desc);
  };

  const handlePush = () => {
    const valStr = valInput.trim();
    if (valStr === "") {
      alert("Enter a value");
      return;
    }
    const gen = [];
    pushStep(gen, stackArr, topIndex, [], `Preparing to push ${valStr}...`);
    if (topIndex >= capacity - 1) {
      pushStep(gen, stackArr, topIndex, [], `Stack Overflow! Cannot push ${valStr}`);
    } else {
      const step1 = [...stackArr];
      pushStep(
        gen,
        step1,
        topIndex + 1,
        [topIndex + 1],
        `Increment top to ${topIndex + 1}`
      );
      const step2 = [...stackArr];
      step2[topIndex + 1] = valStr;
      pushStep(
        gen,
        step2,
        topIndex + 1,
        [topIndex + 1],
        `Placed ${valStr} at index ${topIndex + 1}`
      );
    }
    startOperation(gen);
  };

  const handlePop = () => {
    const gen = [];
    pushStep(gen, stackArr, topIndex, [], "Preparing to pop top element...");
    if (topIndex === -1) {
      pushStep(gen, stackArr, topIndex, [], "Underflow! Stack is empty.");
    } else {
      pushStep(
        gen,
        stackArr,
        topIndex,
        [topIndex],
        `Top element is ${stackArr[topIndex]}. Removing it.`
      );
      const after = [...stackArr];
      after[topIndex] = undefined;
      pushStep(
        gen,
        after,
        topIndex - 1,
        [],
        `Popped element; top becomes ${topIndex - 1}`
      );
    }
    startOperation(gen);
  };

  const handlePeek = () => {
    const gen = [];
    pushStep(gen, stackArr, topIndex, [], "Preparing to peek top element...");
    if (topIndex === -1) {
      pushStep(gen, stackArr, topIndex, [], "Stack is empty. No element to peek.");
    } else {
      pushStep(
        gen,
        stackArr,
        topIndex,
        [topIndex],
        `Top element is ${stackArr[topIndex]}`
      );
    }
    startOperation(gen);
  };

  const handleDisplay = () => {
    const gen = [];
    pushStep(gen, stackArr, topIndex, [], "Displaying stack from top to bottom...");
    if (topIndex === -1) {
      pushStep(gen, stackArr, topIndex, [], "Stack is empty.");
    } else {
      for (let i = topIndex; i >= 0; i--) {
        pushStep(
          gen,
          stackArr,
          topIndex,
          [i],
          `Index ${i}: value = ${stackArr[i]}`
        );
      }
    }
    startOperation(gen);
  };

  const handleNext = () => {
    if (!sSteps.length) {
      alert("No operation prepared");
      return;
    }
    if (sIndex >= sSteps.length) {
      alert("Operation finished");
      const last = sSteps[sSteps.length - 1];
      if (last) {
        setStackArr([...normalizeSnapshot(last.arr || [], capacity)]);
        setTopIndex(typeof last.top === "number" ? last.top : -1);
      }
      setSSteps([]);
      setSIndex(0);
      setPreviewStep(null);
      setControlsVisible(false);
      setStepDesc("Finished.");
      setHighlights([]);
      return;
    }
    const step = sSteps[sIndex];
    setPreviewStep(null);
    if (step && Array.isArray(step.arr)) {
      setStackArr([...normalizeSnapshot(step.arr, capacity)]);
    }
    setTopIndex(typeof step.top === "number" ? step.top : -1);
    setHighlights(step.highlights || []);
    setStepDesc(step.desc || "");
    setSIndex(sIndex + 1);
  };

  const handleReset = () => {
    setStackArr(sOriginal.arr ? [...sOriginal.arr] : new Array(capacity).fill(undefined));
    setTopIndex(typeof sOriginal.top === "number" ? sOriginal.top : -1);
    setSSteps([]);
    setSIndex(0);
    setPreviewStep(null);
    setControlsVisible(false);
    setStepDesc("");
    setHighlights([]);
    setNote("Operation reset.");
  };

  const view = getView();
  const viewArr = view.arr;
  const viewTop = view.top;
  const viewHighlights = view.highlights;

  return (
    <>
      <div className="logo-part">DSA Visualizer</div>
      <div className="mainbox">
        <VisualizerPageHeader title="Stack Visualizer" backTo="/stack" />

        <div className="dav-wrapper">
          <div className="dav-card">
            <div className="dav-title">Stack Visualizer (Array-backed)</div>

            <div className="dav-card-header">
              <label className="dav-label">Enter Stack Capacity:</label>
              <input
                className="dav-input"
                type="number"
                min="1"
                placeholder="eg: 5"
                value={capInput}
                onChange={(e) => setCapInput(e.target.value)}
              />
              <button
                type="button"
                className="dav-btn dav-primary"
                onClick={handleCreate}
              >
                Create Stack
              </button>
              <div style={{ marginLeft: "12px", color: "#666", fontSize: ".95rem" }}>
                Stack starts empty. Use <strong>Push</strong> to add elements.
              </div>
            </div>

            <div style={{ marginTop: "10px", color: "#7a1a1a", fontWeight: 600 }}>
              {note}
            </div>

            {opsVisible && (
              <div
                className="dav-ops-row"
                style={{ marginTop: "12px", justifyContent: "center" }}
              >
                <div className="dav-actions">
                  <button
                    type="button"
                    className="dav-btn dav-primary"
                    onClick={() => {
                      setInputMode("push");
                      setValInput("");
                      setStepDesc("");
                    }}
                  >
                    Push
                  </button>
                  <button
                    type="button"
                    className="dav-btn dav-primary"
                    onClick={() => {
                      setInputMode("pop");
                      setStepDesc("");
                    }}
                  >
                    Pop
                  </button>
                  <button
                    type="button"
                    className="dav-btn dav-primary"
                    onClick={() => {
                      setInputMode("peek");
                      setStepDesc("");
                    }}
                  >
                    Peek
                  </button>
                  <button
                    type="button"
                    className="dav-btn dav-primary"
                    onClick={() => {
                      setInputMode("display");
                      setStepDesc("");
                    }}
                  >
                    Display
                  </button>
                </div>
                <div className="meta-row">
                  <div style={{ color: "#7a1a1a", fontWeight: 600 }}>
                    Top index: {viewTop}
                  </div>
                </div>
              </div>
            )}

            {inputMode && (
              <div className="dav-input-section">
                {inputMode === "push" && (
                  <>
                    <input
                      className="dav-input"
                      placeholder="Value to push"
                      value={valInput}
                      onChange={(e) => setValInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className="dav-btn dav-primary"
                      onClick={handlePush}
                    >
                      Push
                    </button>
                  </>
                )}
                {inputMode === "pop" && (
                  <button
                    type="button"
                    className="dav-btn dav-primary"
                    onClick={handlePop}
                  >
                    Pop
                  </button>
                )}
                {inputMode === "peek" && (
                  <button
                    type="button"
                    className="dav-btn dav-primary"
                    onClick={handlePeek}
                  >
                    Peek
                  </button>
                )}
                {inputMode === "display" && (
                  <button
                    type="button"
                    className="dav-btn dav-primary"
                    onClick={handleDisplay}
                  >
                    Display (step-by-step)
                  </button>
                )}
              </div>
            )}

            <div className="dav-length">
              {capacity > 0 && `Size: ${Math.max(0, viewTop + 1)} / ${capacity}`}
            </div>

            <div
              className="dav-visual-area"
              style={{ flexDirection: "column", alignItems: "flex-end" }}
            >
              {capacity > 0 &&
                Array.from({ length: capacity }, (_, k) => capacity - 1 - k).map(
                  (i) => (
                    <div
                      key={i}
                      className={`dav-item${viewHighlights.includes(i) ? " highlight" : ""}`}
                      style={{ width: "120px", margin: "6px 0" }}
                    >
                      <div>
                        {i <= viewTop && typeof viewArr[i] !== "undefined" ? (
                          viewArr[i]
                        ) : (
                          <span style={{ color: "#bbb" }}>—</span>
                        )}
                      </div>
                      <div className="dav-index" style={{ fontSize: "0.8rem" }}>
                        {i}
                      </div>
                      {i === viewTop && (
                        <div className="pointer-badge">TOP</div>
                      )}
                    </div>
                  )
                )}
            </div>

            <div
              className="dav-length"
              style={{ fontStyle: "italic", color: "#555", minHeight: "24px" }}
            >
              {stepDesc}
            </div>

            {controlsVisible && (
              <div
                className="dav-card-header"
                style={{ marginTop: "8px", justifyContent: "center" }}
              >
                <button
                  type="button"
                  className="dav-btn dav-ghost"
                  onClick={handleNext}
                >
                  Next Step
                </button>
                <button
                  type="button"
                  className="dav-btn dav-ghost"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default StackVisualizer;
