angular.module('UserAdminApp').controller('VisualCtrl', function ($scope, RestNetworkUser, Util, SessionStorage) {


    // ===============================================================================
    // MOCK OBJECT(S)
    // ===============================================================================
    
    //the unique id for each row is: id-user + name-lesson + title-course + name-company
    var storageMock = 
    [
    {"id-user":"rrandom@atlassian.com","name-lesson":"content-structure","title-course":"JIRA 5.2","date":"2013-12-09","name-company":"atlassian"},
    {"id-user":"uluku@atlassian.com","name-lesson":"navigate-a-space","title-course":"JIRA 5.2","date":"2013-12-09","name-company":"atlassian"},
    {"id-user":"mman@atlassian.com","name-lesson":"navigate-a-space","title-course":"JIRA 5.2","date":"2013-12-09","name-company":"atlassian"},
    {"id-user":"mmoore@atlassian.com","name-lesson":"navigate-a-space","title-course":"JIRA 5.2","date":"2013-12-09","name-company":"atlassian"},
    
    {"id-user":"oafridi@atlassian.com","name-lesson":"navigate-a-space","title-course":"JIRA 5.2","date":"2013-12-09","name-company":"atlassian"},
    {"id-user":"oafridi@atlassian.com","name-lesson":"content-structure","title-course":"JIRA 5.2","date":"2013-12-09","name-company":"atlassian"},
    {"id-user":"oafridi@atlassian.com","name-lesson":"quick-search","title-course":"JIRA 5.2","date":"2013-12-09","name-company":"atlassian"},
    {"id-user":"oafridi@atlassian.com","name-lesson":"search-change-history","title-course":"JIRA 5.2","date":"2013-12-09","name-company":"atlassian"},
    {"id-user":"oafridi@atlassian.com","name-lesson":"save-and-share-filter","title-course":"JIRA 5.2","date":"2013-12-09","name-company":"atlassian"},
    {"id-user":"oafridi@atlassian.com","name-lesson":"working-with-search-results","title-course":"JIRA 5.2","date":"2013-12-11","name-company":"atlassian"},
    {"id-user":"oafridi@atlassian.com","name-lesson":"find-subscribe-to-a-filter","title-course":"JIRA 5.2","date":"2013-12-11","name-company":"atlassian"},
    {"id-user":"oafridi@atlassian.com","name-lesson":"simple-search","title-course":"JIRA 5.2","date":"2013-12-11","name-company":"atlassian"},

    {"id-user":"mhalvorson@atlassian.com","name-lesson":"navigate-a-space","title-course":"JIRA 6.0","date":"2013-12-13","name-company":"atlassian"},
    {"id-user":"mhalvorson@atlassian.com","name-lesson":"content-structure","title-course":"JIRA 6.0","date":"2013-12-13","name-company":"atlassian"},
    {"id-user":"mhalvorson@atlassian.com","name-lesson":"quick-search","title-course":"JIRA 6.0","date":"2013-12-13","name-company":"atlassian"},
    {"id-user":"mhalvorson@atlassian.com","name-lesson":"search-change-history","title-course":"JIRA 6.0","date":"2013-12-15","name-company":"atlassian"},
    {"id-user":"mhalvorson@atlassian.com","name-lesson":"save-and-share-filter","title-course":"JIRA 6.0","date":"2013-12-15","name-company":"atlassian"},
    {"id-user":"mhalvorson@atlassian.com","name-lesson":"working-with-search-results","title-course":"JIRA 6.0","date":"2013-12-15","name-company":"atlassian"},
    {"id-user":"mhalvorson@atlassian.com","name-lesson":"find-subscribe-to-a-filter","title-course":"JIRA 6.0","date":"2013-12-15","name-company":"atlassian"},
    {"id-user":"mhalvorson@atlassian.com","name-lesson":"simple-search","title-course":"JIRA 6.0","date":"2013-12-15","name-company":"atlassian"},   

    {"id-user":"ekent@atlassian.com","name-lesson":"search-change-history","title-course":"JIRA 6.0","date":"2013-12-19","name-company":"atlassian"},
    {"id-user":"ekent@atlassian.com","name-lesson":"save-and-share-filter","title-course":"JIRA 6.0","date":"2013-12-19","name-company":"atlassian"},
    {"id-user":"ekent@atlassian.com","name-lesson":"working-with-search-results","title-course":"JIRA 6.0","date":"2013-12-19","name-company":"atlassian"},
    {"id-user":"ekent@atlassian.com","name-lesson":"find-subscribe-to-a-filter","title-course":"JIRA 6.0","date":"2013-12-19","name-company":"atlassian"},
    {"id-user":"ekent@atlassian.com","name-lesson":"simple-search","title-course":"JIRA 6.0","date":"2013-12-19","name-company":"atlassian"},

    {"id-user":"cclone@hubspot.com","name-lesson":"search-change-history","title-course":"JIRA 6.0","date":"2013-12-20","name-company":"hubspot"},
    {"id-user":"cclone@hubspot.com","name-lesson":"save-and-share-filter","title-course":"JIRA 6.0","date":"2013-12-20","name-company":"hubspot"},
    {"id-user":"cclone@hubspot.com","name-lesson":"working-with-search-results","title-course":"JIRA 6.0","date":"2013-12-20","name-company":"hubspot"},
    {"id-user":"cclone@hubspot.com","name-lesson":"find-subscribe-to-a-filter","title-course":"JIRA 6.0","date":"2013-12-20","name-company":"hubspot"},
    {"id-user":"cclone@hubspot.com","name-lesson":"simple-search","title-course":"JIRA 6.0","date":"2013-12-20","name-company":"hubspot"}
    ];

    console.log(storageMock.length);
    // ===============================================================================
    // PRIVATE FUNCTIONS
    // ===============================================================================

    var extractUniqueData = function(dataset, string_arg){
        return _.uniq(_.map(dataset, function(setEntity){
            return setEntity[string_arg];
        }));
    };

    var extractSearchedData = function(dataset, searchParams){
        return _.filter(dataset, function(setEntity){
            var ret = true;
            // Dates check, - NOTICE -  these will change depending on where you are browsing from. I suspect.
            var startDate = createDate(searchParams["date-start"]);
            var entityDate = createDate(setEntity["date"]);
            var endDate = createDate(searchParams["date-end"]);
            if ( !(_.contains(searchParams["courses"], setEntity["title-course"])) ) {
                ret = false;
            }
            else if ( !(_.contains(searchParams["companies"], setEntity["name-company"])) ) {
                ret = false;
            } 
            else if (entityDate < startDate || entityDate > endDate) {
                ret = false;
            }
            if (ret) {
                return setEntity;
            }
        });

    };

    var createModelData = function(extDataset){
        var model = {};
        model["labels"] = extractUniqueData(extDataset, "name-lesson");

        model["values"] = _.map(model["labels"], function(label){
            var lessonCounter = 0;
            _.each(extDataset, function(setEntity){
                if( setEntity["name-lesson"] == label) {
                    lessonCounter++;
                }
            });
            return lessonCounter; 
        });

        // not good but i'm lazy
        if ( !_.isEmpty(model["values"]) ){
            $scope.memory["total"] = _.reduce(model["values"], function(memo, num){
                return memo + num;
            });
        }
         
        model["highest"] = _.max(model["values"]);
        
        // model["lowest"] = _.min(model["values"]);
        return model;
    };

    var createDate = function(datestring){
        var dateray = datestring.split('-');
        return new Date(dateray[0], parseInt(dateray[1])-1 ,dateray[2]);
    };

    //Updates via dom
    var updateSearchParams = function() {
        var searchModel = {};

        searchModel["courses"] = [];
        _.each($scope.courseNames, function(coursename){
            if ( document.getElementById(coursename).checked ) {
                searchModel["courses"].push(coursename);
            }
        });

        searchModel["companies"] = [];
        var tkn = $scope.memory["company"];
        if (tkn == "All Companies" || tkn == null) {
            searchModel["companies"] = $scope.companyNames;
        } else {
            searchModel["companies"].push(tkn);
        }
        
        if ( createDate(document.getElementById('date-picker-start').value) > createDate(document.getElementById('date-picker-end').value) ){
            document.getElementById('date-picker-start').value = document.getElementById('date-picker-end').value;
        }
        searchModel["date-start"] = document.getElementById('date-picker-start').value;
        searchModel["date-end"] = document.getElementById('date-picker-end').value;

        return searchModel;
    };

    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================


    //Arrays
    $scope.courseNames = ["JIRA 6.0", "JIRA 5.2", "JIRA 5.1", "JIRA 5.0", "JIRA 4.4", "Confluence 5.0", "Confluence 4.3", "Confluence 4.0", "Confluence 3.5", "GreenHopper 6.0", "GreenHopper 5.9", "GreenHopper 5.7"]; 
    $scope.companyNames = ["atlassian", "hubspot"];
    $scope.memory = {"allCoursesSelected":false,"company":null,"course":null,"total":0};
    // $scope.courseNames = extractUniqueData(storageMock, 'title-course'); 
    // $scope.companyNames = extractUniqueData(storageMock, 'name-company');
    
    //Model Vars
    var searchParams = {"companies":["atlassian", "hubspot"], "courses":["JIRA 6.0", "JIRA 5.2"], "date-start":"2013-12-09", "date-end":"2013-12-10"};



    //Event Functions
    $scope.selectAllCourses = function(){
        if ($scope.memory["allCoursesSelected"]==false) {
            _.each($scope.courseNames, function(coursename){ 
                document.getElementById(coursename).checked = true;
            });
            $scope.memory["allCoursesSelected"]=true;
        }
        else {
            _.each($scope.courseNames, function(coursename){ 
                document.getElementById(coursename).checked = false;
            });
            $scope.memory["allCoursesSelected"]=false;
        }
    };

    $scope.addCompany = function(companyname){
        $scope.memory["company"] = companyname;        
    }

    $scope.allCompanies = function(){
        $scope.memory["company"] = "All Companies";
    }

    $scope.update = function(){   
        searchParams = updateSearchParams();
        var ext_data = extractSearchedData(storageMock, searchParams);
        var mod_data = createModelData(ext_data);
        $scope.drawChart(mod_data);
    } 

    $scope.drawChart = function(mod_data){
        var ctx = document.getElementById("theChart").getContext("2d");
        var CHARTJS = new Chart(ctx).Bar (
        {
            labels : mod_data["labels"],
            datasets : [{
                fillColor : "rgba(65,65,65,0.5)",
                strokeColor : "rgba(220,220,220,1)",
                pointColor : "rgba(220,220,220,1)",
                pointStrokeColor : "#fff",
                data : mod_data["values"]
            }]
        },{
            scaleOverlay : false,
            scaleOverride : true,
            scaleSteps : mod_data["highest"],
            scaleStepWidth : 1,
            scaleStartValue : 0,
            scaleLineColor : "rgba(0,0,0,.2)",
            scaleLineWidth : 1,
            scaleShowLabels : true,
            scaleLabel : "<%=Math.round(value)%>",
            scaleFontFamily : "'Arial'",
            scaleFontSize : 13,
            scaleFontStyle : "bold",
            scaleFontColor : "#666",
            scaleShowGridLines : true,
            scaleGridLineColor : "rgba(0,0,0,.2)",
            scaleGridLineWidth : 1,
            barShowStroke : true,
            barStrokeWidth : 1,
            barValueSpacing : 5,
            barDatasetSpacing : 1,
            animation : true,
            animationSteps : 30,
            animationEasing : "easeOutQuart",
            onAnimationComplete : null
        }); 
}

    $scope.drawChart(createModelData(extractSearchedData(storageMock, searchParams)));

    // ===============================================================================
    // AJS
    // ===============================================================================

    var date0 = AJS.$("#date-picker-start").datePicker({
        overrideBrowserDefault: true
    });

    var date1 = AJS.$("#date-picker-end").datePicker({
        overrideBrowserDefault: true
    });


});