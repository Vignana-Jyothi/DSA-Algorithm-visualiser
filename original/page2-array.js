/* page2-array.js
   Full manual step-by-step visualizer:
   - User creates length (array starts EMPTY)
   - User uses Insertion to enter elements (or later insert/delete/update)
   - All operations (insertion, deletion, update, search (linear/binary), sorts) are visualized step-by-step
   - Each step has a 1-line description for beginners.
*/

const visualizer = document.getElementById("dav-visualizer");
const lenInput = document.getElementById("dav-len");
const createBtn = document.getElementById("dav-create");
const noteArea = document.getElementById("dav-note");
const opsSection = document.getElementById("dav-operations");
const inputSection = document.getElementById("dav-input-section");
const lenDisplay = document.getElementById("dav-length");
const sortType = document.getElementById("sort-type");
const sortStart = document.getElementById("sort-start");
const nextStepBtn = document.getElementById("next-step");
const resetBtn = document.getElementById("reset-sort");
const stepControls = document.getElementById("step-controls");
const stepDesc = document.getElementById("step-description");

let arr = [];               // current array (numbers)
let maxLen = 0;             // capacity chosen by user
let steps = [];             // generated micro-steps for current operation
let stepIndex = 0;          // index into steps
let originalArr = [];       // copy to restore on reset

// render array with optional highlights array of indices
function render(highlights = [], foundIndices = []) {
  visualizer.innerHTML = "";
  lenDisplay.textContent = `Array Length: ${arr.length} / ${maxLen}`;
  for (let i = 0; i < maxLen; i++) {
    const div = document.createElement("div");
    div.className = "dav-item";
    // show empty spot differently
    if (i < arr.length) {
      div.innerHTML = `<div>${arr[i]}</div><div class="dav-index">${i}</div>`;
    } else {
      div.innerHTML = `<div style="color:#bbb">—</div><div class="dav-index">${i}</div>`;
      div.style.opacity = 0.6;
    }
    if (highlights.includes(i)) div.classList.add("highlight");
    if (foundIndices.includes(i)) div.classList.add("found");
    visualizer.appendChild(div);
  }
}

// Create array length (empty array) — user will insert manually
createBtn.onclick = () => {
  const n = parseInt(lenInput.value);
  if (isNaN(n) || n <= 0) return alert("Enter a valid positive length");
  maxLen = n;
  arr = [];
  originalArr = [];
  steps = [];
  stepIndex = 0;
  inputSection.innerHTML = ""; // clear input area
  opsSection.classList.remove("dav-hidden");
  noteArea.textContent = "Array created empty. Use Insertion to add elements.";
  render();
};

// Helper: build insertion / deletion / update / search UI
function showInputs(type) {
  inputSection.innerHTML = "";
  stepDesc.textContent = "";
  if (type === "insert") {
    inputSection.innerHTML = `
      <input id="val" class="dav-input" placeholder="Element (number)">
      <input id="idx" class="dav-input" type="number" min="0" placeholder="Index (optional, append if empty)">
      <button class="dav-btn dav-primary" id="doInsert">Insert</button>
      <div style="color:#777;margin-top:6px;font-size:0.9rem;"></div>
    `;
  } else if (type === "delete") {
    inputSection.innerHTML = `
      <input id="idx" class="dav-input" type="number" min="0" placeholder="Index to delete">
      <button class="dav-btn dav-primary" id="doDelete">Delete</button>
    `;
  } else if (type === "update") {
    inputSection.innerHTML = `
      <input id="idx" class="dav-input" type="number" min="0" placeholder="Index to update">
      <input id="val" class="dav-input" placeholder="New value">
      <button class="dav-btn dav-primary" id="doUpdate">Update</button>
    `;
  } else if (type === "search") {
    inputSection.innerHTML = `
      <input id="val" class="dav-input" placeholder="Element to search">
      <select id="search-type" class="dav-input">
        <option value="linear">Linear Search</option>
        <option value="binary">Binary Search (requires sorted array)</option>
      </select>
      <button class="dav-btn dav-primary" id="doSearch">Search</button>
    `;
  }
}

document.getElementById("op-insert").onclick = () => showInputs("insert");
document.getElementById("op-delete").onclick = () => showInputs("delete");
document.getElementById("op-update").onclick = () => showInputs("update");
document.getElementById("op-search").onclick = () => showInputs("search");

// Utility to push step: snapshot array, highlights, description, optional foundIndices
function pushStep(list, arrSnapshot, highlights = [], desc = "", found = []) {
  list.push({ arr: [...arrSnapshot], highlights: [...highlights], desc: desc || "", found: [...found] });
}

// Actions: when user clicks the operation buttons
inputSection.addEventListener("click", (e) => {
  if (e.target.id === "doInsert") {
    const valStr = document.getElementById("val").value.trim();
    const idxStr = document.getElementById("idx").value.trim();
    if (valStr === "") return alert("Enter a value");
    const val = Number(valStr);
    if (isNaN(val)) return alert("Enter a valid number");
    // index optional -> append if empty
    let idx = idxStr === "" ? arr.length : parseInt(idxStr);
    if (isNaN(idx) || idx < 0 || idx > arr.length || arr.length >= maxLen) return alert("Invalid index or array full");
    // Generate steps for insertion:
    // Steps: highlight insertion index, then for k from arr.length-1 down to idx shift element right (step per shift),
    // then place new value at idx (final step).
    const gen = [];
    const working = [...arr];
    pushStep(gen, working, [idx], `Prepare to insert ${val} at index ${idx}`);
    for (let k = working.length - 1; k >= idx; k--) {
      // show comparison of shifting
      pushStep(gen, working, [k, k + 1], `Shift element ${working[k]} from index ${k} to ${k + 1}`);
      working[k + 1] = working[k]; // shift
      pushStep(gen, working, [k + 1], `After shifting: element now at index ${k + 1}`);
    }
    // insert value
    working[idx] = val;
    pushStep(gen, working, [idx], `Placed ${val} at index ${idx}`);
    // If insertion was at end and arr.length==idx, the loop doesn't run and working[idx]=val will set new element
    // Finalize: generate steps and set originalArr for reset
    // Save steps and original snapshot for stepping
    originalArr = [...arr];
    steps = gen;
    stepIndex = 0;
    // set a flag to apply steps to real array as Next Step is clicked: we will update arr on each step
    stepControls.classList.remove("dav-hidden");
    // Ensure maxLen not overflowed — actual array will be extended via stepping
    noteArea.textContent = `Insertion prepared: ${gen.length} steps. Click Next Step to perform them one by one.`;
    // but we must ensure working length (arr.length+1) not exceed maxLen — already checked
    render(steps[0].highlights);
    stepDesc.textContent = steps[0].desc;
  }

  if (e.target.id === "doDelete") {
    const idxStr = document.getElementById("idx").value.trim();
    if (idxStr === "") return alert("Enter index to delete");
    const idx = parseInt(idxStr);
    if (isNaN(idx) || idx < 0 || idx >= arr.length) return alert("Invalid index");
    // Generate deletion steps:
    // Show selecting index, remove it, then shift left step-by-step for each position after idx
    const gen = [];
    const working = [...arr];
    pushStep(gen, working, [idx], `Selected index ${idx} (value ${working[idx]}) for deletion`);
    // Remove logically: we'll show removal by clearing that index then shifting
    working.splice(idx, 1); // remove in working to produce snapshots after each shift
    pushStep(gen, working, [], `Element at index ${idx} removed; shifting elements left`);
    // For clarity, show each intermediate state as elements shift (already above does immediate shift),
    // but to be explicit, re-create snapshots that simulate stepwise left shifts:
    // Actually working already the final after shifts; we'll reconstruct shifting steps from original arr
    let temp = [...originalOrCurrent(arr)];
    // snapshot before shifting (showing a blank)
    const g2 = [];
    temp.splice(idx,1); // perform shift
    // Build stepwise shifts: show each shift by copying original and moving elements one left at each step
    temp = [...arr];
    for (let k = idx; k < arr.length - 1; k++) {
      const snapshot = [...temp];
      snapshot.splice(k,1); // after removing position k
      pushStep(gen, snapshot, [], `Shifted element from index ${k + 1} to ${k}`);
      temp.splice(k,1);
    }
    // Final snapshot
    pushStep(gen, temp, [], `Deletion complete`);
    originalArr = [...arr];
    steps = gen;
    stepIndex = 0;
    stepControls.classList.remove("dav-hidden");
    noteArea.textContent = `Deletion prepared: ${gen.length} steps. Click Next Step.`;
    render(steps[0].highlights);
    stepDesc.textContent = steps[0].desc;
  }

  if (e.target.id === "doUpdate") {
    const idxStr = document.getElementById("idx").value.trim();
    const valStr = document.getElementById("val").value.trim();
    if (idxStr === "" || valStr === "") return alert("Enter index and new value");
    const idx = parseInt(idxStr);
    const val = Number(valStr);
    if (isNaN(idx) || idx < 0 || idx >= arr.length) return alert("Invalid index");
    if (isNaN(val)) return alert("Enter numeric value");
    // Create update steps: show selecting index, show old value, replace
    const gen = [];
    const working = [...arr];
    pushStep(gen, working, [idx], `Selected index ${idx} (old value ${working[idx]}) for update`);
    // show replacing step
    working[idx] = val;
    pushStep(gen, working, [idx], `Replaced old value with new value ${val} at index ${idx}`);
    originalArr = [...arr];
    steps = gen;
    stepIndex = 0;
    stepControls.classList.remove("dav-hidden");
    noteArea.textContent = `Update prepared: ${gen.length} steps. Click Next Step.`;
    render(steps[0].highlights);
    stepDesc.textContent = steps[0].desc;
  }

  if (e.target.id === "doSearch") {
    const valStr = document.getElementById("val").value.trim();
    const sType = document.getElementById("search-type").value;
    if (valStr === "") return alert("Enter value to search");
    const val = Number(valStr);
    if (isNaN(val)) return alert("Enter numeric target");
    if (sType === "linear") {
      const gen = [];
      const working = [...arr];
      // Linear search: highlight each index and compare
      let foundIndex = -1;
      for (let i = 0; i < working.length; i++) {
        pushStep(gen, working, [i], `Comparing target ${val} with element at index ${i} (${working[i]})`);
        if (working[i] === val) {
          pushStep(gen, working, [i], `Found target ${val} at index ${i}`, [i]);
          foundIndex = i;
          break;
        }
      }
      if (foundIndex === -1) pushStep(gen, working, [], `Target ${val} not found in the array`);
      originalArr = [...arr];
      steps = gen;
      stepIndex = 0;
      stepControls.classList.remove("dav-hidden");
      noteArea.textContent = `Linear search prepared: ${gen.length} steps. Click Next Step.`;
      render(steps[0].highlights, steps[0].found);
      stepDesc.textContent = steps[0].desc;
    } else {
      // Binary search — requires array to be sorted in non-decreasing order
      if (!isSorted(arr)) {
        return alert("Binary search requires the array to be sorted in non-decreasing order. Sort first.");
      }
      const gen = [];
      let low = 0, high = arr.length - 1, found = -1;
      const working = [...arr];
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        pushStep(gen, working, [mid, low, high], `Comparing target ${val} with middle index ${mid} (value ${working[mid]})`);
        if (working[mid] === val) {
          pushStep(gen, working, [mid], `Found target ${val} at index ${mid}`, [mid]);
          found = mid;
          break;
        } else if (working[mid] < val) {
          pushStep(gen, working, [mid], `Target larger than ${working[mid]} — move right (low = ${mid + 1})`);
          low = mid + 1;
        } else {
          pushStep(gen, working, [mid], `Target smaller than ${working[mid]} — move left (high = ${mid - 1})`);
          high = mid - 1;
        }
      }
      if (found === -1) pushStep(gen, working, [], `Target ${val} not found`);
      originalArr = [...arr];
      steps = gen;
      stepIndex = 0;
      stepControls.classList.remove("dav-hidden");
      noteArea.textContent = `Binary search prepared: ${gen.length} steps. Click Next Step.`;
      render(steps[0].highlights, steps[0].found);
      stepDesc.textContent = steps[0].desc;
    }
  }
});

// Utility: check sorted (non-decreasing)
function isSorted(a) {
  for (let i = 1; i < a.length; i++) if (a[i] < a[i - 1]) return false;
  return true;
}

// Helper used earlier in deletion path to grab original or current arr
function originalOrCurrent(current) {
  return current ? [...current] : [];
}

// Sorting step generation with explanatory descriptions
function generateSortSteps(type) {
  const local = [...arr];
  const list = [];
  // pushStep(list, local, [], `Starting ${type} sort`);
  if (type === "bubble") {
    for (let i = 0; i < local.length - 1; i++) {
      for (let j = 0; j < local.length - i - 1; j++) {
        pushStep(list, local, [j, j + 1], `Compare indices ${j}(${local[j]}) and ${j + 1}(${local[j + 1]})`);
        if (local[j] > local[j + 1]) {
          const a = local[j], b = local[j + 1];
          [local[j], local[j + 1]] = [local[j + 1], local[j]];
          pushStep(list, local, [j, j + 1], `Swapped because ${a} > ${b} — now ${local[j]} at ${j}, ${local[j+1]} at ${j+1}`);
        } else {
          pushStep(list, local, [j, j + 1], `No swap needed because ${local[j]} <= ${local[j+1]}`);
        }
      }
      // optional: mark last sorted element
      pushStep(list, local, [local.length - i - 1], `After pass ${i + 1}, index ${local.length - i - 1} is in correct position`);
    }
  } else if (type === "selection") {
    for (let i = 0; i < local.length - 1; i++) {
      let min = i;
      pushStep(list, local, [i], `Start pass at index ${i}; initialize min at ${i} (${local[min]})`);
      for (let j = i + 1; j < local.length; j++) {
        pushStep(list, local, [min, j], `Compare current min ${local[min]}(index ${min}) with ${local[j]}(index ${j})`);
        if (local[j] < local[min]) {
          min = j;
          pushStep(list, local, [min], `New min found at index ${min} (${local[min]})`);
        }
      }
      if (min !== i) {
        const a = local[i], b = local[min];
        [local[i], local[min]] = [local[min], local[i]];
        pushStep(list, local, [i, min], `Swapped ${a} and ${b} because ${b} was the minimum`);
      } else {
        pushStep(list, local, [i], `No swap needed for pass ${i + 1}`);
      }
    }
  } else if (type === "insertion") {
    for (let i = 1; i < local.length; i++) {
      let key = local[i];
      let j = i - 1;
      pushStep(list, local, [i], `Picked key ${key} from index ${i}`);
      while (j >= 0 && local[j] > key) {
        pushStep(list, local, [j, j + 1], `Compare ${local[j]} (index ${j}) > key ${key}? yes — shift ${local[j]} to index ${j + 1}`);
        local[j + 1] = local[j];
        pushStep(list, local, [j + 1], `After shift, element at index ${j + 1} is ${local[j + 1]}`);
        j--;
      }
      local[j + 1] = key;
      pushStep(list, local, [j + 1], `Placed key ${key} at index ${j + 1}`);
    }
  } else if (type === "quick") {
    // We'll implement recursive quicksort but record steps inside partition
    const partition = (low, high) => {
      const pivot = local[high];
      let i = low - 1;
      pushStep(list, local, [high], `Partition: pivot ${pivot} at index ${high}`);
      for (let j = low; j < high; j++) {
        pushStep(list, local, [j, high], `Compare ${local[j]} (index ${j}) with pivot ${pivot}`);
        if (local[j] < pivot) {
          i++;
          const a = local[i], b = local[j];
          [local[i], local[j]] = [local[j], local[i]];
          pushStep(list, local, [i, j], `Swapped ${b} and ${a} because ${b} < pivot`);
        }
      }
      [local[i + 1], local[high]] = [local[high], local[i + 1]];
      pushStep(list, local, [i + 1, high], `Placed pivot ${pivot} at index ${i + 1}`);
      return i + 1;
    };
    const quick = (low, high) => {
      if (low < high) {
        const p = partition(low, high);
        quick(low, p - 1);
        quick(p + 1, high);
      }
    };
    quick(0, local.length - 1);
  }
  return list;
}

// Start Sorting
sortStart.onclick = () => {
  const type = sortType.value;
  if (!type) return alert("Select a sorting algorithm first");
  originalArr = [...arr];
  steps = generateSortSteps(type);
  if (steps.length === 0) {
    alert("No steps generated (array might be empty)");
    return;
  }
  stepIndex = 0;
  stepControls.classList.remove("dav-hidden");
  noteArea.textContent = `Sorting prepared (${steps.length} micro-steps). Click Next Step to proceed.`;
  render(steps[0].highlights, steps[0].found || []);
  stepDesc.textContent = steps[0].desc || "";
};

// Next Step universal handler
nextStepBtn.onclick = () => {
  if (!steps || steps.length === 0) return alert("No operation in progress. Generate steps first.");
  if (stepIndex >= steps.length) {
    alert("Operation completed!");
    // finalize arr to last snapshot if exists
    if (steps.length > 0) arr = [...steps[steps.length - 1].arr];
    render();
    stepControls.classList.add("dav-hidden");
    stepDesc.textContent = "Operation finished.";
    steps = [];
    stepIndex = 0;
    return;
  }
  const s = steps[stepIndex];
  // apply snapshot to real array (arr)
  arr = [...s.arr];
  render(s.highlights || [], s.found || []);
  stepDesc.textContent = s.desc || "";
  stepIndex++;
};

// Reset: restore original array prior to the current prepared operation
resetBtn.onclick = () => {
  arr = originalArr ? [...originalArr] : [];
  render();
  stepControls.classList.add("dav-hidden");
  steps = [];
  stepIndex = 0;
  stepDesc.textContent = "";
  noteArea.textContent = "Operation reset. You can continue editing the array using insertion/update/delete.";
};

// Initial render (nothing)
render();
