'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _firebaseSafekey = require('firebase-safekey');

var _firebaseSafekey2 = _interopRequireDefault(_firebaseSafekey);

var _errors = require('request-promise/errors');

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var listingObj = { BathsTotal: null, BedsTotal: null, City: null, Id: null, Latitude: null, ListPrice: null, ListingId: null, Longitude: null, MlsId: null, MlsStatus: null, PhotoCaption: 'Loading', PhotoLarge: 'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire320x220.png', PhotoThumb: 'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png', Photos: [{ Caption: 'Loading', Uri300: 'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png', UriLarge: 'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png', UriThumb: 'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png' }], PostalCode: null, PropertySubType: null, PropertyType: null, PublicRemarks: 'Loading', StreetName: null, StreetNumber: null, StreetSuffix: null, YearBuilt: null, completed: null, geo: {} };

app.set('port', process.env.PORT || 5000);

app.use(_express2.default.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.render('pages/index');
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

//import path from 'path';

//let server = require('https').Server(app);
var Promise = require('bluebird'),
    size = Promise.promisify(require('request-image-size'));

var ls = [];
var fbinit = _firebase2.default.initializeApp({
    serviceAccount: {
        "type": "service_account",
        "project_id": "sparkidxapi",
        "private_key_id": "81085b6ba0707d1c02831f6b4b0b03a389f134dc",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDgM1W+jsFYFGca\n7TbB6mquembWVNI5BHXR0rO9ApMmLzfvW435Fh3ONjVFf1xkHOk8LpFpSKtzlKow\ndxqZmeAJCRGRmqA0Tu3KGy2BvWmzkU+COezS8oLEcgSW7OJUsToxLwp3nvjKSBF8\n50Vzsvu3WvlUzEmUkEB6InKBvgfhXAAi/YTRW6yhsIE+SZZ5lkhmEPaNALqWtJCx\ni5Qw07Oz7OgeM0duJFMX3vL++y+SWkS5RM1u2KSrmQFPxD5tefutyIGM8JNeHABY\n0FV5OtYulL8rspo6fqtI9kOuLXaNPYfWi7My4LsEbdX62iw2qOzdz62LIp5Op2gD\nEFbJfmQxAgMBAAECggEBAJZQdKVtCp3mF/aKohLC+sF+GSKL/eHyZpfFv3HynvuT\n3tmgtYAR3uvZlj/BEw2gAJOz2RQQf7rfKneR8wiWjQkhxmCrnctUO8MsE4ePmaWl\nv/vcoDYSF7BjjUYvDdOgexZspoTq1XyxcuAeIodesbsNyGqdCJwNVt1L6R+pa5kg\nF0eMozszPQXGeMfDFpjhpwXBcq67bFXdk4SqlvDeNSHxjWfl7/Hr0Kr8v0JnoJcw\nuPxwLi6mvHVpYSVqpseQkr8aZ6xypT1+2ztkivMmqooRXFUaclxxIO2K1xCmncQg\neGabGBOPzw2Zh/UnCnDfDYeaZ5k4pKNqfjBQM6o3il0CgYEA8iVXXfMjCVcdC/xq\nrOAPir6jXy4u3f2ZSxMmDHgG6IFCxCPwhvjCE3Uv84Wnr6HZ114gSMGFIq9ZS22U\nt7Uejq7UELVVn4pDAzPhdlJU9mBwTBcdoB1bJx1KtfCt8b9+M30H5JaMPJ+x22Z7\nyWxhwMPu0N3TGuy2Z8Ue0zKvsLMCgYEA7Qcm8sm+uliCcS7ypNmbn2nRiEp9yFan\nGZUb4flKO6xHJ/vBj60UEYKYkL63syXDdQ6yAV8jZlJHxVGIT7yJ0AhVkNo/oK4f\nPNXiO4dw+N8ReJhcjwKmU0dOMK4rzH9QGma4WaIO1NXXhap2PbBlF/Yy4IlBnNHW\n+7Faf1zUQYsCgYEAsHTBu/cIWzAePLPO0Pfem47c4ul2wdKiOPFVUtTMw/YeP2yp\nRNJWK3PEY8PMNNLPOoCfKiXL7UC2456RN2ZHRFbmtt5N7RsGRnkyHdVVkM0qSGi3\n8Aw0dsaDwR4IxBh10POWIuAKhcsiAu4l2tyeR6kAiTh9NCu3qNse4W0YVr0CgYBt\njqS+C+oQj+CbGCwnbj20TWEAMg45j3PlKzqcFHHvaw3ouUEae9GO1mJWZRDbyVSy\nwnwcjjD6loV9+tWapXa9pVyHe5l1V4YwxFuxUEUzg0e8ChCeOYdPbuIBNkAgYahQ\ny7HiHDnmvoDD06qbkPDpRm71wfuF1Kgd5jgCLpIdSQKBgQCezHrV+ZHOvoxljR+x\n3/kpwfHyWrqIbETvUz2TbjMc52igcdr09hbsp4mNTl0uy6kMk1MMHVCKNgWdS48x\n6crGgSU/sIugJ9U3Ph7SWEf4wjPYgFRbB8dcbK/+M7SvCJ2/NR8UZKWXxa5TpO4+\n2ElOQBtoUlLTnACetImf5YcchA==\n-----END PRIVATE KEY-----\n",
        "client_email": "apiauth@sparkidxapi.iam.gserviceaccount.com",
        "client_id": "113743275477969379982",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/apiauth%40sparkidxapi.iam.gserviceaccount.com"
    },
    databaseURL: "https://sparkidxapi.firebaseio.com"
});

var oauthData = {
    client_id: ' ',
    client_secret: '',
    access_token: '',
    refresh_token: '',
    redirect_uri: '',
    expires_at: '',
    code: ''
};
var dB = fbinit.database();
fbinit.database().ref('/sparkauth/oauth').on("value", function (snapshot) {
    oauthData.client_id = snapshot.val().client_id;
    oauthData.client_secret = snapshot.val().client_secret;
    oauthData.access_token = snapshot.val().access_token;
    oauthData.refresh_token = snapshot.val().refresh_token;
    oauthData.redirect_uri = snapshot.val().redirect_uri;
    oauthData.expires_at = snapshot.val().expires_at ? snapshot.val().expires_at : "0";
    oauthData.code = snapshot.val().code;
    console.log("auth updated!" + JSON.stringify(oauthData));
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});
var idsnap = void 0;
var keysnap = void 0;
fbinit.database().ref('/listings/keys').on("value", function (snapshot) {
    keysnap = snapshot;
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});
fbinit.database().ref('/listings/id').on("value", function (snapshot) {
    idsnap = snapshot;
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

function checkStatus(response) {
    if (response.statusCode == 401) {
        console.log('response = 401 ? ' + response.statusCode);
        // let oauthData = Object.assign({},oauthData)
        // let fBdB = this.fBdB
        return refreshAuth(oauthData);
    }
    if (response.statusCode >= 200 && response.statusCode < 300) {
        return response;
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        console.log('got error while checking status ' + error);
    }
}
function saveOauthData(od) {
    console.log("saving OauthData ->" + JSON.stringify(od));
    return dB.ref('/sparkauth/oauth').update(od);
}
function handleCallback(req, res) {}
//https://shireidx.herokuapp.com/callback?openid.assoc_handle=%7BHMAC-SHA1%7D%7B58574516%7D%7B6I%2BC%2Bg%3D%3D%7D&openid.claimed_id=https%3A%2F%2Fsparkplatform.com%2Fopenid%2Fuserid%2Fmo.1524%3Fsession_id%3D6e338a49c2eef5f2d4e36270c0647de5&openid.identity=https%3A%2F%2Fsparkplatform.com%2Fopenid%2Fuserid%2Fmo.1524%3Fsession_id%3D6e338a49c2eef5f2d4e36270c0647de5&openid.mode=id_res&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.spark=http%3A%2F%2Fsparkplatform.com%2Fextensions%2Fspark%2F1.0&openid.ns.sreg=http%3A%2F%2Fopenid.net%2Fextensions%2Fsreg%2F1.1&openid.op_endpoint=https%3A%2F%2Fsparkplatform.com%2Fopenid%3Fsession_id%3D6e338a49c2eef5f2d4e36270c0647de5&openid.response_nonce=2016-12-19T02%3A25%3A26ZV3Hhkt&openid.return_to=https%3A%2F%2Fshireidx.herokuapp.com%2Fcallback&openid.sig=e582hxh5GzHutv0z%2FMIayGji6cw%3D&openid.signed=assoc_handle%2Cclaimed_id%2Cidentity%2Cmode%2Cns%2Cns.spark%2Cns.sreg%2Cop_endpoint%2Cresponse_nonce%2Creturn_to%2Csigned%2Cspark.code%2Csreg.fullname%2Csreg.nickname&openid.spark.code=6tbc7lcwmiedsbwrlnpokkrdb&openid.sreg.fullname=Paul+Amato&openid.sreg.nickname=20140811174925623895000000
function oauthHeaders() {
    return {
        'X-SparkApi-User-Agent': 'DevApp',
        'Authorization': 'OAuth ' + oauthData.access_token,
        'Content-Type': 'application/json'
    };
}
function requestWithPageOps(ops) {
    return Promise.resolve((0, _requestPromise2.default)(ops));
}
function sizeAndSave(most, full, basic, keypath, idpath, citykey, cityid, zippath, streetpath, streetnumpath) {

    var sizeLarge = size({ url: basic.PhotoLarge }, function (err, dimensions, length) {
        full['PhotoLarge']['size'] = _firebaseSafekey2.default.safe(dimensions);
        var entry = {};

        // let most = Object.assign({},mostof)

        // idpath.update(nbasic);
        // citypath.update(nbasic);
        // zippath.update(nbasic);
        // streetpath.update(nbasic);
        // streetnumpath.update(nbasic);
        entry[idpath] = most.ShireKey; //entry[idpath] = {ShireKey:most.ShireKey,City:most.City,PhotoThumb:full.PhotoThumb.url,StreetAddressOnly:full.StreetAddressOnly};
        entry[keypath] = full;
        entry[citykey] = basic;
        entry[cityid] = basic.ShireKey;
        entry[zippath] = basic.ShireKey;
        entry[streetpath] = basic.ShireKey;
        entry[streetnumpath] = basic.ShireKey;
        return dB.ref('/').update(entry);
    });
    var size300 = size({ url: basic.Photo300 }, function (err, dimensions, length) {
        full['Photo300']['size'] = _firebaseSafekey2.default.safe(dimensions);
        var entry = {};
        // let most = Object.assign({},full)

        // idpath.update(nbasic);
        // citypath.update(nbasic);
        // zippath.update(nbasic);
        // streetpath.update(nbasic);
        // streetnumpath.update(nbasic);
        entry[keypath] = full;
        entry[idpath] = most.ShireKey; //entry[idpath] = {ShireKey:most.ShireKey,City:most.City,PhotoThumb:full.PhotoThumb.url,StreetAddressOnly:full.StreetAddressOnly};
        entry[citykey] = basic;
        entry[cityid] = basic.ShireKey;
        entry[zippath] = basic.ShireKey;
        entry[streetpath] = basic.ShireKey;
        entry[streetnumpath] = basic.ShireKey;
        return dB.ref('/').update(entry);
    });

    return Promise.all([sizeLarge, size300]).then(function (donedoing) {
        console.log('sized-' + JSON.stringify({ donedoing: donedoing }));
    }).catch(function (e) {
        console.log(e);
    });
}
function promiseSaveListings(listings) {

    var updates = {};
    var obj = [];
    var allupdates = [];
    var ShireKey = void 0;
    var entries = void 0;
    listings.forEach(function (lsts) {
        if (!lsts.D) {
            console.log('no D found in results - inside :' + JSON.stringify(lsts));
            return Promise.resolve(lsts);
        } else {
            if (lsts['D']['Results']) {

                var dopromises = lsts['D']['Results'].map(function (listing) {
                    var exists = idsnap.child(listing.Id).exists();
                    if (exists == true) {
                        var currentkey = idsnap.child(listing.Id).val();
                        fbinit.database().ref('/listings/keys/' + currentkey).once("value", function (snapshot) {

                            var current = snapshot.val();
                            return (0, _requestPromise2.default)({ headers: oauthHeaders(), uri: 'https://sparkapi.com/v1/listings/' + current.Id + '?_expand=Photos', json: true }).then(function (pb) {
                                var lkey = currentkey;
                                var full = Object.assign(current, _firebaseSafekey2.default.safe(pb['D']['Results'][0]['StandardFields']));
                                var some = Object.assign(current, _firebaseSafekey2.default.safe(pb['D']['Results'][0]['StandardFields']));
                                var all = Object.assign(some, _firebaseSafekey2.default.safe(pb['D']['Results'][0]['CustomFields']));
                                var entry = {};
                                var most = {
                                    Id: full.Id,
                                    City: full.City,
                                    ShireKey: full.ShireKey,
                                    Zip: full.PostalCode,
                                    StreetAddressOnly: full.StreetAddressOnly,
                                    FullAddress: full.FullAddress,
                                    Price: full.ListPrice,
                                    Beds: full.BedsTotal,
                                    Baths: full.BathsTotal,
                                    Acres: full.LotSizeAcres,
                                    Photo300: full.Photo300,
                                    PhotoLarge: full.PhotoLarge,
                                    PhotoThumb: full.PhotoThumb,
                                    PhotoCaption: full.PhotoCaption,
                                    YearBuilt: full.YearBuilt,
                                    LivingArea: full.LivingArea,
                                    HighSchool: full.HighSchool,
                                    MiddleOrJuniorSchool: full.MiddleOrJuniorSchool,
                                    ElementarySchool: full.ElementarySchool,
                                    Neighborhood: full.SubdivisionName,
                                    BuildingArea: full.BuildingAreaTotal,
                                    Type: full.PropertySubType,
                                    ListPrice: full.ListPrice,
                                    Latitude: full.Latitude,
                                    Longitude: full.Longitude,
                                    MlsStatus: full.MlsStatus,
                                    PublicRemarks: full.PublicRemarks,
                                    StreetNumber: full.StreetNumber,
                                    StreetName: full.StreetName,
                                    StreetSuffix: full.StreetSuffix,
                                    All: all
                                };
                                if (full.Videos) {
                                    most['Videos'] = full.Videos;
                                }
                                if (full.Photos) {
                                    most['PrimaryPhotos'] = current.PrimaryPhotos;
                                }
                                var basic = {
                                    Id: full.Id,
                                    ShireKey: full.ShireKey,
                                    City: full.City,
                                    Photo300: full.Photo300.url,
                                    PhotoLarge: full.PhotoLarge.url,
                                    PhotoThumb: full.PhotoThumb.url,
                                    PublicRemarks: full.PublicRemarks,
                                    StreetAddressOnly: full.StreetAddressOnly,
                                    ListPrice: full.ListPrice,
                                    BedsTotal: full.BedsTotal,
                                    BathsTotal: full.BathsTotal,
                                    MlsStatus: full.MlsStatus,
                                    Latitude: full.Latitude,
                                    Longitude: full.Longitude,
                                    Zip: full.PostalCode
                                };

                                basic = Object.assign({}, _firebaseSafekey2.default.safe(basic));
                                ShireKey = current.ShireKey;
                                var keypath = '/listings/keys/' + current.ShireKey;
                                var idpath = '/listings/id/' + current.Id;
                                var basicpath = '/listings/basic/' + current.ShireKey;

                                var citykeypath = '/listings/location/city/' + current.City + '/keys/' + ShireKey;
                                var cityidpath = '/listings/location/city/' + current.City + '/id/' + current.Id;
                                var citystatuskeypath = '/listings/location/city/' + most.City + '/' + most.MlsStatus + '/key/' + most.ShireKey;
                                var citystatusidpath = '/listings/location/city/' + most.City + '/' + most.MlsStatus + '/id/' + most.Id;
                                var zippath = '/listings/location/zip/' + current.Zip + '/' + current.Id;
                                var streetnamepath = '/listings/location/street/name/' + current['StreetName'] + '/' + current.Id;
                                var streetnumpath = '/listings/location/street/number/' + current['StreetNumber'] + '/' + current.Id;
                                entry[basicpath] = basic;
                                entry[idpath] = most.ShireKey; //entry[idpath] = {ShireKey:most.ShireKey,City:most.City,PhotoThumb:full.PhotoThumb.url,StreetAddressOnly:full.StreetAddressOnly};
                                entry[keypath] = most;
                                entry[citykeypath] = basic;
                                entry[cityidpath] = basic;
                                entry[zippath] = basic;
                                entry[streetnamepath] = basic;
                                entry[streetnumpath] = basic;
                                dB.ref('/').update(entry);
                                sizeAndSave(most, most, basic, keypath, idpath, citystatuskeypath, citystatusidpath, zippath, streetnamepath, streetnumpath);
                            });
                        });
                    } else {
                        var parr = [{
                            ResourceUri: "unset",
                            Id: "0",
                            Name: "PlaceHolder",
                            Caption: "PlaceHolder",
                            UriThumb: "https://shireidx.herokuapp.com/placeholders/shireThumb.png",
                            Uri300: "https://shireidx.herokuapp.com/placeholders/shire300.png",
                            Uri640: "https://shireidx.herokuapp.com/placeholders/shire640.png",
                            Uri800: "https://shireidx.herokuapp.com/placeholders/shire800.png",
                            Uri1024: "https://shireidx.herokuapp.com/placeholders/shire1024.png",
                            Uri1280: "https://shireidx.herokuapp.com/placeholders/shire1280.png",
                            Uri1600: "https://shireidx.herokuapp.com/placeholders/shire1600.png",
                            Uri2048: "https://shireidx.herokuapp.com/placeholders/shire2048.png",
                            UriLarge: "https://shireidx.herokuapp.com/placeholders/shire1024.png",
                            Primary: true
                        }];
                        var sf = Object.assign({}, listing['StandardFields']);
                        var primaryphotos = parr[0];
                        if (Object.keys(listing['StandardFields']).includes('Photos')) {
                            primaryphotos = Object.assign(parr[0], sf['Photos'][0]);
                        }

                        var photoentry = Object.assign(parr[0], primaryphotos);
                        var vids = [];
                        if (sf.VideosCount > 0) {
                            vids = sf.Videos;
                        }
                        var suf = sf.StreetSuffix ? sf.StreetSuffix : '';
                        var sao = sf.StreetNumber + ' ' + sf.StreetName + ' ' + suf;
                        var uplist = {
                            Id: listing.Id,
                            City: sf.City,
                            ShireKey: '',
                            Zip: sf.PostalCode,
                            StreetAddressOnly: sao,
                            FullAddress: sf.UnparsedAddress,
                            Price: sf.ListPrice,
                            Beds: sf.BedsTotal,
                            Baths: sf.BathsTotal,
                            Acres: sf.LotSizeAcres,
                            Photo300: { url: photoentry.Uri300, size: { height: '', width: '', type: '', length: ' ' }, key: 'Photo300' },
                            PhotoLarge: { url: photoentry.UriLarge, size: { height: '', width: '', type: '', length: ' ' }, key: 'PhotoLarge' },
                            PhotoThumb: { url: photoentry.UriThumb },
                            PhotoCaption: photoentry.Caption,
                            YearBuilt: sf.YearBuilt,
                            LivingArea: sf.LivingArea,
                            HighSchool: sf.HighSchool,
                            MiddleOrJuniorSchool: sf.MiddleOrJuniorSchool,
                            ElementarySchool: sf.ElementarySchool,
                            Neighborhood: sf.SubdivisionName,
                            BuildingArea: sf.BuildingAreaTotal,
                            Type: sf.PropertySubType,
                            ListPrice: sf.ListPrice,
                            Latitude: sf.Latitude,
                            Longitude: sf.Longitude,
                            MlsStatus: sf.MlsStatus,
                            PublicRemarks: sf.PublicRemarks,
                            StreetNumber: sf.StreetNumber,
                            StreetName: sf.StreetName,
                            StreetSuffix: sf.StreetSuffix
                        };
                        if (sf.Videos.length > 0) {
                            uplist['Videos'] = sf.Videos;
                        }
                        if (sf.Photos.length > 0) {
                            uplist['PrimaryPhotos'] = sf.Photos[0];
                        } else {
                            uplist['PrimaryPhotos'] = photoentry;
                        }
                        var basic = {
                            Id: listing.Id,
                            ShireKey: '',
                            City: sf.City,
                            Photo300: photoentry.Uri300,
                            PhotoLarge: photoentry.UriLarge,
                            PhotoThumb: photoentry.UriThumb,
                            PublicRemarks: sf.PublicRemarks,
                            StreetAddressOnly: sao,
                            ListPrice: sf.ListPrice,
                            BedsTotal: sf.BedsTotal,
                            BathsTotal: sf.BathsTotal,
                            MlsStatus: sf.MlsStatus,
                            Latitude: sf.Latitude,
                            Longitude: sf.Longitude,
                            Zip: sf.PostalCode

                        };
                        uplist = Object.assign({}, _firebaseSafekey2.default.safe(uplist));
                        basic = Object.assign({}, _firebaseSafekey2.default.safe(basic));
                        var full = Object.assign(uplist, _firebaseSafekey2.default.safe(sf));
                        ShireKey = dB.ref('/listings/keys/').push(full).key;
                        var arru = {};

                        basic.ShireKey = ShireKey;
                        uplist['ShireKey'] = ShireKey;
                        full['ShireKey'] = ShireKey;
                        arru['/listings/basic/' + ShireKey] = basic;
                        arru['/listings/keys/' + ShireKey] = uplist;
                        arru['/listings/location/city/' + uplist.City + '/' + uplist.MlsStatus + '/id/' + uplist.Id] = ShireKey;
                        arru['/listings/location/city/' + uplist.City + '/' + uplist.MlsStatus + '/key/' + uplist.ShireKey] = basic;
                        dB.ref('/').update(arru);
                        var keypath = '/listings/keys/' + uplist.ShireKey;
                        var idpath = '/listings/id/' + uplist.Id;
                        var citykeypath = '/listings/location/city/' + uplist.City + '/' + uplist.MlsStatus + '/key/' + uplist.ShireKey;
                        var cityidpath = '/listings/location/city/' + uplist.City + '/' + uplist.MlsStatus + '/id/' + uplist.Id;
                        var zippath = '/listings/location/zip/' + uplist.Zip + '/' + uplist.Id;
                        var streetnamepath = '/listings/location/street/name/' + uplist['StreetName'] + '/' + uplist.Id;
                        var streetnumpath = '/listings/location/street/number/' + uplist['StreetNumber'] + '/' + uplist.Id;

                        return sizeAndSave(uplist, uplist, basic, keypath, idpath, citykeypath, cityidpath, zippath, streetnamepath, streetnumpath);
                    }
                });
                return Promise.all(dopromises).then(function (idid) {});
            }
        }
    });
}
function getPage(ops) {
    console.log('getting with ops:' + JSON.stringify(ops));
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            return resolve(ops);
        }, 250000);
    }) //250  seconds
    .catch(function (err) {
        return console.log("error: " + JSON.stringify(ops), err);
    });
}
function getListings(req, res, filter, addr) {}
function makeUrl(args) {
    var zipcode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var proptype = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var base = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'https://sparkapi.com/v1/listings?';
    var status = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    var argfilter = args['_filter'] ? args['_filter'] : '';
    var andT = args['_filter'] ? ' And ' : '';
    var zipfilter = zipcode ? argfilter + andT + ('" PostalCode Eq \'' + zipcode + '\'') : argfilter;
    var andZ = zipcode ? andT : '';
    var proptypefilter = proptype ? zipfilter + andZ + " PropertyType Eq '" + proptype + "'" : zipfilter;
    var andP = zipcode ? andT : '';
    var statusFilter = status ? proptypefilter + andP + " MlsStatus Eq '" + status + "'" : proptypefilter;
    // let limit = args['_select']?25:25
    var formatargs = {
        // _pagination:'1',
        _orderby: 'City',
        _filter: args['_filter'],
        _limit: 50,
        // _page:      1,
        _select: 'Videos,Photos.Uri640,Photos.Uri800,Photos.Uri1024,Photos.Uri1280,Photos.Uri1600,Photos.Uri2048,Photos.UriThumb,Photos.UriLarge,Photos.Uri300,Photos.Caption,PrimaryPhoto,StreetNumber,StreetName,StreetSuffix,PostalCode,ListPrice,City,BedsTotal,BathsTotal,PublicRemarks,PropertyType,MlsStatus,Latitude,ListingId,Longitude,PostalCode,YearBuilt,LivingArea,HighSchool,MiddleOrJuniorSchool,ElementarySchool,SubdivisionName,BuildingAreaTotal,PropertySubType,UnparsedAddress,LotSizeArea,LotSizeAcres,CustomFields'
    };
    // formatargs['_page'] = args['_page']?args['_page']:1
    // formatargs['_select'] = select
    args = Object.assign({}, formatargs);
    var arr = Object.keys(args).map(function (key) {
        var argEntry = formatargs[key] ? formatargs[key] : args[key];
        var entry = key + "=" + argEntry;
        return entry;
    });
    return base + arr.join('&');
}
function promiseTo(doThis) {
    console.log('promised to do something ...');
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            return resolve(doThis);
        }, 1 * doThis);
    });
}
function refreshAuth(oa) {
    var headers = {
        'X-SparkApi-User-Agent': 'IDX Agent',
        'Content-Type': 'application/json'
    };
    var authbody = Object.assign(oauthData, { grant_type: 'refresh_token' });
    var rauth = {
        url: 'https://sparkapi.com/v1/oauth2/grant',
        method: 'POST',
        headers: headers,
        body: authbody,
        json: true
    };

    console.log('refreshing with :' + JSON.stringify(rauth.body));

    (0, _requestPromise2.default)(rauth).then(function (pb) {
        console.log('got response ... :' + pb);
        saveOauthData(pb);
    }).catch(_errors2.default.StatusCodeError, function (reason) {
        console.log('Reason:' + reason + '          #####################   Status Code : ' + reason.statusCode);
    }).catch(_errors2.default.RequestError, function (reason) {
        console.log(reason);
    });
}
app.get('/remove', function (req, res) {
    dB.ref('/listings').remove().then(function (e) {
        res.send('cleared ');
    });
});
app.get('/addr/:addr', function (req, res) {
    fbinit.database().ref('/listings/id').once("value", function (snapshot) {
        idsnap = snapshot;
        var addr = req.params.addr;

        var filter = "PropertyType Eq 'A' And MlsStatus Eq 'Active' And (City Eq '" + addr + "' Or StreetAddress Eq '" + addr + "')";
        console.log(filter);
        var combo = [];
        var obj = [];
        var pageops = [];
        var setargs = {
            _filter: filter
        };
        var pagearr = [];

        var opsurl = makeUrl(setargs, null, 'A', 'https://sparkapi.com/v1/listings?', 'Active');
        var authops = {
            headers: oauthHeaders(),
            uri: opsurl + '&_pagination=count&_page=1',
            json: true
        };
        console.log('about to request...' + JSON.stringify(authops));
        (0, _requestPromise2.default)(authops).then(function (pb) {
            // results.concat(pb['D']['Results']);
            console.log('pagei:' + JSON.stringify(pb['D']['Pagination']));

            var pages = pb['D']['Pagination']['TotalPages'];
            var currentpage = pb['D']['Pagination']['CurrentPage'];
            pagearr.push({ headers: oauthHeaders(), uri: opsurl + '&_pagination=1&_page=' + pages, json: true });

            for (var page = 1; page < pages; page++) {
                var pageReq = {};
                var newops = { headers: oauthHeaders(), uri: opsurl + '&_pagination=1&_page=' + page, json: true };
                pagearr.push(newops);
            }

            var promisedPages = pagearr.map(function (ops) {
                console.log('mapping ops :' + JSON.stringify(ops));

                return requestWithPageOps(ops);
            });
            Promise.all(promisedPages).then(function (pb) {
                promiseSaveListings(pb);
            }).then(function (f) {
                res.render('pages/spark', { results: Object.keys(f).map(function (key) {
                        return key = f[key];
                    })
                });
            }).catch(_errors2.default.StatusCodeError, function (reason) {
                // The server responded with a status codes other than 2xx.
                // Check
                if (reason.statusCode == 401) {
                    console.log(reason);
                    refreshAuth(oauthData);
                }
            })
            // .catch(this.checkStatus)
            .catch(_errors2.default.RequestError, function (reason) {
                // reason.cause is the Error object Request would pass into a callback.
                console.log(reason.cause);
            }).catch(function (e) {
                // reason.cause is the Error object Request would pass into a callback.
                console.log('e:' + e);
            });
            console.log('going!');
        }).catch(_errors2.default.StatusCodeError, function (reason) {
            // The server responded with a status codes other than 2xx.
            // Check
            if (reason.statusCode == 401) {
                console.log(reason);
                refreshAuth(oauthData);
            }
        })
        // .catch(this.checkStatus)
        .catch(_errors2.default.RequestError, function (reason) {
            // reason.cause is the Error object Request would pass into a callback.
            console.log(reason.cause);
        }).catch(function (e) {
            // reason.cause is the Error object Request would pass into a callback.
            console.log('e:' + e);
        });
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});
app.get('/primary', function (req, res) {
    fbinit.database().ref('/listings/id').once("value", function (snapshot) {
        idsnap = snapshot;
        ls = [];
        var cities = ['Manasquan', 'Wall', 'Avon-by-the-sea', 'Sea Girt', 'Belmar', 'Spring Lake', 'Spring Lake Heights', 'Brielle', 'Point Pleasant', 'Point Pleasant Beach', 'Bay Head', 'Bradley Beach', 'Ocean Grove', 'Neptune', 'West Belmar', 'Asbury Park'];
        cities.forEach(function (addr) {
            var filter = "PropertyType Eq 'A' And MlsStatus Eq 'Active' And (City Eq '" + addr + "' Or StreetAddress Eq '" + addr + "')";
            console.log(filter);
            var combo = [];
            var obj = [];
            var pageops = [];
            var setargs = {
                _filter: filter
            };
            var pagearr = [];

            var opsurl = makeUrl(setargs, null, 'A', 'https://sparkapi.com/v1/listings?', 'Active');
            var authops = {
                headers: oauthHeaders(),
                uri: opsurl + '&_pagination=count&_page=1',
                json: true
            };
            console.log('about to request...' + JSON.stringify(authops));
            (0, _requestPromise2.default)(authops).then(function (pb) {
                // results.concat(pb['D']['Results']);
                console.log('pagei:' + JSON.stringify(pb['D']['Pagination']));

                var pages = pb['D']['Pagination']['TotalPages'];
                var currentpage = pb['D']['Pagination']['CurrentPage'];
                pagearr.push({ headers: oauthHeaders(), uri: opsurl + '&_pagination=1&_page=' + pages, json: true });

                for (var page = 1; page < pages; page++) {
                    var pageReq = {};
                    var newops = { headers: oauthHeaders(), uri: opsurl + '&_pagination=1&_page=' + page, json: true };
                    pagearr.push(newops);
                }

                var promisedPages = pagearr.map(function (ops) {
                    console.log('mapping ops :' + JSON.stringify(ops));

                    return requestWithPageOps(ops);
                });
                Promise.all(promisedPages).then(function (pb) {
                    promiseSaveListings(pb);
                });
            }).catch(_errors2.default.StatusCodeError, function (reason) {
                // The server responded with a status codes other than 2xx.
                // Check
                if (reason.statusCode == 401) {
                    console.log('refreshing got code: ' + reason.statusCode);
                    refreshAuth(oauthData);
                }
            })
            // .catch(this.checkStatus)
            .catch(_errors2.default.RequestError, function (reason) {
                // reason.cause is the Error object Request would pass into a callback.
                console.log(reason.cause);
            }).catch(function (e) {
                // reason.cause is the Error object Request would pass into a callback.
                console.log('e:' + e);
            }).catch(_errors2.default.StatusCodeError, function (reason) {
                // The server responded with a status codes other than 2xx.
                // Check
                if (reason.statusCode == 401) {
                    console.log(reason);
                    refreshAuth(oauthData);
                }
            })
            // .catch(this.checkStatus)
            .catch(_errors2.default.RequestError, function (reason) {
                // reason.cause is the Error object Request would pass into a callback.
                console.log(reason.cause);
            }).catch(function (e) {
                // reason.cause is the Error object Request would pass into a callback.
                console.log('e:' + e);
            });
        });
        res.render('pages/spark', { results: Object.keys(ls).map(function (key) {
                return key = f[key];
            })
        });
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});
app.get('/callback', function (req, res) {
    var code = '';
    var hascode = false;
    var agentId = '';
    if (req.query['openid.spark.code']) {
        code = req.query['openid.spark.code'];
        hascode = true;
    }
    if (req.query['openid_spark_code']) {
        code = req.query['openid_spark_code'];
        hascode = true;
    }
    if (req.query['code']) {
        code = req.query['code'];
        hascode = true;
    }

    if (req.query['openid.spark.state']) {
        agentId = req.query['openid.spark.state'];
    }
    if (req.query['state']) {
        agentId = req.query['state'];
    }
    if (hascode == true) {
        fbinit.database().ref('/sparkauth/oauth').update({ code: code }).then(function () {
            console.log('updated code :' + code);
        });
    } else {
        console.log('did not update code : ' + code + ' hascode set to :' + hascode ? 'true' : 'false');
    }
    // console.log(req.query['openid.spark.code'] + ' : from callback');
    var options = void 0;
    fbinit.database().ref('/sparkauth/oauth').once("value", function (snapshot) {
        options = {
            method: 'POST',
            uri: 'https://sparkapi.com/v1/oauth2/grant',
            headers: {
                'X-SparkApi-User-Agent': 'Idx Agent',
                'Content-Type': 'application/json'
            },
            body: {
                client_id: snapshot.val().client_id,
                client_secret: snapshot.val().client_secret,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: snapshot.val().redirect_uri
            },
            json: true
        };
        console.log('using options :' + JSON.stringify(options));
        oauthData.client_id = snapshot.val().client_id;
        oauthData.client_secret = snapshot.val().client_secret;
        oauthData.access_token = snapshot.val().access_token;
        oauthData.refresh_token = snapshot.val().refresh_token;
        oauthData.redirect_uri = snapshot.val().redirect_uri;
        oauthData.expires_at = snapshot.val().expires_at ? snapshot.val().expires_at : "0";
        oauthData.code = snapshot.val().code;
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    }).then(function () {
        (0, _requestPromise2.default)(options).then(function (pb) {
            saveOauthData(pb);
            res.render('pages/spark', { results: Object.keys(pb).map(function (key) {
                    return key = pb[key];
                }) });
            // res.send('<strong>zip codes</strong><br><a href="/zip/07717"><br/><strong>zip 07717</strong><br><a href="/zip/08736"><strong>zip 08736</strong><br/><br/><strong>Log in</strong> with Spark</a>' +
            //     '<a href="https://sparkplatform.com/oauth2?response_type=code&client_id='+oauthData.client_id+'&redirect_uri='+oauthData.redirect_uri+'">Agent <strong>login</strong></a>');
        }).catch(function (err) {
            res.send(err + 'oops');
            console.log(err + 'uhoh');
            console.log('request failed', err);
        });
    });
});

app.get('/auth', function (req, res) {
    var uri = "https://sparkplatform.com/openid?openid.mode=checkid_setup&openid.return_to=" + oauthData.redirect_uri + "&openid.spark.client_id=" + oauthData.client_id + "&openid.spark.combined_flow=true";
    res.location(uri);
    res.send('<a href="https://sparkplatform.com/openid?openid.mode=checkid_setup&openid.return_to=' + oauthData.redirect_uri + '&openid.spark.client_id=' + oauthData.client_id + '&openid.spark.combined_flow=true">auth</a>');
});
//# sourceMappingURL=index.js.map