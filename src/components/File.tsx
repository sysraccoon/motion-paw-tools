import { RectProps, IconProps, Rect, signal, initial, Circle, Icon, Layout, Txt } from '@motion-canvas/2d';
import { SignalValue, PossibleColor, SimpleSignal, ColorSignal, Reference, all, createRef, Vector2 } from '@motion-canvas/core';
import { colors } from '../colorscheme';
import { icons } from '../icons';

export interface FileProps extends RectProps {
  name: SignalValue<string>;
  iconProps?: IconProps;
  foregroundColor?: SignalValue<PossibleColor>;
}

export class File extends Rect {
  @signal()
  public declare readonly name: SimpleSignal<string, this>;

  @initial(colors.foreground)
  @signal()
  public declare readonly foregroundColor: ColorSignal<this>;

  private readonly accentNode: Reference<File> = createRef<File>();

  constructor(props: FileProps) {
    super({
      padding: [10, 14],
      radius: 20,
      fill: colors.base16[0x2],
      gap: 20,
      marginTop: 12,
      grow: 1,
      shrink: 1,
      ...props,
      layout: true,
      alignItems: "center",
      direction: "row",
      clip: true,
    });

    this.add(
      <>
        <Layout
          ref={this.accentNode}
          layout={false} 
          size={() => this.size()}
        />
        <Icon
          icon={this.peekIcon()}
          size={38}
          color={this.foregroundColor}
          {...props.iconProps}
        />
        <Txt
          text={this.name}
          fontFamily={"Source Code Pro"}
          fontSize={38}
          fill={this.foregroundColor}
        />
      </>
    );
  }

  public* waveChangeAccent(color: SignalValue<PossibleColor>, duration: number = 0.4, basePosition: Vector2 = Vector2.zero) {
    const accentCircle = new Circle({
      position: basePosition,
      fill: color,
      size: 0,
    });
    this.accentNode().add(accentCircle);
    yield* all(
      accentCircle.size(Math.max(this.size().x, this.size().y), duration),
      this.fill(color, duration),
    );
    accentCircle.remove().dispose();
  }

  private peekIcon(): string {
    const extMatch = this.name().match(/[^\\]*\.(\w+)$/);
    if (extMatch) {
      const extension = extMatch[1];
      if (extension in icons) {
        return (icons as any)[extension];
      }
    }

    return icons.file;
  }
}