import React from 'react';
import { useSelector } from 'react-redux';
import { doSetStatesLanguageGraph } from './actions';
import store from './store';

function JSONDisplay() {
  const graph = useSelector(state => state.states_language_graph);

  const onChange = (e) =>
    store.dispatch(doSetStatesLanguageGraph(e.target.value));

  return <textarea rows="50" onChange={e => onChange(e)} value={graph} />;
}

export default JSONDisplay;
