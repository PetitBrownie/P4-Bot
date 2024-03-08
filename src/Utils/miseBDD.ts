import { Coordinates } from "../Interface/ApiResponse";
import { Weather } from "../Models/Weather";
import { collections, connectToDatabase } from "../database.service";


export function miseBDD(weatherIndex: Weather, coordinate: Coordinates) {

    connectToDatabase();
    collections.meteo!.find()

}