const express = require('express')
const app = express()
const port = 3000

app.use(express.static("public"));
const baseHAUrl = 'http://jserver.fritz.box:8123/api/';
const haToken = 'Bearer '
const sensorsToGet = ['sensor.apollo_msr_1_bad7fc_co2', 'sensor.lumi_lumi_weather_temperatur', 'sensor.apollo_msr_1_bad7fc_ltr390_light', 'sensor.lumi_lumi_weather_luftfeuchtigkeit', 
'sensor.tz3000_2putqrmw_ts011f_leistung_2', 'sensor.nous_steckdose_2_active_power', 'automation.wecker', 'device_tracker.a52s_j']

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
    body: JSON.stringify({ entity_id: 'light.hintergrund' })
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
    body: JSON.stringify({ entity_id: 'light.ikea_of_sweden_floalt_panel_ws_60x60_licht' })
  }).then(response => response.json()).then(data => {
    console.log('data', data)
    res.send(data)
  }).catch(error => {
    console.error('Error:', error);
  }); 
})

app.get('/api/toggleAlarm', (req, res) => {
  fetch(baseHAUrl + 'services/automation/toggle', {
    method: 'POST',
    headers: { 'Authorization': haToken, 'Content-Type': 'application/json'},
    body: JSON.stringify({ entity_id: 'automation.wecker' })
  }).then(response => response.json()).then(data => {
    console.log('data', data)
    res.send(data)
  }).catch(error => {
    console.error('Error:', error);
  }); 
})

app.get('/api/togglePCPower', (req, res) => {
  fetch(baseHAUrl + 'services/switch/toggle', {
    method: 'POST',
    headers: { 'Authorization': haToken, 'Content-Type': 'application/json'},
    body: JSON.stringify({ entity_id: 'switch.tz3000_2putqrmw_ts011f_schalter_2' })
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