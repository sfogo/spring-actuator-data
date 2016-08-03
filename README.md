# Spring Boot Actuator Data
## Objective
This project was started from the basic actuator [sample](https://spring.io/guides/gs/actuator-service). Its java [classes](src/main/java/com/vnet/actuator) only deviate a litte from the base sample (just added some [initialization](src/main/java/com/vnet/actuator/Application.java)). The objective is to use [AngularJS](https://angularjs.org) to explore the data that the [actuator endpoints](http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready-endpoints) return.

## Deployment
In order to be able to deploy on [Heroku](https://www.heroku.com), server and management endpoints are kept on the same port (Heroku only supports one). You can update [application properties](src/main/resources/application.properties) in case you need to do two ports (you would also need to update the `managementURL` value in the angular [app](src/main/webapp/WEB-INF/js/actuate-app.js)).
