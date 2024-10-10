import { RectProps, IconProps, Rect, signal, initial, Circle, Icon, Layout, Txt, TxtProps, withDefaults, PossibleCanvasStyle } from '@motion-canvas/2d';
import { SignalValue, PossibleColor, SimpleSignal, ColorSignal, Reference, all, createRef, Vector2, SpacingSignal, chain, unwrap, ThreadGenerator, waitFor, useRandom, arcLerp, easeInOutCubic, Color, easeInOutBack, easeOutBack, easeInBack, DEFAULT } from '@motion-canvas/core';
import { colors } from '../colorscheme';
import { Key, KeyLabels, KeyProps, labelsAsStringArr } from './Key';

export type FormFactor = (kbd: Keyboard) => Layout;

export interface KeyboardProps extends RectProps {
  wpm?: SignalValue<number>;
  unitSize?: SignalValue<number>;
  extraKeyProps?: KeyProps;
  formFactor?: FormFactor;
  kbdLayout?: KeyboardLayout;
}

export interface KeyboardLayoutItem {
  labels: KeyLabels;
  aliases?: string[];
}

export const NO_KEY = Symbol("NO_KEY");

export type KeyboardLayout = (KeyboardLayoutItem | typeof NO_KEY)[];

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

  constructor(props: KeyboardProps) {
    super(props);

    if (props.formFactor) {
      this.setFormFactor(props.formFactor);
    }

    if (props.kbdLayout) {
      this.setKeyboardLayout(props.kbdLayout);
    }
  }

  public createAlias(keyName: string, keyValue: Key): Key {
    this.keyAliases[keyName] = keyValue;
    return keyValue;
  }

  private createAliases(key: Key, aliases: string[]) {
    for (const alias of aliases) {
      this.createAlias(alias, key);
    }
  }

  public removeAllAliasesForKey(key: Key) {
    for (const alias of Object.keys(this.keyAliases)) {
      const value = this.keyAliases[alias];
      if (value == key) {
        delete this.keyAliases[alias];
      }
    }
  }

  public totalKeyCount(): number {
    return this.rawKeys.length;
  }

  public keyByIndex(index: number): Key {
    return this.rawKeys[index];
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

  public createKey(unit: number = 1): Key {
    const key = <Key
      {...this.extraKeyProps()}
      width={() => this.unitToSize(unit)}
      height={() => this.unitToSize(1)}
    /> as Key;
    this.rawKeys.push(key);
    return key;
  }

  public* seqCombo(keys: Key[], holdDuration: number = 1.5): ThreadGenerator {
    const holdTasks = [];
    const releaseTasks = [];

    let totalDelay = 0;
    for (const key of keys) {
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

  public* seqTaps(keys: Key[], onTap?: (key: Key) => ThreadGenerator): ThreadGenerator {
    let totalDelay = 0;

    const tapTasks = [];
    for (const key of keys) {
      tapTasks.push(chain(
        waitFor(totalDelay),
        all(
          key.tap(0.6, 0.75, function*() {
            if (onTap) {
              yield* onTap(key);
            }
          }()),
        ),
      ));

      totalDelay += this.getTapDelay();
    }

    yield* all(...tapTasks);
  }

  public* highlightRegion(keys: Key[], backgroundColor: PossibleColor, foregroundColor: PossibleColor, duration: number = 0.6) {
    const tasks = [];
    for (const key of keys) {
      tasks.push(all(
        key.fill(backgroundColor, duration, easeInOutCubic, Color.createLerp("hsv") as any),
        key.foregroundColor(foregroundColor, duration, easeInOutCubic, Color.createLerp("hsv")),
      ));
    }

    yield* all(...tasks);
  }

  public* changeFormFactor(formFactor: FormFactor, layout?: KeyboardLayout) {
    yield* this.tileOutTransition(this.absolutePosition());

    this.setFormFactor(formFactor);
    if (layout) {
      this.setKeyboardLayout(layout);
    }

    yield* this.tileInTransition(this.absolutePosition());
  }

  public setFormFactor(formFactor: FormFactor) {
    this.keyAliases = {};
    this.rawKeys = [];
    this.removeChildren();
    this.add(formFactor(this));
  }

  public setKeyboardLayout(layer: KeyboardLayout) {
    if (this.rawKeys.length != layer.length) {
      throw Error(`raw keys and new labels not the same size (rawKeys = ${this.rawKeys.length}, labels = ${layer.length})`);
    }

    const changedKeys = new Map<Key, KeyboardLayoutItem>();
    for (let i = 0; i < this.rawKeys.length; i++) {
      const key = this.rawKeys[i];
      const layerItem = layer[i];
      if (layerItem !== NO_KEY) {
        this.removeAllAliasesForKey(key);
        changedKeys.set(key, layerItem);
      }
    }

    for (const [key, layerItem] of changedKeys) {
      if (layerItem.aliases) {
        this.createAliases(key, layerItem.aliases);
      }
      key.setLabels(layerItem.labels);
    }
  }

  public* changeKeyboardLayout(layer: KeyboardLayout) {
    if (this.rawKeys.length != layer.length) {
      throw Error(`raw keys and new labels not the same size (rawKeys = ${this.rawKeys.length}, labels = ${layer.length})`);
    }

    const changedKeys = new Map<Key, KeyboardLayoutItem>();
    for (let i = 0; i < this.rawKeys.length; i++) {
      const key = this.rawKeys[i];
      const layerItem = layer[i];
      if (layerItem !== NO_KEY) {
        this.removeAllAliasesForKey(key);
        changedKeys.set(key, layerItem);
      }
    }

    const tasks = [];
    for (const [key, layerItem] of changedKeys) {
      if (layerItem.aliases) {
        this.createAliases(key, layerItem.aliases);
      }
      tasks.push(key.changeLabels(layerItem.labels));
    }

    yield* all(...tasks);
  }

  public* tileInTransition(basePosition?: Vector2, delayDuration: number = 0.4, inDuration: number = 0.6) {
    basePosition = basePosition ?? this.absolutePosition();

    const distances = this.searchDistancesForKey(basePosition);
    const maxDistance = Math.max(...distances.values());
    const distancePointDuration = delayDuration/maxDistance;

    const tasks = [];
    for (const [key, distance] of distances) {
      key.scale(0);
      key.opacity(0);
      tasks.push(chain(
        waitFor(distance*distancePointDuration),
        all(
          key.scale(1, inDuration, easeOutBack),
          key.opacity(1, inDuration/4),
        ),
      ));
    }
    yield* all(...tasks);
  }

  public* tileOutTransition(basePosition?: Vector2, delayDuration: number = 0.4, outDuration: number = 0.6) {
    basePosition = basePosition ?? this.absolutePosition();

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
      const currentDistance = key.absolutePosition().sub(basePosition).squaredMagnitude;
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
