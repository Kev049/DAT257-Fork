import pandas as pd
import concurrent.futures
import pvlib

#coordinates = []

#latlongdf = pd.read_csv('src/python/latlong.csv', usecols=["Country","Latitude","Longitude"])

#for index, row in latlongdf.iterrows():
#    coordinates.append((row['Latitude'], row['Longitude'], row['Country']))

#failed = []

# Function to retrieve irradiance data
def retrieve_irradiance_data(location):
    latitude, longitude = location
    print("Now Processing: " + name)
    dbs = ['PVGIS-SARAH', 'PVGIS-NSRDB', 'PVGIS-ERA5', 'PVGIS-SARAH2']
    #for db in dbs:
    try:
        # start and end affect the size of the retrieved package, for fast execution keep them close
        irr_data = pvlib.iotools.get_pvgis_hourly(latitude, longitude, start=2010, end=2015)[0]
        result = (irr_data, latitude, longitude)
        return result
    except Exception as e:
        return None
    #if result == None:
        #failed.append(name)
        #print(f"Failed to retrieve data for {name}")

def create_coord_list():
    coords = []
    lat_start = 10
    lat_end = 20
    long_start = 10
    long_end = 20
    resolution = 1
    for lat in range(lat_start,lat_end,resolution):
        for long_ in range(long_start, long_end, resolution):
            coords.append(lat, long_)
    return coords

# Main function to execute tasks
def main():
    df = pd.DataFrame(columns=["name", "lat", "long", "irr_data"])

    coordinates = create_coord_list()

    # Change max_morkers to change nr of parallel requests
    with concurrent.futures.ThreadPoolExecutor(max_workers=40) as executor:
        # Use zip to iterate over coordinates and dbs simultaneously
        results = executor.map(retrieve_irradiance_data, coordinates)

        # Process the results as they become available
        for result in results:
            if result is not None:
                irr_data, name, latitude, longitude = result
                df.loc[len(df)] = [name, latitude, longitude, irr_data['poa_direct'].mean()]

    #print("All tasks completed")
    #print(failed)
    #print("Amount failed: " + str(len(failed)))

    df.to_csv("irr.csv")

# Execute main function
if __name__ == "__main__":
    main()
