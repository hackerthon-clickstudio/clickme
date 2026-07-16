"""각 모듈의 api/router.py를 FastAPI 앱에 등록만 한다."""

from fastapi import FastAPI


def register_routers(app: FastAPI) -> None:
    """모든 모듈 라우터와 health 라우터를 앱에 등록한다."""
    raise NotImplementedError
