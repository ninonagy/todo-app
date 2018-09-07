# How to run
To start, you need to have localhost set up (I prefer MAMP). Add files to your host directory and configure 'global.php' depending on your connection parameters.

```
$HOST = "localhost";
$USER = "root";
$PASSWORD = "root";
$PORT = 3306;
```

We need to create database by navigating to 'localhost/init_database.php' in browser to run php script. You should see this message: 

```
Database 'database' created successfully.
```

And this is it, now you are ready to start using Todo App.
