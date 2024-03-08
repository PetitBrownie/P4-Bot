
import { parse } from "path";
import { ApiResponse, WeatherData } from "./Interface/ApiResponse";
import { monJsonMaree } from "./FileDataTest/mareeData";
import { monJsonMeteo } from "./FileDataTest/weatherData";
import { WeatherIndexObject } from "./Models/WeatherIndexObject";
import { checkDateAroundLowTide } from "./Utils/checkDateAroundLowTide";
import { isTargetHour } from "./Utils/targetHours";
import { getWeatherIndex } from "./Utils/weatherIndexByDateAndLocation";
import { Weather } from "./Models/Weather";
import { miseBDD } from "./Utils/miseBDD";


// apporter ls données test
const apiResponseMeteo: ApiResponse = monJsonMeteo
const apiResponseMaree: ApiResponse = monJsonMaree


// Fonction pour calculer l'indice météo
export function calculateWeather(data: ApiResponse, dataMaree: ApiResponse): string {
    // Parcourez les données et calculez l'indice météo
    for (let coordinate of data.data[0].coordinates) {
        for (const dateObj of coordinate.dates) {
            let date = dateObj.date;
            let value = dateObj.value;
            // Vérifiez si l'heure est une heure cible
            if (isTargetHour(date)) {
                // Vérifiez si l'heure est 3 heures avant ou après une marée basse
                if (checkDateAroundLowTide(date, dataMaree)) {
                    // Obtenez l'indice météo et imprimez-le (vous pouvez le stocker dans un tableau ou le traiter selon vos besoins)
                    let weatherIndex = getWeatherIndex(coordinate, date, data);
                    console.log(`Lieu: ${coordinate.lat}, Date: ${date}, Weather Index: ${weatherIndex}`);
                    let weatherIndexBD = new Weather(date, weatherIndex);
                    miseBDD(weatherIndexBD, coordinate);
                }
                else {
                    console.log(`Lieu: ${coordinate.lat}, Date: ${date}, Marrée Haute !`);
                }
            }
        }
    }
    // Vous pouvez retourner ou stocker l'indice météo selon vos besoins
    return "Indice météo calculé avec succès";
}




















//---------------------------------------------------Appel de la fonction

// Utilisez la fonction avec votre réponse API
//const result = calculateWeather(apiResponseMeteo, apiResponseMaree);
//console.log(result);