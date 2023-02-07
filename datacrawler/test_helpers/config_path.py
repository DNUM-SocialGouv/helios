import os

ROOT_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), "../.."))


def get_absolute_file_path(relative_file_path: str) -> str:
    return os.path.join(ROOT_DIR, relative_file_path)
