#!/bin/bash

# Script untuk migrasi gambar lama dari public/uploads ke folder baru
# Dan update URL di database

echo "=== Migrasi Upload Images ==="
echo ""

# Check if old uploads folder exists
if [ ! -d "public/uploads" ]; then
    echo "✓ Tidak ada gambar lama di public/uploads/"
    exit 0
fi

# Check if there are any files
if [ -z "$(ls -A public/uploads)" ]; then
    echo "✓ Folder public/uploads kosong"
    exit 0
fi

# Determine target directory
if [ -n "$UPLOADS_DIR" ]; then
    TARGET_DIR="$UPLOADS_DIR"
else
    TARGET_DIR="./uploads"
fi

echo "Source: public/uploads/"
echo "Target: $TARGET_DIR"
echo ""

# Create target directory
mkdir -p "$TARGET_DIR"

# Copy files
echo "Copying files..."
cp -r public/uploads/* "$TARGET_DIR/"

# Count files
FILE_COUNT=$(ls -1 public/uploads | wc -l)
echo "✓ Copied $FILE_COUNT files"
echo ""

# Set permissions (if on Linux/Unix)
if [ "$(uname)" != "Darwin" ] && [ "$(uname)" != "MINGW"* ]; then
    chmod -R 755 "$TARGET_DIR"
    echo "✓ Set permissions to 755"
fi

echo ""
echo "=== Database Update (Manual Required) ==="
echo ""
echo "Jika URL gambar disimpan di database, jalankan query ini:"
echo ""
echo "-- PostgreSQL / MySQL:"
echo "UPDATE \"City\" SET \"imageUrl\" = REPLACE(\"imageUrl\", '/uploads/', '/api/images/') WHERE \"imageUrl\" LIKE '/uploads/%';"
echo "UPDATE \"CustomerReview\" SET \"imageUrl\" = REPLACE(\"imageUrl\", '/uploads/', '/api/images/') WHERE \"imageUrl\" LIKE '/uploads/%';"
echo ""
echo "-- Atau lewat Prisma Studio:"
echo "npm run prisma:studio"
echo ""
echo "✓ Migration completed!"
