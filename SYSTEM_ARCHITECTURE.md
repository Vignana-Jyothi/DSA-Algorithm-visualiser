# DSA Visualizer System Architecture

## 1. Overview

This project is a React-based DSA visualizer application that currently includes:
- a navigation shell and route configuration
- a homepage with links to DSA topics
- theory pages for arrays, stacks, queues, circular queues
- a working array visualizer with step-by-step operations
- placeholder pages for priority queue, linked list, binary tree, BST, and AVL tree


## 2. Current System Architecture

### 2.1 Entry and Shell
- `src/main.jsx`
  - app entry point
  - renders `AppShell`
  - imports Bootstrap CSS
- `src/AppShell.jsx`
  - controls the preloader and main app visibility
  - displays `Preloader` while loading
- `src/App.jsx`
  - configures browser routing with `react-router-dom`
  - defines page routes for each data structure feature

### 2.2 Shared UI Components
- `src/components/TheoryPageHeader.jsx`
  - shared header for theory pages
  - includes a button to open the visualizer
- `src/components/VisualizerPageHeader.jsx`
  - shared header for visualizer pages
  - includes a back link to the explanation page
- `src/components/ComingSoonPage.jsx`
  - placeholder page for not-yet-added features
- `src/components/Preloader.jsx`
  - splash loading animation used by `AppShell`

### 2.3 Feature Modules
Each feature lives in its own folder under `src/`.

#### Implemented Modules
- `src/Array/`
  - `Array.jsx` — theory page
  - `ArrayVisualizer.jsx` — interactive visualization page
  - `arrayVisualizerLogic.js` — algorithm step generation and operation logic
  - `array.css` — feature-specific styles
- `src/Stack/`
  - `Stack.jsx` — theory page
  - `StackVisualizer.jsx` — visualizer page
  - `stack.css` — feature-specific styles
- `src/Queue/`
  - `Queue.jsx` — theory page
  - `QueueVisualizer.jsx` — visualizer page
  - `queue.css`
- `src/Cqueue/`
  - `Cqueue.jsx` — theory page
  - `CqueueVisualizer.jsx` — visualizer page
  - `cqueue.css`

#### Placeholder Modules
- `src/Pqueue/Pqueue.jsx`
- `src/LinkedList/LinkedList.jsx`
- `src/Btree/Btree.jsx`
- `src/BStree/BStree.jsx`
- `src/AVLtree/AVLtree.jsx`

These currently use `ComingSoonPage` and should be filled with theory and visualizer content.

## 3. Logical Architecture

The application can be modeled in three layers:

### 3.1 Presentation Layer
- React components and pages
- route-driven navigation
- UI layout using Bootstrap and CSS
- feature pages and visualizer pages

### 3.2 Domain Layer
- data structure operations and visualization logic
- step-by-step operation generation for animation
- state management using React hooks within visualizer pages

### 3.3 Shared Infrastructure
- common page headers
- app shell / preloader
- route config
- CSS styling conventions

## 4. Future Module Pattern

To standardize new data structure features, use this folder pattern:

- `src/<Feature>/` folder
  - `<Feature>.jsx` — theory and explanation page
  - `<Feature>Visualizer.jsx` — interactive visualizer page
  - `<feature>Logic.js` — operation generators and structure helpers
  - `<feature>.css` — feature styles
  - optionally `<feature>Model.js` or `<feature>Data.js` for internal structure representation

Example:
- `src/LinkedList/LinkedList.jsx`
- `src/LinkedList/LinkedListVisualizer.jsx`
- `src/LinkedList/linkedListLogic.js`
- `src/LinkedList/linkedList.css`

## 5. Recommended Overall File Structure

```
src/
  App.jsx
  AppShell.jsx
  main.jsx
  components/
    ComingSoonPage.jsx
    Preloader.jsx
    TheoryPageHeader.jsx
    VisualizerPageHeader.jsx
  Home/
    Home.jsx
    home.css
    Array/
        Array.jsx
        ArrayVisualizer.jsx
        arrayVisualizerLogic.js
        array.css
    Stack/
        Stack.jsx
        StackVisualizer.jsx
        stack.css
    Queue/
        Queue.jsx
        QueueVisualizer.jsx
        queue.css
    Cqueue/
        Cqueue.jsx
        CqueueVisualizer.jsx
        cqueue.css
    Pqueue/
        Pqueue.jsx
        PqueueVisualizer.jsx
        pqueue.css
    LinkedList/
        LinkedList.jsx
        LinkedListVisualizer.jsx
        linkedListLogic.js
        linkedList.css
    Btree/
        Btree.jsx
        BtreeVisualizer.jsx
        btreeLogic.js
        btree.css
    BStree/
        BStree.jsx
        BStreeVisualizer.jsx
        bstLogic.js
        bst.css
    AVLtree/
        AVLtree.jsx
        AVLtreeVisualizer.jsx
        avlLogic.js
        avl.css
```

## 6. Future Modules and Features

The system can grow into a complete DSA visualization platform with these additions:

### 6.1 Additional Data Structures
- `Heap` / `MinHeap` / `MaxHeap`
- `HashTable` / `HashMap`
- `Trie` / `Prefix Tree`
- `Graph` (adjacency list/matrix) and `GraphVisualizer`
- `RedBlackTree` / `SegmentTree` / `FenwickTree`
- `DisjointSet` / `UnionFind`

### 6.2 Algorithm Pages
- Sorting algorithms: Bubble, Selection, Insertion, Merge, Quick, Heap, Radix
- Search algorithms: Linear, Binary, Jump, Exponential
- Graph algorithms: BFS, DFS, Dijkstra, A*, Kruskal, Prim
- Tree traversals: Inorder, Preorder, Postorder, Level order

### 6.3 Visualization and Learning Features
- side-by-side pseudocode and code snippets
- step-by-step operation playback controls
- performance and complexity comparison panel
- algorithm choice guide and interactive quizzes
- theme / dark mode
- mobile-friendly responsive layout

### 6.4 Architecture Extensions
- `src/shared/` or `src/common/` for reusable hooks and utilities
- `src/services/` for algorithm engines and data model helpers
- `src/assets/` for images, icons, and static diagrams
- `src/constants/` for route definitions and menu metadata

## 7. Recommended Architecture Diagram

The application can be visualized as:

```
Browser
  └─> AppShell
         ├─> Preloader
         └─> App
              └─> Home Module
                    │      
                    ├─> Array Module
                    │      ├─> Array.jsx
                    │      ├─> ArrayVisualizer.jsx
                    │      ├─> arrayVisualizerLogic.js
                    │      └─> array.css
                    ├─> Stack Module
                    │      ├─> Stack.jsx
                    │      ├─> StackVisualizer.jsx
                    │      └─> stack.css
                    ├─> Queue Module
                    │      ├─> Queue.jsx
                    │      ├─> QueueVisualizer.jsx
                    │      └─> queue.css
                    ├─> Circular Queue Module
                    │      ├─> Cqueue.jsx
                    │      ├─> CqueueVisualizer.jsx
                    │      └─> cqueue.css
                    ├─> Priority Queue Module
                    │      ├─> Pqueue.jsx
                    │      ├─> PqueueVisualizer.jsx (planned)
                    │      └─> pqueue.css (planned)
                    ├─> Linked List Module
                    │      ├─> LinkedList.jsx
                    │      ├─> LinkedListVisualizer.jsx (planned)
                    │      ├─> linkedListLogic.js (planned)
                    │      └─> linkedList.css (planned)
                    ├─> Binary Tree Module
                    │      ├─> Btree.jsx
                    │      ├─> BtreeVisualizer.jsx (planned)
                    │      ├─> btreeLogic.js (planned)
                    │      └─> btree.css (planned)
                    ├─> BST Module
                    │      ├─> BStree.jsx
                    │      ├─> BStreeVisualizer.jsx (planned)
                    │      ├─> bstLogic.js (planned)
                    │      └─> bst.css (planned)
                    └─> AVL Tree Module
                        ├─> AVLtree.jsx
                        ├─> AVLtreeVisualizer.jsx (planned)
                        ├─> avlLogic.js (planned)
                        └─> avl.css (planned)

Shared components:
  - TheoryPageHeader
  - VisualizerPageHeader
  - ComingSoonPage
  - Preloader

Cross-cutting:
  - Routing
  - Theme / CSS
  - Data operation logic
  - Visual step controller state
```

## 8. Recommended Fill-in Plan for Missing Modules

For each placeholder module, implement:
1. a theory page component with definition, operations, examples, time complexity
2. a matching visualizer page with state-managed operation steps
3. a logic file that generates animation states for insert/delete/search/traverse operations
4. route entries in `src/App.jsx`
5. a feature-specific CSS file or shared visual style

### Example: LinkedList
- `src/LinkedList/LinkedList.jsx`
- `src/LinkedList/LinkedListVisualizer.jsx`
- `src/LinkedList/linkedListLogic.js`
- `src/LinkedList/linkedList.css`

### Example: Binary Search Tree
- `src/BStree/BStree.jsx`
- `src/BStree/BStreeVisualizer.jsx`
- `src/BStree/bstLogic.js`
- `src/BStree/bst.css`

## 9. Summary

This architecture keeps the app modular and extensible:
- feature modules are isolated by folder
- shared presentation elements live under `components`
- algorithm logic is separated into dedicated JS helpers
- new data structure visualizers follow a repeatable file pattern

The next step is to implement the missing placeholders using the same feature-module structure and then expand with graph, heap, trie, and algorithm comparison modules.
