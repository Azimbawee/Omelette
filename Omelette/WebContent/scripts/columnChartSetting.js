/**
 * 
 */
 $(document).ready(function () {
	 var sales = [];
	 var sales1;
	 var sales2;
	 var url='mockData/AppleSales.json';
		$.getJSON(url, function(json){	
			sales1 = JSON.stringify(json);
			//alert(sales1);
			this.sales2 = sales1;

			$(json).each(function(i, salesData) {
				$.each(salesData.AppleSalesData, function(index) {
					//alert(salesData.AppleSalesData[i]);
					sales[i]=salesData.AppleSalesData[i];
					//alert(sales[i]);
				});
			});
		});
	 //alert(sales);
	 // prepare chart data as an array
            var  AppleSales = [
                    { "Product":"iPhone", "year2010":"10000", "year2011":"16000", "year2012": "18000"},
                    { "Product":"iPad", "year2010":"5000", "year2011":"18000", "year2012": "30000"},
                    { "Product":"iPod", "year2010":"6000", "year2011":"9000", "year2012": "4000"},
                    { "Product":"Macbook", "year2010":"26000", "year2011":"29000", "year2012": "44000"},
                    { "Product":"iTunes", "year2010":"2000", "year2011":"5000", "year2012": "9000"},
                    { "Product":"iSoftware", "year2010":"26000", "year2011":"29000", "year2012": "38000"},
                    { "Product":"iPeripherals", "year2010":"18000", "year2011":"26000", "year2012":"42000"}
                ];
            var settings1 = {title: "Apple Sales data"};
			
			alert(this.sales2);
            // prepare jqxChart settings
            var settings = {
                title: "Apple Sales data",
                description: "",
				enableAnimations: true,
                showLegend: true,
                padding: { left: 25, top: 25, right: 35, bottom: 25 },
                titlePadding: { left: 5, top: 5, right: 5, bottom: 5 },
                source: sales1,
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
                                    { dataField: 'year2010', displayText: '2010'},
                                    { dataField: 'year2011', displayText: '2011'},
                                    { dataField: 'year2012', displayText: '2012'}
                                ]
                        }
                    ]
            };
            
            // setup the chart
            $('#jqxChart1').jqxChart(settings);
            
            });