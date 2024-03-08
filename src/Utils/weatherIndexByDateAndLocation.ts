import { ApiResponse } from "../Interface/ApiResponse";
import { WeatherIndexObject } from "../Models/WeatherIndexObject";
import { monJsonMeteoFetch } from "../bot";
const apiResponseMeteo: ApiResponse = monJsonMeteoFetch

export function getWeatherIndex(targetLocation: { lat: number, lon: number }, targetDate: string, data: ApiResponse): number {
    const parameterTab = ["wind_speed_mean_2m_1h:kmh", "precip_1h:mm"]
    let targetWeatherIndexObject = new WeatherIndexObject;
    targetWeatherIndexObject.coordinates = targetLocation;
    targetWeatherIndexObject.date = targetDate;
    let weatherIndex;


    for (let parameter of parameterTab) {
        const targetCoord = data.data.find(entry => entry.parameter === parameter)?.coordinates.find(coord =>
            coord.lat === targetLocation.lat && coord.lon === targetLocation.lon
        );

        if (!targetCoord) {
            console.error("Données météo introuvables pour les coordonnées spécifiées.");
            return -1;
        }
        else {
            const targetDateData = targetCoord.dates.find(dateData => dateData.date === targetDate);

            if (!targetDateData) {
                console.error("Données météo introuvables pour la date spécifiée.");
                return -1;
            }
            else {
                targetWeatherIndexObject.indice.push({ parameter: parameter, indice: targetDateData.value });
            }
        }
    }
    console.log(targetWeatherIndexObject.indice);
    // Calcul de l'indice météo en fonction de la température et de la pluie
    if (!targetWeatherIndexObject.indice.find(entry => entry.parameter == "wind_speed_mean_2m_1h:kmh")) {
        console.error("Données vents introuvables pour les coordonnées spécifiées.");
        return -1;
    }
    else {
        let windspeed = targetWeatherIndexObject.indice.find(entry => entry.parameter == "wind_speed_mean_2m_1h:kmh")!.indice;
        console.log("windspeed : " + windspeed);
        if (windspeed <= 10) {
            weatherIndex = 1;
        }
        else if (windspeed <= 20) {
            weatherIndex = 0.5;
        }
        else {
            weatherIndex = 0;
        }
    }

    if (!targetWeatherIndexObject.indice.find(entry => entry.parameter == "precip_1h:mm")) {
        console.error("Données pluies introuvables pour les coordonnées spécifiées.");
        return -1;
    }
    else {
        let precip = targetWeatherIndexObject.indice.find(entry => entry.parameter == "precip_1h:mm")!.indice;
        console.log("precip : " + precip);
        if (precip <= 0.2 && weatherIndex == 1) {
            weatherIndex = 1;
        }
        else if (precip <= 1 && weatherIndex >= 0.5) {
            weatherIndex = 0.5;
        }
        else {
            weatherIndex = 0;
        }
    }

    return weatherIndex;
}
