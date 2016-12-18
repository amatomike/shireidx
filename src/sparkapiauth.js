
import fb from 'firebase'
import Request from 'request'
import rp from 'request-promise';
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
var auth;
var fbinit = fb.initializeApp({
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
    client_id: '',
    client_secret: '',
    access_token: '',
    refresh_token: '',
    redirect_uri: '',
    expires_at: ''
}
let code
let client_id
let client_secret
let access_token
let refresh_token
let agentId
let expires_in
let redirect_uri
let results=[];

let dB = fb.database();
fbinit.database().ref('/sparkauth/oauth').on("value", function(snapshot) {
    console.log(snapshot.val());
    oauthData=snapshot.val()
     code = oauthData.code;
     client_id = oauthData.client_id;
     client_secret = oauthData.client_secret;
     access_token = oauthData.access_token;
     refresh_token = oauthData.refresh_token;
     agentId = oauthData.agentId;
     expires_in = oauthData.expires_in;
     redirect_uri = oauthData.redirect_uri
    console.log("auth updated!"+JSON.stringify(oauthData));
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});
function getOauthData(){
    console.log("getting oauthData");

    // return jf.readFileSync(file)
}
function saveOauthData(od) {
    console.log("saving OauthData ->"+od);

    dB.ref('/sparkauth/oauth').update({
        access_token: od.access_token,
        refresh_token: od.refresh_token,
        // code: newcode
    })
}
function promiseToGet(ops) {
    // return new Promise(function(resolve, reject) {
        console.log(ops + 'promise log --- ops')
        rp(ops)
            .then(thejson=> {
                return new Promise(function(resolve, reject) {
                    setTimeout(() => resolve(thejson), 2500 );})//2.5  seconds
                    .catch((err) => console.log("error: "+" "+JSON.stringify(thejson), err.message));
            })
            .catch(errors.StatusCodeError, reason=>{
                    console.log(reason)
            })
            .catch(errors.RequestError, function (reason) {
                // reason.cause is the Error object Request would pass into a callback.
                console.log(reason.cause)
            })
            .catch(e=>{
                // reason.cause is the Error object Request would pass into a callback.
                console.log(e)
            })

}
function promDate(some){
    return new Promise(function(resolve, reject) {
        setTimeout(() => resolve(some), 2500 );})//2.5  seconds
        .catch((err) => console.log("error: "+" "+JSON.stringify(thejson), err.message));
}
export default class SparkApiAuth {
    get reqargs() {
        return this._reqargs;
    }

    set reqargs(value) {

        this._reqargs = value;
    }
    get tokens() {
        return this._tokens;
    }

    set tokens(value) {
        this._tokens = value;
    }
    get fBdB() {
        return this._fBdB;
    }

    set fBdB(value) {
        this._fBdB = value;
    }
    get oauthData() {
        return getOauthData();
    }

    set oauthData(value) {
        saveOauthData(value);
    }

    constructor() {
        console.log(this.tokens)
        let _fbsdb = dB
        // dB = fBdB;
        // let _fbsref = _fbsdb.ref("/sparkauth/oauth");
        let _args;
        _args = {
            _pagination: '1',
            _page: '1',
            _filter: "PropertyType Eq 'A' And MlsStatus Eq 'Active'",
            _limit: '25',
            _expand: 'Photos'
        };

        this._reqargs = {};
        this._args = _args
        this._fBdB = dB;
        dB.ref("/sparkauth/oauth").on("value", function (snapshot) {
            console.log(snapshot.val());
            // this.tokens = jf.readFileSync(file)
                oauthData.client_id= snapshot.val().client_id
                oauthData.client_secret= snapshot.val().client_secret
                oauthData.access_token= snapshot.val().access_token
                oauthData.refresh_token= snapshot.val().refresh_token
                oauthData.redirect_uri= snapshot.val().redirect_uri
                oauthData.expires_at= snapshot.val().expires_at?snapshot.val().expires_at:"0"
            console.log("The snapshot was updated!");
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

    }

saveTokens(newAToken, newRToken, newExpires, newAgentId, newcode, res) {
    // Get a key for a new Post.
console.log('saving...')
    if(newAToken) {
        oauthData.access_token = newAToken;
        oauthData.refresh_token = newRToken;
        oauthData.code = newcode;
        var d = new Date();
        d.setSeconds(d.getSeconds() + 86400)
        let expireson = d;
        console.log(expireson)
        this.fBdB.ref('/sparkauth/oauth').update({
            access_token: newAToken,
            refresh_token: newRToken,
            // code: newcode
        }).then(data=>{
        res.send('ok')})

}}

checkStatus(response) {
    if (response.statusCode == 401) {
        console.log('response = 401 ? '+response.statusCode)
        // let oauthData = Object.assign({},oauthData)
        // let fBdB = this.fBdB
         let auth = this
        let rt;
        rt = function () {
            auth.refreshAuth()
        };
        return rt()
    }
        if (response.statusCode >= 200 && response.statusCode < 300) {
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
parseJSON(response) {
        return response.json()
    }
// promiseGeoFireSave(listing){
//     return new Promise(function(resolve, reject) {
//         setTimeout(() => resolve(listing), 2500 );})//2.5  seconds
//         .then(listing=>{
//             let gf = new geofb(dB.ref('/listings/id/'+listing['Id']+"/geo"))
//             let listinggeo = 'geo'
//             gf.set(listinggeo,[listing['Longitude'],listing['Latitude']]);
//             gf.ref(dB.ref('/listings/location/geofire/'+listing['Id']))
//             gf.set(listing['Id'],[listing['Longitude'],listing['Latitude']])
//         })
//         .catch((err) => console.log("error: "+" "+JSON.stringify(listing), err.message));
// }
handleReq(req,res){
    let headers = new Headers({
        'X-SparkApi-User-Agent': 'Idx Agent',
        'Content-Type': 'application/json'
    });
    let options;
    options = new Request({
        url: 'https://sparkapi.com/v1/oauth2/grant',
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            client_id: oauthData.client_id,
            client_secret: oauthData.client_secret,
            grant_type: "authorization_code",
            code: hascode ? code : oauthData.code,
            redirect_uri: oauthData.redirect_uri
        }),
        json: true
    });
    fetch(options)
        .then(this.checkStatus)
        .then(this.parseJSON)
        .then(pb=>{
            this.saveTokens(pb.access_token, pb.refresh_token, 86400, agentId, code, res)
            res.send('<strong>zip codes</strong><br><a href="/zip/07717"><br/><strong>zip 07717</strong><br><a href="/zip/08736"><strong>zip 08736</strong><br/><br/><strong>Log in</strong> with Spark</a>' +
                '<a href="https://sparkplatform.com/oauth2?response_type=code&client_id='+oauthData.client_id+'&redirect_uri='+oauthData.redirect_uri+'">Agent <strong>login</strong></a>');
        })
        .catch(function(err) {
            res.send(err + 'oops');
            console.log(err + 'uhoh');
            console.log('request failed', err)})

}
handleCallback(req, res) {
    let hascode = false;
    let agentId = '';
    if (req.query['openid.spark.code']) {
        code = req.query['openid.spark.code'];
        hascode=!hascode;
    }
    if (req.query['openid_spark_code']) {
        code = req.query['openid_spark_code'];
        hascode=!hascode;
    }
    if (req.query['code']){
        code = req.query['code'];
        hascode=!hascode;
    }

    if (req.query['openid.spark.state']) {
        agentId = req.query['openid.spark.state']
    }
    if(req.query['state']) {
        agentId = req.query['state']
    }
    // console.log(req.query['openid.spark.code'] + ' : from callback');
    let headers = new Headers({
        'X-SparkApi-User-Agent': 'Idx Agent',
        'Content-Type': 'application/json'
    });
    let options;
    options = new Request({
        url: 'https://sparkapi.com/v1/oauth2/grant',
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            client_id: oauthData.client_id,
            client_secret: oauthData.client_secret,
            grant_type: "authorization_code",
            code: hascode ? code : oauthData.code,
            redirect_uri: oauthData.redirect_uri
        })
    });
    fetch(options)
        .then(this.checkStatus)
        .then(this.parseJSON)
        .then(pb=>{
            this.saveTokens(pb.access_token, pb.refresh_token, 86400, agentId, code, res)
            res.send('<strong>zip codes</strong><br><a href="/zip/07717"><br/><strong>zip 07717</strong><br><a href="/zip/08736"><strong>zip 08736</strong><br/><br/><strong>Log in</strong> with Spark</a>' +
                '<a href="https://sparkplatform.com/oauth2?response_type=code&client_id='+oauthData.client_id+'&redirect_uri='+oauthData.redirect_uri+'">Agent <strong>login</strong></a>');
        })
        .catch(function(err) {
            res.send(err + 'oops');
            console.log(err + 'uhoh');
            console.log('request failed', err)})
        }
oauthHeaders(){
    return {
        'X-SparkApi-User-Agent': 'DevApp',
        'Authorization': 'OAuth '+access_token,
        'Content-Type': 'application/json'
    };
}
    promiseSaveListings(listings){
        function finishUpdate(uplst,ups,o,e,p) {
            console.log('next - saving now')
            e[p['idpath']] = uplst
            e[p.zippath] = uplst
            e[p.citypath] = uplst
            e[p.streetpath] = uplst['Id']
            e[p.streetnumpath] = uplst['Id']
            //  console.log('updating!'+JSON.stringify(uplist))//
            o.push(uplst)
            ups = Object.assign(ups, e)
            dB.ref('/').update(ups);
            return new Promise(function(resolve, reject) {
                setTimeout(() => resolve(ups),2500 );})
        }
        function minipromise(prom){
            return new Promise(function(resolve, reject) {
                setTimeout(() => resolve(prom),2500 );})
        }

        let updates = {}
        let obj = []
        return new Promise(function(resolve, reject) {
            setTimeout(() => resolve(listings), 2500 );})//2.5  seconds
            .then(listings=>{
                listings.forEach(listing=> {
                    let uplist = {media:[]}
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
                    let idpath = "/listings/id/" + listing['Id']
                    let entry = {}
                    let entrygeo = {}
                    let citypath = "/listings/location/city/" + uplist['City'] + "/" + listing['Id']
                    let zippath = "/listings/location/zip/" + uplist['PostalCode'] + "/" + listing['Id'];
                    let streetpath = "/listings/location/street/name/" + encode(uplist['StreetName']) + "/" + listing['Id']
                    let streetnumpath = "/listings/location/street/number/" + encode(uplist['StreetNumber']) + "/" + listing['Id']
                    let paths = {idpath:idpath,citypath:citypath,zippath:zippath,streetpath:streetpath,streetnumpath:streetnumpath}

                    // size({url: uplist['PhotoLarge']},function (err, dimensions, length) {
                    //     console.log(JSON.stringify(dimensions))
                    //     uplist['PhotoLargeH'] = dimensions.height;
                    //     uplist['PhotoLargeW'] = dimensions.width;
                    //     finishUpdate(uplist,updates,obj,entry,paths);
                    // })
                    if (uplist['Photos'][0]){
                        let saving = uplist['Photos'].forEach(key=>{
                            Object.keys(uplist['Photos'][0]).forEach(subkey=>{
                                size({url: uplist['Photos'][0][subkey]},function (err, dimensions, length) {
                                    console.log(JSON.stringify(dimensions))
                                    uplist['media'][key][subkey]['size'] = dimensions;
                                    uplist['media'][key][subkey]['width'] = dimensions.width;
                                })})})}else
                    {
                        let saving = {};
                    }
                    minipromise(saving)
                        .then(enddata=>{
                            finishUpdate(uplist,updates,obj,entry,paths);
                        })
                        .catch((err) => console.log("error: "+JSON.stringify(err)));
                })

                console.log('# of listings: '+listings.length);
            })
            .then(end=>{
                return end;
            })
            .catch((err) => console.log("error: "+" "+JSON.stringify(listings), err.message));
    }
    static removeall(){
        let remit = dB.ref('/listings').remove().then(function () {
            return "done clearing";
        })}
    getPage(ops){
        console.log('getting with ops:'+JSON.stringify(ops))
        return new Promise(function(resolve, reject) {
            setTimeout(() => resolve(ops), 250000 );})//250  seconds
            .catch((err) => console.log("error: "+JSON.stringify(ops), err));
    }
    getListings(req,res, filter) {
        let combo=[];
        let obj = []
        let addr = req.params.addr;
        let pageops=[];
        let setargs = {
            _filter: filter
        };
        let opsurl =  this.makeUrl(setargs, null, 'A', 'https://sparkapi.com/v1/listings?', 'Active');
        let authops = {
            headers: this.oauthHeaders(),
            uri: opsurl+'&_pagination=count&_page=1',
            json: true
        };
        let od = Object.assign({}, oauthData)
        let fdB = this.fBdB
        let tauth = new SparkApiAuth(fdB)
        var rt;
        rt = function () {
            tauth.refreshAuth(od, tauth)
        };
        console.log('about to request...'+JSON.stringify(authops))
        rp(authops)
            .then(pb => {
                // results.concat(pb['D']['Results']);
                console.log('pagei:'+JSON.stringify(pb['D']['Pagination']))

                let pages = pb['D']['Pagination']['TotalPages'];
                let currentpage = pb['D']['Pagination']['CurrentPage'];
                let pagearr=[]
                if (currentpage < pages){

                    for (let page = 1; page < pages; page++) {
                        let pageReq = {};
                        let newops = {headers:this.oauthHeaders(),uri:opsurl+'&_pagination=1&_page='+page,json:true};
                        pagearr.push(newops)

                    }}else
                {
                    let newops = {headers:this.oauthHeaders(),uri:opsurl+'&_pagination=1&_page=1',json:true};
                    pagearr.push(newops)
                }
                let promisedPages=pagearr.map(ops=>{
                    return this.getPage(rp(ops).then(pb=>{
                        console.log('adding to combo'+pb['D']['Pagination']['CurrentPage'])
                        this.promiseSaveListings(pb['D']['Results'])                        }));
                })
                Promise.all(promisedPages)
                    .then(endres=>{
                        res.set({'Access-Control-Allow-Origin':'*'});
                        console.log('saving combo with '+combo.length)

                        console.log('length:'+combo.length);
                        res?res.send(combo):console.log('no res to send ....Saved')
                    });
            })
            .catch(errors.StatusCodeError, function (reason) {
                // The server responded with a status codes other than 2xx.
                // Check
                if (reason.statusCode == 401) {
                    console.log(reason)
                    rt()
                }
            })
            // .catch(this.checkStatus)
            .catch(errors.RequestError, function (reason) {
                // reason.cause is the Error object Request would pass into a callback.
                console.log(reason.cause)
            })
            .catch(e=>{
                // reason.cause is the Error object Request would pass into a callback.
                console.log('e:'+e)
            })
    }

makeUrl(args,zipcode=null,proptype=null,base='https://sparkapi.com/v1/listings?',status=null){
    let argfilter = args['_filter']?args['_filter']:''
    let select = 'StreetNumber,StreetName,PostalCode,ListPrice,City,BedsTotal,BathsTotal,PublicRemarks,PropertyType,MlsStatus,Photos,Latitude,ListingId,Longitude,PostalCode,PropertySubType,YearBuilt'
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
        _select:    'Photos.UriThumb,Photos.UriLarge,Photos.Uri300,Photos.Caption,PrimaryPhoto,StreetNumber,StreetName,StreetSuffix,PostalCode,ListPrice,City,BedsTotal,BathsTotal,PublicRemarks,PropertyType,MlsStatus,Latitude,ListingId,Longitude,PostalCode,PropertySubType,YearBuilt',
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
promiseTo(doThis) {
    console.log('promised to do something ...')
        return new Promise(function(resolve, reject) {
            setTimeout(() => resolve(doThis), 1*doThis);})
    }
countPromise(at, args,zip=null,proptype=null){
    console.log('promise to get count, then return promise with count ')
    return this.promiseTo(this.createFetchPromise(at,args,zip,proptype))

}
refreshAuth(oauthData=oauthData,auth=null) {
    let thisauth = Object.assign(auth,this)
    console.log('refreshing with :'+oauthData)
        var headers = {
            'X-SparkApi-User-Agent': 'IDX Agent',
            'Content-Type': 'application/json'
        };
        rp({
            url:'https://sparkapi.com/v1/oauth2/grant',
            method:'POST',
            headers: headers,
            body: {
                grant_type:     "refresh_token",
                client_id:      oauthData.client_id,
                client_secret:  oauthData.client_secret,
                refresh_token:  oauthData.refresh_token,
                redirect_uri:   oauthData.redirect_uri
            },
            json: true
        }, function (err, res, body) {
            thisauth.saveTokens(body.access_token, body.refresh_token, 86400, body.state, '', res);
        })
            .catch(errors.StatusCodeError, function (reason) {
                    console.log('Reason:'+reason+'          #####################   Status Code : '+reason.statusCode)})
            .catch(errors.RequestError, function (reason) {console.log(reason)})

}

countPagesAndRequestJson(at,fbd, args=null,zip=null,proptype=null){
    let fetcharr = []
    var setargs = {
        _pagination:'1',
        _page:      '',
        _filter:    "PostalCode Eq '"+ zip +"'",
        _limit:     args['_limit']?args['_limit']:'25',
        _expand:    'Photos'

    }
    let countArgs = Object.assign({},setargs)
    countArgs._pagination = 'count'
    let countOps = this.setupOptions(
        {
            at: at,
            args: countArgs,
            listId: null,
            page: zip,
            zip: proptype
        }
        )
    countOps.url = "https://sparkapi.com/v1/listings"


    let oauthData = Object.assign({},oauthData)
    let fBdB = this.fBdB
    let auth = this
    let rt;
    rt = function () {
        auth.refreshAuth(oauthData, auth)
    };
        rp(countOps)
            .then(response=> {
                let pages = response.D.Pagination.TotalPages
                for (var page = 1; page <= pages; page++) {
                    var pageReq = {};
                    var newarg = Object.assign({}, setargs)
                    newarg._page = page;
                    newarg._pagination = 1
                    let ops = this.setupOptions({
                        at: at,
                        args: newarg,
                        listId: null,
                        page: page,
                        zip: zip,
                        proptype: proptype,
                        status: null
                    })
                    ops.url = 'https://sparkapi.com/v1/listings'
                    ops.qs['_select'] = 'ListingId'

                    fetcharr.push(ops);

                }
                let detailsArr = []
                var promises = fetcharr.map(promiseToGet);
                Promise.all(promises)
                    .then(data => {

                        console.log('resolved, now doing details')
                        data.forEach(
                        )
                    })
                    .catch(errors.StatusCodeError, function (reason) {
                        // The server responded with a status codes other than 2xx.
                        // Check
                        if (reason.statusCode == 401) {
                            console.log(reason)
                            rt()
                        }
                    })
                    .catch(errors.RequestError, function (reason) {
                        // The request failed due to technical reasons.
                        // reason.cause is the Error object Request would pass into a callback.
                    })
                    .catch(e=>{
                        console.log(e)
                    })
            })
    }
}
