import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  doSetStatesLanguageGraph,
  doSetStatesLanguageGraphEditor,
  doSetStartAt,
  doSetComment,
  doSetGraphLoaded,
} from './actions';
import Button from '@material-ui/core/Button';
import store from './store';

function JSONDisplay() {
  const graph = useSelector(state => state.states_language_graph);
  const start_at = useSelector(state => state.start_at);
  const comment = useSelector(state => state.comment);
  const [display, set_display] = useState({
    StartAt: start_at, 
    Comment: comment, 
    States: graph,
  })

  useEffect(() => {
    set_display({StartAt: start_at, Comment: comment, States: graph});
  }, [graph, start_at, comment])

  const onChange = e => {
    try {
      let obj = JSON.parse(e.target.value);
      set_display(obj);
    } catch (e) {
      console.log(e);
      console.log('JSON is still invalid');
    }
    return true;
  };

  const update = e => {
    store.dispatch(doSetGraphLoaded(false));
    store.dispatch(doSetStatesLanguageGraph(display.States));
    store.dispatch(doSetStartAt(display.StartAt));
    store.dispatch(doSetComment(display.Comment));
    store.dispatch(doSetStatesLanguageGraphEditor());
    setTimeout(() => store.dispatch(doSetGraphLoaded(true)), 500);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={update}>
        Reload
      </Button>
      <br />
      <textarea
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        cols="100"
        rows="50"
        value={JSON.stringify(display, undefined, 2)}
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
