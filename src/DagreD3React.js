import React, { useEffect } from 'react';
import * as dagreD3 from 'dagre-d3';
import * as d3 from 'd3';

function DagreD3({ width, height, edges, nodes, onClick }) {
  let nodeTree, nodeTreeGroup;

  useEffect(() => {
    let g = new dagreD3.graphlib.Graph({ multigraph: true }).setGraph({});
    nodes.forEach(function(st) {
      g.setNode(st.name, { label: st.name });
    });
    edges.forEach(link => {
      let name =
        nodes[link.source].name +
        '-' +
        nodes[link.target].name +
        '-' +
        link.type;
      g.setEdge(
        nodes[link.source].name,
        nodes[link.target].name,
        { label: link.type.join(',') },
        name
      );
    });

    g.nodes().forEach(function(v) {
      var node = g.node(v);
      node.rx = node.ry = 5;
    });

    // Set up an SVG group so that we can translate the final graph.
    let svg = d3.select(nodeTree);
    let inner = d3.select(nodeTreeGroup);

    var zoom = d3.zoom().on('zoom', function() {
      inner.attr('transform', d3.event.transform);
    });
    svg.call(zoom);

    var render = new dagreD3.render();

    render(inner, g);

    var initialScale = 0.8;
    svg.call(
      zoom.transform,
      d3.zoomIdentity
        .translate((svg.attr('width') - g.graph().width * initialScale) / 2, 20)
        .scale(initialScale)
    );

    svg.attr('height', g.graph().height * initialScale + 20);

    svg.selectAll('.dagre-d3 .node').on('click', id => {
      g.nodes().forEach(v => g.node(v).elem.classList.remove('selected'));
      g.node(id).elem.classList.add('selected');
    });
  }, [edges, nodes, nodeTree, nodeTreeGroup, onClick]);

  return (
    <svg
      className="dagre-d3"
      ref={r => (nodeTree = r)}
      width={width}
      height={height}
    >
      <g ref={r => (nodeTreeGroup = r)} />
    </svg>
  );
}

export default DagreD3;
