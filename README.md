# Daily Build

This GitHub Action checks for commits in the past 24 hours on a specified branch of your repository. It's designed to be used in workflows where you need to determine if there have been any recent changes to a branch.

## Inputs

### `github-token`

**Required** A GitHub token to authenticate API requests. Typically, you can use the built-in `${{ secrets.GITHUB_TOKEN }}` for this purpose.

### `branch`

**Required** The branch to check for recent commits. Default: `'main'`.

### `error-on-no-commits`

**Optional** If set to `'false'`, the action will **not fail** if no commits are found in the last 24 hours. This is useful if you want to halt the workflow in cases where there are no new changes. Default: `'true'`.

## Outputs

### `has_recent_commits`

This output is `'true'` if there have been commits in the last 24 hours, and `'false'` otherwise.

## Usage

To use this action in your workflow, add a step that uses this action and configure the inputs as needed. Here's an example of how to set it up:

```yaml
steps:
- name: Checkout
  uses: actions/checkout@v2

- name: Check for Recent Commits
  id: commit-check
  uses: oleksandr-zhyhalo/daily-build@v1.0.0
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    branch: 'main'
    error-on-no-commits: 'true'
```

## Configuring Workflow Steps

You can use the output `has_recent_commits` to conditionally control the execution of subsequent steps in your workflow. This way, if there are no new commits, and `error-on-no-commits` is set to `false`, the workflow can skip the following steps without marking the workflow as failed.

Here's an example of how to configure your workflow steps:
```
steps:
  - name: Check for Recent Commits
    id: commit-check
    uses: your-action-path
    with:
      error-on-no-commits: 'false' # Continue the workflow even if there are no new commits
      # other inputs...

  - name: Subsequent Step
    if: steps.commit-check.outputs.has_recent_commits == 'true'
    run: |
      # Steps to run if there are new commits
```

In this configuration, if the Daily Build finds no new commits and `error-on-no-commits` is set to `false`, the Subsequent Step will be skipped, effectively ending the workflow gracefully without any errors.

## Example Use-Cases
* Automated Builds: Trigger a build only if there have been changes to the source code in the past day.

* Notifications: Send a notification if a branch has been inactive for 24 hours.

## Notes

* Ensure that the token provided has sufficient permissions to access repository information.
* The `'error-on-no-commits'` input can be used to control the flow of your workflow. If it's set to `'true'`, no subsequent steps will run if there are no new commits.