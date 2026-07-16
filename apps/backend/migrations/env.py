"""Alembic 마이그레이션 환경. 모든 모듈의 ORM 모델을 여기서 import해 인식시킨다."""

from clickme.foundation.database.base import Base
from clickme.modules.campaign.infrastructure import models as campaign_models  # noqa: F401
from clickme.modules.creative.infrastructure import models as creative_models  # noqa: F401
from clickme.modules.simulation.infrastructure import models as simulation_models  # noqa: F401

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """오프라인 모드로 마이그레이션을 실행한다."""
    raise NotImplementedError


def run_migrations_online() -> None:
    """온라인 모드로 마이그레이션을 실행한다."""
    raise NotImplementedError
