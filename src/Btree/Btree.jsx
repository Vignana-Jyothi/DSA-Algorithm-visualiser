import TheoryPageHeader from "../components/TheoryPageHeader";
import "../Array/array.css";

function Btree() {
  return (
    <>
      <div className="logo-part">DSA Visualizer</div>
      <div className="mainbox">
        <TheoryPageHeader title="Binary Tree" to="/btree/visualizer" />

        <div className="def">
          <div className="d1">Definition</div>
          <div className="d2">
            A binary tree is a hierarchical data structure in which each node has at
            most two children, referred to as the left child and the right child. Unlike
            a Binary Search Tree (BST), values are not ordered — structure is defined
            by how nodes are linked, not by comparison rules.
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Key Terminology</div>
          <div className="d2">
            Root — the topmost node
            <br />
            Parent — a node with at least one child
            <br />
            Leaf — a node with no children
            <br />
            Height — longest path from root to a leaf
            <br />
            Level — depth measured from the root (root is level 1)
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Traversal Algorithms</div>
          <div className="d2">
            Preorder — Root → Left → Right
            <br />
            Inorder — Left → Root → Right
            <br />
            Postorder — Left → Right → Root
            <br />
            Level Order (BFS) — visit nodes level by level, left to right
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Applications</div>
          <div className="d2">
            Expression trees, decision trees, heap structures, syntax trees in
            compilers, and hierarchical data representation.
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Basic C Code</div>
          <div className="d2">
            <pre>
              <code>{`#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};

struct Node *createNode(int value) {
    struct Node *node = (struct Node *)malloc(sizeof(struct Node));
    node->data = value;
    node->left = NULL;
    node->right = NULL;
    return node;
}

void preorder(struct Node *root) {
    if (root == NULL)
        return;
    printf("%d ", root->data);
    preorder(root->left);
    preorder(root->right);
}

void inorder(struct Node *root) {
    if (root == NULL)
        return;
    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
}

void postorder(struct Node *root) {
    if (root == NULL)
        return;
    postorder(root->left);
    postorder(root->right);
    printf("%d ", root->data);
}

int main() {
    struct Node *root = createNode(10);
    root->left = createNode(20);
    root->right = createNode(30);
    root->left->left = createNode(40);
    root->left->right = createNode(50);

    printf("Preorder: ");
    preorder(root);
    printf("\\nInorder: ");
    inorder(root);
    printf("\\nPostorder: ");
    postorder(root);
    printf("\\n");

    return 0;
}`}</code>
            </pre>
          </div>
        </div>
        <br />
        
        <div className="def">
          <div className="d1">Time Complexity</div>
          <div className="d2">
            Traversal (all nodes): O(n)
            <br />
            Height calculation: O(n)
            <br />
            Insert at known position: O(1) if parent is known
          </div>
        </div>

        <br />

        <div className="def">
          <div className="d1">Note</div>
          <div className="d2">
            This visualizer focuses on structure and traversal flow — not BST ordering.
            Enter values and the tree builds automatically in level order (left to right,
            top to bottom) as a complete binary tree.
          </div>
        </div>

        <br />
      </div>
    </>
  );
}

export default Btree;
