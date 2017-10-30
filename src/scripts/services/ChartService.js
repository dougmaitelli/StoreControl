export default class ChartService {

  constructor() {
  }

  destroy() {
    this.chart.destroy();
  }

  _getDatesToPast(n, period) {
    const dates = [];

    for (let i = 0; i < n; i++) {
      dates.unshift(moment().subtract(i, period));
    }

    return dates;
  }

  _getDataSetToPast(dates, period, queryFunction) {
    const dataSet = [];

    dates.forEach(date => {
      dataSet.push(this._getTotalPerPeriod(date, period, queryFunction));
    });

    return dataSet;
  }

  _getTotalPerPeriod(date, period, queryFunction) {
    const start = date.clone().startOf(period).toDate();
    const end = date.clone().endOf(period).toDate();

    const oDeferred = $.Deferred();
    queryFunction(start, end, oDeferred);

    return oDeferred.promise();
  }

  generateChart(nToShow, period, queryFunction) {
    const datesToFilter = this._getDatesToPast(nToShow, period);
    const calculations = this._getDataSetToPast(datesToFilter, period, queryFunction);

    let format;
    if (period === 'day') {
      format = 'dddd';
    } else if (period === 'month') {
      format = 'MMMM YYYY';
    }

    $.when.apply($, calculations).then(function() {
      const config = {
        type: 'line',
        data: {
          labels: datesToFilter.map(date => {
            return date.format(format);
          }),
          datasets: [{
            fill: true,
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            data: Array.prototype.slice.call(arguments)
          }]
        },
        options: {
          responsive: true,
          legend: {
            display: false
          },
          tooltips: {
            mode: 'index',
            intersect: false
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      };

      const ctx = document.getElementById('canvas').getContext('2d');
      this.chart = new Chart(ctx, config);
    }.bind(this));
  }
}
