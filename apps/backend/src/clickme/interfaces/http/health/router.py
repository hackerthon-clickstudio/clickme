"""헬스체크 엔드포인트. 서비스 생존 여부만 반환한다."""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict[str, str]:
    """서비스 생존 여부를 반환한다."""
    raise NotImplementedError
