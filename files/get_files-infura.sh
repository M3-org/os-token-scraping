#!/bin/bash

# This script will download the URLs in columns 2 and 3 of sandboxAssets-infura.csv
# and save the output in folders named after what's in column 1

USER_AGENT="Mozilla/5.0 (X11; CrOS x86_64 15183.59.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.75 Safari/537.36"

# Ensure that the sandboxAssets.csv file is in the same directory as the script
if [ ! -f sandboxAssets-infura.csv ]; then
  echo "sandboxAssets-infura.csv not found in the current directory"
  exit 1
fi

# Read each line of the CSV file
while IFS=, read -r col1 col2 col3
do
  # Create a folder named after the value in column 1
  mkdir -p "$col1"

  # Download the URLs in columns 2 and 3
  #ipfs get "$col2" -o "$col1"
  #ipfs get "$col3" -o "$col1"
  wget -w 10 --random-wait -nc --user-agent="$USER_AGENT" --continue "$col2" -P "$col1"
  wget -w 10 --random-wait -nc --user-agent="$USER_AGENT" --continue "$col3" -P "$col1"
done < sandboxAssets.csv
