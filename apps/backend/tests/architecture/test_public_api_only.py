"""public.py가 유스케이스 함수와 최소 읽기 DTO만 export하는지 검증하는 테스트."""


def test_public_exports_no_infrastructure() -> None:
    """public.py에서 repository·ORM 모델·인프라 구현체 export를 금지한다."""
    ...
