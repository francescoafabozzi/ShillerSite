from flask import Flask, render_template, jsonify
import pandas as pd
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/confidence-data/<index_type>')
def get_confidence_data(index_type):
    try:
        # Read the specific sheet from Excel file
        sheet_name = index_type.replace('-', ' ').title()
        df = pd.read_excel('static/data/yale_confidence_indices.xlsx', sheet_name=sheet_name)
        
        # Convert dates to string format
        df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
        
        # Convert DataFrame to dictionary
        data = df.to_dict('records')
        return jsonify(data)
    except Exception as e:
        logging.error(f"Error reading Excel data: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
