# Gemini CLI Launcher

이 확장 프로그램은 Visual Studio Code에서 Gemini CLI를 편리하게 실행할 수 있도록 도와줍니다.

## 동기

[gemini-cli](https://github.com/google-gemini/gemini-cli/issues/7289) 이슈가 해결되지 않아서 자제 제작

## 기능

- **명령**: 상태표시줄의 `Gemini CLI` 버튼으로 `gemini -m gemini-2.5-flash --yolo` 실행
- **옵션 설명**:
  - (pro 모델 대신) flash 모델 사용
  - (수동 승인 대신) 자동 승인

## 요구 사항

- [Gemini CLI](https://github.com/google-gemini/gemini-cli) 설치
- [git](https://git-scm.com/downloads) 설치
- `git`의 익숙한 사용(자동 승인이므로 변경된 코드 확인 필요)

## 알려진 문제

- `gemini` 실행시 매번 발생하는 이 에러는 무시해도 상관 없으나, 방지를 하고자 한다면 [Gemini CLI Companion](https://marketplace.visualstudio.com/items?itemName=Google.gemini-cli-vscode-ide-companion) 설치
  - `[ERROR] [IDEClient] Failed to connect to IDE companion extension for VS Code. Please ensure the extension is running. To install the extension, run /ide install.`

## 릴리스 노트

### 0.0.1

- 초기 릴리스: Gemini CLI 실행 기능 및 상태 표시줄 아이템 추가.
