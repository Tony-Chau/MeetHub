//Initialising Request
var express = require('express');
var MeetUpRoute = express.Router();
const app = express();
const tools = require('./functions/tools.js');
//MeetupAPI functions
const meetupAPI = require('./functions/MeetupAPI.js');
//Google Details
var GoogleCalendarAPI = require('./functions/GoogleCalendarAPI.js');
//BingMaps API
var BingMapsAPI = require('./functions/BingMapsAPI.js');
//Obtained from the app.js
const server_setup = {
  hostname: '127.0.0.1',
  port : 3000
}

//The Home Page
MeetUpRoute.get('/', function(req, res){
  var category = meetupAPI.getCategory();
  var name = [];
  for(var i = 0; i < category.results.length; i += 1){
    name[i] = category.results[i].name;
  }
  res.render('index', {
    Title: "MeetHub",
    Categories: name
  });
});

//The search page
MeetUpRoute.get('/Search', function(req, res){
  if (tools.isset(req.query.category)){
    var str = req.query.category;
    var searchType = 'Category: ';
  } else if(tools.isset(req.query.qry)){
    var str = req.query.qry
    var searchType= 'Search: ';
  }
  //used to remove the ampersand symbol to prevent the http get request from confusion
  var query = str.replace('&', '%26'); 
  var category = meetupAPI.findEvents(query);
  //Checks if there are any events avaliable depending on the search
  if (!tools.isset(category[0].name)){
    res.render('search', {
      Title: "MeetHub",
      result: null,
      qry: 'Sorry, but it seems there are no events in this Category/Search',
      rows: 0
    });
  }else{
    var length = category.length;
    var send = {
      name: [length],
      group_urlname: [length],
      id: [length],
      city: [length],
      host: [length],
      TimeMessage: [length]
    }
    //rows is used to help the data to be displayed on pug
    var rows = [length];
    for (var i = 0; i < length; i += 1){
      var list = category[i];
      send.name[i] = list.name;
      send.group_urlname[i] = list.group.urlname;
      send.id[i] = list.id;
      //The time message is a short text that shows the date and time of the event
      //Sometimes the event does not provide a duration value, which the end date will be left blank
      if (tools.isset(list.duration)){
        send.TimeMessage[i] =  tools.CreateTimeMessage(list.time, list.time + list.duration);
      }else{
        send.TimeMessage[i] =  tools.CreateTimeMessage(list.time);
      }
      if (tools.isset(list.venue)){
        send.host[i] = list.venue.name;
        send.city[i] = list.venue.address_1 + ', ' + list.venue.city + ', ' + list.venue.localized_country_name;
      }else{
        send.host[i] = list.group.name;
        send.city[i] = list.group.localized_location; 
      }
      rows[i] = i;
    }
    res.render('search', {
      Title: "MeetHub",
      result: send,
      qry: searchType + str,
      rows: rows
    });
  }
});

MeetUpRoute.get('/Event/:urlname/:id', function(req, res){
  app.locals.id = req.params.id; 
  app.locals.urlname = req.params.urlname;
  var Event = meetupAPI.getEvent(req.params.urlname, req.params.id)
  var description = 'Sorry, but it seems this event has no description. This event may be private. To join, please click on the link above';
  //This checks if the event has any description, due to some events may be private
  if (tools.isset(Event.description)){
    description = Event.description;
  }
  var lat = 0;
  var lon = 0;
  //This gets the location of event, but some events may not have a venue, so a group location is replaced instead
  if (tools.isset(Event.venue)){
    lat = Event.venue.lat;
    lon = Event.venue.lon;
  }else{
    lat = Event.group.lat;
    lon = Event.group.lon;
  }
  var TimeMessage = '';
  if (tools.isset(Event.duration)){
    TimeMessage = tools.CreateTimeMessage(Event.time, Event.time + Event.duration);
  }else{
    TimeMessage = tools.CreateTimeMessage(Event.time);
  }  
  if (tools.isset(Event.venue)){
    var host = Event.venue.name;
    var city = Event.venue.address_1 + ', ' + Event.venue.city + ', ' + Event.venue.localized_country_name;
  }else{
    var host = Event.group.name;
    var city = Event.group.localized_location; 
  }
  var send = {
    name: Event.name,
    host: Event.group.name,
    description: description,
    lat: lat,
    lon: lon,
    link: Event.link,
    TimeMessage: TimeMessage,
    city: city
  }
  res.render('event', {
    title: 'MeetHub',
    result: send,
    url: GoogleCalendarAPI.getauthUrl(),
    BingAPIKey: BingMapsAPI.getAPIKey()
  });
});

//oauth page
MeetUpRoute.get('/oauthcallback', function (req, res){
  var code = req.query.code.replace('#', '');
  GoogleCalendarAPI.setAccessToken(code);
  //The setTimeout is used to help the access token to be set. Please wait 20 seconds 
  setTimeout(function (){
    var Event = meetupAPI.getEvent(app.locals.urlname, app.locals.id);
    GoogleCalendarAPI.listEvents();
    var start = new Date(Event.time);
    if (tools.isset(Event.duration)){
      var end = new Date(Event.time + Event.duration);
    }else{
      var end = new Date(Event.time + 7200000); //made the event around 2 hours if there are no duration avaliable
    }
    
    if (tools.isset(Event.venue)){
      var city = Event.venue.address_1 + ', ' + Event.venue.city + ', ' + Event.venue.localized_country_name;
    }else{
      var city = Event.group.localized_location; 
    }
    GoogleCalendarAPI.CreateEvent({
      name: Event.name,
      location: city,
      start: start,
      end: end
    });
    res.render('oauth');
  }, 20000); 
});

module.exports = MeetUpRoute;
