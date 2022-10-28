# ASSurf
Analyze Solar Surface -> This is an application over BrighterLink Platform

# Install & Run
  1. Make sure you installed Ruby, Python 2.7.x.
  2. Install `compass`, `sass` gems using this command `gem install compass sass`
  3. Install `bower`, `gulp` npm packages globally using this command `npm install -g bower gulp`
  4. Make sure that you can install `node-gyp` packages following installation instruction in here https://github.com/TooTallNate/node-gyp
  5. `npm install`  (Make sure you don't have any installation error. If you get error, try to reach Georgiy Pankov(	georgiy.pankov@brightergy.com) or Ivan Vesely(ivan.vesely@brightergy.com) to get help.
  6. `gulp`
  7. add all env vars from ./docker/envvars file to your env vars
  8. clone the git submodule following below steps
     * `cd core`
     * `git submodule init`
     * `git submodule update`
     * `npm install`
  8. Make sure you're running `Redis` and `MongoDB Server`
  9. `npm start` in `ASSurf` repo


# Notes
  1. that application will not have login/setpassword pages.
  So, for login you will need run `Core` project and login in normal way and then run `ASSurf`
  2. Any config parameters add to ./docker/envvars file instead of /config/global.json
  3. If on server you need use `mongoose` module, please reference it from  `Core/node_modules/mongoose`

# Directory Structure
    .docker/
      envvars
    config/
      global.json
    cloud/
      core/
      models/
      views/
      routes/
      utils/
      main.js         --> entry point of the app
    core/             --> it includes Core repo as git submodule
    client/
      app/
        controllers/
        directives/
        services/
        filters/
        templates/
        app.js
      assets/
        css/
        scss/
        images/
        fonts/
      vendor/         --> here are bower components)
    tasks/            --> all gulp tasks are here
    package.json
    config.rb
    gulpfile.js
    bower.json
    README.md
