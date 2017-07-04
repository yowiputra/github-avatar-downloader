var request = require('request');

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

function getRepoContributors(repoOwner, repoName, cb) {
  const path = `/repos/${repoOwner}/${repoName}/contributors`;
  request(getRequestOptions(path), function(err, response, body) {
    try {
      const data = JSON.parse(body);
      cb(data);
    } catch (err) {
      console.log("Error parsing content body");
    }
  });
}

getRepoContributors("jquery", "jquery", function(data){
  data.forEach(function(item){
    console.log(item.avatar_url);
  });
});
