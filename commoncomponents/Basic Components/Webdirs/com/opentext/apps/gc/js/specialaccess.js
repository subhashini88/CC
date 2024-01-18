$.cordys.json.defaults.removeNamespacePrefix = true;
//global variables
var l_specialAccessFilter_model;
var l_specialAccess_model;
//mapping itemId: name
var selectedSpecialAccessSet = new Set();

//default offset and limit
var membersListOffsetValue = 0;
var membersListLimitValue = 25;
//Main Model for Special Access
function SpecialMembersModel(itemId){
    var self = this;
    self.itemId = ko.observable(itemId);
    self.MembersList = ko.observableArray([]);
    self.isFilterApplied = ko.observable(false);
    
    //variables for pagination
    self.numOfMembers = ko.observable('');
    self.numOfMembersInCurrentPage = ko.observable('');
    self.numOfPages = ko.observable('');
    self.currentPage = ko.observable(1);

    self.onSelectAllSpecialAccessCheckboxValueChanged = function (iItem, event) {
        
        var l_currentClassName = event.currentTarget.className;
        if (l_currentClassName == "cc-select-column cc-checkbox-select-all-off" || l_currentClassName == "cc-select-column cc-checkbox-select-all-partial") {
            $(event.currentTarget).removeClass("cc-checkbox-select-all-off");
            $(event.currentTarget).removeClass("cc-checkbox-select-all-partial");
            $(event.currentTarget).addClass("cc-checkbox-select-all-on");
            $("#id_SpecialAccessTable").find("tbody .cc-select-column").removeClass("cc-checkbox-off");
            $("#id_SpecialAccessTable").find("tbody .cc-select-column").addClass("cc-checkbox-on");
            $("#id_SpecialAccessTable").find("tbody tr").css("background-color", "#CBD3D9");
            $("#id_editSpecialAccessActionBar").css("display", "none");
            $("#id_deleteSpecialAccessActionBar").css("display", "inline");
            l_specialAccess_model.MembersList().forEach(function (iToken) {
                selectedSpecialAccessSet.add([iToken["OrganizationMembers-id"].ItemId1]);
            });
        }
        else if (l_currentClassName == "cc-select-column cc-checkbox-select-all-on") {
            $(event.currentTarget).removeClass("cc-checkbox-select-all-on");
            $(event.currentTarget).addClass("cc-checkbox-select-all-off");
            $("#id_SpecialAccessTable").find('tbody .cc-select-column').removeClass("cc-checkbox-on");
            $("#id_SpecialAccessTable").find('tbody .cc-select-column').addClass("cc-checkbox-off");
            $("#id_SpecialAccessTable").find('tbody tr').css("background-color", "transparent")
            $("#id_editSpecialAccessActionBar").css("display", "none");
            $("#id_deleteSpecialAccessActionBar").css("display", "none");
            
            selectedSpecialAccessSet = new Set();

        }
        event.stopPropagation();
    };
    self.onSpecialAccessCheckboxValueChanged = function (iItem, event) {
        var l_currentClassName = event.currentTarget.className;
        
        if (l_currentClassName == "cc-select-column cc-checkbox-off") {
            $(event.currentTarget).removeClass("cc-checkbox-off")
            $(event.currentTarget).addClass("cc-checkbox-on")
            $("#id_editSpecialAccessActionBar").css("display", "inline");
            $("#id_deleteSpecialAccessActionBar").css("display", "inline");
            selectedSpecialAccessSet.add(iItem["OrganizationMembers-id"].ItemId1);
            
            $(event.currentTarget.parentElement.parentElement).css("background-color", "#CBD3D9")
        }
        else if (l_currentClassName == "cc-select-column cc-checkbox-on") {
            $(event.currentTarget).removeClass("cc-checkbox-on")
            $(event.currentTarget).addClass("cc-checkbox-off")
            $("#id_editSpecialAccessActionBar").css("display", "none");
            $("#id_deleteSpecialAccessActionBar").css("display", "none");
            selectedSpecialAccessSet.delete(iItem["OrganizationMembers-id"].ItemId1);
            $(event.currentTarget.parentElement.parentElement).css("background-color", "transparent")
        }
        event.stopPropagation();
        
        if (selectedSpecialAccessSet.size <= 0) {
            $("#id_selectAllSpecialAccess").removeClass("cc-checkbox-select-all-partial");
            $("#id_selectAllSpecialAccess").removeClass("cc-checkbox-select-all-on");
            $("#id_selectAllSpecialAccess").addClass("cc-checkbox-select-all-off");
            $("#id_editSpecialAccessActionBar").css("display", "none");
            $("#id_deleteSpecialAccessActionBar").css("display", "none");
        } else if (selectedSpecialAccessSet.size == 1) {
            if (1 == l_specialAccess_model.numOfMembersInCurrentPage()) {
                $("#id_selectAllSpecialAccess").removeClass("cc-checkbox-select-all-off");
                $("#id_selectAllSpecialAccess").removeClass("cc-checkbox-select-all-partial");
                $("#id_selectAllSpecialAccess").addClass("cc-checkbox-select-all-on");
                $("#id_editSpecialAccessActionBar").css("display", "inline");
                $("#id_deleteSpecialAccessActionBar").css("display", "inline");
            } else {
                $("#id_selectAllSpecialAccess").removeClass("cc-checkbox-select-all-off");
                $("#id_selectAllSpecialAccess").removeClass("cc-checkbox-select-all-on");
                $("#id_selectAllSpecialAccess").addClass("cc-checkbox-select-all-partial");
                $("#id_editSpecialAccessActionBar").css("display", "inline");
                $("#id_deleteSpecialAccessActionBar").css("display", "inline");
            }
        } else if (selectedSpecialAccessSet.size > 1 && selectedSpecialAccessSet.size < l_specialAccess_model.numOfMembersInCurrentPage()) {
            $("#id_selectAllSpecialAccess").removeClass("cc-checkbox-select-all-off");
            $("#id_selectAllSpecialAccess").removeClass("cc-checkbox-select-all-on");
            $("#id_selectAllSpecialAccess").addClass("cc-checkbox-select-all-partial");
            $("#id_editSpecialAccessActionBar").css("display", "none");
            $("#id_deleteSpecialAccessActionBar").css("display", "inline");
        } else if (selectedSpecialAccessSet.size == l_specialAccess_model.numOfMembersInCurrentPage()) {
            $("#id_selectAllSpecialAccess").removeClass("cc-checkbox-select-all-off");
            $("#id_selectAllSpecialAccess").removeClass("cc-checkbox-select-all-partial");
            $("#id_selectAllSpecialAccess").addClass("cc-checkbox-select-all-on");
        }
        
    };
   
};
function addDataToMembersListView(iElementList, iModel) {
    
    iModel.MembersList.removeAll();
    if (iElementList) {
        if (iElementList.length) {
            iModel.numOfMembersInCurrentPage(iElementList.length);
            iElementList.forEach(function (iElement) {
                iModel.MembersList.push(iElement);
            });
        }
        else {
            iModel.numOfMembersInCurrentPage("1");
            iModel.MembersList.push(iElementList);
        }
    }
    
}
function updatePaginationParams() {
    if (l_specialAccess_model.currentPage() == 1) {
        document.getElementById("li_MembersListLeftNavigation").style.display = "none";
        document.getElementById("li_MembersListRightNavigation").style.display = "inline";
    }
    if (parseInt(l_specialAccess_model.numOfMembers()) <= parseInt(membersListLimitValue)) {
        l_specialAccess_model.currentPage('1');
        $('#li_MembersListLeftNavigation,#li_MembersListRightNavigation').css('display', 'none');
    }
}
//list all members with special access
function listSpecialAccessMembers() {
    $("#id_editSpecialAccessActionBar").css("display", "none");
    $("#id_deleteSpecialAccessActionBar").css("display", "none");
    $("#id_selectAllSpecialAccess").removeClass("cc-checkbox-select-all-partial");
    $("#id_selectAllSpecialAccess").removeClass("cc-checkbox-select-all-on");
    $("#id_selectAllSpecialAccess").addClass("cc-checkbox-select-all-off");
    selectedSpecialAccessSet = new Set();
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
        method: "GetSpecialAccessMembers",
        parameters: l_specialAccessFilter_model.getFilterObject(),
        success: function (data) {
            addDataToMembersListView(data.SpecialAccessMembers.FindZ_INT_SpecialAccessMembersListResponse.OrganizationMembers, l_specialAccess_model);
            
            if (data.SpecialAccessMembers.FindZ_INT_SpecialAccessMembersListResponse["@total"]) {
                l_specialAccess_model.numOfMembers(data.SpecialAccessMembers.FindZ_INT_SpecialAccessMembersListResponse["@total"]);
            }
            else {
                l_specialAccess_model.numOfMembers(0);
            }
            if (l_specialAccess_model.numOfMembers() != 0) {
                l_specialAccess_model.numOfPages(Math.ceil(l_specialAccess_model.numOfMembers() / membersListLimitValue));
            } else {
                l_specialAccess_model.numOfPages(1);
            }
            
            updatePaginationParams();
   
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_listErrorInfoArea", true, getTranslationMessage("Unable to retrieve members. Contact your administrator."), 10000);
            return false;
        }
    });
}
//filter model
var SpecialAccessFilterModel = function(){
    var self = this;
    var l_nameFilterField = document.getElementById("filter_memberName");
    var l_memberOrgFilterField = document.getElementById("filter_memberOrg");
    var l_specialAccessOrgFilterField = document.getElementById("filter_SpecialAccessOrg");
    self.ClearFilter = function(){
        l_nameFilterField.value = "";
        l_memberOrgFilterField.value = "";
        l_specialAccessOrgFilterField.value = "";
    }
    self.getFilterObject = function(){
        
        self.currentFilterObject = {
            "memberUserId" : l_nameFilterField.value,
            "membershipOrg" : l_memberOrgFilterField.value,
            "specialAccessOrg" : l_specialAccessOrgFilterField.value,
            "offset": membersListOffsetValue,
            "limit": membersListLimitValue,
        };
        return self.currentFilterObject;
    }
}

function deleteSpecialAccess() {
    $("#deleteSpecialAccessListModal").modal({
        backdrop: 'static',
        keyboard: false
    });
   
    $('#deleteSpecialAccessListYes').off("click");
    $('#deleteSpecialAccessListYes').on('click', function (_event) {
            selectedSpecialAccessSet.forEach(removeSpecialAccess);
    });
}

function removeSpecialAccess(itemId) {
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
        method: "RemoveMemberSpecialAccess",
        parameters: { 
                   "orgMemberItemId" : itemId
                   },
        success: function (responseSuccess) {
            successToast(3000, getTranslationMessage("Additional access removed."));
            listSpecialAccessMembers();
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_listErrorInfoArea", true, getTranslationMessage("Unable to delete the additional access. Contact your administrator."), 10000);
            return false;
        }
    });
}
//filter related methods
function ApplyFilter(event, iSrcElement) {
    listSpecialAccessMembers();
    if (document.getElementById("filter_memberName").value != "" || document.getElementById("filter_SpecialAccessOrg").value != "" || document.getElementById("filter_memberOrg").value != "") {
        $("#id_clearFilterActionBar").css('display', 'inline');
    } else {
        $("#id_clearFilterActionBar").css('display', 'none');
    }
    hideFilter();
}
function ClearFilter(event, iSrcElement) {
    l_specialAccessFilter_model.ClearFilter();
    listSpecialAccessMembers();
    $("#id_clearFilterActionBar").css('display', 'none');
    hideFilter();
}
function hideFilter() {
    $("#id_specialAccessFilter").hide();
    document.getElementById("id_specialAccessFilter").setAttribute("apps-toggle", 'collapsed');
    $("#id_SpecialAccessData").removeClass("col-md-9");
    $("#id_SpecialAccessData").addClass("col-md-12");
}
//pagination related methods
function updateLimitValue(iElement) {
    l_specialAccess_model.currentPage('1');
    membersListOffsetValue = 0;
    membersListLimitValue = $(iElement).val();
    listSpecialAccessMembers();
}
function goToLastPage() {
    membersListOffsetValue = (Math.ceil(l_specialAccess_model.numOfMembers() / membersListLimitValue) - 1) * membersListLimitValue;
    l_specialAccess_model.currentPage(Math.ceil(l_specialAccess_model.numOfMembers() / membersListLimitValue));
    $('#li_MembersListRightNavigation').css('display', 'none');
    $('#li_MembersListLeftNavigation').css('display', 'inline');
    listSpecialAccessMembers();
}
function goToFirstPage() {
    membersListOffsetValue = 0;
    l_specialAccess_model.currentPage('1');
    $('#li_MembersListRightNavigation').css('display', 'inline');
    $('#li_MembersListLeftNavigation').css('display', 'none');
    listSpecialAccessMembers();
}
function goToPreviousPage() {
    if (l_specialAccess_model.currentPage() > 1) {
        membersListOffsetValue = parseInt(membersListOffsetValue) - parseInt(membersListLimitValue);
        l_specialAccess_model.currentPage(parseInt(l_specialAccess_model.currentPage()) - 1);
    }
    if (l_specialAccess_model.currentPage() < Math.ceil(l_specialAccess_model.numOfMembers() / membersListLimitValue)) {
        document.getElementById("li_MembersListRightNavigation").style.removeProperty("display");
    }
    if (l_specialAccess_model.currentPage() == 1) {
        document.getElementById("li_MembersListLeftNavigation").style.display = "none";
    }
    if (l_specialAccess_model.currentPage() < 1){
        return;
    }
    listSpecialAccessMembers();
}
function goToNextPage() {
    if (l_specialAccess_model.currentPage() < Math.ceil(l_specialAccess_model.numOfMembers() / membersListLimitValue)) {
        membersListOffsetValue = parseInt(membersListOffsetValue) + parseInt(membersListLimitValue);
        l_specialAccess_model.currentPage(isNaN(parseInt(l_specialAccess_model.currentPage())) ? 0 : parseInt(l_specialAccess_model.currentPage()));
        l_specialAccess_model.currentPage(parseInt(l_specialAccess_model.currentPage()) + 1);
    }
    if (l_specialAccess_model.currentPage() == Math.ceil(l_specialAccess_model.numOfMembers() / membersListLimitValue)) {
        document.getElementById("li_MembersListRightNavigation").style.display = "none";
    }   
    if (l_specialAccess_model.currentPage() > 1) {
        document.getElementById("li_MembersListLeftNavigation").style.removeProperty("display");
    }
    listSpecialAccessMembers();
}

function hideOrShowFilterContainerBody(iElement, iShow) {
    if (iShow) {
        iElement.setAttribute("apps-toggle", 'expanded');
        iElement.lastElementChild.src = "../../../../../com/opentext/apps/utils/img/caret_up.svg";
    }
    else {
        iElement.setAttribute("apps-toggle", 'collapsed');
        iElement.lastElementChild.src = "../../../../../com/opentext/apps/utils/img/caret_down.svg";
    }
}

$(document).ready(function () {
    
    var i_locale = getlocale();
    var rtl_css = '../../../../../com/opentext/apps/utils/css/rtlappscommon.css';
    translateLabels("com/opentext/apps/commoncomponents/BasicComponents/BasicComponents", i_locale);
    loadRTLIfRequired(i_locale,rtl_css);

    if (window.parent.parent) {
        specialAccessIframe = $('[src*="specialaccess.htm"]', window.parent.parent.document);
        if (specialAccessIframe) {
            specialAccessIframe.css('border', 'none');
        }
    }
    
    var cInstanceId = getUrlParameterValue("instanceId", null, true);
    l_specialAccess_model = new SpecialMembersModel(cInstanceId);
    ko.applyBindings(l_specialAccess_model, document.getElementById("id_SpecialAccessData"));
    //apply binding for filter model
    l_specialAccessFilter_model = new SpecialAccessFilterModel();
    ko.applyBindings(l_specialAccessFilter_model, document.getElementById("filter_panel_body"));
    
    
    createToastDiv();
    hideFilter();
    listSpecialAccessMembers();
    
    
    $("#id_filterSpecialAccessButton").click(function (iEventObject) {
        if ($("#id_specialAccessFilter").attr('apps-toggle') == "expanded") {
            $("#id_specialAccessFilter").toggle();
            document.getElementById("id_specialAccessFilter").setAttribute("apps-toggle", 'collapsed');
            $("#id_SpecialAccessData").removeClass("col-md-9");
            $("#id_SpecialAccessData").addClass("col-md-12");
        }
        else if ($("#id_specialAccessFilter").attr('apps-toggle') == "collapsed") {
            $("#id_specialAccessFilter").toggle();
            document.getElementById("id_specialAccessFilter").setAttribute("apps-toggle", 'expanded');
            $("#id_SpecialAccessData").removeClass("col-md-12");
            $("#id_SpecialAccessData").addClass("col-md-9");
        }
    });

    //close and open caret icons in filter pane
    $(".cc-filter-header").click(function (iEventObject) {
        var l_headerSpan = $(this);
        l_headerSpan.next().slideToggle();
        if (l_headerSpan.attr('apps-toggle') == "expanded") {
            hideOrShowFilterContainerBody(l_headerSpan[0], false);
        }
        else if (l_headerSpan.attr('apps-toggle') == "collapsed") {
            hideOrShowFilterContainerBody(l_headerSpan[0], true);
        }
    });
  
});