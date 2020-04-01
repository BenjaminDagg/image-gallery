
import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

//filters to sort photos by
const FILTERS  = {
  RAND:  'random',
  ORDER: 'order'
}

export default class App extends Component {

  constructor(props)  {
    super(props);

    this.state = {
      photos: [],
      filter: FILTERS.RAND,
      search: ""
    }
    this.shuffle = this.shuffle.bind(this);
    this.createGallery = this.createGallery.bind(this);
    this.filterChange = this.filterChange.bind(this);
    this.searchChanged = this.searchChanged.bind(this);
  }

  componentDidMount() {
    //lorem picsum api url
    const url = 'https://picsum.photos/v2/list';

    //get photos and save to state
    axios.get( url)
    .then(res => {
      
        var photos  = res.data;
        photos = this.shuffle(photos);
        this.setState({photos: photos});
    })
  }


  //shuffles  element sof array in random order
  shuffle(array) {

    var currentIndex = array.length;
    var temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  
  };

  createGallery() {

    //return if photos not loaded yet
    if (this.state.photos.length === 0) {
      return;
    }

    var  cols = [];//holds 'column' divs
    var photosOriginal = this.state.photos;

    //filter photos  by  search input first
    photosOriginal = photosOriginal.filter((photo) => photo.author.toLowerCase().includes(this.state.search));
    

    //randomly display in columns
    if(this.state.filter === FILTERS.RAND) {
      for (var i = 0; i < 4;i++) {
        var photosRand = this.shuffle(photosOriginal);
        var col = <div className="column">
          {
            photosRand.map((photo) => {
              return (
                <div>
                  <img src={photo.download_url} />
                  <h6>Author: {photo.author}</h6>
                </div>
              )
            }) 
          }
        </div>
        cols.push(col);
      }
    }
    //display photos in order according to index  in array
    else {
      photosOriginal = photosOriginal.sort(function(a,b ){
        if(a.id < b.id) { return -1; }
        if(a.id > b.id) { return 1; }
        return 0;
      })
      //array of arrays
      var bucket = [];
      //create for sub arrays
      for (var i = 0; i < 4;i++) {
        bucket[i] = new Array();
      }
      console.log(bucket);
      //round robin add photos to each  array
      for (var i = 0; i < photosOriginal.length;i++) {
        var index = i % 4;
        photosOriginal[i].bucket = index;
        photosOriginal[i].index = i;
        bucket[index].push(photosOriginal[i]);
      }

      //create column div and add all the sub-arrays  photos
      for (var i = 0; i < 4;i++ ) {
        cols.push(
          <div className="column">
            {
              bucket[i].map((photo) => {
                return (
                <div>
                  <img src={photo.download_url} />
                  <h6>Author: {photo.author}</h6>
                  <h6>bucket: {photo.bucket}</h6>
                  <h6>index: {photo.index}</h6>
                </div>)
              })
            }
          </div>
        )
      }
    }

    //return  array of 'column' divs containing photos
    return cols;
  }
  
  //event when filter selector changes
  filterChange(event) {
    var val = event.target.value;

    if (val === FILTERS.RAND ) {
      this.setState({filter:FILTERS.RAND})
    }
    else {
      this.setState({filter:FILTERS.ORDER})
    }
  }
  

  //called when search input changes. Updates state value
  searchChanged(event) {
    var val = event.target.value;
    this.setState({search:val});
  }
  
  render() {

    //get list of columns containng images
    var cols = this.createGallery();

    return (
      <div className="App">
        <div className="header">
          <h1>Image Gallery</h1>
          <select onChange={this.filterChange} value={this.state.filter}>
            <option value={FILTERS.RAND}>Random</option>
            <option value={FILTERS.ORDER}>Order</option>
          </select>
          <br/>
          <input onChange={this.searchChanged} value={this.state.search} type="text" placeholder="Search author"/>
        </div>
        <div  className="row">
          {cols}
        </div>
      </div>
    );
  }
}


