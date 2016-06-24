app.controller('DateTimeCtrl', function($scope, $ionicPopup) {

  $scope.chosenTime = ''; // will store the time selected by the user*/

  $scope.monthName = ['JAN', 'FUB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  $scope.timeSlots9To12 = [{time:'9:00',selected:false, isDisabled:false, id:0}, {time:'9:15', selected:false,isDisabled:false, id:1},
  {time:'9:30',selected:false, isDisabled:false, id:2}, {time:'9:45',selected:false,isDisabled:false,id:3},
  {time:'10:00',selected:false, isDisabled:false, id:4}, {time:'10:15',selected:false,isDisabled:false,id:5},
  {time:'10:30',selected:false, isDisabled:false, id:6}, {time:'10:45',selected:false, isDisabled:false, id:7}, 
  {time:'11:00',selected:false, isDisabled:false, id:8},  {time:'11:15',selected:false, isDisabled:false, id:9}, 
  {time:'11:30',selected:false, isDisabled:false, id:10}, 
  {time:'11:45',selected:false, isDisabled:false, id:11}, {time:'12:00',selected:false, isDisabled:false, id:12}];

  $scope.timeSlots12To3 = [{time:'12:15',selected:false, isDisabled:false, id:13}, {time:'12:30',selected:false, isDisabled:false, id:14},
  {time:'12:45',selected:false, isDisabled:false, id:15}, {time:'1:00',selected:false, isDisabled:false, id:16}, 
  {time:'1:15',selected:false,id:17}, {time:'1:30',selected:false, isDisabled:false,  isDisabled:false, id:18}, {time:'1:45',selected:false, isDisabled:false, id:19}, 
  {time:'2:00',selected:false, isDisabled:false, id:20}, 
  {time:'2:15',selected:false, isDisabled:false, id:21}, {time:'2:30',selected:false, isDisabled:false, id:22}, 
  {time:'2:45',selected:false, isDisabled:false, id:23},
  {time:'3:00',selected:false, isDisabled:false, id:24}];

  $scope.timeSlots3To6 = [{time:'3:15',selected:false, isDisabled:false, id:25},
  {time:'3:30',selected:false, isDisabled:false, id:26}, {time:'3:45',selected:false, isDisabled:false, id:27}, {time:'4:00',selected:false, isDisabled:false, id:28}, 
  {time:'4:15',selected:false, isDisabled:false, id:29}, {time:'4:30',selected:false, isDisabled:false, id:30},{time:'4:45',selected:false, isDisabled:false, id:31}, 
  {time:'5:00',selected:false, isDisabled:false, id:32},  {time:'5:15',selected:false, isDisabled:false, id:33}, {time:'5:30',selected:false, isDisabled:false, id:34}, 
  {time:'5:45',selected:false, isDisabled:false, id:35}, {time:'6:00',selected:false, isDisabled:false, id:36}];

  $scope.timeSlots6To9 = [{time:'6:15',selected:false, isDisabled:false, id:37},
  {time:'6:30',selected:false, isDisabled:false, id:38}, {time:'6:45',selected:false, isDisabled:false, id:39}, {time:'7:00',selected:false, isDisabled:false, id:40}, 
  {time:'7:15',selected:false, isDisabled:false, id:41}, {time:'7:30',selected:false, isDisabled:false, id:42},{time:'7:45',selected:false, isDisabled:false, id:43}, 
  {time:'8:00',selected:false, isDisabled:false, id:44},  {time:'8:15',selected:false, isDisabled:false, id:45}, {time:'8:30',selected:false, isDisabled:false, id:46}, 
  {time:'8:45',selected:false, isDisabled:false, id:47}, {time:'9:00',selected:false, isDisabled:false, id:48}];

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

  $scope.timeSelected = function(index, id) {
    //console.log($scope.timeSlots[index].selected);
    console.log(index);
    console.log(id);
    for (var key in $scope.timeSlots9To12) {
      if ($scope.timeSlots9To12[key].id != id) {
  
  /** using jquery to remove the class */
        $('#'+$scope.timeSlots9To12[key].id).removeClass('selected-time');
      } else {
        if ($scope.timeSlots9To12[key].isDisabled != true) {

    /** using jquery to add the class */
          $('#'+id).addClass('selected-time');
          $scope.chosenTime = $scope.timeSlots9To12[key].time+'AM';
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
  };

  $scope.getItemHeight = function() {
    return ($(window).height() - 226)+'px';  // 226 is the height of header + footer + the upper part(row)
  };
});