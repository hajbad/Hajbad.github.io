(function ($, window, Drupal, drupalSettings) {
    $(function () {
	  var pathname = window.location.pathname; 
	  var path = pathname.split('/');
      function int_chart() {
	    $('.ajax-charts').each(function(i,chartValue){
            var $linkElement = $('#'+chartValue.id);
            var callback = {
                success: function (data, textStatus) {
                  var chartCtgTitle = data.data_series[0].name;
                  Highcharts.chart(chartValue.id, {
                            chart:{
                                alignTicks: true,
                                animation: true,
                                backgroundColor: "#212121",
                                borderColor: "#212121",
                                borderRadius: 2,
                                borderWidth: 2
                            },
                            title: {
                                text: chartCtgTitle+' over Timestamp',
                                x: -20, //center
                                style: {
                                    color: '#FF5904',
                                    fontWeight: 'bold'
                                }
                            },
                            subtitle: {
                                text: chartCtgTitle+' over Timestamp',
                                x: -20,
                                style: {
                                    color: '#818181',
                                }
                            },
                            xAxis: {
                                categories: data.ts
                            },
                            yAxis: {
                                title: {
                                    text:  chartCtgTitle,
                                    style: { "color": '#818181',"font-weight": '800'  }
                                },
                                gridLineWidth: 0.1,
                                plotLines: [{
                                    value: 0,
                                    width: 1,
                                    color: '#808080'
                                }]
                            },
                            plotOptions: {
                                line: {
                                    dataLabels: {
                                        enabled: true
                                    },
                                    enableMouseTracking: false
                                }
                            },
                            series: data.data_series,
                            tooltip: {
                                valueSuffix: chartCtgTitle
                            },
                            legend: {
                                layout: 'vertical',
                                align:'right',
                                verticalAlign:'middle',
                                borderWidth:0
                            }
                        });

                    }
                };
                var urlTarget = $linkElement.data('result-url');
                $($linkElement).html('<span class="loader--fixed d-flex flex-center"> Loading..<br>' + Drupal.behaviors.loaderImg+'</span>');
                Drupal.behaviors.iitAjaxHttpSenders.makeAjaxCall(Drupal.behaviors.sUrl + urlTarget, callback);


            });      
      }
      if (path[1] == 'topic') {
	    int_chart(); 
	  }
    });
})(jQuery, this, Drupal, drupalSettings);
