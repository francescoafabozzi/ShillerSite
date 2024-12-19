// Initialize collapsible sections and calculation content
document.addEventListener('DOMContentLoaded', function() {
    const collapsibles = document.querySelectorAll('.collapsible-header');
    collapsibles.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isExpanded = content.style.display === 'block';
            content.style.display = isExpanded ? 'none' : 'block';
            this.style.borderBottom = isExpanded ? '1px solid #ddd' : 'none';
            this.querySelector('::after').textContent = isExpanded ? '+' : '-';
        });
    });

    // Load initial plot and calculation
    switchIndex('one-year');
});

// Handle index switching
function switchIndex(indexId) {
    loadPlotData(indexId);
    updateCalculationContent(indexId);
}

// Update calculation content based on selected index
function updateCalculationContent(indexId) {
    const questions = {
        'one-year': 'How much of a change in percentage terms do you expect in the following (use + before your number to indicate an increase)?',
        'crash': 'What do you think is the probability of a catastrophic stock market crash in the U.S., like that of October 28, 1929 or October 19, 1987, in the next six months?',
        'buy-dips': 'If the market drops 3% tomorrow, what would you expect it to do the day after tomorrow?',
        'valuation': 'Stock market valuations are generally...'
    };
    
    document.getElementById('calculation-content').innerHTML = `
        <p><strong>Question:</strong></p>
        <p>${questions[indexId]}</p>
        <p><strong>Calculation:</strong></p>
        <p>The index represents the weighted average of responses, normalized to a 0-100 scale.</p>
    `;
}

// Load and create plot
async function loadPlotData(plotType) {
    const response = await fetch('/static/data/confidence_indices.csv');
    const csvData = await response.text();
    // Parse CSV data, excluding header and empty rows
    const rows = csvData.split('\n')
        .filter(row => row.trim() !== '')
        .map(row => row.split(','));
    
    // Remove header row and create date array
    const header = rows.shift();
    let dates = [];
    let values = [];
    
    // Generate monthly dates from 1990 to 2024
    const startDate = new Date('1990-01-01');
    const endDate = new Date('2024-01-01');
    
    for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
        dates.push(d.toISOString().split('T')[0]);
        // Generate smooth values between 60 and 85
        const baseValue = 72.5 + Math.sin(d.getMonth() / 12 * Math.PI) * 12.5;
        values.push(baseValue + (Math.random() - 0.5) * 5);
    }

    const titles = {
        'one-year': 'U.S. One-Year Confidence Index',
        'crash': 'U.S. Crash Confidence Index',
        'buy-dips': 'U.S. Buy-on-Dips Confidence Index',
        'valuation': 'U.S. Valuation Confidence Index'
    };

    // Create two traces for individual and institutional data
    const traceIndividual = {
        x: dates,
        y: values.map(v => v * 0.95), // Simulated individual data
        type: 'scatter',
        mode: 'lines',
        name: 'US Individual',
        line: {
            color: '#FF6B6B',
            width: 2
        }
    };

    const traceInstitutional = {
        x: dates,
        y: values,
        type: 'scatter',
        mode: 'lines',
        name: 'US Institutional',
        line: {
            color: '#00356B',
            width: 2
        }
    };

    const layout = {
        title: {
            text: titles[plotType],
            y: 0.95,
            font: {
                size: 16,
                weight: 500
            },
            yanchor: 'bottom',
            pad: {
                b: 20
            }
        },
        height: 600,
        xaxis: {
            title: '',
            showgrid: true,
            gridcolor: '#E5E5E5',
            rangeslider: {
                visible: true,
                thickness: 0.03,
                bgcolor: '#E5E5E5',
                borderwidth: 1,
                bordercolor: '#cccccc',
                range: [dates[0], dates[dates.length - 1]],
                selectedattrs: {
                    bgcolor: '#ffffff'
                }
            },
            type: 'date',
            range: ['2005-01-01', '2024-01-01'],
            rangeselector: {
                visible: false
            },
            showspikes: false
        },
        yaxis: {
            title: '',
            range: [40, 100],
            showgrid: true,
            gridcolor: '#E5E5E5',
            zeroline: false,
            fixedrange: false
        },
        font: {
            family: 'Open Sans, sans-serif',
            size: 12
        },
        margin: {
            l: 50,
            r: 30,
            t: 80,
            b: 50,
            pad: 0
        },
        showlegend: true,
        legend: {
            x: 0,
            y: 1.1,
            orientation: 'h',
            xanchor: 'left',
            font: {
                size: 12
            }
        },
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        shapes: [],
        annotations: []
    };

    const config = {
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
        modeBarButtonsToRemove: [
            'zoom2d',
            'pan2d',
            'select2d',
            'lasso2d',
            'zoomIn2d',
            'zoomOut2d',
            'autoScale2d',
            'resetScale2d',
            'toggleSpikelines'
        ],
        toImageButtonOptions: {
            format: 'svg',
            filename: 'yale_confidence_index',
            height: 500,
            width: 700,
            scale: 1
        }
    };
    
    Plotly.newPlot('plot-container', [traceIndividual, traceInstitutional], layout, config);
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
