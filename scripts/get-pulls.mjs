import { Octokit, App } from "octokit";
import dotenv from "dotenv";
import fs from "fs";
import url from "url";
import path from "path";

const dirname = url.fileURLToPath(new URL(".", import.meta.url));
dotenv.config({ path: path.resolve(dirname, '..', '.env.local') });

// Find the only pem file in the directory.
const privateKeyPath = fs.readdirSync(dirname).find((file) => file.endsWith(".pem"));
const PRIVATE_KEY = fs.readFileSync(path.resolve(dirname, privateKeyPath));

const app = new App({
  appId: process.env.GITHUB_APP_ID,
  privateKey: PRIVATE_KEY,
});
