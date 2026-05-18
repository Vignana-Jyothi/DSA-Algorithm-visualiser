/* page4-queue.js
   Circular queue visualizer — manual step-by-step.
   - enqueue / dequeue / front / rear
   - maintains front, rear, size
   - step generation + Next Step + Reset
*/

const qCapInput = document.getElementById("q-cap");
const qCreateBtn = document.getElementById("q-create");
const qNote = document.getElementById("q-note");
const qOps = document.getElementById("q-operations");
const qInputSection = document.getElementById("q-input-section");
const qLengthText = document.getElementById("q-length");
const qVisual = document.getElementById("q-visual");
const qMeta = document.getElementById("q-meta");
const qDesc = document.getElementById("q-desc");
const qControls = document.getElementById("q-controls");
const qNext = document.getElementById("q-next");
const qReset = document.getElementById("q-reset");

let qArr = [];         // physical array of capacity length
let qCap = 0;
let qFront = -1;       // index of front element
let qRear = -1;        // index of rear element
let qSize = 0;

let qSteps = [];       // prepared micro-steps
let qIndex = 0;
let qOriginal = {};    // store original snapshot for reset

// render queue as horizontal slots, annotate front/rear
function renderQueue(highlights = [], meta = {}) {
  qVisual.innerHTML = "";
  qLengthText.textContent = `Size: ${qSize} / ${qCap}`;
  for (let i = 0; i < qCap; i++) {
    const slot = document.createElement("div");
    slot.className = "dav-item";
    slot.style.width = "90px";
    slot.style.height = "70px";
    slot.style.display = "flex";
    slot.style.flexDirection = "column";
    slot.style.alignItems = "center";
    slot.style.justifyContent = "center";
    if (i <= qRear && qFront <= qRear) {
      // non-wrap case — but we visualize by qFront/qRear markers, not by condition
    }
    let content = (qArr[i] === undefined ? `<div style="color:#bbb">—</div>` : `<div>${qArr[i]}</div>`);
    content += `<div class="dav-index" style="font-size:0.8rem">${i}</div>`;
    slot.innerHTML = content;
    if (highlights.includes(i)) slot.classList.add("highlight");
    if (meta.front === i) {
      const b = document.createElement("div");
      b.className = "pointer-badge";
      b.textContent = "FRONT";
      slot.appendChild(b);
    }
    if (meta.rear === i) {
      const b2 = document.createElement("div");
      b2.className = "pointer-badge";
      b2.textContent = "REAR";
      slot.appendChild(b2);
    }
    qVisual.appendChild(slot);
  }
  qMeta.textContent = `front: ${qFront}  |  rear: ${qRear}  |  size: ${qSize}`;
}

// create queue
qCreateBtn.onclick = () => {
  const n = parseInt(qCapInput.value);
  if (isNaN(n) || n <= 0) return alert("Enter valid capacity");
  qCap = n;
  qArr = new Array(qCap).fill(undefined);
  qFront = -1; qRear = -1; qSize = 0;
  qSteps = []; qIndex = 0; qOriginal = {};
  qInputSection.innerHTML = "";
  qOps.classList.remove("dav-hidden");
  qNote.textContent = "Queue created empty. Use Enqueue to add elements.";
  renderQueue();
};

// show inputs
function qShowInputs(type) {
  qInputSection.innerHTML = "";
  qDesc.textContent = "";
  if (type === "enq") {
    qInputSection.innerHTML = `
      <input id="q-val" class="dav-input" placeholder="Value to enqueue (number)">
      <button class="dav-btn dav-primary" id="q-doEnq">Enqueue</button>
    `;
  } else if (type === "deq") {
    qInputSection.innerHTML = `
      <button class="dav-btn dav-primary" id="q-doDeq">Dequeue</button>
    `;
  } else if (type === "front") {
    qInputSection.innerHTML = `<button class="dav-btn dav-primary" id="q-doFront">Front (prepare)</button>`;
  } else if (type === "rear") {
    qInputSection.innerHTML = `<button class="dav-btn dav-primary" id="q-doRear">Rear (prepare)</button>`;
  }
}

document.getElementById("q-op-enq").onclick = () => qShowInputs("enq");
document.getElementById("q-op-deq").onclick = () => qShowInputs("deq");
document.getElementById("q-op-front").onclick = () => qShowInputs("front");
document.getElementById("q-op-rear").onclick = () => qShowInputs("rear");

// helper to push queue step with meta (front,rear)
function qPush(list, arrSnap, frontSnap, rearSnap, sizeSnap, highlights = [], desc = "") {
  list.push({ arr: [...arrSnap], front: frontSnap, rear: rearSnap, size: sizeSnap, highlights: [...highlights], desc });
}

// actions
qInputSection.addEventListener("click", (e) => {
  if (e.target.id === "q-doEnq") {
    const vStr = document.getElementById("q-val").value.trim();
    if (vStr === "") return alert("Enter value");
    const v = Number(vStr);
    if (isNaN(v)) return alert("Enter numeric value");
    const gen = [];
    qPush(gen, qArr, qFront, qRear, qSize, [], `Prepare to enqueue ${v}`);
    // check overflow: size == cap
    if (qSize === qCap) {
      qPush(gen, qArr, qFront, qRear, qSize, [], `Queue overflow! Cannot enqueue ${v}`);
    } else {
      // if empty, set front=0
      if (qSize === 0) {
        qPush(gen, qArr, qFront, qRear, qSize, [], `Queue is empty — front and rear will be set`);
        const arr2 = [...qArr];
        arr2[0] = v;
        qPush(gen, arr2, 0, 0, 1, [0], `Enqueued ${v} at index 0; front=0, rear=0`);
      } else {
        // normal enqueue: rear = (rear+1)%cap
        const nextRear = (qRear + 1) % qCap;
        qPush(gen, qArr, qFront, qRear, qSize, [nextRear], `Place ${v} at index ${nextRear} (next rear)`);
        const arr2 = [...qArr];
        arr2[nextRear] = v;
        qPush(gen, arr2, qFront === -1 ? 0 : qFront, nextRear, qSize + 1, [nextRear], `Enqueued ${v} at index ${nextRear}; rear=${nextRear}`);
      }
    }
    qOriginal = { arr: [...qArr], front: qFront, rear: qRear, size: qSize };
    qSteps = gen; qIndex = 0;
    qControls.classList.remove("dav-hidden");
    qNote.textContent = `Enqueue prepared: ${gen.length} steps. Click Next Step.`;
    // show first step with provided meta
    const first = qSteps[0];
    renderQueue(first.highlights, { front: first.front, rear: first.rear });
    qDesc.textContent = first.desc;
  }

  if (e.target.id === "q-doDeq") {
    const gen = [];
    qPush(gen, qArr, qFront, qRear, qSize, [], `Prepare to dequeue`);
    if (qSize === 0) {
      qPush(gen, qArr, qFront, qRear, qSize, [], `Underflow! Queue is empty, cannot dequeue`);
    } else {
      qPush(gen, qArr, qFront, qRear, qSize, [qFront], `Removing element at front index ${qFront} (value ${qArr[qFront]})`);
      const arr2 = [...qArr];
      arr2[qFront] = undefined;
      const newSize = qSize - 1;
      let newFront = qFront, newRear = qRear;
      if (newSize === 0) {
        // now queue becomes empty
        qPush(gen, arr2, -1, -1, 0, [], `Queue becomes empty after dequeue`);
      } else {
        newFront = (qFront + 1) % qCap;
        qPush(gen, arr2, newFront, newRear, newSize, [newFront], `Front moves to index ${newFront}`);
      }
    }
    qOriginal = { arr: [...qArr], front: qFront, rear: qRear, size: qSize };
    qSteps = gen; qIndex = 0;
    qControls.classList.remove("dav-hidden");
    qNote.textContent = `Dequeue prepared: ${gen.length} steps. Click Next Step.`;
    renderQueue(qSteps[0].highlights, { front: qSteps[0].front, rear: qSteps[0].rear });
    qDesc.textContent = qSteps[0].desc;
  }

  if (e.target.id === "q-doFront") {
    const gen = [];
    qPush(gen, qArr, qFront, qRear, qSize, [], `Prepare to view front`);
    if (qSize === 0) {
      qPush(gen, qArr, qFront, qRear, qSize, [], `Queue empty — no front element`);
    } else {
      qPush(gen, qArr, qFront, qRear, qSize, [qFront], `Front at index ${qFront} with value ${qArr[qFront]}`);
    }
    qOriginal = { arr: [...qArr], front: qFront, rear: qRear, size: qSize };
    qSteps = gen; qIndex = 0;
    qControls.classList.remove("dav-hidden");
    qNote.textContent = `Front prepared: ${gen.length} steps. Click Next Step.`;
    renderQueue(qSteps[0].highlights, { front: qSteps[0].front, rear: qSteps[0].rear });
    qDesc.textContent = qSteps[0].desc;
  }

  if (e.target.id === "q-doRear") {
    const gen = [];
    qPush(gen, qArr, qFront, qRear, qSize, [], `Prepare to view rear`);
    if (qSize === 0) {
      qPush(gen, qArr, qFront, qRear, qSize, [], `Queue empty — no rear element`);
    } else {
      qPush(gen, qArr, qFront, qRear, qSize, [qRear], `Rear at index ${qRear} with value ${qArr[qRear]}`);
    }
    qOriginal = { arr: [...qArr], front: qFront, rear: qRear, size: qSize };
    qSteps = gen; qIndex = 0;
    qControls.classList.remove("dav-hidden");
    qNote.textContent = `Rear prepared: ${gen.length} steps. Click Next Step.`;
    renderQueue(qSteps[0].highlights, { front: qSteps[0].front, rear: qSteps[0].rear });
    qDesc.textContent = qSteps[0].desc;
  }
});

// Next Step handler for queue
qNext.onclick = () => {
  if (!qSteps || qSteps.length === 0) return alert("No operation prepared");
  if (qIndex >= qSteps.length) {
    alert("Operation finished");
    // finalize last snapshot to actual queue state
    const last = qSteps[qSteps.length - 1];
    // apply last snapshot into qArr/qFront/qRear/qSize
    qArr = Array.isArray(last.arr) ? [...last.arr] : new Array(qCap).fill(undefined);
    qFront = (typeof last.front === "number") ? last.front : qFront;
    qRear = (typeof last.rear === "number") ? last.rear : qRear;
    qSize = (typeof last.size === "number") ? last.size : qSize;
    // sanitize undefined entries into array
    if (!qArr || qArr.length !== qCap) qArr = new Array(qCap).fill(undefined);
    renderQueue([], { front: qFront, rear: qRear });
    qSteps = []; qIndex = 0;
    qControls.classList.add("dav-hidden");
    qDesc.textContent = "Finished.";
    return;
  }
  const step = qSteps[qIndex];
  // apply snapshot to current
  if (Array.isArray(step.arr)) qArr = [...step.arr];
  qFront = (typeof step.front === "number") ? step.front : qFront;
  qRear = (typeof step.rear === "number") ? step.rear : qRear;
  qSize = (typeof step.size === "number") ? step.size : qSize;
  renderQueue(step.highlights || [], { front: step.front, rear: step.rear });
  qDesc.textContent = step.desc || "";
  qIndex++;
};

// Reset handler
qReset.onclick = () => {
  qArr = qOriginal.arr ? [...qOriginal.arr] : new Array(qCap).fill(undefined);
  qFront = (typeof qOriginal.front === "number") ? qOriginal.front : qFront;
  qRear = (typeof qOriginal.rear === "number") ? qOriginal.rear : qRear;
  qSize = (typeof qOriginal.size === "number") ? qOriginal.size : qSize;
  qSteps = []; qIndex = 0;
  qControls.classList.add("dav-hidden");
  qDesc.textContent = "";
  qNote.textContent = "Operation reset.";
  renderQueue();
};

// initial empty render
renderQueue();
