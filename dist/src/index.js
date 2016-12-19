'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _firebaseEncode = require('firebase-encode');

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _errors = require('request-promise/errors');

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

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
var allupdates = [];
var dB = _firebase2.default.database();
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
    console.log("saving OauthData ->" + od);
    return dB.ref('/sparkauth/oauth').update(od);
}
function handleCallback(req, res) {}
//https://searchidx.herokuapp.com/callback?openid.assoc_handle=%7BHMAC-SHA1%7D%7B58574516%7D%7B6I%2BC%2Bg%3D%3D%7D&openid.claimed_id=https%3A%2F%2Fsparkplatform.com%2Fopenid%2Fuserid%2Fmo.1524%3Fsession_id%3D6e338a49c2eef5f2d4e36270c0647de5&openid.identity=https%3A%2F%2Fsparkplatform.com%2Fopenid%2Fuserid%2Fmo.1524%3Fsession_id%3D6e338a49c2eef5f2d4e36270c0647de5&openid.mode=id_res&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.spark=http%3A%2F%2Fsparkplatform.com%2Fextensions%2Fspark%2F1.0&openid.ns.sreg=http%3A%2F%2Fopenid.net%2Fextensions%2Fsreg%2F1.1&openid.op_endpoint=https%3A%2F%2Fsparkplatform.com%2Fopenid%3Fsession_id%3D6e338a49c2eef5f2d4e36270c0647de5&openid.response_nonce=2016-12-19T02%3A25%3A26ZV3Hhkt&openid.return_to=https%3A%2F%2Fsearchidx.herokuapp.com%2Fcallback&openid.sig=e582hxh5GzHutv0z%2FMIayGji6cw%3D&openid.signed=assoc_handle%2Cclaimed_id%2Cidentity%2Cmode%2Cns%2Cns.spark%2Cns.sreg%2Cop_endpoint%2Cresponse_nonce%2Creturn_to%2Csigned%2Cspark.code%2Csreg.fullname%2Csreg.nickname&openid.spark.code=6tbc7lcwmiedsbwrlnpokkrdb&openid.sreg.fullname=Paul+Amato&openid.sreg.nickname=20140811174925623895000000
function oauthHeaders() {
    return {
        'X-SparkApi-User-Agent': 'DevApp',
        'Authorization': 'OAuth ' + oauthData.access_token,
        'Content-Type': 'application/json'
    };
}
function promiseSaveListings(listings) {
    function finishUpdate(uplst, ups, o, e, p) {
        console.log('next - saving now');
        e[p['idpath']] = uplst;
        e[p.zippath] = uplst;
        e[p.citypath] = uplst;
        e[p.streetpath] = uplst['Id'];
        e[p.streetnumpath] = uplst['Id'];
        //  console.log('updating!'+JSON.stringify(uplist))//
        o.push(uplst);
        ups = Object.assign(ups, e);
        allupdates.push(updates);
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                return resolve(ups);
            }, 25000);
        });
    }
    function minipromise(prom) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                return resolve(prom);
            }, 25000);
        });
    }

    var updates = {};
    var obj = [];
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            return resolve(listings);
        }, 2500);
    }) //2.5  seconds
    .then(function (listings) {
        listings.forEach(function (listing) {
            var uplist = { media: {} };
            uplist = Object.assign(uplist, listing.StandardFields);
            uplist['Id'] = listing['Id'];
            uplist['PhotoThumb'] = listing.StandardFields.Photos[0] ? listing.StandardFields.Photos[0].UriThumb : 'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png';
            uplist['media']['PhotoThumb'] = listing.StandardFields.Photos[0] ? listing.StandardFields.Photos[0].UriThumb : 'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png';
            uplist['PhotoLarge'] = listing.StandardFields.Photos[0].UriLarge ? listing.StandardFields.Photos[0].UriLarge : 'unset';
            uplist['media']['PhotoLarge'] = listing.StandardFields.Photos[0].UriLarge ? listing.StandardFields.Photos[0].UriLarge : 'unset';
            uplist['Photo800'] = listing.StandardFields.Photos[0].Uri800 ? listing.StandardFields.Photos[0].Uri800 : 'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png';
            uplist['media']['Photo800'] = listing.StandardFields.Photos[0].Uri800 ? listing.StandardFields.Photos[0].Uri800 : 'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png';
            uplist['Photo300'] = listing.StandardFields.Photos[0].Uri300 ? listing.StandardFields.Photos[0].Uri300 : 'unset';
            uplist['media']['Photo300'] = listing.StandardFields.Photos[0].Uri300 ? listing.StandardFields.Photos[0].Uri300 : 'unset';
            uplist['Photo1024'] = listing.StandardFields.Photos[0].Uri1024 ? listing.StandardFields.Photos[0].Uri1024 : 'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png';
            uplist['media']['Photo1024'] = listing.StandardFields.Photos[0].Uri1024 ? listing.StandardFields.Photos[0].Uri1024 : 'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png';
            uplist['PhotoId'] = listing.StandardFields.Photos[0].Id ? listing.StandardFields.Photos[0].Id : '0';
            uplist['PhotoCaption'] = listing.StandardFields.Photos[0].Caption ? listing.StandardFields.Photos[0].Caption : 'Photo Caption';
            var idpath = "/listings/id/" + listing['Id'];
            var entry = {};
            var entrygeo = {};
            var citypath = "/listings/location/city/" + uplist['City'] + "/" + listing['Id'];
            var zippath = "/listings/location/zip/" + uplist['PostalCode'] + "/" + listing['Id'];
            var streetpath = "/listings/location/street/name/" + (0, _firebaseEncode.encode)(uplist['StreetName']) + "/" + listing['Id'];
            var streetnumpath = "/listings/location/street/number/" + (0, _firebaseEncode.encode)(uplist['StreetNumber']) + "/" + listing['Id'];
            var paths = { idpath: idpath, citypath: citypath, zippath: zippath, streetpath: streetpath, streetnumpath: streetnumpath };

            // size({url: uplist['PhotoLarge']},function (err, dimensions, length) {
            //     console.log(JSON.stringify(dimensions))
            //     uplist['PhotoLargeH'] = dimensions.height;
            //     uplist['PhotoLargeW'] = dimensions.width;
            //     finishUpdate(uplist,updates,obj,entry,paths);
            // })

            var saving = {};
            if (uplist['Photos'][0]) {
                var _saving = Object.keys(uplist['media']).forEach(function (key) {
                    size({ url: uplist['media'][key] }, function (err, dimensions, length) {
                        console.log(JSON.stringify(dimensions));
                        uplist['media'][key];
                        uplist['media'][key + '_size'] = dimensions;
                        uplist['media'][key + '_width'] = dimensions.width;
                        finishUpdate(uplist, updates, obj, entry, paths);
                    }).then(function (g) {
                        console.log(JSON.stringify(g));
                    }).catch(function (e) {
                        console.log('while sizing got error :' + e);
                    });
                });
            }
            minipromise(saving).then(function (enddata) {
                finishUpdate(uplist, updates, obj, entry, paths);
            }).catch(function (err) {
                return console.log("error: " + JSON.stringify(err));
            });
        });

        console.log('# of listings: ' + listings.length);
    }).then(function (end) {
        return end;
    }).catch(function (err) {
        return console.log("error: " + " " + JSON.stringify(listings), err.message);
    });
}
function removeall() {
    var remit = dB.ref('/listings').remove().then(function () {
        return "done clearing";
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
function getListings(req, res, filter, addr) {
    var combo = [];
    var obj = [];
    var pageops = [];
    var setargs = {
        _filter: filter
    };
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
        var pagearr = [];
        if (currentpage < pages) {

            for (var page = 1; page < pages; page++) {
                var pageReq = {};
                var newops = { headers: oauthHeaders(), uri: opsurl + '&_pagination=1&_page=' + page, json: true };
                pagearr.push(newops);
            }
        } else {
            var _newops = { headers: oauthHeaders(), uri: opsurl + '&_pagination=1&_page=1', json: true };
            pagearr.push(_newops);
        }
        var promisedPages = pagearr.map(function (ops) {
            return getPage((0, _requestPromise2.default)(ops).then(function (pb) {
                console.log('adding to combo' + pb['D']['Pagination']['CurrentPage']);
                promiseSaveListings(pb['D']['Results']);
            }));
        });
        Promise.all(promisedPages).then(function (endres) {
            // res.set({'Access-Control-Allow-Origin':'*'});
            console.log('saving combo with ' + combo.length);

            console.log('length:' + combo.length);
            // res.send(combo)
            // dB.ref('/').update(ups);
        }).then(function (endres) {
            dB.ref('/').update(allupdates);
        });
        ;
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
}

function makeUrl(args) {
    var zipcode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var proptype = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var base = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'https://sparkapi.com/v1/listings?';
    var status = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    var argfilter = args['_filter'] ? args['_filter'] : '';
    var select = 'StreetNumber,StreetName,PostalCode,ListPrice,City,BedsTotal,BathsTotal,PublicRemarks,PropertyType,MlsStatus,Photos,Latitude,ListingId,Longitude,PostalCode,PropertySubType,YearBuilt';
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
        _select: 'Photos.UriThumb,Photos.UriLarge,Photos.Uri300,Photos.Caption,PrimaryPhoto,StreetNumber,StreetName,StreetSuffix,PostalCode,ListPrice,City,BedsTotal,BathsTotal,PublicRemarks,PropertyType,MlsStatus,Latitude,ListingId,Longitude,PostalCode,PropertySubType,YearBuilt'
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
    var rauth = {
        url: 'https://sparkapi.com/v1/oauth2/grant',
        method: 'POST',
        headers: headers,
        body: oa,
        json: true
    };

    rauth.body['grant_type'] = "refresh_token";
    console.log('refreshing with :' + JSON.stringify(rauth));

    (0, _requestPromise2.default)(rauth, function (err, res, body) {}).then(function (pb) {
        saveOauthData(pb);
    }).catch(_errors2.default.StatusCodeError, function (reason) {
        console.log('Reason:' + reason + '          #####################   Status Code : ' + reason.statusCode);
    }).catch(_errors2.default.RequestError, function (reason) {
        console.log(reason);
    });
}
app.get('/remove', function (req, res) {
    removeall();
    res.send('cleared ');
});
app.get('/addr/:addr', function (req, res) {
    var addr = req.params.addr;

    var thefilter = "PropertyType Eq 'A' And MlsStatus Eq 'Active' And (City Eq '" + addr + "' Or StreetAddress Eq '" + addr + "')";
    console.log(thefilter);
    getListings(req, res, thefilter, addr);
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
            body: JSON.stringify({
                client_id: snapshot.val().client_id,
                client_secret: snapshot.val().client_secret,
                grant_type: "authorization_code",
                code: hascode ? code : snapshot.val().code,
                redirect_uri: snapshot.val().redirect_uri
            }),
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