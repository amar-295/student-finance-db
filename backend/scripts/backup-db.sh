#!/bin/bash

# Configuration
DB_NAME="student_finance_db"
DB_USER="postgres"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/$DB_NAME-$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Run backup
echo "📦 Backing up database $DB_NAME..."
PGPASSWORD=$DB_PASSWORD pg_dump -U $DB_USER -h localhost $DB_NAME > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE
echo "✅ Backup completed: $BACKUP_FILE.gz"

# Cleanup old backups (keep last 7 days)
echo "🧹 Cleaning up old backups..."
find $BACKUP_DIR -name "$DB_NAME-*.sql.gz" -mtime +7 -delete

echo "✨ Done!"
