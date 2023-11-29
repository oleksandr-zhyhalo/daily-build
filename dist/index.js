/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 617:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 442:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(617);
const github = __nccwpck_require__(442);

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

})();

module.exports = __webpack_exports__;
/******/ })()
;