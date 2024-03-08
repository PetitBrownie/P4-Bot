import { Weather } from "./Weather";

//Creer la class beach.
export class Beach {
    public name: string = "";
    public coordinates: { lat: number; lon: number } = { lat: 0, lon: 0 };
    public weather: Weather[] = [{ date: "", indice: 0 }];


}
