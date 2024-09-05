import { Code, CodeRange, initial, Rect, RectProps, signal } from "@motion-canvas/2d";
import { BBox, easeOutCirc, PossibleVector2, SignalValue, SimpleSignal, TimingFunction, Vector2, Vector2Signal } from "@motion-canvas/core";
import { bboxByCodeRanges, bboxByRegex } from "code-utils";

const defaultTimingFunc: TimingFunction = easeOutCirc;

export interface CodeRegionAccentBasicProps extends RectProps {
  accentRegion?: SignalValue<BBox>;
  accentRegionGrow?: SignalValue<PossibleVector2>;
}

export interface CodeRegionAccentProps extends CodeRegionAccentBasicProps {
  code: SignalValue<Code>;
}

export class CodeRegionAccent extends Rect {
  @signal()
  public declare readonly code: SimpleSignal<Code, this>;

  @initial(new BBox())
  @signal()
  public declare readonly accentRegion: SimpleSignal<BBox, this>;

  @initial(Vector2.zero)
  @signal()
  public declare readonly accentRegionGrow: Vector2Signal<this>;

  public constructor(props?: CodeRegionAccentProps) {
    super({
      ...props,
      position: () => this.accentRegion().center.transformAsPoint(this.code().localToWorld()).sub(this.view().position()).div(this.view().scale()),
      size: () => this.accentRegion().size.add(this.accentRegionGrow()),
    });
  };

  public setRegionByRegex(selector: string | RegExp) {
    this.accentRegion(bboxByRegex(this.code(), selector));
  }

  public *changeRegionByRegex(selector: string | RegExp, duration: number, timingFunc: TimingFunction = defaultTimingFunc) {
    yield* this.accentRegion(bboxByRegex(this.code(), selector), duration, timingFunc);
  }

  public setRegionByCodeRanges(ranges: CodeRange[]) {
    this.accentRegion(bboxByCodeRanges(this.code(), ...ranges));
  }

  public *changeRegionByCodeRanges(ranges: CodeRange[], duration: number, timingFunc: TimingFunction = defaultTimingFunc) {
    yield* this.accentRegion(bboxByCodeRanges(this.code(), ...ranges), duration, timingFunc);
  }
}
