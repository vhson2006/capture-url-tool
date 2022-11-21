const ChartJSImage = require('chart.js-image');
const config = require('../config');

const drawChart = async (inputs, title) => {
  const lineChart = ChartJSImage().chart({
    "type": "line",
    "data": {
      "labels": inputs.keys(),
      "datasets": [
        {
          "label": "My First dataset",
          "borderColor": "rgb(255,+99,+132)",
          "backgroundColor": "rgba(255,+99,+132,+.5)",
          "data": inputs
        },
      ]
    },
    "options": {
      "title": {
        "display": true,
        "text": title
      },
      "scales": {
        "xAxes": [
          {
            "scaleLabel": {
              "display": true,
              "labelString": "Index"
            }
          }
        ],
        "yAxes": [
          {
            "stacked": true,
            "scaleLabel": {
              "display": true,
              "labelString": "Value"
            }
          }
        ]
      }
    }
  })
  .backgroundColor('white')
  .width(config.chartWidth)
  .height(config.chartHeight);

  await lineChart.toFile(`${config.outputFolder}/${title}.png`);
}

module.exports = {
  drawChart
}