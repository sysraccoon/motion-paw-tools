import { Code, CodeSignal, Layout, LayoutProps, LezerHighlighter, PossibleCodeScope, signal, Txt } from "@motion-canvas/2d";
import { TabHeader } from "./TabHeader";
import { colors } from "../colorscheme";
import { CodeSnippet, SpikeCornerRect } from "../templates";
import { all, chain, SignalValue, SimpleSignal, TimingFunction } from "@motion-canvas/core";
import { Scrollable } from "./Scrollable";
import { ScrollableProps } from "@hhenrichsen/canvas-commons";
import { allLines } from "../code-utils";

export interface EditorProps extends LayoutProps {
  viewportProps?: ScrollableProps;
  editorFile?: EditorFile;
}

export interface EditorFile {
  name: string;
  code: CodeSignal<void>;
  highlighter: LezerHighlighter;
}

export class Editor extends Layout {
  @signal()
  public declare readonly title: SimpleSignal<Txt, this>;

  @signal()
  public declare readonly code: SimpleSignal<Code, this>;

  @signal()
  public declare readonly viewport: SimpleSignal<Scrollable, this>;

  constructor(props: EditorProps) {
    super({
      ...props,
      layout: true,
      direction: "column",
    })

    this.add(
      <TabHeader>
        <Txt
          ref={this.title}
          fill={colors.foreground}
          fontFamily={"Source Code Pro"}
        />
      </TabHeader>
    );
    this.add(
      <SpikeCornerRect>
        <Scrollable
          {...props.viewportProps}
          ref={this.viewport}
        >
          <CodeSnippet ref={this.code}/>
        </Scrollable>
      </SpikeCornerRect>
    );

    if (props.editorFile) {
      this.openFile(props.editorFile);
    }
  }

  public openFile(file: EditorFile) {
    this.title().text(file.name);
    this.code().code(file.code);
    this.code().highlighter(file.highlighter);
  }

  public* tweenOpenFile(file: EditorFile, duration: number) {
    const code = this.code();
    yield* all(
      this.title().text(file.name, duration),
      this.viewport().tweenResetScroll(duration),
      chain(
        code.opacity(0, duration*0.5),
        (function*() {
          code.highlighter(file.highlighter);
        })(),
        code.opacity(1, duration*0.5),
      ),
      code.code.replace(allLines(), file.code, duration),
    );
  }
}

