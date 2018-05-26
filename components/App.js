var GIPHY_API_URL = "https://api.giphy.com";
var GIPHY_PUB_KEY = "q4k1xiFfyXHFEVGeG4SYB8VJsIA5OtQu";

App = React.createClass({
  //1. sets initial state

  getInitialState() {
    return {
      loading: false,
      searchingText: "",
      gif: {}
    };
  },

  // 2. HandleSearch method sets state loading to true and calls getGif function. The parameter of function is searchingText an callback. Receive gif object as callback and sets new states after receiving gif

  handleSearch: function(searchingText) {

    this.setState({
      loading: true
    });

    // b) this part runs getGif method and sets new state of App component then receive gif object from callback
    var self = this;

    this.getGif(searchingText)
      .then(function(gif) {
        self.setState({
          loading: false,
          gif: gif,
          searchingText: searchingText
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  },

  // 3.  getGif method - gets gif from giphy.com and returns gif object as callback

  getGif: function(searchingText) {
    return new Promise((resolve, reject) => {
      var url =
        GIPHY_API_URL +
        "/v1/gifs/random?api_key=" +
        GIPHY_PUB_KEY +
        "&tag=" +
        searchingText;
      console.log(url);
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onload = function() {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText).data;
          if (data.type === "gif") {
            var gif = {
              url: data.fixed_width_downsampled_url,
              sourceUrl: data.url
            };
            resolve(gif);
          } else {
            reject(new Error("Gif not found"));
          }
        } else {
          reject(new Error(this.statusText));
        }
      };
      xhr.send();
    });
  },

  /* 4.  Render method  */

  /* onSearch={this.handleSearch - refers handleSearch function to Search component as  property */
  /* this.state.loading - refers loading state to Gif component as property*/
  /* this.state.gif.url -  refers url adress to Gif component as property */
  /* this.state.gif.sourceUrl - refers sourceUrl adress to Gif component as property */

  render: function() {
    var styles = {
      margin: "0 auto",
      textAlign: "center",
      width: "90%"
    };

    return (
      <div style={styles}>
        <h1>Wyszukiwarka Gifów</h1>
        <p>
          Znajdź gifa na <a href="'https://giphy.com">giphy</a> Naciskaj Enter,
          aby pobrać kolejne gify.
        </p>
        <Search onSearch={this.handleSearch} />
        <Gif
          loading={this.state.loading}
          url={this.state.gif.url}
          sourceUrl={this.state.gif.sourceUrl}
        />
      </div>
    );
  }
});
