//intialising some packages
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

//getting data from the Json file
var google_authorization_Json = require('./../../Json/client_secret.json');
//Decalre oauth2Client class with some Json data inputted
var client_id = google_authorization_Json.web.client_id;
var client_password = google_authorization_Json.web.client_secret;
var callback = google_authorization_Json.web.redirect_uris[1];

var oauth2Client = new OAuth2(client_id, client_password, callback);

// generate a url that asks permissions for Google+ and Google Calendar scopes
var scope = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/calendar'
]

module.exports = {
  getauthUrl: function(){
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scope
    });
  },
  setAccessToken: function(code){
    oauth2Client.getToken(code, function (err, tokens){
      if (!err){
        oauth2Client.setCredentials(tokens);
      }
    });
  },
  listEvents: function (){
    var calendar = google.calendar('v3');
    calendar.events.list({
      auth: oauth2Client,
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime'
    }, function (err, response){
      if (err){
        console.log('There was an API error: ' + err);
        return;
      }
      var events = response.items;
      if (events.length == 0){
        console.log('There are no events found');
      }else{
        console.log('Here are your 10 upcoming events: ');
        for (var i = 0; i < events.length; i += 1){
          var start = events[i].start.dateTime || events[i].start.date;
          console.log(start + " - " + events[i].summary);
        }
      }
    });
  },
  CreateEvent: function(events){
    //A description was included to add to events, however, I have decided not to include it due 
    //to the description may be too long and will contain some html tags that may interfere for the client to read it
    var addEvent = {
      'summary': events.name,
      'location': events.location,
      'start': {
        'dateTime': events.start
      },
      'end':{
        'dateTime': events.end
      },
      'reminders':{
        'useDefault': false,
        'overrides': [
          {'method': 'email', 'minutes': 24*60},
          {'method': 'popup', 'minutes': 60}
        ],
      }
    }
    var calendar = google.calendar('v3');
    var html = '';
    calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      resource: addEvent,
    }, function (err, event){
      if (err){
        console.log('There was an error contacting the Calendar API: ' + err);
        return ;
      }
      console.log('Event Created: ' + event.htmlLink);
      html += event.htmlLink;
    });
    console.log("The HTML IS: " + html);
    return html;
  },
  refreshToken: function(){
    oauth2Client.refreshAccessToken(function(err, tokens) {
      if (!err){
        oauth2Client.setCredentials(tokens);
      } 
    });
  }
}