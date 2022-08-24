(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    // Define columns in the table
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "city",
            dataType: tableau.dataTypeEnum.string,
            alias:"City",
            description:"Some Cities"
        },{
            id: "parameter",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "value",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "unit",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "date",
            dataType: tableau.dataTypeEnum.datetime
        },{
            id: "latitude",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "longitude",
            dataType: tableau.dataTypeEnum.float
        }];

        var tableSchema = {
            id: "openaqsydney",
            alias: "Open AQ Sydney",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://api.openaq.org/v2/measurements?date_from=2022-08-01&date_to=2022-08-24&limit=100&page=1&offset=0&sort=desc&coordinates=-33.865%2C151.209&radius=1000&order_by=datetime", function(resp) {
            var feat = resp.results,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "city": feat[i].city,
                    "parameter": feat[i].parameter,
                    "value": feat[i].value,
                    "unit": feat[i].unit,
                    "date": new Date(feat[i].date.local),
                    "latitude": feat[i].coordinates.latitude,
                    "longitude": feat[i].coordinates.longitude

                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Open AQ Sydney"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
