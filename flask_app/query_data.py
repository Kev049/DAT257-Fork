from flask import Flask,jsonify,request,flash,redirect,url_for, render_template
from flask_cors import CORS
import pandas as pd
import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import os   

PROD_TEMPLATE = '<img src="country_prod/country_graph.png" alt="Country graph" position:absolute bottom=0 width="800" height="600">'
CON_TEMPLATE = '<img src="country_con/country_graph.png" alt="Country graph" position:absolute bottom=0 width="800" height="600">'

matplotlib.use('Agg')
import math as ma

app = Flask(__name__)
CORS(app)

@app.route("/<country>", methods=['GET'])
def query_data(country): # Returns a dataframe containing the country matching the input string and the data of that country.
                  # Will return an empty dataframe (but containing its columns) if the input does not match a country.
    #country = request.args.get('country',type=str)
    dataset = pd.read_csv('flask_app/clumped_data.csv')
    #values = dataset[dataset['Country'].str.contains(fr'{country}', case=False)].reset_index().to_json(orient='records')
    formatted = (dataset[dataset['Country'].str.match(fr'{country}', case=False)].reset_index()).dropna(axis=1, how='all').transpose()
    dropped = formatted.iloc[1: , :]
    html_table = dropped.to_html(classes='table')
    return html_table

@app.route("/chart/<country>", methods=['GET','POST'])
def get_plot(country):
    content = PROD_TEMPLATE
    content = content.replace('country_graph', country)
    if not(os.path.exists(f'sveltekit_app/static/country_prod/{country}.png')):
        dataset = pd.read_csv('flask_app/clumped_data.csv')
        energy_doc = (dataset[dataset['Country'].str.match(fr'{country}', case=False)])
        energy_doc = energy_doc.drop(['Code (alpha-3)', 'Country', 'Renewable energy production (%)'], axis=1).dropna(axis=1, how='all')
        labels = energy_doc.columns.tolist()
        values = energy_doc.to_numpy().flatten()
        if (values.any()):
            fig,ax = plt.subplots()
            ax.pie(values)
            fig.legend(labels=labels, loc='upper right', bbox_to_anchor=(0.1,1))
            fig.savefig(f'sveltekit_app/static/country_prod/{country}.png', bbox_inches='tight', pad_inches=0.8)
        else:
            content = '<! no value>'
    return content

@app.route("/consumption/<country>", methods=['GET','POST'])
def get_con(country):
    content = CON_TEMPLATE
    content = content.replace('country_graph', country)
    if not(os.path.exists(f'sveltekit_app/static/country_con/{country}.png')):
        dataset = pd.read_csv('flask_app/energyCon.csv')
        energy_doc = (dataset[dataset['Entity'].str.match(fr'{country}', case=False)])
        energy_doc = energy_doc.drop(['Code', 'Entity', 'Year'], axis=1).dropna(axis=1, how='all')
        labels = energy_doc.columns.tolist()
        values = energy_doc.to_numpy().flatten()
        if (values.any()):
            fig,ax = plt.subplots()
            ax.pie(values)
            fig.legend(labels=labels, loc='upper right', bbox_to_anchor=(0.1,1))
            fig.savefig(f'sveltekit_app/static/country_con/{country}.png', bbox_inches='tight', pad_inches=0.8)
        else:
            content = '<! no value>'
    return content

if __name__ == "__main__":
    #print(get_plot('Sweden'))
    app.run()