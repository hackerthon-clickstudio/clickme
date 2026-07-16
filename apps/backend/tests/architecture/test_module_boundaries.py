"""모듈 간 직접 import(다른 모듈의 application/domain/infrastructure)를 금지하는 테스트."""


def test_cross_module_imports_go_through_public_only() -> None:
    """다른 모듈 참조는 public.py 경유만 허용된다."""
    ...
