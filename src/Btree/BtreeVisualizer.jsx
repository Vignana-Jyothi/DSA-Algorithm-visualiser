import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import VisualizerPageHeader from "../components/VisualizerPageHeader";
import "../Array/array.css";
import "./btree.css";
import {
  collectEdges,
  collectNodes,
  computeFitScale,
  computeLayout,
  generateTraversalSteps,
  getHeight,
  getLevelCount,
  insertValuesLevelOrder,
  parseValueInput,
} from "./btreeTreeLogic";

const TRAVERSAL_LABELS = {
  preorder: "Preorder (Root → Left → Right)",
  inorder: "Inorder (Left → Root → Right)",
  postorder: "Postorder (Left → Right → Root)",
  level: "Level Order (BFS)",
};

const MIN_ZOOM = 0.35;
const MAX_ZOOM = 3;

function clampZoom(value) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

function touchMidpoint(touches) {
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  };
}

function touchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

function BtreeVisualizer() {
  const canvasWrapRef = useRef(null);
  const [viewportSize, setViewportSize] = useState({ width: 600, height: 420 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [userZoom, setUserZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const panRef = useRef(pan);
  const userZoomRef = useRef(userZoom);
  const autoFitScaleRef = useRef(1);
  const dragRef = useRef(null);
  const touchRef = useRef(null);

  const [root, setRoot] = useState(null);
  const [valueInput, setValueInput] = useState("");
  const [note, setNote] = useState(
    "Enter values to build a complete binary tree (level-order insertion)."
  );
  const [traversalType, setTraversalType] = useState("preorder");
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepControlsVisible, setStepControlsVisible] = useState(false);
  const [stepDesc, setStepDesc] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [visitedIds, setVisitedIds] = useState([]);
  const [outputValues, setOutputValues] = useState([]);

  const nodes = useMemo(() => collectNodes(root), [root]);
  const layout = useMemo(() => computeLayout(root), [root]);
  const edges = useMemo(() => collectEdges(root), [root]);

  const autoFitScale = useMemo(
    () => computeFitScale(layout, viewportSize.width, viewportSize.height),
    [layout, viewportSize]
  );

  const effectiveScale = autoFitScale * userZoom;

  const centerView = useCallback(() => {
    const wrap = canvasWrapRef.current;
    if (!wrap || !root) return;
    const fit = computeFitScale(layout, wrap.clientWidth, wrap.clientHeight);
    const scaledW = layout.width * fit;
    const scaledH = layout.height * fit;
    const nextPan = {
      x: Math.max((wrap.clientWidth - scaledW) / 2, 8),
      y: Math.max((wrap.clientHeight - scaledH) / 2, 8),
    };
    setUserZoom(1);
    setPan(nextPan);
  }, [layout, root]);

  const zoomAtPoint = useCallback((clientX, clientY, factor) => {
    const wrap = canvasWrapRef.current;
    if (!wrap) return;

    const rect = wrap.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;
    const oldScale = autoFitScaleRef.current * userZoomRef.current;
    const nextUserZoom = clampZoom(userZoomRef.current * factor);
    const newScale = autoFitScaleRef.current * nextUserZoom;
    const currentPan = panRef.current;

    setPan({
      x: mx - ((mx - currentPan.x) / oldScale) * newScale,
      y: my - ((my - currentPan.y) / oldScale) * newScale,
    });
    setUserZoom(nextUserZoom);
  }, []);

  const updateViewport = useCallback(() => {
    const el = canvasWrapRef.current;
    if (!el) return;
    setViewportSize({ width: el.clientWidth, height: el.clientHeight });
  }, []);

  useEffect(() => {
    updateViewport();
    const el = canvasWrapRef.current;
    if (!el) return undefined;

    const observer = new ResizeObserver(updateViewport);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateViewport]);

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  useEffect(() => {
    userZoomRef.current = userZoom;
  }, [userZoom]);

  useEffect(() => {
    autoFitScaleRef.current = autoFitScale;
  }, [autoFitScale]);

  useEffect(() => {
    centerView();
  }, [centerView, layout.width, layout.height, layout.nodeCount]);

  useEffect(() => {
    const wrap = canvasWrapRef.current;
    if (!wrap) return undefined;

    const onWheel = (e) => {
      if (!root) return;
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        const factor = e.deltaY > 0 ? 0.92 : 1.08;
        zoomAtPoint(e.clientX, e.clientY, factor);
        return;
      }

      setPan((current) => ({
        x: current.x - e.deltaX,
        y: current.y - e.deltaY,
      }));
    };

    const onMouseDown = (e) => {
      if (!root || e.button !== 0) return;
      e.preventDefault();
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        panX: panRef.current.x,
        panY: panRef.current.y,
      };
      setIsDragging(true);
    };

    const onMouseMove = (e) => {
      const drag = dragRef.current;
      if (!drag) return;
      setPan({
        x: drag.panX + (e.clientX - drag.startX),
        y: drag.panY + (e.clientY - drag.startY),
      });
    };

    const endDrag = () => {
      dragRef.current = null;
      setIsDragging(false);
    };

    const onTouchStart = (e) => {
      if (!root || e.touches.length !== 2) return;
      const mid = touchMidpoint(e.touches);
      touchRef.current = {
        mode: null,
        startDistance: touchDistance(e.touches),
        lastMid: mid,
        startZoom: userZoomRef.current,
        startPan: { ...panRef.current },
      };
    };

    const onTouchMove = (e) => {
      if (!root || e.touches.length !== 2 || !touchRef.current) return;
      e.preventDefault();

      const touch = touchRef.current;
      const distance = touchDistance(e.touches);
      const mid = touchMidpoint(e.touches);
      const distRatio = distance / touch.startDistance;
      const midDx = mid.x - touch.lastMid.x;
      const midDy = mid.y - touch.lastMid.y;
      const distChange = Math.abs(distRatio - 1);

      if (!touch.mode) {
        if (distChange > 0.015) {
          touch.mode = "pinch";
        } else if (Math.hypot(midDx, midDy) > 2) {
          touch.mode = "pan";
        }
      }

      if (touch.mode === "pinch") {
        const nextZoom = clampZoom(touch.startZoom * distRatio);
        const oldScale = autoFitScaleRef.current * touch.startZoom;
        const newScale = autoFitScaleRef.current * nextZoom;
        const rect = wrap.getBoundingClientRect();
        const mx = mid.x - rect.left;
        const my = mid.y - rect.top;
        const startPan = touch.startPan;

        setPan({
          x: mx - ((mx - startPan.x) / oldScale) * newScale,
          y: my - ((my - startPan.y) / oldScale) * newScale,
        });
        setUserZoom(nextZoom);
      } else if (touch.mode === "pan") {
        setPan((current) => ({
          x: current.x + midDx,
          y: current.y + midDy,
        }));
        touch.lastMid = mid;
      } else {
        touch.lastMid = mid;
      }
    };

    const onTouchEnd = (e) => {
      if (e.touches.length < 2) {
        touchRef.current = null;
      }
    };

    wrap.addEventListener("wheel", onWheel, { passive: false });
    wrap.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", endDrag);
    wrap.addEventListener("touchstart", onTouchStart, { passive: true });
    wrap.addEventListener("touchmove", onTouchMove, { passive: false });
    wrap.addEventListener("touchend", onTouchEnd);
    wrap.addEventListener("touchcancel", onTouchEnd);

    return () => {
      wrap.removeEventListener("wheel", onWheel);
      wrap.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", endDrag);
      wrap.removeEventListener("touchstart", onTouchStart);
      wrap.removeEventListener("touchmove", onTouchMove);
      wrap.removeEventListener("touchend", onTouchEnd);
      wrap.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [root, zoomAtPoint]);

  const applyStep = (step) => {
    if (!step) {
      setCurrentId(null);
      setVisitedIds([]);
      setOutputValues([]);
      setStepDesc("");
      return;
    }
    setCurrentId(step.currentId);
    setVisitedIds(step.visitedIds || []);
    setOutputValues(step.outputValues || []);
    setStepDesc(step.desc || "");
  };

  const clearTraversalVisuals = () => {
    setSteps([]);
    setStepIndex(0);
    setStepControlsVisible(false);
    applyStep(null);
  };

  const handleInsert = () => {
    const values = parseValueInput(valueInput);
    if (!values.length) {
      alert("Enter at least one value (space or comma separated).");
      return;
    }

    const result = insertValuesLevelOrder(root, values);
    if (result.error) {
      alert(result.error);
      return;
    }

    setRoot(result.tree);
    clearTraversalVisuals();

    if (!root) {
      setNote(
        values.length === 1
          ? `Root created with value "${values[0]}". Next values fill left-to-right by level.`
          : `Inserted ${result.count} values in level order.`
      );
    } else {
      setNote(`Inserted ${result.count} value(s) in level order (left → right).`);
    }
    setValueInput("");
  };

  const handleClearTree = () => {
    if (!window.confirm("Clear the entire tree?")) return;
    setRoot(null);
    clearTraversalVisuals();
    setNote("Tree cleared. Enter values to build a new tree.");
  };

  const handleStartTraversal = () => {
    if (!root) {
      alert("Build a tree first.");
      return;
    }
    const gen = generateTraversalSteps(root, traversalType);
    if (!gen.length) {
      alert("No traversal steps generated.");
      return;
    }
    setSteps(gen);
    setStepIndex(1);
    setStepControlsVisible(true);
    applyStep(gen[0]);
    setNote(`${TRAVERSAL_LABELS[traversalType]} — ${gen.length} steps. Click Next Step.`);
  };

  const handleNextStep = () => {
    if (!steps.length) {
      alert("No traversal in progress.");
      return;
    }
    if (stepIndex >= steps.length) {
      applyStep(steps[steps.length - 1]);
      setNote("Traversal finished. You can insert more values or run another traversal.");
      return;
    }
    applyStep(steps[stepIndex]);
    setStepIndex(stepIndex + 1);
  };

  const handleResetTraversal = () => {
    clearTraversalVisuals();
    setNote("Traversal reset.");
  };

  const formatOutput = (values) => (values.length ? values.join(" → ") : "—");

  const height = getHeight(root);
  const levels = getLevelCount(root);

  return (
    <>
      <div className="logo-part">DSA Visualizer</div>
      <div className="mainbox">
        <VisualizerPageHeader title="Binary Tree Visualizer" backTo="/btree" />

        <div className="dav-wrapper">
          <div className="dav-card">
            <div className="dav-title">Binary Tree (Structure & Traversal)</div>

            <div style={{ marginTop: "10px", color: "#7a1a1a", fontWeight: 600 }}>
              {note}
            </div>

            <div className="bt-layout">
              <div
                className={`bt-canvas-wrap${isDragging ? " bt-canvas-grabbing" : ""}${root ? " bt-canvas-active" : ""}`}
                ref={canvasWrapRef}
              >
                {!root && (
                  <div className="bt-empty-msg">
                    Empty tree — enter values to build automatically (level order)
                  </div>
                )}

                {root && (
                  <div className="bt-canvas-hint">
                    Drag to move · Two fingers to pan · Pinch / Ctrl+scroll to zoom
                  </div>
                )}

                <div
                  className="bt-canvas-scaler"
                  style={{
                    width: layout.width,
                    height: layout.height,
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${effectiveScale})`,
                  }}
                >
                  <svg
                    className="bt-edges"
                    width={layout.width}
                    height={layout.height}
                    aria-hidden="true"
                  >
                    {edges.map(({ from, to }) => {
                      const a = layout.positions[from];
                      const b = layout.positions[to];
                      if (!a || !b) return null;
                      return (
                        <line
                          key={`${from}-${to}`}
                          className="bt-edge"
                          x1={a.x}
                          y1={a.y}
                          x2={b.x}
                          y2={b.y}
                        />
                      );
                    })}
                  </svg>

                  <div className="bt-nodes-layer">
                    {nodes.map((node) => {
                      const pos = layout.positions[node.id];
                      if (!pos) return null;
                      const isCurrent = currentId === node.id;
                      const isVisited = visitedIds.includes(node.id);
                      return (
                        <div
                          key={node.id}
                          className={[
                            "bt-node",
                            isCurrent ? "bt-current" : "",
                            isVisited && !isCurrent ? "bt-visited" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          style={{ left: pos.x, top: pos.y }}
                          title={`Node ${node.value}`}
                        >
                          {node.value}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bt-panel">
                <div className="bt-section">
                  <div className="bt-section-title">Insert Values</div>
                  <div className="bt-controls-row">
                    <input
                      className="bt-input"
                      placeholder="Enter values (space or comma separated)"
                      value={valueInput}
                      onChange={(e) => setValueInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleInsert();
                      }}
                    />
                  </div>
                  <div className="bt-controls-row" style={{ marginTop: 8 }}>
                    <button
                      type="button"
                      className="dav-btn dav-primary"
                      onClick={handleInsert}
                    >
                      Insert Values
                    </button>
                    <button
                      type="button"
                      className="dav-btn dav-ghost"
                      onClick={handleClearTree}
                    >
                      Clear Tree
                    </button>
                  </div>
                  <div className="bt-hint">
                    Values fill the tree left-to-right, level by level (complete binary
                    tree).
                  </div>
                </div>

                <div className="bt-section">
                  <div className="bt-section-title">Tree Properties</div>
                  <div className="bt-stats">
                    <span>
                      Height: <strong>{height}</strong>
                    </span>
                    <span>
                      Levels: <strong>{levels}</strong>
                    </span>
                    <span>
                      Nodes: <strong>{nodes.length}</strong>
                    </span>
                  </div>
                </div>

                <div className="bt-section">
                  <div className="bt-section-title">Traversal</div>
                  <div className="bt-controls-row">
                    <select
                      className="bt-select"
                      value={traversalType}
                      onChange={(e) => setTraversalType(e.target.value)}
                    >
                      <option value="preorder">Preorder</option>
                      <option value="inorder">Inorder</option>
                      <option value="postorder">Postorder</option>
                      <option value="level">Level Order (BFS)</option>
                    </select>
                    <button
                      type="button"
                      className="dav-btn dav-primary"
                      onClick={handleStartTraversal}
                      disabled={!root}
                    >
                      Start Traversal
                    </button>
                  </div>
                </div>

                <div className="bt-section">
                  <div className="bt-output-label">Traversal output</div>
                  <div className="bt-output">
                    <span className="bt-output-values">
                      {formatOutput(outputValues)}
                    </span>
                  </div>
                </div>

                <div
                  className="dav-length"
                  style={{ fontStyle: "italic", color: "#555", minHeight: "24px" }}
                >
                  {stepDesc}
                </div>

                {stepControlsVisible && (
                  <div className="dav-card-header" style={{ justifyContent: "center" }}>
                    <button
                      type="button"
                      className="dav-btn dav-ghost"
                      onClick={handleNextStep}
                    >
                      Next Step
                    </button>
                    <button
                      type="button"
                      className="dav-btn dav-ghost"
                      onClick={handleResetTraversal}
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BtreeVisualizer;
