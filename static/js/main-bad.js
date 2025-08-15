async function loadPlotData(plotType) {
    // 1) Fetch the CSV
    const response = await fetch('/static/data/confidence_indices.csv');
    const csvData = await response.text();
  
    // 2) Split into rows, ignore empties, split by comma
    const rows = csvData
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0)
      .map(row => row.split(','));
  
    // 3) The first row is our header. For example:
    //    ["Date","1-Year Confidence,Corporate","1-Year Confidence,Individual", ...]
    // or
    //    ["Date","1-Year Confidence (Corporate)","1-Year Confidence (Individual)", ...]
    const header = rows[0];
  
    // Remove header from the data rows
    rows.shift();
  
    // 4) Create a data structure that holds arrays of {x, y} for each column
    //    Example: finalData["1-Year Confidence,Corporate"] = { x: [], y: [] }
    //    but we won't know all the column names until we parse the header,
    //    so let's build them dynamically.
    const finalData = {};
    for (let colIndex = 1; colIndex < header.length; colIndex++) {
      finalData[header[colIndex]] = { x: [], y: [] };
    }
  
    // 5) Fill our finalData with the raw data from each row
    rows.forEach(row => {
      const dateStr = row[0]; // e.g. "2001-01-01"
      for (let colIndex = 1; colIndex < header.length; colIndex++) {
        const colName = header[colIndex];
        const val = parseFloat(row[colIndex]);
        if (!isNaN(val)) {
          // push date/value
          finalData[colName].x.push(dateStr);
          finalData[colName].y.push(val);
        } else {
          // push a null or skip if you prefer
          finalData[colName].x.push(dateStr);
          finalData[colName].y.push(null);
        }
      }
    });
  
    // 6) Map each "plotType" to the relevant two columns
    //    IMPORTANT: these strings must match your actual header strings!
    const colMap = {
      'one-year': {
        corporate: '1-Year Confidence,Corporate',
        individual: '1-Year Confidence,Individual'
      },
      'crash': {
        corporate: 'Crash Confidence,Corporate',
        individual: 'Crash Confidence,Individual'
      },
      'buy-dips': {
        corporate: 'Buy-On-Dips Confidence,Corporate',
        individual: 'Buy-On-Dips Confidence,Individual'
      },
      'valuation': {
        corporate: 'Valuation Confidence,Corporate',
        individual: 'Valuation Confidence,Individual'
      }
    };
  
    // 7) Pick the correct column names for the requested index
    const columnsForThisPlot = colMap[plotType];
  
    // Extract the x,y arrays for Corporate vs. Individual
    const xCorporate = finalData[columnsForThisPlot.corporate].x;
    const yCorporate = finalData[columnsForThisPlot.corporate].y;
    const xIndividual = finalData[columnsForThisPlot.individual].x;
    const yIndividual = finalData[columnsForThisPlot.individual].y;
  
    // 8) (Optional) Build custom hover text or use default.  
    //    We'll do a quick converter for the date strings:
    function formatDate(dateStr) {
      // If your date is "YYYY-MM-DD", we can parse a bit:
      const dateObj = new Date(dateStr);
      // Just do a readable format, or leave as default
      return dateObj.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    }
    const hoverTextCorporate = xCorporate.map((d, i) => {
      const prettyDate = formatDate(d);
      return `${prettyDate}<br>Corporate: ${yCorporate[i]?.toFixed(1) ?? 'N/A'}`;
    });
    const hoverTextIndividual = xIndividual.map((d, i) => {
      const prettyDate = formatDate(d);
      return `${prettyDate}<br>Individual: ${yIndividual[i]?.toFixed(1) ?? 'N/A'}`;
    });
  
    // 9) Build Plotly traces
    const traceCorporate = {
      x: xCorporate,
      y: yCorporate,
      type: 'scatter',
      mode: 'lines',
      name: 'Corporate',
      line: { color: '#00356B', width: 2 },
      hoverinfo: 'text',
      text: hoverTextCorporate
    };
  
    const traceIndividual = {
      x: xIndividual,
      y: yIndividual,
      type: 'scatter',
      mode: 'lines',
      name: 'Individual',
      line: { color: '#FF6B6B', width: 2 },
      hoverinfo: 'text',
      text: hoverTextIndividual
    };
  
    // 10) Layout and config (same as before)
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
          bordercolor: '#cccccc'
        },
        type: 'date',
        range: ['2005-01-01', '2024-01-01'],
        showspikes: false
      },
      yaxis: {
        title: '',
        range: [40, 100], // Adjust to your typical data
        showgrid: true,
        gridcolor: '#E5E5E5',
        zeroline: false,
        fixedrange: false
      },
      font: { family: 'Open Sans, sans-serif', size: 12 },
      margin: { l: 50, r: 30, t: 100, b: 50, pad: 0 },
      showlegend: true,
      legend: {
        x: 0,
        y: 1.1,
        orientation: 'h',
        xanchor: 'left',
        font: { size: 12 }
      },
      plot_bgcolor: 'white',
      paper_bgcolor: 'white'
    };
  
    const config = {
      displayModeBar: true,
      displaylogo: false,
      responsive: true,
      modeBarButtonsToRemove: [
        'zoom2d','pan2d','select2d','lasso2d','zoomIn2d',
        'zoomOut2d','autoScale2d','resetScale2d','toggleSpikelines'
      ],
      toImageButtonOptions: {
        format: 'svg',
        filename: 'yale_confidence_index',
        height: 500,
        width: 700,
        scale: 1
      }
    };
  
    // 11) Render the new plot
    Plotly.newPlot('plot-container', [traceCorporate, traceIndividual], layout, config);
  }