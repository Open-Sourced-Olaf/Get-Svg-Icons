import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
	  vscode.window.registerWebviewViewProvider(
		"get-svg-icons-sidebar",
		sidebarProvider
	  )
	);

	let disposable2 = vscode.commands.registerCommand('get-svg-icons.insertText', function () {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            editor.edit(editBuilder => {
                editor.selections.forEach(sel => {
					const position = editor.selection.active;
					editBuilder.insert(position, 'text');
                })
            })
        }
    });
	context.subscriptions.push(disposable2);
}

export function deactivate() {}