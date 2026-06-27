export function newNode(value) {
  return {
    id: `n${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    value,
    left: null,
    right: null,
  };
}

export function cloneTree(root) {
  if (!root) return null;
  return {
    id: root.id,
    value: root.value,
    left: cloneTree(root.left),
    right: cloneTree(root.right),
  };
}

export function collectNodes(root, list = []) {
  if (!root) return list;
  list.push(root);
  collectNodes(root.left, list);
  collectNodes(root.right, list);
  return list;
}

export function parseValueInput(input) {
  return String(input)
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter((s) => s !== "");
}

function compareValues(a, b) {
  const na = Number(a);
  const nb = Number(b);
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
  return String(a).localeCompare(String(b));
}

/** Insert one value following BST rules (left < parent < right). */
export function insertBST(root, value) {
  const val = String(value).trim();
  if (val === "") return { error: "Enter a value" };

  if (!root) {
    return { tree: newNode(val) };
  }

  const tree = cloneTree(root);
  let current = tree;

  while (true) {
    const cmp = compareValues(val, current.value);
    if (cmp === 0) {
      return { error: `Value "${val}" already exists in the BST.` };
    }
    if (cmp < 0) {
      if (!current.left) {
        current.left = newNode(val);
        return { tree };
      }
      current = current.left;
    } else if (!current.right) {
      current.right = newNode(val);
      return { tree };
    } else {
      current = current.right;
    }
  }
}

function findNode(root, id) {
  if (!root) return null;
  if (root.id === id) return root;
  return findNode(root.left, id) || findNode(root.right, id);
}

/** Generate step-by-step BST insertion animation for one value. */
export function generateInsertSteps(tree, value) {
  const val = String(value).trim();
  const steps = [];
  if (!val) return { error: "Enter a value", steps: [] };

  if (!tree) {
    const newRoot = newNode(val);
    steps.push({
      currentId: null,
      visitedIds: [],
      pendingValue: val,
      desc: `Tree is empty — insert ${val} as the root node.`,
      finalTree: newRoot,
      isInsertComplete: true,
    });
    return { steps, finalTree: newRoot };
  }

  let visitedIds = [];
  let current = tree;

  while (true) {
    const cmp = compareValues(val, current.value);

    if (cmp === 0) {
      steps.push({
        currentId: current.id,
        visitedIds: [...visitedIds],
        pendingValue: val,
        compareResult: "equal",
        desc: `${val} equals ${current.value} — duplicate key. Cannot insert.`,
        isError: true,
      });
      return {
        steps,
        error: `Value "${val}" already exists in the BST.`,
        finalTree: tree,
      };
    }

    if (cmp < 0) {
      steps.push({
        currentId: current.id,
        visitedIds: [...visitedIds],
        pendingValue: val,
        compareResult: "less",
        desc: `At node ${current.value}: ${val} < ${current.value} → go LEFT.`,
      });

      if (!current.left) {
        const finalTree = cloneTree(tree);
        const parent = findNode(finalTree, current.id);
        const inserted = newNode(val);
        parent.left = inserted;
        steps.push({
          currentId: current.id,
          visitedIds: [...visitedIds, current.id],
          pendingValue: val,
          insertPreview: { parentId: current.id, side: "left", value: val },
          desc: `Left child of ${current.value} is empty — place ${val} here.`,
        });
        steps.push({
          currentId: inserted.id,
          visitedIds: [...visitedIds, current.id],
          pendingValue: val,
          desc: `Inserted ${val} as left child of ${current.value}.`,
          finalTree,
          isInsertComplete: true,
        });
        return { steps, finalTree };
      }

      visitedIds = [...visitedIds, current.id];
      const next = current.left;
      steps.push({
        currentId: next.id,
        visitedIds: [...visitedIds],
        pendingValue: val,
        activeEdge: { from: current.id, to: next.id },
        desc: `Move to left child (${next.value}).`,
      });
      current = next;
    } else {
      steps.push({
        currentId: current.id,
        visitedIds: [...visitedIds],
        pendingValue: val,
        compareResult: "greater",
        desc: `At node ${current.value}: ${val} > ${current.value} → go RIGHT.`,
      });

      if (!current.right) {
        const finalTree = cloneTree(tree);
        const parent = findNode(finalTree, current.id);
        const inserted = newNode(val);
        parent.right = inserted;
        steps.push({
          currentId: current.id,
          visitedIds: [...visitedIds, current.id],
          pendingValue: val,
          insertPreview: { parentId: current.id, side: "right", value: val },
          desc: `Right child of ${current.value} is empty — place ${val} here.`,
        });
        steps.push({
          currentId: inserted.id,
          visitedIds: [...visitedIds, current.id],
          pendingValue: val,
          desc: `Inserted ${val} as right child of ${current.value}.`,
          finalTree,
          isInsertComplete: true,
        });
        return { steps, finalTree };
      }

      visitedIds = [...visitedIds, current.id];
      const next = current.right;
      steps.push({
        currentId: next.id,
        visitedIds: [...visitedIds],
        pendingValue: val,
        activeEdge: { from: current.id, to: next.id },
        desc: `Move to right child (${next.value}).`,
      });
      current = next;
    }
  }
}

/** Chain insertion steps for multiple values (tree updates between each value). */
export function generateBulkInsertSteps(tree, values) {
  if (!values.length) return { error: "Enter at least one value", steps: [] };

  let currentTree = tree;
  const allSteps = [];

  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    const result = generateInsertSteps(currentTree, value);
    if (result.error && !result.steps.length) {
      return { error: result.error, steps: allSteps, finalTree: currentTree };
    }

    allSteps.push(
      ...result.steps.map((s) => ({
        ...s,
        insertingValue: value,
        insertingIndex: i,
      }))
    );

    if (result.error) {
      return {
        error: result.error,
        steps: allSteps,
        finalTree: currentTree,
        count: allSteps.filter((s) => s.isInsertComplete).length,
      };
    }

    currentTree = result.finalTree;
  }

  return {
    steps: allSteps,
    finalTree: currentTree,
    count: values.length,
  };
}

/** @deprecated Use generateBulkInsertSteps for animated insert. */
export function insertValuesBST(root, values) {
  const result = generateBulkInsertSteps(root, values);
  if (result.error && !result.finalTree) return { error: result.error };
  if (result.error) return { error: result.error, tree: result.finalTree };
  return { tree: result.finalTree, count: result.count };
}

export function getHeight(root) {
  if (!root) return 0;
  return 1 + Math.max(getHeight(root.left), getHeight(root.right));
}

export function getLevelCount(root) {
  return getHeight(root);
}

const NODE_SIZE = 64;
const MIN_H_GAP = NODE_SIZE + 18;
const MIN_V_GAP = 96;

/** Inorder-based layout — suited for BST shape. */
export function computeLayout(root) {
  const positions = {};
  if (!root) {
    return { positions, width: 640, height: 360, treeHeight: 0, nodeCount: 0 };
  }

  const nodeCount = collectNodes(root).length;
  const treeHeight = getHeight(root);
  const hGap = Math.max(MIN_H_GAP, Math.ceil(640 / Math.max(nodeCount, 1)));
  const vGap = Math.max(MIN_V_GAP, 72 + treeHeight * 14);
  const pad = NODE_SIZE;

  let nextX = 0;

  function assign(node, depth) {
    if (!node) return;
    assign(node.left, depth + 1);
    positions[node.id] = {
      x: nextX * hGap + pad,
      y: depth * vGap + pad,
    };
    nextX += 1;
    assign(node.right, depth + 1);
  }

  assign(root, 0);

  const xs = Object.values(positions).map((p) => p.x);
  const ys = Object.values(positions).map((p) => p.y);

  return {
    positions,
    width: Math.max(...xs, pad) + pad,
    height: Math.max(...ys, pad) + pad,
    treeHeight,
    nodeCount,
  };
}

export function computeFitScale(layout, viewportWidth, viewportHeight, padding = 32) {
  if (!layout.width || !layout.height) return 1;
  const availW = Math.max(viewportWidth - padding * 2, 160);
  const availH = Math.max(viewportHeight - padding * 2, 160);
  const scaleX = availW / layout.width;
  const scaleY = availH / layout.height;
  return Math.min(scaleX, scaleY, 2.5);
}

/** Approximate ghost-node position before the new node is committed. */
export function getInsertPreviewPosition(layout, parentId, side) {
  const parent = layout.positions[parentId];
  if (!parent) return null;
  return {
    x: parent.x + (side === "left" ? -58 : 58),
    y: parent.y + 88,
  };
}

export function collectEdges(root, edges = []) {
  if (!root) return edges;
  if (root.left) {
    edges.push({ from: root.id, to: root.left.id });
    collectEdges(root.left, edges);
  }
  if (root.right) {
    edges.push({ from: root.id, to: root.right.id });
    collectEdges(root.right, edges);
  }
  return edges;
}

export function generateTraversalSteps(root, type) {
  const steps = [];
  if (!root) return steps;

  let visitedIds = [];
  let outputValues = [];

  const visit = (node, desc) => {
    outputValues = [...outputValues, node.value];
    steps.push({
      currentId: node.id,
      visitedIds: [...visitedIds],
      outputValues: [...outputValues],
      desc,
    });
    visitedIds = [...visitedIds, node.id];
  };

  const move = (node, desc) => {
    steps.push({
      currentId: node.id,
      visitedIds: [...visitedIds],
      outputValues: [...outputValues],
      desc,
    });
  };

  if (type === "preorder") {
    const walk = (node) => {
      if (!node) return;
      visit(node, `Preorder: visit root ${node.value}`);
      if (node.left) {
        move(node.left, `Move to left child ${node.left.value}`);
        walk(node.left);
      }
      if (node.right) {
        move(node.right, `Move to right child ${node.right.value}`);
        walk(node.right);
      }
    };
    walk(root);
  } else if (type === "inorder") {
    const walk = (node) => {
      if (!node) return;
      if (node.left) {
        move(node.left, `Inorder: go left from ${node.value}`);
        walk(node.left);
      }
      visit(node, `Inorder: visit ${node.value}`);
      if (node.right) {
        move(node.right, `Inorder: go right from ${node.value}`);
        walk(node.right);
      }
    };
    walk(root);
  } else if (type === "postorder") {
    const walk = (node) => {
      if (!node) return;
      if (node.left) {
        move(node.left, `Postorder: explore left of ${node.value}`);
        walk(node.left);
      }
      if (node.right) {
        move(node.right, `Postorder: explore right of ${node.value}`);
        walk(node.right);
      }
      visit(node, `Postorder: visit ${node.value} after children`);
    };
    walk(root);
  } else if (type === "level") {
    const queue = [root];
    while (queue.length) {
      const node = queue.shift();
      visit(node, `Level order (BFS): visit ${node.value}`);
      if (node.left) {
        move(node.left, `Enqueue left child ${node.left.value}`);
        queue.push(node.left);
      }
      if (node.right) {
        move(node.right, `Enqueue right child ${node.right.value}`);
        queue.push(node.right);
      }
    }
  }

  return steps;
}
