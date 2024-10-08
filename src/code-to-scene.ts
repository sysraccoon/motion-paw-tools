import { Code, Layout } from "@motion-canvas/2d";
import ts from "typescript";
import vm from "node:vm";

import * as jsxRuntime from "@motion-canvas/2d/lib/jsx-runtime";

export function* syncPreviewByCode(code: Code, preview: Layout) {
  const scene = createSceneFromCodeEditor(code);
  preview.removeChildren();
  yield* scene(preview);
}

export function createSceneFromCodeEditor(code: Code) {
  return createSceneFromCode(code.parsed());
}

export function createSceneFromCode(codeText: string, modules?: Map<string, any>, imports?: Map<string, any>) {
  const modulesWithJsxRuntime = new Map<string, any>([
    ...(modules ?? []),
    ["@motion-canvas/2d/lib/jsx-runtime", jsxRuntime],
  ]);

  const context = vm.createContext({
    ...(imports ?? []),

    exports: {},
    require: function(module: string): any {
      if (modulesWithJsxRuntime.has(module)) {
        return modulesWithJsxRuntime.get(module);
      }
      throw new Error(`module ${module} not found`);
    },
  });

  const codeTranspiled = ts.transpile(codeText, {
    target: ts.ScriptTarget.ES5,
    jsx: ts.JsxEmit.ReactJSX,
    jsxImportSource: "@motion-canvas/2d/lib",
  });
  vm.runInContext(codeTranspiled, context);

  return context.exports.default.config;
}
