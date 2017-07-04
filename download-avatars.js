// GITHUB AVATAR DOWNLOADER
// Functionality: downloads a repository's contributors' avatars as jpg images
// Call syntax example: node download_avatars.js <repoOwner> <repoName>

var request = require('request');
var fs = require('fs');

function getRequestOptions(path){
  return {
    url: 'https://api.github.com' + path,
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    },
    qs: {
      access_token: process.env.GITHUB_TOKEN
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

getRepoContributors(process.argv[2], process.argv[3], function(data){
  data.forEach(function(item){
    const downloadPath = `./avatars/${item.login}.jpg`;
    downloadImageByURL(item.avatar_url, downloadPath);
  });
});
