import { collections, connectToDatabase, disconnectFromDatabase } from "./database.service";
import * as dotenv from "dotenv";

console.log("------------------------------------- Start Bot--------------------------------------------");
connectToDatabase();

function fetchAPI(url: any, requestOptions: any): Promise<void> {
    return fetch(url, requestOptions)
        .then((response) => {
            if (response.status !== 200) {
                console.log('Error request API. Code statut : ' + response.status);
                disconnectFromDatabase();
            } else {
                console.log("------------------------------------- Fetch OK --------------------------------------------");
                response.json().then(
                    (data) => {
                        const assoCollection = collections.asso
                        assoCollection!.insertOne(data)
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

const url = process.env.API_REQUEST_URL
const username = process.env.API_CONN_USERNAME;
const password = process.env.API_CONN_PASSWORD;
// Encodez les informations d'identification en base64
const base64Credentials = btoa(username + ':' + password);
// Options de la requête (méthode, en-têtes, etc.)
const requestOptions: any = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + base64Credentials,
    },
};







fetchAPI(url, requestOptions)
    .then(() => {
        console.log("------------- End of first promise ------------");
    })
    .catch((error) => {
        console.error("error :", error);
        disconnectFromDatabase();
    });