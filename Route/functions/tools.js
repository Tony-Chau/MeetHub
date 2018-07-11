
module.exports = {
  //Converts 24 hours time to 12 hours
  ConvertTo12Hours: function(hour){
    var message = {
      hours: hour,
      amOrPm: 'am'
    };
    if (hour > 12){
      message.hours = hour - 12;
      message.amOrPm = 'pm';
    }else if (hour == 12){
      message.amOrPm = 'pm';
    }
    return message;
  },
  //converts milliseconds to Date
  registerDate: function(millisecond){
    EventDate = new Date(millisecond);
    var date = {
      hour: null,
      minute: null,
      message: null,
      day: null,
      month: null,
      year: null
    }
    var ConvertHour = this.ConvertTo12Hours(EventDate.getHours());
    date.hour = ConvertHour.hours;
    date.message = ConvertHour.amOrPm;
    date.minute = EventDate.getMinutes();
    date.day = EventDate.getDate();
    date.month = EventDate.getMonth() + 1; //getMonth() returns a value between 0 - 11
    date.year = EventDate.getFullYear();
    return date;
  },
  //Check if the value exist
  isset: function(val){
    if (typeof val === 'undefined'){
      return false;
    }
    return true;
  },
  checkminute: function(val){
    if (val < 10){
      return  '0' + val;
    }else{
      return '' + val;
    }
  },
  CreateTimeMessage: function (startDate){
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];        
    var start = new Date(startDate);
    var str = '';
    var day = days[start.getDay()];
    var month = months[start.getMonth()];
    var date = start.getDate();
    var starthours = this.ConvertTo12Hours(start.getHours());
    var startminute = start.getMinutes();
      str = day + ', ' + month + ' ' + date + ', ' + start.getFullYear() +
      ' (' + starthours.hours + ':' +  this.checkminute(startminute) + ' ' + starthours.amOrPm + ')';
    return str;
  },
  CreateTimeMessage: function (startDate, EndDate){
      var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];        
      var start = new Date(startDate);
      var str = '';
      var day = days[start.getDay()];
      var month = months[start.getMonth()];
      var date = start.getDate();
      var starthours = this.ConvertTo12Hours(start.getHours());
      var startminute = start.getMinutes();

        var end = new Date(EndDate);
        var endhours = this.ConvertTo12Hours(end.getHours());
        var endminute = end.getMinutes();
        str = day + ', ' + month + ' ' + date + ', ' + start.getFullYear() +
              ' (' + starthours.hours + ':' +  this.checkminute(startminute) + ' ' + starthours.amOrPm + 
              ' - ' + endhours.hours + ':' + this.checkminute(endminute) + ' ' + endhours.amOrPm + ')';
      return str;
  }
}
