import { createStore } from 'redux';
import graph from './states_language_test.json';

const initialState = {
  editor_graph: {},
  d3_graph: { nodes: [], edges: [] },
  states_language_graph: graph,
  states_language_graph_editor: graph,
  graph_loaded: true,
};

function updateState(state, action) {
  let new_state = { ...state };
  switch (action.type) {
    case 'SET_EDITOR_GRAPH':
      new_state.editor_graph = action.graph;
      break;
    case 'SET_D3_GRAPH':
      new_state.d3_graph = action.graph;
      break;
    case 'SET_STATES_LANGUAGE_GRAPH':
      new_state.states_language_graph = action.graph;
      break;
    case 'SET_STATES_LANGUAGE_EDITOR_GRAPH':
      new_state.states_language_graph_editor = new_state.states_language_graph;
      break;
    case 'SET_GRAPH_LOADED':
      new_state.graph_loaded = action.graph_loaded;
      break;
    default:
      break;
  }
  return new_state;
}

let store = createStore(updateState, initialState);

export default store;
