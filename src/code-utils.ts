import { Code, CodeRange, lines } from "@motion-canvas/2d";
import { BBox } from "@motion-canvas/core";

export function bboxByCodeRanges(code: Code, ...codeRanges: CodeRange[]) {
  const bboxes: BBox[] = [];
  codeRanges.forEach(range => {
    const selectionBboxes = code.getSelectionBBox(range);
    bboxes.push(...selectionBboxes);
  });
  return BBox.fromBBoxes(...bboxes);
}

export function bboxByRegex(code: Code, selector: string | RegExp) {
  const ranges = code.findAllRanges(selector);
  return bboxByCodeRanges(code, ...ranges);
}

export function allLines() {
  return lines(0, Infinity);
}