const moment = require('moment');
const uuid = require('node-uuid');
const aws = require('aws-sdk');
const db = new aws.DynamoDB.DocumentClient();

/* GET /cafe */
module.exports.listCafes = (event, context, callback) => {
    let cityFilter = undefined;

    if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
        if (event.queryStringParameters.city !== undefined &&
            event.queryStringParameters.city !== null &&
            event.queryStringParameters.city !== "") {
                cityFilter = event.queryStringParameters.city;
            }
    }

    let params = undefined;
    
    if (cityFilter !== undefined) {
        params = {
            TableName: "thirdwavelist-cafe",
            ExpressionAttributeValues: {
                ":city": cityFilter
            },
            FilterExpression: "city = :city"
        };
    } else {
        params = {
            TableName: "thirdwavelist-cafe",
        };
    }

    db.scan(params, (error, result) => {
        if (error) {
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t fetch the cafes.'
            });
            return;
        }

        const response = {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(result.Items)
        };
        callback(null, response);
    });
};

/* POST /cafe */
module.exports.createCafes = (event, context, callback) => {
    const cafes = JSON.parse(event.body);
    cafes.map((cafe) => {
        var params = {
            TableName: "thirdwavelist-cafe",
            Item: {
                uid: cafe.uid || uuid.v4(),
                name: cafe.name || "",
                city: cafe.city || "",
                address: cafe.address || "",
                extra_url_name: cafe.extra_url_name || "",
                extra_thumbnail: cafe.extra_thumbnail || "",
                social_facebook: cafe.social_facebook || "",
                social_instagram: cafe.social_instagram || "",
                social_website: cafe.social_website || "",
                brew_method_espresso: cafe.brew_method_espresso || false,
                brew_method_aeropress: cafe.brew_method_aeropress || false,
                brew_method_pourover: cafe.brew_method_pourover || false,
                brew_method_coldbrew: cafe.brew_method_coldbrew || false,
                brew_method_syphon: cafe.brew_method_syphon || false,
                brew_method_fullimmersion: cafe.brew_method_fullimmersion || false,
                gear_espressomachine: cafe.gear_espressomachine || "",
                gear_grinder: cafe.gear_grinder || "",
                gear_immersive: cafe.gear_immersive || "",
                gear_pourover: cafe.gear_pourover || "",
                bean_roaster: cafe.bean_roaster || "",
                bean_country: cafe.bean_country || "",
                bean_roast_light: cafe.bean_roast_light || false,
                bean_roast_medium: cafe.bean_roast_medium || false,
                bean_roast_dark: cafe.bean_roast_dark || false,
                bean_origin_single: cafe.bean_origin_single || false,
                bean_origin_blend: cafe.bean_origin_blend || false,
                price_doppio: cafe.price_doppio || "0.00",
                extra_google_placeid: cafe.extra_google_placeid || "",
                extra_instagram_locationid: cafe.extra_instagram_locationid || "",
                latlong: cafe.latlong || "",
                photographer_name: cafe.photographer_name || "",
                photographer_link: cafe.photographer_link || ""
            }
        };

        db.put(params, (error) => {
            if (error) {
                callback(null, {
                    statusCode: error.statusCode || 501,
                    headers: { 'Content-Type': 'text/plain' },
                    body: 'Couldn\'t create the cafe item.'
                });
                return;
            }

            const response = {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify(params.Item)
            };
            callback(null, response);
        });
    });
};

/* GET /cafe/{city}/{cafe} */
module.exports.lookupCafe = (event, context, callback) => {
    const params = {
        TableName: "thirdwavelist-cafe",
        ExpressionAttributeNames: {
            "#name": "extra_url_name"
        },
        ExpressionAttributeValues: {
            ":city": event.pathParameters.city, 
            ":cafe": event.pathParameters.cafe
        },
        FilterExpression: "city = :city AND #name = :cafe"
    };

    db.scan(params, (error, result) => {
        if (error) {
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t fetch the cafe item.'
            });
            return;
        }

        const response = {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(result.Items[0])
        };
        callback(null, response);
    });
};

/* DELETE /cafe/{id} */
module.exports.deleteCafe = (event, context, callback) => {
    const params = {
        TableName: "thirdwavelist-cafe",
        Key: {
            uid: event.pathParameters.id
        }
    };

    db.delete(params, (error) => {
        if (error) {
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t remove the cafe item.'
            });
            return;
        }

        const response = {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({})
        };
        callback(null, response);
    });
};

/* GET /roaster */
module.exports.listRoasters = (event, context, callback) => {
    const params = {
        TableName: "thirdwavelist-roaster"
    };

    db.scan(params, (error, result) => {
        if (error) {
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t fetch the roasters.'
            });
            return;
        }

        const response = {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(result.Items)
        };
        callback(null, response);
    });
};

/* GET /cities */
module.exports.listCities = (event, context, callback) => {
    const params = {
        TableName: "thirdwavelist-city"
    };

    db.scan(params, (error, result) => {
        if (error) {
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t fetch the cities.'
            });
            return;
        }

        const response = {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(result.Items)
        };
        callback(null, response);
    });
};