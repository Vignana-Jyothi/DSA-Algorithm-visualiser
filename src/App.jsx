import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import ArrayPage from "./Array/Array";
import ArrayVisualizer from "./Array/ArrayVisualizer";
import Stack from "./Stack/Stack";
import StackVisualizer from "./Stack/StackVisualizer";
import Queue from "./Queue/Queue";
import QueueVisualizer from "./Queue/QueueVisualizer";
import Cqueue from "./Cqueue/Cqueue";
import CqueueVisualizer from "./Cqueue/CqueueVisualizer";
import Pqueue from "./Pqueue/Pqueue";
import LinkedList from "./LinkedList/LinkedList";
import Btree from "./Btree/Btree";
import BtreeVisualizer from "./Btree/BtreeVisualizer";
import BStree from "./BStree/BStree";
import AVLtree from "./AVLtree/AVLtree";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/array" element={<ArrayPage />} />
        <Route path="/array/visualizer" element={<ArrayVisualizer />} />
        <Route path="/stack" element={<Stack />} />
        <Route path="/stack/visualizer" element={<StackVisualizer />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/queue/visualizer" element={<QueueVisualizer />} />
        <Route path="/cqueue" element={<Cqueue />} />
        <Route path="/cqueue/visualizer" element={<CqueueVisualizer />} />
        <Route path="/pqueue" element={<Pqueue />} />
        <Route path="/linked-list" element={<LinkedList />} />
        <Route path="/btree" element={<Btree />} />
        <Route path="/btree/visualizer" element={<BtreeVisualizer />} />
        <Route path="/bstree" element={<BStree />} />
        <Route path="/avltree" element={<AVLtree />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
