import { Node, Code, Icon, Layout, Rect, RectProps, signal, Txt } from "@motion-canvas/2d";
import { DEFAULT, SignalValue, SimpleSignal } from "@motion-canvas/core";
import { rotateSpawn } from "../animations";
import { colors } from "../colorscheme";

export interface IconTxtProps extends RectProps {
  icon: SignalValue<string>;
  text: SignalValue<string>;
}

export class IconTxt extends Rect {
  @signal()
  public declare readonly icon: SimpleSignal<string, this>;

  @signal()
  public declare readonly text: SimpleSignal<string, this>;

  @signal()
  private declare readonly txtNode: SimpleSignal<Txt, this>;
  @signal()
  private declare readonly txtClip: SimpleSignal<Txt, this>;

  constructor(props: IconTxtProps) {
    super({
      fill: colors.backgroundAlt,
      radius: 20,
      padding: 35,
      layout: true,
      direction: "row",
      ...props,
    })

    this.add(
      <Node>
        <Icon
          icon={this.icon} 
          size={60}
          color={colors.foreground}
        />
        <Layout
          ref={this.txtClip}
          clip
        >
          <Code
            ref={this.txtNode}
            code={() => this.text()}
            fontFamily={"Source Code Pro"}
            fontSize={50}
            marginLeft={30}
            fill={colors.foreground}
          />
        </Layout>
      </Node>
    );
  }

  public* inTransition(duration: number = 0.5) {
    this.txtClip().width(0);
    yield* rotateSpawn(this);
    yield* this.txtClip().width(DEFAULT, duration);
  }
}
