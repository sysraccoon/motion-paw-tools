import { Code, Gradient, Rect, withDefaults } from "@motion-canvas/2d";
import { colors } from "./colorscheme";
import { CodeRegionAccent } from "./components";

export const FillerRect = withDefaults(Rect, {
  fontSize: 34,
  fontFamily: "Source Code Pro",
  padding: 30,
  radius: 15,
  fill: colors.backgroundAlt,
  clip: true,
  layout: true,
});

export const SpikeCornerRect = withDefaults(FillerRect, {
  radius: [0, 15, 15, 15],
});

export const CodeSnippet = withDefaults(Code, {
  fontFamily: "Source Code Pro",
  fill: colors.foreground,
  fontSize: 34,
});

export const CodePrimaryRegionAccent = withDefaults(CodeRegionAccent, {
  lineWidth: 8,
  radius: 4,
  accentRegionGrow: [20, 15],
  stroke: new Gradient({
    fromX: 0,
    toX: 100,
    angle: 45,
    stops: [
      { offset: 0, color: colors.red },
      { offset: 1, color: colors.base16[0x9] },
    ],
  }),
} as any);

export const CodeSecondaryRegionAccent = withDefaults(CodeRegionAccent, {
  lineWidth: 8,
  radius: 4,
  accentRegionGrow: [20, 15],
  stroke: new Gradient({
    fromX: 0,
    toX: 100,
    angle: 45,
    stops: [
      { offset: 0, color: colors.blue },
      { offset: 1, color: colors.base16[0x7] },
    ],
  }),
} as any);
