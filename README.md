# GroupGenius

This project is hosted at https://salty-spire-19854.herokuapp.com/#/landing


## Directory Layout

```
app/                    --> all of the source files for the application
  app.css               --> default stylesheet
  controllers/                --> controller files
    [page].js              --> page controllers for Angular
  directives/                --> directive files
    myDirective.js              --> there is a sample <my-div> inside
  app.js                --> main application module
  img/                  --> for storing images
  lib/                  --> libary files
    services.js         --> firebaseData service
  templates/            --> template files .html
    [page].html           --> All our views
  index.html            --> app layout file (the main html template file of the app)
karma.conf.js         --> config file for running unit tests with Karma (Not Used)
```

### Install Dependencies

We have two kinds of dependencies in this project: tools and angular framework code.  The tools help
us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the angular code via `bower`, a [client-side code package manager][bower].

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```
### Run the Application

```
npm start
```

Now browse to the app at http://localhost:8000/ .

## Bootstrap Documentation

https://angular-ui.github.io/bootstrap/

## AngularFire Documentation

https://www.firebase.com/docs/web/libraries/angular/api.html

