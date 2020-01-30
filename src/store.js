import { createStore } from 'redux';

const initialState = {
  editor_graph: {},
  d3_graph: { nodes: [], edges: [] },
  states_language_graph: {},
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
      let str = '';
      if (typeof action.graph === 'string'){
        str = action.graph;
      }else{
        str = JSON.stringify(action.graph, undefined, 2);
      }
      new_state.states_language_graph = str;
      break;
    default:
      break;
  }
  return new_state;
}

let store = createStore(updateState, initialState);

export default store;
