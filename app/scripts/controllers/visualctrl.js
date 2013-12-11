angular.module('UserAdminApp').controller('VisualCtrl', function ($scope, RestNetworkUser, Util, SessionStorage) {

    var coursesMock = 
    [
    {"description":null,"title":"JIRA 6.0","uuid":"c4ecff00-9b5e-4d97-883e-7a5e13587568","name":"v60","name_product":"-university-course-library-jira"},
    {"description":null,"title":"JIRA 5.2","uuid":"151e9ee1-f541-46f0-ae92-41ba4d1da0fb","name":"v52","name_product":"-university-course-library-jira"},
    {"description":null,"title":"JIRA 5.1","uuid":"63780c00-dc2e-40a2-98ea-35ac9f56beec","name":"v51","name_product":"-university-course-library-jira"},
    {"description":null,"title":"JIRA 5.0","uuid":"92e44e93-fb57-402e-8d9f-0e5cfcbaa652","name":"v50","name_product":"-university-course-library-jira"},
    {"description":null,"title":"JIRA 4.4","uuid":"ef898daa-8200-4e25-8bd6-4292715b15be","name":"v44","name_product":"-university-course-library-jira"},
    {"description":null,"title":"Confluence 5.0","uuid":"7dd21a6f-3495-4892-bda7-8d00dbdc85b2","name":"v50","name_product":"-university-course-library-confluence"},
    {"description":null,"title":"Confluence 4.3","uuid":"5614003c-8190-41ff-ad86-bfa8afd27b05","name":"v43","name_product":"-university-course-library-confluence"},
    {"description":null,"title":"Confluence 4.0","uuid":"d80dec44-4353-453b-a67b-c009ba478857","name":"v40","name_product":"-university-course-library-confluence"},
    {"description":null,"title":"Confluence 3.5","uuid":"6cb7e21d-cd07-42ee-a5fe-2ddc2e47fe86","name":"v35","name_product":"-university-course-library-confluence"},
    {"description":null,"title":"GreenHopper 6.0","uuid":"b2736929-9d19-4cb6-ad0a-5074f43e1be4","name":"v60","name_product":"-university-course-library-greenhopper"},
    {"description":null,"title":"GreenHopper 5.9","uuid":"95d7457e-4719-4071-a7d8-b31582d7ed9e","name":"v59","name_product":"-university-course-library-greenhopper"},
    {"description":null,"title":"GreenHopper 5.7","uuid":"0f50ba76-cc03-4a77-bdb3-db7ba072de28","name":"v57","name_product":"-university-course-library-greenhopper"}
    ];

    var userMock = 
    [
    {"lesson-uuid":"65b0036c-f373-4c9e-b2f6-d1a1e54a95b3","id-user":"oafridi@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"65b0036c-f373-4c9e-b2f6-d1a1e54a95b3"},
    {"lesson-uuid":"eddd7dd4-df0b-405f-8447-7d348128898b","id-user":"oafridi@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"eddd7dd4-df0b-405f-8447-7d348128898b"},
    {"lesson-uuid":"99418172-71ac-4426-88be-886a91f8bca2","id-user":"oafridi@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"99418172-71ac-4426-88be-886a91f8bca2"},
    {"lesson-uuid":"f2a28404-e767-4015-9386-a204318910f5","id-user":"oafridi@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"f2a28404-e767-4015-9386-a204318910f5"},
    {"lesson-uuid":"bc5b24f3-ba83-45ab-8221-4add9a2ecdae","id-user":"oafridi@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"bc5b24f3-ba83-45ab-8221-4add9a2ecdae"},
    {"lesson-uuid":"eefd93eb-97a2-4b30-b5b4-c2170207f54b","id-user":"oafridi@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"eefd93eb-97a2-4b30-b5b4-c2170207f54b"},
    {"lesson-uuid":"ddc13fb2-8214-41e6-8dae-ba99fd3b874a","id-user":"oafridi@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"ddc13fb2-8214-41e6-8dae-ba99fd3b874a"},
    {"lesson-uuid":"8548a78e-8c36-4e88-ae3f-7b0c37a8ba73","id-user":"oafridi@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"8548a78e-8c36-4e88-ae3f-7b0c37a8ba73"},
    {"lesson-uuid":"8ba1f82c-29c8-4d4e-a62d-cff03664b4e3","id-user":"oafridi@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"8ba1f82c-29c8-4d4e-a62d-cff03664b4e3"},
    {"lesson-uuid":"f64eadaf-acf4-4abb-8a0f-12c11bdd131f","id-user":"oafridi@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"f64eadaf-acf4-4abb-8a0f-12c11bdd131f"},
    {"lesson-uuid":"efd3d8c6-6653-476b-97c4-c47d594b2acc","id-user":"oafridi@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"efd3d8c6-6653-476b-97c4-c47d594b2acc"},
    {"lesson-uuid":"744571c5-0c13-40ea-bb4d-c1e3c44f3817","id-user":"oafridi@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"744571c5-0c13-40ea-bb4d-c1e3c44f3817"},
    {"lesson-uuid":"2c14d14d-f694-4b5c-b877-38182a76a6ca","id-user":"oafridi@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"2c14d14d-f694-4b5c-b877-38182a76a6ca"},
    {"lesson-uuid":"c663b6c1-ac66-422e-a6ff-6a62cc50db20","id-user":"oafridi@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"c663b6c1-ac66-422e-a6ff-6a62cc50db20"},
    {"lesson-uuid":"17d54907-b0db-43b2-87ac-dc6dfdef0739","id-user":"mhalvorson@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"navigate-a-space"},
    {"lesson-uuid":"07c7bb1a-c813-4851-997a-6f96140d873c","id-user":"mhalvorson@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"content-structure"},
    {"lesson-uuid":"0656428a-753b-4281-a737-e81d5bf58032","id-user":"mhalvorson@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"quick-search"},
    {"lesson-uuid":"ca72a2a4-c901-4b56-a3a1-14e10bfff702","id-user":"mhalvorson@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"search-change-history"},
    {"lesson-uuid":"e110eae9-89bf-4745-a7b7-5a229b8eb75e","id-user":"mhalvorson@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"save-and-share-filter"},
    {"lesson-uuid":"a6a97dc6-9cf9-4ffe-b542-290ad945734e","id-user":"mhalvorson@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"working-with-search-results"},
    {"lesson-uuid":"cc5439e0-8ba1-4c5b-99a7-1ecda9b9c03f","id-user":"mhalvorson@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"find-subscribe-to-a-filter"},
    {"lesson-uuid":"1e1ed6ad-6d0c-4802-8831-144f8856dc3f","id-user":"mhalvorson@atlassian.com","user-uuid":null,"uuid":null,"name-lesson":"simple-search"}  
    ];

    // ===============================================================================
    // PRIVATE FUNCTIONS
    // ===============================================================================

    var getTitles = function (array) {
        var ra = [];
        for (var i = array.length - 1; i >= 0; i--) {
            ra.push(array[i]['title']);
        }
        return ra;
    };

    test = function(){
        console.log('test');
    };

    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================

    //Arrays
    $scope.lessonNames = getTitles(coursesMock); 
    $scope.companyNames = ["Atlassian", "HubSpot", "Rakuten", "Company #2", "Company #3"];
    $scope.lessonCount;

    // $scope.reverse = false;
    // $scope.orderField = 'email';
    // $scope.users = [];
    // $scope.$on('$NetworkUpdate', loadNetworkData);
    // loadNetworkData();

    // ===============================================================================
    // AJS
    // ===============================================================================

    AJS.$("#date-picker-start").datePicker({
        overrideBrowserDefault: true
    });
    AJS.$("#date-picker-end").datePicker({
        overrideBrowserDefault: true
    });

    // ===============================================================================
    // CHARTJS RELATED
    // ===============================================================================


    var graphdata = {
        labels : ["Lesson 1","Lesson 2","Lesson 3","Lesson 4","Lesson 5","Lesson 6","Lesson 7","Lesson 8","Lesson 9","Lesson 10","Lesson 11","Lesson 12"],
        datasets : [{
            fillColor : "rgba(45,45,45,0.5)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            data : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        }]
    };

    var hi_value = _.max(data['datasets'][0]['data']);
    var ctx = document.getElementById("the_chart").getContext("2d");
    var myNewChart = new Chart(ctx).Bar(graphdata,{
        scaleOverlay : false,
        scaleOverride : true,
        scaleSteps : hi_value,
        scaleStepWidth : 1,
        scaleStartValue : null,
        scaleLineColor : "rgba(0,0,0,.1)",
        scaleLineWidth : 1,
        scaleShowLabels : true,
        scaleLabel : "<%=value%>",
        scaleFontFamily : "'Arial'",
        scaleFontSize : 11,
        scaleFontStyle : "bold",
        scaleFontColor : "#666",
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(0,0,0,.05)",
        scaleGridLineWidth : 1,
        barShowStroke : true,
        barStrokeWidth : 2,
        barValueSpacing : 10,
        barDatasetSpacing : 1,
        animation : true,
        animationSteps : 30,
        animationEasing : "easeOutQuart",
        onAnimationComplete : null
    }); 

});