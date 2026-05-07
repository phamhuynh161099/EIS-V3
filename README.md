# Env \ Lib
## Env
- Node v22
- Angular v19

## UI PrimeNG
https://primeng.org/table#export

## AG grid
https://www.ag-grid.com/angular-data-grid/ag-grid-design-system/

## CSS class custom
https://v3.tailwindcss.com/docs/justify-content

## JWT - create token
https://jwt.io/

## Print 
https://www.npmjs.com/package/ngx-print

## Sakai19
This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.6.  
<https://github.com/primefaces/sakai-ng>

<br><hr>

# RUN APP
## Start
```cmd
pnpm install
####  "start": "ng serve --ssl --no-hmr --host 0.0.0.0",
pnpm start
```
OR
```cmd
npm install
npm start
```

## Git clone
```cmd
# cd my-project

# initialise a git repository
git init

# Add all files to be tracked
git add .

# commit tracked files with a message
git commit -m “some message”

# configure a remote
git remote add origin <remote_url>

# push to a remote repository
git push --set-upstream origin main
```

## Source structure
----- src  
-----|---- App  
-----|----|-----| Guard : user authorization handling  
-----|----|-----|-----| role  
-----|----|-----|-----| auth  
-----|----|-----|layout  
-----|----|-----|-----| component  
-----|----|-----|-----|-----| model  
-----|----|-----|-----|-----| config  
-----|----|-----|-----|-----| footer  
-----|----|-----|-----|-----| siderbar  
-----|----|-----|-----|-----| topbar 
-----|----|-----|-----| service  
-----|----|-----|-----|-----| layout theme: change dynamic layout dark and light.  
-----|----|-----|pages  
-----|----|-----|-----|-----| auth  
-----|----|-----|-----|-----|-----| login page  
-----|----|-----|-----|-----|-----| error page  
-----|----|-----|-----|-----|-----| access page  
-----|----|-----|-----|-----| publicity : custom layout UI PrimeNG  
-----|----|-----|-----|-----|-----| dashboard  
-----|----|-----|-----|-----|-----| ..v.v.  
-----|----|-----|-----|-----|-----| Uikit : UI primrng  
-----|----|assets  
-----|----| enviroment  

## Development server
To start a local development server, run:
```cmd
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding
Angular CLI includes powerful code scaffolding tools. To generate a new component, run:
```cmd
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:
```cmd
ng generate --help
```

## Building
To build the project run:
```cmd
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory.  
By default, the production build optimizes your application for performance and speed.
