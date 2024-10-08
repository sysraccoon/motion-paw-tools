import { ShapeProps, nodeName, Shape, initial, vector2Signal } from "@motion-canvas/2d";
import { useScene, Vector2, SignalValue, PossibleVector2, Vector2Signal } from "@motion-canvas/core";
import { colors } from "@sysraccoon/motion-paw-tools";

export interface DotGridProps extends ShapeProps {
  spacing?: SignalValue<PossibleVector2>;
}

@nodeName('DotGrid')
export class DotGrid extends Shape {
  @initial(80)
  @vector2Signal('spacing')
  public declare readonly spacing: Vector2Signal<this>;

  public constructor(props: DotGridProps) {
    super(props);
  }

  protected override drawShape(context: CanvasRenderingContext2D) {
    context.save();
    this.applyStyle(context);
    this.drawRipple(context);

    const spacing = this.spacing();
    const size = this.computedSize().scale(0.5);
    const steps = size.div(spacing).floored;

    for (let x = -steps.x; x <= steps.x; x++) {
      for (let y = -steps.y; y <= steps.y; y++) {
        context.beginPath();
        context.moveTo(spacing.x * x, spacing.y * y);
        context.lineTo(spacing.x * x + this.lineWidth(), spacing.y * y);
        context.stroke();
      }
    }

    context.restore();
  }
}

export function background() {
  return <DotGrid
    size={useScene().getSize().sub(new Vector2(50, 50))}
    stroke={colors.base16[0x2]}
    lineWidth={3}
    zIndex={-1000}
  />;
}
