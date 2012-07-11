/**
 * 
 */
     $(document).ready(function () {
    	 var settings1 = {title: "Apple Sales data"};
    	 
    	 var dataAdapter = new $.jqx.dataAdapter(source, { async: false, autoBind: true, loadError: function (xhr, status, error) { alert('Error loading "' + source.url + '" : ' + error);} });
    	 
            // prepare the data
    	 var source =
         {
             datatype: "json",
             datafields: [
                 { name: 'date' },
                 { name: 'iPhone' }
             ],
             url: 'mockData/LineSales.json'
         };

         var dataAdapter = new $.jqx.dataAdapter(source, { async: false, autoBind: true, loadError: function (xhr, status, error) { alert('Error loading "' + source.url + '" : ' + error); } });
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            // prepare jqxChart settings
            var settings = {
                title: "Apple Sales Data",
                description: "over 3 years",
                enableAnimations: true,
                showLegend: true,
                padding: { left: 10, top: 5, right: 10, bottom: 5 },
                titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
                source: dataAdapter,
                categoryAxis:
                    {
                        dataField: 'Date',
                        formatFunction: function (value) {
                            return months[value.getMonth()];
                        },
                        toolTipFormatFunction: function (value) {
                            return value.getDate() + '-' + months[value.getMonth()];
                        },
                        type: 'date',
                        baseUnit: 'month',
                        showTickMarks: true,
                        tickMarksInterval: 1,
                        tickMarksColor: '#888888',
                        unitInterval: 1,
                        showGridLines: true,
                        gridLinesInterval: 3,
                        gridLinesColor: '#888888',
                        valuesOnTicks: false
                    },
                colorScheme: 'scheme04',
                seriesGroups:
                    [
                        {
                            type: 'line',
                            valueAxis:
                            {
                                unitInterval: 10000,
                                minValue: 0,
                                maxValue: 50000,
                                displayValueAxis: true,
                                description: 'Sales in dollar $',
                                axisSize: 'auto',
                                tickMarksColor: '#888888'
                            },
                            series: [
                                     { dataField: 'iPhone', displayText: 'iPhone' },
                                     { dataField: 'iPad', displayText: 'iPad' },
                                     { dataField: 'iPod', displayText: 'iPod' },
                                     { dataField: 'Macbook', displayText: 'Macbook'},
                                     { dataField: 'iTunes', displayText: 'iTunes'},
                                     { dataField: 'iSoftware', displayText: 'iSoftware'},
                                     { dataField: 'iPeripherals', displayText: 'iPeripherals'}
                                ]
                        }
                    ]
            };

            // setup the chart
            $('#jqxChart2').jqxChart(settings);

        });