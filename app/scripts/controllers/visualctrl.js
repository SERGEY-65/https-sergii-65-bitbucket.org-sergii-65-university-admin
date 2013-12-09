angular.module('UserAdminApp').controller('VisualCtrl',
    function ($scope, RestNetworkUser, Util, SessionStorage) {

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

    // ===============================================================================
    // PRIVATE FUNCTIONS
    // ===============================================================================

    var getTitles = function (array) {
        var ra = [];
        for (var i = array.length - 1; i >= 0; i--) {
         ra.push(array[i]['title']);
     }
     return ra;
 }

 mouseUp = function(){
    console.log(this);
}  




    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================

    //Arrays
    $scope.lessonNames = getTitles(coursesMock); 
    $scope.lessonCount;

    // $scope.reverse = false;
    // $scope.orderField = 'email';
    // $scope.users = [];

    // $scope.$on('$NetworkUpdate', loadNetworkData);
    // loadNetworkData();

    // ===============================================================================
    // AJS
    // ===============================================================================


    AJS.$("#demo-date-picker1").datePicker({
        overrideBrowserDefault: true
    });
    AJS.$("#demo-date-picker2").datePicker({
        overrideBrowserDefault: true
    });


    // ===============================================================================
    // CHARTJS RELATED
    // ===============================================================================





    var data = {
        labels : $scope.lessonNames,
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
    var myNewChart = new Chart(ctx).Bar(data,{
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
        scaleFontSize : 12,
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