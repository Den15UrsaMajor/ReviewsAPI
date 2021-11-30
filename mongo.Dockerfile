FROM mongo:latest

RUN mkdir /seed/
COPY /reviewCSV/*.csv /seed/

COPY schema.sh /docker-entrypoint-initdb.d