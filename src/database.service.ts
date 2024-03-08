import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { meteo?: mongoDB.Collection } = {};

let client: mongoDB.MongoClient | null = null;

export async function connectToDatabase() {
  dotenv.config();

  client = new mongoDB.MongoClient(process.env.DB_CONN_STRING!);

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  const meteoCollection: mongoDB.Collection = db.collection(process.env.METEO_COLLECTION_NAME!);

  collections.meteo = meteoCollection;

  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${meteoCollection.collectionName}`);
}

export async function disconnectFromDatabase() {
  // if (client) {
  //   await client.close();
  //   console.log("Disconnected from the database");
  // } else {
  //   console.log("No active database connection to disconnect from");
  // }
}
