import express from "express";
import fb from 'firebase'
import rp from 'request-promise';
let app = express();
let listingObj = {BathsTotal:null,BedsTotal:null,City:null,Id:null,Latitude:null,ListPrice:null,ListingId:null,Longitude:null,MlsId:null,MlsStatus:null,PhotoCaption:'Loading',PhotoLarge:'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire320x220.png',PhotoThumb:'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png',Photos:[{Caption:'Loading',Uri300:'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png',UriLarge:'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png',UriThumb:'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png'}],PostalCode:null,PropertySubType:null,PropertyType:null,PublicRemarks:'Loading',StreetName:null,StreetNumber:null,StreetSuffix:null,YearBuilt:null,completed:null,geo:{}};

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('pages/index');
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

//import path from 'path';

//let server = require('https').Server(app);
const Promise = require('bluebird'),
    size = Promise.promisify(require('request-image-size'));
import {
    encode,
    decode,
    encodeComponents,
    decodeComponents,
} from 'firebase-encode';
import fetch from 'node-fetch'
import errors from 'request-promise/errors';
let fbinit = fb.initializeApp({
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

let oauthData = {
    client_id: ' ',
    client_secret: '',
    access_token: '',
    refresh_token: '',
    redirect_uri: '',
    expires_at: '',
    code:''
}
let dB = fbinit.database();
fbinit.database().ref('/sparkauth/oauth').on("value", function(snapshot) {
    oauthData.client_id= snapshot.val().client_id
    oauthData.client_secret= snapshot.val().client_secret
    oauthData.access_token= snapshot.val().access_token
    oauthData.refresh_token= snapshot.val().refresh_token
    oauthData.redirect_uri= snapshot.val().redirect_uri
    oauthData.expires_at= snapshot.val().expires_at?snapshot.val().expires_at:"0"
    oauthData.code = snapshot.val().code
    console.log("auth updated!"+JSON.stringify(oauthData));

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

function checkStatus(response){
    if (response.statusCode == 401) {
        console.log('response = 401 ? '+response.statusCode)
        // let oauthData = Object.assign({},oauthData)
        // let fBdB = this.fBdB
        return refreshAuth(oauthData);
    }
    if (response.statusCode >= 200 && response.statusCode < 300) {
        return response
    } else {
        let error = new Error(response.statusText)
        error.response = response
        console.log('got error while checking status '+error);
    }
}
function saveOauthData(od) {
    console.log("saving OauthData ->"+od);
    return dB.ref('/sparkauth/oauth').update(od)
}
function handleCallback(req, res) {

}
//https://searchidx.herokuapp.com/callback?openid.assoc_handle=%7BHMAC-SHA1%7D%7B58574516%7D%7B6I%2BC%2Bg%3D%3D%7D&openid.claimed_id=https%3A%2F%2Fsparkplatform.com%2Fopenid%2Fuserid%2Fmo.1524%3Fsession_id%3D6e338a49c2eef5f2d4e36270c0647de5&openid.identity=https%3A%2F%2Fsparkplatform.com%2Fopenid%2Fuserid%2Fmo.1524%3Fsession_id%3D6e338a49c2eef5f2d4e36270c0647de5&openid.mode=id_res&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.spark=http%3A%2F%2Fsparkplatform.com%2Fextensions%2Fspark%2F1.0&openid.ns.sreg=http%3A%2F%2Fopenid.net%2Fextensions%2Fsreg%2F1.1&openid.op_endpoint=https%3A%2F%2Fsparkplatform.com%2Fopenid%3Fsession_id%3D6e338a49c2eef5f2d4e36270c0647de5&openid.response_nonce=2016-12-19T02%3A25%3A26ZV3Hhkt&openid.return_to=https%3A%2F%2Fsearchidx.herokuapp.com%2Fcallback&openid.sig=e582hxh5GzHutv0z%2FMIayGji6cw%3D&openid.signed=assoc_handle%2Cclaimed_id%2Cidentity%2Cmode%2Cns%2Cns.spark%2Cns.sreg%2Cop_endpoint%2Cresponse_nonce%2Creturn_to%2Csigned%2Cspark.code%2Csreg.fullname%2Csreg.nickname&openid.spark.code=6tbc7lcwmiedsbwrlnpokkrdb&openid.sreg.fullname=Paul+Amato&openid.sreg.nickname=20140811174925623895000000
function oauthHeaders(){
    return {
        'X-SparkApi-User-Agent': 'DevApp',
        'Authorization': 'OAuth '+oauthData.access_token,
        'Content-Type': 'application/json'
    };
}
function requestWithPageOps(ops){
        return new Promise(function(resolve, reject) {
            rp(ops)
                .then(pb=>{
                resolve(pb['D']['Results']);
                })
                .catch(e=>{
                reject(Error('listings didnt load' + e));
                })
            })
}
function sizeAndSave(listing,idpath,citypath,zippath,streetpath,streetnumpath){
    return new Promise(function (resolve,reject) {
    let entry={};
        let sizeLarge = size({url: uplist.PhotoLarge.url},function (err, dimensions, length) {
            uplist.PhotoLarge.size = dimensions;})
            let size300 = size({url: uplist.Photo300.url},function (err, dimensions, length) {
                uplist.Photo300.size = dimensions;
                })

        Promise.all([sizeLarge,size300]).then(donedoing=>{
let nuplist = encode(JSON.stringify(uplist))
            entry[idpath] = nuplist;
        entry[citypath] = nuplist;
        entry[zippath] = nuplist;
        entry[streetpath] = nuplist;
        entry[streetnumpath] = nuplist;
        dB.ref('/').update(entry).then(endit=>{
            resolve(listing)
        });})
    })
}
function promiseSaveListings(listings){

    let updates = {}
    let obj = []
    return new Promise(function(resolve, reject) {
        let allupdates=[];
       let dopromises = listings.map(listing=> {
            let parr = [
                {
                    ResourceUri: "unset",
                    Id: "0",
                    Name: "PlaceHolder",
                    Caption: "PlaceHolder",
                    UriThumb: "https://searchidx.herokuapp.com/placeholders/shireThumb.png",
                    Uri300: "https://searchidx.herokuapp.com/placeholders/shire300.png",
                    Uri640: "https://searchidx.herokuapp.com/placeholders/shire640.png",
                    Uri800: "https://searchidx.herokuapp.com/placeholders/shire800.png",
                    Uri1024: "https://searchidx.herokuapp.com/placeholders/shire1024.png",
                    Uri1280: "https://searchidx.herokuapp.com/placeholders/shire1280.png",
                    Uri1600: "https://searchidx.herokuapp.com/placeholders/shire1600.png",
                    Uri2048: "https://searchidx.herokuapp.com/placeholders/shire2048.png",
                    UriLarge: "https://searchidx.herokuapp.com/placeholders/shire1024.png",
                    Primary: true
                }
            ];
            let sf = Object.assign({},listing['StandardFields']);
            let primaryphotos = parr[0];
            if(Object.keys(listing['StandardFields']).includes('Photos')){
            primaryphotos = Object.assign(primaryphotos,sf['Photos'][0])}
            let photoentry = Object.assign(parr[0],primaryphotos)
            let uplist = {
                Id:listing.Id,
                City:sf.City,
                Zip:sf.PostalCode,
                StreetAddress:sf.StreetNumber+' '+sf.StreetName+' '+sf.StreetSuffix,
                FullAddress:sf.UnparsedAddress,
                Price:sf.ListPrice,
                Beds:sf.BedsTotal,
                Baths:sf.BathsTotal,
                Acres:sf.LotSizeAcres,
                Photo300:{url:photoentry.Uri300,size:null,key:'Photo300'},
                PhotoLarge:{url:photoentry.UriLarge,size:null,key:'PhotoLarge'},
                PhotoThumb:{url:photoentry.UriThumb},
                PhotoCaption:photoentry.Caption,
                YearBuilt:sf.YearBuilt,
                LivingArea:sf.LivingArea,
                HighSchool:sf.HighSchool,
                MiddleOrJuniorSchool:sf.MiddleOrJuniorSchool,
                ElementarySchool:sf.ElementarySchool,
                Neighborhood:sf.SubdivisionName,
                BuildingArea:sf.BuildingAreaTotal,
                Type:sf.PropertySubType
            }
            let entry = {}
            let full = encode(JSON.stringify(Object.assign(uplist,{CustomFields:listing['CustomFields'],StandardFields:sf})))
            let listingkey = dB.ref('/listings/keys/').push(full);
            uplist['key']=listingkey;
            let streetnumsafe ="/listings/location/street/number/" + encode(uplist['StreetNumber']);
            let streetnamesafe = "/listings/location/street/name/" + encode(uplist['StreetName']);
            let idpath = "/listings/id/" + uplist['Id']
            let citypath = "/listings/location/city/" + uplist['City'];
            let zippath = "/listings/location/zip/" + uplist['PostalCode'];
            let streetpath = streetnamesafe;
            let streetnumpath =streetnumsafe;

            return sizeAndSave(uplist,idpath,citypath,zippath,streetpath,streetnumpath)
       })
    Promise.all(dopromises).then(idid=>{
    resolve(listings)
    })})
    }
function getPage(ops){
    console.log('getting with ops:'+JSON.stringify(ops))
    return new Promise(function(resolve, reject) {
        setTimeout(() => resolve(ops), 250000 );})//250  seconds
        .catch((err) => console.log("error: "+JSON.stringify(ops), err));
}
function getListings(req,res, filter,addr) {
    let combo = [];
    let obj = []
    let pageops = [];
    let setargs = {
        _filter: filter
    };
    let opsurl = makeUrl(setargs, null, 'A', 'https://sparkapi.com/v1/listings?', 'Active');
    let authops = {
        headers: oauthHeaders(),
        uri: opsurl + '&_pagination=count&_page=1',
        json: true
    };
    console.log('about to request...' + JSON.stringify(authops))
    rp(authops)
        .then(pb => {
            // results.concat(pb['D']['Results']);
            console.log('pagei:' + JSON.stringify(pb['D']['Pagination']))

            let pages = pb['D']['Pagination']['TotalPages'];
            let currentpage = pb['D']['Pagination']['CurrentPage'];
            let pagearr = []
            if (currentpage < pages) {

                for (let page = 1; page < pages; page++) {
                    let pageReq = {};
                    let newops = {headers: oauthHeaders(), uri: opsurl + '&_pagination=1&_page=' + page, json: true};
                    pagearr.push(newops)

                }
            } else {
                let newops = {headers: oauthHeaders(), uri: opsurl + '&_pagination=1&_page=1', json: true};
                pagearr.push(newops)
            }
            let promisedPages = pagearr.map(ops => {
                console.log('mapping ops :'+JSON.stringify(ops));

                requestWithPageOps(ops).then(listings=>{
                    console.log('made req .. now save (length is):'+listings.length);
                    return promiseSaveListings(listings)})

            })
            Promise.all(promisedPages)
                .then(listings => {
                    console.log('promise all ... '+listings.length);
                })
                .catch(errors.StatusCodeError, function (reason) {
                    // The server responded with a status codes other than 2xx.
                    // Check
                    if (reason.statusCode == 401) {
                        console.log(reason)
                        refreshAuth(oauthData)
                    }
                })
                // .catch(this.checkStatus)
                .catch(errors.RequestError, function (reason) {
                    // reason.cause is the Error object Request would pass into a callback.
                    console.log(reason.cause)
                })
                .catch(e => {
                    // reason.cause is the Error object Request would pass into a callback.
                    console.log('e:' + e)
                })
            console.log('going!')

        }).catch(errors.StatusCodeError, function (reason) {
        // The server responded with a status codes other than 2xx.
        // Check
        if (reason.statusCode == 401) {
            console.log(reason)
            refreshAuth(oauthData)
        }
    })
    // .catch(this.checkStatus)
        .catch(errors.RequestError, function (reason) {
            // reason.cause is the Error object Request would pass into a callback.
            console.log(reason.cause)
        })
        .catch(e => {
            // reason.cause is the Error object Request would pass into a callback.
            console.log('e:' + e)
        })
}
function makeUrl(args,zipcode=null,proptype=null,base='https://sparkapi.com/v1/listings?',status=null){
    let argfilter = args['_filter']?args['_filter']:''
    let andT = args['_filter']?' And ':''
    let zipfilter = zipcode?argfilter+andT+`" PostalCode Eq '${zipcode}'`:argfilter
    let andZ = zipcode?andT:''
    let proptypefilter = proptype?zipfilter+andZ+" PropertyType Eq '"+proptype+"'":zipfilter
    let andP = zipcode?andT:''
    let statusFilter = status?proptypefilter+andP+" MlsStatus Eq '"+status+"'":proptypefilter
    // let limit = args['_select']?25:25
    let formatargs = {
        // _pagination:'1',
        _orderby:   'City',
        _filter:    args['_filter'],
        _limit:     50,
        // _page:      1,
        _select:    'Photos.Uri640,Photos.Uri800,Photos.Uri1024,Photos.Uri1280,Photos.Uri1600,Photos.Uri2048,Photos.UriThumb,Photos.UriLarge,Photos.Uri300,Photos.Caption,PrimaryPhoto,StreetNumber,StreetName,StreetSuffix,PostalCode,ListPrice,City,BedsTotal,BathsTotal,PublicRemarks,PropertyType,MlsStatus,Latitude,ListingId,Longitude,PostalCode,YearBuilt,LivingArea,HighSchool,MiddleOrJuniorSchool,ElementarySchool,SubdivisionName,BuildingAreaTotal,PropertySubType,UnparsedAddress,LotSizeArea,LotSizeAcres,CustomFields',
    }
    // formatargs['_page'] = args['_page']?args['_page']:1
    // formatargs['_select'] = select
    args = Object.assign({},formatargs)
    let arr = Object.keys(args).map(key=>{
        let argEntry = formatargs[key]?formatargs[key]:args[key]
        let entry = key+"="+argEntry
        return entry
    })
    return base+arr.join('&')
}
function promiseTo(doThis) {
    console.log('promised to do something ...')
    return new Promise(function(resolve, reject) {
        setTimeout(() => resolve(doThis), 1*doThis);})
}
function refreshAuth(oa) {
    let headers = {
        'X-SparkApi-User-Agent': 'IDX Agent',
        'Content-Type': 'application/json'
    };
    let rauth = {
        url:'https://sparkapi.com/v1/oauth2/grant',
        method:'POST',
        headers: headers,
        body: oa,
        json: true
    };

    rauth.body['grant_type']="refresh_token";
    console.log('refreshing with :'+JSON.stringify(rauth))

        rp(rauth, function (err, res, body) {
    }).then(pb=>{        saveOauthData(pb);
    })
        .catch(errors.StatusCodeError, function (reason) {
            console.log('Reason:'+reason+'          #####################   Status Code : '+reason.statusCode)})
        .catch(errors.RequestError, function (reason) {console.log(reason)})

}
app.get('/remove', function (req, res) {
    removeall();
    res.send('cleared ')
})
app.get('/addr/:addr', function (req, res) {
    let addr = req.params.addr;

    let thefilter = "PropertyType Eq 'A' And MlsStatus Eq 'Active' And (City Eq '"+addr+"' Or StreetAddress Eq '"+addr+"')"
    console.log(thefilter);
    getListings(req,res,thefilter,addr)
})
app.get('/callback', function (req, res) {
    let code = ''
    let hascode = false;
    let agentId = '';
    if (req.query['openid.spark.code']) {
        code = req.query['openid.spark.code'];
        hascode=true;
    }
    if (req.query['openid_spark_code']) {
        code = req.query['openid_spark_code'];
        hascode=true;
    }
    if (req.query['code']){
        code = req.query['code'];
        hascode=true;
    }

    if (req.query['openid.spark.state']) {
        agentId = req.query['openid.spark.state']
    }
    if(req.query['state']) {
        agentId = req.query['state']
    }
    if(hascode==true){
        fbinit.database().ref('/sparkauth/oauth').update({code:code}).then(function () {
            console.log('updated code :'+code);
        })
    }
    else {
        console.log('did not update code : '+code+' hascode set to :'+hascode?'true':'false')
    }
    // console.log(req.query['openid.spark.code'] + ' : from callback');
    let options;
    fbinit.database().ref('/sparkauth/oauth').once("value", function(snapshot) {
        options = {
            method: 'POST',
            uri: 'https://sparkapi.com/v1/oauth2/grant',
            headers: {
                'X-SparkApi-User-Agent': 'Idx Agent',
                'Content-Type': 'application/json'
            },
            body:{
                client_id: snapshot.val().client_id,
                client_secret: snapshot.val().client_secret,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: snapshot.val().redirect_uri
            },
            json:true
        };
        console.log('using options :'+JSON.stringify(options))
        oauthData.client_id= snapshot.val().client_id
        oauthData.client_secret= snapshot.val().client_secret
        oauthData.access_token= snapshot.val().access_token
        oauthData.refresh_token= snapshot.val().refresh_token
        oauthData.redirect_uri= snapshot.val().redirect_uri
        oauthData.expires_at= snapshot.val().expires_at?snapshot.val().expires_at:"0"
        oauthData.code = snapshot.val().code

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    }).then(function () {
    rp(options)
        .then(pb=>{
            saveOauthData(pb)
            res.render('pages/spark', {results:Object.keys(pb).map(key=> key = pb[key])});
            // res.send('<strong>zip codes</strong><br><a href="/zip/07717"><br/><strong>zip 07717</strong><br><a href="/zip/08736"><strong>zip 08736</strong><br/><br/><strong>Log in</strong> with Spark</a>' +
            //     '<a href="https://sparkplatform.com/oauth2?response_type=code&client_id='+oauthData.client_id+'&redirect_uri='+oauthData.redirect_uri+'">Agent <strong>login</strong></a>');
        })
        .catch(function(err) {
            res.send(err + 'oops');
            console.log(err + 'uhoh');
            console.log('request failed', err)})
    });
})

app.get('/auth', (req, res) => {
    var uri = "https://sparkplatform.com/openid?openid.mode=checkid_setup&openid.return_to="+oauthData.redirect_uri+"&openid.spark.client_id="+oauthData.client_id+"&openid.spark.combined_flow=true";
    res.location(uri);
    res.send('<a href="https://sparkplatform.com/openid?openid.mode=checkid_setup&openid.return_to='+oauthData.redirect_uri+'&openid.spark.client_id='+oauthData.client_id+'&openid.spark.combined_flow=true">auth</a>')

});

