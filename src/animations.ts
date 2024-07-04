import { Curve, Layout } from "@motion-canvas/2d";
import { easeInOutSine, SmoothSpring, spring } from "@motion-canvas/core";

const defaultDuration = 0.6;

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

export function* popupSpawnTransition(layout: Layout) {
  yield* spring(SmoothSpring, 0, 1, value => {
    layout.scale(value);
  });
}

export function* popupHideTransition(layout: Layout) {
  layout.scale(1);
  yield* layout.scale(1.02, 0.08, easeInOutSine);
  yield* layout.scale(0, 0.4, easeInOutSine);
}
