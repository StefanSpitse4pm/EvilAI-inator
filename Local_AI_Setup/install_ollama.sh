#!/bin/bash

set -e

# Check for whiptail
if ! command -v whiptail &> /dev/null; then
    echo "Installing whiptail..."
    sudo apt update && sudo apt install -y whiptail
fi

# Welcome message
if whiptail --title "Ollama Installer" --yesno "This will install Ollama. Proceed?" 10 60; then
    echo "Proceeding with creation..."
else
    echo "Cancelled by user."
    exit 0
fi

# Check if Ollama is already installed
if command -v ollama &> /dev/null; then
    VERSION=$(ollama --version)
    if ! whiptail --title "Ollama Detected" --yesno "Ollama is already installed (${VERSION}).\n\nDo you want to reinstall it?" 12 60; then
        whiptail --title "Installation Skipped" --msgbox "Ollama installation skipped." 10 60
    else
        INSTALL=true
    fi
else
    INSTALL=true
fi

# If needed, install Ollama
if [ "$INSTALL" = true ]; then
    whiptail --title "Installing dependencies" --infobox "Installing wget and ca-certificates..." 8 60
    sudo apt update
    sudo apt install -y wget ca-certificates

    TMP_SCRIPT="/tmp/ollama_install.sh"
    whiptail --title "Installing Ollama" --infobox "Downloading and installing Ollama..." 8 60
    wget -qO "$TMP_SCRIPT" https://ollama.com/install.sh
    chmod +x "$TMP_SCRIPT"
    bash "$TMP_SCRIPT"
    rm "$TMP_SCRIPT"

    whiptail --title "Success" --msgbox "Ollama has been installed successfully." 10 60
fi

# --- Model installation ---
if whiptail --title "Ollama Model Installer" --yesno "This will create or pull an Ollama model. Proceed?" 10 60; then
    echo "Proceeding with creation..."
else
    echo "Cancelled by user."
    exit 0
fi

# Select model
MODEL=$(whiptail --title "Ollama Model Installer" --menu "Select a model to install:" 20 80 10 \
"1" "DeepSeek R1 1.5B (quantized)" \
"2" "Phi-3 Mini (3.8B, ultra lightweight)" \
"3" "Mistral 7B (well-rounded, small)" \
"4" "Gemma 2B (Google, factual and light)" \
"0" "Cancel" \
3>&1 1>&2 2>&3)

if [ $? != 0 ] || [ "$MODEL" == "0" ]; then
    echo "Cancelled. User exited script."
    exit 0
fi

if [ "$MODEL" == "1" ]; then
    # Select quantization
    CHOICE=$(whiptail --title "DeepSeek-R1 Quantization" --menu "Choose a quantized version to install:" 20 80 10 \
    "1" "F16 - No quantization (Half precision, no quantization applied)" \
    "2" "Q8_0 - 8-bit quantization, highest quality, largest size" \
    "3" "Q6_K - 6-bit quantization, very high quality" \
    "4" "Q5_1 - 5-bit quantization, good balance of quality and size" \
    "5" "Q5_K_M - 5-bit, balance (K_M)" \
    "6" "Q4_K_M - 4-bit, popular balance" \
    "7" "Q4_1 - 4-bit, balanced" \
    "8" "Q3_K_M - 3-bit, smaller" \
    "9" "Q2_K - 2-bit, smallest, lowest quality" \
    "0" "Cancel" \
    3>&1 1>&2 2>&3)

    if [ $? != 0 ] || [ "$CHOICE" == "0" ]; then
        echo "Cancelled. User exited script."
        exit 0
    fi

    # Map choices to GGUF filenames
    case "$CHOICE" in
        1) FILE="DeepSeek-R1-Distill-Qwen-1.5B-F16.gguf" ;;
        2) FILE="DeepSeek-R1-Distill-Qwen-1.5B-Q8_0.gguf" ;;
        3) FILE="DeepSeek-R1-Distill-Qwen-1.5B-Q6_K.gguf" ;;
        4) FILE="DeepSeek-R1-Distill-Qwen-1.5B-Q5_1.gguf" ;;
        5) FILE="DeepSeek-R1-Distill-Qwen-1.5B-Q5_K_M.gguf" ;;
        6) FILE="DeepSeek-R1-Distill-Qwen-1.5B-Q4_K_M.gguf" ;;
        7) FILE="DeepSeek-R1-Distill-Qwen-1.5B-Q4_1.gguf" ;;
        8) FILE="DeepSeek-R1-Distill-Qwen-1.5B-Q3_K_M.gguf" ;;
        9) FILE="DeepSeek-R1-Distill-Qwen-1.5B-Q2_K.gguf" ;;
        *) echo "Unknown error"; exit 1 ;;
    esac

    MODEL_NAME="deepseek1_5b_${FILE/.gguf/}"
    HF_PATH="hdnh2006/DeepSeek-R1-Distill-Qwen-1.5B-GGUF"

    echo "Downloading $FILE from Hugging Face..."
    mkdir -p deepseek-ollama && cd deepseek-ollama
    wget --show-progress --progress=bar:force:noscroll \
        --trust-server-names --content-disposition --max-redirect=20 \
        "https://huggingface.co/$HF_PATH/resolve/main/$FILE" -O model.gguf

    echo "Creating Modelfile..."
    echo "FROM ./model.gguf" > Modelfile

    echo "Creating Ollama model: $MODEL_NAME"
    ollama create "$MODEL_NAME" -f Modelfile

    echo "Installation complete. You can now run:"
    echo "ollama run $MODEL_NAME"

else
    case "$MODEL" in
        2) OLLAMA_MODEL="phi3:mini" ;;
        3) OLLAMA_MODEL="mistral" ;;
        4) OLLAMA_MODEL="gemma:2b" ;;
        *) echo "Unknown selection"; exit 1 ;;
    esac

    echo "Pulling model: $OLLAMA_MODEL"
    ollama pull "$OLLAMA_MODEL"

    echo "Installation complete. You can now run:"
    echo "ollama run $OLLAMA_MODEL"
fi
