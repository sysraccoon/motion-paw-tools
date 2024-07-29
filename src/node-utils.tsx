import { Layout } from "@motion-canvas/2d";

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