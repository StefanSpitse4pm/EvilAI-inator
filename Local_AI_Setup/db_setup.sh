#!/bin/bash

# Check if whiptail is installed
if ! command -v whiptail &> /dev/null; then
    echo "whiptail is not installed. Installing it now..."
    apt-get update &> /dev/null && apt-get install -y whiptail &> /dev/null
fi

# Welcome message
whiptail --title "Installer" --msgbox "Welcome to the MySQL and phpMyAdmin Installer" 10 60

# Check installation status
MYSQL_INSTALLED=false
PHPMYADMIN_INSTALLED=false

if dpkg -l | grep -q mysql-server; then
    MYSQL_INSTALLED=true
fi

if dpkg -l | grep -q phpmyadmin; then
    PHPMYADMIN_INSTALLED=true
fi

# Build checklist options
OPTIONS=()
OPTIONS+=("mysql" "Install MySQL Server" ON)
OPTIONS+=("phpmyadmin" "Install phpMyAdmin" ON)
OPTIONS+=("wayfindrdb" "Install WayfindrDB" ON)

# Ask user what to install
CHOICE=$(whiptail --title "Select Software to Install" --checklist "Choose the components you want to install:" 15 60 4 "${OPTIONS[@]}" 3>&1 1>&2 2>&3)

exitstatus=$?
if [ $exitstatus != 0 ]; then
    echo "Installation cancelled."
    exit 1
fi

# Function to update progress bar
update_progress() {
    local progress=$1
    local total_steps=$2
    local current_step=$3
    local message=$4
    local percent=$((progress * 100 / total_steps))
    local remaining=$((total_steps - progress))
    local estimated_time=$((remaining * 5)) # Assuming each step takes ~5 seconds
    echo -ne "\r$message [$percent%] Estimated time remaining: $estimated_time seconds"
}

# Total steps for progress bar
total_steps=3
current_step=0

# Update package list
apt-get update &> /dev/null

# Install MySQL if selected
if [[ $CHOICE == *"mysql"* ]]; then
    current_step=$((current_step + 1))
    update_progress $current_step $total_steps $current_step "Installing MySQL Server"
    apt-get install -y mysql-server &> /dev/null
    echo -ne "\r* MySQL Server installation complete.\n"
fi

# Install phpMyAdmin if selected
if [[ $CHOICE == *"phpmyadmin"* ]]; then
    current_step=$((current_step + 1))
    update_progress $current_step $total_steps $current_step "Installing phpMyAdmin"
    DEBIAN_FRONTEND=noninteractive apt-get install -y phpmyadmin &> /dev/null
    echo -ne "\r* phpMyAdmin installation complete.\n"
fi

# Create WayfindrDB if selected
if [[ $CHOICE == *"wayfindrdb"* ]]; then
    current_step=$((current_step + 1))
    update_progress $current_step $total_steps $current_step "Creating WayfindrDB database"
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS WayfindrDB;" &> /dev/null
    mysql -u root -e "USE WayfindrDB;
    CREATE TABLE IF NOT EXISTS User (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS Conversation (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES User(id),
        start_time DATETIME,
        end_time DATETIME
    );
    CREATE TABLE IF NOT EXISTS Prompt (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conversation_id INT,
        FOREIGN KEY (conversation_id) REFERENCES Conversation(id),
        prompt_text TEXT,
        response_text TEXT
    );
    CREATE TABLE IF NOT EXISTS Note (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES User(id),
        note_text TEXT,
        created_at DATETIME
    );" &> /dev/null
    echo -ne "\r* WayfindrDB database creation complete.\n"
fi

# Final message
echo -ne "\r:: Installation Complete ::\n"
