import { RectProps, IconProps, Rect, signal, initial, Circle, Icon, Layout, Txt, TxtProps, withDefaults, PossibleCanvasStyle } from '@motion-canvas/2d';
import { SignalValue, PossibleColor, SimpleSignal, ColorSignal, Reference, all, createRef, Vector2, SpacingSignal, chain, unwrap, errorToLog, PossibleVector2, ThreadGenerator } from '@motion-canvas/core';
import { colors, fadeInTransition, fadeOutTransition } from '@sysraccoon/motion-paw-tools';

export interface KeyLabels {
  topLeft?: string,
  top?: string,
  topRight?: string,
  left?: string,
  middle?: string,
  right?: string,
  bottomLeft?: string,
  bottom?: string,
  bottomRight?: string,

  extraLabelProps?: TxtProps,
}

export interface KeyProps extends RectProps {
  labels?: KeyLabels

  normalBackground?: SignalValue<PossibleColor>;
  holdBackground?: SignalValue<PossibleColor>;
}

export class Key extends Rect {
  @initial(colors.foreground)
  @signal()
  public declare readonly foregroundColor: ColorSignal<this>;

  @initial(colors.backgroundAlt)
  @signal()
  public declare readonly normalBackground: ColorSignal<this>;

  @initial(colors.base16[0x3])
  @signal()
  public declare readonly holdBackground: ColorSignal<this>;

  private readonly accentNode: Reference<Key> = createRef<Key>();
  private readonly labelHolder: Reference<Layout> = createRef<Layout>();
  private txtLabels: Txt[] = [];

  constructor(props: KeyProps) {
    super({
      ...props,
      clip: true,
    });
    this.fill(this.normalBackground());

    if (props.labels) {
      this.txtLabels = this.createLabels(props.labels);
    }

    this.add(
      <>
        <Layout
          ref={this.accentNode}
          layout={false} 
          size={() => this.size()}
        />
        <Layout
          ref={this.labelHolder}
          layout={false}
        >
          {...this.txtLabels}
        </Layout>
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

  public* changeLabels(labels: KeyLabels, duration: number = 0.8) {
    const fadeOutTasks = [];
    for (const txtLabel of this.txtLabels) {
      fadeOutTasks.push(fadeOutTransition(txtLabel, duration*0.5));
    }

    yield* all(...fadeOutTasks);

    this.txtLabels.forEach((value) => {
      value.remove().dispose();
    });
    this.txtLabels = this.createLabels(labels);

    const fadeInTasks = [];
    for (const txtLabel of this.txtLabels) {
      this.labelHolder().add(txtLabel);
      fadeInTasks.push(fadeInTransition(txtLabel, duration*0.5));
    }
    yield* all(...fadeInTasks);
  }

  public* tap(duration: number = 0.8, holdDurationRatio: number = 0.5, onTap?: ThreadGenerator) {
    yield* this.press(duration * holdDurationRatio);
    if (onTap) {
      yield* onTap;
    }
    yield* this.release(duration * (1 -holdDurationRatio));
  }

  public* press(duration: number = 0.6) {
    yield* this.waveChangeAccent(this.holdBackground(), duration);
  }

  public* release(duration: number = 0.2) {
    yield* this.fill(this.normalBackground(), duration);
  }

  private createLabels(labels: KeyLabels): Txt[] {
    const txtLabels: Txt[] = [];

    const position = this.position();
    const cardinalToLocal = function(cardinalPoint: Vector2) {
      return cardinalPoint.sub(position);
    }

    const foregroundColor = this.foregroundColor;
    const addLabelIfDef = function(text: string | undefined, position: Vector2, offset: PossibleVector2) {
      if (typeof text !== "undefined") {
        txtLabels.push(
          <Txt
            fontFamily={"Source Code Pro"}
            fontSize={30}
            fill={foregroundColor}
            padding={[10, 15]}
            {...labels?.extraLabelProps}
            text={text}
            position={position}
            offset={offset}
          /> as Txt,
        );
      }
    };

    addLabelIfDef(labels?.topLeft, cardinalToLocal(this.topLeft()), [-1, -1]);
    addLabelIfDef(labels?.top, cardinalToLocal(this.top()), [0, -1]);
    addLabelIfDef(labels?.topRight, cardinalToLocal(this.topRight()), [1, -1]);

    addLabelIfDef(labels?.left, cardinalToLocal(this.left()), [-1, 0]);
    addLabelIfDef(labels?.middle, cardinalToLocal(this.middle()), [0, 0]);
    addLabelIfDef(labels?.right, cardinalToLocal(this.right()), [1, 0]);

    addLabelIfDef(labels?.bottomLeft, cardinalToLocal(this.bottomLeft()), [-1, 1]);
    addLabelIfDef(labels?.bottom, cardinalToLocal(this.bottom()), [0, 1]);
    addLabelIfDef(labels?.bottomRight, cardinalToLocal(this.bottomRight()), [1, 1]);

    return txtLabels;
  }
}

export function labelsAsStringArr(labels: KeyLabels): (string | undefined)[] {
  return [
    labels.topLeft,
    labels.top,
    labels.topRight,
    labels.left,
    labels.middle,
    labels.right,
    labels.bottomLeft,
    labels.bottom,
    labels.right,
  ];
}