// =======================
// STACK VISUALIZER (using arrays)
// =======================

const stackCapInput = document.getElementById("stack-cap");
const stackCreateBtn = document.getElementById("stack-create");
const stackNote = document.getElementById("stack-note");
const stackOps = document.getElementById("stack-operations");
const stackInputSection = document.getElementById("stack-input-section");
const stackLengthText = document.getElementById("stack-length");
const stackVisual = document.getElementById("stack-visual");
const stackMetaTop = document.getElementById("stack-meta-top");
const stackDesc = document.getElementById("stack-step-desc");
const stackControls = document.getElementById("stack-controls");
const sNext = document.getElementById("s-next");
const sReset = document.getElementById("s-reset");

let stackArr = [];
let capacity = 0;
let sSteps = [];
let sIndex = 0;
let sOriginal = { arr: [], top: -1 };
let topIndex = -1; // changed from "top" to "topIndex" to prevent conflicts

// helper to normalize snapshots
function normalizeSnapshot(snapshot) {
  const out = new Array(capacity);
  for (let i = 0; i < capacity; i++) {
    out[i] = typeof snapshot[i] !== "undefined" ? snapshot[i] : undefined;
  }
  return out;
}

// render the stack
function renderStack(highlights = []) {
  stackVisual.innerHTML = "";
  stackLengthText.textContent = `Size: ${topIndex + 1} / ${capacity}`;
  for (let i = capacity - 1; i >= 0; i--) {
    const div = document.createElement("div");
    div.className = "dav-item";
    div.style.width = "120px";
    div.style.margin = "6px 0";
    const content = (i <= topIndex && typeof stackArr[i] !== "undefined")
      ? `${stackArr[i]}`
      : `<span style="color:#bbb">—</span>`;
    div.innerHTML = `<div>${content}</div><div class="dav-index" style="font-size:0.8rem">${i}</div>`;
    if (highlights.includes(i)) div.classList.add("highlight");
    if (i === topIndex) {
      const badge = document.createElement("div");
      badge.className = "pointer-badge";
      badge.textContent = "TOP";
      badge.style.marginLeft = "8px";
      div.appendChild(badge);
    }
    stackVisual.appendChild(div);
  }
  stackMetaTop.textContent = `Top index: ${topIndex}`;
}

function renderSnapshotStep(step) {
  if (!step) return renderStack();
  const snap = normalizeSnapshot(step.arr || []);
  stackVisual.innerHTML = "";
  const snapTop = typeof step.top === "number" ? step.top : -1;
  stackLengthText.textContent = `Size: ${Math.max(0, snapTop + 1)} / ${capacity}`;
  for (let i = capacity - 1; i >= 0; i--) {
    const div = document.createElement("div");
    div.className = "dav-item";
    div.style.width = "120px";
    div.style.margin = "6px 0";
    const content =
      i <= snapTop && typeof snap[i] !== "undefined"
        ? `${snap[i]}`
        : `<span style="color:#bbb">—</span>`;
    div.innerHTML = `<div>${content}</div><div class="dav-index" style="font-size:0.8rem">${i}</div>`;
    if ((step.highlights || []).includes(i)) div.classList.add("highlight");
    if (i === snapTop) {
      const badge = document.createElement("div");
      badge.className = "pointer-badge";
      badge.textContent = "TOP";
      badge.style.marginLeft = "8px";
      div.appendChild(badge);
    }
    stackVisual.appendChild(div);
  }
  stackMetaTop.textContent = `Top index: ${snapTop}`;
}

// create stack
stackCreateBtn.onclick = () => {
  const n = parseInt(stackCapInput.value);
  if (isNaN(n) || n <= 0) return alert("Enter valid capacity");
  capacity = n;
  stackArr = new Array(capacity).fill(undefined);
  topIndex = -1;
  sSteps = [];
  sIndex = 0;
  sOriginal = { arr: [...stackArr], top: topIndex };
  stackInputSection.innerHTML = "";
  stackOps.classList.remove("dav-hidden");
  stackNote.textContent = "Stack created empty. Use Push to add elements.";
  renderStack();
};

// show input UI
function sShowInputs(type) {
  stackInputSection.innerHTML = "";
  stackDesc.textContent = "";
  if (type === "push") {
    stackInputSection.innerHTML = `
      <input id="s-val" class="dav-input" placeholder="Value to push">
      <button class="dav-btn dav-primary" id="s-doPush">Push</button>
    `;
  } else if (type === "pop") {
    stackInputSection.innerHTML = `
      <button class="dav-btn dav-primary" id="s-doPop">Pop</button>
    `;
  } else if (type === "peek") {
    stackInputSection.innerHTML = `
      <button class="dav-btn dav-primary" id="s-doPeek">Peek</button>
    `;
  } else if (type === "display") {
    stackInputSection.innerHTML = `
      <button class="dav-btn dav-primary" id="s-doDisplay">Display (step-by-step)</button>
    `;
  }
}

document.getElementById("s-op-push").onclick = () => sShowInputs("push");
document.getElementById("s-op-pop").onclick = () => sShowInputs("pop");
document.getElementById("s-op-peek").onclick = () => sShowInputs("peek");
document.getElementById("s-op-display").onclick = () => sShowInputs("display");

// helper to record steps
function sPushStep(list, arrSnap, topSnap, highlights = [], desc = "") {
  const normalized = normalizeSnapshot(arrSnap || []);
  list.push({
    arr: normalized,
    top: typeof topSnap === "number" ? topSnap : -1,
    highlights: [...highlights],
    desc: desc || "",
  });
}

// handle operations
stackInputSection.addEventListener("click", (e) => {
  if (e.target.id === "s-doPush") {
    const valStr = document.getElementById("s-val").value.trim();
    if (valStr === "") return alert("Enter a value");
    const val = valStr;
    const gen = [];
    sPushStep(gen, stackArr, topIndex, [], `Preparing to push ${val}...`);
    if (topIndex >= capacity - 1) {
      sPushStep(gen, stackArr, topIndex, [], `Stack Overflow! Cannot push ${val}`);
    } else {
      const step1 = [...stackArr];
      sPushStep(gen, step1, topIndex + 1, [topIndex + 1], `Increment top to ${topIndex + 1}`);
      const step2 = [...stackArr];
      step2[topIndex + 1] = val;
      sPushStep(gen, step2, topIndex + 1, [topIndex + 1], `Placed ${val} at index ${topIndex + 1}`);
    }
    sOriginal = { arr: [...stackArr], top: topIndex };
    sSteps = gen;
    sIndex = 0;
    stackControls.classList.remove("dav-hidden");
    renderSnapshotStep(sSteps[0]);
    stackDesc.textContent = sSteps[0].desc;
  }

  if (e.target.id === "s-doPop") {
    const gen = [];
    sPushStep(gen, stackArr, topIndex, [], `Preparing to pop top element...`);
    if (topIndex === -1) {
      sPushStep(gen, stackArr, topIndex, [], `Underflow! Stack is empty.`);
    } else {
      sPushStep(gen, stackArr, topIndex, [topIndex], `Top element is ${stackArr[topIndex]}. Removing it.`);
      const after = [...stackArr];
      after[topIndex] = undefined;
      sPushStep(gen, after, topIndex - 1, [], `Popped element; top becomes ${topIndex - 1}`);
    }
    sOriginal = { arr: [...stackArr], top: topIndex };
    sSteps = gen;
    sIndex = 0;
    stackControls.classList.remove("dav-hidden");
    renderSnapshotStep(sSteps[0]);
    stackDesc.textContent = sSteps[0].desc;
  }

  if (e.target.id === "s-doPeek") {
    const gen = [];
    sPushStep(gen, stackArr, topIndex, [], `Preparing to peek top element...`);
    if (topIndex === -1) {
      sPushStep(gen, stackArr, topIndex, [], `Stack is empty. No element to peek.`);
    } else {
      sPushStep(gen, stackArr, topIndex, [topIndex], `Top element is ${stackArr[topIndex]}`);
    }
    sOriginal = { arr: [...stackArr], top: topIndex };
    sSteps = gen;
    sIndex = 0;
    stackControls.classList.remove("dav-hidden");
    renderSnapshotStep(sSteps[0]);
    stackDesc.textContent = sSteps[0].desc;
  }

  if (e.target.id === "s-doDisplay") {
    const gen = [];
    sPushStep(gen, stackArr, topIndex, [], `Displaying stack from top to bottom...`);
    if (topIndex === -1) {
      sPushStep(gen, stackArr, topIndex, [], `Stack is empty.`);
    } else {
      for (let i = topIndex; i >= 0; i--) {
        sPushStep(gen, stackArr, topIndex, [i], `Index ${i}: value = ${stackArr[i]}`);
      }
    }
    sOriginal = { arr: [...stackArr], top: topIndex };
    sSteps = gen;
    sIndex = 0;
    stackControls.classList.remove("dav-hidden");
    renderSnapshotStep(sSteps[0]);
    stackDesc.textContent = sSteps[0].desc;
  }
});

// Next Step
sNext.onclick = () => {
  if (!sSteps || sSteps.length === 0) return alert("No operation prepared");
  if (sIndex >= sSteps.length) {
    alert("Operation finished");
    const last = sSteps[sSteps.length - 1];
    if (last) {
      const normalized = normalizeSnapshot(last.arr || []);
      stackArr = [...normalized];
      topIndex = typeof last.top === "number" ? last.top : -1;
    }
    renderStack();
    sSteps = [];
    sIndex = 0;
    stackControls.classList.add("dav-hidden");
    stackDesc.textContent = "Finished.";
    return;
  }
  const step = sSteps[sIndex];
  if (step && Array.isArray(step.arr)) {
    const normalized = normalizeSnapshot(step.arr);
    stackArr = [...normalized];
  }
  topIndex = typeof step.top === "number" ? step.top : -1;
  renderStack(step.highlights || []);
  stackDesc.textContent = step.desc || "";
  sIndex++;
};

// Reset
sReset.onclick = () => {
  stackArr = sOriginal.arr ? [...sOriginal.arr] : new Array(capacity).fill(undefined);
  topIndex = typeof sOriginal.top === "number" ? sOriginal.top : -1;
  sSteps = [];
  sIndex = 0;
  stackControls.classList.add("dav-hidden");
  stackDesc.textContent = "";
  stackNote.textContent = "Operation reset.";
  renderStack();
};

// Initial render
renderStack();
