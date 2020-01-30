import Rete from 'rete';
import ReactRenderPlugin from 'rete-react-render-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import AreaPlugin from 'rete-area-plugin';
import MinimapPlugin from 'rete-minimap-plugin';
import { MyNode } from './Node';
import { TextControl, BooleanControl, IntegerControl } from './Control';
import graph from './test.json';
import { editor_d3, editor_states_language } from './parser';
import { doSetD3Graph, doSetStatesLanguageGraph } from './actions';
import store from './store';

var transition_socket = new Rete.Socket('Transition Event');
var catch_socket = new Rete.Socket('Catch Event');
var choice_socket = new Rete.Socket('Choice Event');
var next_socket = new Rete.Socket('Next');

class TaskComponent extends Rete.Component {
  constructor() {
    super('Task');
  }

  builder(node) {
    var inp = new Rete.Input('start', 'Start', next_socket, true);
    var te = new Rete.Output(
      'transition_event',
      'Transition Event',
      transition_socket
    );
    var ce = new Rete.Output('catch_events', 'Catch Events', catch_socket);
    var name = new TextControl(this.editor, 'name', node);
    var resource = new TextControl(this.editor, 'resource', node);
    var input_path = new TextControl(this.editor, 'input_path', node);
    var resource_path = new TextControl(this.editor, 'resource_path', node);
    var output_path = new TextControl(this.editor, 'output_path', node);
    var is_end = new BooleanControl(this.editor, 'is_end', node);
    return node
      .addInput(inp)
      .addOutput(te)
      .addOutput(ce)
      .addControl(name)
      .addControl(resource)
      .addControl(input_path)
      .addControl(resource_path)
      .addControl(output_path)
      .addControl(is_end);
  }
}

class ChoiceComponent extends Rete.Component {
  constructor() {
    super('Choice');
  }

  builder(node) {
    var inp = new Rete.Input('start', 'Start', next_socket, true);
    var ce = new Rete.Output('choice_events', 'Choice Events', choice_socket);
    var resource = new TextControl(this.editor, 'resource', node);
    var name = new TextControl(this.editor, 'name', node);
    var input_path = new TextControl(this.editor, 'input_path', node);
    var output_path = new TextControl(this.editor, 'output_path', node);

    return node
      .addInput(inp)
      .addOutput(ce)
      .addControl(name)
      .addControl(resource)
      .addControl(input_path)
      .addControl(output_path);
  }
}

class WaitComponent extends Rete.Component {
  constructor() {
    super('Wait');
  }

  builder(node) {
    var inp = new Rete.Input('start', 'Start', next_socket, true);
    var te = new Rete.Output(
      'transition_event',
      'Transition Event',
      transition_socket
    );
    var name = new TextControl(this.editor, 'name', node);
    var seconds = new IntegerControl(this.editor, 'seconds', node);
    var timestamp = new TextControl(this.editor, 'timestamp', node);
    var seconds_path = new TextControl(this.editor, 'seconds_path', node);
    var timestamp_path = new TextControl(this.editor, 'timestamp_path', node);
    var is_end = new BooleanControl(this.editor, 'is_end', node);
    return node
      .addInput(inp)
      .addOutput(te)
      .addControl(name)
      .addControl(seconds)
      .addControl(timestamp)
      .addControl(seconds_path)
      .addControl(timestamp_path)
      .addControl(is_end);
  }
}
class TransitionEventComponent extends Rete.Component {
  constructor() {
    super('TransitionEvent');
  }

  builder(node) {
    var inp = new Rete.Input('event', '=', transition_socket, true);
    var out = new Rete.Output('next', 'Next', next_socket);
    var ctrl = new TextControl(this.editor, 'event', node);
    return node
      .addInput(inp)
      .addOutput(out)
      .addControl(ctrl);
  }
}

class CatchEventComponent extends Rete.Component {
  constructor() {
    super('CatchEvent');
  }

  builder(node) {
    var inp = new Rete.Input('event', '=', catch_socket, true);
    var out = new Rete.Output('next', 'Next', next_socket);
    var ctrl = new TextControl(this.editor, 'errors', node);
    return node
      .addInput(inp)
      .addOutput(out)
      .addControl(ctrl);
  }
}

class ChoiceEventComponent extends Rete.Component {
  constructor() {
    super('ChoiceEvent');
  }

  builder(node) {
    var inp = new Rete.Input('event', '=', choice_socket);
    var out = new Rete.Output('next', 'Next', next_socket);
    var ctrl = new TextControl(this.editor, 'events', node);
    return node
      .addInput(inp)
      .addOutput(out)
      .addControl(ctrl);
  }
}

export default async function(container) {
  var components = [
    new TaskComponent(),
    new ChoiceComponent(),
    new WaitComponent(),
    new ChoiceEventComponent(),
    new CatchEventComponent(),
    new TransitionEventComponent(),
  ];

  var editor = new Rete.NodeEditor('states-language@0.1.0', container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin, { component: MyNode });
  editor.use(ContextMenuPlugin);
  editor.use(AreaPlugin);
  editor.use(MinimapPlugin);

  components.map(c => editor.register(c));
  editor.on(
    'process nodecreated noderemoved connectioncreated connectionremoved',
    async () => {
      console.log('| Process |');
      let graph = editor.toJSON();
      console.log(graph);
      let d3_graph = editor_d3(graph);
      let states_language_graph = editor_states_language(graph);
      store.dispatch(doSetD3Graph(d3_graph));
      store.dispatch(doSetStatesLanguageGraph(states_language_graph));
    }
  );

  editor.fromJSON(graph);
  editor.view.resize();
  editor.trigger('process');
  setTimeout(function() {
    AreaPlugin.zoomAt(editor);
  }, 200);
}
