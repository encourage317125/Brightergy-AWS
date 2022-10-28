This is a node.js prototype of the BrighterLink backend
This branch is for EB upgrade testing.

[ ![Codeship Status for Brightergy/BrighterLink_MEAN](https://codeship.com/projects/d31248c0-f258-0131-56a4-064eeab7b126/status?branch=Production)](https://codeship.com/projects/27686)

1) Adding dependencies:
In the command line in the app folder run "npm i"

2) Adding available widgets:
In the command line in the app folder run "node server/scripts/seeder/run.js"

3) Adding test user with credentials "test@example.com/test":
In the command line in the app folder run "node dbScripts\insertTestUser.js"

4) Running application:
In the command line in the app folder run "node app.js"

5)Running redis on windows x64:
a)Download nuget from http://nuget.org/nuget.exe
b)In the command line run command "nuget install Redis-64"
c)In the downloaded folder (for example "Redis-64.2.8.9") run "redis-server.exe"
d) Run application
