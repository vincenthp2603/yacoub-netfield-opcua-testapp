const { OPCUAClient } = require("node-opcua");

const endpointUrl = 'opc.tcp://opcuaserver.com:48010';
let session;

const client = OPCUAClient.create();

let nodeIdsConfig = [
    { id: 1, temperature: 'ns=3;s=AirConditioner_1.Temperature', humidity: 'ns=3;s=AirConditioner_1.Humidity' },
    { id: 2, temperature: 'ns=3;s=AirConditioner_2.Temperature', humidity: 'ns=3;s=AirConditioner_2.Humidity' }
]

let airConditionersData = [
    { id: 1, temperature: 0, humidity: 0 },
    { id: 2, temperature: 0, humidity: 0 }
]

function getAirConditionersData() {
    return airConditionersData;
}

async function pollAirConditionersData() {
    try {
        await client.connect(endpointUrl);
        session = await client.createSession();

        // console.log("Test view from Root");
        // let browseResult = await session.browse("RootFolder");
        // for (let reference of browseResult.references) {
        //     console.log(reference.browseName.toString(), reference.nodeId.toString())
        // };

        setInterval(async () => {
            let temper_1 = (await session.read({ nodeId: nodeIdsConfig[0]['temperature'] })).value.value;
            let humid_1 = (await session.read({ nodeId: nodeIdsConfig[0]['humidity'] })).value.value;
            let temper_2 = (await session.read({ nodeId: nodeIdsConfig[1]['temperature'] })).value.value;
            let humid_2 = (await session.read({ nodeId: nodeIdsConfig[1]['humidity'] })).value.value;
            
            airConditionersData[0]['temperature'] = temper_1.toFixed(2);
            airConditionersData[0]['humidity'] = humid_1.toFixed(2);
            airConditionersData[1]['temperature'] = temper_2.toFixed(2);
            airConditionersData[1]['humidity'] = humid_2.toFixed(2);
            console.log(airConditionersData);
        }, 1000);
    } catch (e) {
        console.log(e);
    }
} 

pollAirConditionersData();

