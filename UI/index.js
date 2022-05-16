let temper = [0,0,0,0,0,0,0,0,0,0];
let humid = [0,0,0,0,0,0,0,0,0,0];

let temperChartCtx = document.getElementById('TemperChart').getContext('2d');
let humidChartCtx = document.getElementById('HumidChart').getContext('2d');
let temperTxt = document.getElementById("temper_display_text");
let humidTxt = document.getElementById("humid_display_text");

let http = cockpit.http({
    "adrress": "localhost",
    "port": 9028
});

let temper_chart_controller = new Chart(temperChartCtx, {
    type: 'line',
    data: {
        labels: [1,2,3,4,5,6,7,8,9,10],
        datasets: [{
            backgroundColor: "rgba(0,0,0,1.0)",
            borderColor: "rgba(0,0,0,0.1)",
            data: temper,
            label: 'Temperature'
        }]
    }
});

let humid_chart_controller = new Chart(humidChartCtx, {
    type: 'line',
    data: {
        labels: [1,2,3,4,5,6,7,8,9,10],
        datasets: [{
            backgroundColor: "rgba(0,0,0,1.0)",
            borderColor: "rgba(0,0,0,0.1)",
            data: humid,
            label: 'Humidity'
        }]
    }
});

let updateData = (data) => {
    let temperature = data.temperature;
    let humidity = data.humidity;

    temper.shift();
    temper.push(temperature);

    humid.shift();
    humid.push(humidity);
}

let updateText = (data) => {
    let temperature = data.temperature;
    let humidity = data.humidity;
    temperTxt.innerText = `Temperature: ${temperature}`;
    humidTxt.innerText = `Humidity: ${humidity}`;
}

let updateCharts = () => {
    temper_chart_controller.data.datasets[0].data = temper;
    temper_chart_controller.update();

    humid_chart_controller.data.datasets[0].data = humid;
    humid_chart_controller.update();
}

setInterval(async () => {
    let res_data = await http.get("/air-conditioner-data");
    console.log(res_data);
    let data = JSON.parse(res_data)[0];
    updateData(data);
    updateText(data);
    updateCharts();
}, 1000)



