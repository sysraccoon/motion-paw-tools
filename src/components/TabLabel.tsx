import { TxtProps, Layout, Rect, Txt, Path } from "@motion-canvas/2d";
import { SignalValue } from "@motion-canvas/core";
import { colors } from "@sysraccoon/motion-paw-tools";

export function tabLabel(text: SignalValue<string>) {
  const pinLabelStyle: TxtProps = {
    fontFamily: "Source Code Pro",
    fontSize: 30,
    fill: colors.foreground,
    offset: [-1, 1],
    padding: [15, 30],
  };

  return <Layout layout alignItems={"end"}>
    <Rect fill={colors.backgroundAlt} radius={[20, 20, 0, 0]}>
      <Txt {...pinLabelStyle} text={text}/>
    </Rect>
    <Path
      data={"M0,25L0,0S0,25,25,25Z"}
      fill={colors.backgroundAlt}
    />
  </Layout>;
}
