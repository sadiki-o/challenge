## frontend

built with React and MUI

## backend

build with Django Rest and Django ORM, (couldn't configure SQLAlchemy since there aren't many ressource)


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


check the readme of the `frontend` and `backend`