import { Circle, Icon, initial, Layout, Rect, RectProps, signal, Txt } from "@motion-canvas/2d";
import { SignalValue, SimpleSignal } from "@motion-canvas/core";
import { colors } from "@sysraccoon/motion-paw-tools";
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

  public constructor(props: WindowProps) {
    super({
      fill: colors.backgroundAlt,
      padding: 48,
      gap: 32,
      radius: 20,
      ...props,
      layout: true,
      direction: "column",
    });

    this.add(
      <>
        <Layout
          gap={16}
          alignItems={"center"}
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
        <Layout grow={1}>
          {props.children}
        </Layout>
      </>
    );
  }
}