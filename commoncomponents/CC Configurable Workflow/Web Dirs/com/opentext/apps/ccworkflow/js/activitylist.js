$.cordys.json.defaults.removeNamespacePrefix = true;
var l_activityList_model;
var l_activityListFilter_model;
var l_rolesList_model;
var l_activity;
const activityListOffsetValue = 0;
const activityListLimitValue = 25;
var activityList_is_last_page_clicked = 0;
var activityList_is_first_page_clicked = 0;
var selectedActivityListMap = {};
var defaultIDforSelectDropdown = "";
var l_processItemID = "";

const TLMetadata = Object.freeze({
    CLAUSE: {
        TYPE : "CLAUSE",
        VALUE: "Clause",
        LABEL: "Clauses",
        PROCESS: "Clause",
        PURPOSE : "CLAACTLIST;"
    },
    TEMPLATE : {
        TYPE : "TEMPLATE",
        VALUE: "Template",
        LABEL: "Templates",
        PROCESS: "Template",
        PURPOSE : "TEMACTLIST;"
    },
    CONTRACT : {
        TYPE : "CONTRACT",
        VALUE: "Contract",
        LABEL: "Contracts",
        PROCESS: "Contract",
        PURPOSE : "CTRACTLIST"
    },
    OBLIGATION : {
        TYPE : "OBLIGATION",
        VALUE: "Obligation",
        LABEL: "Obligations",
        PROCESS: "Contract",
        PURPOSE : ""
    }
})

var ActivityListTabsModel  = function (){
    var self = this;
    self.allTabs = Object.values(TLMetadata);
    self.selectedTab = ko.observable(TLMetadata.CLAUSE.TYPE);

    self.loadSelectedTab = (iItem) => {
        self.selectedTab(iItem.TYPE);
        l_activityList_model.activityListType(TLMetadata[iItem.TYPE]);
        ListAllActivityLists();
    }

}

var ActivityListModel = function () {
    var self = this;
    self.activityListType = ko.observable(TLMetadata.CLAUSE);
    self.ActivityLists = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.totalActivityListsCount = ko.observable('');
    self.totalCurrentPageActivityListsCount = ko.observable('');
    self.totalActivityListsPageCount = ko.observable('');

    self.openSelectedItem = function (iItem) {
        if (iItem["ActivityList-id"] && iItem.CreationType!="DEFAULT-IMPORTED") {
            var l_itemId = iItem["ActivityList-id"].ItemId;
            openActivityListCreateorEditForm(l_itemId);
        }
    }

    self.confirmChangeActivityListStatus = function (iItem, event) {
        if (iItem["ActivityList-id"].ItemId) {
            var statusToChange = iItem.Status == "ACTIVE" ? "INACTIVE" : "ACTIVE";
            changeActivityListStatus(iItem["ActivityList-id"].ItemId, statusToChange);
        }
        event.stopPropagation();
    }
    self.confirmDeleteActivityList = function (iItem, event) {
        if (iItem["ActivityList-id"].ItemId) {
            callDeleteActivityList(iItem["ActivityList-id"].ItemId);
        }
        event.stopPropagation();
    }
    self.onActivityListCheckboxValueChanged = function (iItem, event) {
        var l_currentClassName = event.currentTarget.className;
        if (l_currentClassName == "cc-select-column cc-checkbox-off") {
            $(event.currentTarget).removeClass("cc-checkbox-off")
            $(event.currentTarget).addClass("cc-checkbox-on")
            selectedActivityListMap[iItem["ActivityList-id"].ItemId] = iItem.Name;
            $(event.currentTarget.parentElement.parentElement).css("background-color", "#CBD3D9")
        }
        else if (l_currentClassName == "cc-select-column cc-checkbox-on") {
            $(event.currentTarget).removeClass("cc-checkbox-on")
            $(event.currentTarget).addClass("cc-checkbox-off")
            delete selectedActivityListMap[iItem["ActivityList-id"].ItemId];
            $(event.currentTarget.parentElement.parentElement).css("background-color", "transparent")
        }
        event.stopPropagation();
		$("#id_openActivityListActionBar").prop("disabled", false);
		$("#id_editActivityListActionBar").prop("disabled", false);
		$("#id_deleteActivityListActionBar").prop("disabled", false);
        if (Object.keys(selectedActivityListMap).length <= 0) {
            $("#id_selectAllActivityLists").removeClass("cc-checkbox-select-all-partial");
            $("#id_selectAllActivityLists").removeClass("cc-checkbox-select-all-on");
            $("#id_selectAllActivityLists").addClass("cc-checkbox-select-all-off");
            $("#id_openActivityListActionBar").css("display", "none");
            $("#id_editActivityListActionBar").css("display", "none");
            $("#id_deleteActivityListActionBar").css("display", "none");
        } else if (Object.keys(selectedActivityListMap).length == 1) {
            if (1 == l_activityList_model.totalCurrentPageActivityListsCount()) {
                $("#id_selectAllActivityLists").removeClass("cc-checkbox-select-all-off");
                $("#id_selectAllActivityLists").removeClass("cc-checkbox-select-all-partial");
                $("#id_selectAllActivityLists").addClass("cc-checkbox-select-all-on");
                $("#id_openActivityListActionBar").css("display", "inline");
                $("#id_editActivityListActionBar").css("display", "inline");
                $("#id_deleteActivityListActionBar").css("display", "inline");
            } else {
                $("#id_selectAllActivityLists").removeClass("cc-checkbox-select-all-off");
                $("#id_selectAllActivityLists").removeClass("cc-checkbox-select-all-on");
                $("#id_selectAllActivityLists").addClass("cc-checkbox-select-all-partial");
                $("#id_openActivityListActionBar").css("display", "inline");
                $("#id_editActivityListActionBar").css("display", "inline");
                $("#id_deleteActivityListActionBar").css("display", "inline");
            }
        } else if (Object.keys(selectedActivityListMap).length > 1 && Object.keys(selectedActivityListMap).length < l_activityList_model.totalCurrentPageActivityListsCount()) {
            $("#id_selectAllActivityLists").removeClass("cc-checkbox-select-all-off");
            $("#id_selectAllActivityLists").removeClass("cc-checkbox-select-all-on");
            $("#id_selectAllActivityLists").addClass("cc-checkbox-select-all-partial");
            $("#id_openActivityListActionBar").css("display", "none");
            $("#id_editActivityListActionBar").css("display", "none");
            $("#id_deleteActivityListActionBar").css("display", "inline");
        } else if (Object.keys(selectedActivityListMap).length == l_activityList_model.totalCurrentPageActivityListsCount()) {
            $("#id_selectAllActivityLists").removeClass("cc-checkbox-select-all-off");
            $("#id_selectAllActivityLists").removeClass("cc-checkbox-select-all-partial");
            $("#id_selectAllActivityLists").addClass("cc-checkbox-select-all-on");
        }
		if(hasDefaultImportedItem()){
			$("#id_openActivityListActionBar").prop("disabled", true);
			$("#id_editActivityListActionBar").prop("disabled", true);
			$("#id_deleteActivityListActionBar").prop("disabled", true);
		}
    }
    self.onActivityListCheckAllValueChanged = function (iItem, event) {
        var l_currentClassName = event.currentTarget.className;
		$("#id_openActivityListActionBar").prop("disabled", false);
		$("#id_editActivityListActionBar").prop("disabled", false);
		$("#id_deleteActivityListActionBar").prop("disabled", false);
        if (l_currentClassName == "cc-select-column cc-checkbox-select-all-off" || l_currentClassName == "cc-select-column cc-checkbox-select-all-partial") {
            $(event.currentTarget).removeClass("cc-checkbox-select-all-off");
            $(event.currentTarget).removeClass("cc-checkbox-select-all-partial");
            $(event.currentTarget).addClass("cc-checkbox-select-all-on");
            $("#id_activityListTable").find('tbody .cc-select-column').removeClass("cc-checkbox-off");
            $("#id_activityListTable").find('tbody .cc-select-column').addClass("cc-checkbox-on");
            $("#id_activityListTable").find('tbody tr').css("background-color", "#CBD3D9");
            $("#id_openActivityListActionBar").css("display", "none");
            $("#id_editActivityListActionBar").css("display", "none");
            $("#id_deleteActivityListActionBar").css("display", "inline");
            l_activityList_model.ActivityLists().forEach(function (iToken) {
                selectedActivityListMap[iToken["ActivityList-id"].ItemId] = iToken.Name;
            });
        }
        else if (l_currentClassName == "cc-select-column cc-checkbox-select-all-on") {
            $(event.currentTarget).removeClass("cc-checkbox-select-all-on");
            $(event.currentTarget).addClass("cc-checkbox-select-all-off");
            $("#id_activityListTable").find('tbody .cc-select-column').removeClass("cc-checkbox-on");
            $("#id_activityListTable").find('tbody .cc-select-column').addClass("cc-checkbox-off");
            $("#id_activityListTable").find('tbody tr').css("background-color", "transparent")
            $("#id_openActivityListActionBar").css("display", "none");
            $("#id_editActivityListActionBar").css("display", "none");
            $("#id_deleteActivityListActionBar").css("display", "none");
            selectedActivityListMap = {};
        }
        event.stopPropagation();
		if(hasDefaultImportedItem()){
			$("#id_openActivityListActionBar").prop("disabled", true);
			$("#id_editActivityListActionBar").prop("disabled", true);
			$("#id_deleteActivityListActionBar").prop("disabled", true);
		}
    }
}
var ActivityListFilterModel = function () {
    var self = this;
    var l_nameFilterField = document.getElementById("filter_activityListName");
    var l_descriptionFilterField = document.getElementById("filter_activityListDescription");
    self.ClearFilter = function () {
        l_nameFilterField.value = "";
        l_descriptionFilterField.value = "";
    }
    self.getFilterObject = function () {
        self.CurrentFilterObject = {
            "activityType" : l_activityList_model.activityListType().VALUE,
            "activityName": l_nameFilterField.value,
            "description": l_descriptionFilterField.value,
            "offset": activityListOffsetValue,
            "limit": activityListLimitValue,
        };
        return self.CurrentFilterObject;
    }
}
var RolesListModel = function () {
    var self = this;
    self.RolesList = ko.observableArray([]);
    self.selectedRoleItemID = ko.observable('');
    self.selectedRoleName = ko.observable('');
    self.selectRoleRadioButton = function (iItem, event) {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
        if (iItem["Identity-id"]) {
            var l_itemId = iItem["Identity-id"].ItemId;
            self.selectedRoleItemID(iItem["Identity-id"].ItemId);
            self.selectedRoleName(getTextValue(iItem.Name));
        }
    }
    self.onRoleRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        if (iItem["Identity-id"]) {
            var l_itemId = iItem["Identity-id"].ItemId;
            self.selectedRoleItemID(iItem["Identity-id"].ItemId);
            self.selectedRoleName(getTextValue(iItem.Name));
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
    self.selectRoleRadioButton = function (iItem, event) {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
        if (iItem.ParticipatingPerson.PersonToUser["Identity-id"]) {
            var l_itemId = iItem.ParticipatingPerson.PersonToUser["Identity-id"].ItemId;
            self.selectedUserItemID(l_itemId);
            self.selectedUserName(getTextValue(iItem.ParticipatingPerson.PersonToUser.IdentityDisplayName));
        }
    }
    self.onRoleRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        if (iItem.ParticipatingPerson.PersonToUser["Identity-id"]) {
            var l_itemId = iItem.ParticipatingPerson.PersonToUser["Identity-id"].ItemId;
            self.selectedUserItemID(l_itemId);
            self.selectedUserName(getTextValue(iItem.ParticipatingPerson.PersonToUser.IdentityDisplayName));
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
            var l_itemId = iItem["Identity-id"].ItemId;
            self.selectedGroupItemID(iItem["Identity-id"].ItemId);
            self.selectedGroupName(getTextValue(iItem.Name));
        }
    }
    self.onGroupRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        if (iItem["Identity-id"]) {
            var l_itemId = iItem["Identity-id"].ItemId;
            self.selectedGroupItemID(iItem["Identity-id"].ItemId);
            self.selectedGroupName(getTextValue(iItem.Name));
        }
        event.stopPropagation();
        return true;
    }
}

var Task = function () {
    var self = this;

    // DEFAULT: { label: '- select task type', value: '' },
    self.TaskTypes = Object.freeze({
        STANDARD: { label: 'Standard', value: 'STANDARD', show:true},
        APPROVAL: { label: 'Approval', value: 'APPROVAL', show:true },
        STATE_TRANSITION: { label: 'State transition', value: 'STATE_TRANSITION', show: l_activityList_model.activityListType().TYPE !== 'OBLIGATION' && (l_activity.tasks().length == 0 || l_activity.tasks().some((t)=> t.type() !== 'STATE_TRANSITION')) },
        CUSTOM: { label: 'Custom', value: 'CUSTOM', show: l_activityList_model.activityListType().TYPE === 'CONTRACT'}
    });

    self.taskTypesList = ko.observableArray(Object.values(self.TaskTypes));

    // Variables.
    self.id = '';
    self.itemId = '';
    self.containingActivityId = '';
    self.containingActivityItemId = '';
    self.action = '';
    self.taskOrder;
    self.sourceRowId;
    self.targetRowId;

    // Observables.
    // self.taskOrder = ko.observable('');
    self.type = ko.observable('');
    self.name = ko.observable('');
    self.description = ko.observable('');
    self.transitStateTo = ko.observable('');
    self.assignmentType = ko.observable('');
    self.assignTo = ko.observable('');
    self.assignToName = ko.observable('');
    self.escalationType = ko.observable('');
    self.escalateTo = ko.observable('');
    self.escalateToName = ko.observable('');
    self.dueDays = ko.observable('');
    self.processName = ko.observable('');

    self._initialized = ko.observable(false);
    self.dirtyFlag = new ko.oneTimeDirtyFlag(self);
    // Computed variable.
    
    /** Behaviour methods. **/

    self.hideOptions = (option, item) => {
        if(item){
            ko.applyBindingsToNode(option, {visible:item.show}, item);
        }
    }

    self.getTaskTypeLabel = function(iItem){
        return getTranslationMessage(iItem.type() ? self.TaskTypes[iItem.type()].label:"");
    }

    // Selecting task.
    self.selectTask = function (iItem, event) {
        var tempGDirtyFlag = l_dirty_flag;
        l_activity.selectedIndex(l_activity.tasks().indexOf(self));
        updateMandatoryConditions(getTaskOrder(self));
        l_dirty_flag = tempGDirtyFlag;
    };

    //Delete task 
    self.deleteTask = function () {
        $("#deleteTaskModal").modal({
            backdrop: 'static',
            keyboard: false
        });
        $('button#deleteTaskYes').off("click");
        $('button#deleteTaskYes').on('click', function (_event) {
            deleteTaskfromList(self);
            $("#deleteTaskModal").modal('hide');

        });
        $('button#deleteTaskNo').off("click");
        $('button#deleteTaskNo').on('click', function (_event) {
            $("#deleteTaskModal").modal('hide');

        });

    };
}

function deleteTaskfromList(task) {
    if (task) {
        l_activity.deletedTasks.push(task);
        var taskOrder = getTaskOrder(task);
        
        if (taskOrder > 0) {
            l_activity.selectedIndex(taskOrder - 1);
        }
        l_activity.tasks.remove(task);
        for (var i = taskOrder; l_activity.tasks().length > i; i++) {
            setActionToTask(l_activity.tasks()[i], 'UPD_ORD');
        }
        l_dirty_flag = true;
    }
};

//one-time dirty flag that gives up its dependencies on first change
ko.oneTimeDirtyFlag = function (root) {
    var _initialized = false;
    var result = ko.computed(function () {
        if (!root._initialized()) {
            return false;
        }
        if (!_initialized) {
            //just for subscriptions
            ko.toJS(root);

            //next time return true and avoid ko.toJS
            _initialized = true;

            //on initialization this flag is not dirty
            return false;
        }

        //on subsequent changes, flag is now dirty
        l_dirty_flag = true;
        return true;
    });
    return result;
};

var Activity = function () {
    var self = this;

    // Variables.
    self.id = '';
    self.itemId = '';
    self.order;
    self.code;

    // Observables.
    self.name = ko.observable('');
    self.description = ko.observable('');
    self.status = ko.observable('');
    self.selectedIndex = ko.observable(0);

    // Observable arrays.
    self.tasks = ko.observableArray([]);
    self.deletedTasks = ko.observableArray([]);

    self.statesOfSelectedProcess = ko.observableArray([]);

    /** Task reorder. */
    // Task row drag.
    self.rowDrag = function (data, event, index) {
        self.sourceRowId = index;
    }

    // Task row drop.
    self.rowDrop = function (data, event, index) {
        var targetId = index;
        var sourceId = self.sourceRowId;
        if (self.sourceRowId !== -1 && (targetId !== sourceId)) {
            l_dirty_flag = true;
            var startIndex = (targetId > sourceId) ? sourceId : targetId;
            self.selectedIndex(startIndex);
            var targetRowData = self.tasks()[sourceId];
            self.tasks.remove(targetRowData);
            self.tasks.splice(targetId, 0, targetRowData);
            self.selectedIndex(targetId);
            for (var i = startIndex; i < self.tasks().length; i++) {
                setActionToTask(self.tasks()[i], 'UPD_ORD');
            }
        }
        self.sourceRowId = -1;
        self.targetRowId = -1;
    }

    self.rowDragEnter = function (data, event, index) {
        self.targetRowId = index;
        event.preventDefault();
    }

    self.rowDragLeave = function (data, event) {
        self.targetRowId = -1;
        event.preventDefault();
    }
    self.rowDragOver = function (data, event, index) {
        self.targetRowId = index;
        event.preventDefault();
    }

    self.allowDrop = function (event) {
        event.preventDefault();
    }
    self.preventDrop = function (event) {
        event.preventDefault();
    }
    //Confirm cancelling changes on activity
    self.confirmCancelActivityList = function () {

        if (l_dirty_flag) {
            $("#confirmCancelActivityListModal").modal({
                backdrop: 'static',
                keyboard: false
            });

            $('button#cancelActivityListYes').off("click");
            $('button#cancelActivityListYes').on('click', function (_event) {
                clearActivityList();
                $("#confirmCancelActivityListModal").modal('hide');
                $('#create_activity_modal').modal('hide');

            });
            $('button#cancelActivityListNo').off("click");
            $('button#cancelActivityListNo').on('click', function (_event) {
                $("#confirmCancelActivityListModal").modal('hide');

            });
        } else {
            $('#create_activity_modal').modal('hide');
        }
    }

};

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

function addDataActivityListToView(iElementList, iModel) {
    iModel.ActivityLists.removeAll();
    if (iElementList) {
        if (iElementList.length) {
            iModel.totalCurrentPageActivityListsCount(iElementList.length);
            iElementList.forEach(function (iElement) {
                iModel.ActivityLists.push(iElement);
            });
        }
        else {
            iModel.totalCurrentPageActivityListsCount("1");
            iModel.ActivityLists.push(iElementList);
        }
    }
}
function openActivityListCreateForm() {
    openActivityListCreateorEditForm();
}
function openActivityListSummaryForm() {
    if (Object.keys(selectedActivityListMap).length == 1) {
        openActivityListCreateorEditForm(Object.keys(selectedActivityListMap)[0]);
    }
}
function openActivityListCreateorEditForm(itemId) {
    $('#create_activity_modal').modal({
        backdrop: 'static',
        keyboard: false
    })
    clearActivityList();
    translatePage();

    if (itemId) {
        $("#id_activityListModalType").text(getTranslationMessage("Edit"));
        $("#id_createOrUpdateActivityList").text(getTranslationMessage("Update task list"));
        loadStatesforTask(itemId);
    } else {
        $("#id_activityListModalType").text(getTranslationMessage("Create") + " ");
        $("#id_createOrUpdateActivityList").text(getTranslationMessage("Create task list"));
        loadStatesforTask("");
    }
}
function changeActivityListStatus(iItemID, iStatus) {
    $("#changeActivityListStatusModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    $('button#changeActivityListStatusYes').off("click");
    $('button#changeActivityListStatusYes').on('click', function (_event) {
        $.cordys.ajax({
            namespace: "http://schemas/OpenTextCCConfigurableWorkflow/ActivityList/operations",
            method: "UpdateActivityList",
            parameters:
            {
                "ActivityList-id": { "ItemId": iItemID },
                "ActivityList-update": { "Status": iStatus }
            },
            success: function (data) {
                successToast(3000, getTranslationMessage("Task list status changed."));
                ListAllActivityLists();
            },
            error: function (responseFailure) {
                showOrHideErrorInfo("div_listErrorInfoArea", true, getTranslationMessage("An error occurred while changing the task list status. Contact your administrator."), 10000);
                return false;
            }
        });
    });
}
function callDeleteActivityList(iItemID) {
    $("#deleteActivityListModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    $("#id_activitylistsToDelete").text("1");
    $('button#deleteActivityListYes').off("click");
    $('button#deleteActivityListYes').on('click', function (_event) {
        deleteActivityList(iItemID);
    });
}
function deleteActivityList(iItemID) {
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/configworkflow/20.2",
        method: "OnDeleteTaskList",
        parameters:
        {
            "activityListItemId": iItemID,
        },
        success: function (data) {
            successToast(3000, getTranslationMessage("Task list deleted"));
            ListAllActivityLists();
        },
        error: function (responseFailure) {
            var errorMsg = "";
            if(responseFailure.responseJSON.faultstring){
                errorMsg = getTranslationMessage(getTextValue(responseFailure.responseJSON.faultstring));
            }
            showOrHideErrorInfo("div_listErrorInfoArea", true, getTranslationMessage("Unable to delete the task list.") + " " + errorMsg, 10000);
            return false;
        }
    });
}
function deleteFromSelection() {
    $("#deleteActivityListModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    $("#id_activitylistsToDelete").text(Object.keys(selectedActivityListMap).length);
    $('button#deleteActivityListYes').off("click");
    $('button#deleteActivityListYes').on('click', function (_event) {
        for (iElement in selectedActivityListMap) {
            deleteActivityList(iElement);
        }
    });
}
function ListAllActivityLists() {
    $("#id_openActivityListActionBar").css("display", "none");
    $("#id_editActivityListActionBar").css("display", "none");
    $("#id_deleteActivityListActionBar").css("display", "none");
    $("#id_selectAllActivityLists").removeClass("cc-checkbox-select-all-partial");
    $("#id_selectAllActivityLists").removeClass("cc-checkbox-select-all-on");
    $("#id_selectAllActivityLists").addClass("cc-checkbox-select-all-off");
    selectedActivityListMap = {};
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/configworkflow/20.2",
        method: "GetActivityListwithFilters",
        parameters: l_activityListFilter_model.getFilterObject(),
        success: function (data) {
            addDataActivityListToView(data.FindZ_INT_ActivityListResponse.ActivityList, l_activityList_model);
            if (undefined != data.FindZ_INT_ActivityListResponse["@total"]) {
                l_activityList_model.totalActivityListsCount(data.FindZ_INT_ActivityListResponse["@total"]);
            } else {
                l_activityList_model.totalActivityListsCount(0);
            }
            if (l_activityList_model.totalActivityListsCount() != 0) {
                l_activityList_model.totalActivityListsPageCount(Math.ceil(l_activityList_model.totalActivityListsCount() / activityListLimitValue));
            } else {
                l_activityList_model.totalActivityListsPageCount(1);
            }
            updatePaginationParams();
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_listErrorInfoArea", true, getTranslationMessage("An error occurred while loading the task lists. Contact your administrator."), 10000);
            return false;
        }
    });
}
function updatePaginationParams() {
    if (l_activityList_model.currentPage() == 1) {
        document.getElementById("id_activityListDecrementer").style.display = "none";
        document.getElementById("id_activityListIncrementer").style.display = "inline";
    }
    if (l_activityList_model.totalActivityListsCount() <= activityListLimitValue) {
        l_activityList_model.currentPage('1');
        $('#id_activityListDecrementer,#id_activityListIncrementer').css('display', 'none');
    }
}
function decrementOffsetLimit() {
    if (l_activityList_model.currentPage() > 1) {
        activityListOffsetValue = activityListOffsetValue - activityListLimitValue;
        l_activityList_model.currentPage(parseInt(l_activityList_model.currentPage()) - 1);
    }
    if (l_activityList_model.currentPage() < Math.ceil(l_activityList_model.totalActivityListsCount() / activityListLimitValue)) {
        document.getElementById("id_activityListIncrementer").style.removeProperty("display");
    }
    if (l_activityList_model.currentPage() == 1) {
        document.getElementById("id_activityListDecrementer").style.display = "none";
    }
    if (l_activityList_model.currentPage() < 1)
        return;
    ListAllActivityLists();
}
function incrementOffsetLimit() {
    if (l_activityList_model.currentPage() < Math.ceil(l_activityList_model.totalActivityListsCount() / activityListLimitValue)) {
        activityListOffsetValue = activityListOffsetValue + activityListLimitValue;
        l_activityList_model.currentPage(isNaN(parseInt(l_activityList_model.currentPage())) ? 0 : parseInt(l_activityList_model.currentPage()));
        l_activityList_model.currentPage(parseInt(l_activityList_model.currentPage()) + 1);
    }
    if (l_activityList_model.currentPage() == Math.ceil(l_activityList_model.totalActivityListsCount() / activityListLimitValue)) {
        document.getElementById("id_activityListIncrementer").style.display = "none";
    }
    if (l_activityList_model.currentPage() > 1) {
        document.getElementById("id_activityListDecrementer").style.removeProperty("display");
    }
    ListAllActivityLists();
}
function incrementToLast() {
    activityListOffsetValue = (Math.ceil(l_activityList_model.totalActivityListsCount() / activityListLimitValue) - 1) * activityListLimitValue;
    l_activityList_model.currentPage(Math.ceil(l_activityList_model.totalActivityListsCount() / activityListLimitValue));
    $('#id_activityListIncrementer').css('display', 'none');
    $('#id_activityListDecrementer').css('display', 'inline');
    ListAllActivityLists();
}
function decrementToLast() {
    activityListOffsetValue = 0;
    l_activityList_model.currentPage('1');
    $('#id_activityListIncrementer').css('display', 'inline');
    $('#id_activityListDecrementer').css('display', 'none');
    ListAllActivityLists()
}
$(function () {
    var i_locale = getlocale();
    var rtl_css = '../../../../../com/opentext/apps/utils/css/rtlappscommon.css';
    translateLabels("com/opentext/apps/commoncomponents/CCConfigurableWorkflow/CCConfigurableWorkflow", i_locale);
    loadRTLIfRequired(i_locale,rtl_css);

    if (window.parent.parent) {
        activityListFrame = $('[src*="activitylist.htm"]', window.parent.parent.document);
        if (activityListFrame) {
            activityListFrame.css('border', 'none');
        }
    }

    createToastDiv();
    l_activityList_model = new ActivityListModel();
    ko.applyBindings(l_activityList_model, document.getElementById("id_activityListData"));
    l_activityListFilter_model = new ActivityListFilterModel();
    ko.applyBindings(l_activityListFilter_model, document.getElementById("filter_panel_body"));
    l_activity = new Activity();
    ko.applyBindings(l_activity, document.getElementById("create_activity_modal"));
    l_rolesList_model = new RolesListModel();
    ko.applyBindings(l_rolesList_model, document.getElementById("id_rolesList"));
    l_usersList_model = new UsersListModel();
    ko.applyBindings(l_usersList_model, document.getElementById("id_userssList"));
	l_groupsList_model = new GroupsListModel();
    ko.applyBindings(l_groupsList_model, document.getElementById("id_groupsList"));
    ko.applyBindings(new ActivityListTabsModel(), $("#div_activityListTabs")[0]);

    hideFilter();
    ListAllActivityLists();

    $("#id_filterActivityList").click(function (iEventObject) {
        if ($("#id_activityListFilter").attr('apps-toggle') == "expanded") {
            $("#id_activityListFilter").toggle();
            document.getElementById("id_activityListFilter").setAttribute("apps-toggle", 'collapsed');
            $("#id_activityListData").removeClass("col-md-9");
            $("#id_activityListData").addClass("col-md-12");
        }
        else if ($("#id_activityListFilter").attr('apps-toggle') == "collapsed") {
            $("#id_activityListFilter").toggle();
            //setTimeout(function () { $("#id_activityListFilter").toggle('slow'); }, 0);
            document.getElementById("id_activityListFilter").setAttribute("apps-toggle", 'expanded');
            $("#id_activityListData").removeClass("col-md-12");
            $("#id_activityListData").addClass("col-md-9");
        }
    });
    $("#id_cancelFilter").click(function (iEventObject) {
        hideFilter();
    });
    $(".cc-filter-header").click(function (iEventObject) {
        var l_headerSpan = $(this)
        $(this).next().slideToggle();
        if ($(this).attr('apps-toggle') == "expanded") {
            hideOrShowFilterBody($(this)[0], false);
        }
        else if ($(this).attr('apps-toggle') == "collapsed") {
            hideOrShowFilterBody($(this)[0], true);
        }
    });
    $('.toggle-btn-checkbox').click(function () {
        var mainParent = $(this).parent('.toggle-btn');
        if ($(mainParent).find('input.toggle-btn-checkbox').is(':checked')) {
            $(mainParent).addClass('active');
        } else {
            $(mainParent).removeClass('active');
        }
    });
});
function ApplyFilter(event, iSrcElement) {
    ListAllActivityLists();
    if (document.getElementById("filter_activityListName").value != "" || document.getElementById("filter_activityListDescription").value != "") {
        $("#id_clearFilterActionBar").css('display', 'inline');
    } else {
        $("#id_clearFilterActionBar").css('display', 'none');
    }
    hideFilter();
}
function ClearFilter(event, iSrcElement) {
    l_activityListFilter_model.ClearFilter();
    ListAllActivityLists();
    $("#id_clearFilterActionBar").css('display', 'none');
    hideFilter();
}
function hideFilter() {
    $("#id_activityListFilter").hide();
    document.getElementById("id_activityListFilter").setAttribute("apps-toggle", 'collapsed');
    $("#id_activityListData").removeClass("col-md-9");
    $("#id_activityListData").addClass("col-md-12");
}
function updateMandatoryConditions(iOrder) {
    $("#task_list_div").find('tr').css("background-color", "transparent")
    $("#task_list_div").find("[taskOrder=" + iOrder + "]").css("background-color", "#CBD3D9");

    if (!l_activity.tasks()[iOrder].name()) {
        $("#activitydetailsname").addClass("cc-error");
    } else {
        $("#activitydetailsname").removeClass("cc-error");
    }
    if (!l_activity.tasks()[iOrder].type()) {
        $("#activitydetailstype").addClass("cc-error");
    } else {
        $("#activitydetailstype").removeClass("cc-error");

        if (l_activity.tasks()[iOrder].type() == "STANDARD" || l_activity.tasks()[iOrder].type() == "APPROVAL") {
            if (!l_activity.tasks()[iOrder].assignmentType()) {
                $("#activitydetailsassignmenttype").addClass("cc-error");
            } else {
                $("#activitydetailsassignmenttype").removeClass("cc-error");
            }
            if (!l_activity.tasks()[iOrder].assignTo()) {
                $("#activitydetailsassignto").addClass("cc-error");
            } else {
                $("#activitydetailsassignto").removeClass("cc-error");
            }
        } else if (l_activity.tasks()[iOrder].type() == "STATE_TRANSITION") {
            if (!l_activity.tasks()[iOrder].transitStateTo()) {
                $("#activitydetailstransitStateTo").addClass("cc-error");
            } else {
                $("#activitydetailstransitStateTo").removeClass("cc-error");
            }
        } else if (l_activity.tasks()[iOrder].type() == "CUSTOM") {
            if (!l_activity.tasks()[iOrder].processName()) {
                $("#activityprocessname").addClass("cc-error");
            } else {
                $("#activityprocessname").removeClass("cc-error");
            }
            if (!l_activity.tasks()[iOrder].processName()) {
                $("#activityprocessname").addClass("cc-error");
            } else {
                $("#activityprocessname").removeClass("cc-error");
            }
        }
    }
}
function validateMandatoryFields() {
    var validationFlag = true;
    var st_count = 0;
    if (l_activity.name() == "") {
        $("#activityname").addClass("cc-error");
        validationFlag = false;
    }
    if (l_activity.tasks()) {
        for (var i = 0; i < l_activity.tasks().length; i++) {
            if (!l_activity.tasks()[i].type()) {
                if (!l_activity.tasks()[i].name() || !l_activity.tasks()[i].type()) {
                    $("[taskOrder=" + i + "]").addClass("cc-error");
                    validationFlag = false;
                } else {
                    $("[taskOrder=" + i + "]").removeClass("cc-error");
                }
            } else if (l_activity.tasks()[i].type() == "STANDARD" || l_activity.tasks()[i].type() == "APPROVAL") {
                if (!l_activity.tasks()[i].name() || !l_activity.tasks()[i].assignmentType() || !l_activity.tasks()[i].assignTo()) {
                    $("[taskOrder=" + i + "]").addClass("cc-error");
                    validationFlag = false;
                } else {
                    $("[taskOrder=" + i + "]").removeClass("cc-error");
                }
            } else if (l_activity.tasks()[i].type() == "STATE_TRANSITION") {
                st_count++;
                if (!l_activity.tasks()[i].name() || !l_activity.tasks()[i].type() || !l_activity.tasks()[i].transitStateTo() || !(i == l_activity.tasks().length - 1) || !(st_count <= 1)) {
                    validateStateTrans(st_count, i);
                    $("[taskOrder=" + i + "]").addClass("cc-error");
                    validationFlag = false;
                } else {
                    $("[taskOrder=" + i + "]").removeClass("cc-error");
                }
            }
            else if (l_activity.tasks()[i].type() == "CUSTOM") {
                if (!l_activity.tasks()[i].name() || !l_activity.tasks()[i].type() || !l_activity.tasks()[i].processName()) {
                    $("[taskOrder=" + i + "]").addClass("cc-error");
                    validationFlag = false;
                } else {
                    $("[taskOrder=" + i + "]").removeClass("cc-error");
                }
            }
        }
        return validationFlag;
    }
}
//function called while validating mandatory fields on create task list
function validateStateTrans(st_count, pos) {
    var error_message = "";
    if (st_count > 1) {
        error_message = "Only one state transition task must be present.";
    }
    else if (pos != l_activity.tasks().length - 1) {
        error_message = "The state transition task must be the last task in the list.";
    }
    showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage(error_message), 10000);
}

function createNewTask() {
    var task = new Task();
    task.type("");
    task.name("");
    //loadStatesforTask(task);
    // task.taskOrder(l_activity.tasks().length);
    // l_activity.selectedIndex(task.taskOrder());
    setActionToTask(task, 'CRT_ACT');
    l_activity.tasks.push(task);
    l_activity.selectedIndex(getTaskOrder(task));
    $("#task_list_div").find('tr').css("background-color", "transparent")
    $("#task_list_div").find("[taskOrder=" + getTaskOrder(task) + "]").css("background-color", "#CBD3D9");
    //$("label.cc-required").next().addClass("cc-error");
    //$("#activitydetailsassignto").addClass("cc-error");
    l_dirty_flag = true;
    translatePage();
}

function createActivityList() {
    if (validateMandatoryFields()) {
        var requestObj = formActivityListObject(l_activity, false);
        if (requestObj) {
            $.cordys.ajax({
                method: "CreateActivityCompleteDetails",
                namespace: "http://schemas.opentext.com/apps/cc/configworkflow/20.2",
                parameters: requestObj,
                success: function (responseSuccess) {
                    if (responseSuccess) {
                        $('#create_activity_modal').modal('hide');
                        successToast(3000, getTranslationMessage("Task list created."));
                        ListAllActivityLists();
                    } else {
                        showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while creating the task list. Contact your administrator."), 10000);
                    }
                },
                error: function (responseFailure) {
                    showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while creating the task list. Contact your administrator."), 10000);
                    return false;
                }
            });
        }
    }
}

function clearActivityList() {

    // Variables.
    l_activity.id = '';
    l_activity.itemId = '';
    l_activity.code = '';
    l_dirty_flag = false;

    // Observables.
    l_activity.name('');
    l_activity.description('');
    l_activity.status('');
    l_activity.selectedIndex(0);

    // Observable arrays.
    l_activity.tasks.removeAll();
    l_activity.deletedTasks.removeAll();
}

function saveActivityList() {
    if (l_activity) {
        if (l_activity.itemId) {
            updateActivityList();
        } else {
            createActivityList();
        }
    }
}

function updateActivityList() {
    if (validateMandatoryFields()) {
        var requestObj = formActivityListObject(l_activity, true);
        if (requestObj) {
            $.cordys.ajax({
                method: "UpdateActivityCompleteDetails",
                namespace: "http://schemas.opentext.com/apps/cc/configworkflow/20.2",
                parameters: requestObj,
                success: function (responseSuccess) {
                    if (responseSuccess) {
                        $('#create_activity_modal').modal('hide');
                        successToast(3000, getTranslationMessage("Task list updated."));
                        ListAllActivityLists();
                    } else {
                        showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while updating the task list. Contact your administrator."), 10000);
                    }
                },
                error: function (responseFailure) {
                    showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while updating the task list. Contact your administrator."), 10000);
                    return false;
                }
            });
        }
    }
}
function loadStatesforTask(i_ActivityListItemID) {
    function formParamsForReq(){
        let reqObj = {};
        const TLMetaDataKey = l_activityList_model.activityListType();
        reqObj.processName = TLMetaDataKey.PROCESS;
        reqObj.purpose = TLMetaDataKey.PURPOSE;

        return reqObj;
    }
    $.cordys.ajax({
        namespace: "http://schemas/OpenTextBasicComponents/GCProcess/operations",
        method: "GetGCProcessByNameAndPurpose",
        parameters: formParamsForReq(),
        success: function (data) {
            l_processItemID = "";
            if (data.GCProcess && data.GCProcess["GCProcess-id"] && data.GCProcess["GCProcess-id"].Id) {
                l_processItemID = data.GCProcess["GCProcess-id"].Id;
                $.cordys.ajax({
                    namespace: "http://schemas/OpenTextBasicComponents/GCProcess.RelatedGCState/operations",
                    method: "GetGCStatesByProcessIDAndPurpose",
                    parameters:
                    {
                        "processID": l_processItemID,
                        "purpose": l_activityList_model.activityListType().PURPOSE,
                    },
                    success: function (data) {
                        if (data.RelatedGCState) {
                            addDataToStateDropdown(data.RelatedGCState, l_activity);
                        }
                        if(i_ActivityListItemID){
                            loadActivityDetails(i_ActivityListItemID);
                        }
                    },
                    error: function (responseFailure) {
                        showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while loading the contract states. Contact your administrator."), 10000);
                        return false;
                    }
                });
            }
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while loading the activity data. Contact your administrator."), 10000);
            return false;
        }
    });
}
function addDataToStateDropdown(iElementList, iModel) {
    iModel.statesOfSelectedProcess.removeAll();
    iModel.statesOfSelectedProcess.push({ "GCStateID": defaultIDforSelectDropdown, "GCStateName": getTranslationMessage("-Select-") });
    if (iElementList) {
        if (iElementList.length) {
            iElementList.forEach(function (iElement) {
                iModel.statesOfSelectedProcess.push({ "GCStateID": iElement["RelatedGCState-id"].Id1, "GCStateName": iElement.Name, selected: false });
            });
        }
        else {
            iModel.statesOfSelectedProcess.push({ "GCStateID": iElementList["RelatedGCState-id"].Id1, "GCStateName": iElementList.Name, selected: false });
        }
    }
    
}
function loadActivityDetails(itemId) {
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/configworkflow/20.2",
        method: "GetActivityCompleteDetails",
        parameters: { "ItemID": itemId },
        success: function (data) {
            addDataToDetailsView(data, l_activity);
            //$("#id_activityListModalType").text("Edit " + data.ActivityList.Name);
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while loading the task list details. Contact your administrator."), 10000);
            return false;
        }
    });
}
function addDataToDetailsView(i_Element, i_activity) {
    var taskList = [];
    if (i_Element && i_activity) {
        if (i_Element.ActivityList) {
            i_activity.name(i_Element.ActivityList.Name);
            i_activity.description(i_Element.ActivityList.Description);
            i_activity.status(i_Element.ActivityList.Status);
            i_activity.code = i_Element.ActivityList.Code;
            i_activity.id = i_Element.ActivityList['ActivityList-id'].Id;
            i_activity.itemId = i_Element.ActivityList['ActivityList-id'].ItemId;
        }
        var usersList = [];
        var rolesList = [];
		var groupsList = [];
        if (i_Element.Roles) {
            var i_elementList = i_Element.Roles.Role;
            if (i_elementList) {
                if (i_elementList.length) {
                    for (var i = 0; i < i_elementList.length; i++) {
                        var role = formRoleDetails(i_elementList[i]);
                        if (role) {
                            rolesList[role.itemId] = role;
                        }
                    }
                }
                else {
                    var role = formRoleDetails(i_elementList);
                    if (role) {
                        rolesList[role.itemId] = role;
                    }
                }
            }
        }
        if (i_Element.Users) {
            var i_elementList = i_Element.Users.User;
            if (i_elementList) {
                if (i_elementList.length) {
                    for (var i = 0; i < i_elementList.length; i++) {
                        var user = formUserDetails(i_elementList[i]);
                        if (user) {
                            usersList[user.itemId] = user;
                        }
                    }
                }
                else {
                    var user = formUserDetails(i_elementList);
                    if (user) {
                        usersList[user.itemId] = user;
                    }
                }
            }
        }
		if (i_Element.Groups) {
            var i_elementList = i_Element.Groups.Group;
            if (i_elementList) {
                if (i_elementList.length) {
                    for (var i = 0; i < i_elementList.length; i++) {
                        var group = formGroupDetails(i_elementList[i]);
                        if (group) {
                            groupsList[group.itemId] = group;
                        }
                    }
                }
                else {
                    var group = formGroupDetails(i_elementList);
                    if (group) {
                        groupsList[group.itemId] = group;
                    }
                }
            }
        }
        if (i_Element.Activities) {
            var i_elementList = i_Element.Activities.Activity;
            if (i_elementList) {
                if (i_elementList.length) {
                    for (var i = 0; i < i_elementList.length; i++) {
                        var task = formTaskDetails(i_elementList[i], usersList, rolesList, groupsList);
                        if (task) {
                            taskList[task.itemId] = task;
                        }
                    }
                }
                else {
                    var task = formTaskDetails(i_elementList, usersList, rolesList, groupsList);
                    if (task) {
                        taskList[task.itemId] = task;
                    }
                }
            }
        }
        if (i_Element.ContainingActivitiesList) {
            var i_elementList = i_Element.ContainingActivitiesList.ContainingActivities;
            if (i_elementList) {
                if (i_elementList.length) {
                    for (var i = 0; i < i_elementList.length; i++) {
                        if (i_elementList[i].ContaningActivity && i_elementList[i].ContaningActivity['Activity-id'] &&
                            i_elementList[i].ContaningActivity['Activity-id'].ItemId) {
                            var activityItemId = i_elementList[i].ContaningActivity['Activity-id'].ItemId;
                            var i_task = taskList[activityItemId];
                            formTaskOrderDetails(i_elementList[i], i_task);
                        }
                    }
                }
                else {
                    if (i_elementList.ContaningActivity && i_elementList.ContaningActivity['Activity-id'] &&
                        i_elementList.ContaningActivity['Activity-id'].ItemId) {
                        var activityItemId = i_elementList.ContaningActivity['Activity-id'].ItemId;
                        var i_task = taskList[activityItemId];
                        formTaskOrderDetails(i_elementList, i_task);

                    }
                }
                //  taskList.sort(compare);
                //var taskItems = Object.values(taskList);
                var taskItems = Object.keys(taskList).map(function (e) {
                    return taskList[e]
                })
                taskItems.sort(compare);
                for (var i = 0; i < taskItems.length; i++) {
                    l_activity.tasks.push(taskItems[i]);
                }
                if (l_activity.tasks().length > 0) {
                    updateMandatoryConditions(l_activity.selectedIndex());
                }
                for (var i = 0; i < l_activity.tasks().length; i++) {
                    // Making ready for tracking changes.
                    l_activity.tasks()[i]._initialized(true);
                }

            }
        }
    }
    translatePage();
}

function formTaskDetails(iElement, usersList, rolesList, groupsList) {
    if (iElement) {
        var task = new Task();
        //loadStatesforTask(task);
        task.name(iElement.Name);
        task.description(iElement.Description);
        task.type(iElement.TypeOfActivity);
        task.dueDays(iElement.DueIn);
        if (iElement.TypeOfActivity == "STANDARD" || iElement.TypeOfActivity == "APPROVAL") {
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

            }
			 else if (iElement.AssignmentType == "GROUP" && iElement.AssignedToGroup) {
                var group = groupsList[iElement.AssignedToGroup["Identity-id"].ItemId];
                if (group) {
                    task.assignTo(group.itemId);
                    task.assignToName(group.name);
                }

            }
            task.escalationType(iElement.EscalationType);
            if (iElement.EscalationType == "INDIVIDUAL" && iElement.EscalatedToUser) {
                var user = usersList[iElement.EscalatedToUser["Identity-id"].ItemId];
                if (user) {
                    task.escalateTo(user.itemId);
                    task.escalateToName(user.name);
                }
            } else if (iElement.EscalationType == "ROLE" && iElement.EscalatedToRole) {
                var role = rolesList[iElement.EscalatedToRole["Identity-id"].ItemId];
                if (role) {
                    task.escalateTo(role.itemId);
                    task.escalateToName(role.name);
                }
            }else if (iElement.AssignmentType == "GROUP" && iElement.EscalatedToGroup) {
                var group = groupsList[iElement.EscalatedToGroup["Identity-id"].ItemId];
                if (group) {
                    task.escalateTo(group.itemId);
                    task.escalateToName(group.name);
                }

            }
        }
        if (iElement.TypeOfActivity == "STATE_TRANSITION") {
            if (iElement.TransitToGCState != undefined) {
                task.transitStateTo(iElement.TransitToGCState["RelatedGCState-id"].Id1);
            } else {
                l_activity.statesOfSelectedProcess().forEach(function (iState) {
                    if (iState.GCStateName == iElement.TransitStateTo) {
                        task.transitStateTo(iState.GCStateID);
                    }
                });
            }
        }

        if (iElement.TypeOfActivity == "CUSTOM") {
            task.processName(iElement.ProcessName);
        }
        task.id = iElement['Activity-id'].Id;
        task.itemId = iElement['Activity-id'].ItemId;
        return task;
    }
}

function formTaskOrderDetails(iElement, i_task) {
    if (iElement && i_task) {
        i_task.taskOrder = parseInt(iElement.Order);
        i_task.containingActivityCode = iElement.Code;
        i_task.containingActivityId = iElement['ContainingActivities-id'].Id1;
        i_task.containingActivityItemId = iElement['ContainingActivities-id'].ItemId1;
    }
}

function formActivityListObject(activityListObj, isUpdate) {
    if (activityListObj) {
        var properties = {};
        var resultObj = {};
        properties.Name = activityListObj.name();
        properties.Description = activityListObj.description();
        properties.ActivityListType = l_activityList_model.activityListType().VALUE;
        if (activityListObj.status()) {
            properties.Status = activityListObj.status();
        }
        if (activityListObj.tasks()) {
            var tasks = [];
            for (var i = 0; i < activityListObj.tasks().length; i++) {
                if (activityListObj.tasks()[i] && activityListObj.tasks()[i].dirtyFlag()) {
                    setActionToTask(activityListObj.tasks()[i], 'UPD_ACT');
                }
                tasks[i] = formTaskRequest(activityListObj.tasks()[i], isUpdate);
            }
            properties.Activities = tasks;
        }
        if (isUpdate) {
            properties.Id = activityListObj.id;
            properties.ItemId = activityListObj.itemId;

            if (activityListObj.deletedTasks().length > 0) {
                var deletedTasks = [];
                for (var i = 0; i < activityListObj.deletedTasks().length; i++) {
                    deletedTasks.push(formDeleteTask(activityListObj.deletedTasks()[i]));
                }
                resultObj.DeletedActivities = deletedTasks;
            }
        }
        resultObj.ActivityList = properties;
        return resultObj;
    }
}

// Task is activity.
function formTaskRequest(i_task, isUpdate) {
    var properties = {};

    // Common properties.
    properties.Order = getTaskOrder(i_task);
    properties.TypeOfActivity = i_task.type();
    properties.Name = i_task.name();
    properties.Description = i_task.description();
    if (i_task.type() == "STANDARD" || i_task.type() == "APPROVAL") {
        properties.AssignmentType = i_task.assignmentType();
        if (i_task.assignmentType() == "INDIVIDUAL") {
            properties.AssignToUser = i_task.assignTo();
            properties.AssignToRole = "";
			properties.AssignToGroup = "";
        } else if (i_task.assignmentType() == "ROLE") {
            properties.AssignToUser = "";
            properties.AssignToRole = i_task.assignTo();
			properties.AssignToGroup = "";
        } else if (i_task.assignmentType() == "GROUP") {
            properties.AssignToUser = "";
            properties.AssignToRole = "";
			properties.AssignToGroup = i_task.assignTo();
        }
        properties.DueIn = i_task.dueDays();
        properties.EscalationType = i_task.escalationType();
        if (i_task.escalationType() == "INDIVIDUAL") {
            properties.EscalateToUser = i_task.escalateTo();
            properties.EscalateToRole = "";
			properties.EscalateToGroup = "";
        } else if (i_task.escalationType() == "ROLE") {
            properties.EscalateToUser = "";
            properties.EscalateToRole = i_task.escalateTo();
			properties.EscalateToGroup = "";
        } else if (i_task.escalationType() == "GROUP") {
            properties.EscalateToUser = "";
            properties.EscalateToRole = "";
			properties.EscalateToGroup = i_task.escalateTo();
        }
    } else if (i_task.type() == "STATE_TRANSITION") {
        properties.TransitStateTo = i_task.transitStateTo();
        properties.RelatedGCProcess = l_processItemID;
    } else if (i_task.type() == "CUSTOM") {
        properties.ProcessName = i_task.processName();
    }

    // Update properties.
    if (isUpdate) {
        properties.Id = i_task.id;
        properties.ItemId = i_task.itemId;
        properties.ContainingId = i_task.containingActivityId;
        properties.ContainingItemId = i_task.containingActivityItemId;
        properties["@action"] = i_task.action;
    }
    var activity = {};
    activity.Activity = properties;
    return activity;
}
function removeErrorClass(iEvent) {
    $(iEvent).removeClass("cc-error");
}

function compare(a, b) {
    if (a.taskOrder < b.taskOrder) {
        return -1;
    }
    if (a.taskOrder > b.taskOrder) {
        return 1;
    }
    return 0;
}
function hideOrShowFilterBody(iElement, iShow) {
    if (iShow) {
        iElement.setAttribute("apps-toggle", 'expanded');
        iElement.lastElementChild.src = "../../../../../com/opentext/apps/utils/img/caret_up.svg";
    }
    else {
        iElement.setAttribute("apps-toggle", 'collapsed');
        iElement.lastElementChild.src = "../../../../../com/opentext/apps/utils/img/caret_down.svg";
    }
}
function openUserOrRoleSelectionModal(iSelectionType, iElement) {
    l_element = iElement;
    if (iSelectionType == "ASSIGNMENT") {
        if (l_activity.tasks()[l_activity.selectedIndex()].assignmentType() == "INDIVIDUAL") {
            $("#selectIndividualModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            ListAllUsers();
            $('button#selectIndividualYes').off("click");
            $('button#selectIndividualYes').on('click', function (_event) {
                l_activity.tasks()[l_activity.selectedIndex()].assignTo(l_usersList_model.selectedUserItemID())
                l_activity.tasks()[l_activity.selectedIndex()].assignToName(l_usersList_model.selectedUserName())
                $(l_element.parentElement.previousElementSibling).removeClass("cc-error")
            });
        } else if (l_activity.tasks()[l_activity.selectedIndex()].assignmentType() == "ROLE") {
            $("#selectRoleModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            ListAllRoles();
            $('button#selectRoleYes').off("click");
            $('button#selectRoleYes').on('click', function (_event) {
                l_activity.tasks()[l_activity.selectedIndex()].assignTo(l_rolesList_model.selectedRoleItemID())
                l_activity.tasks()[l_activity.selectedIndex()].assignToName(l_rolesList_model.selectedRoleName())
                $(l_element.parentElement.previousElementSibling).removeClass("cc-error")
            });
        } else if (l_activity.tasks()[l_activity.selectedIndex()].assignmentType() == "GROUP") {
            $("#selectGroupModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            ListAllGroups();
            $('button#selectGroupYes').off("click");
            $('button#selectGroupYes').on('click', function (_event) {
                l_activity.tasks()[l_activity.selectedIndex()].assignTo(l_groupsList_model.selectedGroupItemID())
                l_activity.tasks()[l_activity.selectedIndex()].assignToName(l_groupsList_model.selectedGroupName())
                $(l_element.parentElement.previousElementSibling).removeClass("cc-error")
            });
        }
    } else if (iSelectionType == "ESCALATION") {
        if (l_activity.tasks()[l_activity.selectedIndex()].escalationType() == "INDIVIDUAL") {
            $("#selectIndividualModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            ListAllUsers();
            $('button#selectIndividualYes').off("click");
            $('button#selectIndividualYes').on('click', function (_event) {
                l_activity.tasks()[l_activity.selectedIndex()].escalateTo(l_usersList_model.selectedUserItemID())
                l_activity.tasks()[l_activity.selectedIndex()].escalateToName(l_usersList_model.selectedUserName())
            });
        } else if (l_activity.tasks()[l_activity.selectedIndex()].escalationType() == "ROLE") {
            $("#selectRoleModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            ListAllRoles();
            $('button#selectRoleYes').off("click");
            $('button#selectRoleYes').on('click', function (_event) {
                l_activity.tasks()[l_activity.selectedIndex()].escalateTo(l_rolesList_model.selectedRoleItemID())
                l_activity.tasks()[l_activity.selectedIndex()].escalateToName(l_rolesList_model.selectedRoleName())
            });
        } else if (l_activity.tasks()[l_activity.selectedIndex()].escalationType() == "GROUP") {
            $("#selectGroupModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            ListAllGroups();
            $('button#selectGroupYes').off("click");
            $('button#selectGroupYes').on('click', function (_event) {
                l_activity.tasks()[l_activity.selectedIndex()].escalateTo(l_groupsList_model.selectedGroupItemID())
                l_activity.tasks()[l_activity.selectedIndex()].escalateToName(l_groupsList_model.selectedGroupName())
                $(l_element.parentElement.previousElementSibling).removeClass("cc-error")
            });
        }
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
function ListAllUsers() {
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
            addDataToUsersView(data.OrgMembers.FindZ_INT_OrgUsersListResponse.OrganizationMembers, l_usersList_model);
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
function addDataToUsersView(iElementList, iModel) {
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
function formDeleteTask(i_task) {
    var properties = {};
    if (i_task.containingActivityItemId) {
        var activity = {};
        properties.Id = i_task.id;
        properties.ItemId = i_task.itemId;
        properties.ContainingItemId = i_task.containingActivityItemId;
        properties.ContainingId = i_task.containingActivityId;
        activity.Activity = properties;
        return activity;
    }
}

function setActionToTask(i_task, action) {
    if (i_task && action) {
        if (!i_task.action) {
            i_task.action = action;
        } else if (action == i_task.action || i_task.action == 'CRT_ACT') {
        } else {
            if ((i_task.action == 'UPD_ACT' && action == 'UPD_ORD')
                || (i_task.action == 'UPD_ORD' && action == 'UPD_ACT')) {
                i_task.action = 'UPD_ACT_AND_ORD';
            }
        }
    }
}

function getTaskOrder(i_task) {
    return l_activity.tasks().indexOf(i_task);
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

function formUserDetails(iElement) {
    if (iElement) {
        var user = new User();
        user.id = iElement['Identity-id'].Id;
        user.itemId = iElement['Identity-id'].ItemId;
        user.name = (iElement.Name && iElement.Name.text) ? iElement.Name.text : iElement.Name;
        return user;
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

function formItemDetails(iElement) {
    if (iElement) {
        var item = new Item();
        item.id = iElement['Identity-id'].Id;
        item.itemId = iElement['Identity-id'].ItemId;
        item.name = (iElement.Name && iElement.Name.text) ? iElement.Name.text : iElement.Name;
        return item;
    }

}
function clearAssignTo(iEvent) {
    l_activity.tasks()[l_activity.selectedIndex()].assignTo("");
    l_activity.tasks()[l_activity.selectedIndex()].assignToName("");
    removeErrorClass(iEvent);
}
function clearEscalateTo(iEvent) {
    l_activity.tasks()[l_activity.selectedIndex()].escalateTo("");
    l_activity.tasks()[l_activity.selectedIndex()].escalateToName("");
}


//DOM Manipulation methods
function toggleAllTabs(){
    $("#div_activityListTabs").toggle();
    if($("#div_activityListTabs").is(":hidden")){
        $("#list_form_container").removeClass("col-md-10").addClass("col-md-12");
        $("#id_caret-icon").removeClass('caretup-icon rtl-caretdown-icon').addClass('caretdown-icon rtl-caretup-icon');
    }else{
        $("#list_form_container").removeClass("col-md-12").addClass("col-md-10");
        $("#id_caret-icon").removeClass('caretdown-icon rtl-caretup-icon').addClass('caretup-icon rtl-caretdown-icon');
    }
}

function hasDefaultImportedItem(){
    const activityLists = l_activityList_model.ActivityLists();
	
	const filteredItems = activityLists.filter(item => {
	  return (
		item.CreationType === "DEFAULT-IMPORTED" &&
		selectedActivityListMap[item["ActivityList-id"].ItemId]
	  );
	});

	return filteredItems.length > 0;

}