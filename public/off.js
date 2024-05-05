function fetchData() {
    console.log('fetching data');
    fetch('/api/getSensorData')
        .then(response => response.json())
        .then(data => checkBrightness(data))
        .catch(error => console.log(error));
}

function checkBrightness(data) {
    console.log('data[2]', data[2])
    if (data[2].state > 100) {
        location.href = 'index.html';
    }
}

setInterval(fetchData, 60000);
