const { response } = require('express');
const request = require('request');
var data;
var latest_filtered_data;
var dataReadySent;
var interval;
var latestSync;
var filterWord;
var searchingPattern;
var latestReport;

exports.viewHome = async (req, res) => {
    data = await getData();
    var filtered_data_Formed = [];
    try{
        dataFormed = JSON.parse(data).features;
    }catch{
        (err)=>{console.log(err)}
    }
    
    dataFormed = await formatData(dataFormed);
    //console.log(dataFormed);
    //data must be type of Array in order to work smooth with handlebars 
    res.render('home', { dataFormed, filtered_data_Formed , latestReport, searchingPattern});
}

exports.viewHomeFiltered = async (req, res) => {
    let { filter } = req.body;
    filterWord = filter;
    let filtered_data = [];
    dataFormed = JSON.parse(data).features;

    //foreach entrie and for each propertie of that entrie im using the search function to search the kinds string
    dataFormed.forEach(entrie => {
        if (entrie.properties.kinds.search(filter) != -1) {
            filtered_data.push(entrie);
        }
    })
    latest_filtered_data = filtered_data;
    //changine the the format of the dictionary because handlebars can't iterate through objects
    filtered_data_Formed = await formatData(filtered_data);
    //console.log(filtered_data);
    res.render('home', { dataFormed, filtered_data_Formed , latestReport, searchingPattern});
}

exports.manuallySendingData = async (req, res) => {
    const properties = req.body;
   
    searchingPattern = await changingDot(properties);
    
    console.log(searchingPattern);
    dataReadySent = await comparingData(searchingPattern);
    
    console.log(dataReadySent);
    var finalizingDataBeforeSending = {
        "type":data.type,
        "features": dataReadySent // array
    };
    var response = await sendindData(dataReadySent).catch(err=>{
        console.log(err);
    });
    console.log(response);
    latestReport = {
        time:latestSync,
        filter:filterWord,
    };
    res.render("home", { dataFormed, filtered_data_Formed , latestReport, searchingPattern});
}
exports.settingTimer = async (req, res) => {
    const properties = req.body;
    
    searchingPattern = await changingDot(properties);
    console.log(searchingPattern);
    dataReadySent = await comparingData(searchingPattern);
    console.log(properties.timer);
    
    setInterval(()=>{sendindData(dataReadySent)}, Math.floor(properties.timer * 60 * 60 *1000));
    latestReport = {
        time:latestSync,
        filter:filterWord,
    };
    
    res.render("home", { dataFormed, filtered_data_Formed ,latestReport , searchingPattern});
}
function getData() {
    return new Promise(function (resolve, reject) {
        request('https://api.opentripmap.com/0.1/en/places/radius?apikey=5ae2e3f221c38a28845f05b6e45c021faaf1ab85c451377ac7b004c0&radius=50000&lat=37.983810&lon=23.727539',
            (error, response, body) => {
                if (error) {
                    console.log(error);
                } else {
                    resolve(body);
                }

            }
        )
    })

}

function formatData(dataFormed) {
    return new Promise(function (resolve, reject) {
        let formatedArray = [];

        dataFormed.forEach(data => {
            let formatedModel = {
                type: "",
                id: "",
                geometry_type: "",
                geometry_lat: 0,
                geometry_lon: 0,
                properties_xid: "",
                properties_name: "",
                properties_dist: "",
                properties_rate: 0,
                properties_wikidata: "",
                properties_kinds: ""
            };

            formatedModel.type = data.type;
            formatedModel.id = data.id;
            formatedModel.geometry_type = data.geometry.type;
            formatedModel.geometry_lat = data.geometry.coordinates[0];
            formatedModel.geometry_lon = data.geometry.coordinates[1];
            formatedModel.properties_xid = data.properties.xid;
            formatedModel.properties_name = data.properties.name;
            formatedModel.properties_dist = data.properties.dist;
            formatedModel.properties_rate = data.properties.rate;
            formatedModel.properties_wikidata = data.properties.wikidata;
            formatedModel.properties_kinds = data.properties.kinds;

            formatedArray.push(formatedModel);
        });
        
        resolve(formatedArray);
    })

}

function comparingData(searchingPattern) {
    
    return new Promise(function(resolve,reject){
        var arraydata = [];
        
        try{
            latest_filtered_data.forEach(filtered_data => {
                var data = {};
                
                searchingPattern.forEach(propertie => {
        
                    if (propertie.includes(".")) {
                        sequence = propertie.split(".");
                        
                        //var {type, ...newData} = filtered_data[sequence[0]]
                        //if the property geometry or properties exists then i skip the initialization
                        //Using ES6 javascript to pass a parameter as a string in order to create a new propertie in an existing object 
                        if (!data[`${sequence[0]}`]) {
                            data[`${sequence[0]}`] = {};
                            data[`${sequence[0]}`][`${sequence[1]}`] = filtered_data[sequence[0]][sequence[1]];
                        }else{
                            data[`${sequence[0]}`][`${sequence[1]}`] = filtered_data[sequence[0]][sequence[1]];
                        }
        
                        
                    } else {
                        
                        data[`${propertie}`] = filtered_data[propertie];
                    }
        
                })
                arraydata.push(data);
            })
            resolve(arraydata);
        }catch{
            (err)=>{
                reject(err);
            }
        }
        
    })

}
async function changingDot(properties){
    return new Promise(function(resolve, reject){
        let searchingPattern = [];

        for (propertie in properties) {
            if (propertie == "type") {
                searchingPattern.push("type");
            } else if (propertie == "id") {
                searchingPattern.push("id");
            } else if (propertie == "geometry_type") {
                searchingPattern.push("geometry.type");
            } else if (propertie == "geometry_coordinates") {
                searchingPattern.push("geometry.coordinates");
            } else if (propertie == "properties_xid") {
                searchingPattern.push("properties.xid");
            }
            else if (propertie == "properties_name") {
                searchingPattern.push("properties.name");
            }
            else if (propertie == "properties_dist") {
                searchingPattern.push("properties.dist");
            }
            else if (propertie == "properties_rate") {
                searchingPattern.push("properties.rate");
            }
            else if (propertie == "properties_wikidata") {
                searchingPattern.push("properties.wikidata");
            }
            else if (propertie == "properties_kinds") {
                searchingPattern.push("properties.kinds");
            }
        }
        resolve(searchingPattern);
    })
    
}


async function sendindData(dataToSend){
    return new Promise(function(resolve,reject){
        fetch("https://www.holidayemotions.com/api/receive-places", {
            method:"POST",
            body: JSON.stringify(dataToSend)
        }).catch((error)=>{
            console.log(error);
            }
        ).then((response)=>{
            if(response.ok){
                console.log(response);
                var date = new Date();
                latestSync = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}, ${date.getUTCHours()}:${date.getUTCMinutes()}`;
                
                resolve(response); 
            }else{
                reject(response);
            }
            
        })
    });
}

