(function ($, window, Drupal, drupalSettings) {
    $(function () {






        $(document).ready(function (e) {

        // Drupal.behaviors.chartsHighcharts = {
        //     attach: function (context, settings) {


            // Drupal.behaviors.highchartInit();
            $.fn.highchartInit();


            // }
        // };

        });


        // Drupal.behaviors.highchartInit = function() {
        $.fn.highchartInit = function() {
            $('.ajax-charts').each(function(i,chartValue){

                let $linkElement = $('#'+chartValue.id);
                let callback = {
                    success: function (data, textStatus) {
                        if(data.noData){
                            $linkElement.html('<div class="text-center bolder orange-text">'+data.noDataMsg+'</div>');
                            return true;
                        }





                        if($linkElement.data('chart-type') === 'line'){
                            Drupal.behaviors.highchartLine(chartValue,data);
                        }

                        if($linkElement.data('chart-type') === 'bar'){
                            Drupal.behaviors.highchartBar(chartValue,data);
                        }

                        if($linkElement.data('chart-type') === 'bar-2'){
                            Drupal.behaviors.highchartBar2(chartValue,data);
                        }

                        if($linkElement.data('chart-type') === 'spline'){
                            Drupal.behaviors.highchartSpline(chartValue,data);
                        }

                        if($linkElement.data('chart-type') === 'fixed-placement'){
                            Drupal.behaviors.highchartFixedPlacement(chartValue,data);
                        }

                        if($linkElement.data('chart-type') === 'word-cloud'){
                            Drupal.behaviors.highchartWordCloud(chartValue,data);
                        }

                        if($linkElement.data('chart-type') === 'gauge'){
                            Drupal.behaviors.highchartGauges(chartValue,data);
                        }
                        if($linkElement.data('chart-type') === 'pyramid'){
                            Drupal.behaviors.highchartPyramid(chartValue,data);
                        }

                        if($linkElement.data('chart-type') === 'line-2'){
                            Drupal.behaviors.highchartLine2(chartValue,data);
                        }

                        if($linkElement.data('chart-type') === 'line-3'){
                            Drupal.behaviors.highchartLine3(chartValue,data);
                        }

                        if($linkElement.data('chart-type') === 'heat-map'){
                            Drupal.behaviors.highchartHeatmap(chartValue,data);
                        }

                        if($linkElement.data('chart-type') === 'scatter-map'){
                            Drupal.behaviors.highchartScattermap(chartValue,data);
                        }
                        if($linkElement.data('chart-type') === 'pie'){
                            Drupal.behaviors.highchartPie(chartValue,data);
                        }

                        if($linkElement.data('chart-type') === 'network'){
                            Drupal.behaviors.highchartNetworkGraph(chartValue,data);
                        }

                        if(data.generateTable){
                            Drupal.behaviors.generateTable(chartValue,data);
                        }

                        if(data.generateCaption){
                            Drupal.behaviors.generateCaption(chartValue,data);
                        }
                    },
                    failure: function (data, textStatus,errorThrown) {
                        $($linkElement).html('<span class="d-flex flex-center">'+errorThrown+'</span>');
                    }
                };
                let urlTarget = $linkElement.data('result-url');
                $($linkElement).html('<span class="loader--fixed d-flex flex-center"> Loading..<br>' + Drupal.behaviors.loaderImg+'</span>');
                Drupal.behaviors.iitAjaxHttpSenders.makeAjaxCall(Drupal.behaviors.sUrl + urlTarget, callback);


            });
        };


        Drupal.behaviors.highchartNetworkGraph = function(chartValue,responseData) {
            Highcharts.addEvent(
                Highcharts.Series,
                'afterSetOptions',
                function (e) {
                    var colors = Highcharts.getOptions().colors,
                        i = 0,
                        nodes = {};

                    if (
                        this instanceof Highcharts.seriesTypes.networkgraph &&
                        e.options.id === 'lang-tree'
                    ) {
                        e.options.data.forEach(function (link) {

                            if (link[0] === responseData.info.unit) {
                                nodes[responseData.info.unit] = {
                                    id: responseData.info.unit,
                                    marker: {
                                        radius: 20
                                    }
                                };
                                nodes[link[1]] = {
                                    id: link[1],
                                    marker: {
                                        radius: 10
                                    },
                                    color: colors[i++]
                                };
                            } else if (nodes[link[0]] && nodes[link[0]].color) {
                                nodes[link[1]] = {
                                    id: link[1],
                                    color: nodes[link[0]].color
                                };
                            }
                        });

                        e.options.nodes = Object.keys(nodes).map(function (id) {
                            return nodes[id];
                        });
                    }
                }
            );

            Highcharts.chart(chartValue.id, {
                chart: {
                    type: 'networkgraph',
                    backgroundColor: "#212121",
                    borderColor: "#212121",
                    borderRadius: 2,
                    borderWidth: 2
                },

                title: {
                    text: responseData.info.title,
                    style: {
                        color: '#FF5904',
                        fontWeight: 'bold'
                    }
                },
                subtitle: {
                    text: 'A Force-Directed Network Graph in Highcharts'
                },
                plotOptions: {
                    networkgraph: {
                        keys: ['from', 'to'],
                        layoutAlgorithm: {
                            enableSimulation: true,
                            friction: -0.9
                        }
                    }
                },
                series: responseData.data_series.series
            });

        };






        Drupal.behaviors.highchartPie = function(chartValue,responseData) {

            Highcharts.chart(chartValue.id, {

                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie',
                    plotBackgroundImage: null,
                    backgroundColor: "#212121",
                    borderColor: "#212121",
                    borderRadius: 2,
                    borderWidth: 2
                },

                title: {
                    text: responseData.info.title,
                    style: {
                        color: '#FF5904',
                        fontWeight: 'bold'
                    }
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        }
                    }
                },
                series: responseData.data_series
            });

        };
        Drupal.behaviors.highchartGauges = function(chartValue,responseData) {

            let videoPromometerPlotbands = [{
                from: 0,
                to: 20,
                color: '#E42426',
                label:{text:'Stop',
                    x: 40,
                    y: 160  ,
                    style: {
                        color: '#FF5916',
                        fontWeight: 'bold'
                    }
                }
            }, {
                from: 20,
                to: 40,
                color: '#F28F1F',
                label:{text:'Alternate Content',
                    x: 15,
                    y: 90,
                    style: {
                        color: '#FF5916',
                        fontWeight: 'bold'
                    }
                }
            }, {
                from: 40,
                to: 60,
                color: '#F1E70D',
                label:{text:'Caution',
                    x: 60,
                    y: 40,
                    style: {
                        color: '#FF5916',
                        fontWeight: 'bold'
                    }
                }
            }, {
                from: 60,
                to: 80,
                // color: '#2072B2'
                color: '#039BE5',
                label:{text:'Avg. Promote',
                    x: 200,
                    y: 40,
                    style: {
                        color: '#FF5916',
                        fontWeight: 'bold'
                    }
                }
            }, {
                from: 80,
                to: 100,
                color: '#00ACC1',
                label:{text:'Promote',
                    x: 250,
                    y: 140,
                    style: {
                        color: '#FF5916',
                        fontWeight: 'bold'
                    }
                }
            }, {
                from: 100,
                to: 120,
                color: '#00897B',
                label:{text:'Strong Promote',
                    x: 200,
                    y: 180,
                    style: {
                        color: '#FF5916',
                        fontWeight: 'bold'
                    }
                }

            }];

            let videoCommentsPlotbands = [{
                from: -1,
                to: -0.1,
                color: '#E42426',
                label:{text:'Negative',
                    x: 15,
                    y: 90  ,
                    style: {
                        color: '#039BE5',
                        fontWeight: 'bold'
                    }
                }
            }, {
                from: -0.1,
                to: 0.1,
                color: '#F1E70D',
                label:{text:'Neutral',
                    x: 140,
                    y: 50,
                    style: {
                        color: '#039BE5',
                        fontWeight: 'bold'
                    }
                }
            }, {
                from: 0.1,
                to: 1,
                color: '#00897B',
                label:{text:'Positive',
                    x: 270,
                    y: 180,
                    style: {
                        color: '#039BE5',
                        fontWeight: 'bold'
                    }
                }
            }];

            let postPlotbands = [{
                from: 0,
                to: 0.3,
                color: '#E42426',
                label:{text:'Stop',
                    x: 40,
                    y: 160  ,
                    style: {
                        color: '#FF5916',
                        fontWeight: 'bold'
                    }
                }
            }, {
                from: 0.3,
                to: 0.6,
                color: '#F28F1F',
                label:{text:'Alternate Campaign',
                    x: 15,
                    y: 90,
                    style: {
                        color: '#FF5916',
                        fontWeight: 'bold'
                    }
                }
            }, {
                from: 0.6,
                to: 0.9,
                color: '#F1E70D',
                label:{text:'Caution',
                    x: 60,
                    y: 40,
                    style: {
                        color: '#FF5916',
                        fontWeight: 'bold'
                    }
                }
            }, {
                from: 0.9,
                to: 1.3,
                // color: '#2072B2'
                color: '#039BE5',
                label:{text:'Avg. Promote',
                    x: 200,
                    y: 40,
                    style: {
                        color: '#FF5916',
                        fontWeight: 'bold'
                    }
                }
            }, {
                from: 1.3,
                to: 1.9,
                color: '#00ACC1',
                label:{text:'Promote',
                    x: 250,
                    y: 140,
                    style: {
                        color: '#FF5916',
                        fontWeight: 'bold'
                    }
                }
            }, {
                from: 1.9,
                to: 2,
                color: '#00897B',
                label:{text:'Strong Promote',
                    x: 200,
                    y: 180,
                    style: {
                        color: '#FF5916',
                        fontWeight: 'bold'
                    }
                }

            }];

            let plotBandSettings;
            switch (responseData.data_relate_to) {
                case 'video-promometer':
                    plotBandSettings = videoPromometerPlotbands;
                    break;
                case 'video-comments':
                    plotBandSettings = videoCommentsPlotbands;
                    break;
                case 'instapost':
                    plotBandSettings = postPlotbands;
                    break;
            }

            Highcharts.chart(chartValue.id, {

                    chart: {
                        type: 'gauge',
                        plotBackgroundColor: null,
                        plotBackgroundImage: null,
                        plotBorderWidth: 0,
                        plotShadow: false,
                        backgroundColor: "#424242",
                        borderColor: "#424242",
                        borderRadius: 2,
                        borderWidth: 2
                    },

                    title: {
                        text: responseData.chartTitle,
                        style: {
                            color: '#FF5904',
                            fontWeight: 'bold'
                        }
                    },

                    pane: {
                        startAngle: -150,
                        endAngle: 150,
                        background: [{
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                stops: [
                                    [0, '#FFF'],
                                    [1, '#333']
                                ]
                            },
                            borderWidth: 0,
                            outerRadius: '109%'
                        }, {
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                stops: [
                                    [0, '#333'],
                                    [1, '#FFF']
                                ]
                            },
                            borderWidth: 1,
                            outerRadius: '107%'
                        }, {
                            // default background
                        }, {
                            backgroundColor: '#DDD',
                            borderWidth: 0,
                            outerRadius: '105%',
                            innerRadius: '103%'
                        }]
                    },

                    // the value axis
                    yAxis: {
                        min: responseData.minRange,
                        max: responseData.maxRange,

                        minorTickInterval: 'auto',
                        minorTickWidth: 1,
                        minorTickLength: 10,
                        minorTickPosition: 'inside',
                        minorTickColor: '#666',

                        tickPixelInterval: 30,
                        tickWidth: 2,
                        tickPosition: 'inside',
                        tickLength: 10,
                        tickColor: '#666',
                        labels: {
                            step: 2,
                            rotation: 'auto'
                        },
                        title: {
                            text: '%'
                        },
                        plotBands: plotBandSettings
                    },

                    series: responseData.data_series

                },
// Add some life
                function (chart) {
                    // if (!chart.renderer.forExport) {
                    //     setInterval(function () {
                    //         let point = chart.series[0].points[0],
                    //             newVal,
                    //             inc = Math.round((Math.random() - 0.1) * 2);
                    //
                    //         newVal = point.y + inc;
                    //         if (newVal < 0 || newVal > 3) {
                    //             newVal = point.y - inc;
                    //         }
                    //
                    //         point.update(newVal);
                    //
                    //     }, 3000);
                    // }
                });
        };


        Drupal.behaviors.highchartScattermap = function(chartValue,responseData) {
            // let chartTitle = responseData.chartTitle;



            Highcharts.chart(chartValue.id, {
                chart: {
                    type: 'scatter',
                    zoomType: 'xy',
                    plotBackgroundColor: null,
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    backgroundColor: "#212121",
                    borderColor: "#212121",
                    borderRadius: 2,
                    borderWidth: 2
                },
                accessibility: {
                    description: 'A scatter plot compares the height and weight of 507 individuals by gender. Height in centimeters is plotted on the X-axis and weight in kilograms is plotted on the Y-axis. The chart is interactive, and each data point can be hovered over to expose the height and weight data for each individual. The scatter plot is fairly evenly divided by gender with females dominating the left-hand side of the chart and males dominating the right-hand side. The height data for females ranges from 147.2 to 182.9 centimeters with the greatest concentration between 160 and 165 centimeters. The weight data for females ranges from 42 to 105.2 kilograms with the greatest concentration at around 60 kilograms. The height data for males ranges from 157.2 to 198.1 centimeters with the greatest concentration between 175 and 180 centimeters. The weight data for males ranges from 53.9 to 116.4 kilograms with the greatest concentration at around 80 kilograms.'
                },
                title: {
                    text: responseData.info.title,
                    style: {
                        color: '#FF5904',
                        fontWeight: 'bold'
                    }
                },
                xAxis: {
                    title: {
                        enabled: true,
                        text: responseData.info.xlabel
                    },
                    startOnTick: true,
                    endOnTick: true,
                    showLastLabel: true
                },
                yAxis: {
                    title: {
                        text: responseData.info.ylabel
                    },
                    gridLineWidth: 0.1,
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'top',
                    x: 100,
                    y: 70,
                    floating: true,
                    backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
                    borderWidth: 1
                },
                plotOptions: {
                    scatter: {
                        marker: {
                            radius: 5,
                            states: {
                                hover: {
                                    enabled: true,
                                    lineColor: 'rgb(100,100,100)'
                                }
                            }
                        },
                        states: {
                            hover: {
                                marker: {
                                    enabled: false
                                }
                            }
                        },
                        tooltip: {
                            headerFormat: '<b>{series.name}</b><br>',
                            pointFormat: '{point.x} '+responseData.info.xlabel +' , {point.y} '+responseData.info.ylabel
                        }
                    }
                },
                series: responseData.data_series
            });



        };


        Drupal.behaviors.highchartPyramid = function(chartValue,responseData) {
            let chartCtgTitle = responseData.data_series[0].name;



            Highcharts.chart(chartValue.id, {
                chart: {
                    type: 'pyramid',
                    // plotBackgroundColor: null,
                    // plotBackgroundImage: null,
                    // plotBorderWidth: 0,
                    // plotShadow: false,
                    backgroundColor: "#212121",
                    borderColor: "#212121",
                    borderRadius: 2,
                    borderWidth: 2
                },
                title: {
                    text: 'Promote pyramid',
                    x: -50,
                    style: {
                        color: '#FF5904',
                        fontWeight: 'bold'
                    }
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b> ({point.y:,.0f})',
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                            softConnector: true,
                            textShadow: '1px 1px #626262'
                        },
                        center: ['40%', '50%'],
                        width: '80%'
                    }
                },
                legend: {
                    enabled: false
                },
                series: [{
                    name: 'Unique users',
                    data:  [
                        ['Website visits',      15654],
                        ['Downloads',            4064],
                        ['Requested price list', 1987],
                        ['Invoice sent',          976],
                        ['Finalized',             846]
                    ]
                }]
            });
        };

        Drupal.behaviors.highchartBar = function(chartValue,responseData) {
            // let chartCtgTitle = responseData.data_series[0].name;
            // console.log(responseData);
            Highcharts.chart(chartValue.id, {
                chart:{
                    type: 'column',
                    alignTicks: true,
                    animation: true,
                    backgroundColor: "#212121",
                    borderColor: "#212121"
                    // borderRadius: 2,
                    // borderWidth: 2
                },
                title: {
                    text: responseData.info.title,
                    x: -20, //center
                    style: {
                        color: '#FF5904',
                        fontWeight: 'bold'
                    }
                },
                xAxis: {
                    // categories: responseData.ts
                    type: 'category',
                    title: {
                        text:  responseData.info.xlabel,
                        style: { "color": '#818181',"font-weight": '800'  }
                    }
                },
                yAxis: {
                    title: {
                        text:  responseData.info.ylabel,
                        style: { "color": '#818181',"font-weight": '800'  }
                    },
                    gridLineWidth: 0.1,
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                legend: {
                    enabled: false,
                    borderWidth:0
                },
                tooltip: {
                    // pointFormat: 'Population in 2017: <b>{point.y:.1f} millions</b>'
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} '+ responseData.info.unit +'</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                series: [{
                    name: responseData.data_series[0].name,
                    colorByPoint: true,
                    data: responseData.data_series[0].data,

                    dataLabels: {
                        enabled: true,
                        rotation: -90,
                        color: '#FFFFFF',
                        align: 'right',
                        format: '{point.y:.1f}', // one decimal
                        y: 10, // 10 pixels down from the top
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                }]
            });
        };

        Drupal.behaviors.highchartBar2 = function(chartValue,responseData) {
            Highcharts.chart(chartValue.id, {
                chart:{
                    type: 'column',
                    alignTicks: true,
                    animation: true,
                    backgroundColor: "#212121",
                    borderColor: "#212121",
                    borderRadius: 2,
                    borderWidth: 2
                },
                title: {
                    text: responseData.info.title,
                    x: -20, //center
                    style: {
                        color: '#FF5904',
                        fontWeight: 'bold'
                    }
                },
                xAxis : responseData.xAxisSeries,
                yAxis: {
                    title: {
                        text:  responseData.info.ylabel,
                        style: { "color": '#818181',"font-weight": '800'  }
                    },
                    gridLineWidth: 0.1,
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                legend: {
                    enabled: false,
                    layout: 'vertical',
                    align:'right',
                    verticalAlign:'middle',
                    borderWidth:0
                },
                tooltip: {
                    // pointFormat: 'Post @ {point.x:.1f} : <b>{point.y:.1f} posts</b>',
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} '+ responseData.info.unit +'</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                series: responseData.data_series

            });
        };






        Drupal.behaviors.highchartLine = function(chartValue,responseData) {
            let chartCtgTitle = responseData.title;
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
                    text: chartCtgTitle,
                    x: -20, //center
                    style: {
                        color: '#FF5904',
                        fontWeight: 'bold'
                    }
                },
                xAxis: {
                    categories: responseData.ts
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
                        enableMouseTracking: true
                    }
                },
                series: responseData.data_series,
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
        };

        Drupal.behaviors.highchartLine2 = function(chartValue,responseData) {
            let chartCtgTitle = responseData.title;

            Highcharts.chart(chartValue.id, {

                chart: {
                    scrollablePlotArea: {
                        minWidth: 700
                    },
                    alignTicks: true,
                    animation: true,
                    backgroundColor: "#212121",
                    borderColor: "#212121",
                    borderRadius: 2,
                    borderWidth: 2
                },

                data: {
                    csvURL: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/analytics.csv',
                    beforeParse: function (csv) {
                        return csv.replace(/\n\n/g, '\n');
                    }
                },

                title: {
                    text: chartCtgTitle,
                    x: -20, //center
                    style: {
                        color: '#FF5904',
                        fontWeight: 'bold'
                    }
                },

                // subtitle: {
                //     text: chartCtgTitle+' over Timestamp',
                //     x: -20,
                //     style: {
                //         color: '#818181'
                //     }
                // },

                xAxis: {
                    categories: responseData.ts,
                    tickInterval: 7 * 24 * 3600 * 1000, // one week
                    tickWidth: 0,
                    gridLineWidth: 1,
                    labels: {
                        align: 'left',
                        x: 3,
                        y: -3
                    }
                },

                yAxis: [{ // left y axis
                    // title: {
                    //     text: null
                    // },
                    labels: {
                        align: 'left',
                        x: 3,
                        y: 16,
                        format: '{value:.,0f}'
                    },
                    showFirstLabel: false,
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
                }, { // right y axis
                    linkedTo: 0,
                    gridLineWidth: 0.1,
                    opposite: true,
                    title: {
                        text:  'Relative Retention Performance',
                        style: { "color": '#818181',"font-weight": '800'  }
                    },
                    labels: {
                        align: 'right',
                        x: -3,
                        y: 16,
                        format: '{value:.,0f}'
                    },
                    showFirstLabel: false,
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                }],

                legend: {
                    layout: 'vertical',
                    align:'right',
                    verticalAlign:'middle',
                    borderWidth:0
                },

                tooltip: {
                    shared: true,
                    crosshairs: true,
                    valueSuffix: chartCtgTitle
                },
                plotOptions: {
                    series: {
                        cursor: 'pointer',
                        // point: {
                        //     events: {
                        //         click: function (e) {
                        //             hs.htmlExpand(null, {
                        //                 pageOrigin: {
                        //                     x: e.pageX || e.clientX,
                        //                     y: e.pageY || e.clientY
                        //                 },
                        //                 headingText: this.series.name,
                        //                 maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) + ':<br/> ' +
                        //                 this.y + ' sessions',
                        //                 width: 200
                        //             });
                        //         }
                        //     }
                        // },
                        marker: {
                            lineWidth: 1
                        }
                    },
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: true
                    }
                },
                series: responseData.data_series,
            });

        };

        Drupal.behaviors.highchartLine3 = function(chartValue,responseData) {
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
                    text: responseData.info.title,
                    x: -20, //center
                    style: {
                        color: '#FF5904',
                        fontWeight: 'bold'
                    }
                },
                xAxis: {
                    title: {
                        text:  responseData.info.xlabel,
                        style: { "color": '#818181',"font-weight": '800'  }
                    },
                    categories: responseData.record.ts
                },
                yAxis: {
                    title: {
                        text:  responseData.info.ylabel,
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
                        enableMouseTracking: true
                    }
                },
                series: responseData.record.data_series,
                tooltip: {
                    // valueSuffix: responseData.info.title
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} '+ responseData.info.unit +'</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                legend: {
                    layout: 'vertical',
                    align:'right',
                    verticalAlign:'middle',
                    borderWidth:0
                }

            });
        };

        Drupal.behaviors.highchartHeatmap = function(chartValue,responseData) {
            let chartCtgTitle = responseData.title;
            Highcharts.chart(chartValue.id, {
                chart: {
                    type: 'heatmap',
                    marginTop: 40,
                    marginBottom: 80,
                    plotBorderWidth: 1,
                    alignTicks: true,
                    animation: true,
                    backgroundColor: "#212121",
                    borderColor: "#212121",
                    borderRadius: 2,
                    borderWidth: 2
                },

                title: {
                    text: chartCtgTitle,
                    x: -20, //center
                    style: {
                        color: '#FF5904',
                        fontWeight: 'bold'
                    }
                },
                xAxis: {
                    categories: responseData.categories.x
                },
                yAxis: {
                    categories: responseData.categories.y,
                    title: null
                },
                colorAxis: {
                    min: 0,
                    minColor: '#FFFFFF',
                    maxColor: Highcharts.getOptions().colors[0]
                },
                legend: {
                    align: 'right',
                    layout: 'vertical',
                    margin: 0,
                    verticalAlign: 'top',
                    y: 25,
                    symbolHeight: 280
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.series.yAxis.categories[this.point.y] + ' </b> gender  of <b>' + this.series.xAxis.categories[this.point.x] + '</b> of viewers watched <br><b>' +
                            this.point.value + '</b> % <br>';
                    }
                },
                series: [{
                    name: 'Sales per employee',
                    borderWidth: 1,
                    data:responseData.data_series.items,
                    dataLabels: {
                        enabled: true,
                        color: '#000000'
                    }
                }]

            });

        };

        Drupal.behaviors.highchartWordCloud = function(chartValue,responseData) {


            Highcharts.chart('word-cloud-container', {
                chart: {
                    // type: 'areaspline',
                    alignTicks: true,
                    animation: true,
                    backgroundColor: "#212121",
                    borderColor: "#212121",
                    borderRadius: 2,
                    borderWidth: 2
                },
                series: [{
                    type: 'wordcloud',
                    data: responseData.data_series,
                    name: responseData.data_title
                }],
                title: {
                    text: responseData.title,
                    style: {
                        color: '#FF5904',
                        fontWeight: 'bold'
                    }
                }
            });
        };

        Drupal.behaviors.highchartSpline = function(chartValue,responseData){

            let chartCtgTitle = responseData.title;
            Highcharts.chart('spline-container', {
                chart: {
                    type: 'areaspline',
                    alignTicks: true,
                    animation: true,
                    backgroundColor: "#212121",
                    borderColor: "#212121",
                    borderRadius: 2,
                    borderWidth: 2
                },
                title: {
                    // text: chartCtgTitle+' over Timestamps ('+responseData.ts.length+')',
                    text: chartCtgTitle,
                    style: {
                        color: '#FF5904',
                        fontWeight: 'bold'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'top',
                    x: 150,
                    y: 100,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor ) || '#FFFFFF'
                },
                xAxis: {

                    categories: responseData.ts,
                    plotBands: responseData.plotband
                },
                yAxis: {
                    title: {
                        text: 'Views',
                        style: { "color": '#818181',"font-weight": '800'  }
                    },
                    gridLineWidth: 0.1,
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    shared: true,
                    valueSuffix: ' units'
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    areaspline: {
                        fillOpacity: 0.5
                    }
                },
                series: responseData.data_series
            });


        };


        Drupal.behaviors.highchartFixedPlacement = function(chartValue,responseData){

            let chartCtgTitle = responseData.data_series[0].name;


            Highcharts.chart('fixed-placement-container', {
                chart: {
                    type: 'column',
                    alignTicks: true,
                    animation: true,
                    backgroundColor: "#212121",
                    borderColor: "#212121",
                    borderRadius: 2,
                    borderWidth: 2
                },
                title: {
                    text: chartCtgTitle,
                    style: {
                        color: '#FF5904',
                        fontWeight: 'bold'
                    }
                },
                xAxis: {
                    categories: responseData.data_column
                },
                yAxis: [{
                    min: 0,
                    title: {
                        text: 'VG'
                    }
                }, {

                    title: {
                        text: 'VG',
                        style: { "color": '#818181',"font-weight": '800'  }
                    },
                    opposite: true,
                    gridLineWidth: 0.1,
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080',
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: true
                        }
                    }]

                },],
                legend: {
                    shadow: false,
                    layout: 'vertical',
                    // align: 'left',
                    // verticalAlign: 'top',
                    // x: 150,
                    // y: 100,
                    // floating: true,
                    borderWidth: 1,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#848484'
                },
                tooltip: {
                    enabled: true,
                    animation: false
                },
                plotOptions: {
                    column: {
                        grouping: false,
                        shadow: false,
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            borderRadius: 0,
                            style: {
                                fontWeight: 'bold',
                                textShadow: '1px 1px #626262'
                            }
                        }
                    },
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: true
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            borderRadius: 0,
                            style: {
                                fontWeight: 'bold',
                                textShadow: '1px 1px #626262'
                            }
                        }
                    }
                },
                series: responseData.data_series
                // series: rdata
            });


        };

        Drupal.behaviors.highchartLineWithAnnotation = function(chartValue,responseData){
            $(chartValue.id).highcharts({
                //  colors:['#7cb5ec', '#434348'],
                chart: {
                    type: 'areaspline',
                    alignTicks: true,
                    animation: true,
                    backgroundColor: "#212121",
                    borderColor: "#212121",
                    borderRadius: 2,
                    borderWidth: 2
                },
                title: {
                    text: 'Video views',
                    style: {
                        color: '#FF5904',
                        fontWeight: 'bold'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'top',
                    x: 150,
                    y: 100,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                xAxis: {
                    lineColor: "#616161",
                    labels:{
                        style: { "color": '#ffffff',"font-weight": '800'  }
                    },
                    categories:'timeseries'

                },
                yAxis: {
                    gridLineColor: "#616161",
                        labels:{
                        style: { "color": '#ffffff',"font-weight": '800'  }
                    },
                    title: {
                        text: 'Video Views',
                            style: { "color": '#818181',"font-weight": '800'  }
                    }
                },
                tooltip: {
                    shared: false,
                        // valueSuffix: ''
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    areaspline: {
                        fillOpacity: 0.5
                    }
                },
                series: [{
                    name:  'Views',
                    data: 'timeseries_vc'
                } /*, {
                 name:  'VG',
                 data:  print $timeseries_vg;
                 }*/]
            });


        };


        Drupal.behaviors.generateCaption = function(chartValue,responseData){
            $('#caption-'+chartValue.id).html(responseData.generateCaption);
        };


        Drupal.behaviors.generateTable = function(chartValue,responseData){
            //setup our table array
            // let tableArr = [
            //     ["row 1, cell 1", "row 1, cell 2"],
            //     ["row 2, cell 1", "row 2, cell 2"]
            // ];
            let tableArr = responseData.generateTable;
            //create a Table Object
            let table = document.createElement('table');
            //iterate over every array(row) within tableArr
            for (let row of tableArr) {
                //Insert a new row element into the table element
                table.insertRow();
                //Iterate over every index(cell) in each array(row)
                for (let cell of row) {
                    //While iterating over the index(cell)
                    //insert a cell into the table element
                    let newCell = table.rows[table.rows.length - 1].insertCell();
                    //add text to the created cell element
                    newCell.innerHTML = cell;
                }
            }

            // console.log('#'+chartValue.id);
            // console.log(table);

            $('#table-'+chartValue.id).addClass('table-sm table-striped table-responsive').html(table);
        // <div class="table-sm table-striped table-responsive">

        };

        $.fn.loadChart = function(id) {

            $('#fixed-placement-container').each(function(i,chartValue){

                let $linkElement = $('#'+chartValue.id);
                let callback = {
                    success: function (data, textStatus) {
                        let chartCtgTitle = data.data_series[0].name;
                        let chartType = $linkElement.data('chart-type');

                        if(chartType === 'fixed-placement'){
                            Drupal.behaviors.highchartFixedPlacement(chartValue,data);
                        }


                    }
                };
                let urlTarget = $linkElement.data('result-url');
                $($linkElement).html('<span class="loader--fixed d-flex flex-center"> Loading..<br>' + Drupal.behaviors.loaderImg+'</span>');
                Drupal.behaviors.iitAjaxHttpSenders.makeAjaxCall(Drupal.behaviors.sUrl + urlTarget, callback);


            });
        };



        // /**
        //  * Handler for the form redirection completion.
        //  *
        //  * @param {Array.<Drupal.AjaxCommands~commandDefinition>} response
        //  * @param {number} status
        //  */
        // Drupal.Ajax.prototype.success = function (response, status) {
        //
        //     $('.ajax-throbber.fa-sync.icon').remove();
        // }

    });
})(jQuery, this, Drupal, drupalSettings);