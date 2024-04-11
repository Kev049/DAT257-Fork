import pandas as pd
import numpy as np

re_share = pd.read_csv("python/Renewable_energy_share.csv")
re_share = re_share[['Country','2021']]

country_codes = pd.read_csv('python/country_codes.csv')

full_merge = country_codes.merge(re_share, how='left', left_on='name', right_on='Country')
full_merge = full_merge[['name','alpha-3','2021']]
full_merge.columns = ['Country','Code (alpha-3)','Renewable energy production (%)']
full_merge.to_csv('resources/Renewable_data.csv', index=None)

print("Which country would you like information for?")
country = input()

RE_percent = float(full_merge.query('Country == @country').iloc[0, 2])

print(country + " produces " + str(RE_percent) + "% renewable energy")