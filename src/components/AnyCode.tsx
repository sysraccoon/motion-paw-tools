import { all, createSignal, SimpleSignal, ThreadGenerator } from "@motion-canvas/core";
import { Code, CodeHighlighter, CodeProps, CodeTag, DefaultHighlightStyle, HighlightResult, nodeName, RawCodeFragment } from "@motion-canvas/2d";
import { HighlightStyle } from "@codemirror/language";
import { colors } from "../colorscheme";

export interface AnyCodeProps extends CodeProps { }
 
export class AnyCode extends Code {
    private rawText: SimpleSignal<string> = createSignal();
    private highlighterInstance: ManualHighlighter;
 
    public constructor(props?: AnyCodeProps) {
        super({ ...props });
 
        this.highlighterInstance = new ManualHighlighter(this.rawText);
        this.highlighter(this.highlighterInstance);
        this.colorizeText(this.code().fragments.join())
    }
 
    private extract(strings: TemplateStringsArray, ...tags: RawCodeFragment[]): ExtractedCode {
        const cleanedStrings = strings.map(purgeCodes);
        const cleanedTags = tags.map((tag: RawCodeFragment) => ({
            before: purgeCodes(tag.before),
            after: purgeCodes(tag.after),
        }));
 
        const raw = this.concatenateStringsAndTags(strings, tags);
        const rawCleaned = this.concatenateStringsAndTags(cleanedStrings as unknown as TemplateStringsArray, cleanedTags as RawCodeFragment[]);
 
        return { raw, rawCleaned, strings: cleanedStrings as unknown as TemplateStringsArray, tags: cleanedTags };
    }
 
    private concatenateStringsAndTags(strings: TemplateStringsArray, tags: RawCodeFragment[]): string {
        return strings.reduce((acc, str, index) => acc + (index > 0 ? tags[index - 1].after : "") + str, "");
    }

    public colorizeText(raw: string) {
        this.rawText(raw);
        this.highlighterInstance.printCode();
        this.code(purgeCodes(raw));
    }
 
    public editt(duration: number = 0.6): any {
        const code = this.code;
        return (strings: TemplateStringsArray, ...tags: RawCodeFragment[]) => {
            const { raw, strings: extractedStrings, tags: extractedTags } = this.extract(strings, ...tags);
            this.rawText(raw);
            this.highlighterInstance.printCode();
 
            return (function*() {
                yield* all(code.edit(duration)(extractedStrings, extractedTags));
            }).bind(this)();
        };
    }
}
 
type ExtractedCode = {
    raw: string;
    rawCleaned: string;
    strings: TemplateStringsArray;
    tags: RawCodeFragment[];
};
 
type TagGenerator = (
    strings: TemplateStringsArray,
    ...tags: CodeTag[]
) => ThreadGenerator;

function purgeCodes(code: string): string {
    code ??= "";
    for (const key of Object.keys(codeMap)) {
        code = code.replace(new RegExp(key, 'g'), "");
    }
    return code;
}

interface ManualHiCache {
    code: string;
    tree: Map<number, string>;
}
 
export class ManualHighlighter implements CodeHighlighter<ManualHiCache | null> {
    private cachedCode: string;
 
    public constructor(
        private readonly codeSignal: SimpleSignal<string>,
        public style: HighlightStyle = DefaultHighlightStyle,
    ) {
        this.cachedCode = this.codeSignal();
    }
 
    public printCode(): void {
        this.cachedCode = this.codeSignal();
    }
 
    public initialize(): boolean {
        return true;
    }
 
    public prepare(code: string): ManualHiCache | null {
        code = this.cachedCode;
        const tree = new Map<number, string>();
        let currentColor = colors.foreground;
        let index = 0;
        const offset = 0;
 
        while (index < code.length) {
            const slice = code.slice(index - 3, index);
 
            for (const [key, value] of Object.entries(codeMap)) {
                if (slice.endsWith(key)) {
                    const beforeIndex = code.substring(0, index - key.length);
                    const afterIndex = code.substring(index);
                    code = beforeIndex + afterIndex;
                    currentColor = value;
                    index -= key.length;
                }
            }
 
            tree.set(index + offset, currentColor);
            index++;
        }
 
        return { code, tree };
    }
 
    public highlight(index: number, cache: ManualHiCache | null): HighlightResult {
        const defaultColor = colors.foreground;
        if (!cache) {
            return { color: defaultColor, skipAhead: 0 };
        }
 
        const color = cache.tree.get(index) || defaultColor;
        const skipAhead = cache.tree.has(index) ? 0 : cache.code.length;
        return { color, skipAhead };
    }
 
    public tokenize(code: string): string[] {
        return [code];
    }
}
 
const codeMap = Object.fromEntries(colors.base16.map((color, index) => [`<&${index.toString(16).toUpperCase()}`, color]));
