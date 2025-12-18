#!/bin/bash
# Dev server script for Linux/WSL
# This script loads NVM and runs the Vite dev server

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Load nvm

npm run dev
