import { Account, Client, Databeses } from "appwrite";

const endpoint = "https://fra.cloud.appwrite.io/v1";
const projectID = "686bd24c0020de1008b7";

const client = new Client();
client.setEndpoint(endpoint).setProject(projectID);

const account = new Account();
const databeses = new Databeses();

export { account, databeses };

