import pandas as pd
import concurrent.futures
import pvlib

coordinates = []

latlongdf = pd.read_csv('latlong.csv', usecols=["Country","Latitude","Longitude"])

for index, row in latlongdf.iterrows():
    coordinates.append((row['Latitude'], row['Longitude'], row['Country']))

failed = []

# Function to retrieve irradiance data
def retrieve_irradiance_data(location):
    latitude, longitude, name = location
    print("Now Processing: " + name)
    dbs = ['PVGIS-SARAH', 'PVGIS-NSRDB', 'PVGIS-ERA5', 'PVGIS-CMSAF', 'PVGIS-COSMO', 'PVGIS-SARAH2']
    for db in dbs:
        try:
            irr_data = pvlib.iotools.get_pvgis_hourly(latitude, longitude, raddatabase=db)[0]
            result = (irr_data, name, latitude, longitude)
            break
        except Exception as e:
            result = None
    if result == None:
        failed.append(name)
        print(f"Failed to retrieve data for {name}")
    return result

# Main function to execute tasks
def main():
    irridiance = []
    df = pd.DataFrame(columns=["irr_data", "name", "lat", "long"])

    # Use ThreadPoolExecutor to limit the number of threads
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        # Use zip to iterate over coordinates and dbs simultaneously
        results = executor.map(retrieve_irradiance_data, coordinates)

        # Process the results as they become available
        for result in results:
            if result is not None:
                irr_data, name, latitude, longitude = result
                df.loc[len(df)] = [irr_data, name, latitude, longitude]
                irr_data.index.name = "utc_time"
                irridiance.append(irr_data['poa_direct'].mean())

    print("All tasks completed")
    print(failed)
    print("Amount failed: " + str(len(failed)))

# Execute main function
if __name__ == "__main__":
    main()
