from flask import Flask,jsonify,request
from flask_cors import CORS
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route("/<country>", methods=['GET'])
def query_data(country): # Returns a dataframe containing the country matching the input string and the data of that country.
                  # Will return an empty dataframe (but containing its columns) if the input does not match a country.
    #country = request.args.get('country',type=str)
    dataset = pd.read_csv('python/power_data.csv')
    #values = dataset[dataset['Country'].str.contains(fr'{country}', case=False)].reset_index().to_json(orient='records')
    formatted = (dataset[dataset['Country'].str.contains(fr'{country}', case=False)].reset_index()).transpose()
    dropped = formatted.iloc[1: , :]
    html_table = dropped.to_html(classes='table')
    return html_table


if __name__ == "__main__":
    app.run()