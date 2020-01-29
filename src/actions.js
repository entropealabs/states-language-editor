const SET_D3_GRAPH = 'SET_D3_GRAPH';
const SET_EDITOR_GRAPH = 'SET_EDITOR_GRAPH';
const SET_STATES_LANGUAGE_GRAPH = 'SET_STATES_LANGUAGE_GRAPH';

export function doSetD3Graph(graph) {
  return { type: SET_D3_GRAPH, graph: graph };
}

export function doSetEditorGraph(graph) {
  return { type: SET_EDITOR_GRAPH, graph: graph };
}

export function doSetStatesLanguageGraph(graph) {
  return { type: SET_STATES_LANGUAGE_GRAPH, graph: graph };
}
