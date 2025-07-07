# Drapt Backend Documentation

## Project Structure
###Backend Directory Root
This directory contains ```.env```, ```.gitignore```, ```alembic.ini``` and the development database ```drapt.db```. The environment file is used to store secret keys. If you are a contributor, it is intentionally left off of the .gitignore file so that you don't accidentally expose secret environment variables. If you wish to test it on your local machine, reproduce the .env file, and set a ```FASTAPIUSERS_SECRET_KEY``` variable.

###/app
This contains ```main.py``` and ```drapt.db```.

The ```main.py``` file is what ties all pieces together. It brings in the routes, database engine, FastAPI Users, initialises the async context manager, adds the CORS middleware, and also a funny ```/inspiration``` endpoint which generates an inspirational quote. 

The ```db.py``` file is what creates the database engine, manages the connection to the database, and creates the async session.

###/app/models
Models contains ORM models which are used to create database tables, as well as insert data into the database. More on that lies in the Database section, particularly the Models subsection.

SQLAlchemy handles the SQL for the most part, and the majority of code within the backend relies on SQLAlchemy ORM, rather than SQLAlchemy's Core functionality. There likely won't be a scenario requiring for manual SQL code.

###/app/routes
Routes contains the endpoints for the API. Each classification of endpoint, for instance auth, admin, and portfolio, belong in their own file. Typically, each file contains one base URL route, for instance ```/admin```. This is where most of the code from other folders and files is tied in, with the only exceptions being ```db.py``` and ```main.py```, which tie all of the files together.

###/app/config
Config contains a ```permissions.py``` file, which is simply a Python dictionary for easier, more modular backend permission (RBAC) checking. For now, it only contains role based permissions, and this is likely all that is required for now. It helps enfore the DRY (Don't Repeat Yourself) principle.

###/app/schemas
Schemas is where Pydantic schemas live. More on that section in the API Data Flows section, particularly the subsection Pydantic Validation.

###/app/users
Users is what enables FastAPI Users to function. It contains 3 utilised files: ```auth.py``` for generating the JWT strategy and transport method (in this case, HTTP-only cookies).

## API Data Flows

### Data Flow Diagram
![Data Flow Diagram](./Backend\ Documentation\ Images/dataflowdiagram.png)

### Pydantic Validation
Drapt's backend uses Pydantic for type validation. It makes it much easier to understand required parameters and write code efficiently. It should not be confused for database structure, that is what **ORM Models** are used for. Pydantic is used for validation/serialisation.

Pydantic schemas are defined in ```/app/schemas```, within .py files. To create a new schema (for example, UserCreate), you need to create a class which inherits from either Pydantic's ```BaseModel```, or one from another library. An example would be FastAPI Users schemas, which are predefined and follow FastAPI Users 'internal wiring'. An example of a custom schema which does not require a different libraries schema is ```UserReadResponseModel```, which is used to read a user and only return required items to the client, omitting FastAPI Users UserRead which returns things such as ```is_superuser``` and ```is_active```. These are not required in Drapt, thus not used where not required. Here is an example for ```UserReadResponseModel```:

```python
class UserReadResponseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    email: EmailStr
    fullname: str
    username: str
    role: str
    team: str
    portfolio_id: Optional[int] = None``
```

### ORM Model

The ORM model can be read about in the Database Section below this one, particularly the Models subsection.

## Database
### Models
Since the backend is running on FastAPI, it is natural to use SQLAlchemy's ORM and Core for database CRUD. Models are defined within ```/app/models/```, with each .py file representing a different table. 

To create a new table, simply create a new .py file, create a new class which inherits from ```app.db``` Base class, and define the table model there. It is recommended to use Pydantic or typing for features such as Optional, as it leads to less confusion with which values are required to create a new table Object.

An example of a model can be seen here, the ```portfolio.py``` model was used:

```python
class Portfolio(Base):
	__tablename__ = "portfolios"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    portfolio_string_id: Mapped[str] = mapped_column(String(length=50), unique=True, nullable=
    name: Mapped[str] = mapped_column(String(length=100), nullable=False, unique=True) 
    description: Mapped[Optional[str]] = mapped_column(String(length=255), nullable=True) 
    pm_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False) 
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now()) 
```

### Migrations
Drapt is using alembic to run DB migrations. Alembic will automatically pick up changes to defined models, meaning if you update a DB model do not use SQLAlchemy to update the DB, use Alembic instead.
To do so, use the following commands:

```
alembic revision --autogenerate -m "Message for the 'commit' of sorts"
alembic upgrade head
```

Before running upgrade head, you should check the `/versions` folder inside of the alembic directory. This will include the recent 'commit'. From there if all checks out, run the upgrade.

If you happen to accidentally use SQLAlchemy to run the migration, here's what you should do to log it in alembic:

```
alembic stamp head
```
