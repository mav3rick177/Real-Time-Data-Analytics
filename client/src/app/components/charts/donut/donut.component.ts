import {
  AfterViewInit,
  Component,
  Directive,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import {isPlatformBrowser} from "@angular/common";
import {Axis} from "@amcharts/amcharts4/charts";
import {DataService} from "../../../services/data.service";
import {KafkaStreamHandlerService} from "../../../services/kafka-stream-handler.service";
import {Observable} from "rxjs";
import {ISpriteEvents} from "@amcharts/amcharts4/.internal/core/Sprite";

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.css']
})
export class DonutComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input('dataObservable')
  public dataObservable: Observable<any[]>;
  @Input('categoryProperty')
  public categoryProperty: string;
  @Input('valueProperty')
  public valueProperty: string;
  @Input('refreshInterval')
  public refreshInterval: number = 2000; //MILLISECOND
  @Input('transitionDuration')
  public transitionDuration: number = 1000; //MILLISECOND
  @Input('initialData')
  public newData: any[] = [];
  private chart: am4charts.PieChart;
  public static counterId: number = 0;

  private triggerChange: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone) {
  }

  randomIdValueString: string;

  browserOnly(f: (myDonutComponent: DonutComponent) => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f(this);
      });
    }
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly((myDonutComponent) => {
      // Themes begin
      am4core.useTheme(am4themes_animated);
// Themes end
      myDonutComponent.chart = am4core.create("donut_chart_" + myDonutComponent.randomIdValueString, am4charts.PieChart);

// Add data
      myDonutComponent.chart.data = myDonutComponent.newData;

// Set inner radius
      myDonutComponent.chart.innerRadius = am4core.percent(50);

// Add and configure Series
      let pieSeries = myDonutComponent.chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = myDonutComponent.valueProperty;
      // pieSeries.dataFields.value = "subreddit";
      pieSeries.dataFields.category = myDonutComponent.categoryProperty;

      // pieSeries.dataFields.category =  "count";
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;

// This creates initial animation
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;


      myDonutComponent.chart.setTimeout(randomValue, myDonutComponent.refreshInterval);
      myDonutComponent.dataObservable.subscribe((values) => {

        // console.log("Changed --->");
        // console.log(values)
        if (!values) {
          myDonutComponent.triggerChange = false;
          return;
        }
        if (JSON.stringify(values) != JSON.stringify(myDonutComponent.newData)) {
          myDonutComponent.triggerChange = true;
          myDonutComponent.newData = values;
        }else myDonutComponent.triggerChange = false;
        // for (let i = 0; i < values.length && i < 10; i++) {
        //   let value = values[i];
        //   myDonutComponent.newData.push(value);
        // }
      });

      function randomValue() {
        if (myDonutComponent.triggerChange) {
          myDonutComponent.triggerChange = false;
          pieSeries.hide(myDonutComponent.transitionDuration / 2);
          setTimeout(() => {
            myDonutComponent.chart.data = myDonutComponent.newData;
            // pieSeries.show(myDonutComponent.transitionDuration);
            pieSeries.show(myDonutComponent.transitionDuration / 2);
            myDonutComponent.chart.setTimeout(randomValue, myDonutComponent.refreshInterval);
          }, myDonutComponent.transitionDuration / 2 + 1000);
        } else
          myDonutComponent.chart.setTimeout(randomValue, myDonutComponent.refreshInterval);
        //
      }
    });
  }


  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  ngOnInit(): void {
    this.randomIdValueString = `` + DonutComponent.counterId;
    DonutComponent.counterId++;

  }
}
