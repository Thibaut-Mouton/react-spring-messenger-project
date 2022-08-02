#!/bin/sh

until mysql -u root -e '/* ping */ SELECT 1;'
do
  echo "MySQL server is unavailable - sleeping"
  sleep 2
done

echo "MySQL server is up and running"