FROM alpinelinux/mariadb

COPY schema.sql /docker-entrypoint-initdb.d/schema.sql
COPY config.cnf /etc/my.cnf.d/mariadb-server.cnf

EXPOSE 3306