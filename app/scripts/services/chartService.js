angular.module('storecontrol').factory('chartService', function() {
  var chartService = {};

  function getDatesToPast(n, period) {
    var dates = [];

    for (var i = 0; i < n; i++) {
      dates.unshift(moment().subtract(i, period));
    }

    return dates;
  }

  function getDataSetToPast(dates, period, queryFunction) {
    var dataSet = [];

    dates.forEach(function(date) {
      dataSet.push(getSellingTotalPerPeriod(date, period, queryFunction));
    });

    return dataSet;
  }

  function getSellingTotalPerPeriod(date, period, queryFunction) {
    var start = date.clone().startOf(period).toDate();
    var end = date.clone().endOf(period).toDate();

    var oDeferred = $.Deferred();
    queryFunction(start, end, oDeferred);

    return oDeferred.promise();
  }

  chartService.generateChart = function(nToShow, period, queryFunction) {
    var datesToFilter = getDatesToPast(nToShow, period);
    var calculations = getDataSetToPast(datesToFilter, period, queryFunction);

    var format;
    if (period === 'day') {
      format = 'dddd';
    } else if (period === 'month') {
      format = 'MMMM YYYY';
    }

    var chartInstance = {
      destroy: function() {
        this.chart.destroy();
      }
    };

    $.when.apply($, calculations).then(function(totalSellings) {
      var config = {
          type: 'line',
          data: {
              labels: datesToFilter.map(function(date) {
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
                  intersect: false,
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

      var ctx = document.getElementById("canvas").getContext("2d");
      chartInstance.chart = new Chart(ctx, config);
    });

    return chartInstance;
  };

  return chartService;
});
