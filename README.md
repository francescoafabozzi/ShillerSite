# Yale Confidence Indices - Static Site

This is a static version of the Yale Confidence Indices website that can be deployed to GitHub Pages.

## Features

- Interactive charts displaying four different confidence indices using Plotly.js
- Responsive design with Bootstrap
- Download functionality for Excel files and PDFs
- Collapsible information sections
- No server-side processing required

## Deployment to GitHub Pages

**Super Simple - Just 2 Steps:**

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Convert to static site"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Select **"Deploy from a branch"**
   - Choose **main** branch
   - Click **Save**

That's it! Your site will be live at `https://[username].github.io/[repository-name]`

## Local Testing

To test the site locally before deploying:

1. **Simple HTTP Server (Python 3):**
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser

2. **Node.js HTTP Server:**
   ```bash
   npx http-server
   ```

3. **VS Code Live Server Extension:**
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

## File Structure

```
├── index.html              # Main HTML file (GitHub Pages entry point)
├── static/
│   ├── css/
│   │   └── style.css      # Custom styles
│   ├── js/
│   │   └── main.js        # JavaScript functionality
│   ├── data/              # Data files (CSV, Excel, PDF)
│   └── images/            # Images including Yale logo
└── README.md              # This file
```

## Important Notes

- **Data Files**: All data files are included in the `static/data/` directory
- **External Dependencies**: The site uses CDN links for Bootstrap, Plotly.js, and SheetJS
- **No Backend Required**: All functionality works client-side
- **File Downloads**: Excel and PDF downloads work directly from the static files

## Customization

- **Styling**: Modify `static/css/style.css` to change the appearance
- **Data**: Replace files in `static/data/` with updated data
- **Charts**: Modify `static/js/main.js` to change chart behavior
- **Content**: Edit `index.html` to update text and structure

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Responsive design works on mobile and desktop

## License

This project contains Yale University content. Please refer to the Terms of Use section on the website for proper attribution and usage guidelines.
