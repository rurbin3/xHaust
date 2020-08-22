### xHaust

#### Amazingly fast HTTP brute forcer

## Setup

#### Database

You can skip this step if you don't want xHaust to remember used words in an attack

```bash
# Install postgresql
sudo apt-get install postgresql postgresql-contrib -y

# Login to the super user for postgres
sudo su postgres

# Create user for xHaust (in this example: user=xhaust, pass=xhaust, dbname=xhaust)
createuser --interactive --pwprompt

psql

postgres=# createdb -O xhaust xhaust
postgres=# GRANT ALL ON DATABASE xhaust TO xhaust;
postgres=# exit
exit

# Start the postgres service
sudo service postgresql start
```
