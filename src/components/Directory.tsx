import { initial, Layout, LayoutProps, signal } from '@motion-canvas/2d';
import { all, chain, createRef, createSignal, DEFAULT, easeInCubic, Reference, SignalValue, SimpleSignal, ThreadGenerator, Vector2, waitFor } from '@motion-canvas/core';
import { colors } from '../colorscheme';
import { smoothInsert } from '../animations';
import { icons } from '../icons';
import { File } from './File';

export enum DirectoryState {
  Open = 0,
  Close = 1,
}

export interface DirectoryProps extends LayoutProps {
  name: SignalValue<string>;
  initialState?: SignalValue<DirectoryState>;
}

export class Directory extends Layout {
  @signal()
  public declare readonly name: SimpleSignal<string, this>;

  @initial(DirectoryState.Open)
  @signal()
  public declare readonly initialState: SimpleSignal<DirectoryState, this>;

  public readonly dirNode: Reference<File> = createRef<File>();
  private readonly container: Reference<Layout> = createRef<Layout>();
  private readonly childContainer: Reference<Layout> = createRef<Layout>();

  private readonly dirIcon: SimpleSignal<string, this> = createSignal(icons.openDirectory);
  private readonly dirIconOpacity: SimpleSignal<number, this> = createSignal(1);

  private state: DirectoryState = DirectoryState.Open;

  constructor(props: DirectoryProps) {
    super({
      grow: 1,
      ...props,
    });

    this.add(
      <Layout
        ref={this.container}
        direction={"column"}
        grow={1}
      >
        <File
          ref={this.dirNode}
          name={this.name}
          iconProps={{
            icon: this.dirIcon,
            opacity: this.dirIconOpacity,
          }}
        />
        <Layout
          ref={this.childContainer}
          direction={"column"}
          marginLeft={68}
          clip
        >
          {props.children}
        </Layout>
      </Layout>
    );
    this.setState(this.initialState());
  }

  private closeHeight(): number {
    return this.dirNode().height() + this.dirNode().margin().y;
  }

  public* close(duration: number = 0.4): ThreadGenerator {
    yield* all(
      this.childContainer().height(0, duration),
      this.iconTransition(icons.closeDirectory, duration),
    );
    this.state = DirectoryState.Close;
  }

  public* open(duration: number = 0.8, wavePosition: Vector2 = Vector2.zero): ThreadGenerator {
    const originalAccent = this.dirNode().fill.context.raw();
    yield* all(
      chain(
        this.dirNode().waveChangeAccent(colors.background, duration*0.5, wavePosition),
        this.dirNode().fill(originalAccent ?? DEFAULT, duration*0.5, easeInCubic),
      ),
      waitFor(duration*0.1, all(
        this.childContainer().height(DEFAULT, duration*0.9),
        this.iconTransition(icons.openDirectory, duration*0.5),
      )),
    );
    this.state = DirectoryState.Open;
  }

  public* insertNode(index: number, node: Layout, duration: number = 0.4): ThreadGenerator {
    yield* smoothInsert(this.childContainer(), node, index, duration);
  }

  private* iconTransition(icon: string, duration: number) {
    yield* this.dirIconOpacity(0.5, duration*0.67);
    this.dirIcon(icon);
    yield* this.dirIconOpacity(1, duration*0.33);
  }

  public setState(state: DirectoryState) {
    this.state = state;

    this.dirIcon(this.state == DirectoryState.Close ? icons.closeDirectory : icons.openDirectory);
    if (state == DirectoryState.Open) {
      this.childContainer().height(DEFAULT);
    } else if (state == DirectoryState.Close) {
      this.childContainer().height(0);
    } else {
      throw Error(`exhaustion check expected but ${state} found`);
    }
  }
}
