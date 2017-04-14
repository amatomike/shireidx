'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ismobilejs = require('ismobilejs');

var _ismobilejs2 = _interopRequireDefault(_ismobilejs);

var _reactAutosuggest = require('react-autosuggest');

var _reactAutosuggest2 = _interopRequireDefault(_reactAutosuggest);

var _firebase = require('firebase');

var firebase = _interopRequireWildcard(_firebase);

var _ListingCard = require('./ListingCard');

var _ListingCard2 = _interopRequireDefault(_ListingCard);

var _colors = require('material-ui/styles/colors');

var _getMuiTheme = require('material-ui/styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _MuiThemeProvider = require('material-ui/styles/MuiThemeProvider');

var _MuiThemeProvider2 = _interopRequireDefault(_MuiThemeProvider);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by m on 12/21/16.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
// import styles from './ListingSearch.less';
// import theme from './theme.less';

// import Link from 'Link/Link';

// import languages from './languages';

// import {escapeRegexCharacters} from "utils/utils";


var escapeRegexCharacters = function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

var muiTheme = (0, _getMuiTheme2.default)({
    palette: {
        accent1Color: _colors.deepOrange500
    }
});

var listings = [];

var cities = [];

var streets = [];
var setupCityStreetObj = function setupCityStreetObj(cty, str, lst) {
    var common = {
        City: [{
            Streets: [{
                Listings: []
            }]
        }]
    };

    var co = { City: Array };
    var so = { Streets: Array };
    var lo = { Listings: Array };
    co.City[cty] = so.Streets[str] = lo.Listings.push(lst);
};
var getStreetAddress = function getStreetAddress(val) {
    return val['StreetNumber'] ? val['StreetNumber'] : '' + ' ' + val['StreetName'] ? val['StreetName'] : '';
};
var getCity = function getCity(val) {
    return val['City'] ? val['City'] : 'No City';
};
var combineCity = function combineCity(cts, city, street, listing) {
    var strtentry = {};
    strtentry[street] = { Listings: Object.assign([], listing) };
    if (cts.City[city]) {
        if (cts.City[city].Streets[street]) {} else {}
    } else {}
    var currentctystrtlist = Object.assign({});
    var cityentry = { Streets: Object.assign({}, strtentry), Listings: Object.assign({}, listing) };

    Object.assign(cts[city]['Streets'], strtentry);
    if (!Object.keys(cts).includes(city)) {
        cts[city] = { Streets: [], Listings: [listing] };
        cts[city]['Streets'][street] = { Listings: [listing] };
    } else {
        if (!Object.keys(cts[city]['Streets']).includes(street)) {
            // cts[city]['Streets'][street];
            cts[city]['Streets'][street] = { Listings: [] };
            cts[city]['Streets'][street]['Listings'].push(listing);
        }
        if (Object.keys(cts[city]['Streets']).includes(street)) {
            cts[city]['Streets'][street]['Listings'].push(listing);
        }
        cts[city]['Listings'].push(listing);
    }
    return cts;
};
var getStreetName = function getStreetName(val) {
    return val['StreetName'] ? val['StreetName'] : 'No StreetName';
};
var combineStreetName = function combineStreetName(strts, streetName, entry) {
    if (!Object.keys(strts).includes(streetName)) {
        strts[streetName] = { Listings: [entry] };
    } else {
        strts[streetName]['Listings'].push(entry);
    }
    return strts;
};

var listingObj = { BathsTotal: null, BedsTotal: null, City: null, Id: null, Latitude: null, ListPrice: null, ListingId: null, Longitude: null, MlsId: null, MlsStatus: null, PhotoCaption: 'Loading', PhotoLarge: 'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire320x220.png', PhotoThumb: 'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png', Photos: [{ Caption: 'Loading', Uri300: 'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png', UriLarge: 'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png', UriThumb: 'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png' }], PostalCode: null, PropertySubType: null, PropertyType: null, PublicRemarks: 'Loading', StreetName: null, StreetNumber: null, StreetSuffix: null, YearBuilt: null, completed: null, geo: {} };

var config = { apiKey: 'AIzaSyCz70KreUrYe8-ueY7JeIGdc05J6BmhydI', authDomain: 'sparkidxapi.firebaseapp.com', databaseURL: 'https://sparkidxapi.firebaseio.com', storageBucket: 'sparkidxapi.appspot.com', messagingSenderId: '928332845924' };

var oauthData = { access_token: '', client_id: 'cfsaxwnjikgfpjfaaakjn85hb', client_secret: '5yvrwus10xr6jk96rnjgzua32', code: '', expires: '', redirect_uri: 'https://shire.mikeamato.org/auth/idxauth', refresh_token: '' };

var fb = firebase.initializeApp(config);

var fbref = fb.database().ref('/sparkauth/oauth');

var streetref = fb.database().ref('/listings/keys');
var listref = fb.database().ref('/listings/location/city');
console.log('Cities?');

streetref.once("value", function (snapshot) {
    var cts = [];
    var ctylists = [];
    snapshot.forEach(function (obj) {
        listings.push(obj.val());
        console.log(JSON.stringify(obj.val()['City']));
        var name = obj.val()['City'];
        cts[name] = { name: name, listings: [] };
    });
    snapshot.forEach(function (obj) {
        var name = obj.val()['City'];

        cts[name]['listings'].push(obj.val());
    });

    cities = Object.keys(cts).map(function (cty) {
        console.log(cts[cty]);
        return { name: cts[cty].name, listings: cts[cty].listings };
    });
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

var focusInputOnSuggestionClick = !_ismobilejs2.default.any;

var getSuggestions = function getSuggestions(value) {
    var escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
        return [];
    }

    var regex = new RegExp('\\b' + escapedValue, 'ig');

    return cities.map(function (section) {
        return {
            City: section.name,
            listings: section.listings.filter(function (lst) {
                return regex.test(lst.StreetName + ' ' + lst.City);
            })
        };
    }).filter(function (section) {
        return section.listings.length > 0;
    });
};

var getSuggestionValue = function getSuggestionValue(suggestion) {
    return suggestion.name;
};
/*
 ListPrice:props.ListPrice,
 Beds:props.Beds,
 PhotoThumb:props.PhotoThumb,
 PhotoLarge:props.PhotoLarge,
 Photos:props.Photos,
 StreetName:props.StreetName,
 StreetNumber:props.StreetNumber,
 City:props.City,
 PublicRemarks:props.PublicRemarks,
 expanded: false,
 */
var renderSuggestion = function renderSuggestion(suggestion) {
    return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_ListingCard2.default, { ListPrice: suggestion.ListPrice,
            PhotoThumb: suggestion.PhotoThumb.url,
            PhotoLarge: suggestion.PhotoLarge.url,
            StreetNumber: suggestion.StreetNumber,
            StreetName: suggestion.StreetName,
            PublicRemarks: suggestion.PublicRemarks,
            Beds: suggestion.BedsTotal,
            Baths: suggestion.BathsTotal
        })
    );
};

var renderSectionTitle = function renderSectionTitle(section) {
    return _react2.default.createElement(
        'strong',
        null,
        section.City
    );
};

var getSectionSuggestions = function getSectionSuggestions(section) {
    return section.listings;
};

var MultipleSections = function (_Component) {
    _inherits(MultipleSections, _Component);

    function MultipleSections() {
        _classCallCheck(this, MultipleSections);

        var _this = _possibleConstructorReturn(this, (MultipleSections.__proto__ || Object.getPrototypeOf(MultipleSections)).call(this));

        _this.onChange = function (event, _ref) {
            var newValue = _ref.newValue;

            _this.setState({
                value: newValue
            });
        };

        _this.onSuggestionsFetchRequested = function (_ref2) {
            var value = _ref2.value;

            _this.setState({
                suggestions: getSuggestions(value)
            });
        };

        _this.onSuggestionsClearRequested = function () {
            _this.setState({
                suggestions: []
            });
        };

        _this.state = {
            value: '',
            suggestions: []
        };
        return _this;
    }

    _createClass(MultipleSections, [{
        key: 'render',
        value: function render() {
            var _state = this.state,
                value = _state.value,
                suggestions = _state.suggestions;

            var inputProps = {
                placeholder: 'Find your home by Street or City',
                value: value,
                onChange: this.onChange
            };

            return _react2.default.createElement(
                _MuiThemeProvider2.default,
                { muiTheme: muiTheme },
                _react2.default.createElement(
                    'div',
                    { id: 'multiple-sections-example', className: 'container' },
                    _react2.default.createElement(
                        'div',
                        { className: 'react-autosuggest__container' },
                        _react2.default.createElement(_reactAutosuggest2.default, {
                            multiSection: true,
                            suggestions: suggestions,
                            onSuggestionsFetchRequested: this.onSuggestionsFetchRequested,
                            onSuggestionsClearRequested: this.onSuggestionsClearRequested,
                            getSuggestionValue: getSuggestionValue,
                            renderSuggestion: renderSuggestion,
                            renderSectionTitle: renderSectionTitle,
                            getSectionSuggestions: getSectionSuggestions,
                            inputProps: inputProps,
                            focusFirstSuggestion: true,
                            focusInputOnSuggestionClick: focusInputOnSuggestionClick,
                            id: 'multiple-sections-example'
                        })
                    )
                )
            );
        }
    }]);

    return MultipleSections;
}(_react.Component);

exports.default = MultipleSections;
//# sourceMappingURL=ListingSearch.js.map