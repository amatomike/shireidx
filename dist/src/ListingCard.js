'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Card = require('material-ui/Card');

var _FlatButton = require('material-ui/FlatButton');

var _FlatButton2 = _interopRequireDefault(_FlatButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CardExampleControlled = function (_React$Component) {
    _inherits(CardExampleControlled, _React$Component);

    function CardExampleControlled(props) {
        _classCallCheck(this, CardExampleControlled);

        var _this = _possibleConstructorReturn(this, (CardExampleControlled.__proto__ || Object.getPrototypeOf(CardExampleControlled)).call(this, props));

        _this.handleExpandChange = function (expanded) {
            _this.setState({ expanded: expanded });
        };

        _this.handleToggle = function (event, toggle) {
            _this.setState({ expanded: toggle });
        };

        _this.handleExpand = function () {
            _this.setState({ expanded: true });
        };

        _this.handleReduce = function () {
            _this.setState({ expanded: false });
        };

        _this.state = {
            ListPrice: props.ListPrice,
            Beds: props.Beds,
            Baths: props.Baths,
            Bedlabeled: "Beds: " + props.Beds,
            PhotoThumb: props.PhotoThumb,
            PhotoLarge: props.PhotoLarge,
            Photos: props.Photos,
            StreetAddr: props.StreetNumber + ' ' + props.StreetName + "  Beds: " + props.Beds + "  Baths: " + props.Baths,
            StreetName: props.StreetName,
            StreetNumber: props.StreetNumber,
            City: props.City,
            PublicRemarks: props.PublicRemarks,
            expanded: false
        };
        return _this;
    }

    _createClass(CardExampleControlled, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _Card.Card,
                { expanded: this.state.expanded, onExpandChange: this.handleExpandChange },
                _react2.default.createElement(_Card.CardHeader, {
                    title: this.state.ListPrice,
                    subtitle: this.state.StreetAddr,
                    avatar: this.state.PhotoThumb,
                    actAsExpander: true,
                    showExpandableButton: false
                }),
                _react2.default.createElement(
                    _Card.CardMedia,
                    {
                        expandable: true,
                        overlay: _react2.default.createElement(_Card.CardTitle, { title: this.state.City, subtitle: this.state.StreetName })
                    },
                    _react2.default.createElement('img', { src: this.state.PhotoLarge })
                ),
                _react2.default.createElement(_Card.CardTitle, { title: this.state.ListPrice, subtitle: this.state.StreetName, expandable: true }),
                _react2.default.createElement(
                    _Card.CardText,
                    { expandable: true },
                    this.state.PublicRemarks
                )
            );
        }
    }]);

    return CardExampleControlled;
}(_react2.default.Component);

exports.default = CardExampleControlled;
//# sourceMappingURL=ListingCard.js.map