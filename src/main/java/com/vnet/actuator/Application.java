package com.vnet.actuator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

@SpringBootApplication
public class Application extends WebMvcConfigurerAdapter {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/css/**","").addResourceLocations("/WEB-INF/css/");
        registry.addResourceHandler("/app/**","").addResourceLocations("/WEB-INF/pages/");
        registry.addResourceHandler("/js/**","").addResourceLocations("/WEB-INF/js/");
        registry.addResourceHandler("/images/**","").addResourceLocations("/WEB-INF/images/");
    }

    // -----------------------------------
    // Initializer
    // -----------------------------------
    static public class AppInitializer extends SpringBootServletInitializer {
        @Override
        public SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
            return builder.sources(Application.class);
        }
    }

}
