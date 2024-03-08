import { ApiResponse, WeatherData } from "../Interface/ApiResponse";

//---------------------------------------------------------- Verif de marée basse
function isDateAroundLowTide(targetDate: string, tide: WeatherData): boolean {
    let targetDateTime = new Date(targetDate).getTime();
    let tideDateTime = new Date(tide.value).getTime();

    // Définir les limites de l'intervalle de 3 heures avant et après la marée basse
    let lowerLimit = tideDateTime - 3 * 60 * 60 * 1000; // 3 heures avant
    let upperLimit = tideDateTime + 3 * 60 * 60 * 1000; // 3 heures après

    // Vérifier si la date cible est dans l'intervalle
    return targetDateTime >= lowerLimit && targetDateTime <= upperLimit;
}

export function checkDateAroundLowTide(targetDate: string, weatherApiResponse: ApiResponse): boolean {
    for (let weatherParameter of weatherApiResponse.data) {
        for (let coordinate of weatherParameter.coordinates) {
            for (let weatherData of coordinate.dates) {
                if (isDateAroundLowTide(targetDate, weatherData)) {
                    return true; // La date est dans l'intervalle autour d'une marée basse
                }
            }
        }
    }

    return false; // La date n'est pas dans l'intervalle autour d'une marée basse
}