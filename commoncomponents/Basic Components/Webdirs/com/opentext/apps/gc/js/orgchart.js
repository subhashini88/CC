/**
 * 
 * 
**/

function OrgChart() {
    var self = this;
    self.header = ko.observable("Org Chart");
    self.orgList = ko.observableArray([]);
    self.childOrgs = ko.observableArray([]);
    self.showMembers = ko.observable(false);
    self.showMembers.subscribe(function (newVal) {
        console.log("self.showMembers.subscribe");
        if (newVal) {
            $("#container")[0].classList.remove("col-md-12");
            $("#container")[0].classList.add("col-md-4");
        } else {
            $("#container")[0].classList.remove("col-md-4");
            $("#container")[0].classList.add("col-md-12");
        }
    });
    self.pupulateOrgs = function () {
        _fetchJSON();
    }
    self.selectOrg = function (data, event) {
        var orgIndex = self.orgList.indexOf(data);
    }
    self.viewMembers = function () {
        self.showMembers(!self.showMembers());
    }
    function _fetchJSON() {
        fetch("http://pnarabopf13gllc.opentext.net:81/home/system/com/opentext/apps/gc/htm/orgdata.json").then(response => response.json()).then(orgdata => _populateOrg(orgdata));
    }
    function _populateOrg(orgdataArr) {
        self.orgList(ko.mapping.fromJS(orgdataArr)());
        self.childOrgs(self.orgList()[self.orgList().length - 1].container());
    }
}

$(function () {
    var orgObj = new OrgChart();
    orgObj.pupulateOrgs();
    ko.applyBindings(orgObj, document.getElementById("main"));
})