import { Layout, Rect, Path, LayoutProps } from "@motion-canvas/2d";
import { colors } from "../colorscheme";

export interface TabHeaderProps extends LayoutProps {}

export class TabHeader extends Layout {
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
      <>
        <Rect
          padding={[15, 30]}
          fill={colors.backgroundAlt}
          radius={[20, 20, 0, 0]}
        >
          {props.children}
        </Rect>
        <Path
          data={"M0,25L0,0S0,25,25,25Z"}
          fill={colors.backgroundAlt}
        />
      </>
    );
  }
}