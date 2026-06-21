export function newNode(value) {
  return { id: `n${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, value, left: null, right: null };
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

export function findNode(root, id) {
  if (!root) return null;
  if (root.id === id) return root;
  return findNode(root.left, id) || findNode(root.right, id);
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

/** Insert one value into the first available slot (level-order, left before right). */
export function insertLevelOrder(root, value) {
  const val = String(value).trim();
  if (val === "") return { error: "Enter a value" };

  if (!root) {
    return { tree: newNode(val) };
  }

  const tree = cloneTree(root);
  const queue = [tree];

  while (queue.length) {
    const node = queue.shift();
    if (!node.left) {
      node.left = newNode(val);
      return { tree };
    }
    if (!node.right) {
      node.right = newNode(val);
      return { tree };
    }
    queue.push(node.left);
    queue.push(node.right);
  }

  return { tree };
}

/** Bulk insert — each value fills the next level-order position. */
export function insertValuesLevelOrder(root, values) {
  if (!values.length) return { error: "Enter at least one value" };

  let tree = root;
  for (const value of values) {
    const result = insertLevelOrder(tree, value);
    if (result.error) return result;
    tree = result.tree;
  }

  return { tree, count: values.length };
}

export function getHeight(root) {
  if (!root) return 0;
  return 1 + Math.max(getHeight(root.left), getHeight(root.right));
}

export function getLevelCount(root) {
  return getHeight(root);
}

const NODE_SIZE = 52;
const MIN_H_GAP = NODE_SIZE + 14;
const MIN_V_GAP = 78;

function collectLevels(root) {
  if (!root) return [];
  const levels = [];
  let queue = [root];
  while (queue.length) {
    const level = [];
    const next = [];
    for (const node of queue) {
      level.push(node);
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    levels.push(level);
    queue = next;
  }
  return levels;
}

export function computeLayout(root) {
  const positions = {};
  if (!root) {
    return { positions, width: 520, height: 280, treeHeight: 0, nodeCount: 0 };
  }

  const levels = collectLevels(root);
  const treeHeight = levels.length;
  const maxLevelWidth = Math.pow(2, treeHeight - 1);
  const nodeCount = levels.reduce((sum, level) => sum + level.length, 0);

  const hGap = Math.max(MIN_H_GAP, Math.ceil(420 / maxLevelWidth));
  const vGap = Math.max(MIN_V_GAP, 56 + treeHeight * 10);
  const pad = NODE_SIZE;

  const totalWidth = maxLevelWidth * hGap + pad * 2;

  levels.forEach((levelNodes, depth) => {
    const count = levelNodes.length;
    const levelSpan = count * hGap;
    const startX = (totalWidth - levelSpan) / 2 + hGap / 2;

    levelNodes.forEach((node, index) => {
      positions[node.id] = {
        x: startX + index * hGap,
        y: depth * vGap + pad,
      };
    });
  });

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

/** Scale factor to fit layout inside a viewport while preserving aspect ratio. */
export function computeFitScale(layout, viewportWidth, viewportHeight, padding = 24) {
  if (!layout.width || !layout.height) return 1;
  const availW = Math.max(viewportWidth - padding * 2, 120);
  const availH = Math.max(viewportHeight - padding * 2, 120);
  const scaleX = availW / layout.width;
  const scaleY = availH / layout.height;
  return Math.min(scaleX, scaleY, 1);
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
