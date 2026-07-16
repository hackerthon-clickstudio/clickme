"""HTTP 공통 미들웨어(요청 로깅, CORS 등) 설정."""

from fastapi import FastAPI


def setup_middleware(app: FastAPI) -> None:
    """공통 미들웨어를 앱에 등록한다."""
    raise NotImplementedError
