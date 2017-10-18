angular.module('storecontrol').factory('chartService', () => {
  const chartService = {};

  function getDatesToPast(n, period) {
    const dates = [];

    for (let i = 0; i < n; i++) {
      dates.unshift(moment().subtract(i, period));
    }

    return dates;
  }

  function getDataSetToPast(dates, period, queryFunction) {
    const dataSet = [];

    dates.forEach(date => {
      dataSet.push(getSellingTotalPerPeriod(date, period, queryFunction));
    });

    return dataSet;
  }

  function getSellingTotalPerPeriod(date, period, queryFunction) {
    const start = date.clone().startOf(period).toDate();
    const end = date.clone().endOf(period).toDate();

    const oDeferred = $.Deferred();
    queryFunction(start, end, oDeferred);

    return oDeferred.promise();
  }

  chartService.generateChart = function (nToShow, period, queryFunction) {
    const datesToFilter = getDatesToPast(nToShow, period);
    const calculations = getDataSetToPast(datesToFilter, period, queryFunction);

    let format;
    if (period === 'day') {
      format = 'dddd';
    } else if (period === 'month') {
      format = 'MMMM YYYY';
    }

    const chartInstance = {
      destroy() {
        this.chart.destroy();
      }
    };

    $.when.apply($, calculations).then(function () {
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
      chartInstance.chart = new Chart(ctx, config);
    });

    return chartInstance;
  };

  return chartService;
});
