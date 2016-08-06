# Spring Boot Actuator Data
## Objective
This project was started from the basic actuator [sample](https://spring.io/guides/gs/actuator-service). Its java [classes](src/main/java/com/vnet/actuator) only deviate a little from the base sample (just added some [initialization](src/main/java/com/vnet/actuator/Application.java)). The objective is to use [AngularJS](https://angularjs.org) to explore the data that the [actuator endpoints](http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready-endpoints) return.

## Deployment
In order to be able to deploy on [Heroku](https://www.heroku.com), server and management endpoints are kept on the same port (Heroku only supports one). You can update [application properties](src/main/resources/application.properties) in case you need to do two ports (you would also need to update the `managementURL` value in the angular [app](src/main/webapp/WEB-INF/js/actuate-app.js)).

## Examples and screen shots (Heroku)
### Check the app is up and running
- Go to `https://azonzo.herokuapp.com/hello`
- You may have to wait and refresh your browser a few times before you stop getting Heroku `Application Error` page.

### Actuator endpoints
- They are at `https://azonzo.herokuapp.com/actuate/{resources}`
- Example: `https://azonzo.herokuapp.com/actuate/mappings`

### AngularJS Application
- Go to `https://azonzo.herokuapp.com/app/actuate/index.html`
- Health `https://azonzo.herokuapp.com/app/actuate/index.html#/health`  
<img src="https://cloud.githubusercontent.com/assets/13286393/17454906/0002101c-5b5c-11e6-83c0-e6722408e779.png"
     border="0" width="80%" />
- Config Props `https://azonzo.herokuapp.com/app/actuate/index.html#/configprops`  
<img src="https://cloud.githubusercontent.com/assets/13286393/17454905/fff87d0e-5b5b-11e6-9fdb-2e5cf2f47280.png"
     border="0" width="80%" />
- Environment `https://azonzo.herokuapp.com/app/actuate/index.html#/env`  
<img src="https://cloud.githubusercontent.com/assets/13286393/17454904/ffe3e402-5b5b-11e6-92b5-5e3e7e441476.png"
     border="0" width="80%" />
