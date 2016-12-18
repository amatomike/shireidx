"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _requestPromise = require("request-promise");

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

require("whatwg-fetch");

var _saveflat = require("./saveflat");

var _saveflat2 = _interopRequireDefault(_saveflat);

var _sparkapiauth = require("./sparkapiauth");

var _sparkapiauth2 = _interopRequireDefault(_sparkapiauth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import geofire from 'geofire';

// import fb from "firebase";
var apiAgent = "IDX Agent"; // import jsonfile from 'jsonfile';

var Photos = require(__dirname + '/models/photos.js');
var Listing = require(__dirname + '/models/listing.js');
var fbpromises = [];
var ssloptions = {
    key: _fs2.default.readFileSync(__dirname + '/../private/letsencrypt-key.pem'),
    cert: _fs2.default.readFileSync(__dirname + '/../private/letsencrypt-cert.pem'),
    ca: _fs2.default.readFileSync(__dirname + '/../private/letsencrypt-ca.pem')
};
var app = (0, _express2.default)();
_https2.default.createServer(ssloptions, app).listen(2443);
// var fbserver = fb;
// fbserver.initializeApp({
//     serviceAccount: __dirname + '/../private/sparkidxapi.json',
//     databaseURL: "https://sparkidxapi.firebaseio.com"
// });

var requests = {};
var results = [];
var listings = {};
// var fbsdb = fbserver.database();
// var fbsref = fbsdb.ref("/sparkauth/oauth");
var access_token;
var refresh_token;
var code;
var expires_at;
var fbagentid;
var clientId;
var clientSecret;
var redirectUrl;
// fbsref.on("value", function(snapshot) {
//     console.log(snapshot.val());
//    let sparkauth = snapshot.val();
//     code = sparkauth.code;
//     clientId = sparkauth.client_id;
//     clientSecret = sparkauth.client_secret;
//     access_token = sparkauth.access_token;
//     refresh_token = sparkauth.refresh_token;
//     fbagentid = sparkauth.agentId;
//     expires_at = sparkauth.expires_in;
//     redirectUrl = sparkauth.redirect_uri
//     console.log("The snapshot was updated!"+JSON.stringify(sparkauth));
// }, function (errorObject) {
//     console.log("The read failed: " + errorObject.code);
// });
// function setHeaders(){
//     var headers;
//     headers = {
//         'X-SparkApi-User-Agent': `${apiAgent}`,
//         'Authorization': `OAuth ${access_token}`,
//         'Content-Type': 'application/json'
//     };
//     return headers;
// }


function getListingsWith(requestOption) {
    return (0, _requestPromise2.default)(requestOption);
}

var fetchJSON = function fetchJSON(url) {
    console.log('go url');
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            return resolve(url);
        }, 1 * url);
    }).catch(function (err) {
        return console.log("error: ", err.message);
    });
};
function getListings(pages, ops, res) {
    var lops = [];
    for (var page = 1; page <= pages; page++) {
        var pageReq = {};
        Object.assign(pageReq, ops);
        pageReq.qs._page = page;
        lops.push(pageReq);
    }

    var allops = lops.map(getListingJSON);
    console.log(allops, 'n');
    Promise.all(allops).then(function (dataresults) {
        // we only get here if ALL promises fulfill


        dataresults.forEach(function (parsedBody) {

            var entries = parsedBody.D.Results;

            results.push(entries);
            console.log(parsedBody.D.Pagination.page, 'saving for page...');
            saveListings(entries);
            // process item
        });
        return res.send(dataresults);
    }).catch(function (err) {
        // Will catch failure of first failed promise
        console.log("Failed:", err);
    });
}

app.get('/remove', function (req, res) {
    var idx = new _sparkapiauth2.default();
    var clearresults = _sparkapiauth2.default.removeall();
    res.send('cleared :' + clearresults);
});
app.get('/zip/:zipcode', function (req, res) {
    var zipcode = req.params.zipcode;
});
function getListingJSON(options) {
    pr = new reqrequire('request-promise');
    return new Promise(function (resolve, reject) {
        pr(options).then(function (json) {
            return resolve(json);
        }).catch(function (xhr, status, err) {
            return reject(status + err.message);
        });
    });
}

function savePhotoData(entry, listingKey) {
    // var newPhotoKey = fbsdb.ref().child('listings/photos/'+listingKey).push().key;
    var photoData = Photos.copy;
    photoData = {
        ResourceUri: entry.ResourceUri,
        Id: entry.Id,
        Name: entry.Name,
        Caption: entry.Caption,
        UriThumb: entry.UriThumb,
        Uri300: entry.Uri300,
        Uri640: entry.Uri640,
        Uri800: entry.Uri800,
        Uri1024: entry.Uri1024,
        Uri1280: entry.Uri1280,
        Uri1600: entry.Uri1600,
        Uri2048: entry.Uri2048,
        UriLarge: entry.UriLarge,
        Primary: entry.Primary
    };
    var updates = {};
    // updates['/listings/photos/' + listingKey + '/' + entry.Id] = photoData;
    // fbpromises.push(fbsdb.ref().update(updates));
    return entry.Id;
}
function saveListings(listing) {

    listings.forEach(function (listjson) {
        var newListingKey = listjson.Id;
        var listingExists = false;
        // var listingsRef = fbsdb.ref().child('listings/mlsid/');
        // var newkey = firebase().database().ref('/listings/keys/').push().key
        // var utiladd = new saveFlat(listjson,fbsdb);
    });
}

app.get('/addr/:addr', function (req, res) {
    var addr = req.params.addr;

    var idx = new _sparkapiauth2.default();
    console.log('from');

    var thefilter = "PropertyType Eq 'A' And MlsStatus Eq 'Active' And (City Eq '" + addr + "' Or StreetAddress Eq '" + addr + "')";
    console.log(thefilter);

    idx.getListings(req, res, thefilter);
});

app.listen(6980, function () {

    console.log('Express server listening on port ' + 6980);
});
/*
 function getListingsWithOptions(options, page) {

 var Pagination =  {
 CurrentPage:    pBody.D.Pagination.CurrentPage,
 TotalPages:     pBody.D.Pagination.TotalPages
 };
 var pages = Pagination.TotalPages;
 var current = Pagination.CurrentPage;
 var nextPage = current++;
 if(nextPage<=pages) {

 var nextRp = rp.copy;
 return rp(options)
 .catch(function (e) {
 res.send(e + 'oops while getting listing');
 });
 }
 }

 Zip --
 // var options = setupReqOps('count',1,"PostalCode Eq '"+ zipcode +"' And PropertyType Eq 'A'")
 // var pageoptions = setupReqOps(1,1,"PostalCode Eq '"+ zipcode +"' And PropertyType Eq 'A'")
 var reqres = []

 // var promiseTo = fetchJSON(
 spark.countPagesAndRequestJson(access_token,fbsdb,{},zipcode)
 // var doingP = new Promise(function(resolve, reject) {
 //     setTimeout(() => resolve(promiseTo), 1*promiseTo);})
 //     .then(resolved=>{
 //         res.send(resolved)
 //     })
 //     .catch((err) => console.log("error: ", err.message));

 // res.send(promiseTo)
 // rp.get(options)
 //     .then(function (pBody) {
 //         let pageoptions = {
 //             url: 'https://sparkapi.com/v1/listings/',
 //             qs: {
 //                 // _select:    "ListPrice,ListingId,StreetNumber,StreetName,City,PostalCode,PublicRemarks,BathsTotal,BedsTotal,Longitude,Latitude,SubdivisionName,BuildingAreaTotal,Photos,MlsStatus",
 //                 _pagination:'1',
 //                 _page:      '1',
 //                 _orderby:   'ListPrice',
 //                 _filter:    "PostalCode Eq '"+ zipcode +"' And PropertyType Eq 'A'",
 //                 _limit:     '25',
 //                 _expand: 'PrimaryPhoto'
 //             },
 //             headers: setHeaders(),
 //             json: true
 //         };
 //         console.log(pBody.D)
 //         var ropsa = setupReqOps(1,1,"PostalCode Eq '"+ zipcode +"' And PropertyType Eq 'A'")
 //         getListings(pBody.D.Pagination.TotalPages, ropsa, res)
 //     })
 */
//# sourceMappingURL=listings.js.map