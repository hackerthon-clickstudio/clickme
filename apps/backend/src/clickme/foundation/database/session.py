"""DB 엔진·세션 생성의 유일한 곳. 다른 곳에서 엔진을 만들지 않는다."""


def create_session_factory() -> object:
    """설정 기반으로 엔진을 만들고 세션 팩토리를 반환한다."""
    raise NotImplementedError
