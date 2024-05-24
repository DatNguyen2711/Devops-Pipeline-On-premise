#/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P DatLaid234555@Xy -Q "CREATE DATABASE [Project_prn231] ON (FILENAME = '/dbconfig/mydb.mdf'),(FILENAME = '/dbconfig/mydb_log.ldf') FOR ATTACH"
#!/bin/bash

echo "Starting SQL Server..."
/opt/mssql/bin/sqlservr &

# Wait for SQL Server to start up
# sleep 40

echo "Attaching database..."
if /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P DatLaid234555@Xy -i /dbconfig/init.sql; then
    echo "Database attached successfully."
else
    echo "Failed to attach database."
fi

# Keep the container running
wait
