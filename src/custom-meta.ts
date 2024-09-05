import { SceneMetadata, useScene, useThread } from '@motion-canvas/core';

export function getCustomMeta(meta: SceneMetadata) {
  const metaValue = (meta.get() as any);
  let customMeta: any = metaValue.motionPawCustom;
  if (!customMeta) {
    customMeta = {};
    metaValue.motionPawCustom = customMeta;
  }

  return customMeta;
}

export function saveCustomMeta(meta: SceneMetadata, motionPawCustom: any) {
  const metaValue = (meta.get() as any);
  metaValue.motionPawCustom = motionPawCustom;
  meta.set(metaValue);
}

export function clearCustomMeta(meta: SceneMetadata) {
  saveCustomMeta(meta, {});
}

export enum MarkType {
  NopStart = "nop-start",
  NopEnd = "nop-end",
}

export function addMark(markType: MarkType | string) {
  const currentScene = useScene();
  const customMeta = getCustomMeta(currentScene.meta);
  const markName = markType.toString();
  const markOffset = useThread().time();

  customMeta.marks ??= {};
  const activeMarks: number[] = customMeta.marks[markName] ?? [];
  const floatCompDelta = 0.00001;
  if (!activeMarks.find(elem => Math.abs(elem - markOffset) < floatCompDelta)) {
    activeMarks.push(markOffset); 
  };
  customMeta.marks[markName] = activeMarks;

  saveCustomMeta(currentScene.meta, customMeta);
}

