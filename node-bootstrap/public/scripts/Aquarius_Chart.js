
////////////////////////////////////////////////////////////////////////
// Connect the web client to the Station Server
// Sends a ready event
io = io.connect();
// Emit ready event.
io.emit('ready');
io.on('ReceiveSensors',function(data){
		data.row.forEach(function(entry){
			var chartID = entry.VirtualID
			var chartName = entry.UnitName
			var chartUnit = entry.MeasureUnit
			var chartMax = entry.Max
			var chartMin = entry.Min
			var chartColor = entry.Color
			
			var highcharts ={chart:{
					            type: 'line',
					            zoomType: 'xy',
					            marginRight: 10
						        },
						        title: {
						        text: 'pH'
						        },
						        colors: [],
						        xAxis: {
						            type: 'datetime'
						        },
						        yAxis: {
						            floor: -30,
						            ceiling: 100,
						            title: {
						                text: 'pH'
						            }
						        },
						        plotOptions: {
						            area: {
						                marker: {
						                    enabled: true,
						                    symbol: 'circle',
						                    radius: 2.5,
						                    states: {
						                        hover: {
						                            enabled: true
						                        }
						                    }
						                }
						            }
						        },
						        tooltip: {
						            formatter: function () {
						                return '<b>' + this.series.name + '</b><br/>' +
						                    Highcharts.dateFormat('%Y-%m-%d %H:%M', this.x) + '<br/>' +
						                    Highcharts.numberFormat(this.y, 2) + " °C";
						            }
						        },
						            series:[{
						                name: "pH sensor",
						                data:[null]
						            }]
					        };
					
		highcharts.title.text = chartName + " " + chartUnit;
		highcharts.colors[0] = chartColor;
		highcharts.yAxis.title.text = chartUnit;
		
		var htmlContainer = '<div class="row-fluid">' + '<div class="box-header">' + '<h2><i class="halflings-icon list-alt"></i><span class="break"></span>'+ chartName + '</h2>' + '<div class="box-icon">  </div> </div>' + '<div class="box-content"> <div id="' + "chart"+chartID +'" style="min-width: 310px; height: 400px; margin: 0 auto"></div> </div>' + '</div><!--/row-->';
		$("#content").append(htmlContainer);
		
		
		$(function(){
		    $('#' + "chart"+chartID ).highcharts(highcharts);
		});
	});
});



