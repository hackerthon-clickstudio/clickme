"""CampaignRepository 포트의 구현. ORM과 domain 객체 매핑을 책임진다."""

from clickme.foundation.database.repository import BaseRepository


class SqlCampaignRepository(BaseRepository):
    """Campaign 저장소 구현. domain 객체를 반환하고 commit하지 않는다."""

    ...
