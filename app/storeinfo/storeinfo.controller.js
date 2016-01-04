angular
    .module('xenon.controllers')
    .controller('storeinfoCtrl', storeinfoCtrl);
function storeinfoCtrl($scope, $log, FileUploader, storeinfoFactory, localStorageService, storeinfoLocationsFactory, storeinfoLocationsIdFactory) {
    var dateArray = [];
    var responseDateArr = [];
    var i;
    var DateFlag = 0;
    var LocationIdFlag = 0;
    var userData = localStorageService.get("userData");
    var locationId = userData.locations[0];
    if (angular.isDefined(locationId)) {
        edit();
    } else {
        LocationIdFlag = 1;
    }
    $scope.mytime = new Date();
    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };
    $scope.openingtime = function() {
        //$log.log('open time ' + $scope.open);
    };
    $scope.closingtime = function() {
        //$log.log('Time close ' + $scope.close);
    };

    $scope.logInfos = function(event, date) {
        event.preventDefault();
        var timeStamp = date.valueOf();
        var day = new Date(timeStamp).getDate();
        var month = new Date(timeStamp).getMonth() + 1;
        var year = new Date(timeStamp).getFullYear();
        var fullDate = day + "-" + month + "-" + year;
        //console.log(dateArray);

        for (i = 0; i < dateArray.length; i++) {
            
            if (dateArray[i] === fullDate) {
                var idx = dateArray.indexOf(fullDate);
                // dateArray.pop(fullDate);
                dateArray.splice(idx,1);
                DateFlag = 1;
            } 

        }
        console.log(DateFlag);
        if (DateFlag == 0) {
            console.log('unmatch');
            dateArray.push(fullDate);
        }
        console.log(dateArray);
        date.selected = !date.selected;
    }
    function edit() {
        $scope.spinner = true;
        var query = storeinfoLocationsIdFactory.update({}, {
            'locationid': userData.locations[0]
        });
        query.$promise.then(function(data) {
            localStorageService.set('storeInfo',data);
           console.log(data);
            $scope.spinner = false;
            $scope.lname = data.data.lname;
            angular.element(document.querySelector('.CodeMirror-code pre span')).text(data.data.ldesc);
            $scope.lemail = data.data.lemail;
            $scope.llogo = data.data.llogo;
            $scope.laddr = data.data.laddr;
            $scope.lpostcode = data.data.lpostcode;
            $scope.city = data.data.city;
            $scope.lcountry = data.data.lcountry;
            $scope.lphone = data.data.lphone;
            $scope.llt = data.data.llt;
            $scope.lmessage = data.data.lmessage;
            $scope.open = data.data.lopentime;
            $scope.close = data.data.lclosetime;
            $scope.highlightDays = data.data.ldateclosed;
            var closed = data.data.ldateclosed;
            dateArray = dateArray.concat(closed);
            //console.log(dateArray);
            for (i = 1; i < closed.length; i++) {
                var responseDate = closed[i].split('-').reverse();
                var responseTimestamp = new Date(responseDate).getTime();
                responseDateArr.push(responseTimestamp);
            }
            $scope.selectedDays = responseDateArr;

        });
    }
    $scope.lsave = function() {
        $scope.spinner = true;
        if (LocationIdFlag === 0) {
            console.log("flag=o update is firing");
            var query = storeinfoLocationsIdFactory.update({}, {
                'locationid': userData.locations[0],
                'lname': $scope.lname,
                'ldesc': $scope.ldesc,
                'lemail': $scope.lemail,
                'llgo': $scope.llogo,
                'laddr': $scope.laddr,
                'lpostcode': $scope.lpostcode,
                'lcity': $scope.city,
                'lcountry': $scope.lcountry,
                'lphone': $scope.lphone,
                'llt': $scope.llt,
                'ldateclosed': dateArray,
                'lmessage': $scope.lmessage,
                'lopentime': $scope.open,
                'lclosetime': $scope.close
            });
            query.$promise.then(function(data) {
                $scope.spinner = false;
                localStorageService.set('storeInfo',data);
            });
        } else {
            console.log("flag=1 save is firing");
            $scope.ldesc = angular.element(document.querySelector('#uikit_editor_2')).val();
            var query = storeinfoFactory.save({
                locationId: userData.locations[0],
                lname: $scope.lname,
                ldesc: $scope.ldesc,
                lemail: $scope.lemail,
                llgo: $scope.llogo,
                laddr: $scope.laddr,
                lpostcode: $scope.lpostcode,
                lcity: $scope.city,
                lcountry: $scope.lcountry,
                lphone: $scope.lphone,
                llt: $scope.llt,
                lmessage: $scope.lmessage,
                lopentime: $scope.open,
                lclosetime: $scope.close
            });
            query.$promise.then(function(data) {
                $scope.spinner = false;
                localStorageService.set('storeInfo',data);
            });
        }
    }
    
    var uploader = $scope.uploader = new FileUploader({});
    uploader.filters.push({
        name: 'imageFilter',
        fn: function(item, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });
}