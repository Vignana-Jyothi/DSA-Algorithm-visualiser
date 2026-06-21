import { useState } from "react";
import VisualizerPageHeader from "../components/VisualizerPageHeader";
import "./array.css";
import {
  generateBinarySearchSteps,
  generateDeleteSteps,
  generateInsertSteps,
  generateLinearSearchSteps,
  generateSortSteps,
  generateUpdateSteps,
  isSorted,
} from "./arrayVisualizerLogic";

function ArrayVisualizer() {
  const [arr, setArr] = useState([]);
  const [originalArr, setOriginalArr] = useState([]);
  const [steps, setSteps] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [foundIndices, setFoundIndices] = useState([]);
  const [maxLen, setMaxLen] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [lenInput, setLenInput] = useState("");
  const [note, setNote] = useState("");
  const [stepDesc, setStepDesc] = useState("");
  const [sortType, setSortType] = useState("");
  const [valInput, setValInput] = useState("");
  const [idxInput, setIdxInput] = useState("");
  const [opsVisible, setOpsVisible] = useState(false);
  const [inputMode, setInputMode] = useState(null);
  const [stepControlsVisible, setStepControlsVisible] = useState(false);
  const [searchType, setSearchType] = useState("linear");

  const applyView = (viewArr, hl = [], found = [], desc = "") => {
    setArr(viewArr);
    setHighlights(hl);
    setFoundIndices(found);
    if (desc) setStepDesc(desc);
  };

  const startSteps = (gen, snapshot) => {
    setOriginalArr([...snapshot]);
    setSteps(gen);
    setStepIndex(0);
    setStepControlsVisible(true);
    setHighlights(gen[0]?.highlights || []);
    setFoundIndices(gen[0]?.found || []);
    setStepDesc(gen[0]?.desc || "");
  };

  const handleCreate = () => {
    const n = parseInt(lenInput, 10);
    if (isNaN(n) || n <= 0) {
      alert("Enter a valid positive length");
      return;
    }
    setMaxLen(n);
    setArr([]);
    setOriginalArr([]);
    setSteps([]);
    setStepIndex(0);
    setInputMode(null);
    setOpsVisible(true);
    setNote("Array created empty. Use Insertion to add elements.");
    setHighlights([]);
    setFoundIndices([]);
    setStepDesc("");
    setStepControlsVisible(false);
  };

  const handleInsert = () => {
    const valStr = valInput.trim();
    const idxStr = idxInput.trim();
    if (valStr === "") {
      alert("Enter a value");
      return;
    }
    const val = Number(valStr);
    if (isNaN(val)) {
      alert("Enter a valid number");
      return;
    }
    const idx = idxStr === "" ? arr.length : parseInt(idxStr, 10);
    if (isNaN(idx) || idx < 0 || idx > arr.length || arr.length >= maxLen) {
      alert("Invalid index or array full");
      return;
    }
    const gen = generateInsertSteps(arr, maxLen, val, idx);
    startSteps(gen, arr);
    setNote(
      `Insertion prepared: ${gen.length} steps. Click Next Step to perform them one by one.`
    );
  };

  const handleDelete = () => {
    const idxStr = idxInput.trim();
    if (idxStr === "") {
      alert("Enter index to delete");
      return;
    }
    const idx = parseInt(idxStr, 10);
    if (isNaN(idx) || idx < 0 || idx >= arr.length) {
      alert("Invalid index");
      return;
    }
    const gen = generateDeleteSteps(arr, idx);
    startSteps(gen, arr);
    setNote(`Deletion prepared: ${gen.length} steps. Click Next Step.`);
  };

  const handleUpdate = () => {
    const idxStr = idxInput.trim();
    const valStr = valInput.trim();
    if (idxStr === "" || valStr === "") {
      alert("Enter index and new value");
      return;
    }
    const idx = parseInt(idxStr, 10);
    const val = Number(valStr);
    if (isNaN(idx) || idx < 0 || idx >= arr.length) {
      alert("Invalid index");
      return;
    }
    if (isNaN(val)) {
      alert("Enter numeric value");
      return;
    }
    const gen = generateUpdateSteps(arr, idx, val);
    startSteps(gen, arr);
    setNote(`Update prepared: ${gen.length} steps. Click Next Step.`);
  };

  const handleSearch = () => {
    const valStr = valInput.trim();
    if (valStr === "") {
      alert("Enter value to search");
      return;
    }
    const val = Number(valStr);
    if (isNaN(val)) {
      alert("Enter numeric target");
      return;
    }
    if (searchType === "linear") {
      const gen = generateLinearSearchSteps(arr, val);
      startSteps(gen, arr);
      setNote(`Linear search prepared: ${gen.length} steps. Click Next Step.`);
    } else {
      if (!isSorted(arr)) {
        alert(
          "Binary search requires the array to be sorted in non-decreasing order. Sort first."
        );
        return;
      }
      const gen = generateBinarySearchSteps(arr, val);
      startSteps(gen, arr);
      setNote(`Binary search prepared: ${gen.length} steps. Click Next Step.`);
    }
  };

  const handleSortStart = () => {
    if (!sortType) {
      alert("Select a sorting algorithm first");
      return;
    }
    const gen = generateSortSteps(sortType, arr);
    if (gen.length === 0) {
      alert("No steps generated (array might be empty)");
      return;
    }
    startSteps(gen, arr);
    setNote(
      `Sorting prepared (${gen.length} micro-steps). Click Next Step to proceed.`
    );
  };

  const handleNextStep = () => {
    if (!steps || steps.length === 0) {
      alert("No operation in progress. Generate steps first.");
      return;
    }
    if (stepIndex >= steps.length) {
      alert("Operation completed!");
      if (steps.length > 0) {
        const last = steps[steps.length - 1];
        applyView(last.arr, [], [], "Operation finished.");
      }
      setStepControlsVisible(false);
      setSteps([]);
      setStepIndex(0);
      return;
    }
    const s = steps[stepIndex];
    applyView(s.arr, s.highlights || [], s.found || [], s.desc || "");
    setStepIndex(stepIndex + 1);
  };

  const handleReset = () => {
    const restored = originalArr ? [...originalArr] : [];
    applyView(restored, [], [], "");
    setStepControlsVisible(false);
    setSteps([]);
    setStepIndex(0);
    setNote(
      "Operation reset. You can continue editing the array using insertion/update/delete."
    );
  };

  const openInputMode = (mode) => {
    setInputMode(mode);
    setValInput("");
    setIdxInput("");
    setStepDesc("");
  };

  return (
    <>
      <div className="logo-part">DSA Visualizer</div>
      <div className="mainbox">
        <VisualizerPageHeader title="DSA Array Visualizer" backTo="/array" />

        <div className="dav-wrapper">
          <div className="dav-card">
            <div className="dav-title">DSA Array Visualizer</div>

            <div className="dav-card-header">
              <label className="dav-label">Enter Array Length:</label>
              <input
                className="dav-input"
                type="number"
                min="1"
                placeholder="eg:- 5"
                value={lenInput}
                onChange={(e) => setLenInput(e.target.value)}
              />
              <button
                type="button"
                className="dav-btn dav-primary"
                onClick={handleCreate}
              >
                Create Array
              </button>
              <div style={{ marginLeft: "12px", color: "#666", fontSize: "0.95rem" }}>
                After creating length, use <strong>Insertion</strong> to add each
                element manually.
              </div>
            </div>

            <div style={{ marginTop: "10px", color: "#7a1a1a", fontWeight: 600 }}>
              {note}
            </div>

            {opsVisible && (
              <div style={{ marginTop: "12px" }}>
                <div className="dav-ops-row">
                  <div className="dav-actions">
                    <button
                      type="button"
                      className="dav-btn dav-primary"
                      onClick={() => openInputMode("insert")}
                    >
                      Insertion
                    </button>
                    <button
                      type="button"
                      className="dav-btn dav-primary"
                      onClick={() => openInputMode("delete")}
                    >
                      Deletion
                    </button>
                    <button
                      type="button"
                      className="dav-btn dav-primary"
                      onClick={() => openInputMode("update")}
                    >
                      Updation
                    </button>
                    <button
                      type="button"
                      className="dav-btn dav-primary"
                      onClick={() => openInputMode("search")}
                    >
                      Searching
                    </button>
                  </div>

                  <div className="dav-sort">
                    <label className="dav-label">Sorting:</label>
                    <select
                      className="dav-input"
                      value={sortType}
                      onChange={(e) => setSortType(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="bubble">Bubble Sort</option>
                      <option value="selection">Selection Sort</option>
                      <option value="insertion">Insertion Sort</option>
                      <option value="quick">Quick Sort</option>
                    </select>
                    <button
                      type="button"
                      className="dav-btn dav-primary"
                      onClick={handleSortStart}
                    >
                      Start Sorting
                    </button>
                  </div>
                </div>

                {inputMode && (
                  <div className="dav-input-section" style={{ marginTop: "12px" }}>
                    {(inputMode === "insert" ||
                      inputMode === "update" ||
                      inputMode === "search") && (
                      <input
                        className="dav-input"
                        placeholder={
                          inputMode === "search"
                            ? "Element to search"
                            : inputMode === "update"
                              ? "New value"
                              : "Element (number)"
                        }
                        value={valInput}
                        onChange={(e) => setValInput(e.target.value)}
                      />
                    )}
                    {(inputMode === "insert" ||
                      inputMode === "delete" ||
                      inputMode === "update") && (
                      <input
                        className="dav-input"
                        type="number"
                        min="0"
                        placeholder={
                          inputMode === "insert"
                            ? "Index (optional, append if empty)"
                            : inputMode === "delete"
                              ? "Index to delete"
                              : "Index to update"
                        }
                        value={idxInput}
                        onChange={(e) => setIdxInput(e.target.value)}
                      />
                    )}
                    {inputMode === "search" && (
                      <select
                        className="dav-input"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                      >
                        <option value="linear">Linear Search</option>
                        <option value="binary">
                          Binary Search (requires sorted array)
                        </option>
                      </select>
                    )}
                    <button
                      type="button"
                      className="dav-btn dav-primary"
                      onClick={
                        inputMode === "insert"
                          ? handleInsert
                          : inputMode === "delete"
                            ? handleDelete
                            : inputMode === "update"
                              ? handleUpdate
                              : handleSearch
                      }
                    >
                      {inputMode === "insert"
                        ? "Insert"
                        : inputMode === "delete"
                          ? "Delete"
                          : inputMode === "update"
                            ? "Update"
                            : "Search"}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="dav-length" style={{ marginTop: "12px" }}>
              {maxLen > 0 && `Array Length: ${arr.length} / ${maxLen}`}
            </div>

            <div className="dav-visual-area" style={{ marginTop: "12px" }}>
              {maxLen > 0 &&
                Array.from({ length: maxLen }, (_, i) => (
                  <div
                    key={i}
                    className={`dav-item${highlights.includes(i) ? " highlight" : ""}${foundIndices.includes(i) ? " found" : ""}`}
                    style={i >= arr.length ? { opacity: 0.6 } : undefined}
                  >
                    <div>{i < arr.length ? arr[i] : <span style={{ color: "#bbb" }}>—</span>}</div>
                    <div className="dav-index">{i}</div>
                  </div>
                ))}
            </div>

            <div
              className="dav-length"
              style={{ fontStyle: "italic", color: "#555", minHeight: "24px" }}
            >
              {stepDesc}
            </div>

            {stepControlsVisible && (
              <div className="dav-card-header" style={{ marginTop: "8px" }}>
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
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>

        <br />
      </div>
    </>
  );
}

export default ArrayVisualizer;