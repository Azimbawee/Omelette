/**
 * 
 */
$(document).ready(function () {
            // prepare chart data as an array
	
			var  salesData = [
	                    { "Product":"iPhone", "Sales": "18000"},
	                    { "Product":"iPad", "Sales": "30000"},
	                    { "Product":"iPod", "Sales": "4000"},
	                    { "Product":"Macbook", "Sales": "44000"},
	                    { "Product":"iTunes", "Sales": "9000"},
	                    { "Product":"iSoftware", "Sales": "38000"},
	                    { "Product":"iPeripherals", "Sales":"42000"}
	                ];
			
			var settings1 = {title: "Apple Sales data"};
			
            var source =
            {
                datatype: "csv",
                datafields: [
                    { name: 'Product' },
                    { name: 'Sales' }
                ],
                url: 'other/SalesData.txt'
            };

            var dataAdapter = new $.jqx.dataAdapter(source, { async: false, autoBind: true, loadError: function (xhr, status, error) { alert('Error loading "' + source.url + '" : ' + error); } });

            // prepare jqxChart settings
            var settings2 = {
                title: "Apple Sales Data",
                description: "numbers are Sales in $",
                enableAnimations: true,
                showLegend: true,
                legendPosition: { left: 520, top: 140, width: 100, height: 100 },
                padding: { left: 5, top: 5, right: 5, bottom: 5 },
                titlePadding: { left: 0, top: 0, right: 0, bottom: 10 },
                source: salesData,
                colorScheme: 'scheme02',
                seriesGroups:
                    [
                        {
                            type: 'pie',
                            showLabels: true,
                            series:
                                [
                                    { 
                                        dataField: 'Sales',
                                        displayText: 'Product',
                                        labelRadius: 100,
                                        initialAngle: 15,
                                        radius: 130,
                                        centerOffset: 0,
                                        formatSettings: { sufix: '', decimalPlaces: 0 }
                                    }
                                ]
                        }
                    ]
            };

            // setup the chart
            $('#jqxChart3').jqxChart(settings2);

        });