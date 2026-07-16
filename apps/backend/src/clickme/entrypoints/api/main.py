"""FastAPI 앱 생성과 실행만 담당한다. 라우터·의존성 조립은 bootstrap에 위임한다."""

from fastapi import FastAPI


def create_app() -> FastAPI:
    """bootstrap으로 라우터·의존성이 조립된 FastAPI 앱을 반환한다."""
    raise NotImplementedError
