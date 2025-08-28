import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const openGeminiDisposable = vscode.commands.registerCommand('gemini.cli', () => {
		vscode.window.createTerminal({ name: 'Gemini CLI', shellPath: 'powershell.exe', shellArgs: ['-NoExit', '-Command', '& gemini --model gemini-2.5-flash --yolo'] }).show();
	});

	const geminiStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	geminiStatusBarItem.command = 'gemini.cli';
	geminiStatusBarItem.text = '$(sparkle) Gemini CLI';
	geminiStatusBarItem.tooltip = 'Gemini CLI Launcher';
	geminiStatusBarItem.show();

	context.subscriptions.push(openGeminiDisposable, geminiStatusBarItem);
}

export function deactivate() {}
