# Use the official MySQL image as the base image
FROM biarms/mysql
# Set environment variables for MySQL configuration
# Copy the schema.sql file into the container's /docker-entrypoint-initdb.d directory
# This directory is where MySQL will look for initialization scripts to run on container startup
COPY schema.sql /docker-entrypoint-initdb.d/

# Expose the default MySQL port
EXPOSE 3306

# Start MySQL server
CMD ["mysqld"]
