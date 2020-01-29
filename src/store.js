import { createStore } from 'redux';

const initialState = {
  graph: null
};

function updateState(state, action) {
  let new_state = { ...state };
  switch (action.type) {
    case 'SET_GRAPH':
      new_state.graph = action.graph;
      break;
    default:
      break;
  }
  return new_state;
}

let store = createStore(updateState, initialState);

export default store;
