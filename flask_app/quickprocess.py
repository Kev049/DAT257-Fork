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
            # start and end affect the size of the retrieved package, for fast execution keep them close
            irr_data = pvlib.iotools.get_pvgis_hourly(latitude, longitude, start=2010, end=2015, raddatabase=db)[0]
            result = (irr_data, name, latitude, longitude)
            break
        except Exception as e:
            result = None
    if result == None:
        failed.append(name)
        print(f"Failed to retrieve data for {name}")
    return result

def main():
    df = pd.DataFrame(columns=["name", "lat", "long", "irr_data"])

    # Change max_morkers to change nr of parallel requests
    with concurrent.futures.ThreadPoolExecutor(max_workers=40) as executor:

        results = executor.map(retrieve_irradiance_data, coordinates)

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
