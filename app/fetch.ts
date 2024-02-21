import { Octokit } from "octokit";
import moment from "moment";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const ENDPOINT = "GET /repos/{owner}/{repo}/pulls";
const PER_PAGE = 25;

export type RawPull = {
  title: string;
  number: number;
  url: string;
  state: string;
  draft: boolean | null;
  author: {
    login: string;
    url: string;
    avatar_url: string;
  } | null;
  created_at: string;
  merged_at: string | null;
  closed_at: string | null;
  duration: string;
};

export default async function fetchPulls(): Promise<RawPull[]> {
  const pulls = [];
  for (let page = 1; ; page++) {
    const batch = await octokit.request(ENDPOINT, {
      owner: "hkust-taco",
      repo: "mlscript",
      headers: { "X-GitHub-Api-Version": "2022-11-28" },
      page,
      per_page: PER_PAGE,
      state: "all",
    });
    pulls.push(...batch.data);
    if (batch.data.length < PER_PAGE) break;
  }
  const rawPulls = pulls.map((pull) => {
    const endDate = pull.merged_at ?? pull.closed_at ?? new Date();
    return {
      title: pull.title,
      number: pull.number,
      url: pull.html_url,
      state: pull.state,
      draft: pull.draft ?? null,
      author:
        pull.user === null
          ? null
          : {
              login: pull.user?.login,
              url: pull.user?.html_url,
              avatar_url: pull.user?.avatar_url,
            },
      created_at: pull.created_at,
      merged_at: pull.merged_at ?? null,
      closed_at: pull.closed_at ?? null,
      duration: moment(endDate).from(pull.created_at, true),
      diff: moment(endDate).diff(pull.created_at, "days", true),
    };
  });
  rawPulls.sort((a, b) => b.diff - a.diff);
  return rawPulls;
}
