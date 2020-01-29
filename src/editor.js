import Rete from 'rete';
import ReactRenderPlugin from 'rete-react-render-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import AreaPlugin from 'rete-area-plugin';
import { MyNode } from './Node';
import { MyControl } from './Control';
import graph from './test.json';

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
    var resource = new MyControl(this.editor, 'resource', node);
    var name = new MyControl(this.editor, 'name', node);
    return node
      .addInput(inp)
      .addOutput(te)
      .addOutput(ce)
      .addControl(name)
      .addControl(resource);
  }
}

class ChoiceComponent extends Rete.Component {
  constructor() {
    super('Choice');
  }

  builder(node) {
    var inp = new Rete.Input('start', 'Start', next_socket, true);
    var ce = new Rete.Output('choice_events', 'Choice Events', choice_socket);
    var cat_e = new Rete.Output('catch_events', 'Catch Events', catch_socket);
    var resource = new MyControl(this.editor, 'resource', node);
    var name = new MyControl(this.editor, 'name', node);
    return node
      .addInput(inp)
      .addOutput(ce)
      .addOutput(cat_e)
      .addControl(name)
      .addControl(resource);
  }
}

class TransitionEventComponent extends Rete.Component {
  constructor() {
    super('TransitionEvent');
  }

  builder(node) {
    var inp = new Rete.Input('event', '=', transition_socket, true);
    var out = new Rete.Output('next', 'Next', next_socket);
    var ctrl = new MyControl(this.editor, 'event', node);
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
    var ctrl = new MyControl(this.editor, 'errors', node);
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
    var ctrl = new MyControl(this.editor, 'events', node);
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
    new ChoiceEventComponent(),
    new CatchEventComponent(),
    new TransitionEventComponent()
  ];

  var editor = new Rete.NodeEditor('states-language@0.1.0', container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin, { component: MyNode });
  editor.use(ContextMenuPlugin);
  editor.use(AreaPlugin);

  components.map(c => editor.register(c));

  editor.on(
    'process nodecreated noderemoved connectioncreated connectionremoved',
    async () => {
      console.log(editor.toJSON());
    }
  );

  editor.fromJSON(graph);

  editor.view.resize();
  AreaPlugin.zoomAt(editor);
  editor.trigger('process');
}
