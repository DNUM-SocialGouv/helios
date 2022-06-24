from datacrawler.dependencies import initialise_les_dépendances
from sentry_sdk import capture_exception


def main():
    initialise_les_dépendances()
    try:
        raise SyntaxError
    except Exception as exception:
        print("capture sentry exception")
        capture_exception(exception)


if __name__ == "__main__":
    main()
