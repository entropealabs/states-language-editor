import React from 'react';
import { useSelector } from 'react-redux';

function JSONDisplay() {
  const graph = useSelector(state => state.states_language_graph);
  return <pre>{JSON.stringify(graph, null, 2)}</pre>;
}

export default JSONDisplay;
