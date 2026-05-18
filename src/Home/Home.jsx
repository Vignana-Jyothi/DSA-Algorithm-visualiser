import { Link } from "react-router-dom";
import "./home.css";

function Home() {
  return (
    <div>
      <div className="logo-part">DSA Visualizer</div>
      <div className="my-container">
        <div>
          <Link to="/" className="off-name">
            <img className="logo" src="/image.png" alt="" />
            <div className="pt-0">DSA Visualizer</div>
          </Link>
        </div>
        <div className="dropdown">
          <button
            className="btn dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            DSA Algorithm
          </button>
          <ul className="dropdown-menu">
            <li>
              <Link to="/array" className="dropdown-item">
                Array
              </Link>
            </li>
            <li>
              <Link to="/stack" className="dropdown-item">
                Stack
              </Link>
            </li>
            <li>
              <Link to="/queue" className="dropdown-item">
                Queue
              </Link>
            </li>
            <li>
              <Link to="/cqueue" className="dropdown-item">
                Circular Queue
              </Link>
            </li>
            <li>
              <Link to="/pqueue" className="dropdown-item">
                Priority Queue
              </Link>
            </li>
            <li>
              <Link to="/linked-list" className="dropdown-item">
                Linked-list
              </Link>
            </li>
            <li>
              <Link to="/btree" className="dropdown-item">
                Binary Tree
              </Link>
            </li>
            <li>
              <Link to="/bstree" className="dropdown-item">
                Binary Search Tree
              </Link>
            </li>
            <li>
              <Link to="/avltree" className="dropdown-item">
                AVL Tree
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="gre">Welcome to DSA Visualizer</div>
      <div className="subgre">
        Interactive visualizations to help you understand Data Structures and
        Algorithms
      </div>

      <div className="main-cards">
        <div className="dsa-card">
          <Link to="/array" className="card-name">
            <h3>Array</h3>
            <p>Visualize Array operations</p>
            <div className="card-image">
              <img src="/assets/array.png" alt="Array Image" />
            </div>
          </Link>
        </div>

        <div className="dsa-card">
          <Link to="/stack" className="card-name">
            <h3>Stack</h3>
            <p>Visualize stack operations</p>
            <div className="card-image">
              <img src="/assets/stack.png" alt="Stack Image" />
            </div>
          </Link>
        </div>

        <div className="dsa-card">
          <Link to="/queue" className="card-name">
            <h3>Queue</h3>
            <p>Visualize Queue operations</p>
            <div className="card-image">
              <img src="/assets/queue.png" alt="Queue Image" />
            </div>
          </Link>
        </div>

        <div className="dsa-card">
          <Link to="/cqueue" className="card-name">
            <h3>Circular Queue</h3>
            <p>Visualize Circualr Queue operations</p>
            <div className="card-image">
              <img src="/assets/Circular Queue.png" alt="Circular Queue Image" />
            </div>
          </Link>
        </div>

        <div className="dsa-card">
          <Link to="/pqueue" className="card-name">
            <h3>Priority Queue</h3>
            <p>Visualize Priority Queue operations</p>
            <div className="card-image">
              <img src="/assets/pre.png" alt="Priority Queue Image" />
            </div>
          </Link>
        </div>

        <div className="dsa-card">
          <Link to="/linked-list" className="card-name">
            <h3>Linked-list</h3>
            <p>Visualize Linked-list operations</p>
            <div className="card-image">
              <img src="/assets/Linked-list.png" alt="Linked-list" />
            </div>
          </Link>
        </div>

        <div className="dsa-card">
          <Link to="/btree" className="card-name">
            <h3>Binary Tree</h3>
            <p>Visualize Binary Tree operations</p>
            <div className="card-image">
              <img src="/assets/bt.png" alt="Binary Tree" />
            </div>
          </Link>
        </div>

        <div className="dsa-card">
          <Link to="/bstree" className="card-name">
            <h3>Binary Search Tree</h3>
            <p>Visualize Binary Search Tree operations</p>
            <div className="card-image">
              <img src="/assets/binary.png" alt="Binary Search Tree" />
            </div>
          </Link>
        </div>

        <div className="dsa-card">
          <Link to="/avltree" className="card-name">
            <h3>AVL Tree</h3>
            <p>Visualize AVL Tree operations</p>
            <div className="card-image">
              <img src="/assets/avl.png" alt="AVL Tree" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
