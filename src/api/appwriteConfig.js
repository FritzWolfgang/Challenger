import { Account, Client, Databases } from "react-native-appwrite";

const endpoint = "https://fra.cloud.appwrite.io/v1";
const projectID = "686bd24c0020de1008b7";

const client = new Client();
client.setEndpoint(endpoint).setProject(projectID);

const account = new Account(client);
const databases = new Databases(client);

export { account, databases };

