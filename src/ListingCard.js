import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

export default class CardExampleControlled extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ListPrice:props.ListPrice,
            Beds:props.Beds,
            Baths:props.Baths,
            Bedlabeled:"Beds: "+props.Beds,
            PhotoThumb:props.PhotoThumb,
            PhotoLarge:props.PhotoLarge,
            Photos:props.Photos,
            StreetAddr:props.StreetNumber+' '+props.StreetName+"  Beds: "+props.Beds+"  Baths: "+props.Baths,
            StreetName:props.StreetName,
            StreetNumber:props.StreetNumber,
            City:props.City,
            PublicRemarks:props.PublicRemarks,
            expanded: false,
        };
    }

    handleExpandChange = (expanded) => {
        this.setState({expanded: expanded});
    };

    handleToggle = (event, toggle) => {
        this.setState({expanded: toggle});
    };

    handleExpand = () => {
        this.setState({expanded: true});
    };

    handleReduce = () => {
        this.setState({expanded: false});
    };

    render() {
        return (
            <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
                <CardHeader
                    title={this.state.ListPrice}
                    subtitle={this.state.StreetAddr}
                    avatar={this.state.PhotoThumb}
                    actAsExpander={true}
                    showExpandableButton={false}
                />
                <CardMedia
                    expandable={true}
                    overlay={<CardTitle title={this.state.City} subtitle={this.state.StreetName} />}
                >
                    <img src={this.state.PhotoLarge} />
                </CardMedia>
                <CardTitle title={this.state.ListPrice} subtitle={this.state.StreetName} expandable={true} />
                <CardText expandable={true}>
                    {this.state.PublicRemarks}
                </CardText >
            </Card>
        );
    }
}
