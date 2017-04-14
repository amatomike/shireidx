'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by m on 11/23/16.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

// import api from 'sparkapiauth'


var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _firebaseEncode = require('firebase-encode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// safe encodes to 02%2F10%2F2013%2E%24%5B%5D%23%2F%25234_-!@%23%24%25^&*()0%5D;:'"`\=%2F?+|.
// const encoded = encode('02/10/2013.$[]#/%234_-!@#$%^&*()0];:\'"`\\=/?+|');
var LOC = 'Location';
var STATUS = 'Status';
var INFO = 'Info';
var FULL = 'Full';
var SCHOOLS = 'Schools';
var ALL = 'All';
var IMAGES = 'Images';

function prepKeys(keys, obj) {

    keys.forEach(function (key) {
        var old = Object.assign({}, obj[key]);
        var safe = (0, _firebaseEncode.encode)(old);
        obj[key] = safe;
    });
    return (0, _firebaseEncode.encode)(key);
}
function storeImagesUpdateUrls(photos, key, id, fbdb) {}

var SaveFlat = function () {
    function SaveFlat(data, passfb) {
        _classCallCheck(this, SaveFlat);

        this._flatmap = {
            MlsStatus: STATUS,
            ModificationTimestamp: STATUS,
            ListingUpdateTimestamp: STATUS,
            City: LOC,
            Latitude: LOC,
            Longitude: LOC,
            StreetName: LOC,
            StreetNumber: LOC,
            StreetSuffix: LOC,
            SubdivisionName: LOC,
            PostalCode: LOC,
            BathsTotal: INFO,
            BedsTotal: INFO,
            BuildingAreaTotal: INFO,
            ListPrice: INFO,
            ListingId: INFO,
            MlsId: INFO,
            PublicRemarks: INFO,
            Photos: IMAGES,
            Schools: SCHOOLS
        };
        this._db = passfb;
        var sf = Object.assign({}, data.StandardFields);
        var streetnum = prepKey(sf.StreetNumber);
        var schools = {
            MiddleOrJuniorSchool: sf['MiddleOrJuniorSchool'],
            HighSchool: sf['HighSchool'],
            ElementarySchool: sf['ElementarySchool']
        };
        var streetnum_safe = prepKey(streetnum);
        // streetnum.replace(/\.|\$|\#|\[|\/|\]/g, '_');
        var streetname = prepKey(sf.StreetName);
        var streetname_safe = prepKey(streetname);
        var streetAddress = streetnum + ' ' + streetname + ' ' + sf.City + ' ' + sf.PostalCode;
        var city = prepKey(sf.City);
        var zip = prepKey(sf.PostalCode);
        sf['City'] = city;
        sf['StreetName'] = streetname;
        sf['StreetNumber'] = streetname;

        data.StandardFields = '';
        sf['StreetAddress'] = streetAddress;
        var alldata = Object.assign(data, sf);
        var key = this._db.ref('/listings/keys/').push(data.Id).key;
        this.key = key;
        var flat = this.flattenListing(alldata, key, passfb);
        var cityKey = this._db.ref;
        flat.info['key'] = this.key;
        flat.full['key'] = this.key;
        flat.status['key'] = this.key;
        flat.location['key'] = this.key;
        var updates = {};
        updates['/listings/keys/' + this.key + '/'] = flat.info;
        updates['/listings/location/city/' + flat.location.City + '/' + this.key + ''] = flat.info;
        updates['/listings/location/zip/' + flat.location.PostalCode + '/listings/' + this.key + ''] = flat.info;
        updates['/listings/status/' + flat.status.MlsStatus + '/' + this.key + ''] = flat.info;
        updates['/listings/location/streetname/' + streetname_safe + '/' + this.key + ''] = flat.info;
        updates['/listings/location/streetnumber/' + streetnum_safe + '/' + this.key + ''] = flat.info;
        // fbpromises.push(fbsdb.ref().update(updates));
        updates['/listings/id/' + flat.Id] = this.key;
        updates['/listings/full/' + this.key] = flat;
        updates['/listings/location/data/' + this.key] = flat.location;
        updates['/listings/status/data/' + this.key] = flat.status;
        updates['/listings/info/data/' + this.key] = flat.info;
        return this._db.ref().update(updates);
    }

    _createClass(SaveFlat, [{
        key: 'flattenListing',
        value: function flattenListing(fields, key, fbdb) {
            var flatmap = {
                MlsStatus: STATUS,
                ModificationTimestamp: STATUS,
                ListingUpdateTimestamp: STATUS,
                City: LOC,
                Latitude: LOC,
                Longitude: LOC,
                StreetName: LOC,
                StreetNumber: LOC,
                StreetSuffix: LOC,
                SubdivisionName: LOC,
                PostalCode: LOC,
                BathsTotal: INFO,
                BedsTotal: INFO,
                BuildingAreaTotal: INFO,
                ListPrice: INFO,
                ListingId: INFO,
                MlsId: INFO,
                PublicRemarks: INFO,
                Photos: IMAGES,
                PhotosKey: INFO,
                PhotoThumbsUrls: INFO,
                PhotoUrls: INFO,
                PhotoThumb: INFO,
                PhotoLarge: INFO,
                HighSchool: SCHOOLS,
                ElementrySchool: SCHOOLS,
                MiddleOrJuniorSchool: SCHOOLS
            };
            var flat = {};
            var obj = {};
            var pAr = [];
            obj[INFO] = {};
            obj[STATUS] = {};
            obj[FULL] = {};
            obj[LOC] = {};
            obj[SCHOOLS] = {};
            obj[ALL] = {};
            obj[IMAGES] = {};
            function photoKey(pEntry) {
                return fbdb.ref('/listings/photos/').push(pEntry).key;
            }

            var photolarge = "https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png";
            var photoThumb = "https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png";
            fields['PhotoThumb'] = photoThumb;
            fields['PhotoLarge'] = photolarge;
            Object.keys(fields).map(function (field) {
                var f = field;
                var v = fields[field];
                var flat = flatmap[f];
                var pObj = {};
                if (v !== "********" && v !== null) {
                    switch (flat) {
                        case STATUS:
                            obj[STATUS][f] = v;
                            break;
                        case INFO:
                            obj[INFO][f] = v;
                            break;
                        case LOC:
                            obj[LOC][f] = v;
                            break;
                        case SCHOOLS:
                            obj[LOC][f] = v;
                            break;
                        default:
                            obj[FULL][f] = v;
                            break;
                    }
                }
            });
            obj['Photos'] = {};
            obj['Images'] = {};
            try {
                if (fields['Photos']) {
                    fields['Photos'].forEach(function (photo) {

                        if (photo['Primary'] == true) {
                            photolarge = photo['UriLarge'];
                            // console.log('Got Primary Photo for'+key)
                            photoThumb = photo['UriThumb'];
                        } //end if photo primary check
                        var newKey = photoPush(photo);
                        obj['Images'][newKey] = {};
                        obj['Photos'][newKey] = photo;
                    }); //end forEachPhoto
                } //endif key photo exists
            } //end try
            catch (e) {
                console.log(e);
            } //end catch for try

            var done = Object.keys(obj).forEach(function (category) {
                flat[category] = {};
                var catagory = Object.assign({}, obj[category]);
                Object.assign(category, obj[category]);
                Object.assign(flat[FULL], category);
                Object.assign(flat[ALL], category);
                Object.assign(flat[category], obj[INFO]);
            }); //end forEach catagory

            console.log(flat['Images']);
            Object.assign(flat[ALL], fields);
            return Object.assign(flat, obj[INFO]);
        }
    }]);

    return SaveFlat;
}();

exports.default = SaveFlat;
//# sourceMappingURL=saveflat.js.map