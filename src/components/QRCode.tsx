import { colorSignal, Img, ImgProps, initial, signal } from "@motion-canvas/2d";
import { ColorSignal, createComputedAsync, PossibleColor, SignalValue, SimpleSignal } from "@motion-canvas/core";
import { colors } from "@sysraccoon/motion-paw-tools";
import { QRCodeErrorCorrectionLevel, QRCodeToDataURLOptions, toDataURL } from "qrcode";

export interface QRCodeProps extends ImgProps {
  text: SignalValue<string>;

  correctionLevel?: SignalValue<QRCodeErrorCorrectionLevel>;
  background?: SignalValue<PossibleColor>;
  foreground?: SignalValue<PossibleColor>;
  resolution?: SignalValue<number>;
}

export class QRCode extends Img {
  @signal()
  public declare readonly text: SimpleSignal<string, this>;

  @initial("medium")
  @signal()
  public declare readonly correctionLevel: SimpleSignal<QRCodeErrorCorrectionLevel, this>;

  @initial(colors.backgroundAlt)
  @colorSignal()
  public declare readonly background: ColorSignal<this>;

  @initial(colors.foreground)
  @colorSignal()
  public declare readonly foreground: ColorSignal<this>;

  @initial(300)
  @signal()
  public declare readonly resolution: SimpleSignal<number, this>;;

  public constructor(props: QRCodeProps) {
    super({
      src: null,
      ...props,
    });

    const {
      text,
      background,
      foreground,
      resolution,
      correctionLevel,
    } = this;

    const qrImg = createComputedAsync(async () => {
      var opts: QRCodeToDataURLOptions = {
        errorCorrectionLevel: correctionLevel(),
        type: "image/webp",
        margin: 1,
        width: resolution(),
        color: {
          dark: background().hex(),
          light: foreground().hex(),
        }
      };
      return await toDataURL(text(), opts);
    }, "");

    this.src(() => qrImg());
  }
}

