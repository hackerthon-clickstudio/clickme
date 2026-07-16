"""declarative Base와 공통 mixin(id, created_at 등). 모든 ORM 모델이 상속한다."""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """모든 ORM 모델의 공통 Base."""


class TimestampMixin:
    """created_at / updated_at 공통 컬럼 mixin."""

    ...
