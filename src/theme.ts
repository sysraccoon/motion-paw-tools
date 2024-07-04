import { HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';

export const defaultPalette = [
  "#1e1e2e", // 0x0 base
  "#181825", // 0x1 mantle
  "#313244", // 0x2 surface0
  "#45475a", // 0x3 surface1
  "#585b70", // 0x4 surface2
  "#cdd6f4", // 0x5 text
  "#f5e0dc", // 0x6 rosewater
  "#b4befe", // 0x7 lavender
  "#f38ba8", // 0x8 red
  "#fab387", // 0x9 peach
  "#f9e2af", // 0xA yellow
  "#a6e3a1", // 0xB green
  "#94e2d5", // 0xC teal
  "#89b4fa", // 0xD blue
  "#cba6f7", // 0xE mauve
  "#f2cdcd", // 0xF flamingo
];

export function defaultTheme(): HighlightStyle {
  return generateThemeFromBase16(defaultPalette);
}

export function generateThemeFromBase16(palette: string[]): HighlightStyle {
  return HighlightStyle.define(
    [
      {
        tag: [tags.keyword],
        color: palette[0xE],
      },
      {
        tag: [tags.string],
        color: palette[0xB],
      },
      {
        tag: [tags.special(tags.string)],
        color: palette[0xF],
      },
      {
        tag: tags.link,
        color: palette[0xD],
        textDecoration: 'underline',
        textUnderlinePosition: 'under',
      },
      {
        tag: [tags.paren, tags.brace, tags.bracket, tags.punctuation],
        color: palette[0x5],
      },
      {
        tag: [tags.name],
        color: palette[0x5],
      },
      {
        tag: [tags.atom, tags.bool, tags.special(tags.variableName), tags.number],
        color: palette[0x9],
      },
      {
        // string interpolation braces
        tag: [tags.special(tags.brace)],
        color: palette[0x8],
      },
      {
        tag: [tags.comment],
        color: palette[0x3],
        fontStyle: "italic",
      },
      {
        tag: [tags.heading],
        color: palette[0x5],
        fontWeight: "bold",
      },
      {
        tag: [tags.regexp],
        color: palette[0x9],
      },
      {
        tag: [tags.invalid],
        color: palette[0x4],
        borderBottom: `1px dotted ${palette[0x8]}`
      },
      {
        tag: [tags.operator, tags.operatorKeyword],
        color: palette[0x7],
      },
    ]
  );
}

