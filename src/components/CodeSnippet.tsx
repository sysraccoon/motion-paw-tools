import { CanvasStyleSignal, canvasStyleSignal, Code, CodeHighlighter, LezerHighlighter, PossibleCanvasStyle, PossibleCodeScope, Rect, RectProps, signal } from "@motion-canvas/2d";
import { createRef, SignalValue, SimpleSignal } from "@motion-canvas/core";

export interface CodeSnippetProps extends RectProps {
  highlighter?: CodeHighlighter;
  fontSize?: SignalValue<number>;
  fontFamily?: SignalValue<string>;
  codeText?: SignalValue<PossibleCodeScope>;
  codeFill?: SignalValue<PossibleCanvasStyle>;
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

  @canvasStyleSignal()
  public declare readonly codeFill: CanvasStyleSignal<this>;

  public readonly code = createRef<Code>();

  public constructor(props?: CodeSnippetProps) {
    super({
      ...props,
    });

    this.add(
      <Code
        ref={this.code}
        fontFamily={this.fontFamily}
        fontSize={this.fontSize}
        highlighter={this.highlighter}
        code={this.codeText}
        fill={this.codeFill}
      />
    );
  };
}

