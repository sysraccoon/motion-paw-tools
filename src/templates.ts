import { Code, Gradient } from "@motion-canvas/2d";
import { CodeRegionAccentBasicProps, CodeSnippetProps } from "components";
import { colors } from "./colorscheme";

export function codeSnippet(): CodeSnippetProps {
  return {
    fontSize: 50,
    fontFamily: "Source Code Pro",
    codeText: "",
    padding: 50,
    radius: 15,
    fill: colors.background,
    clip: true,
    highlighter: Code.defaultHighlighter || undefined,
  };
}

export function codePrimaryRegionAccent(): CodeRegionAccentBasicProps {
  return {
    lineWidth: 8,
    radius: 4,
    accentRegionGrow: [50, 40],
    stroke: new Gradient({
      fromX: 0,
      toX: 100,
      angle: 45,
      stops: [
        { offset: 0, color: colors.red },
        { offset: 1, color: colors.base16[0x9] },
      ],
    }),
  };
}

export function codeSecondaryRegionAccent(): CodeRegionAccentBasicProps {
  return {
    ...codePrimaryRegionAccent(),
    stroke: new Gradient({
      fromX: 0,
      toX: 100,
      angle: 45,
      stops: [
        { offset: 0, color: colors.blue },
        { offset: 1, color: colors.base16[0x7] },
      ],
    }),
  };
}

