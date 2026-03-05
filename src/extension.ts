import * as vscode from 'vscode';
import { transformAttribute } from './grouper';

export { stripVariants, getCategoryKey, groupClasses, buildClsxBlock, transformAttribute } from './grouper';
export type { CategoryKey, CategoryConfig } from './grouper';

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
