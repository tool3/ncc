# ncc action 
github action to compile your github action and push to a destination branch!

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
    - uses: tool3/ncc@v1
      with:
        src: 'index.js'
```

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
