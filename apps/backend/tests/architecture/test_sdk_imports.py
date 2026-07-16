"""외부 SDK 직접 import가 foundation 밖에 있으면 실패하는 테스트."""


def test_external_sdk_imports_only_in_foundation() -> None:
    """openai·anthropic·boto3·sqlalchemy 등 직접 import는 foundation 안에서만 허용된다."""
    ...
