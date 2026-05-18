import TheoryPageHeader from "../components/TheoryPageHeader";
import "../Array/array.css";
import "./stack.css";

function Stack() {
  return (
    <>
      <div className="logo-part">DSA Visualizer</div>
      <div className="mainbox">
        <TheoryPageHeader title="Stack (Array Implementation)" to="/stack/visualizer" />

        <div className="def">
          <div className="d1">Definition</div>
          <div className="d2">
            A stack is a linear data structure which follows Last-In-First-Out
            (LIFO) order. Operations are performed at the top.
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Operations</div>
          <div className="d2">
            push(x) — add element x to top
            <br />
            pop() — remove top element
            <br />
            peek() / top() — view top element without removing
            <br />
            isEmpty(), isFull()
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Advantages</div>
          <div className="d2">
            Simple to implement; useful for recursion, undo mechanisms,
            expression evaluation.
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Disadvantages</div>
          <div className="d2">
            Fixed capacity when implemented as array; overflow if too many
            pushes.
          </div>
        </div>

        <div className="def">
          <div className="d1">Basic C Code</div>
          <div className="d2">
            <pre>
              <code>{`#include <stdio.h>
#define SIZE 5

int stack[SIZE];
int top = -1;

void push(int value) {
    if (top == SIZE - 1)
        printf("Stack Overflow\\n");
    else {
        top++;
        stack[top] = value;
        printf("Inserted %d\\n", value);
    }
}

void pop() {
    if (top == -1)
        printf("Stack Underflow\\n");
    else {
        printf("Deleted %d\\n", stack[top]);
        top--;
    }
}

void display() {
    if (top == -1)
        printf("Stack is empty\\n");
    else {
        printf("Stack elements are:\\n");
        for (int i = top; i >= 0; i--)
            printf("%d\\n", stack[i]);
    }
}

int main() {
    push(10);
    push(20);
    push(30);
    display();
    pop();
    display();
    return 0;
}`}</code>
            </pre>
          </div>
        </div>

        <br />
        <div className="def">
          <div className="d1">Time Complexity</div>
          <div className="d2">
            Push: O(1) <br /> Pop: O(1) <br /> Peek: O(1)
          </div>
        </div>

        <br />
      </div>
    </>
  );
}

export default Stack;
