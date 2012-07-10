$(document).ready(function() {
	alert("getting json data");
    $.getJSON('AppleSales.js', function(data) {
    	//alert("getting json data");
        var table = '<table>'; /* loop over each object in the array to create rows*/
        $.each(data, function(index, item) { /* add to html string started above*/
            table += '<tr><td>' + Data.products + '</td><td>' + Data.2010 + '</td></tr>';
        });
        table += '</table>'; /* insert the html string*/
        $("#content").html(table);
    });

});