import { Node, Layout, NodeState } from "@motion-canvas/2d";

export function reparentAll(nodes: Layout[], newParent: Layout) {
  const preserved = nodes.map((node) => {
    return {
      "node": node,
      "position": node.absolutePosition(),
      "rotation": node.absoluteRotation(),
      "scale": node.absoluteScale(),
    };
  });

  nodes.forEach((node) => {
    newParent.add(node);
  });

  preserved.forEach((preserve) => {
    const node = preserve.node;
    node.absolutePosition(preserve.position);
    node.absoluteRotation(preserve.rotation);
    node.absoluteScale(preserve.scale);
  });
}

export function deepSaveState(node: Node): NodeState {
    const state: NodeState = {};
    for (const {key, meta, signal} of node) {
      if (!meta.cloneable || key in state) continue;
      state[key] = signal.context.raw();
    }
    return state;
}

export function applyState(node: Node, state: NodeState) {
  node.applyState(state);
}
