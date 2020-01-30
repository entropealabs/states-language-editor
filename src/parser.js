const to_states_language = (nodes, edges) => {
  return nodes.reduce((acc, node) => {
    let next = get_transition_event(node, edges);
    let t_e = next ? next.type.join(',') : '';
    let choices = get_choices(node, edges).map(choice => ({
      StringEquals: choice.type,
      Next: choice.target.data.name,
    }));
    let catches = get_catches(node, edges).map(cat => ({
      ErrorEquals: cat.type,
      Next: cat.target.data.name,
    }));

    acc[node.data.name] = {
      Type: node.name,
      Resource: node.data.resource,
      TransitionEvent: t_e,
      Choices: choices,
      Catch: catches,
      Next: next ? next.target.data.name : '',
    };
    return acc;
  }, {});
};

const get_catches = (node, edges) =>
  edges.filter(edge => is_catch_event(edge, node));

const is_catch_event = (edge, node) =>
  edge.source.data.name === node.data.name && edge.source.outputs.catch_events;

const get_choices = (node, edges) =>
  edges.filter(edge => is_choice_event(edge, node));

const is_choice_event = (edge, node) =>
  edge.source.data.name === node.data.name && edge.source.outputs.choice_events;

const get_transition_event = (node, edges) =>
  edges.find(edge => is_trans_event(edge, node));

const is_trans_event = (edge, node) =>
  edge.source.data.name === node.data.name &&
  edge.source.outputs.transition_event;

const graph_list = graph =>
  Object.keys(graph.nodes).map(key => graph.nodes[key]);

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
  let n = graph_list(graph);
  let state_nodes = graph_states(n);
  let state_edges = graph_edges(state_nodes, graph);
  return {
    StartAt: 'Test',
    States: to_states_language(state_nodes, state_edges),
  };
}

export function editor_d3(graph) {
  let n = graph_list(graph);
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
