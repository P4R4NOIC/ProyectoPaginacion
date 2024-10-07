#!/bin/bash

if command -v google-chrome &> /dev/null; then
    echo "Google Chrome is already installed."
else
 
    echo "Checking for wget..."
    if ! command -v wget &> /dev/null; then
        echo "wget not found, installing..."
        sudo dnf install -y wget
    else
        echo "wget is already installed."
    fi

    echo "Downloading Google Chrome..."
    wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm

    echo "Installing Google Chrome..."
    sudo dnf install -y ./google-chrome-stable_current_x86_64.rpm
   
    if [ $? -eq 0 ]; then
        echo "Google Chrome installed successfully."
    else
        echo "Installation failed."
        exit 1
    fi

    echo "Cleaning up..."
    rm -f google-chrome-stable_current_x86_64.rpm
fi

HTML_FILE="./index.html" 
echo "Opening $HTML_FILE in Google Chrome..."
google-chrome "$HTML_FILE"

echo "Done!"

