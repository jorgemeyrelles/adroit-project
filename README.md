# Getting Started with Create React App

### `npm install`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Environment Hierarchy

 ### Environments

  `Production`
  - URL: https://adroitfrontend.netlify.app/
  - brach: master
  - dotenv: API
  - NODE_ENV: production

  `Development`
  - URL: https://development--adroitfrontend.netlify.app/
  - branch: development
  - dotenv: TEST
  - NODE_ENV: development
  - React libraries in test should be installed as devDependences (npm i -D ...)

## PR permissions

  `To Production`
  - master <- development
  - request review: Plínio and Ângelo
  - Before PR, developers take a double check in code
  - After push, whether there to be conflicts in the code: follow steps indicated by<br/>
  github and let all reviewers know that all corrections has done and are prepered<br/>
  to merge.

  `To Development`
  - development <- branch of developer (check bellow branch's name sugestions)
  - request review: Another developer
  - After push, whether there to be conflicts in code: follow steps indicated by github
  - Code review: whether there to be a adjust necessary, communicate the autor by Slack<br/>
  and comment the line on code in the github. After correction, the autor let the<br/>
  reviewer know that the corrections are prepered to merge.
  - Avoid commits with addition of more than one issue ("commit bomb")
  - Whether it was not possible avoid a "commit bomb", insert a description about<br/>
  modifications organized by branchs or issues. Example:<br/>
    #84 (or 84-fix-joe-navbar)<br/>
    - component x
    - component y
    
    #86 (or 86-feat-joe-dashboard)<br/>
    - component z

## Suggestions to commit and branch names

  ### Branch strategy
  - GitLab Flow: master <- development <- issue-branch

  ### Brach Name
  - production: master
  - development: development
  - developer-branch:<br/>
    - [number issue]-[commit's type]-[developer name]-[higher component]<br/>
    example -> 85-feat-joe-report<br/>

  ### Commit's type
  
  - `feat:` A new feature;
  - `fix:` A bug Fix;
  - `docs:` Documentation only changes;
  - `style:` Changes that do not affect the meaning of the code (white-space, formatting,<br/>
  missing semi-colons, etc);
  - `refac:` A code change that neither fixes a bug nor adds a feature;
  - `perf:` A code change that improves performance;
  - `test:` Adding missing tests or correcting existing tests;
  - `build:` Changes that affect the build system or external dependencies<br/>
  (example scopes: gulp, broccoli, npm);
  - `ci:` Changes to our CI configuration files and scripts (example scopes: Travis,<br/>
  Circle, BrowserStack, SauceLabs);
  - `chore:` Other changes that don't modify src or test files;
  - `env:` Changes in the dotenv file and variables related.

  ### Commit format

  `<type>([optional issue number]): <description>`<br/>
  Ex -> feat(#85): Add filter into Report

## Important links
  - Branch strategy: `https://www.flagship.io/git-branching-strategies/`

  - Mockup project: `https://www.figma.com/file/hAxmS960hXlTIJWAVWTtrp/ADT---Leaf-Sense?node-id=295%3A1`

  - Scrum tool: `https://trello.com/b/w2WC8klx/front-end-do-zero`

### OBS: Communication by slack
