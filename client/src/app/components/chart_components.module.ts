import {SparkStreamConsumerComponent} from './spark-stream-consumer/spark-stream-consumer.component';
import {KafkaStreamConsumerComponent} from './kafka-stream-consumer/kafka-stream-consumer.component';

import {HBarComponent} from './charts/h-bar/h-bar.component';
import {SpeedComponent} from './charts/speed/speed.component';
import {DonutComponent} from './charts/donut/donut.component';
import {TagCloudChartComponent} from "./charts/tag-cloud-chart/tag-cloud-chart.component";
import {CircleComponent} from "./charts/circle/circle.component";

const components = [
    SparkStreamConsumerComponent,
    KafkaStreamConsumerComponent,
    HBarComponent,
    SpeedComponent,
    DonutComponent,
    TagCloudChartComponent,
    CircleComponent
]

export default {
    components
}