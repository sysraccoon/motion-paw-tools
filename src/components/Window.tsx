import { Circle, Icon, initial, Layout, Rect, RectProps, signal, Txt } from "@motion-canvas/2d";
import { SignalValue, SimpleSignal } from "@motion-canvas/core";
import { colors } from "../colorscheme";
import { icons } from "icons";

export interface WindowProps extends RectProps {
  title: SignalValue<string>;
  icon: SignalValue<string>;
}

export class Window extends Rect {
  @signal()
  public declare readonly title: SimpleSignal<string, this>;

  @initial(icons.window)
  @signal()
  public declare readonly icon: SimpleSignal<string, this>;

  @signal()
  public declare readonly topBar: SimpleSignal<Layout, this>;

  public constructor(props: WindowProps) {
    super({
      fill: colors.backgroundAlt,
      padding: 48,
      radius: 20,
      ...props,
      layout: true,
      direction: "column",
    });

    this.add(
      <Layout
        ref={this.topBar}
        gap={16}
        alignItems={"center"}
        marginBottom={32}
      >
        <Icon
          icon={this.icon}
          size={42}
          color={colors.foreground}
        />
        <Txt
          text={this.title}
          fill={colors.foreground}
          fontSize={48}
          fontFamily={"Source Code Pro"}
        />
        <Layout grow={1} />
        <Circle size={42} fill={colors.green} />
        <Circle size={42} fill={colors.yellow} />
        <Circle size={42} fill={colors.red} />
      </Layout>
    );
    this.add(
      <Layout grow={1}>
        {props.children}
      </Layout>
    );
  }
}
