import React from 'react';
import { useSelector } from 'react-redux';
import {
  doSetStatesLanguageGraph,
  doSetGraphLoaded,
  doSetStatesLanguageEditorGraph,
} from './actions';
import Button from '@material-ui/core/Button';
import store from './store';

function JSONDisplay() {
  const graph = useSelector(state => state.states_language_graph);

  const onChange = e => {
    try {
      console.log(e.target.value);
      let obj = JSON.parse(e.target.value);
      store.dispatch(doSetStatesLanguageGraph(obj));
    } catch (e) {
      console.log(e);
      console.log('JSON is still invalid');
    }
    return true;
  };

  const update = e => {
    store.dispatch(doSetGraphLoaded(false));
    setTimeout(function() {
      store.dispatch(doSetStatesLanguageEditorGraph());
      store.dispatch(doSetGraphLoaded(true));
    }, 500);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={update}>
        Reload
      </Button>
      <br />
      <textarea
        cols="100"
        rows="50"
        value={JSON.stringify(graph, undefined, 2)}
        onChange={onChange}
      />
      <br />
      <Button variant="contained" color="primary" onClick={update}>
        Reload
      </Button>
    </div>
  );
}

export default JSONDisplay;
