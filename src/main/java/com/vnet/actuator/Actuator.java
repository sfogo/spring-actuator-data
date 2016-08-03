package com.vnet.actuator;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.PathVariable;

// import org.codehaus.jackson.map.ObjectMapper;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;


@Controller
public class Actuator {

    @RequestMapping(value="/m/{id}", method=RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String actuate(@PathVariable String id, HttpServletRequest request) throws Exception {
        final String url = "http://" +
            request.getLocalName() + ":" +
            request.getLocalPort() + 
            request.getContextPath() + "/actuate/" + id;

        final HttpHeaders headers = new HttpHeaders();
        headers.set("demo-message", "actuator forward");

        final HttpEntity<String> entity = new HttpEntity<>(null, headers);
        final RestTemplate t = new RestTemplate();
        t.getMessageConverters().add(new MappingJackson2HttpMessageConverter());
        t.getMessageConverters().add(new StringHttpMessageConverter());
        final ResponseEntity<String> responseEntity = t.exchange(url, HttpMethod.GET, entity, String.class);
        return responseEntity.getBody();

        // final Map<String,String> map = new ObjectMapper().readValue(responseEntity.getBody(), Map.class);
        // return new ObjectMapper().readValue(responseEntity.getBody(), Map.class);
    }
}

