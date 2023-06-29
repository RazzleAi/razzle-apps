package razzle.ai.reference_apps;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import razzle.ai.RazzleAutoConfiguration;

@SpringBootApplication
@Import(RazzleAutoConfiguration.class)
public class ReferenceAppsApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReferenceAppsApplication.class, args);
	}

}
