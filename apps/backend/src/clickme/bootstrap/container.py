"""의존성 조립. 각 모듈 유스케이스에 인프라 구현체를 주입하는 유일한 곳."""


def build_container() -> None:
    """설정을 읽어 리포지토리·외부 연동 구현체를 만들고 유스케이스에 연결한다."""
    raise NotImplementedError
