import {AfterViewInit, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import {isPlatformBrowser} from "@angular/common";
import {Axis} from "@amcharts/amcharts4/charts";
import {DataService} from "../../../services/data.service";
import {KafkaStreamHandlerService} from "../../../services/kafka-stream-handler.service";

@Component({
  selector: 'app-speed',
  templateUrl: './speed.component.html',
  styleUrls: ['./speed.component.css']
})
export class SpeedComponent implements OnInit, OnDestroy, AfterViewInit {

  private chart: am4charts.XYChart;
  private refreshInterval: number = 2000; //MILLISECOND
  private transitionDuration: number = 1000; //MILLISECOND
  private hand: any;

  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone, private dataService: DataService, private kafkaStreamHander: KafkaStreamHandlerService) {
  }

  // Run the function only in the browser
  browserOnly(f: (speedComponent: SpeedComponent) => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f(this);
      });
    }
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly((mySpeedComponent) => {
      // Themes begin
      am4core.useTheme(am4themes_animated);
// Themes end

// create chart
      let chart = am4core.create("chartdiv", am4charts.GaugeChart);
      chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

      chart.innerRadius = -25;

      // @ts-ignore
      let axis: any = chart.xAxes.push(new am4charts.ValueAxis());
      axis.min = 0;
      axis.max = 100;
      axis.strictMinMax = true;
      axis.renderer.grid.template.stroke = new am4core.InterfaceColorSet().getFor("background");
      axis.renderer.grid.template.strokeOpacity = 0.3;

      let colorSet = new am4core.ColorSet();

      let range0 = axis.axisRanges.create();
      range0.value = 0;
      range0.endValue = 50;
      range0.axisFill.fillOpacity = 1;
      range0.axisFill.fill = colorSet.getIndex(0);
      range0.axisFill.zIndex = -1;

      let range1 = axis.axisRanges.create();
      range1.value = 50;
      range1.endValue = 80;
      range1.axisFill.fillOpacity = 1;
      range1.axisFill.fill = colorSet.getIndex(2);
      range1.axisFill.zIndex = -1;

      let range2 = axis.axisRanges.create();
      range2.value = 80;
      range2.endValue = 100;
      range2.axisFill.fillOpacity = 1;
      range2.axisFill.fill = colorSet.getIndex(4);
      range2.axisFill.zIndex = -1;

      let hand = chart.hands.push(new am4charts.ClockHand());

// using chart.setTimeout method as the timeout will be disposed together with a chart
      chart.setTimeout(randomValue, 2000);

      function randomValue() {
        console.log("CURRENT SPEED: " + mySpeedComponent.kafkaStreamHander.currentPostsSpeed.count)
        hand.showValue(mySpeedComponent.kafkaStreamHander.currentPostsSpeed.count, mySpeedComponent.transitionDuration, am4core.ease.cubicOut);
        chart.setTimeout(randomValue, mySpeedComponent.refreshInterval);
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
  }
}
