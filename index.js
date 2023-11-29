const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const token = core.getInput('github-token', { required: true });
        const branch = core.getInput('branch', { required: true });
        const errorOnNoCommits = core.getInput('error-on-no-commits') === 'true';
        const octokit = github.getOctokit(token);

        // Fetch commits
        const response = await octokit.rest.repos.listCommits({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            sha: branch,
            since: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString() // 24 hours ago
        });

        const hasRecentCommits = response.data.length > 0;
        core.setOutput("has_recent_commits", hasRecentCommits);

        // Handle the case where no commits are found
        if (!hasRecentCommits) {
            if (errorOnNoCommits) {
                core.setFailed('No commits found in the last 24 hours, failing as per configuration.');
            } else {
                console.log('No commits found in the last 24 hours.');
            }
        }

    } catch (error) {
        core.setFailed(`Action failed with error: ${error}`);
    }
}

run();
