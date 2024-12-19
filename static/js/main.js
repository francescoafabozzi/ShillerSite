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
    const titles = {
        'one-year': 'U.S. One-Year Confidence Index',
        'crash': 'U.S. Crash Confidence Index',
        'buy-dips': 'U.S. Buy-on-Dips Confidence Index',
        'valuation': 'U.S. Valuation Confidence Index'
    };
    document.getElementById('plot-title').textContent = titles[indexId];
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
    try {
        const response = await fetch(`/api/confidence-data/${plotType}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        
        // Extract dates and values
        const dates = data.map(d => d.Date);
        const individualValues = data.map(d => d['US Individual']);
        const institutionalValues = data.map(d => d['US Institutional']);

    const titles = {
        'one-year': 'U.S. One-Year Confidence Index',
        'crash': 'U.S. Crash Confidence Index',
        'buy-dips': 'U.S. Buy-on-Dips Confidence Index',
        'valuation': 'U.S. Valuation Confidence Index'
    };

    // Create two traces for individual and institutional data
    const traceIndividual = {
        x: dates,
        y: individualValues,
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
        y: institutionalValues,
        type: 'scatter',
        mode: 'lines',
        name: 'US Institutional',
        line: {
            color: '#00356B',
            width: 2
        }
    };

    const layout = {
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
            fixedrange: false,
            margin: {
                l: 70
            }
        },
        font: {
            family: 'Open Sans, sans-serif',
            size: 12
        },
        margin: {
            l: 80,
            r: 30,
            t: 100,
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