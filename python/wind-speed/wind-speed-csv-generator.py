import xarray as xr
import numpy as np

def main():

    data = xr.open_dataset('python\wind-speed\ERA5-windspeed-monthly.nc')
    df = data.to_dataframe()
    df = df.reset_index()

    df = df.drop(df[(df.longitude % 5 != 0) | (df.latitude % 5 != 0)].index)
    df = df.reset_index(drop=True)

    df['wind_speed'] = np.sqrt(df['u10']**2 + df['v10']**2)
    df = df.drop(['time', 'u10', 'v10'], axis=1)
    df = df.groupby(['longitude', 'latitude']).mean().reset_index()

    #df.loc[(df['longitude'] == 0.0) & (df['latitude'] == 90.0)]
    df.to_csv('python\wind-speed\windspeed.csv', index=False)  
    
if __name__ == '__main__':
    main()