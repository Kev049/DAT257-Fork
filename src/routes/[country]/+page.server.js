/** @type {import('./$types').PageServerLoad} */
export async function load({params}) {

    const response = await fetch(`http://127.0.0.1:5000/${params.country}`)//.then((response) => response.json()).then((json) => console.log(json));
    const data = await response.json()
    console.log(data)
    const country_data = data[0]


    return {
        country: country_data['Country'],
        code: country_data['Code (alpha-3)'],
        renewablePercent: country_data['Renewable energy production (%)'],
        SolarPhotoVolt: country_data['Solar Photovoltaic (GWh)'],
        SolarThermal: country_data['Solar Thermal (GWh)']

    };
};