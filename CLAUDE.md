# 클릭미 (ClickMe)

AI 기반 광고 캠페인 도구. 광고 소재 생성(creative) → 성과 예측(simulation) → 캠페인 집행/최적화(campaign).

- 백엔드: Python 3.12, FastAPI, SQLAlchemy, Alembic, PostgreSQL
- 프론트: Next.js (App Router), TypeScript, 모바일 우선
- 채팅/에이전트(orchestration, conversation, knowledge)는 **아직 없음**. 나중에 추가 예정이므로 지금 만들지 말 것.

## 폴더 구조

```
clickme/
├─ apps/
│  ├─ web/
│  │  ├─ .env.example
│  │  ├─ package.json
│  │  ├─ next.config.ts
│  │  ├─ tsconfig.json
│  │  ├─ src/
│  │  │  ├─ app/                        # 라우팅과 화면 조립만. 로직 금지
│  │  │  │  ├─ layout.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ campaigns/[campaignId]/page.tsx
│  │  │  │  ├─ creatives/[creativeId]/page.tsx
│  │  │  │  └─ simulations/[simulationId]/page.tsx
│  │  │  ├─ modules/                    # 기능별. 백엔드 모듈과 1:1
│  │  │  │  ├─ campaign/{api,components,hooks,types}/
│  │  │  │  ├─ creative/{api,components,hooks,types}/
│  │  │  │  └─ simulation/{api,components,hooks,types}/
│  │  │  └─ shared/
│  │  │     ├─ api/client.ts
│  │  │     ├─ api/generated/           # OpenAPI 자동 생성. 직접 수정 금지
│  │  │     ├─ ui/                      # Button, Dialog, BottomSheet 등
│  │  │     ├─ hooks/
│  │  │     └─ lib/
│  │  ├─ public/
│  │  └─ tests/{unit,e2e}/
│  │
│  └─ backend/
│     ├─ .env.example
│     ├─ pyproject.toml
│     ├─ alembic.ini
│     ├─ migrations/{env.py,script.py.mako,versions/}
│     ├─ src/clickme/
│     │  ├─ entrypoints/
│     │  │  ├─ api/main.py              # FastAPI 앱 생성 + 실행만
│     │  │  └─ worker/main.py           # 스케줄러 실행만
│     │  ├─ bootstrap/
│     │  │  ├─ container.py             # 의존성 조립
│     │  │  ├─ routers.py               # 각 모듈 router 등록만
│     │  │  └─ jobs.py                  # 각 모듈 job 등록만
│     │  ├─ interfaces/http/            # HTTP 공통만. 개별 라우터 금지
│     │  │  ├─ dependencies.py
│     │  │  ├─ middleware.py
│     │  │  ├─ exception_handlers.py
│     │  │  └─ health/router.py
│     │  ├─ modules/
│     │  │  ├─ creative/                # 광고 문구·이미지 생성
│     │  │  │  ├─ public.py
│     │  │  │  ├─ api/{router.py,schemas.py}
│     │  │  │  ├─ application/
│     │  │  │  │  ├─ generate_creative.py
│     │  │  │  │  ├─ get_creative.py
│     │  │  │  │  └─ ports.py           # ImageGenerator, CreativeRepository 프로토콜
│     │  │  │  ├─ domain/{creative.py,variant.py,policies.py}
│     │  │  │  └─ infrastructure/{models.py,repository.py,image_generator.py}
│     │  │  ├─ simulation/              # 광고 성과 예측
│     │  │  │  ├─ public.py
│     │  │  │  ├─ api/{router.py,schemas.py}
│     │  │  │  ├─ application/
│     │  │  │  │  ├─ run_simulation.py
│     │  │  │  │  ├─ get_simulation.py
│     │  │  │  │  └─ ports.py
│     │  │  │  ├─ domain/{simulation.py,audience.py,score.py}
│     │  │  │  └─ infrastructure/{models.py,repository.py}
│     │  │  └─ campaign/                # 생성·승인·집행·성과·최적화
│     │  │     ├─ public.py
│     │  │     ├─ api/{router.py,schemas.py}
│     │  │     ├─ application/
│     │  │     │  ├─ create_campaign.py
│     │  │     │  ├─ approve_campaign.py
│     │  │     │  ├─ launch_campaign.py
│     │  │     │  ├─ get_campaign.py
│     │  │     │  ├─ get_performance.py
│     │  │     │  └─ ports.py           # AdPlatform, CampaignRepository 프로토콜
│     │  │     ├─ domain/{campaign.py,budget.py,performance.py}
│     │  │     ├─ jobs/scan_active_campaigns.py
│     │  │     └─ infrastructure/{models.py,repository.py,meta_ads.py}
│     │  ├─ foundation/                 # 기술 구현 공용부. 비즈니스 규칙 금지
│     │  │  ├─ settings.py
│     │  │  ├─ auth/cognito.py
│     │  │  ├─ database/
│     │  │  │  ├─ base.py               # declarative Base + 공통 mixin(id, created_at 등). 모든 ORM 모델이 상속
│     │  │  │  ├─ session.py            # 엔진·세션 생성의 유일한 곳
│     │  │  │  ├─ transaction.py
│     │  │  │  └─ repository.py         # 공통 CRUD를 담은 BaseRepository. 모듈 repository가 상속
│     │  │  ├─ llm/
│     │  │  │  ├─ client.py             # 모든 LLM 호출의 단일 진입점 (재시도·타임아웃·로깅)
│     │  │  │  ├─ openai.py
│     │  │  │  └─ anthropic.py
│     │  │  └─ storage/s3.py
│     │  │  # ※ 나중에 채팅 추가 시 langgraph 관련 공통 구현도 foundation/agent/에 둔다
│     │  └─ shared/kernel/              # 어디에도 종속되지 않는 최소 타입
│     │     ├─ ids.py
│     │     └─ clock.py
│     └─ tests/
│        ├─ architecture/
│        │  ├─ test_module_boundaries.py
│        │  ├─ test_public_api_only.py
│        │  └─ test_sdk_imports.py      # 외부 SDK 직접 import가 foundation 밖에 있으면 실패
│        ├─ unit/{creative,simulation,campaign}/
│        ├─ integration/
│        └─ e2e/
│
├─ contracts/openapi.yaml               # 프론트 타입 생성 원본
├─ infra/
│  ├─ docker/{Dockerfile.web,Dockerfile.api,Dockerfile.worker,compose.yml}
│  └─ nginx/
├─ scripts/{generate_api_client.ps1,migrate.ps1}
├─ docs/{architecture,decisions}/
├─ .github/workflows/ci.yml
├─ .gitignore
└─ README.md
```

## 아키텍처 규칙 (절대 어기지 말 것)

1. **모듈 간 참조는 `public.py`만.** `modules/campaign`이 creative를 쓰려면 `modules.creative.public`에서만 import한다. 다른 모듈의 application/domain/infrastructure 직접 import 금지.
2. **domain은 순수 Python.** domain/ 안에서는 FastAPI, SQLAlchemy, foundation, 외부 라이브러리 import 금지. 표준 라이브러리와 shared/kernel만 허용.
3. **application은 ports(프로토콜)에 의존, infrastructure가 구현.** application에서 infrastructure 직접 import 금지.
4. **라우터는 각 모듈의 `api/router.py`에만.** `interfaces/http/`에는 공통(미들웨어, 예외 처리, health)만 둔다. 라우터 등록은 `bootstrap/routers.py`에서.
5. **`foundation/`에는 비즈니스 규칙 금지.** DB 세션, LLM 클라이언트, S3 등 기술 구현만.
6. **`shared/api/generated/`(프론트)는 자동 생성 파일.** 손으로 수정하지 않는다. `contracts/openapi.yaml` 수정 → 스크립트로 재생성.
7. 새 유스케이스는 `application/` 바로 밑에 파일 하나. commands/queries 폴더로 쪼개지 않는다.
8. 이벤트 버스, Result 타입 등 미사용 추상화를 미리 만들지 않는다 (YAGNI).
9. **외부 기술 SDK의 직접 import는 `foundation/` 안에서만.** `sqlalchemy`의 엔진/세션 생성, `openai`, `anthropic`, `langgraph`, `boto3` 등을 모듈 코드에서 직접 import 금지. 모듈의 infrastructure는 foundation의 래퍼(client, session, BaseRepository)를 통해서만 접근한다. → 기술 교체·설정 변경 시 수정 지점이 foundation 한 곳이 된다.
10. **DB 공통은 한곳에.** 모든 ORM 모델은 `foundation/database/base.py`의 Base와 mixin을 상속한다. 모델 파일 자체는 각 모듈의 `infrastructure/models.py`에 두되(도메인 데이터는 모듈 소유), Alembic이 인식하도록 `migrations/env.py` 한 곳에서 전부 import한다.
11. **LLM 호출 공통은 `foundation/llm/client.py` 하나로.** 프롬프트 내용은 각 모듈이 소유하지만, API 호출·재시도·타임아웃·토큰 로깅은 client.py를 거친다. 모듈마다 LLM 호출 코드를 복붙하지 않는다.
12. **`public.py`에는 유스케이스 함수와 다른 모듈이 필요로 하는 최소 읽기 DTO만 export한다.** repository, ORM 모델, 인프라 구현체 export 금지 — public.py에 re-export하는 순간 모듈 경계가 뚫린다.
13. **Repository는 domain 객체를 반환한다.** ORM 모델(SQLAlchemy)을 application 층 밖으로 반환 금지. ORM ↔ domain 매핑은 각 모듈의 infrastructure/repository.py 책임.
14. **하나의 유스케이스 = 하나의 트랜잭션.** 트랜잭션 경계는 application 유스케이스가 `foundation/database/transaction.py`로 연다. repository는 절대 commit하지 않는다.
15. **도메인 객체는 생성 시점에 유효해야 한다.** 불변식이 있는 엔티티는 검증하는 팩토리 메서드로 생성한다. 불변식 없는 단순 값 객체까지 팩토리를 강제하지는 않는다(YAGNI).
16. **ID는 `shared/kernel/ids.py`로 코드에서 생성한다.** DB autoincrement 금지 — 저장 전에 도메인 객체가 식별자를 가질 수 있어야 한다.
17. **현재 시각은 `shared/kernel/clock.py` 경유.** `datetime.now()` 직접 호출 금지 — 테스트에서 시간을 고정할 수 있어야 한다.

## 새 기능 추가 순서

기능 하나를 추가할 때 아래 순서를 따른다. 층을 건너뛰지 않는다.

1. **Domain** — 엔티티·값 객체·정책 (`domain/`)
2. **Application** — 유스케이스 파일 + 필요한 ports 정의 (`application/`)
3. **Infrastructure** — repository·외부 연동 구현. `models.py` 변경 시 **Alembic 마이그레이션 생성**
4. **API** — `api/router.py` + `api/schemas.py`
5. **public.py** — 다른 모듈이 이 기능을 쓸 때만 export 추가
6. **bootstrap 등록** — `bootstrap/routers.py`(라우터)·`bootstrap/jobs.py`(잡)·`bootstrap/container.py`(의존성)
7. **테스트** — 아키텍처 테스트 + 단위 테스트 통과 확인
8. **OpenAPI 계약 갱신** — `contracts/openapi.yaml` 반영 → 스크립트로 프론트 클라이언트 재생성
9. **Front 구현** — `modules/<모듈>/` 아래 api·components·hooks·types

## 컨벤션

- Python: 파일/함수 snake_case, 클래스 PascalCase. 타입 힌트 필수. ports는 `typing.Protocol` 사용.
- Python 포맷·린트는 Ruff (line-length 100, double quotes). 백엔드 `.py` 수정 후 커밋 전에 `cd apps/backend && uv run ruff format . && uv run ruff check . --fix` 실행. CI가 동일하게 검증하므로 로컬 선통과 필수.
- TypeScript: 컴포넌트 PascalCase, 그 외 camelCase. ESLint로 검증.
- 시크릿은 `.env`(Git 제외)에만. 코드에 하드코딩 금지. `.env.example`에는 변수 이름만.
- DB 스키마 변경은 반드시 Alembic 마이그레이션으로.
- 커밋 전 아키텍처 테스트(`tests/architecture/`) 통과 필수. 실행: `cd apps/backend && uv run pytest tests/architecture -v`.
- 커밋 메시지는 `타입: 한국어 설명` — `add`(새 기능/파일) · `edit`(수정/리팩토링) · `fix`(버그) · `delete`(삭제). 예: `add: 시뮬레이션 기능 추가`. 한 논리 단위 = 한 커밋, 무관한 변경 섞지 않기.

## 깡통 파일 규칙

스켈레톤 단계의 모든 파일은 다음 형식을 지킨다:

- Python: 모듈 docstring으로 "이 파일의 책임" 1~2줄 + 빈 클래스/함수 시그니처에 `raise NotImplementedError` 또는 `...`
- TypeScript/TSX: 상단 주석으로 책임 1~2줄 + 최소 export (컴포넌트는 placeholder div 반환)
- 완전히 빈 파일 금지. 책임 설명이 없는 깡통은 나중에 AI도 사람도 못 알아본다.
