import pandas as pd
import numpy as np

stats = pd.read_csv('python\ELECSTAT-C_20240411-182012.csv')
stats = stats[['Country/area', 'Electricity statistics']]
stats.columns = ['Country', input("Give the type of energy: ") + " (GWh)"]

master_doc = pd.read_csv('output.csv')

final_df = master_doc.merge(stats, how='left', on='Country')
final_df.to_csv('output.csv',index=False)

