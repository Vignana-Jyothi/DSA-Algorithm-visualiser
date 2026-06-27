graph TD
    %% Styling Definitions
    classDef shell fill:#ececff,stroke:#9370db,stroke-width:2px;
    classDef active fill:#e1f5fe,stroke:#0288d1,stroke-width:1px;
    classDef planned fill:#fff3e0,stroke:#f57c00,stroke-width:1px,stroke-dasharray: 5 5;
    
    %% Core Shell Layer
    Browser --> AppShell
    AppShell --> Preloader:::active
    AppShell --> App:::active
    App --> Home[Home Module]:::active

    %% Active Modules & Files
    Home --> M_Array[Array Module]:::active
        M_Array --> Array.jsx:::active
        M_Array --> ArrayVisualizer.jsx:::active
        M_Array --> arrayVisualizerLogic.js:::active
        M_Array --> array.css:::active

    Home --> M_Stack[Stack Module]:::active
        M_Stack --> Stack.jsx:::active
        M_Stack --> StackVisualizer.jsx:::active
        M_Stack --> stack.css:::active

    Home --> M_Queue[Queue Module]:::active
        M_Queue --> Queue.jsx:::active
        M_Queue --> QueueVisualizer.jsx:::active
        M_Queue --> queue.css:::active

    Home --> M_CQueue[Circular Queue Module]:::active
        M_CQueue --> Cqueue.jsx:::active
        M_CQueue --> CqueueVisualizer.jsx:::active
        M_CQueue --> cqueue.css:::active

    %% Partially Planned Modules
    Home --> M_PQueue[Priority Queue Module]:::active
        M_PQueue --> Pqueue.jsx:::active
        M_PQueue --> PqueueVisualizer.jsx_P[PqueueVisualizer.jsx]:::planned
        M_PQueue --> pqueue.css_P[pqueue.css]:::planned

    %% Planned Modules
    Home --> M_LL[Linked List Module]:::planned
        M_LL --> LinkedList.jsx:::active
        M_LL --> LinkedListVisualizer.jsx_P[LinkedListVisualizer.jsx]:::planned
        M_LL --> linkedListLogic.js_P[linkedListLogic.js]:::planned
        M_LL --> linkedList.css_P[linkedList.css]:::planned

    Home --> M_BTree[Binary Tree Module]:::planned
        M_BTree --> Btree.jsx:::active
        M_BTree --> BtreeVisualizer.jsx_P[BtreeVisualizer.jsx]:::planned
        M_BTree --> btreeLogic.js_P[btreeLogic.js]:::planned
        M_BTree --> btree.css_P[btree.css]:::planned

    Home --> M_BST[BST Module]:::active
        M_BST --> BStree.jsx:::active
        M_BST --> BStreeVisualizer.jsx:::active
        M_BST --> bstreeTreeLogic.js:::active
        M_BST --> bstree.css:::active

    Home --> M_AVL[AVL Tree Module]:::planned
        M_AVL --> AVLtree.jsx:::active
        M_AVL --> AVLtreeVisualizer.jsx_P[AVLtreeVisualizer.jsx]:::planned
        M_AVL --> avlLogic.js_P[avlLogic.js]:::planned
        M_AVL --> avl.css_P[avl.css]:::planned
