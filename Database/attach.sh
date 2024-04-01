#/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P DatLaid234555@Xy -Q "CREATE DATABASE [Project_prn231] ON (FILENAME = '/dbconfig/mydb.mdf'),(FILENAME = '/dbconfig/mydb_log.ldf') FOR ATTACH"
sleep 10 && /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P DatLaid234555@Xy -i /dbconfig/init.sql
