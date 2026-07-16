"""스케줄러(잡 워커) 실행만 담당한다. 잡 등록은 bootstrap/jobs.py에 위임한다."""


def run_worker() -> None:
    """등록된 잡들을 스케줄러에 올리고 실행한다."""
    raise NotImplementedError
