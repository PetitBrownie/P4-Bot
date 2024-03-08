//Crer la class weatherIndexObject
export class WeatherIndexObject {
    public name: string = "";
    public coordinates: { lat: number; lon: number } = { lat: 0, lon: 0 };
    public date: string = "";
    public indice: { parameter: string; indice: number }[] = [];
}