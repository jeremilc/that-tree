import React, {useEffect} from 'react';
import './App.css';
import {useAppDispatch} from "./app/hooks";
import {loadRootNodes} from "./components/rootNode";
import {updateNode} from "./components/node";
import {Tree} from "./components/tree";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001", 'echo-protocol');
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (Array.isArray(data)) {
        dispatch(loadRootNodes(data));
      } else {
        dispatch(updateNode(data));
      }
    };

    return () => {
      ws.close();
    }
  }, []);

  return (
      <div className="App">
        <Tree />
      </div>
  );
}

export default App;
