export function pushStep(list, arrSnapshot, highlights = [], desc = "", found = []) {
  list.push({
    arr: [...arrSnapshot],
    highlights: [...highlights],
    desc: desc || "",
    found: [...found],
  });
}

export function isSorted(a) {
  for (let i = 1; i < a.length; i++) {
    if (a[i] < a[i - 1]) return false;
  }
  return true;
}

export function generateInsertSteps(arr, maxLen, val, idx) {
  const gen = [];
  const working = [...arr];
  pushStep(gen, working, [idx], `Prepare to insert ${val} at index ${idx}`);
  for (let k = working.length - 1; k >= idx; k--) {
    pushStep(
      gen,
      working,
      [k, k + 1],
      `Shift element ${working[k]} from index ${k} to ${k + 1}`
    );
    working[k + 1] = working[k];
    pushStep(gen, working, [k + 1], `After shifting: element now at index ${k + 1}`);
  }
  working[idx] = val;
  pushStep(gen, working, [idx], `Placed ${val} at index ${idx}`);
  return gen;
}

export function generateDeleteSteps(arr, idx) {
  const gen = [];
  const working = [...arr];
  pushStep(
    gen,
    working,
    [idx],
    `Selected index ${idx} (value ${working[idx]}) for deletion`
  );
  working.splice(idx, 1);
  pushStep(gen, working, [], `Element at index ${idx} removed; shifting elements left`);
  let temp = [...arr];
  for (let k = idx; k < arr.length - 1; k++) {
    const snapshot = [...temp];
    snapshot.splice(k, 1);
    pushStep(gen, snapshot, [], `Shifted element from index ${k + 1} to ${k}`);
    temp.splice(k, 1);
  }
  pushStep(gen, temp, [], `Deletion complete`);
  return gen;
}

export function generateUpdateSteps(arr, idx, val) {
  const gen = [];
  const working = [...arr];
  pushStep(
    gen,
    working,
    [idx],
    `Selected index ${idx} (old value ${working[idx]}) for update`
  );
  working[idx] = val;
  pushStep(
    gen,
    working,
    [idx],
    `Replaced old value with new value ${val} at index ${idx}`
  );
  return gen;
}

export function generateLinearSearchSteps(arr, val) {
  const gen = [];
  const working = [...arr];
  let foundIndex = -1;
  for (let i = 0; i < working.length; i++) {
    pushStep(
      gen,
      working,
      [i],
      `Comparing target ${val} with element at index ${i} (${working[i]})`
    );
    if (working[i] === val) {
      pushStep(gen, working, [i], `Found target ${val} at index ${i}`, [i]);
      foundIndex = i;
      break;
    }
  }
  if (foundIndex === -1) {
    pushStep(gen, working, [], `Target ${val} not found in the array`);
  }
  return gen;
}

export function generateBinarySearchSteps(arr, val) {
  const gen = [];
  let low = 0;
  let high = arr.length - 1;
  let found = -1;
  const working = [...arr];
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    pushStep(
      gen,
      working,
      [mid, low, high],
      `Comparing target ${val} with middle index ${mid} (value ${working[mid]})`
    );
    if (working[mid] === val) {
      pushStep(gen, working, [mid], `Found target ${val} at index ${mid}`, [mid]);
      found = mid;
      break;
    }
    if (working[mid] < val) {
      pushStep(
        gen,
        working,
        [mid],
        `Target larger than ${working[mid]} — move right (low = ${mid + 1})`
      );
      low = mid + 1;
    } else {
      pushStep(
        gen,
        working,
        [mid],
        `Target smaller than ${working[mid]} — move left (high = ${mid - 1})`
      );
      high = mid - 1;
    }
  }
  if (found === -1) pushStep(gen, working, [], `Target ${val} not found`);
  return gen;
}

export function generateSortSteps(type, arr) {
  const local = [...arr];
  const list = [];
  if (type === "bubble") {
    for (let i = 0; i < local.length - 1; i++) {
      for (let j = 0; j < local.length - i - 1; j++) {
        pushStep(
          list,
          local,
          [j, j + 1],
          `Compare indices ${j}(${local[j]}) and ${j + 1}(${local[j + 1]})`
        );
        if (local[j] > local[j + 1]) {
          const a = local[j];
          const b = local[j + 1];
          [local[j], local[j + 1]] = [local[j + 1], local[j]];
          pushStep(
            list,
            local,
            [j, j + 1],
            `Swapped because ${a} > ${b} — now ${local[j]} at ${j}, ${local[j + 1]} at ${j + 1}`
          );
        } else {
          pushStep(
            list,
            local,
            [j, j + 1],
            `No swap needed because ${local[j]} <= ${local[j + 1]}`
          );
        }
      }
      pushStep(
        list,
        local,
        [local.length - i - 1],
        `After pass ${i + 1}, index ${local.length - i - 1} is in correct position`
      );
    }
  } else if (type === "selection") {
    for (let i = 0; i < local.length - 1; i++) {
      let min = i;
      pushStep(list, local, [i], `Start pass at index ${i}; initialize min at ${i} (${local[min]})`);
      for (let j = i + 1; j < local.length; j++) {
        pushStep(
          list,
          local,
          [min, j],
          `Compare current min ${local[min]}(index ${min}) with ${local[j]}(index ${j})`
        );
        if (local[j] < local[min]) {
          min = j;
          pushStep(list, local, [min], `New min found at index ${min} (${local[min]})`);
        }
      }
      if (min !== i) {
        const a = local[i];
        const b = local[min];
        [local[i], local[min]] = [local[min], local[i]];
        pushStep(
          list,
          local,
          [i, min],
          `Swapped ${a} and ${b} because ${b} was the minimum`
        );
      } else {
        pushStep(list, local, [i], `No swap needed for pass ${i + 1}`);
      }
    }
  } else if (type === "insertion") {
    for (let i = 1; i < local.length; i++) {
      const key = local[i];
      let j = i - 1;
      pushStep(list, local, [i], `Picked key ${key} from index ${i}`);
      while (j >= 0 && local[j] > key) {
        pushStep(
          list,
          local,
          [j, j + 1],
          `Compare ${local[j]} (index ${j}) > key ${key}? yes — shift ${local[j]} to index ${j + 1}`
        );
        local[j + 1] = local[j];
        pushStep(
          list,
          local,
          [j + 1],
          `After shift, element at index ${j + 1} is ${local[j + 1]}`
        );
        j--;
      }
      local[j + 1] = key;
      pushStep(list, local, [j + 1], `Placed key ${key} at index ${j + 1}`);
    }
  } else if (type === "quick") {
    const partition = (low, high) => {
      const pivot = local[high];
      let i = low - 1;
      pushStep(list, local, [high], `Partition: pivot ${pivot} at index ${high}`);
      for (let j = low; j < high; j++) {
        pushStep(
          list,
          local,
          [j, high],
          `Compare ${local[j]} (index ${j}) with pivot ${pivot}`
        );
        if (local[j] < pivot) {
          i++;
          const a = local[i];
          const b = local[j];
          [local[i], local[j]] = [local[j], local[i]];
          pushStep(
            list,
            local,
            [i, j],
            `Swapped ${b} and ${a} because ${b} < pivot`
          );
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
