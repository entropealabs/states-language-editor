import { createStore } from 'redux';
import graph from './states_language_test.json';

const initialState = {
  editor_graph: {},
  d3_graph: { nodes: [], edges: [] },
  states_language_graph: {...graph.States},
  states_language_graph_editor: { ...graph.States },
  graph_loaded: true,
  start_at: graph.StartAt || "",
  comment: graph.Comment || "",
};

function updateState(state, action) {
  let new_state = { ...state };
  switch (action.type) {
    case 'SET_D3_GRAPH':
      new_state.d3_graph = {...action.graph};
      break;
    case 'SET_STATES_LANGUAGE_GRAPH':
      new_state.states_language_graph = action.graph;
      break;
    case 'SET_STATES_LANGUAGE_GRAPH_EDITOR':
      new_state.states_language_graph_editor = { ...new_state.states_language_graph };
      break;
    case 'SET_GRAPH_LOADED':
      new_state.graph_loaded = action.graph_loaded;
      break;
    case 'SET_COMMENT':
      new_state.comment = action.comment;
      break;
    case 'SET_START_AT':
      new_state.start_at = action.start_at;
      break;
    default:
      break;
  }
  return new_state;
}

let store = createStore(updateState, initialState);

export default store;
