// Initialize collapsible sections
document.addEventListener('DOMContentLoaded', function() {
    const collapsibles = document.querySelectorAll('.collapsible-header');
    collapsibles.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Load initial plot
    loadPlotData('one-year');
});

// Handle tab switching
function switchTab(tabId) {
    // Update active tab
    document.querySelectorAll('.tab-button').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`tab-${tabId}`).classList.add('active');

    // Load corresponding plot
    loadPlotData(tabId);
}

// Load and create plot
async function loadPlotData(plotType) {
    const response = await fetch('/static/data/confidence_indices.csv');
    const csvData = await response.text();
    const rows = csvData.split('\n').map(row => row.split(','));
    
    const dates = rows.slice(1).map(row => row[0]);
    const values = rows.slice(1).map(row => {
        switch(plotType) {
            case 'one-year':
                return parseFloat(row[1]);
            case 'crash':
                return parseFloat(row[2]);
            case 'buy-dips':
                return parseFloat(row[3]);
            case 'valuation':
                return parseFloat(row[4]);
            default:
                return parseFloat(row[1]);
        }
    });

    const titles = {
        'one-year': 'U.S. One-Year Confidence Index',
        'crash': 'U.S. Crash Confidence Index',
        'buy-dips': 'U.S. Buy-on-Dips Confidence Index',
        'valuation': 'U.S. Valuation Confidence Index'
    };

    const trace = {
        x: dates,
        y: values,
        type: 'scatter',
        mode: 'lines+markers',
        line: {
            color: '#00356B',
            width: 2
        },
        marker: {
            color: '#00356B',
            size: 6
        }
    };

    const layout = {
        title: titles[plotType],
        xaxis: {
            title: 'Date',
            rangeslider: {}
        },
        yaxis: {
            title: 'Confidence Index Value'
        },
        font: {
            family: 'Open Sans, sans-serif'
        },
        margin: {
            l: 50,
            r: 50,
            t: 50,
            b: 50
        }
    };

    Plotly.newPlot('plot-container', [trace], layout, {responsive: true});
}

// Download CSV function
function downloadCSV() {
    const link = document.createElement('a');
    link.href = '/static/data/confidence_indices.csv';
    link.download = 'yale_confidence_indices.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
