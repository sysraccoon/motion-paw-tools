import { LezerHighlighter } from "@motion-canvas/2d";
import { colors } from "./colorscheme";

import { parser as javascriptParser } from "@lezer/javascript";
import { parser as bashParser } from "@fig/lezer-bash";

export const tsHighlighter = new LezerHighlighter(javascriptParser.configure({dialect: "ts jsx"}), colors.codeStyle);
export const bashHighlighter = new LezerHighlighter(bashParser, colors.codeStyle);
