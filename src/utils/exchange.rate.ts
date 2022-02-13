import fetch from "node-fetch";

interface IExchangeRate {
    rates: {
        [key: string]: number;
    };
}

export async function getRate(base: string, currency: string): Promise<number> {
    const base_url = `http://api.exchangeratesapi.io/latest`;
    const url = `${base_url}?base=${base}&symbols=${currency}&access_key=64d433554d6a3822ea642ec99a851038`;

    const response = await fetch(url);
    const data = (await response.json()) as IExchangeRate;
    if (!data.rates[currency]) {
        throw new Error(`currency: ${currency} doesn't exist in results.`);
    }

    return data.rates[currency];
}
