# Spring Boot Actuator Data
## Objective
This project was started from the basic actuator [sample](https://spring.io/guides/gs/actuator-service). Its java [classes](src/main/java/com/vnet/actuator) only deviate a little from the base sample (just added some [initialization](src/main/java/com/vnet/actuator/Application.java)). The objective is to use [AngularJS](https://angularjs.org) to explore the data that the [actuator endpoints](http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready-endpoints) return.

## Deployment
In order to be able to deploy on [Heroku](https://www.heroku.com), server and management endpoints are kept on the same port (Heroku only supports one). You can update [application properties](src/main/resources/application.properties) in case you need to do two ports (you would also need to update the `managementURL` value in the angular [app](src/main/webapp/WEB-INF/js/actuate-app.js)).

## Examples and screen shots (Heroku)
### Check the app is up and running
- Go to `https://azonzo.herokuapp.com/hello` (_It's on Heroku free tier so you may have to wait until app wakes up. Refresh your browser until you stop seeing Heroku `Application Error` page_).

### Actuator endpoints
- They are at `https://azonzo.herokuapp.com/actuate/{resource}`
- Example: `https://azonzo.herokuapp.com/actuate/mappings`

### AngularJS Application
- Go to `https://azonzo.herokuapp.com/app/actuate/index.html` (credentials `config/config`)
- Health `https://azonzo.herokuapp.com/app/actuate/index.html#/health`  
<img src="https://cloud.githubusercontent.com/assets/13286393/17683044/c9d2f604-6304-11e6-9b56-76766e5732d0.png"
     border="0" width="80%" />
- Config Props `https://azonzo.herokuapp.com/app/actuate/index.html#/configprops`  
<img src="https://cloud.githubusercontent.com/assets/13286393/17683047/c9de4f9a-6304-11e6-944d-0e0efbde66b7.png"
     border="0" width="80%" />
- Environment `https://azonzo.herokuapp.com/app/actuate/index.html#/env`. Each value links to individual URL of environment variable.  
<img src="https://cloud.githubusercontent.com/assets/13286393/17683045/c9d8ee74-6304-11e6-948f-dd1c8b994bca.png"
     border="0" width="80%" />
- Generic page lists main GET mappings in its dropdown  
<img src="https://cloud.githubusercontent.com/assets/13286393/17683046/c9dd3038-6304-11e6-9d3f-dbb472e71424.png"
     border="0" width="80%" />

## Locally
### Deploy
```
mvn package
java -jar target/dependency/webapp-runner.jar --port 7070 target/gs-actuator-service-0.1.0
```
### Point to another actuator
* You can explore actuator data of another application. If need be, you have to provide an authorization (in the form of a header value `Basic Y29uZmlnOmNvbmZpZw==` for instance, or a Bearer token).  
<img src="https://cloud.githubusercontent.com/assets/13286393/17784907/59608c7a-6533-11e6-9d3f-003348918d5b.png"
     border="0" width="80%" />

<img src="https://cloud.githubusercontent.com/assets/13286393/17784908/5964ef22-6533-11e6-9c7e-69c969ac3266.png"
     border="0" width="80%" />


