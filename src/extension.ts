import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

let geminiCliCommand: string;

function getGitBashPath(): string {
	const gitBashExe = "git-bash.exe";
	const defaultGitBashPath = "C:\\Program Files\\Git\\git-bash.exe";

	const pathEnv = process.env.PATH || "";
	const pathDirs = pathEnv.split(path.delimiter);

	for (const dir of pathDirs) {
		const fullPath = path.join(dir, gitBashExe);
		if (fs.existsSync(fullPath)) {
			return fullPath;
		}
	}

	return defaultGitBashPath;
}

function getBashPath(): string {
	const gitBashExe = "bash.exe";
	const defaultGitBashPath = "C:\\Program Files\\Git\\bin\\bash.exe";

	const pathEnv = process.env.PATH || "";
	const pathDirs = pathEnv.split(path.delimiter);

	for (const dir of pathDirs) {
		const fullPath = path.join(dir, gitBashExe);
		if (fs.existsSync(fullPath)) {
			return fullPath;
		}
	}

	return defaultGitBashPath;
}

function updateGeminiCliCommand() {
	const config = vscode.workspace.getConfiguration("gemini.cli");
	const useFlashModel = config.get<boolean>("command.useFlash", true);
	const useYolo = config.get<boolean>("command.yolo", true);
	const useAllFiles = config.get<boolean>("command.allFiles", true);
	const useCheckpointing = config.get<boolean>("command.checkpointing", true);

	const commandParts = ["gemini"];
	if (useFlashModel) {
		commandParts.push("-m gemini-2.5-flash");
	}
	if (useYolo) {
		commandParts.push("-y");
	}
	if (useAllFiles) {
		commandParts.push("--all-files");
	}
	if (useCheckpointing) {
		commandParts.push("--checkpointing");
	}
	geminiCliCommand = commandParts.join(" ");
}

export function activate(context: vscode.ExtensionContext) {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	const cwd = workspaceFolder ? workspaceFolder.uri.fsPath : process.cwd();

	// 초기 geminiCliCommand 설정
	updateGeminiCliCommand();

	// 설정 변경 감지
	vscode.workspace.onDidChangeConfiguration(event => {
		if (event.affectsConfiguration("gemini.cli")) {
			updateGeminiCliCommand();
		}
	});

	const geminiStatusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left,
		100
	);
	geminiStatusBarItem.command = "gemini.cli";
	geminiStatusBarItem.text = "$(sparkle) Gemini CLI";
	geminiStatusBarItem.tooltip = "Gemini CLI Launcher";
	geminiStatusBarItem.show();

	const openGeminiDisposable = vscode.commands.registerCommand(
		"gemini.cli",
		() => {

			vscode.window
				.createTerminal({
					name: "Gemini CLI",
					shellPath: "powershell.exe",
					shellArgs:
						[
							"-NoExit",
							"-Command",
							`& ${geminiCliCommand}`,
						],
					cwd,
				})
				.show();
		}
	);

	const executeGeminiCommand = (uri: vscode.Uri, shellType: "cmd" | "bash" | "gitbash" | "powershell") => {
		let command: string;

		switch (shellType) {
			case "cmd":
				command = `start "CMD" cmd.exe /k "${geminiCliCommand}"`;
				break;
			case "bash":
				const BashPath = getBashPath();
				command = `start "Git Bash" "${BashPath}" -c "${geminiCliCommand}"`;
				break;
			case "gitbash":
				const gitBashPath = getGitBashPath();
				command = `start "Git Bash" "${gitBashPath}" -c "${geminiCliCommand}"`;
				break;
			case "powershell":
				command = `start "PowerShell" powershell -NoExit -Command "${geminiCliCommand}"`;
				break;
		}
		exec(command, { cwd: cwd });
	};

	const commandsToRegister: { id: string; shellType: "cmd" | "bash" | "gitbash" | "powershell" }[] = [
		{ id: "gemini.cli.onCMD", shellType: "cmd" },
		{ id: "gemini.cli.onBash", shellType: "bash" },
		{ id: "gemini.cli.onGitBash", shellType: "gitbash" },
		{ id: "gemini.cli.onPowerShell", shellType: "powershell" },
	];

	const disposables = commandsToRegister.map(cmd => {
		return vscode.commands.registerCommand(cmd.id, (uri: vscode.Uri) => {
			executeGeminiCommand(uri, cmd.shellType);
		});
	});

	context.subscriptions.push(
		geminiStatusBarItem,
		openGeminiDisposable,
		...disposables
	);
}

export function deactivate() { }