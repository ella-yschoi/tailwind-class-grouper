// Category definitions
export type CategoryKey =
  | 'size'
  | 'layout'
  | 'spacing'
  | 'border'
  | 'background'
  | 'text'
  | 'effects'
  | 'interactivity'
  | 'transform'
  | 'filter'
  | 'ringOutline'
  | 'overflowDisplay'
  | 'others';

export interface CategoryConfig {
  key: CategoryKey;
  label: string;
  patterns: RegExp[];
}

export const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    key: 'size',
    label: 'Size',
    patterns: [/^w-/, /^h-/, /^min-w/, /^max-w/, /^min-h/, /^max-h/, /^size-/],
  },
  {
    key: 'layout',
    label: 'Layout',
    patterns: [
      /^flex/,
      /^grid/,
      /^inline/,
      /^block$/,
      /^inline-block$/,
      /^inline-flex$/,
      /^relative$/,
      /^absolute$/,
      /^fixed$/,
      /^sticky$/,
      /^top-/,
      /^right-/,
      /^bottom-/,
      /^left-/,
      /^inset-/,
      /^float-/,
      /^clear-/,
      /^isolate/,
      /^object-/,
      /^col-/,
      /^row-/,
      /^auto-cols-/,
      /^auto-rows-/,
      /^items-/,
      /^justify-/,
      /^self-/,
      /^place-/,
      /^order-/,
      /^shrink/,
      /^grow/,
      /^basis-/,
    ],
  },
  {
    key: 'spacing',
    label: 'Spacing',
    patterns: [/^p[trblxyse]?-/i, /^m[trblxyse]?-/i, /^-m[trblxyse]?-/i, /^gap-/, /^space-/],
  },
  {
    key: 'border',
    label: 'Border',
    patterns: [/^border/, /^rounded/, /^divide-/],
  },
  {
    key: 'background',
    label: 'Background',
    patterns: [/^bg-/, /^from-/, /^via-/, /^to-/, /^gradient-/],
  },
  {
    key: 'text',
    label: 'Text',
    patterns: [
      /^text-/,
      /^font-/,
      /^leading-/,
      /^tracking-/,
      /^decoration-/,
      /^underline/,
      /^overline/,
      /^line-through/,
      /^no-underline/,
      /^uppercase$/,
      /^lowercase$/,
      /^capitalize$/,
      /^normal-case$/,
      /^truncate$/,
      /^indent-/,
      /^align-/,
      /^whitespace-/,
      /^break-/,
      /^hyphens-/,
      /^content-/,
      /^list-/,
    ],
  },
  {
    key: 'effects',
    label: 'Effects',
    patterns: [/^shadow/, /^transition/, /^duration-/, /^ease-/, /^animate-/, /^delay-/],
  },
  {
    key: 'interactivity',
    label: 'Interactivity',
    patterns: [
      /^cursor-/,
      /^select-/,
      /^pointer-events-/,
      /^scroll-/,
      /^snap-/,
      /^touch-/,
      /^resize/,
      /^appearance-/,
      /^accent-/,
      /^caret-/,
      /^will-change-/,
    ],
  },
  {
    key: 'transform',
    label: 'Transform',
    patterns: [
      /^scale-/,
      /^rotate-/,
      /^translate-/,
      /^skew-/,
      /^origin-/,
      /^transform$/,
      /^-translate-/,
      /^-rotate-/,
      /^-skew-/,
      /^-scale-/,
    ],
  },
  {
    key: 'filter',
    label: 'Filter',
    patterns: [
      /^blur-/,
      /^blur$/,
      /^brightness-/,
      /^contrast-/,
      /^grayscale/,
      /^hue-rotate-/,
      /^invert/,
      /^saturate-/,
      /^sepia/,
      /^backdrop-/,
      /^drop-shadow-/,
    ],
  },
  {
    key: 'ringOutline',
    label: 'Ring/Outline',
    patterns: [/^ring-/, /^ring$/, /^outline-/, /^outline$/],
  },
  {
    key: 'overflowDisplay',
    label: 'Overflow/Display',
    patterns: [
      /^overflow-/,
      /^z-/,
      /^visible$/,
      /^invisible$/,
      /^hidden$/,
      /^opacity-/,
      /^collapse$/,
    ],
  },
  {
    key: 'others',
    label: 'Others',
    patterns: [/./],
  },
];

/**
 * Strip variant prefixes from a Tailwind class.
 * e.g. "hover:bg-blue-500" → "bg-blue-500", "md:dark:flex" → "flex"
 * Preserves colons inside arbitrary values like "bg-[url:...]".
 */
export function stripVariants(cls: string): string {
  const bracketStart = cls.indexOf('[');
  if (bracketStart !== -1) {
    const beforeBracket = cls.substring(0, bracketStart);
    const fromBracket = cls.substring(bracketStart);
    const lastColon = beforeBracket.lastIndexOf(':');
    if (lastColon !== -1) {
      return beforeBracket.substring(lastColon + 1) + fromBracket;
    }
    return cls;
  }

  const lastColon = cls.lastIndexOf(':');
  if (lastColon !== -1) {
    return cls.substring(lastColon + 1);
  }
  return cls;
}

export function getCategoryKey(cls: string): CategoryKey {
  const base = stripVariants(cls);
  for (const cfg of CATEGORY_CONFIGS) {
    if (cfg.key === 'others') continue;
    if (cfg.patterns.some((p) => p.test(base))) {
      return cfg.key;
    }
  }
  return 'others';
}

export function groupClasses(classes: string[]): Record<CategoryKey, string[]> {
  const groups: Record<CategoryKey, string[]> = {
    size: [],
    layout: [],
    spacing: [],
    border: [],
    background: [],
    text: [],
    effects: [],
    interactivity: [],
    transform: [],
    filter: [],
    ringOutline: [],
    overflowDisplay: [],
    others: [],
  };

  for (const cls of classes) {
    if (!cls.trim()) continue;
    const key = getCategoryKey(cls);
    groups[key].push(cls);
  }

  return groups;
}

export function buildClsxBlock(
  attrName: string,
  groups: Record<CategoryKey, string[]>
): string {
  const lines: string[] = [];
  lines.push(`${attrName}={clsx(`);

  for (const cfg of CATEGORY_CONFIGS) {
    const list = groups[cfg.key];
    if (!list || list.length === 0) continue;
    lines.push(`  // ${cfg.label}`);
    lines.push(`  "${list.join(' ')}",`);
    lines.push('');
  }

  if (lines[lines.length - 1] === '') {
    lines.pop();
  }

  lines.push(`)}`)
  return lines.join('\n');
}

export function transformAttribute(text: string): string | null {
  const attrRegex = /^(className|class)\s*=\s*["'`]([^"'`]+)["'`]\s*$/s;
  const m = text.trim().match(attrRegex);
  if (!m) return null;

  const attrName = m[1];
  const classString = m[2];
  const classes = classString
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (classes.length === 0) return null;

  const grouped = groupClasses(classes);
  return buildClsxBlock(attrName, grouped);
}
