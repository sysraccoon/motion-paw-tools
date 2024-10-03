import { CanvasStyleSignal, canvasStyleSignal, Code, CodeHighlighter, CodeProps, initial, LezerHighlighter, PossibleCanvasStyle, PossibleCodeScope, Rect, RectProps, signal } from "@motion-canvas/2d";
import { createRef, Reference, SignalValue, SimpleSignal } from "@motion-canvas/core";
import { colors } from "../colorscheme";
import { AnyCode } from "./AnyCode";

type CodeFactory = (props: CodeProps) => Code;

export interface CodeSnippetProps extends RectProps {
  highlighter?: CodeHighlighter;
  fontSize?: SignalValue<number>;
  fontFamily?: SignalValue<string>;
  codeText?: SignalValue<PossibleCodeScope>;
  codeFill?: SignalValue<PossibleCanvasStyle>;
  codeFactory?: CodeFactory;
}

export class CodeSnippet extends Rect {
  @signal()
  public declare readonly fontSize: SimpleSignal<number, this>;

  @signal()
  public declare readonly fontFamily: SimpleSignal<string, this>;

  @signal()
  public declare readonly highlighter: SimpleSignal<LezerHighlighter, this>;

  @signal()
  public declare readonly codeText: SimpleSignal<PossibleCodeScope, this>;

  @initial(colors.foreground)
  @canvasStyleSignal()
  public declare readonly codeFill: CanvasStyleSignal<this>;

  public readonly code = createRef<Code>();

  public constructor(props?: CodeSnippetProps) {
    super({
      ...props,
    });

    const codeFactory = props?.codeFactory ?? ((props) => new Code(props));

    const code = codeFactory({
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      highlighter: this.highlighter,
      code: this.codeText,
      fill: this.codeFill,
    });

    this.code(code);
    this.add(code);
  };
}

