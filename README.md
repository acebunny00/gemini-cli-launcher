# Gemini CLI Launcher

이 확장 프로그램은 Visual Studio Code에서 Gemini CLI를 편리하게 실행할 수 있도록 도와줍니다.

## 동기

[gemini-cli](https://github.com/google-gemini/gemini-cli/issues/7289)

## 기능

* **Gemini CLI 실행**: VS Code 내에서 터미널을 열고 미리 설정된 명령어로 Gemini CLI를 즉시 실행합니다.
* **상태 표시줄 아이템**: VS Code 상태 표시줄에 `Gemini CLI` 아이템을 추가하여 한 번의 클릭으로 Gemini CLI를 실행할 수 있습니다.
* **옵션**: `gemini --model gemini-2.5-flash --yolo
* **옵션 설명**: flash 모델 사용 / 자동 승인

## 사용 방법

1. Visual Studio Code를 엽니다.
2. 상태 표시줄의 `Gemini CLI` 아이템을 클릭하거나, 명령 팔레트(Ctrl+Shift+P)를 열고 `Gemini CLI`를 검색하여 실행합니다.
3. 새로운 터미널이 열리고 Gemini CLI가 자동으로 실행됩니다.

## 요구 사항

* 시스템에 Gemini CLI가 설치되어 있어야 합니다.

## 알려진 문제

현재 알려진 문제는 없습니다.

## 릴리스 노트

### 0.0.1

* 초기 릴리스: Gemini CLI 실행 기능 및 상태 표시줄 아이템 추가.
