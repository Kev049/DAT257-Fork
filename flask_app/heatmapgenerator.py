import pandas as pd
import concurrent.futures
import pvlib

def retrieve_irradiance_data(index_location):
    index, location = index_location
    latitude, longitude = location
    print(f"Now Processing Coordinate: {index} of {total_coordinates}")
    # No need to increment index here
    try:
        irr_data = pvlib.iotools.get_pvgis_hourly(latitude, longitude, start=2014, end=2015)[0]
        result = (irr_data, latitude, longitude)
        return result
    except Exception as e:
        return None

def create_coord_list():
    #coord at (vertical) 70 to -40 long (horizontal) 120 to -150
    coords = []
    lat_start = -40
    lat_end = 70
    long_start = -150
    long_end = 120
    resolution = 2
    for lat in range(lat_start,lat_end,resolution):
        for long_ in range(long_start, long_end, resolution):
            coords.append((lat, long_))
    return coords

def main():
    print("START")
    df = pd.DataFrame(columns=["lat", "long", "irr_data"])

    coordinates = create_coord_list()

    global total_coordinates
    total_coordinates = len(coordinates)

    # Map the index along with the coordinates
    indexed_coordinates = [(index, coord) for index, coord in enumerate(coordinates, start=1)]

    with concurrent.futures.ThreadPoolExecutor(max_workers=40) as executor:
        results = executor.map(retrieve_irradiance_data, indexed_coordinates)

        for result in results:
            if result is not None:
                irr_data, latitude, longitude = result
                df.loc[len(df)] = [latitude, longitude, irr_data['poa_direct'].mean()]

    print(str(df.memory_usage().sum() / (1024**2)) + " MB used")
    df.to_csv("src/python/heat.csv")
    print("DONE")

if __name__ == "__main__":
    main()
