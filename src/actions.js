const SET_D3_GRAPH = 'SET_D3_GRAPH';
const SET_STATES_LANGUAGE_GRAPH = 'SET_STATES_LANGUAGE_GRAPH';
const SET_STATES_LANGUAGE_GRAPH_EDITOR = 'SET_STATES_LANGUAGE_GRAPH_EDITOR';
const SET_GRAPH_LOADED = 'SET_GRAPH_LOADED';
const SET_START_AT = 'SET_START_AT';
const SET_COMMENT = 'SET_COMMENT';


export function doSetD3Graph(graph) {
  return { type: SET_D3_GRAPH, graph: graph };
}

export function doSetStatesLanguageGraph(graph) {
  return { type: SET_STATES_LANGUAGE_GRAPH, graph: graph };
}

export function doSetStatesLanguageGraphEditor(graph) {
  return { type: SET_STATES_LANGUAGE_GRAPH_EDITOR };
}
export function doSetGraphLoaded(graph_loaded) {
  return { type: SET_GRAPH_LOADED, graph_loaded: graph_loaded };
}

export function doSetStartAt(start_at) {
  return { type: SET_START_AT, start_at: start_at }
}

export function doSetComment(comment) {
  return { type: SET_COMMENT, comment: comment }
}
