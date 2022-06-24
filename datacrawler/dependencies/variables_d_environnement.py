from typing import TypedDict

from dotenv import dotenv_values


class VariablesDEnvironnement(TypedDict):
    SENTRY_DSN: str


def lis_les_variables_d_environnement() -> VariablesDEnvironnement:
    configuration = {
        **dotenv_values(),
        **dotenv_values(".env.local"),
    }
    return VariablesDEnvironnement(SENTRY_DSN=getattr(configuration, "SENTRY_DSN", ""))
