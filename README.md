# ncc action   
![ncc](https://github.com/sidey79/ncc/workflows/ncc/badge.svg?branch=main)   
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
    - uses: sidey79/ncc@v1.0.0
      with:
        src: 'index.js'
                
    # Push back the created dist file to your branch            
    - uses: EndBug/add-and-commit@v7
      with:
        message: Commit Dist file
        committer_name: GitHub Actions
        committer_email: actions@github.com
        add: 'dist'
        signoff: true
        push: true
        
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
