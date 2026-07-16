"""모든 LLM 호출의 단일 진입점. 재시도·타임아웃·토큰 로깅을 담당한다."""


class LLMClient:
    """프로바이더(openai/anthropic) 래퍼를 감싸 공통 정책을 적용한다."""

    ...
