"""creative application 층이 의존하는 포트(프로토콜) 정의."""

from typing import Protocol


class ImageGenerator(Protocol):
    """광고 이미지 생성기 포트."""

    ...


class CreativeRepository(Protocol):
    """Creative 저장소 포트. domain 객체를 반환한다."""

    ...
