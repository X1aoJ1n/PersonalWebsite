package com.bettercallxiaojin.home;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.bettercallxiaojin.home")
public class HomeApplication  {
    public static void main(String[] args) {
        SpringApplication.run(HomeApplication.class, args);
    }
}
