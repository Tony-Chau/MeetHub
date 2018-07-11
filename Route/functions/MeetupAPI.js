var request = require('requestsync');
var MeetUp = {
    hostname: 'https://api.meetup.com',
    MeetUpAPIKey : "4b6682d68407430523c5e6b5f10148"
  }

module.exports = {
    getCategory: function (){
        var options = {
            method: 'GET',
            url: ''
          };
          var getCategory_link = "/2/categories?"+
                                 "sign=true" +
                                 "&key=" + MeetUp.MeetUpAPIKey;
          options.url = MeetUp.hostname + getCategory_link;
          var res = request(options);
          return JSON.parse(res.body);
    },
    getEvent: function (group_urlName, id){
        var options = {
            method: 'GET',
            url: ''
          };
          var event_link = '/' + group_urlName + 
                           '/events/' + id +  
                           '?key=' + MeetUp.MeetUpAPIKey +
                           '&group_urlname=' + group_urlName +
                           '&sign=true';
          options.url = MeetUp.hostname + event_link;
          var res = request(options);
          return JSON.parse(res.body);
    },
    findEvents: function (query){
        var options = {
            method: 'GET',
            url: ''
          };
          var link = "/find/events?" + 
                     "sign=true" + 
                     "&key=" + MeetUp.MeetUpAPIKey + 
                     "&text=" + query;
          options.url = MeetUp.hostname + link;
          var res = request(options);
          return JSON.parse(res.body);
    }
}