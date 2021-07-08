// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-graphql" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-graphql.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Speedoops GraphQL!');
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('vscode-graphql.convertToCamelCase', () => {
		// The code you place here will be executed every time your command is executed

		const editor = vscode.window.activeTextEditor
		if (editor) {
			if (!editor.selection.isEmpty) {
				editor.edit(editBuilder => {
					editor.selections.forEach(selection => {
						const text = editor.document.getText(selection)
						editBuilder.replace(selection, convertToCamelCase(text))
					})
				})
			} else {
				let firstLine = editor.document.lineAt(0);
				let lastLine = editor.document.lineAt(editor.document.lineCount - 1);
				let textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
				let newText = editor.document.getText(textRange);
				editor.edit(edit => edit.replace(textRange, convertToCamelCase(newText)));
			}
		}
	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

// https://typescript-play.js.org/
var convertToCamelCase = function (str: string) {
	str = str.replace(/^([ \t]+)([A-Z]+)(.*)$/gm, function (_, b, c, d) {
		// console.log(a + "=" + b + "|" + c + "|" + d)
		if (c.length == 1) {
			c = c.toLowerCase();
		} else {
			let lc = c.toLowerCase();
			c = lc.substring(0, lc.length - 1) + c.substr(-1);
		}
		return b + c + d;
	});
	return str
}