# Drapt Backend Documentation

## Project Structure

### Backend Directory Root

This directory contains `.env`, `.gitignore`, `alembic.ini` and the development database `drapt.db`. The environment file is used to store secret keys. If you are a contributor, it is intentionally left off of the .gitignore file so that you don't accidentally expose secret environment variables. If you wish to test it on your local machine, reproduce the .env file, and set a `FASTAPIUSERS_SECRET_KEY` variable.

### /app

This contains `main.py` and `drapt.db`.

The `main.py` file is what ties all pieces together. It brings in the routes, database engine, FastAPI Users, initialises the async context manager, adds the CORS middleware, and also a funny `/inspiration` endpoint which generates an inspirational quote.

The `db.py` file is what creates the database engine, manages the connection to the database, and creates the async session.

### /app/models

Models contains ORM models which are used to create database tables, as well as insert data into the database. More on that lies in the Database section, particularly the Models subsection.

SQLAlchemy handles the SQL for the most part, and the majority of code within the backend relies on SQLAlchemy ORM, rather than SQLAlchemy's Core functionality. There likely won't be a scenario requiring for manual SQL code.

### /app/routes

Routes contains the endpoints for the API. Each classification of endpoint, for instance auth, admin, and portfolio, belong in their own file. Typically, each file contains one base URL route, for instance `/admin`. This is where most of the code from other folders and files is tied in, with the only exceptions being `db.py` and `main.py`, which tie all of the files together.

### /app/config

Config contains a `permissions.py` file, which is simply a Python dictionary for easier, more modular backend permission (RBAC) checking. For now, it only contains role based permissions, and this is likely all that is required for now. It helps enfore the DRY (Don't Repeat Yourself) principle.

### /app/schemas

Schemas is where Pydantic schemas live. More on that section in the API Data Flows section, particularly the subsection Pydantic Validation.

### /app/users

Users is what enables FastAPI Users to function. It contains 3 utilised files: `auth.py` for generating the JWT strategy and transport method (in this case, HTTP-only cookies).

### /app/services

This is where the actual business logic lives. If you’re wondering where the magic happens after you hit an endpoint, it’s probably in here. Services are responsible for things like handling trades, managing positions, fetching market data, and anything else that’s not just a straight DB CRUD. If you’re adding new features, you’ll probably end up writing a service. Try to keep them modular—if you find yourself writing the same code twice, it’s probably time for a helper.

## API Data Flows

### Data Flow Diagram

![Data Flow Diagram](./Backend%20Documentation%20Images/dataflowdiagram.png)

### Pydantic Validation

Drapt's backend uses Pydantic for type validation. It makes it much easier to understand required parameters and write code efficiently. It should not be confused for database structure, that is what **ORM Models** are used for. Pydantic is used for validation/serialisation.

Pydantic schemas are defined in `/app/schemas`, within .py files. To create a new schema (for example, UserCreate), you need to create a class which inherits from either Pydantic's `BaseModel`, or one from another library. An example would be FastAPI Users schemas, which are predefined and follow FastAPI Users 'internal wiring'. An example of a custom schema which does not require a different libraries schema is `UserReadResponseModel`, which is used to read a user and only return required items to the client, omitting FastAPI Users UserRead which returns things such as `is_superuser` and `is_active`. These are not required in Drapt, thus not used where not required. Here is an example for `UserReadResponseModel`:

```python
class UserReadResponseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    fullname: str
    username: str
    role: str
    team: str
    portfolio_id: Optional[int] = None
```

### ORM Model

The ORM model can be read about in the _Database Section_ below this one, particularly the _Models_ subsection.

## Database

### Models

Since the backend is running on FastAPI, it is natural to use **SQLAlchemy's ORM and Core** for database CRUD. Models are defined within `/app/models/`, with each `.py` file representing a different table.

To create a new table, simply create a new `.py` file, create a new class which inherits from the `app.db` **Base** class, and define the table model there. It is _recommended_ to use Pydantic or typing for features such as `Optional`, as it leads to less confusion with which values are required to create a new table Object.

An example of a model can be seen here, the `portfolio.py` model was used:

```python
class Portfolio(Base):
    __tablename__ = "portfolios"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    portfolio_string_id: Mapped[str] = mapped_column(String(length=50), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(length=100), nullable=False, unique=True)
    description: Mapped[Optional[str]] = mapped_column(String(length=255), nullable=True)
    pm_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
```

### Migrations

Drapt is using **Alembic** to run DB migrations. Alembic will _automatically_ pick up changes to defined models, meaning if you update a DB model do not use SQLAlchemy to update the DB, use Alembic instead.
To do so, use the following commands:

```
alembic revision --autogenerate -m "Message for the 'commit' of sorts"
alembic upgrade head
```

Before running `upgrade head`, you should check the `/versions` folder inside of the alembic directory. This will include the recent 'commit'. From there if all checks out, run the upgrade.

If you happen to accidentally use SQLAlchemy to run the migration, here's what you should do to log it in alembic:

```
alembic stamp head
```

### PostgreSQL (psql)

This section serves as a _reference_ for working with the PostgreSQL database used in Drapt. It's helpful for contributors or _future you_ when setting things up or debugging locally.

The database is managed using **SQLAlchemy**, with configuration stored in the `.env` file at the project root:

```bash
POSTGRESQL_URL=postgresql+psycopg2://<user>:<password>@localhost:5432/<dbname>
```

#### Inspecting the DB with psql

If you’re using PostgreSQL locally (e.g., through Homebrew), start the service:

```bash
brew services start postgresql
```

Then, access the database CLI:

```bash
psql -U <your_user> -d <your_db>
```

Once inside psql, here are some _useful commands_.

**List of all tables:**

```sql
\dt
```

**Describe a table:**

```sql
\d <table>
```

**View contents of a table:**

```sql
SELECT * FROM <table> LIMIT 10;
```

**Exit the CLI:**

```sql
\q
```

## Logging

Logging is set up so you don’t have to guess what went wrong (or right). You’ll find log setup in `log.py`, split by domain (trade, portfolio, admin, etc.) so you’re not scrolling through a single monster log file. If you want to add a new logger, just call `setup_logger()` with a name and filename. Logs rotate after 1MB, so unless you’re running a _high-frequency trading bot_, you should be fine. If you’re debugging something weird, check the logs first—there’s a good chance the answer is in there.

## Market Data & External APIs

Market data is fetched using the **Tiingo API** (see `tiingo.py`). If you need to pull ticker info or metadata, this is where it happens. Results are cached in **Redis** so you’re not hammering the API every time someone refreshes the page. If you get weird results, check your API key and the cache before blaming the code. If you want to add another data source, just make a new service and keep it separate—_future you will thank you_.

## Redis Cache

This bit is primarily for _my own reference_, but it might be helpful if you are a contributor and want to replicate this on your own machine. Redis will be used as a lightweight cache for storing things such as ticker metadata, last closing price, those sorts of things. The Redis client file can be found in `/app/redis_client.py`.

To set up the Redis Client, you need to set a `REDIS_URL` in the `/drapt-api/.env` file.

To start the CLI, use the command:

```
brew services start redis
```

To access the Redis CLI (if running locally), use the command:

```
redis-cli
```

If it's on another port or host, use:

```
redis-cli -h <host> -p <port>
```

### CLI Commands

To see **all keys**, use the command:

```
keys *
```

Here is how you could get a **specific key**:

```
get ticker_metadata:AAPL
```

Where the key prefix (set in the backend for consistent lookups) is `ticker_metadata`, and the suffix is `AAPL` in this example.

To check **TTL (time to live)**, use the command:

```
ttl <key>
```

Deleting a key is just `del <key>`.

To flush the entire cache, use either: `FLUSHALL SYNC` or `FLUSHALL ASYNC`, depending on if you want to do it synchronously or asynchronously.

### Bonus commands

To _pretty-print_ a JSON string use:

```
redis-cli get <key> | jq .
```

This requires `jq` to be installed. If you don't have it already, on MacOS you can install it using:

```
brew install jq
```

## pytest

The backend tests are being done by the library **pytest**. It is _incredibly useful_ for making sure that things work as expected. Some example tests can be read in `/app/tests/`. For now (18th July 2025) there only exists one type of test (for positions) as I didn't realise that pytest was so useful before. I may write some unit tests later on. Anyways, to use it run this in your terminal from project root (on the same level as /app):

```bash
python -m pytest -s <directory-to-tests>
```

This runs all tests within that directory. _Note_: pytest only picks up on tests where the filename starts or ends with `test`. Example tests can again be found in the directory mentioned above.

There also exists a file `pretty_prints_for_testing_purposes.py` which you can import into your tests and display stuff with so you can also validate if tests are working. This just makes pytest a bit more readable and verifiable (well pytest verifies it, you as the tester just wanna make sure something's actually happening haha).

## Miscellaneous

-   If you see a random `/inspiration` endpoint, yes, it does exactly what you think.
-   If you're lost, start with `main.py` - it holds everything together.
-   If you're adding a new feature, keep things **DRY** (_Don't Repeat Yourself!_) and maintainable.
