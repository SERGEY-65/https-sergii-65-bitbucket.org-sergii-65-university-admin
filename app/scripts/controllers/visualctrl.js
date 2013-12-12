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
            else if (setEntity["name-company"] != searchParams["company"]) {
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
         
        model["highest"] = _.max(model["values"]);
        
        // model["lowest"] = _.min(model["values"]);
        return model;
    };

    var createDate = function(datestring){
        var dateray = datestring.split('-');
        return new Date(dateray[0], parseInt(dateray[1])-1 ,dateray[2]);
    };

    //Updates via dom
    var updateExtractionParams = function(params) {
        
    };

    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================

    //Arrays
    $scope.courseNames = ["JIRA 6.0", "JIRA 5.2"]; 
    $scope.companyNames = ["atlassian", "hubspot"];
    // $scope.courseNames = extractUniqueData(storageMock, 'title-course'); 
    // $scope.companyNames = extractUniqueData(storageMock, 'name-company');
    
    //Initally set
    var searchParams = {"company":"atlassian","courses":["JIRA 6.0", "JIRA 5.2"],"date-start":"2013-12-09","date-end":"2013-12-09"};

    //Event Functions
    $scope.update = function(){

        // updatesearchParams(searchParams);
        var ext_data = extractSearchedData(storageMock, searchParams);
        var mod_data = createModelData(ext_data);
        // console.log(ext_data);
        // console.log(mod_data);

        var ctx = document.getElementById("theChart").getContext("2d");
        var CHARTJS = new Chart(ctx).Bar(
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
            scaleLineWidth : 2,
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
    }; 

$scope.test = function(){
    console.log("HELLO");
};

    // ===============================================================================
    // AJS
    // ===============================================================================

    var date0 = AJS.$("#date-picker-start").datePicker({
        overrideBrowserDefault: true
    });
    var date1 = AJS.$("#date-picker-end").datePicker({
        overrideBrowserDefault: true
    });

    $scope.update()

});