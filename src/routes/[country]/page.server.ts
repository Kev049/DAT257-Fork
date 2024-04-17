import { type PageServerLoad } from './$types';

export async function load({ params }: { params: { country: string } }): Promise<{ data: string }> {
    const response = await fetch(`http://127.0.0.1:5000/${params.country}`);
    const data = await response.text();

    return {
        data
    };
}