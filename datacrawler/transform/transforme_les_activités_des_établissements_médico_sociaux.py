from datacrawler.dependencies import initialise_les_dépendances
from sentry_sdk import capture_exception


def exécute():
    initialise_les_dépendances()

    try:
        raise SyntaxError("Test depuis python")
    except Exception as e:
        capture_exception(e)
        print("exception capturée par sentry")


if __name__ == "__main__":
    exécute()
