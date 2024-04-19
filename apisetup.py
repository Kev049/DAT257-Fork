import pvlib
import pandas as pd
import matplotlib.pyplot as plt

def main():
    #Coordinates should take lat/long/country name from latlong.csv
    #coordinates = [
    #    (32.2, -111.0, 'Tucson', 700),
    #    (35.1, -106.6, 'Albuquerque', 1500),
    #    (37.8, -122.4, 'San Francisco', 10),
    #    (52.5, 13.4, 'Berlin', 34),
    #    (57.7, 12.1, 'Gothenburg', 10),
    #    (59.43, 18.09, 'Taby', 10),
    #    (65.58, 22.15, 'Lulea', 10)
    #]
    
    coordinates = []

    latlongdf = pd.read_csv('latlong.csv', usecols=["Country","Latitude","Longitude"])

    for index, row in latlongdf.iterrows():
        coordinates.append((row['Latitude'], row['Longitude'], row['Country']))

    #print(latlongdf)
    #print(coordinates)
    
    #return
    
    sandia_modules = pvlib.pvsystem.retrieve_sam('SandiaMod')
    
    sapm_inverters = pvlib.pvsystem.retrieve_sam('cecinverter')
    
    module = sandia_modules['Canadian_Solar_CS5P_220M___2009_']
    
    inverter = sapm_inverters['ABB__MICRO_0_25_I_OUTD_US_208__208V_']
    
    temperature_model_parameters = pvlib.temperature.TEMPERATURE_MODEL_PARAMETERS['sapm']['open_rack_glass_glass']

    failed = []

    #tmys = [] ##OLD TMYS DATA
    #i = 0
    #for location in coordinates:
    #    latitude, longitude, name, altitude = location
    #    print(name)
    #    weather = pvlib.iotools.get_pvgis_tmy(latitude, longitude)[0]  #This line is the bottleneck
    #    weather.index.name = "utc_time"
    #    tmys.append(weather)
    #
    #    system = {'module': module, 'inverter': inverter,
    #          'surface_azimuth': 180}
    #    irradiance = pvlib.iotools.get_pvgis_hourly(latitude, longitude, start=2014, end=2015)[0]
    #    print(weather['dni'].mean())
    #    print('------------------------------------------yeet------------------')
    #    print(irradiance['poa_direct'].mean())
    #    return
    #    'PVGIS-SARAH', 'PVGIS-NSRDB', 'PVGIS-ERA5', 'PVGIS-CMSAF', 'PVGIS-COSMO', 'PVGIS-SARAH2'
    #    i += 1
    
    dbs = ['PVGIS-SARAH', 'PVGIS-NSRDB', 'PVGIS-ERA5', 'PVGIS-CMSAF', 'PVGIS-COSMO', 'PVGIS-SARAH2']
    irridiance = []
    i = 0
    df = pd.DataFrame(columns=["irr_data","name","lat","long"])
    for location in coordinates:
        latitude, longitude, name = location
        print(name)
        for db in dbs:
            try:
                irr_data = pvlib.iotools.get_pvgis_hourly(latitude, longitude, start = 2014, end = 2015, raddatabase=db)[0]  #This line is the bottleneck
                res = True
                df.loc[len(df)] = [irr_data, name, latitude, longitude]
                break
            except:
                res = False
        if not res:
            failed.append(name)
            print(name + " FAILED LASDLAMSDÖLMASKDAMSKLDMAKLSDMALKS")
        irr_data.index.name = "utc_time"
        irridiance.append(irr_data['poa_direct'].mean())
    
        system = {'module': module, 'inverter': inverter,
              'surface_azimuth': 180}
        #print(df)
        i += 1
    
    print(irridiance)
    df.to_csv()

    
    energies = {}

    print(failed)
    print(str(len(failed)))
    
    return
    for location, weather in zip(coordinates, tmys):
        latitude, longitude, name, altitude = location
        system['surface_tilt'] = latitude
        solpos = pvlib.solarposition.get_solarposition(
            time=weather.index,
            latitude=latitude,
            longitude=longitude,
            altitude=altitude,
            temperature=weather["temp_air"],
            pressure=pvlib.atmosphere.alt2pres(altitude),
        )
        dni_extra = pvlib.irradiance.get_extra_radiation(weather.index)
        airmass = pvlib.atmosphere.get_relative_airmass(solpos['apparent_zenith'])
        pressure = pvlib.atmosphere.alt2pres(altitude)
        am_abs = pvlib.atmosphere.get_absolute_airmass(airmass, pressure)
        aoi = pvlib.irradiance.aoi(
            system['surface_tilt'],
            system['surface_azimuth'],
            solpos["apparent_zenith"],
            solpos["azimuth"],
        )
        total_irradiance = pvlib.irradiance.get_total_irradiance(
            system['surface_tilt'],
            system['surface_azimuth'],
            solpos['apparent_zenith'],
            solpos['azimuth'],
            weather['dni'],
            weather['ghi'],
            weather['dhi'],
            dni_extra=dni_extra,
            model='haydavies',
        )
        cell_temperature = pvlib.temperature.sapm_cell(
            total_irradiance['poa_global'],
            weather["temp_air"],
            weather["wind_speed"],
            **temperature_model_parameters,
        )
        effective_irradiance = pvlib.pvsystem.sapm_effective_irradiance(
            total_irradiance['poa_direct'],
            total_irradiance['poa_diffuse'],
            am_abs,
            aoi,
            module,
        )
        dc = pvlib.pvsystem.sapm(effective_irradiance, cell_temperature, module)
        ac = pvlib.inverter.sandia(dc['v_mp'], dc['p_mp'], inverter)
        annual_energy = ac.sum()
        energies[name] = annual_energy
    
    
    #energies = pd.Series(energies)
    
    # based on the parameters specified above, these are in W*hrs
    
    # Don't know exactly what this means, per m^2? for the whole city? 
    #print(energies)
    
    #energies.plot(kind='bar', rot=0)
    
    #plt.ylabel('Yearly energy yield (W hr)')
    #plt.show()
    
    #Skapa csv fil med land och average soleffekt (för att skapa heatmap)
    #använd latlong.csv för att hämta latlongpunkter där data om soleffekt ska hämtas, skapa ny csv enligt ovan
    #Skapa script som när man klickar på ett land hämtar detaljerad info om det från API:n
    #Räknar ut wattimmar per år på en solcell vid koordinat


if __name__ == "__main__":
    main()

