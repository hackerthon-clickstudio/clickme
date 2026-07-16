"""유스케이스 단위 트랜잭션 경계. 하나의 유스케이스 = 하나의 트랜잭션."""


def transaction() -> object:
    """유스케이스가 여는 트랜잭션 컨텍스트를 반환한다. repository는 commit하지 않는다."""
    raise NotImplementedError
