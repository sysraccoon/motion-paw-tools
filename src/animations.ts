import { ComponentChildren, Curve, Layout } from "@motion-canvas/2d";
import { all, easeInOutSine, useLogger, Vector2, waitFor } from "@motion-canvas/core";
import { SmartLayout } from "./components/SmartLayout";
import { CodeSnippet } from "components";

const defaultDuration = 0.4;

export function* transitionSpawnTrimPath(curve: Curve, duration: number = defaultDuration) {
  curve.start(0);
  curve.end(0);
  yield* curve.end(1, duration);
}

export function* transitionHideTrimPath(curve: Curve, duration: number = defaultDuration) {
  curve.start(0);
  curve.end(1);
  yield* curve.start(0.9999, duration);
}

export function* transitionPopupSpawn(layout: Layout) {
  layout.scale(0);

  const oversizeDelta = defaultDuration * 0.1;
  yield* layout.scale(1.02, defaultDuration - oversizeDelta, easeInOutSine);
  yield* layout.scale(1, oversizeDelta, easeInOutSine);
}

export function* transitionPopupHide(layout: Layout) {
  layout.scale(1);
  yield* layout.scale(1.02, 0.08, easeInOutSine);
  yield* layout.scale(0, 0.4, easeInOutSine);
}

export function* nop(duration: number = defaultDuration) {
  yield* waitFor(duration);
}

// FIXME column-reverse and row-reverse directions are broken
export function* smoothAdd(layout: SmartLayout, node: Layout, duration: number = defaultDuration) {
  const currentSize = layout.size();
  layout.add(node);
  const targetSize = layout.size();

  if (layout.children().length > 1) {
    layout.size(currentSize);
  }

  yield* all(
    layout.size(targetSize, duration),
    transitionPopupSpawn(node),
  );
  layout.size.reset();
}

// FIXME column-reverse and row-reverse directions are broken
// TODO maybe remove duplications between smoothAdd and smoothAddWithAutoscroll
export function* smoothAddWithAutoscroll(layout: SmartLayout, node: Layout, duration: number = defaultDuration) {
  const currentSize = layout.size();
  layout.add(node);
  const targetSize = layout.size();

  function normalize(val: number, min: number, max: number): number {
    return (val - min) / (max - min);
  }

  const direction = layout.direction();
  const sizeDiff = targetSize.sub(currentSize);
  const scrollDirections = {
    "column": new Vector2(0, -sizeDiff.y * normalize(layout.offset().y, 1, -1)),
    "column-reverse": new Vector2(0, sizeDiff.y * normalize(layout.offset().y, -1, 1)),
    "row": new Vector2(-sizeDiff.x * normalize(layout.offset().x, 1, -1), 0),
    "row-reverse": new Vector2(sizeDiff.x * normalize(layout.offset().x, -1, 1), 0),
  };
  const autoScroll = scrollDirections[direction];

  if (layout.children().length > 1) {
    layout.size(currentSize);
  }

  yield* all(
    layout.size(targetSize, duration),
    layout.scroll(autoScroll, duration),
    transitionPopupSpawn(node),
  );
  layout.size.reset();
}
