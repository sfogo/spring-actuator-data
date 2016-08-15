# Spring Boot Actuator Data
## Objective
This project was started from the basic actuator [sample](https://spring.io/guides/gs/actuator-service). Its java [classes](src/main/java/com/vnet/actuator) only deviate a little from the base sample (just added some [initialization](src/main/java/com/vnet/actuator/Application.java)). The objective is to use [AngularJS](https://angularjs.org) to explore the data that the [actuator endpoints](http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready-endpoints) return.

## Deployment
In order to be able to deploy on [Heroku](https://www.heroku.com), server and management endpoints are kept on the same port (Heroku only supports one). You can update [application properties](src/main/resources/application.properties) in case you need to do two ports (you would also need to update the `managementURL` value in the angular [app](src/main/webapp/WEB-INF/js/actuate-app.js)).

## Examples and screen shots (Heroku)
### Check the app is up and running
- Go to `https://azonzo.herokuapp.com/hello` (_It's on Heroku free tier so you may have to wait until app wakes up. Refresh your browser until you stop seeing Heroku `Application Error` page_).

### Actuator endpoints
- They are at `https://azonzo.herokuapp.com/actuate/{resources}`
- Example: `https://azonzo.herokuapp.com/actuate/mappings`

### AngularJS Application
- Go to `https://azonzo.herokuapp.com/app/actuate/index.html` (credentials `config/config`)
- Health `https://azonzo.herokuapp.com/app/actuate/index.html#/health`  
<img src="https://cloud.githubusercontent.com/assets/13286393/17524618/39cb5c30-5e14-11e6-89e8-35952a81bc86.png"
     border="0" width="80%" />
- Config Props `https://azonzo.herokuapp.com/app/actuate/index.html#/configprops`  
<img src="https://cloud.githubusercontent.com/assets/13286393/17524616/39af0832-5e14-11e6-88e7-5fdd420bd8ad.png"
     border="0" width="80%" />
- Environment `https://azonzo.herokuapp.com/app/actuate/index.html#/env`  
<img src="https://cloud.githubusercontent.com/assets/13286393/17524617/39c66e78-5e14-11e6-9cb9-6ad6c35ef806.png"
     border="0" width="80%" />
