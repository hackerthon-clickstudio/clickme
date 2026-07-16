"""도메인·애플리케이션 예외를 HTTP 응답으로 변환하는 공통 핸들러."""

from fastapi import FastAPI


def setup_exception_handlers(app: FastAPI) -> None:
    """공통 예외 핸들러를 앱에 등록한다."""
    raise NotImplementedError
