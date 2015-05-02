
////////////////////////////////////////////////////////////////////////
// Connect the web client to the Station Server
// Sends a ready event
io = io.connect();
// Emit ready event.
io.emit('ready');

var interval = 2000; //initiate interval timer

$(function(){
    $('#tempChart').highcharts({
        chart:{
            type: 'line',
            zoomType: 'xy',
            marginRight: 10
        },
        title: {
        text: 'Temperature'
        },
        colors: ['#FF9900'],
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            floor: -30,
            ceiling: 100,
            title: {
                text: 'Celcius'
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
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                    Highcharts.numberFormat(this.y, 2) + " °C";
            }
        },
            series:[{
                name: "Temperature sensor",
                data:[null]
            }]
        })
});

$(function(){
    $('#phChart').highcharts({
        chart:{
            type: 'line',
            zoomType: 'xy',
            marginRight: 10
        },
        title: {
        text: 'pH'
        },
        colors: ['#FF1100'],
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
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                    Highcharts.numberFormat(this.y, 2) + " °C";
            }
        },
            series:[{
                name: "pH sensor",
                data:[null]
            }]
        })
});

io.on('tempData',function(data){
    var chart = $('#tempChart').highcharts();
    var dataBuff = [];
    
    data.array.forEach(function(row){
       dataBuff.push(row.TempWater)
    });
    chart.series[0].setData(dataBuff);
})

io.on('lastTemp',function(data){
    var chart = $('#tempChart').highcharts();
    var shift = (chart.series[0].data.length > 10);
    if(!isNaN(data.value) && (data.value !== null) && (data.value !== "")){
        chart.series[0].addPoint(data.value,true,shift);
    }
});

io.on('phData',function(data){
    var chart = $('#phChart').highcharts();
    var dataBuff = [];
    
    data.array.forEach(function(row){
       dataBuff.push(row.TempWater)
    });
    chart.series[0].setData(dataBuff);
})

io.on('lastPh',function(data){
    var chart = $('#phChart').highcharts();
    var shift = (chart.series[0].data.length > 10);
    if(!isNaN(data.value) && (data.value !== null) && (data.value !== "")){
        chart.series[0].addPoint(data.value,true,shift);
    }
});

