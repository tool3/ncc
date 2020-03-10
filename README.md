# ncc action 
github action to compile your github action and push to a destination branch!   
uses `@zeit/ncc`

# Motivation
* work on other devices which do not have a terminal
* code directly on `github` - if that's a thing
* `github hackathon` :)

# Usage    
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - uses: tool3/ncc@master
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        src: 'index.js'
```
this will:
* compile `index.js` from the repo root directory.
* push the compiled `dist` directory to the destination branch.

# Options
### `github_token`   
   **required**   
   Github access token
### `src`   
  **required**   
  default: `index.js`
### `branch`   
  destination branch   
  default: `master`
