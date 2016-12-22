/**
 * Created by m on 12/21/16.
 */
// import styles from './ListingSearch.less';
// import theme from './theme.less';

import React, { Component } from 'react';
import isMobile from 'ismobilejs';
// import Link from 'Link/Link';
import Autosuggest from 'react-autosuggest';
// import languages from './languages';
import * as firebase from "firebase";
import ListingCard from './ListingCard'
// import {escapeRegexCharacters} from "utils/utils";
import {deepOrange500} from "material-ui/styles/colors";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


const muiTheme = getMuiTheme({
    palette: {
        accent1Color: deepOrange500,
    },
});

let listings = [];

let cities = [];

let streets = [];
const setupCityStreetObj = (cty,str,lst)=>{
    let common = {
        City:[{
            Streets:[{
                Listings:[]
            }]
        }]
    }

    let co = {City:Array}
    let so = {Streets:Array}
    let lo = {Listings:Array}
    co.City[cty]=so.Streets[str]=lo.Listings.push(lst);
}
const getStreetAddress = val => {
    return val['StreetNumber']?val['StreetNumber']:''+' '+val['StreetName']?val['StreetName']:''
}
const getCity = val =>{
    return val['City']?val['City']:'No City'
}
const combineCity = (cts, city, street, listing)=>{
    let strtentry = {};
    strtentry[street] = {Listings:Object.assign([],listing)};
    if(cts.City[city]){
        if(cts.City[city].Streets[street]){

        }
        else{

        }
    }else {

    }
    let currentctystrtlist = Object.assign({},)
    let cityentry = {Streets:Object.assign({},strtentry),Listings:Object.assign({},listing)};

    Object.assign(cts[city]['Streets'],strtentry)
    if(!Object.keys(cts).includes(city)){
        cts[city] = {Streets:[],Listings:[listing]};
        cts[city]['Streets'][street]={Listings:[listing]};
    }
    else
    {
        if(!Object.keys(cts[city]['Streets']).includes(street)) {
            // cts[city]['Streets'][street];
            cts[city]['Streets'][street]={Listings:[]};
            cts[city]['Streets'][street]['Listings'].push(listing)
        }
        if(Object.keys(cts[city]['Streets']).includes(street)) {
            cts[city]['Streets'][street]['Listings'].push(listing);
        }
        cts[city]['Listings'].push(listing)}
    return cts;
};
const getStreetName = val =>{
    return val['StreetName']?val['StreetName']:'No StreetName'
}
const combineStreetName = (strts, streetName, entry)=>{
    if(!Object.keys(strts).includes(streetName)){
        strts[streetName]={Listings:[entry]};
    }
    else
    {
        strts[streetName]['Listings'].push(entry);
    }
    return strts;
};

let listingObj = {BathsTotal:null,BedsTotal:null,City:null,Id:null,Latitude:null,ListPrice:null,ListingId:null,Longitude:null,MlsId:null,MlsStatus:null,PhotoCaption:'Loading',PhotoLarge:'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire320x220.png',PhotoThumb:'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png',Photos:[{Caption:'Loading',Uri300:'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png',UriLarge:'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png',UriThumb:'https://shire.mikeamato.org/wp-content/uploads/2016/11/shire110x75.png'}],PostalCode:null,PropertySubType:null,PropertyType:null,PublicRemarks:'Loading',StreetName:null,StreetNumber:null,StreetSuffix:null,YearBuilt:null,completed:null,geo:{}};

let config={apiKey:'AIzaSyCz70KreUrYe8-ueY7JeIGdc05J6BmhydI',authDomain:'sparkidxapi.firebaseapp.com',databaseURL:'https://sparkidxapi.firebaseio.com',storageBucket:'sparkidxapi.appspot.com',messagingSenderId:'928332845924'};

let oauthData={access_token:'',client_id:'cfsaxwnjikgfpjfaaakjn85hb',client_secret:'5yvrwus10xr6jk96rnjgzua32',code:'',expires:'',redirect_uri:'https://shire.mikeamato.org/auth/idxauth',refresh_token:''};

let fb = firebase.initializeApp(config);

let fbref = fb.database().ref('/sparkauth/oauth');

let streetref = fb.database().ref('/listings/keys');
let listref = fb.database().ref('/listings/location/city');
console.log('Cities?')

streetref.once("value", function(snapshot) {
    let cts = []
    let ctylists = []
    snapshot.forEach(obj=> {
        listings.push(obj.val())
        console.log(JSON.stringify(obj.val()['City']));
        let name = obj.val()['City']
        cts[name] = {name:name,listings:[]};
    })
    snapshot.forEach(obj=>{
        let name = obj.val()['City']

        cts[name]['listings'].push(obj.val())
    })


    cities = Object.keys(cts).map(cty=>{
        console.log(cts[cty]);
        return {name:cts[cty].name,listings:cts[cty].listings}
    });

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);});

const focusInputOnSuggestionClick = !isMobile.any;

const getSuggestions = value => {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
        return [];
    }

    const regex = new RegExp('\\b' + escapedValue, 'ig');

    return cities
        .map(section => {
            return {
                City:section.name ,
                listings: section.listings.filter(lst => regex.test(lst.StreetName+' '+lst.City))
            };
        })
        .filter(section => section.listings.length > 0);
};

const getSuggestionValue = suggestion => suggestion.name;
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
const renderSuggestion = suggestion => (

<div>
<ListingCard ListPrice={suggestion.ListPrice}
PhotoThumb={suggestion.PhotoThumb.url}
PhotoLarge={suggestion.PhotoLarge.url}
StreetNumber={suggestion.StreetNumber}
StreetName={suggestion.StreetName}
PublicRemarks={suggestion.PublicRemarks}
Beds={suggestion.BedsTotal}
Baths={suggestion.BathsTotal}
/></div>
);

const renderSectionTitle = section => (
<strong>{section.City}</strong>
);

const getSectionSuggestions = section => section.listings;

export default class MultipleSections extends Component {
    constructor() {
        super();

        this.state = {
            value: '',
            suggestions: []
        };
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: 'Find your home by Street or City',
            value,
            onChange: this.onChange
        };

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
            <div id="multiple-sections-example" className="container">

            <div className="react-autosuggest__container">
            <Autosuggest
        multiSection={true}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderSectionTitle={renderSectionTitle}
        getSectionSuggestions={getSectionSuggestions}
        inputProps={inputProps}
        focusFirstSuggestion={true}
        focusInputOnSuggestionClick={focusInputOnSuggestionClick}
        id="multiple-sections-example"
            />
            </div>
            </div></MuiThemeProvider>
    );
    }
}
