import { ComponentChildren, Layout, RectProps } from "@motion-canvas/2d";
import { all, easeInOutSine, ThreadGenerator, Vector2 } from "@motion-canvas/core";

export interface SmartLayoutProps extends RectProps {
}

export class SmartLayout extends Layout {
  public constructor(props?: SmartLayoutProps) {
    super({
      ...props,
    });
  };

  public *scroll(offset: Vector2, duration: number) {
    yield* this.position(this.position().add(offset), duration, easeInOutSine);
  }

  public *scrollVertical(offsetY: number, duration: number) {
    yield* this.y(this.y() + offsetY, duration, easeInOutSine);
  }

  public *scrollHorizontal(offsetX: number, duration: number) {
    yield* this.x(this.x() + offsetX, duration, easeInOutSine);
  }
}
