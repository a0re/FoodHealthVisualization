# COS30045 Assignment 2

## Non-Medical Determinants of Health in OECD Countries

This project visualizes health and lifestyle data for OECD countries from 1995 to 2020, exploring relationships between alcohol consumption, food consumption patterns, and life expectancy.

## Setup Instructions

### Prerequisites
- Python 3 (for running a local web server)
- A modern web browser (Chrome, Firefox, Edge, etc.)

### Running the Project

Due to browser CORS security restrictions, you cannot simply open the HTML files directly. You must run a local web server.

#### Method 1: Using Python (Recommended)

1. Open a terminal/command prompt
2. Navigate to the Website directory:
   ```bash
    ```

3. Start the Python HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
   Or on Windows:
   ```bash
   python -m http.server 8000
   ```
4. Open your browser and navigate to:
   - Main page: http://localhost:8000/index.html
   - Choropleth: http://localhost:8000/choloropleth.html
   - Bar Chart: http://localhost:8000/barchart.html
   - Line Chart: http://localhost:8000/linechart.html
   - Radar Chart: http://localhost:8000/radarchart.html

5. To stop the server, press `Ctrl+C` in the terminal

#### Method 2: Using Node.js

If you have Node.js installed:
```bash
npx http-server -p 8000
```

#### Method 3: Using PHP

If you have PHP installed:
```bash
php -S localhost:8000
```

## Project Structure


- `index.html` - Home page
- `choloropleth.html` - Life expectancy choropleth map
- `barchart.html` - Top 10 alcohol consumption bar chart
- `linechart.html` - Food consumption line chart
- `radarchart.html` - Food consumption radar chart
- `assets/` - Data files, JavaScript, and CSS
    - `*.csv` - Data files
    - `*.js` - D3.js visualization scripts
    - `*.json` - GeoJSON country data

## Technologies Used

- D3.js v7 - Data visualization library
- Tailwind CSS - Styling framework
- HTML5/CSS3/JavaScript

## Features

- Interactive choropleth map showing life expectancy trends
- Zoomable and pannable map interface
- Year slider to view historical data
- Tooltips for detailed information
- Animated bar chart transitions
- Multi-line chart with hover interactions
- Responsive radar chart visualization
