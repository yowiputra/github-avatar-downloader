// GITHUB AVATAR DOWNLOADER
// Functionality: downloads a repository's contributors' avatars as jpg images
// Call syntax example: node download_avatars.js <repoOwner> <repoName>

var request = require('request');
var fs = require('fs');
const dotenv = require("dotenv");
const authCode = dotenv.parse(fs.readFileSync('.env')).GITHUB_ACCESS_TOKEN;

function getRequestOptions(path){
  return {
    url: 'https://api.github.com' + path,
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    },
    qs: {
      access_token: authCode
    }
  };
}

function getRepoContributors(repoOwner, repoName, callback){
  const path = `/repos/${repoOwner}/${repoName}/contributors`;
  request(getRequestOptions(path), function(err, response, body) {
    try {
      const data = JSON.parse(body);
      callback(data);
    } catch (err) {
      console.log("Error parsing content body");
    }
  });
}

function downloadImageByURL(url, filePath){
  request.get(url)
    .on('error', function(err){
      throw err;
    })
    .on('response', function(response){
      // tell user the image is downloading
      console.log("Downloading image from " + url);
    })
    .pipe(fs.createWriteStream(filePath))
}

// define input variables
var repoOwner = process.argv[2];
var repoName = process.argv[3];

// error handling
if(!authCode){
  console.log("Please check if .env file is missing or corrupt");
} else if(!repoOwner || !repoName){
  console.log("Please state repo info on terminal");
} else {
  // if nothing wrong, try to access api
  getRepoContributors(repoOwner, repoName, function(data){
    data.forEach(function(item){
      const downloadPath = `./avatars/${item.login}.jpg`;
      downloadImageByURL(item.avatar_url, downloadPath);
    });
  });
}
