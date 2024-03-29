package enset.bdcc.stage.kafkastreams2.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import enset.bdcc.stage.kafkastreams2.common.Common;
import enset.bdcc.stage.kafkastreams2.serializers.CustomSerdes;
import enset.bdcc.stage.kafkastreams2.serializers.SubmissionDeserializer;
import enset.bdcc.stage.kafkastreams2.serializers.SubmissionSerializer;
import lombok.Data;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

@Configuration
@Data
public class KafkaStreamConfig {
    @Value(value = "${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value(value = "${spring.kafka.group-id}")
    private String groupID;

    @Value(value = "${spring.kafka.streams.application-id}")
    private String applicationID;
    @Autowired
    SubmissionSerializer submissionSerializer;
    @Autowired
    SubmissionDeserializer submissionDeserializer;

    @Bean
    public Properties getKafkaStreamProperties() {
        Properties properties = new Properties();
        properties.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        properties.put(StreamsConfig.APPLICATION_ID_CONFIG, applicationID);
        properties.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
        properties.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, CustomSerdes.SubredditDataSerde().getClass().getName());
//        properties.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.serdeFrom(SubmissionSerde.class));
        properties.put(StreamsConfig.COMMIT_INTERVAL_MS_CONFIG, TimeUnit.SECONDS.toMillis(Common.WINDOW_SIZE) * 2);
        properties.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE);

        return properties;
    }

    @Bean
    StreamsBuilder getStreamConfig() {
        return new StreamsBuilder();

    }

    @Bean
    ObjectMapper getObjectMappger() {
        return new ObjectMapper();

    }
}
