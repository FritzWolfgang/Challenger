import { Account, Client, Databeses } from "appwrite";

const endpoint = "";
const projectID = "";

const client = new Client();
client.setEndpoint(endpoint).setProject(projectID);

const account = new Account();
const databeses = new Databeses();

export { account, databeses };
