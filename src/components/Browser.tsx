import { Circle, Icon, initial, Layout, Rect, RectProps, signal, Txt } from "@motion-canvas/2d";
import { all, createRef, DEFAULT, easeOutBack, PossibleVector2, SignalValue, SimpleSignal, Vector2, waitFor } from "@motion-canvas/core";
import { colors } from "../colorscheme";
import { icons } from "icons";
import { Scrollable } from "@hhenrichsen/canvas-commons";

export interface BrowserProps extends RectProps {
  title?: SignalValue<string>;
  icon?: SignalValue<string>;
}

export class Browser extends Rect {
  @initial("raccoon browser")
  @signal()
  public declare readonly title: SimpleSignal<string, this>;

  @initial(icons.browser)
  @signal()
  public declare readonly icon: SimpleSignal<string, this>;

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

  public constructor(props: BrowserProps) {
    super({
      fill: colors.backgroundAlt,
      padding: 8,
      radius: 20,
      ...props,
      layout: true,
      direction: "column",
    });

    this.add(
      <>
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

        <Layout ref={this.urlSection}>
          <Layout
            ref={this.urlBar}
            layout
            direction={"row"}
            alignItems={"center"}
            alignSelf={"center"}
            padding={30}
          >
            <Txt
              ref={this.urlTxt}
              text={""}
              fontSize={50}
              fontFamily={"Source Code Pro"}
              fill={colors.foreground}
            />
            <Icon
              ref={this.urlIcon}
              icon={"material-symbols:search"}
              color={colors.foreground}
              size={65}
            />
          </Layout>
        </Layout>
        <Scrollable
          ref={this.viewport}
          height={0}
          radius={10}
        >
          {props.children}
        </Scrollable>
      </>
    );

    const topBar = this.topBar();
    topBar.height(0);
    topBar.width(0);
    topBar.margin(0);
    topBar.opacity(0);
  }

  public* showUrl(url: string) {
    this.scale(0);
    this.rotation(-45);

    yield* all(
      this.scale(1, 0.3, easeOutBack),
      this.rotation(0, 0.3, easeOutBack),
    );

    yield* all(
      this.urlTxt().margin([0, 40, 0, 0], 0.5, easeOutBack),
      this.urlTxt().text(url, 0.5),
    );
  }

  public* openSite(viewportSize: SignalValue<PossibleVector2> = new Vector2(1600, 900)) {
    this.minWidth(this.width());
    this.minHeight(this.height());
    this.urlSection().layout(false);

    this.topBar().width(DEFAULT);

    yield* all(
      this.urlBar().opacity(0, 0.6),
      waitFor(0.3, all(
        this.urlBar().padding(0, 0.6),
        this.urlBar().margin(0, 0.6),
        this.urlBar().height(0, 0.6),

        this.viewport().size(viewportSize, 0.6, easeOutBack),
        this.viewport().opacity(1, 0.6),

        this.topBar().padding([0, 20], 0.6),
        this.topBar().margin([15, 0], 0.6),
        this.topBar().height(DEFAULT, 0.6),
        this.topBar().opacity(1, 0.6),
      )),
    );
  }
}
