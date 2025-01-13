import { Node, Layout, Rect, Path, LayoutProps, PossibleCanvasStyle, initial, canvasStyleSignal, CanvasStyleSignal } from "@motion-canvas/2d";
import { colors } from "../colorscheme";
import { SignalValue } from "@motion-canvas/core";

export interface TabHeaderProps extends LayoutProps {
  fill?: SignalValue<PossibleCanvasStyle>;
}

export class TabHeader extends Layout {
  @initial(colors.backgroundAlt)
  @canvasStyleSignal()
  public declare readonly fill: CanvasStyleSignal<this>;

  public constructor(props: TabHeaderProps) {
    super({
      fontFamily: "Source Code Pro",
      fontSize: 30,
      offset: [-1, 1],
      ...props,
      layout: true,
      alignItems: "end",
    });

    this.add(
      <Node>
        <Rect
          padding={[15, 30]}
          fill={this.fill}
          radius={[20, 20, 0, 0]}
        >
          {props.children}
        </Rect>
        <Path
          data={"M0,25L0,0S0,25,25,25Z"}
          fill={this.fill}
        />
      </Node>
    );
  }
}
