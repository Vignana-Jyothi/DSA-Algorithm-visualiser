import TheoryPageHeader from "../components/TheoryPageHeader";
import "../Array/array.css";

function BStree() {
  return (
    <>
      <div className="logo-part">DSA Visualizer</div>
      <div className="mainbox">
        <TheoryPageHeader title="Binary Search Tree" to="/bstree/visualizer" />

        <div className="def">
          <div className="d1">Definition</div>
          <div className="d2">
            A Binary Search Tree (BST) is a binary tree in which each node stores a key
            such that all values in the left subtree are smaller than the node, and all
            values in the right subtree are greater. Duplicate keys are typically not
            allowed. This ordering enables efficient search, insertion, and deletion.
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">BST Property</div>
          <div className="d2">
            For every node N:
            <br />
            Left subtree → values &lt; N
            <br />
            Right subtree → values &gt; N
            <br />
            Inorder traversal of a BST produces values in sorted (ascending) order.
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Traversal Algorithms</div>
          <div className="d2">
            Preorder — Root → Left → Right
            <br />
            Inorder — Left → Root → Right (sorted order in a BST)
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
            Dynamic sorted sets, symbol tables, database indexing, file system
            hierarchies, and priority-based lookups where ordered access is required.
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

struct Node *insert(struct Node *root, int value) {
    if (root == NULL)
        return createNode(value);
    if (value < root->data)
        root->left = insert(root->left, value);
    else if (value > root->data)
        root->right = insert(root->right, value);
    return root;
}

struct Node *search(struct Node *root, int key) {
    if (root == NULL || root->data == key)
        return root;
    if (key < root->data)
        return search(root->left, key);
    return search(root->right, key);
}

void inorder(struct Node *root) {
    if (root == NULL)
        return;
    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
}

int main() {
    struct Node *root = NULL;
    root = insert(root, 50);
    root = insert(root, 30);
    root = insert(root, 70);
    root = insert(root, 20);
    root = insert(root, 40);

    printf("Inorder (sorted): ");
    inorder(root);
    printf("\\n");

    if (search(root, 40))
        printf("40 found\\n");
    else
        printf("40 not found\\n");

    return 0;
}`}</code>
            </pre>
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Time Complexity</div>
          <div className="d2">
            Search / Insert / Delete: O(h) where h is tree height
            <br />
            Best case (balanced): O(log n)
            <br />
            Worst case (skewed): O(n)
            <br />
            Traversal (all nodes): O(n)
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Note</div>
          <div className="d2">
            The visualizer inserts values using standard BST rules — smaller values go
            left, larger values go right. Enter values (space or comma separated) and
            run step-by-step traversals to see how ordering affects tree shape and visit
            order.
          </div>
        </div>

        <br />
      </div>
    </>
  );
}

export default BStree;
