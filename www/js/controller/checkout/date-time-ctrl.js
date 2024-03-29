app.controller('DateTimeCtrl', function($scope, $ionicPopup,$state,$rootScope) {

  $scope.chosenTime = ''; // will store the time selected by the user*/

  $scope.monthName = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  $scope.slotValues = function() {

    $scope.timeSlots9To12 = [
      {time: '9:00', selected: false, isDisabled: false, id: 0, timeActual: '9:00'},
      {time: '9:15', selected: false, isDisabled: false, id: 1, timeActual: '9:15'},
      {time: '9:30', selected: false, isDisabled: false, id: 2, timeActual: '9:30'},
      {time: '9:45', selected: false, isDisabled: false, id: 3, timeActual: '9:45'},
      {time: '10:00', selected: false, isDisabled: false, id: 4, timeActual: '10:00'},
      {time: '10:15', selected: false, isDisabled: false, id: 5, timeActual: '10:15'},
      {time: '10:30', selected: false, isDisabled: false, id: 6, timeActual: '10:30'},
      {time: '10:45', selected: false, isDisabled: false, id: 7, timeActual: '10:45'},
      {time: '11:00', selected: false, isDisabled: false, id: 8, timeActual: '11:00'},
      {time: '11:15', selected: false, isDisabled: false, id: 9, timeActual: '11:15'},
      {time: '11:30', selected: false, isDisabled: false, id: 10, timeActual: '11:30'},
      {time: '11:45', selected: false, isDisabled: false, id: 11, timeActual: '11:45'},
      {time: '12:00', selected: false, isDisabled: false, id: 12, timeActual: '12:00'}];

    $scope.timeSlots12To3 = [
      {time: '12:15', selected: false, isDisabled: false, id: 13, timeActual: '12:15'},
      {time: '12:30', selected: false, isDisabled: false, id: 14, timeActual: '12:30'},
      {time: '12:45', selected: false, isDisabled: false, id: 15, timeActual: '12:45'},
      {time: '1:00', selected: false, isDisabled: false, id: 16, timeActual: '13:00'},
      {time: '1:15', selected: false, isDisabled: false, id: 17, timeActual: '13:15'},
      {time: '1:30', selected: false, isDisabled: false, id: 18, timeActual: '13:30'},
      {time: '1:45', selected: false, isDisabled: false, id: 19, timeActual: '13:45'},
      {time: '2:00', selected: false, isDisabled: false, id: 20, timeActual: '14:00'},
      {time: '2:15', selected: false, isDisabled: false, id: 21, timeActual: '14:15'},
      {time: '2:30', selected: false, isDisabled: false, id: 22, timeActual: '14:30'},
      {time: '2:45', selected: false, isDisabled: false, id: 23, timeActual: '14:45'},
      {time: '3:00', selected: false, isDisabled: false, id: 24, timeActual: '15:00'}];

    $scope.timeSlots3To6 = [
      {time: '3:15', selected: false, isDisabled: false, id: 25, timeActual: '15:15'},
      {time: '3:30', selected: false, isDisabled: false, id: 26, timeActual: '15:30'},
      {time: '3:45', selected: false, isDisabled: false, id: 27, timeActual: '15:45'},
      {time: '4:00', selected: false, isDisabled: false, id: 28, timeActual: '16:00'},
      {time: '4:15', selected: false, isDisabled: false, id: 29, timeActual: '16:15'},
      {time: '4:30', selected: false, isDisabled: false, id: 30, timeActual: '16:30'},
      {time: '4:45', selected: false, isDisabled: false, id: 31, timeActual: '16:45'},
      {time: '5:00', selected: false, isDisabled: false, id: 32, timeActual: '17:00'},
      {time: '5:15', selected: false, isDisabled: false, id: 33, timeActual: '17:15'},
      {time: '5:30', selected: false, isDisabled: false, id: 34, timeActual: '17:30'},
      {time: '5:45', selected: false, isDisabled: false, id: 35, timeActual: '17:45'},
      {time: '6:00', selected: false, isDisabled: false, id: 36, timeActual: '18:00'}];

    $scope.timeSlots6To9 = [
      {time: '6:15', selected: false, isDisabled: false, id: 37, timeActual: '18:15'},
      {time: '6:30', selected: false, isDisabled: false, id: 38, timeActual: '18:30'},
      {time: '6:45', selected: false, isDisabled: false, id: 39, timeActual: '18:45'},
      {time: '7:00', selected: false, isDisabled: false, id: 40, timeActual: '19:00'},
      {time: '7:15', selected: false, isDisabled: false, id: 41, timeActual: '19:15'},
      {time: '7:30', selected: false, isDisabled: false, id: 42, timeActual: '19:30'},
      {time: '7:45', selected: false, isDisabled: false, id: 43, timeActual: '19:45'},
      {time: '8:00', selected: false, isDisabled: false, id: 44, timeActual: '20:00'},
      {time: '8:15', selected: false, isDisabled: false, id: 45, timeActual: '20:15'},
      {time: '8:30', selected: false, isDisabled: false, id: 46, timeActual: '20:30'},
      {time: '8:45', selected: false, isDisabled: false, id: 47, timeActual: '20:45'},
      {time: '9:00', selected: false, isDisabled: false, id: 48, timeActual: '21:00'}];

  };
  $scope.slotValues();


  $scope.back = function(){
    $state.go('cart',{'ven_id':window.localStorage.getItem("vendorId")})
  };




  var weekday = new Array(7);
  weekday[0]=  "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  
  $scope.fromDate = new Date();
  $scope.month = $scope.fromDate.getMonth();
  $scope.currentMonth = $scope.monthName[$scope.month];
  $scope.date = $scope.fromDate.getDate();                       // store the current date
  $scope.year = $scope.fromDate.getFullYear();
  $scope.day = weekday[$scope.fromDate.getDay()];
  $scope.countForward = 0;

/////   To check time slot for selected date and time of appointment /////////////

  $scope.checkSlots = function(hourValue){
    if(hourValue>=9){
      $scope.disabledTimeSlots($scope.timeSlots9To12);
    }
    if(hourValue>=12){
      $scope.disabledTimeSlots($scope.timeSlots12To3);
    }
    if(hourValue>=15){
      $scope.disabledTimeSlots($scope.timeSlots3To6);
    }
    if(hourValue>=18){
      $scope.disabledTimeSlots($scope.timeSlots6To9);
    }
  };


  ///// To disable particular slots which are less than the current time /////////////////

  $scope.disabledTimeSlots = function(updateTimeSlots){
    for(var i =0;i<updateTimeSlots.length;i++){
      var dateValue = $scope.fromDate.getDate()+'-'+$scope.monthName[$scope.fromDate.getMonth()]+'-'+$scope.fromDate.getFullYear();
      $scope.newStamp = toTimestamp( dateValue+ ' ' + updateTimeSlots[i].timeActual);
      if($scope.thisBookingTime>$scope.newStamp){
        updateTimeSlots[i].isDisabled = true;
      }
    }
  };

  var appointmentDate = {
    'date':$scope.date,
    'month':$scope.currentMonth,
    'year':$scope.year
  }
  localStorage.setItem('appointmentDate', JSON.stringify(appointmentDate));

  window.localStorage.setItem("chosenTime", '');



  //////    To check current selected date for appointment id equal to today's date  ////////////

  $scope.getTimeFormat = function (dateApt) {

    var bookDateForAppointment = dateApt.date+'-'+dateApt.month+'-'+dateApt.year;

    /// add '1' for difference of 1 hour from right now time ////////
    $scope.timeTobe = (new Date().getHours()+1)+':'+new Date().getMinutes();

    $scope.currentHour = new Date().getHours()+1;

    $scope.thisBookingTime = toTimestamp(bookDateForAppointment + ' ' + $scope.timeTobe);
    $scope.checkSlots($scope.currentHour);
  };

  //  To calculate the time stamp for selected date and and current time  ////


  function toTimestamp(thisBookingTime) {
    var datum = Date.parse(thisBookingTime);
    return datum;
  }

  var dateForAppointment = JSON.parse(localStorage.getItem('appointmentDate'));

  if((dateForAppointment.date == $scope.fromDate.getDate())&&
      (dateForAppointment.month == $scope.monthName[$scope.fromDate.getMonth()])&&
      (dateForAppointment.year ==$scope.fromDate.getFullYear()) ){
    $scope.getTimeFormat(dateForAppointment);
  }
  else{
    //// initialized slots again ///
    $scope.slotValues();

  }
  $rootScope.$on('appointment', function (event, args) {
    $scope.message = args.message;
    var dateForAppointment = JSON.parse(localStorage.getItem('appointmentDate'));
    if((dateForAppointment.date == $scope.fromDate.getDate())&&
        (dateForAppointment.month == $scope.monthName[$scope.fromDate.getMonth()])&&
        (dateForAppointment.year ==$scope.fromDate.getFullYear()) ){
      $scope.getTimeFormat(dateForAppointment);
    }
    else{
      //// initialized slots again ///
      $scope.slotValues();
    }
  });

  $scope.timeSelected = function(index, id) {
    // console.log("index",index);
    // console.log("id",id);
    // console.log($scope.timeSlots[index].selected);
    for (var key in $scope.timeSlots9To12) {
      if ($scope.timeSlots9To12[key].id != id) {
  
  /** using jquery to remove the class */
        $('#'+$scope.timeSlots9To12[key].id).removeClass('selected-time');
      } else {
        if ($scope.timeSlots9To12[key].isDisabled != true) {

    /** using jquery to add the class */
          $('#'+id).addClass('selected-time');
          $scope.chosenTime = $scope.timeSlots9To12[key].time+'AM';
          window.localStorage.setItem("chosenTime", $scope.chosenTime);

          console.log($scope.chosenTime);
        }
      }
    }
    for (var key in $scope.timeSlots12To3) {
      if ($scope.timeSlots12To3[key].id != id) {
        $('#'+$scope.timeSlots12To3[key].id).removeClass('selected-time');
      } else {
        if ($scope.timeSlots12To3[key].isDisabled != true) {
          $('#'+id).addClass('selected-time');
          $scope.chosenTime = $scope.timeSlots12To3[key].time+'PM';
          window.localStorage.setItem("chosenTime", $scope.chosenTime);

          console.log($scope.chosenTime);
        }
      }
    }
    for (var key in $scope.timeSlots3To6) {
      if ($scope.timeSlots3To6[key].id != id) {
        $('#'+$scope.timeSlots3To6[key].id).removeClass('selected-time');
      } else {
        if ($scope.timeSlots3To6[key].isDisabled != true) {
          $('#'+id).addClass('selected-time');
          $scope.chosenTime = $scope.timeSlots3To6[key].time+'PM';
          window.localStorage.setItem("chosenTime", $scope.chosenTime);

          console.log($scope.chosenTime);
        }
      }
    }
    for (var key in $scope.timeSlots6To9) {
      if ($scope.timeSlots6To9[key].id != id) {
        $('#'+$scope.timeSlots6To9[key].id).removeClass('selected-time');
      } else {
        if ($scope.timeSlots6To9[key].isDisabled != true) {
          $('#'+id).addClass('selected-time');
          $scope.chosenTime = $scope.timeSlots6To9[key].time+'PM';
          window.localStorage.setItem("chosenTime", $scope.chosenTime);

          console.log($scope.chosenTime);
        }
      }
    }
  };

  $scope.rightArrowClicked = function() {
    $scope.countForward++;
    if ($scope.countForward < 7) {
      var nextDay = new Date();
      if (nextDay.getMonth() != $scope.month) {
        nextDay.setMonth($scope.month);
      }
      if (nextDay.getFullYear() != $scope.year) {
        nextDay.setFullYear($scope.year);
      }
      nextDay.setDate($scope.date + 1);
      $scope.date = nextDay.getDate();
      $scope.month = nextDay.getMonth();
      $scope.year = nextDay.getFullYear();
      $scope.day = weekday[nextDay.getDay()];
      $scope.currentMonth = $scope.monthName[$scope.month];
    } else {
      $ionicPopup.alert({
         title: 'Select Appropriate Date',
         template: 'Please select a previous date!'
       });
    }
    var appointmentDate = {
      'date':$scope.date,
      'month':$scope.currentMonth,
      'year':$scope.year
    }
    localStorage.setItem('appointmentDate', JSON.stringify(appointmentDate));

    $rootScope.$broadcast('appointment', { message: 'appointment date changed' });

    console.log($scope.date, $scope.currentMonth, $scope.year)

  };


  $scope.leftArrowClicked = function() {
    $scope.countForward = 0;
    if (($scope.date > (new Date()).getDate()) && ($scope.month >= (new Date()).getMonth())) {
      var previousDay = new Date();
      if (previousDay.getMonth() != $scope.month) {
        previousDay.setMonth($scope.month);
      }
      if (previousDay.getFullYear() != $scope.year) {
        previousDay.setFullYear($scope.year);
      }
      previousDay.setDate($scope.date - 1);
      $scope.date = previousDay.getDate();  
      $scope.month = previousDay.getMonth();
      $scope.year = previousDay.getFullYear();
      $scope.day = weekday[previousDay.getDay()];
      $scope.currentMonth = $scope.monthName[$scope.month]; 
    } else {
      $ionicPopup.alert({
         title: 'Select Appropriate Date',
         template: 'Please select a valid date!'
       });
    }
    var appointmentDate = {
      'date':$scope.date,
      'month':$scope.currentMonth,
      'year':$scope.year
    }
    localStorage.setItem('appointmentDate', JSON.stringify(appointmentDate));
    $rootScope.$broadcast('appointment', { message: 'appointment date changed' });

    console.log($scope.date, $scope.currentMonth, $scope.year)

  };

  $scope.getItemHeight = function() {
    return ($(window).height() - 226)+'px';  // 226 is the height of header + footer + the upper part(row)
  };

  $scope.confirmation = function(){
    if((JSON.parse(localStorage.getItem('appointmentDate'))) && (window.localStorage.getItem("chosenTime"))){
      $state.go('confirmation');
    }
    else{
      alert('Please select time for appointment!');
    }
    // $state.go('confirmation');
  };

});