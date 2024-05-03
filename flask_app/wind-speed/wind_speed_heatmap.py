import numpy as np
import matplotlib.pyplot as plt
import xarray as xr
from mpl_toolkits.basemap import Basemap

# Global Flag that determines whether wind direction is displayed
wind_direction_displayed = False

def main(wind_direction_displayed):

    # Dataset downloaded from https://cds.climate.copernicus.eu/#!/home
    # Wind velocity data for all avaialble coordinates on the 1st April, 2023
    data = xr.open_dataset('python/wind-speed/ERA5-mean-world.nc')

    lat = data.latitude
    # data.longitude seems to be between 0 and 360, converting to -180 to 180 
    lon = data.longitude - 180 

    # x vector of wind
    wind_x = data.u10
    # y vector of wind
    wind_y = data.v10

    # Calculates wind speed, not wind velocity (no longer vector)
    wind_speed = np.sqrt(wind_x**2 + wind_y**2)

    # Creates a global map with an Equidistant Cylindrical Projection with intermediate resolution
    m = Basemap(projection='cyl', llcrnrlon=-180, llcrnrlat=-90, urcrnrlon=180, urcrnrlat=90, resolution='i')

    # This is done to get a grid on map, perhaps not necessary
    parallels = np.arange(-90,90.25,20)
    m.drawparallels(parallels, labels=[True,False,False,False], linewidth=0.3)
    meridians = np.arange(-180,180.25,60)
    m.drawmeridians(meridians, labels=[False,False,False,True], linewidth=0.3)

    # Draws coast and country borders
    m.drawcoastlines(1)
    m.drawcountries()

    # Draws contour lines and fills appropriate colour to produce heatmap
    # TODO wind_speed[5,:,:] does not simply equate to 15:00, the implicit average needs further investigation
    cf = plt.contourf(lon,lat,wind_speed[5,:,:], cmap='jet', alpha=0.7)

    # TODO Potential implementation for wind direction, needs finetuning
    if (wind_direction_displayed):
        add_wind_direction(lon, lat, wind_x, wind_y)

    # Details to make the graph look appropriate
    cb = plt.colorbar(cf, fraction=0.024, pad=0.03 )
    cb.set_label('m/s',  fontsize=12)

    plt.show()


def add_wind_direction(lon, lat, wind_x, wind_y):
    sparsity = 12 # Sparsity for the arrows that represent wind direction
    plt.quiver(
        lon[::sparsity],
        lat[::sparsity],
        wind_x[0,::sparsity,::sparsity],
        wind_y[0,::sparsity,::sparsity],
        scale_units='xy',
        scale=2,
        width=0.001)


if __name__ == '__main__':
    main(wind_direction_displayed)