const axios = require('axios');
const client_id = '1f4613c15ada4f4f8d45e80f7358e4e1'; // Your client id
const client_secret = '5b7c8d618eae41b3950369b4f135d775'; // Your secret

// create a function to return the access token required from Spotify
const getAccessToken = async () => {
  // Encoding Client ID and Secret for Authorization Header from Spotify
  const authHeader = 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64');
// set the post response to a variable so i can use it more flexibly 
// here i am sending my credentials to spotify and hopefully getting my access token in return after i make a post request
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // if the post status response comes back as 200; return the data

    if (response.status === 200) {
      console.log(response.data);
      return response.data.access_token; 
    // } else {
    //   // Handle non-200 responses
    //   console.error('Error in getting access token:', response.status);
    //   return "Check your getAccessFunction"; 
    }
  } catch (error) {
    console.error('Could not get access token:', error);
    throw error; 
  }
};

module.exports = { getAccessToken };
