/**
 * 
 */
 $(document).ready(function () {
			
            var url = "mockData/Sales.json";
            
            var source =
            	{
            		datatype: "json",
            		datafields: [
            		     { name: 'name'},
            		     { name: '2010'},
            		     { name: '2011'},
            		     { name: '2012'},
            		    ],
            		    id: 'id',
            		    url: url
            	};
            
            var dataAdapter = new $.jqx.dataAdapter(source);
            
			
            // prepare jqxChart settings
            var settings = {
                title: "Apple Sales data",
                description: "",
				enableAnimations: true,
                showLegend: true,
                padding: { left: 25, top: 25, right: 35, bottom: 25 },
                titlePadding: { left: 5, top: 5, right: 5, bottom: 5 },
                source: dataAdapter,
                categoryAxis:
                    {
                        dataField: 'Product',
                        showGridLines: true
                    },
                colorScheme: 'scheme01',
                seriesGroups:
                    [
                        {
                            type: 'column',
                            columnsGapPercent: 50,
                            seriesGapPercent: 0,
                            valueAxis:
                            {
                                unitInterval: 10000,
                                minValue: 0,
                                maxValue: 50000,
                                displayValueAxis: true,
                                description: 'Sales is Dollars $',
                                axisSize: 'auto',
                                tickMarksColor: '#888888'
                            },
                            series: [
                                    { dataField: '2010', displayText: '2010'},
                                    { dataField: '2011', displayText: '2011'},
                                    { dataField: '2012', displayText: '2012'}
                                ]
                        }
                    ]
            };
            
            // setup the chart
            $('#jqxChart1').jqxChart(settings);
            
            });