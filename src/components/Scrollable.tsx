import { computed, IconProps, Layout, LayoutProps, Rect, RectProps, signal } from "@motion-canvas/2d";
import { easeInOutCubic, PossibleColor, PossibleSpacing, PossibleVector2, SignalValue, SimpleSignal, Spacing, SpacingSignal, ThreadGenerator, TimingFunction, unwrap, Vector2 } from "@motion-canvas/core";
import { defaultTimingFunc } from "../consts";

export interface ScrollableProps extends RectProps {
}

export class Scrollable extends Rect {
  @signal()
  public declare readonly viewport: SimpleSignal<Layout, this>;

  constructor(props: ScrollableProps) {
    super({
      ...props,
      clip: true,
    });

    this.add(
      <Layout ref={this.viewport}>
        {props.children}
      </Layout>
    );
  }

  public* resetScroll() {
    this.viewport().margin(new Spacing());
  }

  public* tweenResetScroll(duration: number, timingFunc: TimingFunction = defaultTimingFunc) {
    yield* this.viewport().margin(new Spacing(), duration, timingFunc);
  }

  public scroll(direction: PossibleVector2) {
    const margin = this.marginByDirection(direction);
    this.viewport().margin(margin);
  }

  public* tweenScroll(direction: PossibleVector2, duration: number, timingFunc: TimingFunction = defaultTimingFunc): ThreadGenerator {
    const margin = this.marginByDirection(direction);
    yield* this.viewport().margin(margin, duration, timingFunc);
  }

  public* tweenScrollX(value: SignalValue<number>, duration: number, timingFunc: TimingFunction = defaultTimingFunc): ThreadGenerator {
    const margin = this.marginByDirection([unwrap(value), 0]);
    yield* this.viewport().margin(margin, duration, timingFunc);
  }

  public* tweenScrollY(value: SignalValue<number>, duration: number, timingFunc: TimingFunction = defaultTimingFunc): ThreadGenerator {
    const margin = this.marginByDirection([0, unwrap(value)]);
    yield* this.viewport().margin(margin, duration, timingFunc);
  }

  private marginByDirection(direction: PossibleVector2): PossibleSpacing {
    const dir = new Vector2(direction)
    const margin = this.viewport().margin();

    margin.top -= dir.y;
    margin.bottom += dir.y;
    margin.right -= dir.x;
    margin.left += dir.x;

    return margin;
  }
}
