import { collections, connectToDatabase, disconnectFromDatabase } from "./database.service";
import * as dotenv from "dotenv";
import { calculateWeather } from "./giveAllIndex";

export let monJsonMeteoFetch: any = {};
export let monJsonMareeFetch: any = {};
let compteur = 0;

console.log("------------------------------------- Start Bot--------------------------------------------");
connectToDatabase();

function fetchAPI(url: string, requestOptions: object, type: string): Promise<void> {
    return fetch(url, requestOptions)
        .then((response) => {
            if (response.status !== 200) {
                console.log('Error request API. Code statut : ' + response.status);
                disconnectFromDatabase();
            } else {
                console.log("------------------------------------- Fetch OK --------------------------------------------");
                response.json().then(
                    (data) => {
                        const meteoCollection = collections.meteo
                        if (type == "weather") {
                            monJsonMeteoFetch = data;
                            compteur++;
                            if (compteur == 2) {
                                calculateWeather(monJsonMeteoFetch, monJsonMareeFetch);
                            }
                        }
                        else {
                            monJsonMareeFetch = data;
                            compteur++;
                            if (compteur == 2) {
                                calculateWeather(monJsonMeteoFetch, monJsonMareeFetch);
                            }
                        }
                        meteoCollection!.insertOne(data)
                            .then(data => {
                                console.log("------------- Data in BDD OK -------------");
                                disconnectFromDatabase();
                            })
                            .catch(error => {
                                console.error("error :", error);
                                disconnectFromDatabase();
                            });
                    }).catch((error) => {
                        console.log(error);
                        disconnectFromDatabase();
                    });
            }
        });
}

//------------------ Construction de la requete HTTP avec authentification -------------------------
//const url = process.env.API_REQUEST_URL
const dateStart: string = "2024-03-08";
const dateEnd: string = "2024-03-12";


let urlWeather: string = `https://api.meteomatics.com/2024-03-15T14:05:00.000+03:00--2024-03-17T14:05:00.000+03:00:PT1H/wind_speed_mean_2m_1h:kmh,precip_1h:mm/-12.8884111,45.2132595+-12.95917,45.08361+-12.7874128,45.2632805+-12.866257,45.1132943+-12.8157191,45.1057007+-12.7310147,45.2001591+-12.9190634,45.1848027+-12.944237,45.1012331+-12.9250462,45.0886691/json?model=mix`
let urlTide: string = `https://api.meteomatics.com/2024-03-15T14:05:00.000+03:00--2024-03-17T14:05:00.000+03:00:P1D/first_low_tide:sql,second_low_tide:sql/-12.8884111,45.2132595/json?model=mix`
const username = process.env.API_CONN_USERNAME;
const password = process.env.API_CONN_PASSWORD;

// Encodez les informations d'identification en base64
const base64Credentials = btoa(username + ':' + password);
// Options de la requête (méthode, en-têtes, etc.)
const requestOptions: object = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + base64Credentials,
    },
};



//---------------------------------------------------------------------------------------------------

fetchAPI(urlWeather, requestOptions, "weather")
    .then(() => {
        console.log("------------- End of first weather promise ------------");
    })
    .catch((error) => {
        console.error("error :", error);
        disconnectFromDatabase();
    });

fetchAPI(urlTide, requestOptions, "tide")
    .then(() => {
        console.log("------------- End of first tide promise ------------");
    })
    .catch((error) => {
        console.error("error :", error);
        disconnectFromDatabase();
    });