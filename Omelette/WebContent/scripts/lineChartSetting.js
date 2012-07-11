/**
 * 
 */
     $(document).ready(function () {
    	 var datas = [
  	                { "Date": "1/1/2012", "iPhone": "0", "iPad": "0", "iPod":"0", "Macbook": "0", "iTunes": "0", "iSoftware": "0", "iPeripherals": "0"},
  	                { "Date": "2/1/2012", "iPhone": "3000",	"iPad": "1000",	"iPod": "3000",	"Macbook": "12000", "iTunes": "700", "iSoftware": "12000", "iPeripherals": "5000"},
  	                { "Date": "3/1/2012", "iPhone": "4000", "iPad": "3000", "iPod": "4000", "Macbook": "14000", "iTunes": "1000", "iSoftware": "14000", "iPeripherals": "6000"},
  	                { "Date": "4/1/2012", "iPhone": "10000", "iPad": "5000", "iPod": "6000", "Macbook": "26000", "iTunes": "2000", "iSoftware": "26000", "iPeripherals": "18000"},
  	                { "Date": "5/1/2012", "iPhone": "11500", "iPad": "8000", "iPod": "7000", "Macbook": "26500", "iTunes": "3000", "iSoftware": "26500", "iPeripherals": "20000"},
  	                { "Date": "6/1/2012", "iPhone": "12500", "iPad": "12000", "iPod": "7700", "Macbook": "27000", "iTunes": "4000", "iSoftware": "27000", "iPeripherals": "24000"},
  	                { "Date": "7/1/2012", "iPhone": "13000", "iPad": "16000", "iPod": "8500", "Macbook": "27200", "iTunes": "4500", "iSoftware": "27200", "iPeripherals": "25000"},
  	                { "Date": "8/1/2012", "iPhone": "16000", "iPad": "18000", "iPod": "9000", "Macbook": "29000", "iTunes": "5000", "iSoftware": "29000", "iPeripherals": "26000"},
  	                { "Date": "9/1/2012", "iPhone": "16500", "iPad": "19000", "iPod": "7000", "Macbook": "30000", "iTunes": "6000", "iSoftware": "30000", "iPeripherals": "28000"},
  	                { "Date": "10/1/2012", "iPhone": "17500", "iPad": "20000", "iPod": "5500", "Macbook":"35000", "iTunes": "7000", "iSoftware": "35000", "iPeripherals": "33000"},
  	                { "Date": "11/1/2012", "iPhone": "17800", "iPad": "22000", "iPod": "5200", "Macbook": "36500", "iTunes": "7500", "iSoftware": "36500", "iPeripherals": "35000"},
  	                { "Date": "12/1/2012", "iPhone": "18000", "iPad": "30000", "iPod": "4000", "Macbook": "44000", "iTunes": "9000", "iSoftware": "38000", "iPeripherals":"42000"}
  	            ];
    	 
    	 var dataAdapter = new $.jqx.dataAdapter(source, { async: false, autoBind: true, loadError: function (xhr, status, error) { alert('Error loading "' + source.url + '" : ' + error);} });
    	 
            // prepare the data
            var source =
            {
            		datatype: "csv",
                    datafields: [
                        { name: 'Date' },
                        { name: 'iPhone' },
                        { name: 'iPad' },
                        { name: 'iPod' },
                        { name: 'Macbook'},
                        { name: 'iTunes'},
                        { name: 'iSoftware'},
                        { name: 'iPeripherals' }
                        
                ],
                url: 'other/AppleSales.txt'
            };

          //  var dataAdapter = new $.jqx.dataAdapter(source, { async: false, autoBind: true, loadError: function (xhr, status, error) { alert('Error loading "' + source.url + '" : ' + error); } });
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            // prepare jqxChart settings
            var settings = {
                title: "Apple Sales Data",
                description: "over 3 years",
                enableAnimations: true,
                showLegend: true,
                padding: { left: 10, top: 5, right: 10, bottom: 5 },
                titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
                source: datas,
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