# LCAE_FE

LCAE는 기존 카풀링 어플의 온라인 멘토링 시스템을 구현한
React Native 기반 라이브 멘토링 앱 프론트엔드입니다.

## 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 백엔드 실행

프론트엔드는 `LCAE_BE` 백엔드가 실행 중이어야 합니다.

기본 API 주소는 `.env`에서 설정합니다.

```env
LCAE_USE_LOCAL_API=true
LCAE_LOCAL_API_BASE_URL=http://192.168.35.205:3000/api
LCAE_DUCKDNS_API_BASE_URL=https://lcae.duckdns.org:3000/api
```

`LCAE_USE_LOCAL_API=true`이면 로컬 서버를 먼저 사용하고,
`false`이면 DuckDNS 서버를 먼저 사용합니다. 값을 바꾼 뒤에는 Metro를
재시작하세요.

폰에서 아래 주소가 열리면 같은 네트워크에서 백엔드 접근이 가능한 상태입니다.

```txt
http://192.168.35.205:3000/socket.io/?EIO=4&transport=polling
```

### 3. Metro 실행

```bash
npm run start
```

Metro 캐시를 지우고 싶을 때:

```bash
npx react-native start --reset-cache
```

### 4. iOS 실행

실기기:

```bash
npm run ios
```

시뮬레이터:

```bash
npm run ios:sim
```

## 기능

### 라이브 방송 목록

- 백엔드의 진행 중인 방송 목록 조회
- 방송 제목, 멘토명, 시청자 수 표시
- 선택한 방송으로 멘티 스트리밍 화면 진입

### 멘토 방송

- 마이페이지의 `온라인 멘토링 시작하기`로 멘토 모드 진입
- 방송 제목 입력 후 Socket.IO `createBroadcast`로 방송 방 생성
- 마이크 송출 시작/중지
- mediasoup + `react-native-webrtc` 기반 오디오 송출
- 마이크 입력 레벨 기반 waveform 표시
- 실시간 채팅 수신
- 방송 종료 확인 모달
- 방송 종료 API 호출 후 홈 화면 이동

### 멘티 스트리밍

- 방송 입장 시 Socket.IO `joinBroadcast` 연결
- mediasoup consumer 생성 후 멘토 음성 청취
- 기존 producer 및 새 producer 이벤트 처리
- 방송 시간과 시청자 수 표시
- 방송 종료 이벤트 수신 시 종료 안내 모달 표시
- 종료 안내 확인 후 홈으로 이동

### 실시간 채팅

- Socket.IO `sendChat`, `receiveChat` 기반 채팅
- 멘토/멘티 양쪽에서 채팅 수신
- 멘티는 오디오 방 입장 완료 후 채팅 전송 가능

### 멘토 게시판

- 멘토 게시글 목록 조회
- 게시글 작성
- 게시글 수정/삭제 API 연동 준비
- 현재 게시글 본문은 `content` 중심으로 사용

## 개발 메모

- iOS 실기기에서 맥의 로컬 백엔드에 접근하려면 맥과 폰이 같은 네트워크에 있어야 합니다.
- 로컬 HTTP 개발 서버 접근을 위해 `ios/LACE_FE/Info.plist`에 ATS/local network 설정이 포함되어 있습니다.
- 현재 개발용 멘토/멘티 계정은 프론트에서 자동 로그인/생성하는 방식으로 연결되어 있습니다.
- 로컬/DuckDNS API 전환은 `.env`의 `LCAE_USE_LOCAL_API`로 설정합니다.
