const express = require('express')
const app = express()
const port = 3000

app.use(express.static("public"));
const baseHAUrl = 'http://homeassistant.fritz.box:8123/api/';
const haToken = 'Bearer'
const sensorsToGet = ['sensor.apollo_msr_1_bad7fc_co2', 'sensor.temperatur_average', 'sensor.apollo_msr_1_bad7fc_ltr390_light']

app.get('/api/getSensorData', (req, res) => {
  getSensorData().then(returnData => {
    console.log('data', returnData)
    res.send(returnData)
  })
})

app.get('/api/toggleBackground', (req, res) => {
  fetch(baseHAUrl + 'services/light/toggle', {
    method: 'POST',
    headers: { 'Authorization': haToken, 'Content-Type': 'application/json'},
    body: JSON.stringify({ entity_id: 'light.hue_und_bett' })
  }).then(response => response.json()).then(data => {
    console.log('data', data)
    res.send(data)
  }).catch(error => {
    console.error('Error:', error);
  }); 
})

app.get('/api/toggleFloalt', (req, res) => {
  fetch(baseHAUrl + 'services/light/toggle', {
    method: 'POST',
    headers: { 'Authorization': haToken, 'Content-Type': 'application/json'},
    body: JSON.stringify({ entity_id: 'light.ikea_of_sweden_floalt_panel_ws_60x60' })
  }).then(response => response.json()).then(data => {
    console.log('data', data)
    res.send(data)
  }).catch(error => {
    console.error('Error:', error);
  }); 
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function getSensorData() {
  var returnData = [];
  var fetchPromises = sensorsToGet.map(Element => {
    return fetch(baseHAUrl + 'states/' + Element, {
      method: 'GET',
      headers: {
        'Authorization': haToken,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        returnData.push({ 'name': data.attributes.friendly_name, 'state': data.state, 'unit_of_measurement': data.attributes.unit_of_measurement })
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });

  await Promise.all(fetchPromises);
  console.log('return Data', returnData)
  return returnData;
}