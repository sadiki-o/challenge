### instructions

#### backend

open `challenge` folder and run :
```shell
python -m venv env.
```

next activate `env` : 
```shell
source env/bin/activate
```

next install requirements: 
```shell
pip install -r requirements.txt 
```

next :
```shell
cd backend
```
and run :
```shell
python manage.py makemigrations
python manage.py migrate
```

finally to run server run : 
```shell
python manage.py runserver
```

#### frontend

cd into folder: 
```shell
cd frontend
```

install deps :
```shell
yarn add   OR  npm install
```

start vite server:
```shell
yarn vite  OR  npm run dev
```


## frontend

built with React and MUI

### functionalities

- signup
- signin
- upload files
- download uploaded files
- load file into datagrid
- apply simple operations on numeric column (fill operation input and drag/drop into column ) \
*Note* if you drag/drop into datagrid header it wont work
- create panda syntax in custom transformation and apply it, save it, delete it \
*Note* for column names with spaces use "_" , example "Transaction ID" -> "Transaction_ID".

example custom operation to create new column from other columns: "A = Transaction_ID * 2" 

## backend

build with Django Rest and Django ORM, (couldn't configure SQLAlchemy since there aren't many ressource)

*Note* for the sake of the time the modifications you make are not saved and instead uses the same file stored in the backend every time you use a transformation, which means you get the same result since the file isn't updated each time you apply a transformation


test user:
`username`: `osama`
`password`: `password`

