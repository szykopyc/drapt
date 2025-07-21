from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from sqlalchemy.engine import URL
from alembic import context

from app.db import Base
from app.models.user import User
from app.models.portfolio import Portfolio
from app.models.trade import Trade
from app.models.position import Position

import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env from project root
env_path = Path(__file__).resolve().parents[1] / '.env'
load_dotenv(dotenv_path=env_path)

# Pull in DATABASE_URL from env
DATABASE_URL = os.getenv("POSTGRESQL_URL_FOR_MIGRATIONS")
assert DATABASE_URL, "POSTGRESQL_URL_FOR_MIGRATIONS not found in .env"

# Alembic Config object
config = context.config

# Override .ini setting with env var
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# Set up loggers
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Models for autogenerate
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode (no DB connection)."""
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode (actual DB connection)."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
