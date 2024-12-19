import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Generate dates from 1990 to 2024
start_date = datetime(1990, 1, 1)
end_date = datetime(2024, 1, 1)
dates = pd.date_range(start=start_date, end=end_date, freq='M')

# Create data for each index type
indices = ['one_year', 'crash', 'buy_dips', 'valuation']
excel_file = 'static/data/yale_confidence_indices.xlsx'

# Create Excel writer
with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
    for index in indices:
        # Generate base values with some randomness
        institutional = 72.5 + np.sin(np.arange(len(dates)) / 12 * np.pi) * 12.5
        institutional += np.random.normal(0, 2, len(dates))
        
        # Individual values slightly lower and more volatile
        individual = institutional * 0.95 + np.random.normal(0, 3, len(dates))
        
        # Create DataFrame
        df = pd.DataFrame({
            'Date': dates,
            'US Individual': individual,
            'US Institutional': institutional
        })
        
        # Write to Excel
        df.to_excel(writer, sheet_name=index.replace('_', ' ').title(), index=False)

print(f"Excel file created at: {excel_file}")
