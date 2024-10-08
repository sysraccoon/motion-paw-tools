import { RectProps, IconProps, Rect, signal, initial, Circle, Icon, Layout, Txt, TxtProps, withDefaults, PossibleCanvasStyle } from '@motion-canvas/2d';
import { SignalValue, PossibleColor, SimpleSignal, ColorSignal, Reference, all, createRef, Vector2, SpacingSignal, chain, unwrap, ThreadGenerator, waitFor, useRandom, arcLerp, easeInOutCubic, Color, easeInOutBack, easeOutBack, easeInBack, DEFAULT } from '@motion-canvas/core';
import { colors } from '@sysraccoon/motion-paw-tools';
import { Key, KeyLabels, KeyProps, labelsAsStringArr } from './Key';

export interface KeyboardProps extends RectProps {
  wpm?: SignalValue<number>;
  unitSize?: SignalValue<number>;
  extraKeyProps?: KeyProps;
}

export class Keyboard extends Layout {
  @initial(100)
  @signal()
  public declare readonly wpm: SimpleSignal<number, this>;

  @initial(100)
  @signal()
  public declare readonly unitSize: SimpleSignal<number, this>;

  @signal()
  public declare readonly extraKeyProps: SimpleSignal<KeyProps>;

  @initial(colors.foreground)
  @signal()
  public declare readonly foregroundColor: ColorSignal<this>;

  @initial(colors.backgroundAlt)
  @signal()
  public declare readonly normalBackground: ColorSignal<this>;

  @initial(colors.base16[0x3])
  @signal()
  public declare readonly holdBackground: ColorSignal<this>;

  private keyAliases: any = {};
  private rawKeys: Key[] = [];

  constructor(props?: KeyboardProps) {
    super({
      ...props,
    });
  }

  public alias(keyName: string, keyValue: Key): Key {
    this.keyAliases[keyName] = keyValue;
    return keyValue;
  }

  public removeAllAliasesForKey(key: Key) {
    for (const alias of Object.keys(this.keyAliases)) {
      const value = this.keyAliases[alias];
      if (value == key) {
        delete this.keyAliases[alias];
      }
    }
  }

  public keyByName(keyName: string): Key {
    const key = this.keyAliases[keyName] as Key;
    if (!key) {
      throw Error(`alias ${keyName} not found`);
    }
    return key;
  }

  public keysByNames(keyNames: string[]): Key[] {
    return keyNames.map(name => this.keyByName(name));
  }

  public createKey(labels: KeyLabels, unit: number = 1, aliases?: string[]): Key {
    const key = <Key
      {...this.extraKeyProps()}
      labels={labels}
      width={() => this.unitToSize(unit)}
      height={() => this.unitToSize(1)}
    /> as Key;

    this.rawKeys.push(key);
    this.createAliasesForKey(key, labels, aliases);

    return key;
  }

  private createAliasesForKey(key: Key, labels: KeyLabels, aliases?: string[]) {
    if (typeof aliases !== "undefined") {
      for (const alias of aliases) {
        this.alias(alias, key);
      }
    } else {
      for (const label of labelsAsStringArr(labels)) {
        if (typeof label !== "undefined") {
          this.alias(label, key);
        }
      }
    }
  }

  public* seqCombo(keyNames: string[], holdDuration: number = 1.5): ThreadGenerator {
    const holdTasks = [];
    const releaseTasks = [];

    let totalDelay = 0;
    for (let i = 0; i < keyNames.length; i++) {
      const keyName = keyNames[i];
      const key: Key = this.keyByName(keyName);
      holdTasks.push(chain(
        waitFor(totalDelay),
        key.press(),
      ));
      releaseTasks.push(key.release());

      totalDelay += this.getTapDelay();
    }

    yield* all(...holdTasks);
    yield* waitFor(holdDuration);
    yield* all(...releaseTasks);
  };

  public* seqTaps(keyNames: string[], onTap?: (keyName: string, key: Key) => ThreadGenerator): ThreadGenerator {
    let totalDelay = 0;

    const tapTasks = [];
    for (let i = 0; i < keyNames.length; i++) {
      const keyName = keyNames[i];
      const key: Key = this.keyByName(keyName);
      tapTasks.push(chain(
        waitFor(totalDelay),
        all(
          key.tap(0.6, 0.75, function*() {
            if (onTap) {
              yield* onTap(keyName, key);
            }
          }()),
        ),
      ));

      totalDelay += this.getTapDelay();
    }

    yield* all(...tapTasks);
  }

  public* highlightRegion(keyNames: string[], backgroundColor: PossibleColor, foregroundColor: PossibleColor, duration: number = 0.6) {
    const tasks = [];
    const keys = this.keysByNames(keyNames);
    for (const key of keys) {
      tasks.push(all(
        key.fill(backgroundColor, duration, easeInOutCubic, Color.createLerp("hsv") as any),
        key.foregroundColor(foregroundColor, duration, easeInOutCubic, Color.createLerp("hsv")),
      ));
    }

    yield* all(...tasks);
  }

  public* changeLayout(labels: (KeyLabels | null)[]) {
    if (this.rawKeys.length != labels.length) {
      throw Error(`raw keys and new labels not the same size (rawKeys = ${this.rawKeys.length}, labels = ${labels.length})`);
    }

    const tasks = [];

    for (let i = 0; i < this.rawKeys.length; i++) {
      const key = this.rawKeys[i];
      const newLabel = labels[i];
      if (newLabel) {
        this.removeAllAliasesForKey(key);
      }
    }

    for (let i = 0; i < this.rawKeys.length; i++) {
      const key = this.rawKeys[i];
      const newLabel = labels[i];
      if (newLabel) {
        this.createAliasesForKey(key, newLabel);
        tasks.push(key.changeLabels(newLabel));
      }
    }

    yield* all(...tasks);
  }

  public* tileInTransition(basePosition: Vector2, delayDuration: number = 0.4, inDuration: number = 0.6) {
    const distances = this.searchDistancesForKey(basePosition);
    const maxDistance = Math.max(...distances.values());
    const distancePointDuration = delayDuration/maxDistance;

    const tasks = [];
    for (const [key, distance] of distances) {
      const scale = key.scale.context.raw();
      const opacity = key.opacity.context.raw();
      key.scale(0);
      key.opacity(0);
      tasks.push(chain(
        waitFor(distance*distancePointDuration),
        all(
          key.scale(scale, inDuration, easeOutBack),
          key.opacity(opacity ?? DEFAULT, inDuration/4),
        ),
      ));
    }
    yield* all(...tasks);
  }

  public* tileOutTransition(basePosition: Vector2, delayDuration: number = 0.4, outDuration: number = 0.6) {
    const distances = this.searchDistancesForKey(basePosition);
    const maxDistance = Math.max(...distances.values());
    const distancePointDuration = delayDuration/maxDistance;

    const tasks = [];
    for (const [key, distance] of distances) {
      tasks.push(chain(
        waitFor(distance*distancePointDuration),
        all(
          key.scale(0, outDuration, easeInBack),
          chain(
            waitFor(outDuration*3/4),
            key.opacity(0, outDuration/4),
          ),
        ),
      ));
    }
    yield* all(...tasks);
  }
  
  private searchDistancesForKey(basePosition: Vector2): Map<Key, number> {
    const distances = new Map<Key, number>();
    for (const key of this.rawKeys) {
      const currentDistance = key.position().sub(basePosition).squaredMagnitude;
      distances.set(key, currentDistance);
    }
    return distances;
  }

  public getTapDelay(valueSpread: number = 0.2): number {
    const random = useRandom();

    const cpm: number = this.wpm() * 5;
    const singleTapDuration = 60 / cpm;

    const minDuration = singleTapDuration * (1 - valueSpread);
    const maxDuration = singleTapDuration * (1 + valueSpread);

    const firstDuration = random.nextFloat(minDuration, maxDuration);
    const secondDuration = random.nextFloat(minDuration, maxDuration);

    return (firstDuration + secondDuration) / 2;
  }

  public unitToSize(unit: number = 1): number {
    return unit * this.unitSize();
  }
}
