# AI-Test CI/CD 자동 배포 가이드

## 📋 개요

이 프로젝트는 GitHub에 소스코드를 업로드하면 자동으로 Kintone 서버에 배포되는 CI/CD 파이프라인입니다.

```
개발자 로컬 개발 → GitHub Push → GitHub Actions 자동 실행 → Kintone 배포
```

---

## 🚀 빠른 시작

### 1단계: 개발자가 소스코드 개발

로컬에서 소스코드를 수정합니다.

```bash
# 예시: test.js 파일 수정
echo "console.log('Hello World');" > test.js
```

### 2단계: 변경사항 커밋 및 Push

```bash
cd /Users/soan/ai

# 변경사항 확인
git status

# 모든 파일 추가
git add .

# 커밋 메시지와 함께 커밋
git commit -m "새로운 기능 추가"

# GitHub에 Push
git push origin main
```

### 3단계: GitHub Actions 자동 실행

GitHub에 push하면 자동으로 다음이 실행됩니다:

1. ✅ 코드 테스트 (선택사항)
2. 📦 빌드 (필요시)
3. 🚀 Kintone 서버에 자동 배포

### 4단계: Kintone에서 결과 확인

배포 완료 후 Kintone 앱에서 다음을 확인할 수 있습니다:

- 📄 업로드된 파일
- 📊 동기화된 레코드 데이터
- 🔧 업데이트된 커스텀 스크립트

---

## 📁 프로젝트 구조

```
ai-test/
├── .github/
│   └── workflows/
│       └── deploy-to-kintone.yml    # CI/CD 파이프라인 설정
├── scripts/
│   └── deploy-to-kintone.js         # Kintone 배포 스크립트
├── src/
│   └── custom-script.js             # Kintone 커스텀 스크립트
├── data/
│   └── records.json                 # 레코드 데이터
├── files/
│   └── (업로드할 파일들)
├── test.js                          # 테스트 파일
└── README.md                        # 이 문서
```

---

## ⚙️ 배포 흐름도

```
┌─────────────────────────┐
│  개발자 로컬 환경        │
│  (VS Code 등)            │
│  - 코드 작성             │
│  - 테스트                │
└────────────┬────────────┘
             │
             ↓
    git add . && git commit -m "메시지"
             │
             ↓
         git push origin main
             │
             ↓
┌─────────────────────────┐
│  GitHub 저장소           │
│  (poshson/ai-test)       │
│  - 코드 저장             │
└────────────┬────────────┘
             │
             ↓ (자동 감지)
┌─────────────────────────┐
│  GitHub Actions          │
│  (CI/CD 파이프라인)      │
│  - 코드 검증             │
│  - 배포 스크립트 실행    │
└────────────┬────────────┘
             │
             ↓ (REST API 호출)
┌─────────────────────────┐
│  Kintone 서버            │
│  - 파일 업로드           │
│  - 레코드 동기화         │
│  - 스크립트 업데이트     │
└─────────────────────────┘
```

---

## 📝 개발자 작업 흐름

### 예시: 새로운 기능 추가

```bash
# 1. 로컬에서 파일 수정
vim src/custom-script.js

# 2. 변경사항 확인
git status

# 3. 모든 파일 추가
git add .

# 4. 커밋
git commit -m "새로운 기능: 사용자 검증 추가"

# 5. GitHub에 올리기
git push origin main

# 6. GitHub Actions 자동 실행 (약 1-2분)
# 7. Kintone 자동 배포 완료
```

### 주의사항

- ⚠️ `git push`를 하기 전에 반드시 `git add .`와 `git commit`을 해야 합니다.
- ⚠️ 커밋 메시지는 명확하게 작성해주세요. (예: "버그 수정", "기능 추가" 등)
- ⚠️ 개인 정보나 API 토큰은 절대 GitHub에 올리지 마세요.

---

## 🔑 필수 설정 (관리자용)

### GitHub Secrets 등록

GitHub 저장소 Settings > Secrets and variables > Actions에서 다음을 등록합니다:

| 항목 | 값 | 설명 |
|------|-----|------|
| `KINTONE_DOMAIN` | your-domain.cybozu.com | Kintone 도메인 |
| `KINTONE_API_TOKEN` | (API 토큰) | Kintone API 토큰 |
| `KINTONE_APP_ID` | (앱 ID) | Kintone 앱 ID |

### 설정 방법

1. GitHub 저장소로 이동
2. **Settings** 클릭
3. **Secrets and variables** → **Actions** 클릭
4. **New repository secret** 클릭
5. 위의 3가지 정보 등록

---

## 📊 배포 상태 확인

### GitHub Actions 로그 확인

1. GitHub 저장소로 이동
2. **Actions** 탭 클릭
3. 최신 워크플로우 실행 확인
4. 성공(✅) 또는 실패(❌) 상태 확인

### 배포 결과

- ✅ **성공**: Kintone에 정상 배포됨
- ❌ **실패**: 로그에서 오류 메시지 확인 후 수정

---

## 🔄 자동 배포 항목

### 1. 파일 업로드
- `files/` 디렉토리의 모든 파일 자동 업로드
- Kintone 앱의 파일 필드에 저장

### 2. 레코드 데이터 동기화
- `data/records.json`의 데이터 자동 동기화
- 기존 레코드 업데이트 또는 신규 레코드 생성

### 3. 커스텀 스크립트 업데이트
- `src/custom-script.js`의 스크립트 자동 업데이트
- Kintone 앱의 사용자 정의 스크립트에 반영

---

## ❓ 자주 묻는 질문 (FAQ)

### Q1: Push 후 Kintone에 반영되는데 얼마나 걸리나요?
**A:** 일반적으로 1-3분 정도 소요됩니다. GitHub Actions 실행 시간에 따라 다를 수 있습니다.

### Q2: 배포 실패 시 어떻게 해야 하나요?
**A:** GitHub Actions 로그를 확인하여 오류 메시지를 확인하세요. 일반적으로 API 토큰 문제나 앱 ID 오류입니다.

### Q3: 특정 파일만 배포하고 싶어요.
**A:** `.github/workflows/deploy-to-kintone.yml` 파일에서 배포 대상을 수정할 수 있습니다.

### Q4: 긴급으로 배포를 취소하고 싶어요.
**A:** GitHub Actions 탭에서 실행 중인 워크플로우를 취소할 수 있습니다.

---

## 📚 추가 리소스

- [GitHub Actions 공식 문서](https://docs.github.com/en/actions)
- [Kintone REST API 문서](https://developer.cybozu.io/hc/ko/articles/202166290)
- [Git 기본 명령어](https://git-scm.com/doc)

---

## 📞 문제 발생 시

1. GitHub Actions 로그 확인
2. Kintone API 인증 정보 확인
3. 네트워크 연결 상태 확인
4. 관리자에게 연락

---

**마지막 업데이트:** 2025년 12월 6일
