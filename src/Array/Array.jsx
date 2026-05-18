import TheoryPageHeader from "../components/TheoryPageHeader";
import "./array.css";

function ArrayPage() {
  return (
    <>
      <div className="logo-part">DSA Visualizer</div>
      <div className="mainbox">
        <TheoryPageHeader title="Array Data Structure" to="/array/visualizer" />

        <div className="def">
          <div className="d1">Definition</div>
          <div className="d2">
            Array is a linear data structure that collects elements of the same
            data type and stores them in contiguous memory locations. Array works
            on an indexing system starting from 0 to (n-1) where n is the size
            of the array.
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">1D-Array</div>
          <div className="d2">
            1D arrays are used to store a single row of elements in linear
            fashion.
            <br />
            <br />
            Example:
            <pre>
              <code>const arr = [1, 2, 3, 4, 5];</code>
            </pre>
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">2D-Array</div>
          <div className="d2">
            2D arrays represent tabular data.
            <pre>
              <code>{`const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];`}</code>
            </pre>
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Advantages</div>
          <div className="d2">
            Arrays store multiple elements of the same type with the same name.
            <br />
            Random access using index.
            <br />
            No extra memory loss as size is predefined.
            <br />
            2D arrays represent tabular data efficiently.
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Disadvantages</div>
          <div className="d2">
            Fixed size, cannot grow dynamically.
            <br />
            Insertion/deletion operations are tricky.
            <br />
            Wastage of memory if over-allocated.
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Applications</div>
          <div className="d2">
            Arrays are used in sorting, searching, dynamic programming, and matrix
            manipulation problems.
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Common Array Operations</div>
          <div className="d2">
            <pre>
              <code>{`// Array Declaration
const arr = [1, 2, 3, 4, 5];

// Adding element to end
arr.push(6);

// Removing element from end
arr.pop();

// Adding element to beginning
arr.unshift(0);

// Removing element from beginning
arr.shift();

// Accessing element
const element = arr[2];

// Finding element index
const index = arr.indexOf(3);`}</code>
            </pre>
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Basic C Code</div>
          <div className="d2">
            <pre>
              <code>{`#include <stdio.h>

int main() {
    int arr[100], n, i;

    printf("Enter number of elements (max 100): ");
    scanf("%d", &n);

    printf("Enter %d elements:\\n", n);
    for (i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    printf("\\nArray elements are:\\n");
    for (i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }

    return 0;
}`}</code>
            </pre>
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Time Complexity</div>
          <div className="d2">
            Access: O(1)
            <br />
            Search: O(n)
            <br />
            Insertion: O(n)
            <br />
            Deletion: O(n)
            <br />
            Searching:
            <br /> Linear Search: O(n)
            <br /> Binary Search: O(logn)
            <br />
            Sorting: <br /> Bubble Sort: O(n^2)
            <br />
            Selection Sort: O(n^2)
            <br />
            Insertion Sort: O(n^2)
            <br /> Quick Sort: O(nlogn)
          </div>
        </div>

        <br />
      </div>
    </>
  );
}

export default ArrayPage;
