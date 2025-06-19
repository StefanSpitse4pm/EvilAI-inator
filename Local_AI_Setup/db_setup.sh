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

    # Link phpMyAdmin config to Apache and enable it
    sudo ln -s /etc/phpmyadmin/apache.conf /etc/apache2/conf-available/phpmyadmin.conf &> /dev/null
    sudo a2enconf phpmyadmin &> /dev/null
    sudo systemctl reload apache2

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
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(500) NOT NULL,
        description TEXT,
        profilePicture BLOB,
        phoneNumber VARCHAR(15)
    );
    CREATE TABLE IF NOT EXISTS Conversation (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT,
        FOREIGN KEY (userId) REFERENCES User(id),
        createdAt DATETIME,
        chatName VARCHAR(255)
    );
    CREATE TABLE IF NOT EXISTS Prompt (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conversationId INT,
        FOREIGN KEY (conversationId) REFERENCES Conversation(id),
        message TEXT,
        response TEXT
    );
    CREATE TABLE IF NOT EXISTS Note (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT,
        FOREIGN KEY (userId) REFERENCES User(id),
        title VARCHAR(255),
        note TEXT,
        createdAt DATETIME,
        lastUpdated DATETIME,
        color CHAR(7)
    );
    CREATE TABLE IF NOT EXISTS Agenda (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT,
        FOREIGN KEY (userId) REFERENCES User(id),
        title VARCHAR(255),
        startTime DATETIME,
        endTime DATETIME,
        color CHAR(7)
    );" &> /dev/null
    echo -ne "\r* WayfindrDB database creation complete.\n"
fi

# Final message
echo -ne "\r:: Installation Complete ::\n"
