import { Code, Gradient } from "@motion-canvas/2d";
import { SignalValue } from "@motion-canvas/core";
import { CodeRegionAccentProps, CodeSnippetProps } from "components";
import { defaultPalette } from "./theme";

export function codeSnippetTemplate(): CodeSnippetProps {
  return {
    fontSize: 50,
    fontFamily: "Source Code Pro",
    codeText: "",
    padding: 50,
    radius: 15,
    fill: defaultPalette[0x1],
    clip: true,
    highlighter: Code.defaultHighlighter || undefined,
  };
}

export function codeRegionAccentTemplate(code: SignalValue<Code>): CodeRegionAccentProps {
  return {
    code: code,
    lineWidth: 8,
    radius: 4,
    accentRegionGrow: [50, 40],
    stroke: new Gradient({
      fromX: 0,
      toX: 100,
      angle: 45,
      stops: [
        { offset: 0, color: defaultPalette[0xA] },
        { offset: 1, color: defaultPalette[0x9] },
      ],
    }),
  };
}
