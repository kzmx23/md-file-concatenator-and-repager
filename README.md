# MD File Concatenator and Repager

This tool helps manage large PDF to Markdown conversions where page numbering needs correction.

## Use Case

1.  **Large PDF Handling**: You have a single big PDF file (over 50 MB).
2.  **OCR Conversion**: You upload the file to [https://docstrange.nanonets.com/](https://docstrange.nanonets.com/) to convert it to Markdown via OCR.
3.  **Page Numbering Issue**: Docstrange creates page numbers based on the actual page in the given PDF chunk, not the original document page number.
4.  **Fragmented Output**: After processing, you get several Markdown files with incorrect page numbers.
5.  **Solution**: Use `md_concat_js` to change page numbers and then concatenate them into a single Markdown file.
