import TheoryPageHeader from "../components/TheoryPageHeader";
import "../Array/array.css";
import "./queue.css";

function Queue() {
  return (
    <>
      <div className="logo-part">DSA Visualizer</div>
      <div className="mainbox">
        <TheoryPageHeader title="Queue (Array Implementation)" to="/queue/visualizer" />

        <div className="def">
          <div className="d1">Definition</div>
          <div className="d2">
            A queue is a linear data structure following First-In-First-Out (FIFO).
            Elements are added at rear and removed from front.
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Operations</div>
          <div className="d2">
            enqueue(x) — add x at rear
            <br />
            dequeue() — remove element at front
            <br />
            front() — view front element
            <br />
            rear() — view last element
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Basic C Code</div>
          <div className="d2">
            <pre>
              <code>{`#include <stdio.h>
#define SIZE 5

int queue[SIZE];
int front = -1, rear = -1;

void enqueue(int value) {
    if (rear == SIZE - 1)
        printf("Queue Overflow\\n");
    else {
        if (front == -1)
            front = 0;
        rear++;
        queue[rear] = value;
        printf("Inserted %d\\n", value);
    }
}

void dequeue() {
    if (front == -1 || front > rear)
        printf("Queue Underflow\\n");
    else {
        printf("Deleted %d\\n", queue[front]);
        front++;
    }
}`}</code>
            </pre>
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Time Complexity</div>
          <div className="d2">
            enqueue: O(1) <br />
            dequeue: O(1) <br /> front/rear: O(1)
          </div>
        </div>

        <br />
      </div>
    </>
  );
}

export default Queue;
