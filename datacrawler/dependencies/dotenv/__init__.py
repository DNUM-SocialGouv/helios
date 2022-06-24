from dotenv import load_dotenv


def dot_env_config():
    load_dotenv(".env")
    load_dotenv(".env.local")
