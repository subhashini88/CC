$.cordys.json.defaults.removeNamespacePrefix = true;
var l_task_model;
var l_rolesList_model;
var l_groupsList_model;
var selectedActivityListMap = {};
let l_relatedInstanceItemID;
let l_relatedInstanceType;

const CONTRACTREQTYPE = 'ContractRequest';
const CONTRACTTYPE = 'Contract';
const TEMPLATETYPE = 'Template';
const CLAUSETYPE = 'Clause';


var RolesListModel = function () {
    var self = this;
    self.RolesList = ko.observableArray([]);
    self.selectedRoleItemID = ko.observable('');
    self.selectedRoleName = ko.observable('');
    self.selectRoleRadioButton = function (iItem, event) {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
        if (iItem["Identity-id"]) {
            self.selectedRoleItemID(iItem["Identity-id"].ItemId);
            self.selectedRoleName(getTextValue(iItem.Name));
        }
    }
    self.onRoleRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        if (iItem["Identity-id"]) {
            self.selectedRoleItemID(iItem["Identity-id"].ItemId);
            self.selectedRoleName(getTextValue(iItem.Name));
        }
        event.stopPropagation();
        return true;
    }
}
var GroupsListModel = function () {
    var self = this;
    self.GroupsList = ko.observableArray([]);
    self.selectedGroupItemID = ko.observable('');
    self.selectedGroupName = ko.observable('');
    self.selectGroupRadioButton = function (iItem, event) {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
        if (iItem["Identity-id"]) {
            self.selectedGroupItemID(iItem["Identity-id"].ItemId);
            self.selectedGroupName(getTextValue(iItem.Name));
        }
    }
    self.onGroupRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        if (iItem["Identity-id"]) {
            self.selectedGroupItemID(iItem["Identity-id"].ItemId);
            self.selectedGroupName(getTextValue(iItem.Name));
        }
        event.stopPropagation();
        return true;
    }
}
var UsersListModel = function () {
    var self = this;
    self.UsersList = ko.observableArray([]);
    self.selectedUserItemID = ko.observable('');
    self.selectedUserName = ko.observable('');

    self.selectMemberRadioButton = function (iItem, event) {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
        var l_itemId = iItem.ParticipatingPerson.PersonToUser["Identity-id"].ItemId;
        self.selectedUserItemID(l_itemId);
        self.selectedUserName(getTextValue(iItem.ParticipatingPerson.PersonToUser.IdentityDisplayName));
    }

    self.selectUserRadioButton = function (iItem, event) {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
        if (iItem["Identity-id"]) {
            var l_itemId = iItem["Identity-id"].ItemId;
            self.selectedUserItemID(l_itemId);
            self.selectedUserName(iItem.UserId);
        }
    }

    self.onMemberRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        if(l_usersList_model.showOrgMembers()){

        }
        if (iItem.ParticipatingPerson.PersonToUser["Identity-id"]) {
            var l_itemId = iItem.ParticipatingPerson.PersonToUser["Identity-id"].ItemId;
            self.selectedUserItemID(l_itemId);
            self.selectedUserName(getTextValue(iItem.ParticipatingPerson.PersonToUser.IdentityDisplayName));
        }
        event.stopPropagation();
        return true;
    }

    self.onUserRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        if(l_usersList_model.showOrgMembers()){

        }
        if (iItem["Identity-id"]) {
            var l_itemId = iItem["Identity-id"].ItemId;
            self.selectedUserItemID(l_itemId);
            self.selectedUserName(iItem.UserId);
        }
        event.stopPropagation();
        return true;
    }

    self.showOrgMembers = function(){
        return l_relatedInstanceType === CONTRACTTYPE || l_relatedInstanceType === CONTRACTREQTYPE;
    }
}

var Task = function () {
    var self = this;

    self.TaskTypes = Object.freeze({
        STANDARD: { label: 'Standard', value: 'STANDARD'},
        APPROVAL: { label: 'Approval', value: 'APPROVAL'}
    })

    self.taskTypesList = ko.observableArray(Object.values(self.TaskTypes));

    // Variables.
    self.id = '';
    self.itemId = '';
    self.action = '';

    // Observables.
    self.type = ko.observable('');
    self.name = ko.observable('');
    self.description = ko.observable('');
    self.assignmentType = ko.observable('');
    self.assignTo = ko.observable('');
    self.assignToName = ko.observable('');

    /** Behaviour methods. **/

    self.getTaskTypeLabel = function(iItem){
        return getTranslationMessage(iItem.type() ? self.TaskTypes[iItem.type()].label:"");
    }
}

var User = function () {
    var self = this;

    // Variables.
    self.id = '';
    self.itemId = '';
    self.name = '';
}

var Role = function () {
    var self = this;

    // Variables.
    self.id = '';
    self.itemId = '';
    self.name = '';
}

var Group = function () {
    var self = this;

    // Variables.
    self.id = '';
    self.itemId = '';
    self.name = '';
}

var Item = function () {
    var self = this;
    // Variables.
    self.id = '';
    self.itemId = '';
    self.name = ko.observable('');
}


function validateMandatoryFields() {
    let validationFlag = true;
    if (l_task_model.name() == "") {
        $("#activityname").addClass("cc-error");
        validationFlag = false;
    }
    if (!l_task_model.type()) {
        $("#activityType").addClass("cc-error");
        validationFlag = false;
    }
    if (!l_task_model.assignmentType()){
        $("#assignmentType").addClass("cc-error");
        validationFlag = false;
    }
    if (!l_task_model.assignTo()) {
        $("#assignTo").addClass("cc-error");
        validationFlag = false;
    }
    return validationFlag;
}

function formTaskDetails(iElement, usersList, rolesList) {
    if (iElement) {
        var task = new Task();
        task.name(iElement.Name);
        task.description(iElement.Description);
        task.type(iElement.TypeOfActivity);
            task.assignmentType(iElement.AssignmentType);
            if (iElement.AssignmentType == "INDIVIDUAL" && iElement.AssignedToUser) {
                var user = usersList[iElement.AssignedToUser["Identity-id"].ItemId];
                if (user) {
                    task.assignTo(user.itemId);
                    task.assignToName(user.name);
                }

            } else if (iElement.AssignmentType == "ROLE" && iElement.AssignedToRole) {
                var role = rolesList[iElement.AssignedToRole["Identity-id"].ItemId];
                if (role) {
                    task.assignTo(role.itemId);
                    task.assignToName(role.name);
                }
            } else if (iElement.AssignmentType == "GROUP" && iElement.AssignedToGROUP) {
                var group = groupsList[iElement.AssignedToGROUP["Identity-id"].ItemId];
                if (group) {
                    task.assignTo(group.itemId);
                    task.assignToName(group.name);
                }
            }
        task.id = iElement['Activity-id'].Id;
        task.itemId = iElement['Activity-id'].ItemId;
        return task;
    }
}


function formTaskRequest(i_task) {
    var properties = {};
    var taskDetails = {};
    taskDetails.RelatedInstanceItemId = l_relatedInstanceItemID;
    taskDetails.RelatedInstanceType = l_relatedInstanceType;
    
    properties.AssignmentType = i_task.assignmentType();
    properties.Name = i_task.name();
    properties.Description = i_task.description();
    properties.TaskType = i_task.type();

    if (i_task.assignmentType() == "INDIVIDUAL") {
        properties.UserAssigneeId = i_task.assignTo();
        properties.RoleAssigneeId = "";
        properties.GroupAssigneeId
    } else if (i_task.assignmentType() == "ROLE") {
        properties.UserAssigneeId = "";
        properties.RoleAssigneeId = i_task.assignTo();
        properties.GroupAssigneeId = "";
    }  else if (i_task.assignmentType() == "GROUP") {
        properties.UserAssigneeId = "";
        properties.RoleAssigneeId = "";
        properties.GroupAssigneeId = i_task.assignTo();

    }
    taskDetails.Task = properties;
    return taskDetails;
}

function removeErrorClass(iEvent) {
    $(iEvent).removeClass("cc-error");
}

function openUserOrRoleSelectionModal(iElement) {
    l_element = iElement;
        if (l_task_model.assignmentType() == "INDIVIDUAL") {
            $("#selectIndividualModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            if(l_usersList_model.showOrgMembers()){
                ListAllMembers();
            }else{
                ListAllUsers();
            }
            $('button#selectIndividualYes').off("click");
            $('button#selectIndividualYes').on('click', function (_event) {
                l_task_model.assignTo(l_usersList_model.selectedUserItemID())
                l_task_model.assignToName(l_usersList_model.selectedUserName())
                $(l_element.parentElement.previousElementSibling).removeClass("cc-error")
            });
        } else if (l_task_model.assignmentType() == "ROLE") {
            $("#selectRoleModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            ListAllRoles();
            $('button#selectRoleYes').off("click");
            $('button#selectRoleYes').on('click', function (_event) {
                l_task_model.assignTo(l_rolesList_model.selectedRoleItemID())
                l_task_model.assignToName(l_rolesList_model.selectedRoleName())
                $(l_element.parentElement.previousElementSibling).removeClass("cc-error")
            });
        } else if(l_task_model.assignmentType() == "GROUP") {
            $("#selectGroupModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            ListAllGroups();
            $('button#selectGroupYes').off("click");
            $('button#selectGroupYes').on('click', function (_event) {
                l_task_model.assignTo(l_groupsList_model.selectedGroupItemID())
                l_task_model.assignToName(l_groupsList_model.selectedGroupName())
                $(l_element.parentElement.previousElementSibling).removeClass("cc-error")
            });
        }
}
function ListAllRoles() {
    var l_roleNameFilter = document.getElementById("input_roleListSearchFilter");
    $.cordys.ajax({
        namespace: "http://schemas/OpenTextEntityIdentityComponents/Role/operations",
        method: "GetAllRoles",
        parameters: {
            "contains": l_roleNameFilter.value
        },
        success: function (data) {
            addDataToRolesView(data.Role, l_rolesList_model);
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while loading the roles. Contact your administrator."), 10000);
            return false;
        }
    });
}
function ListAllMembers() {
    var l_userIDFilter = document.getElementById("input_userListSearchFilter");
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
        method: "GetOrgMemberswithFilters",
        parameters: {
            "memUserID": l_userIDFilter.value,
            "orgName": "",
            "orgID": "",
            "offset": "0",
            "limit": "200"
        },
        success: function (data) {
            addDataToMembersLookup(data.OrgMembers.FindZ_INT_OrgUsersListResponse.OrganizationMembers, l_usersList_model);
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while loading the individuals. Contact your administrator."), 10000);
            return false;
        }
    });
}

function ListAllUsers() {
    var l_userIDFilter = document.getElementById("input_userListSearchFilter");
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
        method: "GetIdentityUsersWithFilters",
        parameters: {
            "UserID": l_userIDFilter.value,
        },
        success: function (data) {
            addDataToUserLookup(data.Users.FindAllUsersInternalResponse.User, l_usersList_model);
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while loading the individuals. Contact your administrator."), 10000);
            return false;
        }
    });
}

function ListAllGroups() {
	var l_groupNameFilter = document.getElementById("input_groupListSearchFilter");
	$.cordys.ajax({
		namespace: "http://schemas/OpenTextEntityIdentityComponents/Group/operations",
		method: "GetAllGroups",
		parameters: {
			"contains": l_groupNameFilter?l_groupNameFilter.value:""
		},
		success: function (data) {
			addDataToGroupsView(data.Group, l_groupsList_model);
		},
		error: function (responseFailure) {
			showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while loading the groups. Contact your administrator."), 10000);
			return false;
		}
	});
}

function addDataToRolesView(iElementList, iModel) {
    iModel.RolesList.removeAll();
    if (iElementList) {
        if (iElementList.length) {
            iElementList.forEach(function (iElement) {
                if (iElement.Package_Name.indexOf("Cordys@Work") == -1) {
                    iModel.RolesList.push(iElement);
                }
            });
        }
        else {
            if (iElementList.Package_Name.indexOf("Cordys@Work") == -1) {
                iModel.RolesList.push(iElementList);
            }
        }
    }
}
function clearOtherRowsChecked(iElement, event) {
    event.stopPropagation();
}
function addDataToMembersLookup(iElementList, iModel) {
    iModel.UsersList.removeAll();
    if (iElementList) {
        if (iElementList.length) {
            iElementList.forEach(function (iElement) {
                if (iElement.ParticipatingPerson.PersonToUser) {
                    iModel.UsersList.push(iElement);
                }
            });
        }
        else {
            if (iElementList.ParticipatingPerson.PersonToUser) {
                iModel.UsersList.push(iElementList);
            }
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

function addDataToGroupsView(iElementList, iModel) {
	iModel.GroupsList.removeAll();
	if (iElementList) {
		if (iElementList.length) {
			iElementList.forEach(function (iElement) {
				iModel.GroupsList.push(iElement);
			});
		}
		else {
			iModel.GroupsList.push(iElementList);
			
		}
	}
}


function formRoleDetails(iElement) {
    if (iElement) {
        var role = new Role();
        role.id = iElement['Identity-id'].Id;
        role.itemId = iElement['Identity-id'].ItemId;
        role.name = (iElement.Name && iElement.Name.text) ? iElement.Name.text : iElement.Name;
        return role;
    }
}

function formGroupDetails(iElement) {
    if (iElement) {
        var group = new Group();
        group.id = iElement['Identity-id'].Id;
        group.itemId = iElement['Identity-id'].ItemId;
        group.name = (iElement.Name && iElement.Name.text) ? iElement.Name.text : iElement.Name;
        return group;
    }
}

function formUserDetails(iElement) {
    if (iElement) {
        var user = new User();
        user.id = iElement['Identity-id'].Id;
        user.itemId = iElement['Identity-id'].ItemId;
        user.name = (iElement.Name && iElement.Name.text) ? iElement.Name.text : iElement.Name;
        return user;
    }

}
function clearAssignTo(iEvent) {
    l_task_model.assignTo("");
    l_task_model.assignToName("");
    removeErrorClass(iEvent);
}
function platformDialogModifications(i_newButtonName, i_newButtonAction) {
    //hide OK button
    hideOKButton();

    //Save changes action in footer
    var newBtn = document.createElement("Button");
    newBtn.innerHTML = i_newButtonName;
    newBtn.className = "btn btn-primary btn-translate";
    newBtn.onclick = i_newButtonAction;

    $('ai-dialog-footer .btn-primary', window.parent.document).before(newBtn);

    $('ai-dialog', window.parent.document).animate({
        'max-height': '100vh',
        'max-width': '60vw',
        'width': '64vw',
        'height': '78vh'
    }, 500);

    //Dialog content style enhancements            
    $('ai-dialog-body iframe', window.parent.document).css({
        'width': '100%',
        'height': 'calc(100% - 6px)',
    });

    $('ai-dialog-body', window.parent.document).css({
        'max-height': 'calc(98vh - 7.5em)',
        // 'height': '100%',
        'height': '65vh',

    });

    $('.layout-panel .panel-container', window.parent.document).css({
        'padding-left': '0px'
    });

    $('panel-container iframe', window.parent.document).css({
        'height': 'calc(100% - 6px)',
        'width': '100%',
        'border': '0px'
    });
}

function createGeneralTask(){
    const methodAndNsMap = Object.freeze({
        Clause : {method : "ClauseTemplateAddTask", ns : "http://schemas.opentext.com/apps/contentlibrary/19.2"},
        Template : {method : "ClauseTemplateAddTask", ns : "http://schemas.opentext.com/apps/contentlibrary/19.2"},
        Contract : {method : "ContractAddTask", ns : "http://schemas.opentext.com/apps/contractcenter/16.3"},
        ContractRequest : {method : "ConReqAddTask", ns : "http://schemas.opentext.com/apps/contractinitiation/19.2"},
    });

    if(validateMandatoryFields()){
        addTask(methodAndNsMap[l_relatedInstanceType].method, methodAndNsMap[l_relatedInstanceType].ns);
    }
}

function addTask(method, ns){
    $.cordys.ajax({
        namespace: ns,
        method: method,
        parameters: formTaskRequest(l_task_model),
        success: function () {
            window.parent.location.reload();
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while creating the task. Contact your administrator."), 10000);
            return false;
        }
    });
}

$(function () {
    const instanceTypeMap = {
        "005056C00008A1E795653A59509D399D": CONTRACTTYPE,
        "C4D98747A6D9A1E8AC34736789FC486E": TEMPLATETYPE,
        "F8B156BC2CB7A1E8AC30A6D1F215F031": CLAUSETYPE,
        "F8B156D6337AA1E8ABCED16B6A87C882": CONTRACTREQTYPE
    }
    var i_locale = getlocale();
    var rtl_css = '../../../../../com/opentext/apps/utils/css/rtlappscommon.css';
    translateLabels("com/opentext/apps/commoncomponents/CCConfigurableWorkflow/CCConfigurableWorkflow", i_locale);
    loadRTLIfRequired(i_locale,rtl_css);

    l_relatedInstanceItemID = getUrlParameterValue("instanceId", null, true);
    l_relatedInstanceType = instanceTypeMap[l_relatedInstanceItemID.substring(0,l_relatedInstanceItemID.indexOf('.'))];

    createToastDiv();
    l_task_model = new Task();
    ko.applyBindings(l_task_model, document.getElementById("task_details_div"));
    l_rolesList_model = new RolesListModel();
    ko.applyBindings(l_rolesList_model, document.getElementById("id_rolesList"));
    l_groupsList_model = new GroupsListModel();
    ko.applyBindings(l_groupsList_model, document.getElementById("id_groupsList"));
    l_usersList_model = new UsersListModel();
    ko.applyBindings(l_usersList_model, document.getElementById("id_userssList"));

    platformDialogModifications("Add task", createGeneralTask);

});