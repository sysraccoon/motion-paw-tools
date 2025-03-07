import { Icon, initial, Layout, LayoutProps, Rect, signal, Txt } from "@motion-canvas/2d";
import { PossibleVector2, SignalValue, SimpleSignal, Vector2, Vector2Signal } from "@motion-canvas/core";
import { colors } from "../colorscheme";
import { icons } from "../icons";
import { Scrollable } from "./Scrollable";
import { TabHeader } from "./TabHeader";

export interface BrowserProps extends LayoutProps {
  title?: SignalValue<string>;
  icon?: SignalValue<string>;
  url?: SignalValue<string>;
  viewportSize?: SignalValue<PossibleVector2>;
}

export class Browser extends Layout {
  @initial("raccoon browser")
  @signal()
  public declare readonly title: SimpleSignal<string, this>;

  @initial(icons.browser)
  @signal()
  public declare readonly icon: SimpleSignal<string, this>;

  @initial("")
  @signal()
  public declare readonly url: SimpleSignal<string, this>;

  @signal()
  private declare readonly topBar: SimpleSignal<Layout, this>;
  @signal()
  private declare readonly urlSection: SimpleSignal<Layout, this>;
  @signal()
  private declare readonly urlBar: SimpleSignal<Layout, this>;
  @signal()
  private declare readonly urlTxt: SimpleSignal<Txt, this>;
  @signal()
  private declare readonly urlIcon: SimpleSignal<Icon, this>;
  @signal()
  public declare readonly viewport: SimpleSignal<Scrollable, this>;
  @initial(new Vector2(1600, 900))
  @signal()
  public declare readonly viewportSize: Vector2Signal<this>;

  public constructor(props: BrowserProps) {
    super({
      ...props,
      layout: true,
      direction: "column",
    });

    this.add(
      <Layout
        ref={this.topBar}
        gap={16}
        alignItems={"center"}
      >
        <TabHeader>
          <Txt
            text={this.title}
            fontFamily={"Source Code Pro"}
            fontSize={48}
            fill={colors.foreground}
          />
        </TabHeader>
      </Layout>
    );

    this.add(
      <Rect
        padding={12}
        fill={colors.backgroundAlt}
        radius={[0, 20, 20, 20]}
        direction={"column"}
      >
        <Rect
          grow={1}
          fill={colors.background.saturate(0.2)}
          radius={[20, 20, 5, 5]}
          padding={12}
          margin={10}
          justifyContent={"space-between"}
          alignContent={"center"}
          alignItems={"center"}
        >
          <Txt
            text={this.url}
            fill={colors.foreground.darken(0.8)}
            fontFamily={"Source Code Pro"}
            fontSize={40}
            grow={1}
            textAlign={"center"}
          />
          <Icon
            icon={"material-symbols:arrow-right-alt-rounded"}
            color={colors.foreground.darken(0.8)}
            size={60}
          />
        </Rect>
        <Rect
          ref={this.viewport}
          size={this.viewportSize}
          radius={[5, 5, 20, 20]}
          padding={12}
          margin={10}
          clip
        >
          <Layout layout={false}>
            {props.children}
          </Layout>
        </Rect>
      </Rect>
    );
  }
}
