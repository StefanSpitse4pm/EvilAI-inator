#!/bin/bash

set -e

# Check for whiptail
if ! command -v whiptail &> /dev/null; then
    echo "Installing whiptail..."
    apt update && apt install -y whiptail
fi

# Define choices
CHOICE=$(whiptail --title "DeepSeek-R1 1.5B Installer" --menu "Choose a quantized version to install:" 20 80 10 \
"1" "F16 - No quantization (largest, highest quality)" \
"2" "Q8_0 - 8-bit quantization, very high quality" \
"3" "Q6_K - 6-bit quantization, high quality" \
"4" "Q5_1 - 5-bit, good quality/size balance" \
"5" "Q5_K_M - 5-bit, balance (K_M)" \
"6" "Q4_K_M - 4-bit, popular balance" \
"7" "Q4_1 - 4-bit, balanced" \
"8" "Q3_K_M - 3-bit, smaller" \
"9" "Q2_K - 2-bit, smallest, lowest quality" \
"0" "Cancel" \
3>&1 1>&2 2>&3)

exitstatus=$?
if [ $exitstatus != 0 ] || [ "$CHOICE" == "0" ]; then
    echo "Cancelled."
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
