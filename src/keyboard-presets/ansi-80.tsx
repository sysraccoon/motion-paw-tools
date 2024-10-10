import { Layout, LayoutProps, Node } from "@motion-canvas/2d";
import { Keyboard, KeyboardLayout, KeyboardLayoutItem } from "../components/Keyboard";

export function keyboardFormFactorANSI80(kbd: Keyboard): Layout {
  const keyGap = 5;

  const gap = function(unitSize: number): Layout {
    return <Layout width={kbd.unitToSize(unitSize)}/> as Layout;
  };

  const keyRow = function(keyDefs: (number | Node)[], extraProps?: LayoutProps) {
    return <Layout {...extraProps} gap={keyGap} justifyContent={"space-between"}>
      {...keyDefs.map((keyDef) => typeof keyDef == "number" ? kbd.createKey(keyDef) : keyDef)}
    </Layout>
  };

  const layoutScheme = <Layout layout direction={"column"} gap={keyGap*2} >
    {...[
      keyRow([1, gap(1), 1, 1, 1, 1, gap(0.5), 1, 1, 1, 1, gap(0.5), 1, 1, 1, 1], { marginBottom: 25 }), // function key row
      keyRow([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,      2]), // number layer row
      keyRow([1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1.5]), // top layout row
      keyRow([1.75,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  2.25]), // home layout row
      keyRow([2.25,   1, 1, 1, 1, 1, 1, 1, 1, 1, 1,    2.75]), // bottom layout row
      keyRow([1.25, 1.25, 1.25, 6.5, 1.25, 1.25, 1.25, 1.25]), // modifier row
    ]}
  </Layout> as Layout;

  return layoutScheme;
}

export function keyboardLayoutQWERTYforANSI80(): KeyboardLayout {
  return [
    sk("Esc"), k("F1"), k("F2"), k("F3"), k("F4"), k("F5"), k("F6"), k("F7"), k("F8"), k("F9"), k("F10"), k("F11"), k("F12"), 
    k2("~", "`"), k2("!", "1"), k2("@", "2"), k2("#", "3"), k2("$", "4"), k2("%", "5"), k2("^", "6"), k2("&", "7"), k2("*", "8"), k2("(", "9"), k2(")", "0"), k2("_", "-"), k2("+", "="), sk("Backspace"),
    sk("Tab"), k("Q"), k("W"), k("E"), k("R"), k("T"), k("Y"), k("U"), k("I"), k("O"), k("P"), k2("{", "["), k2("}", "]"), k2("|", "\\"),
    sk("Caps Lock"), k("A"), k("S"), k("D"), k("F"), k("G"), k("H"), k("J"), k("K"), k("L"), k2(":", ";"), k2("\"", "'"), sk("Enter", ["Enter", "Return"]),
    sk("Shift", ["LShift", "Shift"]), k("Z"), k("X"), k("C"), k("V"), k("B"), k("N"), k("M"), k2("<", ","), k2(">", "."), k2("?", "/"), sk("Shift", ["RShift"]),
    sk("Ctrl", ["Ctrl", "LCtrl"]), sk("Meta", ["Meta", "LMeta", "Win", "LWin"]), sk("Alt", ["Alt", "LAlt"]), sk("", ["Space", " "]), sk("Alt", ["RAlt"]), sk("Meta", ["RMeta", "RWin"]), sk("Ctrl", ["RCtrl"]), sk("Fn"),
  ];
}

export function keyboardLayoutDvorakforANSI80(): KeyboardLayout {
  return [
    sk("Esc"), k("F1"), k("F2"), k("F3"), k("F4"), k("F5"), k("F6"), k("F7"), k("F8"), k("F9"), k("F10"), k("F11"), k("F12"), 
    k2("~", "`"), k2("!", "1"), k2("@", "2"), k2("#", "3"), k2("$", "4"), k2("%", "5"), k2("^", "6"), k2("&", "7"), k2("*", "8"), k2("(", "9"), k2(")", "0"), k2("{", "["), k2("}", "]"), sk("Backspace"),
    sk("Tab"), k2("\"", "'"), k2("<", ","), k2(">", "."), k("P"), k("Y"), k("F"), k("G"), k("C"), k("R"), k("L"), k2("?", "/"), k2("+", "="), k2("|", "\\"),
    sk("Caps Lock"), k("A"), k("O"), k("E"), k("U"), k("I"), k("D"), k("H"), k("T"), k("N"), k("S"), k2("_", "-"), sk("Enter", ["Enter", "Return"]),
    sk("Shift", ["LShift", "Shift"]), k2(":", ";"), k("Q"), k("J"), k("K"), k("X"), k("B"), k("M"), k("W"), k("V"), k("Z"), sk("Shift", ["RShift"]),
    sk("Ctrl", ["Ctrl", "LCtrl"]), sk("Meta", ["Meta", "LMeta", "Win", "LWin"]), sk("Alt", ["Alt", "LAlt"]), sk("", ["Space", " "]), sk("Alt", ["RAlt"]), sk("Meta", ["RMeta", "RWin"]), sk("Ctrl", ["RCtrl"]), sk("Fn"),
  ];
}

function k(label: string): KeyboardLayoutItem {
  return {
    labels: {
      topLeft: label,
    },
    aliases: [label],
  };
};

function k2(label1: string, label2: string): KeyboardLayoutItem {
  return {
    labels: {
      topLeft: label1,
      bottomLeft: label2,
    },
    aliases: [label1, label2],
  };
};

function sk(label: string, aliases?: string[]): KeyboardLayoutItem {
  return {
    labels: {
      topLeft: label,
      extraLabelProps: {
        fontSize: 26,
      },
    },
    aliases: aliases ?? [label],
  };
};