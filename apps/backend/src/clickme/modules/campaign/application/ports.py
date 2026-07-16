"""campaign application 층이 의존하는 포트(프로토콜) 정의."""

from typing import Protocol


class AdPlatform(Protocol):
    """광고 플랫폼(Meta Ads 등) 연동 포트."""

    ...


class CampaignRepository(Protocol):
    """Campaign 저장소 포트. domain 객체를 반환한다."""

    ...
