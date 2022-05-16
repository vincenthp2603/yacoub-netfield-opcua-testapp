const express = require('express');
const cors = require('cors')
const { startOPCUAService, getAirConditionersData } = require('./opc-ua-client-polling')


let app = express();

app.use(cors());

app.get("/air-conditioner-data", (req, res) => {
    let data = getAirConditionersData();
    res.json(data);
})


app.listen(9028, () => {
    startOPCUAService()
})