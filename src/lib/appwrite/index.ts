import { PUBLIC_AACSEARCH_ENDPOINT, PUBLIC_AACSEARCH_PROJECT_ID } from '$env/static/public';
import { Client, Databases, Functions, Storage } from '@aacsearch.io/console';

export const client = new Client();

client.setEndpoint(PUBLIC_AACSEARCH_ENDPOINT).setProject(PUBLIC_AACSEARCH_PROJECT_ID);

export const databases = new Databases(client);
export const functions = new Functions(client);
export const storage = new Storage(client);
