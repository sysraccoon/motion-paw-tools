import { Curve, Layout } from "@motion-canvas/2d";
import { all, easeOutBack, Vector2, waitFor, easeInBack, createRef, DEFAULT, ThreadGenerator, useDuration } from "@motion-canvas/core";
import { addMark, MarkType } from "./custom-meta";
import { applyState, deepSaveState } from "./node-utils";

const defaultDuration = 0.4;

export function* spawnTrimPath(curve: Curve, duration: number = defaultDuration) {
  curve.opacity(1);
  curve.start(0);
  curve.end(0);
  yield* curve.end(1, duration);
}

export function* hideTrimPath(curve: Curve, duration: number = defaultDuration) {
  curve.start(0);
  curve.end(1);
  yield* curve.start(0.9999, duration);
  curve.opacity(0);
}

export function* fadeInTransition(layout: Layout, duration: number = defaultDuration) {
  const opacity = layout.opacity.context.raw();
  layout.opacity(0);
  yield* layout.opacity(opacity ?? DEFAULT, duration);
}

export function* fadeOutTransition(layout: Layout, duration: number = defaultDuration) {
  const opacity = layout.opacity.context.raw();
  yield* layout.opacity(0, duration);
  layout.opacity(opacity ?? DEFAULT);
}

export function* popupSpawn(layout: Layout, duration: number = defaultDuration) {
  const scale = layout.scale.context.raw();
  layout.scale(0);
  yield* all(
    layout.scale(scale, duration, easeOutBack),
  );
}

export function* popupHide(layout: Layout, duration: number = defaultDuration) {
  layout.scale(1);
  yield* layout.scale(0, defaultDuration, easeInBack);
}

export function* rotateSpawn(layout: Layout, duration: number = defaultDuration) {
  const state = deepSaveState(layout);

  const scale = layout.scale();
  const opacity = layout.opacity();
  const rotation = layout.rotation();

  layout.scale(scale.mul(0.8));
  layout.opacity(0);
  layout.rotation(rotation + 45);

  yield* all(
    layout.scale(scale, duration*0.5, easeOutBack),
    layout.opacity(opacity, duration*0.5),
    layout.rotation(rotation, duration, easeOutBack),
  );

  applyState(layout, state);
}

export function* nop(durationOrEventName: number | string = defaultDuration) {
  const duration = typeof durationOrEventName == "number" ?
    durationOrEventName : useDuration(durationOrEventName);

  addMark(MarkType.NopStart);
  yield* waitFor(duration);
  addMark(MarkType.NopEnd);
}

// FIXME column-reverse and row-reverse directions are broken
export function* smoothAdd(layout: Layout, node: Layout, duration: number = defaultDuration) {
  const currentSize = layout.size();
  layout.add(node);
  const targetSize = layout.size();

  if (layout.children().length > 1) {
    layout.size(currentSize);
  }

  yield* all(
    layout.size(targetSize, duration),
    fadeInTransition(node, duration),
  );

  layout.size.reset();
}

// FIXME column-reverse and row-reverse directions are broken
export function* smoothInsert(layout: Layout, node: Layout, index: number = 0, duration: number = defaultDuration) {
  const tempContainer = createTempContainer(node);
  layout.insert(
    tempContainer,
    index,
  );

  const size = tempContainer.size.context.raw();
  tempContainer.opacity(0);
  tempContainer.size(0);
  yield* tempContainer.size(size, duration/2);
  yield* tempContainer.opacity(1, duration/2);

  const tempIndex = layout.children().indexOf(tempContainer);
  tempContainer.remove();
  layout.insert(node, tempIndex);
}

export function* smoothInsertAlt(layout: Layout, node: Layout, index: number = 0, duration: number = defaultDuration) {
  const tempContainer = createTempContainer(node);
  layout.insert(
    tempContainer,
    index,
  );

  const size = tempContainer.size.context.raw();
  tempContainer.opacity(0);
  tempContainer.size(0);
  yield* all(
    tempContainer.opacity(1, duration),
    tempContainer.size(size, duration),
  ); 

  const tempIndex = layout.children().indexOf(tempContainer);
  tempContainer.remove();
  layout.insert(node, tempIndex);
}

export function* smoothRemove(layout: Layout, node: Layout, duration: number = defaultDuration) {
  const tempContainer = createTempContainer(node);
  const tempIndex = layout.children().indexOf(node);
  layout.insert(
    tempContainer,
    tempIndex,
  );

  yield* tempContainer.opacity(0, duration/2);
  yield* tempContainer.size(0, duration/2);

  tempContainer.remove();
  node.remove();
}

export function* smoothRemoveAlt(layout: Layout, node: Layout, duration: number = defaultDuration) {
  const tempContainer = createTempContainer(node);
  const tempIndex = layout.children().indexOf(node);
  layout.insert(
    tempContainer,
    tempIndex,
  );

  yield* all(
    tempContainer.opacity(0, duration),
    tempContainer.size(0, duration),
  );

  tempContainer.remove();
  node.remove();
}

function createTempContainer(node: Layout): Layout {
  return <Layout
    layout
    clip
    justifyContent={"stretch"}
    alignContent={"stretch"}
    grow={1}
    shrink={1}
  >
    {node}
  </Layout> as Layout;
}

// FIXME column-reverse and row-reverse directions are broken
// TODO maybe remove duplications between smoothAdd and smoothAddWithAutoscroll
export function* smoothAddWithAutoscroll(layout: Layout, node: Layout, duration: number = defaultDuration) {
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
    layout.position(layout.position().add(autoScroll), duration),
    popupSpawn(node),
  );
  layout.size.reset();
}
