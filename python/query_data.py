import pandas as pd
import numpy as np

def query_data(country: str): # Returns a dataframe containing the country matching the input string and the data of that country.
    values = []               # Will return an empty dataframe (but containing its columns) if the input does not match a country.
    dataset = pd.read_csv('python\power_data.csv')
    values = dataset.query('Country == @country')
    return values

if __name__ == "__main__":
    print(query_data(input("Write your country here: ")))