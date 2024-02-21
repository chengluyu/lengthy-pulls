import { Octokit } from "octokit";
import dotenv from "dotenv";
import url from "url";
import path from "path";

const dirname = url.fileURLToPath(new URL(".", import.meta.url));
dotenv.config({ path: path.resolve(dirname, '..', '.env.local') });

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const PER_PAGE = 25;
const pulls = [];
for (let page = 1; ; page++) {
  const batch = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
    owner: 'hkust-taco',
    repo: 'mlscript',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    },
    page,
    per_page: PER_PAGE,
    state: 'all',
  })
  pulls.push(...batch.data);
  if (batch.data.length < PER_PAGE) break;
}

console.log(JSON.stringify(pulls[0]))
