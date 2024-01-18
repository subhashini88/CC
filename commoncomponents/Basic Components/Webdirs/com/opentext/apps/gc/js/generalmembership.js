$.cordys.json.defaults.removeNamespacePrefix = true;
//global variables
var l_generalAccessFilter_model;
var l_generalAccess_model;
var l_organizationsForSelection_model;
var l_userForSelection_model;
var l_memberDetails_model;
//mapping membership-id : gcorganization-id
var selectedGeneralMembersMap = {};
//default offset and limit
var membersListOffsetValue = 0;
var membersListLimitValue = 25;

//Main Model for General Members
function GeneralMembersModel(itemId){
    var self = this;
    self.itemId = ko.observable(itemId);
    self.MembersList = ko.observableArray([]);
    self.isFilterApplied = ko.observable(false);
    
    //variables for pagination
    self.numOfMembers = ko.observable('');
    self.numOfMembersInCurrentPage = ko.observable('');
    self.numOfPages = ko.observable('');
    self.currentPage = ko.observable(1);
    
    self.openSelectedItem = function (iItem) {
        if (iItem["OrganizationMembers-id"]) {
            var l_itemId = iItem["OrganizationMembers-id"].ItemId1;
            openMemberCreateOrEditForm(l_itemId);
        }
    }

    self.onSelectAllMemberCheckboxValueChanged  = function (iItem, event) {
        
        var l_currentClassName = event.currentTarget.className;
        if (l_currentClassName == "cc-select-column cc-checkbox-select-all-off" || l_currentClassName == "cc-select-column cc-checkbox-select-all-partial") {
            $(event.currentTarget).removeClass("cc-checkbox-select-all-off");
            $(event.currentTarget).removeClass("cc-checkbox-select-all-partial");
            $(event.currentTarget).addClass("cc-checkbox-select-all-on");
            $("#id_GeneralMembersTable").find("tbody .cc-select-column").removeClass("cc-checkbox-off");
            $("#id_GeneralMembersTable").find("tbody .cc-select-column").addClass("cc-checkbox-on");
            $("#id_GeneralMembersTable").find("tbody tr").css("background-color", "#CBD3D9");
            $("#id_editGeneralMembersActionBar").css("display", "none");
            $("#id_deleteGeneralMembersActionBar").css("display", "inline");

            l_generalAccess_model.MembersList().forEach(function (iToken) {
                selectedGeneralMembersMap[iToken["OrganizationMembers-id"].ItemId1] = iToken.Owner["GCOrganization-id"].ItemId;
            });
        }
        else if (l_currentClassName == "cc-select-column cc-checkbox-select-all-on") {
            $(event.currentTarget).removeClass("cc-checkbox-select-all-on");
            $(event.currentTarget).addClass("cc-checkbox-select-all-off");
            $("#id_GeneralMembersTable").find('tbody .cc-select-column').removeClass("cc-checkbox-on");
            $("#id_GeneralMembersTable").find('tbody .cc-select-column').addClass("cc-checkbox-off");
            $("#id_GeneralMembersTable").find('tbody tr').css("background-color", "transparent")
            $("#id_editGeneralMembersActionBar").css("display", "none");
            $("#id_deleteGeneralMembersActionBar").css("display", "none");
            
            selectedGeneralMembersMap ={};

        }
        event.stopPropagation();
    };

    self.onMemberCheckboxValueChanged = function (iItem, event) {
        var l_currentClassName = event.currentTarget.className;
        if (l_currentClassName == "cc-select-column cc-checkbox-off") {
            $(event.currentTarget).removeClass("cc-checkbox-off")
            $(event.currentTarget).addClass("cc-checkbox-on")
            $("#id_editGeneralMembersActionBar").css("display", "inline");
            $("#id_deleteGeneralMembersActionBar").css("display", "inline");

            selectedGeneralMembersMap[iItem["OrganizationMembers-id"].ItemId1] = iItem.Owner["GCOrganization-id"].ItemId;

            $(event.currentTarget.parentElement.parentElement).css("background-color", "#CBD3D9")
        }
        else if (l_currentClassName == "cc-select-column cc-checkbox-on") {
            $(event.currentTarget).removeClass("cc-checkbox-on")
            $(event.currentTarget).addClass("cc-checkbox-off")
            $("#id_editGeneralMembersActionBar").css("display", "none");
            $("#id_deleteGeneralMembersActionBar").css("display", "none");
            
            delete selectedGeneralMembersMap[iItem["OrganizationMembers-id"].ItemId1];
 
            $(event.currentTarget.parentElement.parentElement).css("background-color", "transparent")
        }
        event.stopPropagation();
        
        if (Object.keys(selectedGeneralMembersMap).length <= 0) {
            $("#id_selectAllMembers").removeClass("cc-checkbox-select-all-partial");
            $("#id_selectAllMembers").removeClass("cc-checkbox-select-all-on");
            $("#id_selectAllMembers").addClass("cc-checkbox-select-all-off");
            $("#id_editGeneralMembersActionBar").css("display", "none");
            $("#id_deleteGeneralMembersActionBar").css("display", "none");
        } else if (Object.keys(selectedGeneralMembersMap).length == 1) {
            if (1 == l_generalAccess_model.numOfMembersInCurrentPage()) {
                $("#id_selectAllMembers").removeClass("cc-checkbox-select-all-off");
                $("#id_selectAllMembers").removeClass("cc-checkbox-select-all-partial");
                $("#id_selectAllMembers").addClass("cc-checkbox-select-all-on");
                $("#id_editGeneralMembersActionBar").css("display", "inline");
                $("#id_deleteGeneralMembersActionBar").css("display", "inline");
            } else {
                $("#id_selectAllMembers").removeClass("cc-checkbox-select-all-off");
                $("#id_selectAllMembers").removeClass("cc-checkbox-select-all-on");
                $("#id_selectAllMembers").addClass("cc-checkbox-select-all-partial");
                $("#id_editGeneralMembersActionBar").css("display", "inline");
                $("#id_deleteGeneralMembersActionBar").css("display", "inline");
            }
        } else if (Object.keys(selectedGeneralMembersMap).length > 1 && Object.keys(selectedGeneralMembersMap).length < l_generalAccess_model.numOfMembersInCurrentPage()) {
            $("#id_selectAllMembers").removeClass("cc-checkbox-select-all-off");
            $("#id_selectAllMembers").removeClass("cc-checkbox-select-all-on");
            $("#id_selectAllMembers").addClass("cc-checkbox-select-all-partial");
            $("#id_editGeneralMembersActionBar").css("display", "none");
            $("#id_deleteGeneralMembersActionBar").css("display", "inline");
        } else if (Object.keys(selectedGeneralMembersMap).length == l_generalAccess_model.numOfMembersInCurrentPage()) {
            $("#id_selectAllMembers").removeClass("cc-checkbox-select-all-off");
            $("#id_selectAllMembers").removeClass("cc-checkbox-select-all-partial");
            $("#id_selectAllMembers").addClass("cc-checkbox-select-all-on");
        }
        
    };
   
};

function addDataToMembersListView(iElementList, iModel) {
    
    iModel.MembersList.removeAll();
    if (iElementList) {
        if (iElementList.length) {
            iModel.numOfMembersInCurrentPage(iElementList.length);
            iElementList.forEach(function (iElement) {
                if(!iElement.RelatedContactType){
                    iElement.RelatedContactType={};
                }
                iModel.MembersList.push(iElement);
            });
        }
        else {
            if(!iElementList.RelatedContactType){
                iElementList.RelatedContactType={};
            }
            iModel.numOfMembersInCurrentPage("1");
            iModel.MembersList.push(iElementList);
        }
    }
    
}
function updatePaginationParams() {
    if (l_generalAccess_model.currentPage() == 1) {
        document.getElementById("li_MembersListLeftNavigation").style.display = "none";
        document.getElementById("li_MembersListRightNavigation").style.display = "inline";
    }
    if (parseInt(l_generalAccess_model.numOfMembers()) <= parseInt(membersListLimitValue)) {
        l_generalAccess_model.currentPage('1');
        $('#li_MembersListLeftNavigation,#li_MembersListRightNavigation').css('display', 'none');
    }
}
//list all members with special access listGeneralAccessMembers_
function listGeneralAccessMembers() {
    $("#id_editGeneralMembersActionBar").css("display", "none");
    $("#id_deleteGeneralMembersActionBar").css("display", "none");
    $("#id_selectAllMembers").removeClass("cc-checkbox-select-all-partial");
    $("#id_selectAllMembers").removeClass("cc-checkbox-select-all-on");
    $("#id_selectAllMembers").addClass("cc-checkbox-select-all-off");
   
    selectedGeneralMembersMap = {};
    
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
        method: "GetOrgMemberswithFilters",
        parameters: l_generalAccessFilter_model.getFilterObject(),
        success: function (data) {
            addDataToMembersListView(data.OrgMembers.FindZ_INT_OrgUsersListResponse.OrganizationMembers, l_generalAccess_model);
            
            if (data.OrgMembers.FindZ_INT_OrgUsersListResponse["@total"]) {
                l_generalAccess_model.numOfMembers(data.OrgMembers.FindZ_INT_OrgUsersListResponse["@total"]);
            }
            else {
                l_generalAccess_model.numOfMembers(0);
            }
            if (l_generalAccess_model.numOfMembers() != 0) {
                l_generalAccess_model.numOfPages(Math.ceil(l_generalAccess_model.numOfMembers() / membersListLimitValue));
            } else {
                l_generalAccess_model.numOfPages(1);
            }
            
            updatePaginationParams();
   
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_listErrorInfoArea", true, getTranslationMessage("Unable to retrieve the members. Contact your administrator."), 10000);
            return false;
        }
    });
}
//filter model_
var GeneralMembersFilterModel = function(){
    var self = this;
    var l_nameFilterField = document.getElementById("filter_memberName");
    var l_memberOrgFilterField = document.getElementById("filter_memberOrg");

    self.ClearFilter = function(){
        l_nameFilterField.value = "";
        l_memberOrgFilterField.value = "";
    }
    self.getFilterObject = function(){
        
        self.currentFilterObject = {
            "memUserID" : l_nameFilterField.value,
            "orgName" : l_memberOrgFilterField.value,
            "offset": membersListOffsetValue,
            "accessType":"LEAD,GENERAL",
            "limit": membersListLimitValue,
        };
        return self.currentFilterObject;
    }
}

var MemberDetailsModel = function(){
    var self = this;
    self.clicked=false;
    self.memberPersonIdItemID = ko.observable('');
    self.memberUserName = ko.observable('');

    self.memberEmailId = ko.observable('');
    self.memberOrganizationName = ko.observable('');
    self.memberOrganizationItemID = ko.observable('');
    self.jobTitle = ko.observable('');
    self.startDate = ko.observable('');
    self.startDatetoLocale = ko.observable('');
    self.endDate = ko.observable('');
    self.endDatetoLocale = ko.observable('');
    self.orgMembershipId = ko.observable('');


    self.departmentRootList = ko.observableArray([]);
    self.editMode = ko.observable(false);
    self.orgDepth = ko.observable(0);
    self.suborgList = ko.observableArray([]);

    //error messages for validations
    self.formStartDateErrorMsg = ko.observable("");
    self.formEndDateErrorMsg = ko.observable("");
    self.formUserNameEmpty = ko.observable(false);
    self.formOrganizationEmpty = ko.observable(false);
    self.isPrimaryContact = ko.observable(false);

    self.subOrgsMapped = ko.observableArray([]);
    self.subOrgsRemovedSpecialAccess = ko.observableArray([]);
    self.contacttypeList = ko.observableArray([]);
    self.formContactType =  ko.observable("");
    self.formContactTypeItemId =  ko.observable("");


    self._clearErrors = function(){        
        self.formStartDateErrorMsg("");
        self.formUserNameEmpty(false);
        self.formOrganizationEmpty(false);
        $("#input_userName").removeClass("cc-error");
        $("#input_memberOrganization").removeClass("cc-error");
        $("#input_startDate").removeClass("cc-error");
    }

    self.destroy = function () {
        $("#input_endDate").datepicker("destroy");
        $("#input_startDate").datepicker("destroy");
    }
    self.bindJqueryFunc = function () {
        var format = "yy-mm-dd";
        $("#input_endDate").datepicker({
            dateFormat: format,
            orientation: "top",
            onSelect: function (dateText, inst) {
                self.endDate(dateText);
                self.endDatetoLocale(formateDatetoLocale(dateText));
            }
        });
        $("#input_startDate").datepicker({
            dateFormat: format,
            orientation: "top",
            onSelect: function (dateText, inst) {
                self.startDate(dateText);
                self.startDatetoLocale(formateDatetoLocale(dateText));
            }
        });
    };

    //Fetch all root organizations for Additional access
    self.fetchRootOrgList = function () { //_first
        $.cordys.ajax({
            namespace: "http://schemas/OpenTextBasicComponents/GCOrganization/operations",
            method: "GetRootOrganizations",
            parameters: {},
            success: function (data) {
                addDataToAdditionalAccessOrgs(data.GCOrganization, l_memberDetails_model);
            },
            error: function (data) {
                showOrHideErrorInfo("div_modalCreateMembersErrorInfoArea", true, getTranslationMessage("Unable to retrieve the organization list. Contact your administrator."), 10000);
                return false;
            }
        
        });
		translatePage();

    }
    //Fetch all sub organizations for Additional access
    self.fetchSubOrgList = function (data,event) {
        $.cordys.ajax({
            namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
            method: "GetOrgsWithFilters",
            parameters: {"parentOrgID": data["GCOrganization-id"].Id},
            success: function (dataresponse) {
                data.suborgList.removeAll();
                var orgsResp = dataresponse.OrgsResponse.FindZ_INT_OrgListResponse.GCOrganization;
                if (dataresponse.OrgsResponse && orgsResp) {
                    if (orgsResp.length) {
                        orgsResp.forEach(function (iElement) {
                        _populateOrgDataInList(iElement, data);
                        data.suborgList.push(iElement);
                        //check and disable selected organization
                        if(iElement["GCOrganization-id"].ItemId === l_memberDetails_model.memberOrganizationItemID()){
                            iElement.checked(true);
                            iElement.disableSelect(true);
                        }

                        });
                        data.expand(true);
                    }
                    else {
                        _populateOrgDataInList(orgsResp, data);
                        data.suborgList.push(orgsResp); 
                        data.expand(true);
                        //check and disable selected organization
                        if(orgsResp["GCOrganization-id"].ItemId === l_memberDetails_model.memberOrganizationItemID()){
                            orgsResp.checked(true);
                            orgsResp.disableSelect(true);
                        }
                    }
                }
                _selectOrgFromList(data.suborgList());
            },
            error: function (data) {
                showOrHideErrorInfo("div_modalCreateMembersErrorInfoArea", true, getTranslationMessage("Unable to retrieve the organization list. Contact your administrator."), 10000);
                return false;
            }
        
        });

    }

    self.expandSubOrg= function(data, event) {
        if (data.expand) {
            if (!data.expand()) {
                self.fetchSubOrgList(data, event);
            } else {
                data.expand(!data.expand());
            }
        }
        event.stopPropagation();
    };

    self.onOrgCheckboxValueChanged = function (iItem, event) {
        if (self.memberOrganizationItemID() !== iItem["GCOrganization-id"].ItemId) {
            if (iItem.checked()) {
                _removeSpecialAccessOrg(iItem);
                iItem.checked(false);
            } else {
                self.addSpecialAccessOrg(iItem);
                iItem.checked(true);
            }
        };

        event.stopPropagation();
    }
    
    
    function _removeSpecialAccessOrg(orgData) {
        var len = self.subOrgsMapped().length;
        for (var i = 0; i < len; i++) {
            var mappedOrg = self.subOrgsMapped()[i];
            if (orgData["GCOrganization-id"].ItemId === mappedOrg["GCOrganizationid"].ItemId) {
                _unCheckAndRemoveData(mappedOrg, orgData);
                break;
            }
        }
    }

    function _unCheckAndRemoveData(mappedOrg, orgData) {
        if (orgData["GCOrganization-id"].ItemId === mappedOrg["GCOrganizationid"].ItemId ){
            self.subOrgsMapped.remove(mappedOrg);
            _addTosubOrgsRemovedSpecialAccess(mappedOrg);
        }
    }

    function _addTosubOrgsRemovedSpecialAccess(mappedOrg) {
        if (mappedOrg.membershipId) {
            self.subOrgsRemovedSpecialAccess.push(mappedOrg);
        }
    }
    self.populateReqUpdateMembersObj = function(reqData) {
        reqData["MembershipUpdate"]["general"].membershipId = l_memberDetails_model.orgMembershipId();
        var len = l_memberDetails_model.subOrgsRemovedSpecialAccess().length;
        if (len > 0) {
            reqData["MembershipUpdate"]["special"]["RemovedMembership"] = { member: [] };
            for (var i = 0; i < len; i++) {
                _populateReqRemovedMembers(reqData, l_memberDetails_model.subOrgsRemovedSpecialAccess()[i]);
            }
        }
        _populateExistingSpecialMembers(reqData);
        return reqData;
    }

    function _populateExistingSpecialMembers(reqData){
        var len = self.subOrgsMapped().length;
        if (len > 0) {
            reqData["MembershipUpdate"]["special"]["ExistingMemberShip"] = { member: [] };
            for (var i = 0; i < len; i++) {
                var assignmentId = "";
                var existingMember = self.subOrgsMapped()[i];
                if (existingMember.assignmentId) {
                    assignmentId = existingMember.assignmentId;
                    reqData["MembershipUpdate"]["special"]["ExistingMemberShip"].member.push({
                        membershipId: existingMember.membershipId,
                        gcOrgId: existingMember.orgTreeObj["GCOrganization-id"].ItemId,
                        assignmentId: assignmentId
                    });
                }
            }
        }
        return reqData;
    }

    function _populateReqRemovedMembers(requestData, removedMember) {
        var assignmentId = "";
        if (removedMember.assignmentId) {
            assignmentId = removedMember.assignmentId;
        }
        requestData["MembershipUpdate"]["special"]["RemovedMembership"].member.push({
            membershipId: removedMember.membershipId,
            gcOrgId: removedMember.GCOrganizationid.ItemId,
            assignmentId: assignmentId
        });
    }

    self.openContactModal = function () {
        $('#div_selectContactTypeListModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        self.getContactTypeList({ "offset": 0, "limit": 200 });
    };

    self.closeContactTypeModal = function () {
        $('#div_selectContactTypeListModal').modal('hide');
        self.contacttypeList.removeAll();
    };  
    
    self.filterContactTypes = function () {
        var request = { "contacttype": document.getElementById("filterContactTypeInput").value, "offset": 0, "limit": 200 };
        self.getContactTypeList(request);
    };

    self.getContactTypeList = function (filterObj) {
        self.contacttypeList.removeAll();
        getContactTypeListService(filterObj, function (response, status) {
            if (status !== "ERROR") {
                console.log("getContactTypeList");
                console.log(response);
                var builtContactTypeObj=(contactTypeObj)=>{
                    return {Id:contactTypeObj["GCContactType-id"]["Id"],ItemId:contactTypeObj["GCContactType-id"]["ItemId"],
                    Description:contactTypeObj.Description,Name:contactTypeObj.Name,selected:ko.observable(false)};
                }
                var contactTypeResp = response.ContacttypeResponse.FindZ_INT_ContactTypesResponse.GCContactType;
                if (contactTypeResp && Array.isArray(contactTypeResp)) {
                    var len = contactTypeResp.length;
                    for (var i = 0; i < len; i++) {
                        var contactType = contactTypeResp[i];
                        if (contactType.Name) {
                            self.contacttypeList.push(ko.mapping.fromJS(builtContactTypeObj(contactType)));
                        };
                   }
               } else if (contactTypeResp) {
                    if (contactTypeResp.Name) {
                        self.contacttypeList.push(ko.mapping.fromJS(builtContactTypeObj(contactTypeResp)));
                    };
                }
            } else {
                showOrHideErrorInfo("div_modalPersonsErrorInfoArea", true, "Unable to retrieve the contact type list. Contact your administrator.", 10000);
            };
        });
    };

    self.clickRadioContactType = function (data, event) {
            var len = self.contacttypeList().length;
            for (var i = 0; i < len; i++) {
                var contactType = self.contacttypeList()[i];
                if ((contactType.Id() !== data.Id()) && contactType.selected()) {
                    contactType.selected(false);
                } else if (contactType.Id() === data.Id()) {
                    contactType.selected(true);
                }
            };
            event.stopPropagation();
    }
        
    self.selectContactType = function () {
            var selectedContactType = null;
            for (var i = 0; i < self.contacttypeList().length; i++) {
                if (self.contacttypeList()[i].selected()) {
                    selectedContactType = self.contacttypeList()[i];
                }
            };
            if (selectedContactType) {
                self.formContactTypeItemId(selectedContactType.ItemId());
                self.formContactType(selectedContactType.Name());
            };
            self.closeContactTypeModal();
    };
    

            
               

    self.addSpecialAccessOrg = function(iItem) {
        //var orgMember = { Name: ko.observable(getTextValue(iItem.Name)), GCOrganizationid:{ ItemId : iItem["GCOrganization-id"].ItemId } };
        var orgMember = {GCOrganizationid:{ ItemId : iItem["GCOrganization-id"].ItemId } };
        orgMember.orgTreeObj = iItem;
        var parentOrg = iItem.ParentOrganization;
        if(parentOrg && parentOrg["GCOrganization-id"].ItemId){
            orgMember.Chicklet = ko.observable(parentOrg.Name + " > " + iItem.Name);
        }
        else{
            orgMember.Chicklet = ko.observable(iItem.Name);
        }
        self.subOrgsMapped.push(orgMember);
    }


    //on removing chicklet
    self.removeOrgFromSelectedList = function (data, event) {
        self.subOrgsMapped.remove(data);
        _addTosubOrgsRemovedSpecialAccess(data);
        if (data.orgTreeObj && data.orgTreeObj.checked) {
            data.orgTreeObj.checked(false);
        }
        event.stopPropagation();
    }
    
}

//Model_
var OrganizationsListModel = function () {
    var self = this;
    self.OrganizationsList = ko.observableArray([]);
    self.selectedOrganizationItemID = ko.observable('');
    self.selectedOrganizationName = ko.observable('');

    self.selectOrganizationRadioButton = function (iItem, event) {
            $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
            $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
            
            if (iItem["GCOrganization-id"]) {
                var l_itemId = iItem["GCOrganization-id"].ItemId;
                self.selectedOrganizationItemID(l_itemId);
                self.selectedOrganizationName(iItem.Name);
            }
    }
    self.onOrganizationRowRadioButtonValueChanged = function (iItem, event) {
            $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
            $(event.currentTarget).addClass("cc-radio-on");
            
            if (iItem["GCOrganization-id"]) {
                var l_itemId = iItem["GCOrganization-id"].ItemId;
                self.selectedOrganizationItemID(l_itemId);
                self.selectedOrganizationName(iItem.Name);
            }
            event.stopPropagation();
        
    }
}

//Model_
var UsersListModel = function () {
    var self = this;
    self.UsersList = ko.observableArray([]);
    self.selectedUserPersonIdItemID = ko.observable('');
    self.selectedUserName = ko.observable('');
    self.userEmailId = ko.observable('');

    self.selectUserRadioButton = function (iItem, event) {
            $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
            $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");

            if (iItem["Person-id"]) {
                var l_itemId = iItem["Person-id"].ItemId;
                self.selectedUserPersonIdItemID(l_itemId);
                self.selectedUserName(iItem.User_ID);
                self.userEmailId(iItem.Email);

                
            }
    }
    self.onUserRowRadioButtonValueChanged = function (iItem, event) {
            $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
            $(event.currentTarget).addClass("cc-radio-on");

            if (iItem["Person-id"]) {
                var l_itemId = iItem["Person-id"].ItemId;
                self.selectedUserPersonIdItemID(l_itemId);
                self.selectedUserName(iItem.User_ID);
                self.userEmailId(iItem.Email);

            }
            event.stopPropagation();
        
    }
}

function openOrganizationSelectionModal() {
    $("#div_selectOrganizationModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    clearOrganizationSelectionForm();
    ListOrganizations();
    $('button#btn_selectOrganizationForMemberYes').off("click");
    $('button#btn_selectOrganizationForMemberYes').on('click', function (_event) {
        l_memberDetails_model.memberOrganizationName(l_organizationsForSelection_model.selectedOrganizationName());
        l_memberDetails_model.memberOrganizationItemID(l_organizationsForSelection_model.selectedOrganizationItemID());
        //reload additional access
        if(l_memberDetails_model.memberOrganizationItemID){
            l_memberDetails_model.fetchRootOrgList();
            l_memberDetails_model.subOrgsMapped.removeAll();
        }

    });
}

function clearOrganizationSelectionForm(){
    
    l_organizationsForSelection_model.selectedOrganizationName('');

}
function clearUserSelectionForm(){
    
    l_userForSelection_model.selectedUserName('');

}

function openUserSelectionModal(editMode) {
    if(!editMode){
        $("#div_selectUserModal").modal({
            backdrop: 'static',
            keyboard: false
        });
        clearUserSelectionForm();
        ListUsers();
        $('button#btn_selectUserListYes').off("click");
        $('button#btn_selectUserListYes').on('click', function (_event) {
            //YTBI
            l_memberDetails_model.memberUserName(l_userForSelection_model.selectedUserName());
            l_memberDetails_model.memberPersonIdItemID(l_userForSelection_model.selectedUserPersonIdItemID());
            l_memberDetails_model.memberEmailId(l_userForSelection_model.userEmailId());
            //$("#input_ruleActivityList").removeClass("cc-error");
        });
    }
}

function ListUsers() {
    
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
        method: "GetIdentityPersoswithFilters",
        parameters: {
            "personName": $("#input_userSearchFilter").val(),
            "offset": "0",
            "limit": "200"
        },
        success: function (data) {
            addDataToUserLookup(data.Persons.FindPersonListInternalResponse.Person, l_userForSelection_model);
            
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("Unable to retrieve the user list. Contact your administrator."), 10000);
            return false;
        }
    });
}

//general
function ListOrganizations() {
    
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
        method: "GetOrgsWithFilters",
        parameters: {
            "parentOrgID": "",
            "orgName": $("#input_organizationsSearchFilter").val(),
            "orgDescription": "",
            "offset": "0",
            "limit": "200"
        },
        success: function (data) {
            addDataToOrganizationsLookup(data.OrgsResponse.FindZ_INT_OrgListResponse.GCOrganization, l_organizationsForSelection_model);

        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("Unable to retrieve the organization list. Contact your administrator."), 10000);
            return false;
        }
    });
}

function addDataToOrganizationsLookup(iElementList, iModel) {
    iModel.OrganizationsList.removeAll();
    if (iElementList) {
        if (iElementList.length) {
            iElementList.forEach(function (iElement) {
                iModel.OrganizationsList.push(iElement);
            });
        }
        else {
            iModel.OrganizationsList.push(iElementList);
        }
    }
}

function addDataToUserLookup(iElementList, iModel) {
    iModel.UsersList.removeAll();
    if (iElementList) {
        if (iElementList.length) {
            iElementList.forEach(function (iElement) {
                iModel.UsersList.push(iElement);
            });
        }
        else {
            iModel.UsersList.push(iElementList);
        }
    }
}

function addDataToAdditionalAccessOrgs(iElementList, iModel) {
    iModel.departmentRootList.removeAll();
    if (iElementList) {
        if (iElementList.length) {
            iElementList.forEach(function (iElement) {
                _populateOrgDataInList(iElement);
                if(iElement["GCOrganization-id"].ItemId === iModel.memberOrganizationItemID()){
                    iElement.checked(true);
                    iElement.disableSelect(true);
                }
                iModel.departmentRootList.push(iElement);
            });
        }
        else {
             _populateOrgDataInList(iElementList);
            if(iElementList["GCOrganization-id"].ItemId === iModel.memberOrganizationItemID()){
                    iElementList.checked(true);
                    iElementList.disableSelect(true);
                }
            iModel.departmentRootList.push(iElementList);
        }
        _selectOrgFromList(iModel.departmentRootList());
    }
}

function _selectOrgFromList(orgList) {
    if (orgList && orgList.length > 0) {
        var orgSpecialMappedLen = l_memberDetails_model.subOrgsMapped().length;
        var orgListLen = orgList.length;
        if (l_memberDetails_model.subOrgsMapped() && l_memberDetails_model.subOrgsMapped().length > 0) {
            for (var indexM = 0; indexM < orgSpecialMappedLen; indexM++) {
                var org = l_memberDetails_model.subOrgsMapped()[indexM];
                _checkSpecialMembersOrg(orgList, orgListLen, org);
            }
        } else {
            _checkSpecialMembersOrg(orgList, orgListLen);
        }
    }
}

function _checkSpecialMembersOrg(orgList, orgListLen, org) {
    for (var indexO = 0; indexO < orgListLen; indexO++) {
        var orgTreeObj = orgList[indexO];
        if (org && orgTreeObj["GCOrganization-id"].ItemId === org.GCOrganizationid.ItemId) {
            if (orgTreeObj.checked) {
                orgTreeObj.checked(true);
            }
            org.orgTreeObj = orgTreeObj;
        }
        if (l_memberDetails_model.memberOrganizationItemID() === orgTreeObj["GCOrganization-id"].ItemId) {
            orgTreeObj.checked(true);
            orgTreeObj.disableSelect(true);
        }
    }
}

function _populateOrgDataInList(responseData, parentOrgData) {

    populateOrgData(responseData, parentOrgData);
    responseData["depth"] = ko.observable(0);
    if (parentOrgData && parentOrgData.depth) {
        responseData["depth"] = ko.observable((parentOrgData.depth() + 1));
    }
    responseData["expand"] =  ko.observable(false);
    responseData["suborgList"] =  ko.observableArray([]);
    responseData["checked"] = ko.observable(false);
    responseData["disableSelect"] = ko.observable(false);

    // responseData["expandSubOrg"] = expandSubOrg;
    // subOrgObs.onDepartmentRowCheckboxValueChanged = self.onDepartmentRowCheckboxValueChanged;
    // orgList.push(subOrgObs);
    // return subOrgObs;
}

function populateOrgData(responseData, parentOrgData){

    var data = {};
    data.orgDetails = {};
    data.depth = 0;
    if (parentOrgData && parentOrgData.depth) {
        data.depth = (parentOrgData.depth() + 1);
    }
    data.orgDetails["BreadCrumb"] = responseData["Name"];

    return data;
}


function OpenMembersUpdateForm(){
    if (Object.keys(selectedGeneralMembersMap).length) {
        openMemberCreateOrEditForm(Object.keys(selectedGeneralMembersMap)[0]);
    }
}

function OpenMembersCreateForm() {
    openMemberCreateOrEditForm();
}


function openMemberCreateOrEditForm(i_memberItemID){
    l_memberDetails_model.subOrgsRemovedSpecialAccess([]);
    l_memberDetails_model.orgMembershipId('');
    l_memberDetails_model._clearErrors();
    $('#div_createOrUpdateMembersModal').modal({
        backdrop: 'static',
        keyboard: false
    })

    setTimeout(function () {
        l_memberDetails_model.bindJqueryFunc();
    }, 0);
    
    clearMemberDetailsModelData();

    if (i_memberItemID) {
        $("#span_createOrEditModalHeading").text(getTranslationMessage("Update member"));
        $("#btn_createOrUpdateMember").html(getTranslationMessage("Update member"));
        l_memberDetails_model.editMode(true);
        loadMemberDetails(i_memberItemID);
    } else {
        l_memberDetails_model.clicked=false;
        $("#span_createOrEditModalHeading").text(getTranslationMessage("Add member"));
        $("#btn_createOrUpdateMember").html(getTranslationMessage("Add member"));
        l_memberDetails_model.editMode(false);
        loadMemberDetails("");
    }

}

function clearMemberDetailsModelData(){
    l_memberDetails_model.memberPersonIdItemID('');
    l_memberDetails_model.memberUserName('');
    l_memberDetails_model.memberEmailId('');
    l_memberDetails_model.memberOrganizationName('');
    l_memberDetails_model.memberOrganizationItemID('');
    l_memberDetails_model.jobTitle('');
    l_memberDetails_model.startDate('');
    l_memberDetails_model.endDate('');
    l_memberDetails_model.startDatetoLocale('');
    l_memberDetails_model.endDatetoLocale('');
    l_memberDetails_model.subOrgsMapped.removeAll();
    l_memberDetails_model.isPrimaryContact(false);
    l_memberDetails_model.contacttypeList.removeAll();
    l_memberDetails_model.formContactType("");
    l_memberDetails_model.formContactTypeItemId("");
}
function deleteMember() {
    $("#deleteMemberModal").modal({
        backdrop: 'static',
        keyboard: false
    });
   
    $('#deleteMembersListYes').off("click");
    $('#deleteMembersListYes').on('click', function (_event) {          
        for (iElement in selectedGeneralMembersMap) {
            removeMember(createRequestObjForDelete(iElement, selectedGeneralMembersMap[iElement]));
        }
    });
}

function createRequestObjForDelete(orgMemId, gcOrgId){
    var reqObj = {
        "GCOrganization-id": {"ItemId" : gcOrgId},
        "OrganizationMembers": {"OrganizationMembers-id" : { "ItemId1" : orgMemId}}
        
    };
    return reqObj;
}

function createRequestObjForCreateOrUpdate(iMemberDetailModel, iIsUpdate){
    
    var membersArray = [];

    var reqObj = { "MembershipUpdate": { "general": {}, "special": { "AdditionalMembership": { "member": [] } } } };
    reqObj["MembershipUpdate"]["general"].jobTitle = iMemberDetailModel.jobTitle();
    reqObj["MembershipUpdate"]["general"].startDate = iMemberDetailModel.startDate();
    reqObj["MembershipUpdate"]["general"].endDate = iMemberDetailModel.endDate();
    reqObj["MembershipUpdate"]["general"]["gcOrgId"] = iMemberDetailModel.memberOrganizationItemID();
    reqObj["MembershipUpdate"]["general"]["participatingPerson"] = iMemberDetailModel.memberPersonIdItemID();
    reqObj["MembershipUpdate"]["general"]["isPrimaryContact"]= iMemberDetailModel.isPrimaryContact() && iMemberDetailModel.isPrimaryContact() === true?"true":"false" ;
    if(iMemberDetailModel.formContactTypeItemId()){
        reqObj["MembershipUpdate"]["general"]["contactTypeItemId"]= iMemberDetailModel.formContactTypeItemId();
        }
    iMemberDetailModel.subOrgsMapped().forEach(function(ele){
        if(!ele.membershipId){
        membersArray.push({"gcOrgId" : ele.GCOrganizationid.ItemId, "participatingPerson" : iMemberDetailModel.memberPersonIdItemID()})
        }
    });

    reqObj["MembershipUpdate"]["special"]["AdditionalMembership"]["member"] = membersArray;
    
   if (iIsUpdate) {
    reqObj["MembershipUpdate"]["general"]["membershipId"] = iMemberDetailModel.orgMembershipId;
    }
    return reqObj;
}


function removeMember(data) {
    $.cordys.ajax({
        namespace: "http://schemas/OpenTextBasicComponents/GCOrganization/operations",
        method: "DeleteOrganizationMembers",
        parameters: data,
        success: function (responseSuccess) {
            successToast(3000, getTranslationMessage("Member deleted."));
            listGeneralAccessMembers();
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_listErrorInfoArea", true, getTranslationMessage("Unable to delete the member. Contact your administrator"), 10000);
            return false;
        }
    });
}

//filter related methods
function ApplyFilter(event, iSrcElement) {
    listGeneralAccessMembers();
    if (document.getElementById("filter_memberName").value != "" || document.getElementById("filter_memberOrg").value != "") {
        $("#id_clearFilterActionBar").css('display', 'inline');
    } else {
        $("#id_clearFilterActionBar").css('display', 'none');
    }
    hideFilter();
}
function ClearFilter(event, iSrcElement) {
    l_generalAccessFilter_model.ClearFilter();
    listGeneralAccessMembers();
    $("#id_clearFilterActionBar").css('display', 'none');
    hideFilter();
}
function hideFilter() {
    $("#id_generalAccessFilter").hide();
    document.getElementById("id_generalAccessFilter").setAttribute("apps-toggle", 'collapsed');
    $("#id_GeneraAccessData").removeClass("col-md-9");
    $("#id_GeneraAccessData").addClass("col-md-12");
}
//pagination related methods
function updateLimitValue(iElement) {
    l_generalAccess_model.currentPage('1');
    membersListOffsetValue = 0;
    membersListLimitValue = $(iElement).val();
    listGeneralAccessMembers();
}
function goToLastPage() {
    membersListOffsetValue = (Math.ceil(l_generalAccess_model.numOfMembers() / membersListLimitValue) - 1) * membersListLimitValue;
    l_generalAccess_model.currentPage(Math.ceil(l_generalAccess_model.numOfMembers() / membersListLimitValue));
    $('#li_MembersListRightNavigation').css('display', 'none');
    $('#li_MembersListLeftNavigation').css('display', 'inline');
    listGeneralAccessMembers();
}
function goToFirstPage() {
    membersListOffsetValue = 0;
    l_generalAccess_model.currentPage('1');
    $('#li_MembersListRightNavigation').css('display', 'inline');
    $('#li_MembersListLeftNavigation').css('display', 'none');
    listGeneralAccessMembers();
}
function goToPreviousPage() {
    if (l_generalAccess_model.currentPage() > 1) {
        membersListOffsetValue = parseInt(membersListOffsetValue) - parseInt(membersListLimitValue);
        l_generalAccess_model.currentPage(parseInt(l_generalAccess_model.currentPage()) - 1);
    }
    if (l_generalAccess_model.currentPage() < Math.ceil(l_generalAccess_model.numOfMembers() / membersListLimitValue)) {
        document.getElementById("li_MembersListRightNavigation").style.removeProperty("display");
    }
    if (l_generalAccess_model.currentPage() == 1) {
        document.getElementById("li_MembersListLeftNavigation").style.display = "none";
    }
    if (l_generalAccess_model.currentPage() < 1){
        return;
    }
    listGeneralAccessMembers();
}
function goToNextPage() {
    if (l_generalAccess_model.currentPage() < Math.ceil(l_generalAccess_model.numOfMembers() / membersListLimitValue)) {
        membersListOffsetValue = parseInt(membersListOffsetValue) + parseInt(membersListLimitValue);
        l_generalAccess_model.currentPage(isNaN(parseInt(l_generalAccess_model.currentPage())) ? 0 : parseInt(l_generalAccess_model.currentPage()));
        l_generalAccess_model.currentPage(parseInt(l_generalAccess_model.currentPage()) + 1);
    }
    if (l_generalAccess_model.currentPage() == Math.ceil(l_generalAccess_model.numOfMembers() / membersListLimitValue)) {
        document.getElementById("li_MembersListRightNavigation").style.display = "none";
    }   
    if (l_generalAccess_model.currentPage() > 1) {
        document.getElementById("li_MembersListLeftNavigation").style.removeProperty("display");
    }
    listGeneralAccessMembers();
}

function createOrUpdateMember() {
    if (l_memberDetails_model) {
        //change
        if (l_memberDetails_model.orgMembershipId()) {
            updateMember();
        } else {    
            createMember();
        }
    }
}

function createMember() {
    if (validateMemberMandatoryFields()) {
        if(!l_memberDetails_model.clicked){
            l_memberDetails_model.clicked=true;            
            var memberCreateObject = createRequestObjForCreateOrUpdate(l_memberDetails_model, false);
            if (memberCreateObject) {
                $.cordys.ajax({ 
                    namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
                    method: "UpdateGCOrganizationMembership",
                    parameters: memberCreateObject,
                    success: function (responseSuccess) {
                        if (responseSuccess) {
                            $('#div_createOrUpdateMembersModal').modal('hide');
                            successToast(3000, "Member created.");
                            listGeneralAccessMembers();
                        } else {
                            l_memberDetails_model.clicked=false;
                            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("Unable to create the member. Contact your administrator."), 10000);
                        }
                    },
                    error: function (responseFailure) {
                        l_memberDetails_model.clicked=false;
                        var errorMsg = "";
                        if(responseFailure.responseJSON.faultstring){
                            errorMsg = getTextValue(responseFailure.responseJSON.faultstring);
                        }
                        showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("Unable to create the member. ") + errorMsg, 10000);
                        return false;
                    }
                });
            }
        }
    }
}

function updateMember() {
    if (validateMemberMandatoryFields()) {
            var memberUpdateObject = l_memberDetails_model.populateReqUpdateMembersObj(createRequestObjForCreateOrUpdate(l_memberDetails_model, true));
            if (memberUpdateObject) {
                $.cordys.ajax({
                    namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
                    method : "UpdateGCOrganizationMembership",
                    parameters: memberUpdateObject,
                    success: function (responseSuccess) {
                        if (responseSuccess) {
                            $('#div_createOrUpdateMembersModal').modal('hide');
                            successToast(3000, "Member updated.");
                            listGeneralAccessMembers();
                        } else {
                            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("Unable to update the member. Contact your administrator."), 10000);
                        }
                    },
                    error: function (responseFailure) {//YTBI
                        var errorMsg = getTextValue(responseFailure.responseJSON.faultstring);
                        showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("Unable to update the member. ") + errorMsg, 10000);
                        return false;
                    }
                });
            }
    }
}

function removeErrorClass(iEvent) {
    $(iEvent).removeClass("cc-error");
}

function validateMemberMandatoryFields() {
    l_memberDetails_model._clearErrors();

    var validationFlag = true;
    if (l_memberDetails_model.memberUserName() == "" || l_memberDetails_model.memberUserName() == undefined) {
        $("#input_userName").addClass("cc-error");
        l_memberDetails_model.formUserNameEmpty(true);
        validationFlag = false;
    }
    if (l_memberDetails_model.memberOrganizationName() == "" || l_memberDetails_model.memberOrganizationName() == undefined) {
        $("#input_memberOrganization").addClass("cc-error");
        l_memberDetails_model.formOrganizationEmpty(true);
        validationFlag = false;
    }
    if (l_memberDetails_model.startDate() == "" || l_memberDetails_model.startDate() == undefined) {
        $("#input_startDate").addClass("cc-error");
        l_memberDetails_model.formStartDateErrorMsg(getTranslationMessage("Select a start date."));
        validationFlag = false;
    }
    if(l_memberDetails_model.startDate() && l_memberDetails_model.endDate() && new Date(l_memberDetails_model.endDate() ) - new Date(l_memberDetails_model.startDate()) < 0){
        $("#input_startDate").addClass("cc-error");
        l_memberDetails_model.formStartDateErrorMsg(getTranslationMessage("Start date cannot be greater than end date."));
        validationFlag = false;
    }
    return validationFlag;
}

function loadMemberDetails(membershipItemId){
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
        method: "ReadGCOrganizationMembership",
        parameters: { "Member": { "membershipId": membershipItemId } },
        success: function (data) {
            addDataToDetailsView(data, l_memberDetails_model);
            if(membershipItemId){
                l_memberDetails_model.fetchRootOrgList();
            }
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("Unable to load the member details. Contact your administrator."), 10000);
            return false;
        }
    });
}

function getContactTypeListService(requestContactTypeListObj, reponseCallBack) {
    $.cordys.ajax({
        method: "GetContacttypesWithFilters",
        namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
        parameters: requestContactTypeListObj,
        success: function (responseSuccess) {
            reponseCallBack(responseSuccess);
        },
        error: function (responseFailure) {
            reponseCallBack(responseFailure, "ERROR");
            return false;
        }
    });
};

function addDataToDetailsView(iElement, iModel){
    iModel.departmentRootList.removeAll();
    if(iElement && iModel){
        if(iElement.generalMemberDetails && iElement.generalMemberDetails.FindZ_INT_OrgUsersListResponse){
            generalMemeberDetailsResp = iElement.generalMemberDetails.FindZ_INT_OrgUsersListResponse.OrganizationMembers;
            iModel.memberPersonIdItemID(generalMemeberDetailsResp["ParticipatingPerson"]["Person-id"]["ItemId"]);
            iModel.memberUserName(getTextValue(generalMemeberDetailsResp["ParticipatingPerson"]["User_ID"]));
            iModel.memberOrganizationName(getTextValue(generalMemeberDetailsResp["Owner"]["Name"]));
            iModel.memberOrganizationItemID(generalMemeberDetailsResp["Owner"]["GCOrganization-id"]["ItemId"]);
            iModel.jobTitle(generalMemeberDetailsResp["JobTitle"]);
            iModel.orgMembershipId(generalMemeberDetailsResp["OrganizationMembers-id"].ItemId1);
            iModel.memberEmailId(getTextValue(generalMemeberDetailsResp["ParticipatingPerson"]["Email"]));
            var startDate = generalMemeberDetailsResp["StartDate"];
            iModel.startDate(startDate ? startDate.replace('Z','') : startDate);
            iModel.startDatetoLocale(startDate ? formateDatetoLocale(startDate) : startDate);
            var endDate = generalMemeberDetailsResp["EndDate"];
            iModel.endDate(endDate ? endDate.replace('Z','') : endDate);
            iModel.endDatetoLocale(endDate ? formateDatetoLocale(endDate) : endDate);
            iModel.isPrimaryContact((generalMemeberDetailsResp["IsPrimaryContact"] && generalMemeberDetailsResp["IsPrimaryContact"]==="true") ? true:false);
            if(generalMemeberDetailsResp["RelatedContactType"] ){
                iModel.formContactType(_getTextValue(generalMemeberDetailsResp["RelatedContactType"]["Name"]));
                iModel.formContactTypeItemId(generalMemeberDetailsResp["RelatedContactType"]["GCContactType-id"]["ItemId"] );
            }
        }
        if(iElement.specialMembersList && iElement.specialMembersList.FindZ_INT_OrgUsersListResponse){
            specialMembersListResp = iElement.specialMembersList.FindZ_INT_OrgUsersListResponse.OrganizationMembers;
            iModel.subOrgsMapped.removeAll();
            if(Array.isArray(specialMembersListResp)){
                specialMembersListResp.forEach(ele => {
                    var specialOrg = {GCOrganizationid :{ ItemId : ele.Owner["GCOrganization-id"].ItemId }, membershipId : ele["OrganizationMembers-id"].ItemId1};
                    if(ele.Owner.ParentOrganization && ele.Owner.ParentOrganization["GCOrganization-id"].ItemId){
                        specialOrg.Chicklet = ko.observable(ele.Owner.ParentOrganization.Name.text + " > " + ele.Owner.Name.text);
                    }
                    else{
                        specialOrg.Chicklet = ko.observable(ele.Owner.Name.text);
                    }
                    if(ele.RelatedAssignment && ele.RelatedAssignment["Assignment-id"] && ele.RelatedAssignment["Assignment-id"].ItemId){
                        specialOrg.assignmentId = ele.RelatedAssignment["Assignment-id"].ItemId;
                    }
                    specialOrg.orgTreeObj = ele.Owner;
                    iModel.subOrgsMapped.push(specialOrg); 
                    });
            }
            else if(specialMembersListResp){
                var specialOrg = {GCOrganizationid :{ ItemId : specialMembersListResp.Owner["GCOrganization-id"].ItemId }, membershipId : specialMembersListResp["OrganizationMembers-id"].ItemId1};
                if(specialMembersListResp.Owner.ParentOrganization && specialMembersListResp.Owner.ParentOrganization["GCOrganization-id"].ItemId){
                    specialOrg.Chicklet = ko.observable(specialMembersListResp.Owner.ParentOrganization.Name.text + " > " + specialMembersListResp.Owner.Name.text);
                }
                else{
                    specialOrg.Chicklet = ko.observable(specialMembersListResp.Owner.Name.text);
                }
                if(specialMembersListResp.RelatedAssignment && specialMembersListResp.RelatedAssignment["Assignment-id"] && specialMembersListResp.RelatedAssignment["Assignment-id"].ItemId){
                    specialOrg.assignmentId = specialMembersListResp.RelatedAssignment["Assignment-id"].ItemId;
                }
                specialOrg.orgTreeObj = specialMembersListResp.Owner;
                iModel.subOrgsMapped.push(specialOrg);
            }
        }
        
        //l_memberDetails_model.fetchRootOrgList();
    }

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

function _getTextValue(obj) {
    return obj && obj.text ? obj.text : "";
}
$(document).ready(function () {
	var i_locale = getlocale();
	var rtl_css = '../../../../../com/opentext/apps/utils/css/rtlappscommon.css';
	translateLabels("com/opentext/apps/commoncomponents/BasicComponents/BasicComponents", i_locale, false);
	loadRTLIfRequired(i_locale,rtl_css);

    if (window.parent.parent) {
        generalAccessIframe = $('[src*="generalmembership.htm"]', window.parent.parent.document);
        if (generalAccessIframe) {
            generalAccessIframe.css('border', 'none');
        }
    }
    
    var cInstanceId = getUrlParameterValue("instanceId", null, true);
    l_generalAccess_model = new GeneralMembersModel(cInstanceId);
    ko.applyBindings(l_generalAccess_model, document.getElementById("id_GeneraAccessData"));
    
    l_generalAccessFilter_model = new GeneralMembersFilterModel();
    ko.applyBindings(l_generalAccessFilter_model, document.getElementById("filter_panel_body"));
    
    l_organizationsForSelection_model = new OrganizationsListModel();
    ko.applyBindings(l_organizationsForSelection_model, document.getElementById("div_selectOrganizationModal"));
    
    l_memberDetails_model = new MemberDetailsModel();
    ko.applyBindings(l_memberDetails_model, document.getElementById("div_createOrUpdateMembersModal"));

    l_userForSelection_model = new UsersListModel();
    ko.applyBindings(l_userForSelection_model,document.getElementById("div_selectUserModal"));

    createToastDiv();
    hideFilter();
    listGeneralAccessMembers();
    
    $("#id_filterGeneralAccessButton").click(function (iEventObject) {
        if ($("#id_generalAccessFilter").attr('apps-toggle') == "expanded") {
            $("#id_generalAccessFilter").toggle();
            document.getElementById("id_generalAccessFilter").setAttribute("apps-toggle", 'collapsed');
            $("#id_GeneraAccessData").removeClass("col-md-9");
            $("#id_GeneraAccessData").addClass("col-md-12");
        }
        else if ($("#id_generalAccessFilter").attr('apps-toggle') == "collapsed") {
            $("#id_generalAccessFilter").toggle();
            document.getElementById("id_generalAccessFilter").setAttribute("apps-toggle", 'expanded');
            $("#id_GeneraAccessData").removeClass("col-md-12");
            $("#id_GeneraAccessData").addClass("col-md-9");
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

function translatePage(){
    if(mBundle){mBundle.translate();}
}
