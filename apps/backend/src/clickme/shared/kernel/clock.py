"""현재 시각 제공. datetime.now() 직접 호출 대신 이 모듈을 경유한다."""

from datetime import datetime


def now() -> datetime:
    """현재 UTC 시각을 반환한다. 테스트에서 시간을 고정할 수 있어야 한다."""
    raise NotImplementedError
