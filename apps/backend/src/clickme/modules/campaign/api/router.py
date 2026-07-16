"""campaign HTTP 라우터. 요청 검증과 유스케이스 호출만 담당한다."""

from fastapi import APIRouter

router = APIRouter(prefix="/campaigns", tags=["campaign"])
