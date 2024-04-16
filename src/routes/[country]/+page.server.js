/** @type {import('./$types').PageServerLoad} */
export async function load({params}) {

    const response = await fetch(`http://127.0.0.1:5000/${params.country}`);//.then((response) => response.json()).then((json) => console.log(json));
    const data = await response.text();
    //console.log(data)
    const country_data = data[0]
    //console.log(country_data)
    

    return {
        data
    };
};