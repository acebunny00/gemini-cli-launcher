import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

let geminiCliCommand: string;
let isGeminiCliAvailableCached: boolean | undefined = undefined;
let isGitAvailableCached: boolean | undefined = undefined;

async function getGitInstallPathFromRegistry(): Promise<string | undefined> {
	try {
		const { stdout } = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
			exec('reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\GitForWindows" /v InstallPath', (error, stdout, stderr) => {
				if (error) {
					exec('reg query "HKEY_CURRENT_USER\\SOFTWARE\\GitForWindows" /v InstallPath', (error2, stdout2, stderr2) => {
						if (error2) {
							reject(error2);
						} else {
							resolve({ stdout: stdout2, stderr: stderr2 });
						}
					});
				} else {
					resolve({ stdout, stderr });
				}
			});
		});

		const match = stdout.match(/InstallPath\s+REG_SZ\s+(.*)/);
		if (match && match[1]) {
			return match[1].trim();
		}
	} catch (error) {
		console.error("레지스트리에서 Git 설치 경로를 찾을 수 없습니다:", error);
		vscode.window.showErrorMessage("Git 설치 경로를 찾을 수 없습니다. Git이 설치되어 있는지 확인해주세요.");
		await checkGitExistence();
	}
	return undefined;
}

async function findExecutableInGitPath(exeName: string): Promise<string | undefined> {
	const gitInstallPath = await getGitInstallPathFromRegistry();
	if (gitInstallPath) {
		const gitBinPath = path.join(gitInstallPath, "bin", exeName);
		if (fs.existsSync(gitBinPath)) {
			return gitBinPath;
		}
		const gitCmdPath = path.join(gitInstallPath, exeName);
		if (fs.existsSync(gitCmdPath)) {
			return gitCmdPath;
		}
	}
	return undefined;
}

async function getShellPath(defaultPath: string): Promise<string> {
	const exeName = path.basename(defaultPath);
	const pathEnv = process.env.PATH || "";
	const pathDirs = pathEnv.split(path.delimiter);

	for (const dir of pathDirs) {
		const fullPath = path.join(dir, exeName);
		if (fs.existsSync(fullPath)) {
			return fullPath;
		}
	}

	const gitExePath = await findExecutableInGitPath(exeName);
	if (gitExePath) {
		return gitExePath;
	}

	if (exeName.includes("bash")) {
		vscode.window.showErrorMessage(`'${exeName}' 쉘 경로를 찾을 수 없습니다. Git Bash가 설치되어 있는지 확인해주세요.`);
	} else {
		vscode.window.showErrorMessage(`'${exeName}' 쉘 경로를 찾을 수 없습니다.`);
	}

	return defaultPath;
}

async function checkGeminiCliExistence(): Promise<boolean> {
	if (isGeminiCliAvailableCached !== undefined) {
		return isGeminiCliAvailableCached;
	}

	return new Promise(resolve => {
		exec('gemini --version', (error) => {
			if (error) {
				vscode.window.showErrorMessage(
					"Gemini CLI를 찾을 수 없습니다. 설치되어 있는지 확인하거나 PATH에 추가해주세요.",
					"설치 가이드 보기"
				).then(selection => {
					if (selection === "설치 가이드 보기") {
						vscode.env.openExternal(vscode.Uri.parse("https://github.com/google-gemini/gemini-cli?tab=readme-ov-file#quick-install"));
					}
				});
				isGeminiCliAvailableCached = false;
				resolve(false);
			} else {
				isGeminiCliAvailableCached = true;
				resolve(true);
			}
		});
	});
}

async function checkGitExistence(): Promise<boolean> {
	if (isGitAvailableCached !== undefined) {
		return isGitAvailableCached;
	}

	return new Promise(resolve => {
		exec('git --version', (error) => {
			if (error) {
				vscode.window.showErrorMessage(
					"Git을 찾을 수 없습니다. 설치되어 있는지 확인하거나 PATH에 추가해주세요.",
					"설치 가이드 보기"
				).then(selection => {
					if (selection === "설치 가이드 보기") {
						vscode.env.openExternal(vscode.Uri.parse("https://git-scm.com/downloads"));
					}
				});
				isGitAvailableCached = false;
				resolve(false);
			} else {
				isGitAvailableCached = true;
				resolve(true);
			}
		});
	});
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

async function executeGeminiCommand(uri: vscode.Uri | undefined, shellType: "cmd" | "bash" | "gitbash" | "powershell") {
	let command: string;
	let targetCwd: string;

	const isGeminiCliAvailable = await checkGeminiCliExistence();
	if (!isGeminiCliAvailable) {
		return;
	}

	if (uri) {
		const stats = fs.statSync(uri.fsPath);
		if (stats.isDirectory()) {
			targetCwd = uri.fsPath;
		} else {
			targetCwd = path.dirname(uri.fsPath);
		}
	} else {
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		targetCwd = workspaceFolder ? workspaceFolder.uri.fsPath : process.cwd();
	}

	switch (shellType) {
		case "powershell":
			command = `start "PowerShell" powershell -NoExit -Command "${geminiCliCommand}"`;
			break;
		case "cmd":
			command = `start "CMD" cmd.exe /k "${geminiCliCommand}"`;
			break;
		case "bash":
			const BashPath = await getShellPath("bash.exe");
			command = `start "Git Bash" "${BashPath}" -c "${geminiCliCommand}"`;
			break;
		case "gitbash":
			const gitBashPath = await getShellPath("git-bash.exe");
			command = `start "Git Bash" "${gitBashPath}" -c "${geminiCliCommand}"`;
			break;
	}

	vscode.window.showInformationMessage(`'${targetCwd}'에서 Gemini CLI를 ${shellType}로 실행합니다.`);
	exec(command, { cwd: targetCwd });
}

export async function activate(context: vscode.ExtensionContext) {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	const cwd = workspaceFolder ? workspaceFolder.uri.fsPath : process.cwd();

	await checkGitExistence();
	await checkGeminiCliExistence();

	updateGeminiCliCommand();

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
	geminiStatusBarItem.tooltip = `Gemini CLI Launcher: ${geminiCliCommand}`;
	geminiStatusBarItem.show();

	const openGeminiDisposable = vscode.commands.registerCommand(
		"gemini.cli",
		async () => {
			const isGeminiCliAvailable = await checkGeminiCliExistence();
			if (!isGeminiCliAvailable) {
				return;
			}

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

	const commandsToRegister: { id: string; shellType: "cmd" | "bash" | "gitbash" | "powershell" }[] = [
		{ id: "gemini.cli.onPowerShell", shellType: "powershell" },
		{ id: "gemini.cli.onCMD", shellType: "cmd" },
		{ id: "gemini.cli.onBash", shellType: "bash" },
		{ id: "gemini.cli.onGitBash", shellType: "gitbash" },
	];

	const disposables = commandsToRegister.map(cmd => {
		return vscode.commands.registerCommand(cmd.id, async (uri: vscode.Uri) => {
			const isGeminiCliAvailable = await checkGeminiCliExistence();
			if (!isGeminiCliAvailable) {
				return;
			}
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
