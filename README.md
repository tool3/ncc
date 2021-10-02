# ncc action   
![ncc](https://github.com/tool3/ncc/workflows/ncc/badge.svg?branch=master)   
github action to compile your github action and push to a destination branch!   
uses `@vercel/ncc`

# motivation
* work on other devices which do not have a terminal
* code directly on `github` - if that's a thing
* `github hackathon` 🎉

# usage    
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
    - uses: actions/upload-artifact@v1    <-- optional (upload dist directory)
      with:
        name: dist
        path: dist/
```
this will:
* compile `index.js` from the repo root directory.
* push the compiled `dist` directory to the destination branch.

# options
### `github_token`   
   **required**   
   Github access token
### `src`   
  **required**   
  default: `index.js`
### `branch`   
  destination branch   
  default: `master`
### `commit_msg`   
  commit message used when pushing dist   
  default: `dist release 📦`
### `ncc_args`   
  command seperated args for ncc   
  exmaple: `'-o, other_dist, -C'` 

### `allow_unrelated`   
  adds `--allow-unrelated-histories` when perform `git pull`
  default: `true`
