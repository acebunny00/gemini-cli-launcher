import { exec } from 'child_process';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const openGeminiDisposable = vscode.commands.registerCommand("gemini.cli", () => {
		vscode.window.createTerminal({ name: "Gemini CLI", shellPath: "powershell.exe", shellArgs: ["-NoExit", "-Command", "& gemini --model gemini-2.5-flash --yolo --all-files --checkpointing"] }).show();
	});

	const openGeminiInPowershellDisposable = vscode.commands.registerCommand("gemini.cli.inPowerShell", (uri: vscode.Uri) => {
		const path = uri.fsPath;
		exec(`start powershell -NoExit -Command "cd '${path}'; gemini --model gemini-2.5-flash --yolo --all-files --checkpointing"`);
	});

	const openGeminiInGitBashDisposable = vscode.commands.registerCommand("gemini.cli.inGitBash", (uri: vscode.Uri) => {
		const path = uri.fsPath;
		exec(`start "" "C:\\Program Files\\Git\\git-bash.exe" -c "cd '${path}'; gemini --model gemini-2.5-flash --yolo --all-files --checkpointing"`);
	});

	const geminiStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	geminiStatusBarItem.command = "gemini.cli";
	geminiStatusBarItem.text = "$(sparkle) Gemini CLI";
	geminiStatusBarItem.tooltip = "Gemini CLI Launcher";
	geminiStatusBarItem.show();

	context.subscriptions.push(openGeminiDisposable, openGeminiInPowershellDisposable, openGeminiInGitBashDisposable, geminiStatusBarItem);
}

export function deactivate() {}
