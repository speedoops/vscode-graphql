// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	vscode.languages.registerDocumentFormattingEditProvider('graphql', {
		provideDocumentFormattingEdits(document: vscode.TextDocument, options): Promise<vscode.TextEdit[]> {
			const newLineSeparator = document.eol === vscode.EndOfLine.LF ? '\n' : '\r\n';
			const indent = options.insertSpaces ? ' '.repeat(options.tabSize) : '\t';
			let formatted;
			try {
				formatted = convertToCamelCase(document.getText());
			} catch (err) {
				throw new Error('File has syntax errors');
			}

			const fileStart = new vscode.Position(0, 0);
			const fileEnd = document.lineAt(document.lineCount - 1).range.end;
			return Promise.resolve([
				vscode.TextEdit.replace(new vscode.Range(fileStart, fileEnd), formatted)
			]);
		}
	});

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-graphql" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-graphql.convertToUpperCase', () => {
		// The code you place here will be executed every time your command is executed

		const editor = vscode.window.activeTextEditor;
		if (editor) {
			if (!editor.selection.isEmpty) {
				editor.edit(editBuilder => {
					editor.selections.forEach(selection => {
						const text = editor.document.getText(selection);
						editBuilder.replace(selection, convertToUpperCase(text));
					});
				});
			} else {
				let firstLine = editor.document.lineAt(0);
				let lastLine = editor.document.lineAt(editor.document.lineCount - 1);
				let textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
				let newText = editor.document.getText(textRange);
				editor.edit(edit => edit.replace(textRange, convertToUpperCase(newText)));
			}
		}
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('vscode-graphql.convertToCamelCase', () => {
		// The code you place here will be executed every time your command is executed

		const editor = vscode.window.activeTextEditor;
		if (editor) {
			if (!editor.selection.isEmpty) {
				editor.edit(editBuilder => {
					editor.selections.forEach(selection => {
						const text = editor.document.getText(selection);
						editBuilder.replace(selection, convertToCamelCase(text));
					});
				});
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

function formatDocument(document: vscode.TextDocument) {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		if (!editor.selection.isEmpty) {
			editor.edit(editBuilder => {
				editor.selections.forEach(selection => {
					const text = editor.document.getText(selection);
					editBuilder.replace(selection, convertToCamelCase(text));
				});
			});
		} else {
			let firstLine = editor.document.lineAt(0);
			let lastLine = editor.document.lineAt(editor.document.lineCount - 1);
			let textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
			let text = editor.document.getText(textRange);
			editor.edit(edit => edit.replace(textRange, convertToCamelCase(text)));
		}
	}
}

// https://typescript-play.js.org/
var convertToCamelCase = function (str: string) {
	str = str.replace(/^([ \t]+)([A-Z]+)(.*)$/gm, function (_, b, c, d) {
		// AsSpecifiedByCluster=	|A|sSpecifiedByCluster
		// VMId: String=	|VMI|d: String
		// console.log(a + "=" + b + "|" + c + "|" + d);
		if (c.length === 1) {
			c = c.toLowerCase();
		} else {
			let lc = c.toLowerCase();
			c = lc.substring(0, lc.length - 1) + c.substr(-1);
		}
		return b + c + d;
	});
	return str;
};

// https://typescript-play.js.org/
var convertToUpperCase = function (str: string) {
	str = str.replace(/^([ \t]+)([A-Z]+)(.*)$/gm, function (a, b, c, d) {
		// AsSpecifiedByCluster=	|A|sSpecifiedByCluster
		// VMId: String=	|VMI|d: String
		console.log(a + "=" + b + "|" + c + "|" + d);
		if (c.length !== 1) {
			c = c.substring(0, c.length - 1) + "_" + c.substr(-1);
		}
		d = String(d).replace(/([a-z])([A-Z])/gm, function (_, d2, d3) {
			console.log(d + "=" + d2 + "|" + d3);
			return d2 + "_" + d3;
		});
		return (b + c + d).toUpperCase();
	});
	return str;
};
