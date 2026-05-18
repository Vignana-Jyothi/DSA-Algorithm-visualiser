import { useState } from "react";
import VisualizerPageHeader from "../components/VisualizerPageHeader";
import "../Array/array.css";
import "./queue.css";

function QueueVisualizer() {
  const [qArr, setQArr] = useState([]);
  const [qCap, setQCap] = useState(0);
  const [qFront, setQFront] = useState(-1);
  const [qRear, setQRear] = useState(-1);
  const [qSize, setQSize] = useState(0);
  const [qSteps, setQSteps] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [qOriginal, setQOriginal] = useState({});
  const [capInput, setCapInput] = useState("");
  const [note, setNote] = useState("");
  const [opsVisible, setOpsVisible] = useState(false);
  const [inputMode, setInputMode] = useState(null);
  const [valInput, setValInput] = useState("");
  const [controlsVisible, setControlsVisible] = useState(false);
  const [stepDesc, setStepDesc] = useState("");
  const [previewStep, setPreviewStep] = useState(null);
  const [highlights, setHighlights] = useState([]);

  const qPush = (list, arrSnap, frontSnap, rearSnap, sizeSnap, hl = [], desc = "") => {
    list.push({
      arr: [...arrSnap],
      front: frontSnap,
      rear: rearSnap,
      size: sizeSnap,
      highlights: [...hl],
      desc,
    });
  };

  const getView = () => {
    if (previewStep) {
      return {
        arr: previewStep.arr || [],
        front: previewStep.front,
        rear: previewStep.rear,
        size: previewStep.size,
        highlights: previewStep.highlights || [],
      };
    }
    return { arr: qArr, front: qFront, rear: qRear, size: qSize, highlights };
  };

  const handleCreate = () => {
    const n = parseInt(capInput, 10);
    if (isNaN(n) || n <= 0) {
      alert("Enter valid capacity");
      return;
    }
    setQCap(n);
    setQArr(new Array(n).fill(undefined));
    setQFront(-1);
    setQRear(-1);
    setQSize(0);
    setQSteps([]);
    setQIndex(0);
    setQOriginal({});
    setOpsVisible(true);
    setNote("Queue created empty. Use Enqueue to add elements.");
    setPreviewStep(null);
    setControlsVisible(false);
    setInputMode(null);
    setStepDesc("");
  };

  const startOperation = (gen) => {
    setQOriginal({ arr: [...qArr], front: qFront, rear: qRear, size: qSize });
    setQSteps(gen);
    setQIndex(0);
    setControlsVisible(true);
    setPreviewStep(gen[0]);
    setStepDesc(gen[0].desc);
  };

  const handleEnqueue = () => {
    const vStr = valInput.trim();
    if (vStr === "") {
      alert("Enter value");
      return;
    }
    const v = Number(vStr);
    if (isNaN(v)) {
      alert("Enter numeric value");
      return;
    }
    const gen = [];
    qPush(gen, qArr, qFront, qRear, qSize, [], `Prepare to enqueue ${v}`);
    if (qRear === qCap - 1) {
      qPush(gen, qArr, qFront, qRear, qSize, [], `Queue overflow! Cannot enqueue ${v}`);
    } else if (qSize === 0) {
      qPush(gen, qArr, qFront, qRear, qSize, [], "Queue is empty — front and rear will be set to 0");
      const arr2 = [...qArr];
      arr2[0] = v;
      qPush(gen, arr2, 0, 0, 1, [0], `Enqueued ${v} at index 0; front=0, rear=0`);
    } else {
      const nextRear = qRear + 1;
      qPush(gen, qArr, qFront, qRear, qSize, [nextRear], `Place ${v} at index ${nextRear} (rear++)`);
      const arr2 = [...qArr];
      arr2[nextRear] = v;
      qPush(
        gen,
        arr2,
        qFront,
        nextRear,
        qSize + 1,
        [nextRear],
        `Enqueued ${v} at index ${nextRear}; rear=${nextRear}`
      );
    }
    startOperation(gen);
    setNote(`Enqueue prepared: ${gen.length} steps. Click Next Step.`);
  };

  const handleDequeue = () => {
    const gen = [];
    qPush(gen, qArr, qFront, qRear, qSize, [], "Prepare to dequeue");
    if (qSize === 0 || qFront === -1) {
      qPush(gen, qArr, qFront, qRear, qSize, [], "Underflow! Queue is empty, cannot dequeue");
    } else {
      qPush(
        gen,
        qArr,
        qFront,
        qRear,
        qSize,
        [qFront],
        `Removing element at front index ${qFront} (value ${qArr[qFront]})`
      );
      const arr2 = [...qArr];
      arr2[qFront] = undefined;
      const newSize = qSize - 1;
      if (newSize === 0) {
        qPush(gen, arr2, -1, -1, 0, [], "Queue becomes empty after dequeue");
      } else {
        const newFront = qFront + 1;
        qPush(gen, arr2, newFront, qRear, newSize, [newFront], `Front moves to index ${newFront}`);
      }
    }
    startOperation(gen);
    setNote(`Dequeue prepared: ${gen.length} steps. Click Next Step.`);
  };

  const handleFront = () => {
    const gen = [];
    qPush(gen, qArr, qFront, qRear, qSize, [], "Prepare to view front");
    if (qSize === 0) {
      qPush(gen, qArr, qFront, qRear, qSize, [], "Queue empty — no front element");
    } else {
      qPush(gen, qArr, qFront, qRear, qSize, [qFront], `Front at index ${qFront} with value ${qArr[qFront]}`);
    }
    startOperation(gen);
    setNote(`Front prepared: ${gen.length} steps. Click Next Step.`);
  };

  const handleRear = () => {
    const gen = [];
    qPush(gen, qArr, qFront, qRear, qSize, [], "Prepare to view rear");
    if (qSize === 0) {
      qPush(gen, qArr, qFront, qRear, qSize, [], "Queue empty — no rear element");
    } else {
      qPush(gen, qArr, qFront, qRear, qSize, [qRear], `Rear at index ${qRear} with value ${qArr[qRear]}`);
    }
    startOperation(gen);
    setNote(`Rear prepared: ${gen.length} steps. Click Next Step.`);
  };

  const handleNext = () => {
    if (!qSteps.length) {
      alert("No operation prepared");
      return;
    }
    if (qIndex >= qSteps.length) {
      alert("Operation finished");
      const last = qSteps[qSteps.length - 1];
      if (last) {
        setQArr(Array.isArray(last.arr) ? [...last.arr] : new Array(qCap).fill(undefined));
        setQFront(typeof last.front === "number" ? last.front : qFront);
        setQRear(typeof last.rear === "number" ? last.rear : qRear);
        setQSize(typeof last.size === "number" ? last.size : qSize);
      }
      setQSteps([]);
      setQIndex(0);
      setPreviewStep(null);
      setControlsVisible(false);
      setStepDesc("Finished.");
      setHighlights([]);
      return;
    }
    const step = qSteps[qIndex];
    setPreviewStep(null);
    if (Array.isArray(step.arr)) setQArr([...step.arr]);
    setQFront(typeof step.front === "number" ? step.front : qFront);
    setQRear(typeof step.rear === "number" ? step.rear : qRear);
    setQSize(typeof step.size === "number" ? step.size : qSize);
    setHighlights(step.highlights || []);
    setStepDesc(step.desc || "");
    setQIndex(qIndex + 1);
  };

  const handleReset = () => {
    setQArr(qOriginal.arr ? [...qOriginal.arr] : new Array(qCap).fill(undefined));
    setQFront(typeof qOriginal.front === "number" ? qOriginal.front : qFront);
    setQRear(typeof qOriginal.rear === "number" ? qOriginal.rear : qRear);
    setQSize(typeof qOriginal.size === "number" ? qOriginal.size : qSize);
    setQSteps([]);
    setQIndex(0);
    setPreviewStep(null);
    setControlsVisible(false);
    setStepDesc("");
    setHighlights([]);
    setNote("Operation reset.");
  };

  const view = getView();

  return (
    <>
      <div className="logo-part">DSA Visualizer</div>
      <div className="mainbox">
        <VisualizerPageHeader title="Queue Visualizer" backTo="/queue" />

        <div className="dav-wrapper">
          <div className="dav-card">
            <div className="dav-title">Queue Visualizer (Array)</div>

            <div className="dav-card-header">
              <label className="dav-label">Enter Capacity:</label>
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
                Create Queue
              </button>
              <div style={{ marginLeft: "12px", color: "#666", fontSize: ".95rem" }}>
                Queue starts empty. Use <strong>Enqueue</strong> to add elements.
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
                      setInputMode("enq");
                      setValInput("");
                      setStepDesc("");
                    }}
                  >
                    Enqueue
                  </button>
                  <button
                    type="button"
                    className="dav-btn dav-primary"
                    onClick={() => {
                      setInputMode("deq");
                      setStepDesc("");
                    }}
                  >
                    Dequeue
                  </button>
                  <button
                    type="button"
                    className="dav-btn dav-primary"
                    onClick={() => {
                      setInputMode("front");
                      setStepDesc("");
                    }}
                  >
                    Front
                  </button>
                  <button
                    type="button"
                    className="dav-btn dav-primary"
                    onClick={() => {
                      setInputMode("rear");
                      setStepDesc("");
                    }}
                  >
                    Rear
                  </button>
                </div>
                <div className="meta-row">
                  <div style={{ color: "#7a1a1a", fontWeight: 600 }}>
                    front: {view.front} | rear: {view.rear} | size: {view.size}
                  </div>
                </div>
              </div>
            )}

            {inputMode && (
              <div className="dav-input-section">
                {inputMode === "enq" && (
                  <>
                    <input
                      className="dav-input"
                      placeholder="Value to enqueue (number)"
                      value={valInput}
                      onChange={(e) => setValInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className="dav-btn dav-primary"
                      onClick={handleEnqueue}
                    >
                      Enqueue
                    </button>
                  </>
                )}
                {inputMode === "deq" && (
                  <button
                    type="button"
                    className="dav-btn dav-primary"
                    onClick={handleDequeue}
                  >
                    Dequeue
                  </button>
                )}
                {inputMode === "front" && (
                  <button
                    type="button"
                    className="dav-btn dav-primary"
                    onClick={handleFront}
                  >
                    Front (prepare)
                  </button>
                )}
                {inputMode === "rear" && (
                  <button
                    type="button"
                    className="dav-btn dav-primary"
                    onClick={handleRear}
                  >
                    Rear (prepare)
                  </button>
                )}
              </div>
            )}

            <div className="dav-length">
              {qCap > 0 && `Size: ${view.size} / ${qCap}`}
            </div>

            <div className="dav-visual-area">
              {qCap > 0 &&
                Array.from({ length: qCap }, (_, i) => (
                  <div
                    key={i}
                    className={`dav-item${view.highlights.includes(i) ? " highlight" : ""}`}
                    style={{
                      width: "90px",
                      height: "70px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div>
                      {view.arr[i] === undefined ? (
                        <span style={{ color: "#bbb" }}>—</span>
                      ) : (
                        view.arr[i]
                      )}
                    </div>
                    <div className="dav-index" style={{ fontSize: "0.8rem" }}>
                      {i}
                    </div>
                    {view.front === i && (
                      <div className="pointer-badge">FRONT</div>
                    )}
                    {view.rear === i && (
                      <div className="pointer-badge">REAR</div>
                    )}
                  </div>
                ))}
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

export default QueueVisualizer;
