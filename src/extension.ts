import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "gemini-cli-launcher" is now active!');

	const disposable = vscode.commands.registerCommand('gemini-cli-launcher.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Gemini CLI Launcher!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
