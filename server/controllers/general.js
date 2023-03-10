const request = require('request');
var data;
exports.viewHome = async (req, res) => {
    data = await getData();
    var filtered_data = [];

    dataFormed = JSON.parse(data).features;
    console.log(dataFormed);
    //data must be type of Array in order to work smooth with handlebars 
    res.render('home', { dataFormed, filtered_data });
}

exports.viewHomeFiltered = async (req, res) => {
    let { filter } = req.body;
    console.log(filter);
    let filtered_data = [];
    dataFormed = JSON.parse(data).features;
    //foreach entrie and for each propertie of that entrie im using the search function to search the kinds string
    dataFormed.forEach(entrie => {

        if (entrie.properties.kinds.search(filter) != -1) {
            filtered_data.push(entrie);
        }

    })
    console.log(filtered_data);
    res.render('home', {dataFormed, filtered_data});
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