import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import math as ma

energy_doc = pd.read_csv('python\power_data.csv')
energy_doc['Onshore wind energy (GWh)'] = energy_doc['Onshore wind energy (GWh)'].apply(lambda value: float(0.0) if ma.isnan(value) else float(value))
energy_doc['Offshore wind energy (GWh)'] = energy_doc['Offshore wind energy (GWh)'].apply(lambda value: float(0.0) if ma.isnan(value) else float(value))
energy_doc['Wind energy (GWh)'] = energy_doc['Onshore wind energy (GWh)'] + energy_doc['Offshore wind energy (GWh)']
energy_doc = energy_doc.drop(['Onshore wind energy (GWh)', 'Offshore wind energy (GWh)'], axis=1)

energy_doc['Solar Photovoltaic (GWh)'] = energy_doc['Solar Photovoltaic (GWh)'].apply(lambda value: float(0.0) if ma.isnan(value) else float(value))
energy_doc['Solar Thermal (GWh)'] = energy_doc['Solar Thermal (GWh)'].apply(lambda value: float(0.0) if ma.isnan(value) else float(value))
energy_doc['Solar Energy (GWh)'] = energy_doc['Solar Photovoltaic (GWh)'] + energy_doc['Solar Thermal (GWh)']
energy_doc = energy_doc.drop(['Solar Photovoltaic (GWh)', 'Solar Thermal (GWh)'], axis=1)

energy_doc['Solid biofuels (GWh)'] = energy_doc['Solid biofuels (GWh)'].apply(lambda value: float(0.0) if ma.isnan(value) else float(value))
energy_doc['Liquid biofuels (GWh)'] = energy_doc['Liquid biofuels (GWh)'].apply(lambda value: float(0.0) if ma.isnan(value) else float(value))
energy_doc['Biogas (GWh)'] = energy_doc['Biogas (GWh)'].apply(lambda value: float(0.0) if ma.isnan(value) else float(value))
energy_doc['Biofuels (GWh)'] = energy_doc['Solid biofuels (GWh)'] + energy_doc['Liquid biofuels (GWh)'] + energy_doc['Biogas (GWh)']
energy_doc = energy_doc.drop(['Solid biofuels (GWh)', 'Liquid biofuels (GWh)', 'Biogas (GWh)'], axis=1)

energy_doc['Renewable hydropower (GWh)'] = energy_doc['Renewable hydropower (GWh)'].apply(lambda value: float(0.0) if ma.isnan(value) else float(value))
energy_doc['Mixed hydro plants (GWh)'] = energy_doc['Mixed hydro plants (GWh)'].apply(lambda value: float(0.0) if ma.isnan(value) else float(value))
energy_doc['Marine energy (GWh)'] = energy_doc['Marine energy (GWh)'].apply(lambda value: float(0.0) if ma.isnan(value) else float(value))
energy_doc['Pumped storage (GWh)'] = energy_doc['Pumped storage (GWh)'].apply(lambda value: float(0.0) if ma.isnan(value) else float(value))
energy_doc['Renewable hydropower (GWh)'] = energy_doc['Pumped storage (GWh)'] + energy_doc['Renewable hydropower (GWh)'] + energy_doc['Mixed hydro plants (GWh)'] + energy_doc['Marine energy (GWh)']
energy_doc = energy_doc.drop(['Pumped storage (GWh)', 'Mixed hydro plants (GWh)', 'Marine energy (GWh)'], axis=1)

energy_doc['Coal and peat (GWh)'] = energy_doc['Coal and peat (GWh)'].apply(lambda value: float(0.0) if ma.isnan(value) else float(value))
energy_doc['Oil (GWh)'] = energy_doc['Oil (GWh)'].apply(lambda value: float(0.0) if ma.isnan(value) else float(value))
energy_doc['Fossil fuels unspecified (GWh)'] = energy_doc['Fossil fuels unspecified (GWh)'].apply(lambda value: float(0.0) if ma.isnan(value) else float(value))
energy_doc['Fossil fuels and peat (GWh)'] = energy_doc['Coal and peat (GWh)'] + energy_doc['Oil (GWh)'] + energy_doc['Fossil fuels unspecified (GWh)']
energy_doc = energy_doc.drop(['Coal and peat (GWh)', 'Oil (GWh)', 'Fossil fuels unspecified (GWh)'], axis=1)


# energy_doc = energy_doc[energy_doc['Country'] == 'Poland']
# energy_doc = energy_doc.drop(['Code (alpha-3)', 'Country', 'Renewable energy production (%)'], axis=1)

#plot = energy_doc.T.plot(kind='pie', subplots=True, labels=None, ylabel='')

# plt.pie(energy_doc.T.iloc[:,0])
# plt.legend(labels= energy_doc.columns, loc='upper left', bbox_to_anchor=(0.8,1))
# plt.show()

energy_doc.to_csv('clumped_data.csv', index=False)