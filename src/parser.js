export const states_language_editor = graph => {
  let id = 1;
  let nodes = graph_list(graph.States);
  let res = { id: 'states-language@0.1.0', nodes: {} };
  res.nodes = nodes.reduce((acc, node) => {
    acc[id.toString()] = {
      id: id,
      data: get_editor_data(node),
      name: node.Type,
      inputs: { start: { connections: [] } },
      outputs: { transition_event: { connections: [] } },
      position: [id * 100, id * 100],
    };
    id++;
    return acc;
  }, res.nodes);

  res.nodes = create_edge_nodes(nodes, res.nodes, id);
  return res;
};

const create_edge_nodes = (nodes, acc, id) => {
  return nodes.reduce((acc, node) => {
    if (node.Catch) {
      acc = node.Catch.reduce((acc, cat) => {
        let source = get_node_by_name(node.id, acc);
        let target = get_node_by_name(cat.Next, acc);
        acc[id.toString()] = editor_edge_node(
          id,
          'catch_events',
          'start',
          'CatchEvent',
          cat.ErrorEquals.join(','),
          source,
          target
        );
        id++;
        return acc;
      }, acc);
    }
    if (node.Choices) {
      acc = node.Choices.reduce((acc, ch) => {
        let source = get_node_by_name(node.id, acc);
        let target = get_node_by_name(ch.Next, acc);
        acc[id.toString()] = editor_edge_node(
          id,
          'choice_events',
          'start',
          'ChoiceEvent',
          ch.StringEquals,
          source,
          target
        );
        id++;
        return acc;
      }, acc);
    }
    if (node.Next) {
      let source = get_node_by_name(node.id, acc);
      let target = get_node_by_name(node.Next, acc);
      acc[id.toString()] = editor_edge_node(
        id,
        'transition_event',
        'start',
        'TransitionEvent',
        node.TransitionEvent,
        source,
        target
      );
      id++;
    }
    return acc;
  }, acc);
};

const editor_edge_node = (id, input, output, name, event, source, target) => {
  source.outputs = source.outputs || {};
  source.outputs[input] = source.outputs[input] || {};
  source.outputs[input].connections = source.outputs[input].connections || [];
  source.outputs[input].connections.push({
    node: id,
    input: 'event',
    data: {},
  });
  target.inputs = target.inputs || {};
  target.inputs[output] = target.inputs[output] || {};
  target.inputs[output].connections = target.inputs[output].connections || [];
  target.inputs[output].connections.push({
    node: id,
    output: 'next',
    data: {},
  });
  return {
    name: name,
    id: id,
    position: [id * 100, id * 100],
    data: {
      event: event,
    },
    inputs: {
      event: {
        connections: [
          {
            node: source.id,
            output: input,
            data: {},
          },
        ],
      },
    },
    outputs: {
      next: {
        connections: [
          {
            node: target.id,
            input: output,
            data: {},
          },
        ],
      },
    },
  };
};

const get_node_by_name = (name, nodes) => {
  for (let id in nodes) {
    if (nodes[id].data.name === name) return nodes[id];
  }
};

const get_editor_data = node => {
  switch (node.Type) {
    case 'Task':
      return get_editor_data_task(node);
    case 'Choice':
      return get_editor_data_choice(node);
    case 'Wait':
      return get_editor_data_wait(node);
    default:
      return {};
  }
};

const get_editor_data_task = node => {
  return {
    resource: node.Resource,
    name: node.id,
    input_path: node.InputPath,
    output_path: node.OutputPath,
    resource_path: node.ResourcePath,
    is_end: node.End ? node.End : false,
  };
};

const get_editor_data_choice = node => {
  return {
    resource: node.Resource,
    name: node.id,
    input_path: node.InputPath,
    output_path: node.OutputPath,
    is_end: node.End ? node.End : false,
  };
};

const get_editor_data_wait = node => {
  return {
    name: node.id,
    seconds: node.Seconds,
    seconds_path: node.SecondsPath,
    timestamp: node.Timestamp,
    timestamp_path: node.TimestampPath,
    is_end: node.End ? node.End : false,
  };
};

const to_states_language = (nodes, edges) => {
  return nodes.reduce((acc, node) => {
    acc[node.data.name] = get_states_language_state(node, edges);
    return acc;
  }, {});
};

const get_states_language_state = (node, edges) => {
  switch (node.name) {
    case 'Task':
      return get_sl_task(node, edges);
    case 'Wait':
      return get_sl_wait(node, edges);
    case 'Choice':
      return get_sl_choice(node, edges);
    default:
      return {};
  }
};

const get_sl_task = (node, edges) => {
  let next = get_transition_event(node, edges);
  let t_e = next ? next.type.join(',') : '';
  let catches = get_catches(node, edges).map(cat => ({
    ErrorEquals: cat.type,
    Next: cat.target.data.name,
  }));
  return {
    Type: node.name,
    Resource: node.data.resource,
    TransitionEvent: t_e,
    Catch: catches,
    InputPath: node.data.input_path,
    OutputPath: node.data.output_path,
    ResourcePath: node.data.resource_path,
    Next: next ? next.target.data.name : '',
    End: node.data.is_end,
  };
};

const get_sl_choice = (node, edges) => {
  let choices = get_choices(node, edges).map(choice => ({
    StringEquals: choice.type.join(', '),
    Next: choice.target.data.name,
  }));
  return {
    Type: node.name,
    Resource: node.data.resource,
    Choices: choices,
    InputPath: node.data.input_path,
    OutputPath: node.data.output_path,
  };
};

const get_sl_wait = (node, edges) => {
  let next = get_transition_event(node, edges);
  let t_e = next ? next.type.join(',') : '';
  let res = {
    Type: node.name,
    TransitionEvent: t_e,
    Next: next ? next.target.data.name : '',
    End: node.data.is_end,
  };
  if (node.data.seconds) res['Seconds'] = parseInt(node.data.seconds);
  if (node.data.timestamp) res['Timestamp'] = node.data.timestamp;
  if (node.data.timestamp_path) res['TimestampPath'] = node.data.timestamp_path;
  if (node.data.seconds_path) res['SecondsPath'] = node.data.seconds_path;
  return res;
};

const get_catches = (node, edges) =>
  edges.filter(edge => is_catch_event(edge, node));

const is_catch_event = (edge, node) =>
  edge.source.data.name === node.data.name && edge.event.name === 'CatchEvent';

const get_choices = (node, edges) =>
  edges.filter(edge => is_choice_event(edge, node));

const is_choice_event = (edge, node) =>
  edge.source.data.name === node.data.name && edge.event.name === 'ChoiceEvent';

const get_transition_event = (node, edges) =>
  edges.find(edge => is_trans_event(edge, node));

const is_trans_event = (edge, node) =>
  edge.source.data.name === node.data.name &&
  edge.event.name === 'TransitionEvent';

const graph_list = nodes =>
  Object.keys(nodes).reduce((acc, key) => {
    nodes[key].id = key;
    acc.push(nodes[key]);
    return acc;
  }, []);

const graph_states = graph_list =>
  graph_list.filter(node => !node.name.endsWith('Event'));

const graph_edges = (graph_states, graph) =>
  graph_states.flatMap(node => get_node_edges(node, graph));

const to_d3_nodes = (state_nodes, i = 0) =>
  state_nodes.map(node => {
    return { id: i++, label: node.name, name: node.data.name };
  });

const get_node_edges = (node, graph, nodes) =>
  Object.keys(node.outputs).flatMap(key =>
    get_node_outputs(key, node, graph, nodes)
  );

const to_d3_edges = (graph_edges, nodes) =>
  graph_edges.map(edge => {
    let target = get_node_index(edge.target.data.name, nodes);
    let source = get_node_index(edge.source.data.name, nodes);
    return {
      source: source,
      target: target,
      type: edge.type,
    };
  });

export function editor_states_language(graph) {
  let n = graph_list(graph.nodes);
  let state_nodes = graph_states(n);
  let state_edges = graph_edges(state_nodes, graph);
  return {
    StartAt: 'Test',
    States: to_states_language(state_nodes, state_edges),
  };
}

export function editor_d3(graph) {
  let n = graph_list(graph.nodes);
  let state_nodes = graph_states(n);
  let nodes = to_d3_nodes(state_nodes);
  let state_edges = graph_edges(state_nodes, graph);
  let edges = to_d3_edges(state_edges, nodes);
  return { nodes: nodes, edges: edges };
}

function get_node_outputs(key, node, graph) {
  let conns = node.outputs[key].connections;
  return conns.reduce((acc, c) => {
    let event = graph.nodes[c.node.toString()];
    if (event.outputs.next.connections.length > 0) {
      let target_id = event.outputs.next.connections[0].node.toString();
      let target = graph.nodes[target_id];
      acc.push({
        source: node,
        target: target,
        event: event,
        type: get_event_name(event),
      });
    }
    return acc;
  }, []);
}

function get_event_name(event) {
  var name = '';
  if (event.data.errors) {
    name = event.data.errors;
  } else if (event.data.event) {
    name = event.data.event;
  } else if (event.data.events) {
    name = event.data.events;
  }

  return name.split(',').map(n => n.trim());
}

function get_node_index(name, nodes) {
  return nodes.findIndex(n => n.name === name);
}
