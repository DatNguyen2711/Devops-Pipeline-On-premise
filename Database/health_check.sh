#!/bin/bash

if /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P DatLaid234555@Xy -Q "SELECT 1" > /dev/null 2>&1; then
  echo "health checked ok!"
  exit 0
else
  echo "health checked failed!"

  exit 1
fi
