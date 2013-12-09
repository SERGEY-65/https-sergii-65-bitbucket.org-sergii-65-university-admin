angular.module('UserAdminApp').controller('VisualCtrl',
    function ($scope, RestNetworkUser, Util, SessionStorage) {

    // ===============================================================================
    // PRIVATE FUNCTIONS
    // ===============================================================================

    var mockArray = 
    [
    {"description":null,"title":"JIRA 6.0","uuid":"c4ecff00-9b5e-4d97-883e-7a5e13587568","name":"v60","name_product":"-university-course-library-jira"},
    {"description":null,"title":"JIRA 5.2","uuid":"151e9ee1-f541-46f0-ae92-41ba4d1da0fb","name":"v52","name_product":"-university-course-library-jira"},
    {"description":null,"title":"JIRA 5.1","uuid":"63780c00-dc2e-40a2-98ea-35ac9f56beec","name":"v51","name_product":"-university-course-library-jira"},
    {"description":null,"title":"JIRA 5.0","uuid":"92e44e93-fb57-402e-8d9f-0e5cfcbaa652","name":"v50","name_product":"-university-course-library-jira"},
    {"description":null,"title":"JIRA 4.4","uuid":"ef898daa-8200-4e25-8bd6-4292715b15be","name":"v44","name_product":"-university-course-library-jira"}
    ];


    var extractNames = function (array) {
        var ra = [];
        for (var i = array.length - 1; i >= 0; i--) {
         ra.push(array[i]['title']);
     }
     return ra;
 }

 var data = {
    labels : ["Lesson 01","Lesson 02","Lesson 03","Lesson 04","Lesson 05","Lesson 06","Lesson 07"],
    datasets : [{
        fillColor : "rgba(45,45,45,0.5)",
        strokeColor : "rgba(220,220,220,1)",
        pointColor : "rgba(220,220,220,1)",
        pointStrokeColor : "#fff",
        data : [1, 2, 3, 4, 5, 6, 7]
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
    scaleFontStyle : "normal",
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

    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================

    $scope.names = extractNames(mockArray);

    // $scope.reverse = false;
    // $scope.orderField = 'email';
    // $scope.users = [];

    // $scope.$on('$NetworkUpdate', loadNetworkData);
    // loadNetworkData();

});