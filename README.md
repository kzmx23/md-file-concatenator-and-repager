# MD File Concatenator and Repager

This tool helps manage large PDF to Markdown conversions where page numbering needs correction.

## Use Case

1.  **Large PDF Handling**: You have a single big PDF file (over 50 MB). You split it to severall files less then 50 MB
2.  **OCR Conversion**: You upload every single file to [https://docstrange.nanonets.com/](https://docstrange.nanonets.com/) to convert it to Markdown via OCR.
3.  **Page Numbering Issue**: Docstrange creates page numbers based on the actual page in the given PDF chunk, not the original document page number.
4.  **Fragmented Output**: After processing, you get several Markdown files with incorrect page numbers.
5.  **Solution**: Use `md_concat_js` to change page numbers and then concatenate them into a single Markdown file.

## Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/kzmx23/md-file-concatenator-and-repager.git
    cd md-file-concatenator-and-repager
    ```

2.  **Install dependencies**:

    **On Windows:**
    ```bash
    npm install
    ```

    **On Linux/WSL:**
    ```bash
    # First time setup - install Node.js via NVM
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    source ~/.bashrc
    nvm install --lts

    # Install dependencies
    npm install
    ```

## Usage

1.  **Start the application**:

    **On Windows:**
    ```bash
    npm run dev
    ```

    **On Linux/WSL:**
    ```bash
    ./dev-linux.sh
    ```

    Or manually:
    ```bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    npm run dev
    ```

2.  **Open in Browser**:
    Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

3.  **Use the Tool**:

    **Concatenator Tab:**
    - Drag and drop your Markdown files into the drop zone
    - Reorder files by dragging them up/down in the list
    - The file list is scrollable when you have many files
    - Action buttons ("Clear All" and "Concatenate Files") stay visible at the bottom
    - Click "Concatenate Files" to merge all files
    - Download the concatenated result

    **Re-pager Tab:**
    - Drop a single Markdown file to renumber its page markers
    - Enter the new starting page number
    - Click "Proceed Repage" to process
    - Download the repaged file

## Features

- **Scrollable File List**: Handle 50+ files with ease - the list scrolls while keeping buttons visible
- **Sticky Action Buttons**: Buttons always visible at the bottom, even with long file lists
- **Drag & Drop Reordering**: Easily reorder files to control concatenation sequence
- **Cross-Platform**: Works on both Windows and Linux/WSL
- **Real-time Progress**: Visual progress bar and detailed logging

## Screenshot

![GUI Screenshot](public/gui_screenshot.png)
