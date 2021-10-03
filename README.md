# ncc action   
![ncc](https://github.com/tool3/ncc/workflows/ncc/badge.svg?branch=master)   
github action to compile your github action    
uses `@vercel/ncc`

# motivation
* forked from tool3/ncc but i disliked the combination of compiling and pushing into a single action

# usage    
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - uses: tool3/ncc@master
      with:
        src: 'index.js'
```
this will:
* compile `index.js` from the repo root directory.
* save the result into `dist` directory to the working directory.

# options
### `src`   
  **required**   
  default: `index.js`
### `ncc_args`   
  command seperated args for ncc   
  exmaple: `'-o, other_dist, -C'` 
