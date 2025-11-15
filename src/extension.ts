import * as vscode from 'vscode';

// Category definitions
type CategoryKey =
  | 'size'
  | 'layout'
  | 'spacing'
  | 'border'
  | 'background'
  | 'text'
  | 'effects'
  | 'others';

interface CategoryConfig {
  key: CategoryKey;
  label: string;
  patterns: RegExp[];
}

const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    key: 'size',
    label: 'Size',
    patterns: [/^w-/, /^h-/, /^min-w/, /^max-w/, /^min-h/, /^max-h/],
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
    ],
  },
  {
    key: 'spacing',
    label: 'Spacing',
    patterns: [/^p[trblxy]?-/i, /^m[trblxy]?-/i, /^gap-/],
  },
  {
    key: 'border',
    label: 'Border',
    patterns: [/^border/, /^rounded/],
  },
  {
    key: 'background',
    label: 'Background',
    patterns: [/^bg-/, /^from-/, /^via-/, /^to-/],
  },
  {
    key: 'text',
    label: 'Text',
    patterns: [/^text-/, /^font-/, /^leading-/, /^tracking-/, /^placeholder:/],
  },
  {
    key: 'effects',
    label: 'Effects',
    patterns: [/^shadow/, /^transition/, /^duration-/, /^ease-/, /^animate-/],
  },
  {
    key: 'others',
    label: 'Others',
    patterns: [/./],
  },
];

function getCategoryKey(cls: string): CategoryKey {
  for (const cfg of CATEGORY_CONFIGS) {
    if (cfg.patterns.some((p) => p.test(cls))) {
      return cfg.key;
    }
  }
  return 'others';
}

function groupClasses(classes: string[]): Record<CategoryKey, string[]> {
  const groups: Record<CategoryKey, string[]> = {
    size: [],
    layout: [],
    spacing: [],
    border: [],
    background: [],
    text: [],
    effects: [],
    others: [],
  };

  for (const cls of classes) {
    if (!cls.trim()) continue;
    const key = getCategoryKey(cls);
    groups[key].push(cls);
  }

  return groups;
}

function buildClsxBlock(
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

  lines.push(`)}`);
  return lines.join('\n');
}

function transformAttribute(text: string): string | null {
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

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'tailwind-class-grouper.groupClasses',
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
      }

      const selection = editor.selection;
      if (selection.isEmpty) {
        vscode.window.showInformationMessage(
          'Please select the entire className="..." attribute first.'
        );
        return;
      }

      const text = editor.document.getText(selection);
      const result = transformAttribute(text);

      if (!result) {
        vscode.window.showInformationMessage(
          'Could not find className or class attribute in the selected text.'
        );
        return;
      }

      editor.edit((editBuilder: vscode.TextEditorEdit) => {
        editBuilder.replace(selection, result);
      });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
