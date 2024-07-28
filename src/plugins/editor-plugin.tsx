/* @jsxImportSource preact */

import {Button, Expandable, Group, makeEditorPlugin, openOutputPath} from '@motion-canvas/ui';
import {
  Pane,
  Science,
  PluginTabConfig,
  PluginTabProps,
  Tab,
} from '@motion-canvas/ui';
import { clearCustomMeta } from '../custom-meta';
import { useScene } from '@motion-canvas/core';


function TabComponent({tab}: PluginTabProps) {
  return (
    <Tab title="Motion Paw Tools" id="motion-paw-tools-tab" tab={tab}>
      <Science/>
    </Tab>
  );
}

function PaneComponent() {
  return (
    <Pane title="Motion Paw Tools" id="motion-paw-tools-pane">
      <Expandable title={"Export custom metadata"} open>
        <Group>
          <Button
            title="Export custom metadata for current scene"
            onClick={exportCustomMetaForCurrentScene}
          >
            Export
          </Button>
          <Button
            title="Clear custom meta for current scene"
            onClick={clearCustomMetaForCurrentScene}
          >
            Clear
          </Button>
          <Button
              title="Reveal the output directory in file explorer"
              onClick={openOutputPath}
            >
            Output
          </Button>
        </Group>
      </Expandable>
    </Pane>
  );
}

const CustomTabConfig: PluginTabConfig = {
  name: 'inspector',
  tabComponent: TabComponent,
  paneComponent: PaneComponent,
};

function exportCustomMetaForCurrentScene() {
  const currentScene = useScene();
}

function clearCustomMetaForCurrentScene() {
  const currentScene = useScene();
  clearCustomMeta(currentScene.meta);
}

export const editorPlugin = makeEditorPlugin({
  name: "motion-paw-tools-editor",
  tabs: [CustomTabConfig],

  player(player) {
    player.playback.onSceneChanged.subscribe(() => {
      const currentScene = player.playback.currentScene;
      clearCustomMeta(currentScene.meta);
    });
    player.onRecalculated.subscribe(() => {
      const currentScene = player.playback.currentScene;
      clearCustomMeta(currentScene.meta);
    });
  },
});

