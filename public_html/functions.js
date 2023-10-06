// Created 8/21/2023 by Noah Hanshaw

/*
Notes:
(Values in parentheses are the values used for code, since lists start at 0)
Columns of the house database we are using, and their notation in the code:
Address: Column 2 (1)
City: Column 6 (5)
State: Column 57 (56)
ZIP: Column 53 (52)
Square Footage: Column 18 (17)
Number of floors: Column 44 (43)

Columns if weather database inputs based on Joe's csv:
Outdoor Temp(degrees F): Column 4 (3)
Indoor Temp (degrees F): Column 21 (20)
Office Temp (degrees F): Column 25 (24)
Garage Temp (degress F): Column 27 (26)
Solar Radiation: Column 20 (19)

Current version loads local files (which is the only way I could make it work); will need to be updated for better usability, but serves its purpose for testing now
*/

// Gather input values & find matching data in databases (csv)
function getHouseData() {
    // Gather input values
    var address = document.getElementById('user-input-1').value;
    var city = document.getElementById('user-input-2').value;
    var state = document.getElementById('user-input-3').value;
    var zip = document.getElementById('user-input-4').value;

    // Test measure that logs inputs
    console.log(address,city,state,zip);
    // Create a variable to declare file inputs
    let testData = document.getElementById('input1').files[0]


    // Parse database and return house data (square footage, number of floors, etc.)
    Papa.parse(testData, {
        download: true,
        delimiter: ",",
        step: function(row, parser){
            if (row.data[1] === address && row.data[5] === city && row.data[56] === state && row.data[52] === zip) {
                document.getElementById('squareFeet').innerHTML = row.data[17];
                document.getElementById('numFloors').innerHTML = row.data[43];
                console.log("Data found")
                parser.abort();
            }
        },
        complete: function() {
            console.log("House Data Complete");
        }
    });
}

function getWeatherData() {
    // Variables for min & max indoor & outdoor temps
    var indoorMin = 100;
    var indoorMax = 0;
    var outdoorMin = 100;
    var outdoorMax = 0;

    // Create arrays for graph data
    const xTime = [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200];
    const outdoorTemp = [];
    const officeTemp = [];
    const garageTemp = [];

    let weatherData = document.getElementById('input2').files[0]

    //Parse Weather database and return weather data ()
    Papa.parse(weatherData, {
        download: true,
        delimiter: ",",
        step: function(row) {
            x = parseInt(row.data[19]);
            y = parseInt(row.data[0]);
            if (x === 0 && y > 100 && y < 289) {
                outdoorTemp.push(parseFloat(row.data[3]));
                officeTemp.push(parseFloat(row.data[24]));
                garageTemp.push(parseFloat(row.data[26]));
            }

            if (row.data[3] > outdoorMax) {
                outdoorMax = row.data[3];
            }
            if (row.data[3] < outdoorMin) {
                outdoorMin = row.data[3];
            }

            if (row.data[20] > indoorMax) {
                indoorMax = row.data[20];
            }
            if (row.data[20] < indoorMin) {
                indoorMin = row.data[20];
            }
        },
        complete: function() {
            console.log("Weather Data Complete");
            document.getElementById('outdoorMax').innerHTML = outdoorMax;
            document.getElementById('outdoorMin').innerHTML = outdoorMin;
            document.getElementById('indoorMax').innerHTML = indoorMax;
            document.getElementById('indoorMin').innerHTML = indoorMin;

            new Chart('graphData', {
                type: 'line',
                data: {
                    labels: xTime,
                    datasets: [{
                        label: 'Office Temp (°F)',
                        data: officeTemp,
                        borderColor: 'green',
                        fill: false
                    },{
                        label: 'Garage Temp (°F)',
                        data: garageTemp,
                        borderColor: 'blue',
                        fill: false
                    },{
                        label: 'Outdoor Temp (°F)',
                        data: outdoorTemp,
                        borderColor: 'red',
                        fill: false
                    }]
                },
                options: {
                    legend: {display: true, position: 'bottom'},
                    title: {display: true, text: "Data Snapshot"},
                    scales: {
                        xAxes:[{
                            scaleLabel: {
                                display: true,
                                labelString: 'Time Points (every 5 minutes)'
                            }
                        }],
                        yAxes:[{
                            scaleLabel: {
                                display: true,
                                labelString: 'Temperature (°F)'
                            }
                        }]
                    }
                }
            });
        }
    });
}

// Function to make results visible
function visible() {document.getElementByClass('googleMap').style.visibility = 'visible'}
