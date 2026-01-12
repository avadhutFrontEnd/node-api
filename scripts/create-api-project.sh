#!/bin/bash

# Bash Script for Linux/Ubuntu
# Usage: ./create-api-project.sh
# Make executable: chmod +x create-api-project.sh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Prompt user for project name
echo -e "${CYAN}Enter project name (e.g., Day-1-E-Commerce-Product-Catalog):${NC}"
read -r PROJECT_NAME

# Validate input
if [ -z "$PROJECT_NAME" ]; then
    echo -e "${RED}Error: Project name cannot be empty!${NC}"
    exit 1
fi

# Create main project folder
echo -e "${CYAN}Creating project structure for: $PROJECT_NAME${NC}"

if [ -d "$PROJECT_NAME" ]; then
    echo -e "${YELLOW}Warning: Folder '$PROJECT_NAME' already exists!${NC}"
    echo -e "${YELLOW}Do you want to continue? (y/n)${NC}"
    read -r OVERWRITE
    if [ "$OVERWRITE" != "y" ]; then
        echo -e "${RED}Operation cancelled.${NC}"
        exit 0
    fi
fi

# Create main folder
mkdir -p "$PROJECT_NAME"

# Array of databases
DATABASES=("MySQL" "PostgreSQL" "MongoDB")

# Loop through each database
for DB in "${DATABASES[@]}"; do
    FOLDER_PATH="$PROJECT_NAME/$PROJECT_NAME-$DB"
    mkdir -p "$FOLDER_PATH"
    echo -e "${GREEN}✓ Created: $FOLDER_PATH${NC}"
    
    # Create src folder inside each database folder
    SRC_PATH="$FOLDER_PATH/src"
    mkdir -p "$SRC_PATH"
    echo -e "${GREEN}  ✓ Created: $SRC_PATH${NC}"
    
    # Create basic folder structure inside src
    mkdir -p "$SRC_PATH/"{config,controllers,models,routes,middleware}
    echo -e "${GREEN}  ✓ Created src subfolders (config, controllers, models, routes, middleware)${NC}"
    
    # Create .env.example
    cat > "$FOLDER_PATH/.env.example" << EOF
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=${PROJECT_NAME}_${DB}
JWT_SECRET=your_jwt_secret_key_here
EOF
    
    # Create basic server.js
    cat > "$FOLDER_PATH/server.js" << EOF
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to $PROJECT_NAME - $DB API' });
});

// Start server
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});
EOF
    
    # Create basic package.json
    PROJECT_NAME_LOWER=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]')
    DB_LOWER=$(echo "$DB" | tr '[:upper:]' '[:lower:]')
    
    cat > "$FOLDER_PATH/package.json" << EOF
{
  "name": "${PROJECT_NAME_LOWER}-${DB_LOWER}",
  "version": "1.0.0",
  "description": "$PROJECT_NAME REST API with $DB",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": ["express", "rest-api", "${DB_LOWER}"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
EOF
    
    echo -e "${GREEN}  ✓ Created configuration files (server.js, .env.example, package.json)${NC}"
done

echo -e "\n${CYAN}================================================${NC}"
echo -e "${GREEN}Project structure created successfully!${NC}"
echo -e "${CYAN}================================================${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "${NC}1. cd $PROJECT_NAME/$PROJECT_NAME-MySQL${NC}"
echo -e "${NC}2. npm install${NC}"
echo -e "${NC}3. cp .env.example .env && configure .env${NC}"
echo -e "${NC}4. Start coding!${NC}"
echo -e "\n${YELLOW}Repeat for PostgreSQL and MongoDB folders.${NC}"