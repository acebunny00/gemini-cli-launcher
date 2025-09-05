# 🚀 Gemini CLI 런처: VS Code에서 Gemini CLI를 편리하게! 🚀

본 확장 프로그램은 Visual Studio Code에서 [Gemini CLI](https://github.com/google-gemini/gemini-cli)를 더욱 쉽고 편리하게 사용할 수 있도록 지원합니다.

## 💡 개발 동기

[Gemini-CLI 이슈](https://github.com/google-gemini/gemini-cli/issues/7289)가 해결되지 않아, 접근성을 높이고자 개발되었습니다. 본 확장 프로그램을 통해 `Gemini CLI`를 더욱 원활하게 사용할 수 있습니다.

## ✨ 주요 기능

- **VS Code 내 터미널 실행**:
  - 상태표시줄의 버튼 또는 `gemini.cli` 명령어를 통해 VS Code 내 터미널에서 Gemini CLI를 직접 실행할 수 있습니다.
- **다양한 쉘에서 독립 실행**:
  - 탐색기의 컨텍스트 메뉴를 통해 PowerShell, Git Bash, CMD 등 사용자가 원하는 쉘에서 Gemini CLI를 독립적으로 실행할 수 있습니다.
  - **지원 쉘**: PowerShell, Git Bash (리눅스 스타일 포함), CMD

## ⚙️ 옵션 설정 (사용자 맞춤형)

본 확장 프로그램은 사용자의 작업 스타일에 맞춰 Gemini CLI 명령어를 유연하게 설정할 수 있도록 다양한 옵션을 제공합니다. `VS Code 설정 (Ctrl+,)`에서 `Gemini CLI Launcher`를 검색하여 설정할 수 있습니다.

- **`gemini.cli.command.useFlash`**:
  - `true` (기본값): `gemini-2.5-flash` 모델을 사용합니다. (Pro 모델 대신)
  - `false`: Pro 모델을 사용합니다. (모델별 사용 제한량이 다를 수 있습니다.)
- **`gemini.cli.command.yolo`**:
  - `true` (기본값): 도구 사용을 자동으로 승인하여 사용자가 수동으로 확인하는 번거로움을 줄여줍니다.
  - `false`: 도구 사용 시 수동 승인이 필요합니다.
- **`gemini.cli.command.allFiles`**:
  - `true` (기본값): 프로젝트 내 모든 파일에 대한 접근을 자동으로 승인합니다.
  - `false`: 모든 파일 접근 시 수동 승인이 필요합니다.
- **`gemini.cli.command.checkpointing`**:
  - `true` (기본값): 프로젝트별로 과거 요청사항을 복구할 수 있습니다. (⬆️ 화살표 키)
  - `false`: 과거 요청사항을 기억하지 않습니다.

### 컨텍스트 메뉴 활성화 설정

탐색기 컨텍스트 메뉴에 Gemini CLI 실행 옵션을 표시할지 설정할 수 있습니다.

- **`gemini.cli.contextMenu.onGitBash`**:
  - `true`: 'Gemini CLI: Bash로 열기 - 리눅스 스타일' 메뉴를 표시합니다.
- **`gemini.cli.contextMenu.onBash`**:
  - `true`: 'Gemini CLI: Bash로 열기' 메뉴를 표시합니다.
- **`gemini.cli.contextMenu.onCMD`**:
  - `true`: 'Gemini CLI: CMD로 열기' 메뉴를 표시합니다.
- **`gemini.cli.contextMenu.onPowerShell`**:
  - `true` (기본값): 'Gemini CLI: PowerShell로 열기' 메뉴를 표시합니다.

## 🛠️ 요구 사항

- [윈도우](https://microsoft.com/windows) 운영체제
- [Gemini CLI](https://github.com/google-gemini/gemini-cli) 설치
- [git](https://git-scm.com/downloads) 설치
- `git` 사용에 익숙하면 더욱 효율적으로 활용할 수 있습니다. (자동 승인 기능 사용 시 변경된 코드 확인 필요)

## ⚠️ 알려진 문제

`[ERROR] [IDEClient] Failed to connect to IDE companion extension for VS Code. Please ensure the extension is running. To install the extension, run /ide install.`

- 이 오류는 무시해도 무방하나, 해결을 원하시면 [Gemini CLI Companion](https://marketplace.visualstudio.com/items?itemName=Google.gemini-cli-vscode-ide-companion)을 설치하시기 바랍니다.

## 📝 릴리스 노트

### 0.1.0

- DX & UX 개선
- [VSCode](https://code.visualstudio.com) 탐색기의 컨텍스트 메뉴에서 [Gemini CLI](https://github.com/google-gemini/gemini-cli)를 실행할 수 있는 기능이 추가되었습니다.
- [Windows Terminal](https://github.com/microsoft/terminal)을 통해 [PowerShell](https://microsoft.com/powershell), [Git Bash](https://git-scm.com/docs), [CMD](https://learn.microsoft.com/windows-server/administration/windows-commands/windows-commands) 등 다양한 쉘 환경을 지원합니다.

### 0.0.1

- 상태표시줄의 버튼을 통해 Gemini CLI 터미널을 실행할 수 있는 기능이 추가되었습니다.
