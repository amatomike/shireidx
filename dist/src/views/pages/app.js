import React from 'react';
import ReactDOM from 'react-dom';
import fb from 'firebase'
import ImageGallery from '../src/ImageGallery';

const PREFIX_URL = 'https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/';
let config={apiKey:'AIzaSyCz70KreUrYe8-ueY7JeIGdc05J6BmhydI',authDomain:'sparkidxapi.firebaseapp.com',databaseURL:'https://sparkidxapi.firebaseio.com',storageBucket:'sparkidxapi.appspot.com',messagingSenderId:'928332845924'};

fb.initializeApp(config);
let listref = fb.database().ref('/listings/location/city/Avon-by-the-sea/keys');
let fbImages = [];


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showIndex: false,
      slideOnThumbnailHover: false,
      showBullets: true,
      infinite: true,
      showThumbnails: true,
      showFullscreenButton: true,
      showGalleryFullscreenButton: true,
      showPlayButton: true,
      showGalleryPlayButton: true,
      showNav: true,
      slideInterval: 2000,
      showVideo: {},
        images:[{
            original: 'https://searchidx.herokuapp.com/placeholders/shire1024.png',
            thumbnail: 'https://searchidx.herokuapp.com/placeholders/shireThumb.png',
            originalClass: 'featured-slide',
            thumbnailClass: 'featured-thumb',
            description: 'Custom class for slides & thumbnails'
        }]
    };
  }
    componentDidMount() {
        this.getImages();
    }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.slideInterval !== prevState.slideInterval) {
      // refresh setInterval
      this._imageGallery.pause();
      this._imageGallery.play();
    }
  }

  _onImageClick(event) {
    console.debug('clicked on image', event.target, 'at index', this._imageGallery.getCurrentIndex());
  }

  _onImageLoad(event) {
    console.debug('loaded image', event.target.src);
  }

  _onSlide(index) {
    this._resetVideo();
    console.debug('slid to index', index);
  }

  _onPause(index) {
    console.debug('paused on index', index);
  }

  _onScreenChange(fullScreenElement) {
    console.debug('isFullScreen?', !!fullScreenElement);
  }

  _onPlay(index) {
    console.debug('playing from index', index);
  }

  _handleInputChange(state, event) {
    this.setState({[state]: event.target.value});
  }

  _handleCheckboxChange(state, event) {
    this.setState({[state]: event.target.checked});
  }

  getImages() {
    let images = [];
    let ob = this;
    listref.once("value", function(snapshot) {
    fbImages = [];
          let obj = snapshot.val();
          Object.keys(obj).forEach(key=>{

              let thumb = obj[key]['PhotoThumb'];
              let name = key;
              let photo = obj[key]['PhotoLarge'];
              let caption = obj[key]['PhotoCaption']?obj[key]['PhotoCaption']:'unset';
              let listingKey=obj[key]['ShireKey']
              let listkeyref = fb.database().ref('/listings/keys/'+listingKey);
              listkeyref.once("value",(full=>{

              let hasphotos = full.hasChild('Photos')
               if(hasphotos){

                  Object.keys(full.val()['Photos']).forEach(photoset=>{

                      let entry = full.val()['Photos'][photoset];
                      let srcSet = [];
                      let photoobj =
                          {
                              original: '',
                              thumbnail: '',
                              srcSet:[],
                              originalClass: 'featured-slide',
                              thumbnailClass: 'featured-thumb',
                              description:''
                          }
                      Object.keys(entry).forEach(key=>{

                          switch (key) {
                              case 'UriThumb':
                                  photoobj.thumbnail=entry[key]
                                  break;
                              case 'UriLarge':
                                  photoobj.original=entry[key]
                                  break;
                              case 'Uri300':
                                  photoobj.srcSet.push(entry[key])
                                  break;
                              case 'Uri640':
                                  photoobj.srcSet.push(entry[key])
                                  break;
                              case 'Uri1024':
                                  photoobj.srcSet.push(entry[key])
                                  break;
                              case 'Uri1280':
                                  photoobj.srcSet.push(entry[key])
                                  break;
                              case 'Uri1600':
                                  photoobj.srcSet.push(entry[key])
                                  break;
                              case 'Uri2048':
                                  photoobj.srcSet.push(entry[key])
                                  break;
                              case 'Name':
                                  break;
                              case 'Caption':
                                  photoobj.description=entry[key]
                                  break;
                              default:
                                  break;
                          }    

                      })

                          fbImages.push(photoobj)
                      console.log('Photos - :'+JSON.stringify(photoobj))
                      }

                      )}
                  ob.setState({images:fbImages});

              }))})})
      }

  _resetVideo() {
    this.setState({showVideo: {}});

    if (this.state.showPlayButton) {
      this.setState({showGalleryPlayButton: true});
    }

    if (this.state.showFullscreenButton) {
      this.setState({showGalleryFullscreenButton: true});
    }
  }

  _toggleShowVideo(url) {
    this.state.showVideo[url] = !Boolean(this.state.showVideo[url]);
    this.setState({
      showVideo: this.state.showVideo
    });

    if (this.state.showVideo[url]) {
      if (this.state.showPlayButton) {
        this.setState({showGalleryPlayButton: false});
      }

      if (this.state.showFullscreenButton) {
        this.setState({showGalleryFullscreenButton: false});
      }
    }
  }

  _renderVideo(item) {
    return (
      <div className='image-gallery-image'>
        {
          this.state.showVideo[item.embedUrl] ?
            <div className='video-wrapper'>
                <a
                  className='close-video'
                  onClick={this._toggleShowVideo.bind(this, item.embedUrl)}
                >
                </a>
                <iframe
                  width='560'
                  height='315'
                  src={item.embedUrl}
                  frameBorder='0'
                  allowFullScreen
                >
                </iframe>
            </div>
          :
            <a onClick={this._toggleShowVideo.bind(this, item.embedUrl)}>
              <div className='play-button'></div>
              <img src={item.original}/>
              {
                item.description &&
                  <span
                    className='image-gallery-description'
                    style={{right: '0', left: 'initial'}}
                  >
                    {item.description}
                  </span>
              }
            </a>
        }
      </div>
    );
  }

  render() {
    const images = this.state.images;

    return (

      <section className='app'>
        <ImageGallery
          ref={i => this._imageGallery = i}
          items={images}
          lazyLoad={false}
          onClick={this._onImageClick.bind(this)}
          onImageLoad={this._onImageLoad}
          onSlide={this._onSlide.bind(this)}
          onPause={this._onPause.bind(this)}
          onScreenChange={this._onScreenChange.bind(this)}
          onPlay={this._onPlay.bind(this)}
          infinite={this.state.infinite}
          showBullets={this.state.showBullets}
          showFullscreenButton={this.state.showFullscreenButton && this.state.showGalleryFullscreenButton}
          showPlayButton={this.state.showPlayButton && this.state.showGalleryPlayButton}
          showThumbnails={this.state.showThumbnails}
          showIndex={this.state.showIndex}
          showNav={this.state.showNav}
          slideInterval={parseInt(this.state.slideInterval)}
          slideOnThumbnailHover={this.state.slideOnThumbnailHover}
        />

        <div className='app-sandbox'>

          <div className='app-sandbox-content'>
            <h2 className='app-header'>Settings</h2>

            <ul className='app-buttons'>
              <li>
                <div className='app-interval-input-group'>
                  <span className='app-interval-label'>Play Interval</span>
                  <input
                    className='app-interval-input'
                    type='text'
                    onChange={this._handleInputChange.bind(this, 'slideInterval')}
                    value={this.state.slideInterval}/>
                </div>
              </li>
            </ul>

            <ul className='app-checkboxes'>
              <li>
                <input
                  id='infinite'
                  type='checkbox'
                  onChange={this._handleCheckboxChange.bind(this, 'infinite')}
                  checked={this.state.infinite}/>
                  <label htmlFor='infinite'>allow infinite sliding</label>
              </li>
              <li>
                <input
                  id='show_fullscreen'
                  type='checkbox'
                  onChange={this._handleCheckboxChange.bind(this, 'showFullscreenButton')}
                  checked={this.state.showFullscreenButton}/>
                  <label htmlFor='show_fullscreen'>show fullscreen button</label>
              </li>
              <li>
                <input
                  id='show_playbutton'
                  type='checkbox'
                  onChange={this._handleCheckboxChange.bind(this, 'showPlayButton')}
                  checked={this.state.showPlayButton}/>
                  <label htmlFor='show_playbutton'>show play button</label>
              </li>
              <li>
                <input
                  id='show_bullets'
                  type='checkbox'
                  onChange={this._handleCheckboxChange.bind(this, 'showBullets')}
                  checked={this.state.showBullets}/>
                  <label htmlFor='show_bullets'>show bullets</label>
              </li>
              <li>
                <input
                  id='show_thumbnails'
                  type='checkbox'
                  onChange={this._handleCheckboxChange.bind(this, 'showThumbnails')}
                  checked={this.state.showThumbnails}/>
                  <label htmlFor='show_thumbnails'>show thumbnails</label>
              </li>
              <li>
                <input
                  id='show_navigation'
                  type='checkbox'
                  onChange={this._handleCheckboxChange.bind(this, 'showNav')}
                  checked={this.state.showNav}/>
                  <label htmlFor='show_navigation'>show navigation</label>
              </li>
              <li>
                <input
                  id='show_index'
                  type='checkbox'
                  onChange={this._handleCheckboxChange.bind(this, 'showIndex')}
                  checked={this.state.showIndex}/>
                  <label htmlFor='show_index'>show index</label>
              </li>
              <li>
                <input
                  id='slide_on_thumbnail_hover'
                  type='checkbox'
                  onChange={this._handleCheckboxChange.bind(this, 'slideOnThumbnailHover')}
                  checked={this.state.slideOnThumbnailHover}/>
                  <label htmlFor='slide_on_thumbnail_hover'>slide on thumbnail hover (desktop)</label>
              </li>
            </ul>
          </div>

        </div>
      </section>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('container'));

