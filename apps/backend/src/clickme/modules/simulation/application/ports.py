"""simulation application 층이 의존하는 포트(프로토콜) 정의."""

from typing import Protocol


class SimulationRepository(Protocol):
    """Simulation 저장소 포트. domain 객체를 반환한다."""

    ...
