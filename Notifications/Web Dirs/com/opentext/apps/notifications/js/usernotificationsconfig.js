$.cordys.json.defaults.removeNamespacePrefix = true;


// Services start----------------------------------------------
var cc_notification_services = (function () {
    var self = {};

    self.createOrUpdateUserConfigNotificService = function (request, responseCallback) {
        $.cordys.ajax({
            method: "createOrUpdateUserConfigNotific",
            namespace: "http://schemas.cordys.com/apps/notifications/18.4",
            parameters: request,
            success: function (responseSuccess) {
                responseCallback(responseSuccess);
            },
            error: function (responseFailure) {
                responseCallback(responseFailure, "ERROR");
                return false;
            }
        });
    };

    self.getUserNotificationConfig = function (request, responseCallback) {
        $.cordys.ajax({
            method: "getUserNotificationConfig",
            namespace: "http://schemas.cordys.com/apps/notifications/18.4",
            parameters: request,
            success: function (responseSuccess) {
                responseCallback(responseSuccess);
            },
            error: function (responseFailure) {
                responseCallback(responseFailure, "ERROR");
                return false;
            }
        });
    };



    self.getAllProcessListService = function (request, responseCallback) {
        $.cordys.ajax({
            method: "findAllProcess",
            namespace: "http://schemas/OpenTextNotifications/Process/operations",
            parameters: request,
            success: function (responseSuccess) {
                responseCallback(responseSuccess);
            },
            error: function (responseFailure) {
                responseCallback(responseFailure, "ERROR");
                return false;
            }
        });
    };

    self.getAllAccessibleProcessService = function (request, responseCallback) {
        $.cordys.ajax({
            method: "getAccessibleProcess",
            namespace: "http://schemas.cordys.com/apps/notifications/18.4",
            parameters: request,
            success: function (responseSuccess) {
                responseCallback(responseSuccess);
            },
            error: function (responseFailure) {
                responseCallback(responseFailure, "ERROR");
                return false;
            }
        });
    };

    self.getConfiguratorListService = function (request, responseCallback) {
        $.cordys.ajax({
            method: "getConfiguratorList",
            namespace: "http://schemas.cordys.com/apps/notifications/18.4",
            parameters: request,
            success: function (responseSuccess) {
                responseCallback(responseSuccess);
            },
            error: function (responseFailure) {
                responseCallback(responseFailure, "ERROR");
                return false;
            }
        });
    };


    self.getActionsFilteredListService = function (request, responseCallback) {
        $.cordys.ajax({
            method: "getActionsFilteredList",
            namespace: "http://schemas.cordys.com/apps/notifications/18.4",
            parameters: request,
            success: function (responseSuccess) {
                responseCallback(responseSuccess);
            },
            error: function (responseFailure) {
                responseCallback(responseFailure, "ERROR");
                return false;
            }
        });
    }
    self.getTemplatesFilteredListService = function (request, responseCallback) {
        $.cordys.ajax({
            method: "getEmailTemplList",
            namespace: "http://schemas.cordys.com/apps/notifications/18.4",
            parameters: request,
            success: function (responseSuccess) {
                responseCallback(responseSuccess);
            },
            error: function (responseFailure) {
                responseCallback(responseFailure, "ERROR");
                return false;
            }
        });
    }

    self.getProcessStateFilteredListService = function (request, responseCallback) {
        $.cordys.ajax({
            method: "getProcessFilterState",
            namespace: "http://schemas.cordys.com/apps/notifications/18.4",
            parameters: request,
            success: function (responseSuccess) {
                responseCallback(responseSuccess);
            },
            error: function (responseFailure) {
                responseCallback(responseFailure, "ERROR");
                return false;
            }
        });
    }

    self.getAllUserRolesFilteredListService = function (request, responseCallback) {
        $.cordys.ajax({
            method: "GetAllRoles",
            namespace: "http://schemas/OpenTextEntityIdentityComponents/Role/operations",
            parameters: request,
            success: function (responseSuccess) {
                responseCallback(responseSuccess);
            },
            error: function (responseFailure) {
                responseCallback(responseFailure, "ERROR");
                return false;
            }
        });
    }

    self.createOrUpdateConfiguratorService = function (request, responseCallback) {
        $.cordys.ajax({
            method: "createOrUpdateConfigDetails",
            namespace: "http://schemas.cordys.com/apps/notifications/18.4",
            parameters: request,
            success: function (responseSuccess) {
                responseCallback(responseSuccess);
            },
            error: function (responseFailure) {
                responseCallback(responseFailure, "ERROR");
                return false;
            }
        });
    }

    self.getConfiguratorDetailService = function (request, responseCallback) {
        $.cordys.ajax({
            method: "getConfiguratorDisplayDetails",
            namespace: "http://schemas.cordys.com/apps/notifications/18.4",
            parameters: request,
            success: function (responseSuccess) {
                responseCallback(responseSuccess);
            },
            error: function (responseFailure) {
                responseCallback(responseFailure, "ERROR");
                return false;
            }
        });
    };

    self.deleteConfigListService = function (request, responseCallback) {
        $.cordys.ajax({
            method: "deleteConfigList ",
            namespace: "http://schemas.cordys.com/apps/notifications/18.4",
            parameters: request,
            success: function (responseSuccess) {
                responseCallback(responseSuccess);
            },
            error: function (responseFailure) {
                responseCallback(responseFailure, "ERROR");
                return false;
            }
        });
    };

    return self;
})();

// Services end------------------------------------------------


//Gloabal variables, Static Data


const filterList = [
    { key: '--Select--', val: '' },
    { key: 'Equal to', val: 'EQUALTO' },
    { key: 'Range', val: 'RANGE' },
    { key: 'Not equal to', val: 'NOTEQUALTO' },
    { key: 'Contains', val: 'CONTAINS' },
    { key: 'Empty', val: 'EMPTY' },
    { key: 'Not empty', val: 'NOTEMPTY' },
    { key: 'Any of(;)', val: 'ANYOF' }
];

const defaultFilterVal = "CONTAINS";

const defaultPerPage = 25;
const listPerPageArr = [
    { key: 0, val: "Show all" },
    { key: 100, val: "100 per page" },
    { key: 50, val: "50 per page" },
    { key: 25, val: "25 per page" }];

const OBLIGATION_MANAGEMENT = "Obligation management";
const subNavList = ["Actions", "State transitions"];
const subNavActions = ["Actions"];
const leftNavList = [{ Name: "Contract management", SubNav: subNavList, expandSection: true }, { Name: "Contract request", SubNav: subNavList, expandSection: false }, 
{ Name: "Clause management", SubNav: subNavList, expandSection: false }, { Name: "Template management", SubNav: subNavList, expandSection: false },{ Name: "Obligation management", SubNav: subNavList, expandSection: false }];
const defaultSubScreen = "Actions";
const defaultMainScreen = "Contract management";

function UserNotifiConfigNavModel() {
    var self = this;
    // self.leftNavList = ko.mapping.fromJS(leftNavList);
    self.leftNavList = ko.observableArray(); //ko.mapping.fromJS(leftNavList);
    // self.selectedMainScreen = ko.observable(defaultMainScreen);
    self.selectedMainScreen = ko.observable(defaultMainScreen);
    self.selectedSubScreen = ko.observable(defaultSubScreen);

    self.toggleLeftNavSection = function (data, event) {
        data.expandSection(!data.expandSection());
    };

    self.selectSection = function (data, subScreen) {
        _refreshDatatable(data.Name(), subScreen);
    };

    function _refreshDatatable(mainScren, subScreen) {
        self.selectedMainScreen(mainScren);
        self.selectedSubScreen(subScreen);
        displayConfigListScreen();
        l_UserNotifiConfigSubListModel.selectSubScreen(mainScren, subScreen);
    }

}

function UserNotifiConfigSubListModel() {
    var self = this;
    self.displayScreen = ko.observable(true);
    self.selectedMainScreen = ko.observable(defaultMainScreen);
    self.selectedSubScreen = ko.observable(defaultSubScreen);
	self.isConfigChanged = ko.observable(false);
	

    self.filterExpand = ko.observable(false);
    self.filterAction = ko.observable(defaultFilterVal);
    self.filterOptions = ko.observableArray(filterList);
    self.userconfigList = ko.observableArray();

    self.filterActionInput = ko.observable();
    self.filterStateInput = ko.observable();
    self.filterToStateInput = ko.observable();
    self.filterFromStateInput = ko.observable();
    self.filterEmailTemplateInput = ko.observable();

    self.filterActionExpand = ko.observable(true);
    self.filterStateExpand = ko.observable(true);
    self.filterToStateExpand = ko.observable(true);
    self.filterFromStateExpand = ko.observable(true);
    self.filterEmailTemplateExpand = ko.observable(true);

    self.isNewUserConfig = ko.observable(false);


    self.allProcessList = ko.observableArray();


    //Pagination START
    self.totalListsCount = ko.observable(0);
    self.currentPage = ko.observable(1);
    self.hideDecrement = ko.observable(false);
    self.hideIncrement = ko.observable(false);

    filterList.forEach(function (iElement) {
        // iElement.key = getTranslationMessage(iElement.key);
    });

    self.decrementToLast = function () {
        self.currentPage(1);
        self.hideDecrement(true);
        self.hideIncrement(false);
        self.refreshTable(_populateConfigListFilterRequest());
    }
    self.decrementOffsetLimit = function () {
        if (self.currentPage() > 1) {
            self.currentPage(self.currentPage() - 1);
        }
        if (self.currentPage() < Math.ceil(self.totalListsCount() / defaultPerPage)) {
            self.hideIncrement(false);
        }
        if (self.currentPage() == 1) {
            self.hideDecrement(true);
        }
        if (self.currentPage() < 1) {
            return;
        }
        self.refreshTable(_populateConfigListFilterRequest());
    }

    self.incrementOffsetLimit = function () {
        if (self.currentPage() < Math.ceil(self.totalListsCount() / defaultPerPage)) {
            self.currentPage(self.currentPage() + 1);
        }
        if (self.currentPage() == Math.ceil(self.totalListsCount() / defaultPerPage)) {
            self.hideIncrement(true);
        }
        if (self.currentPage() > 1) {
            self.hideDecrement(false);
        }
        self.refreshTable(_populateConfigListFilterRequest());
    }

    self.incrementToLast = function () {
        self.currentPage(Math.ceil(self.totalListsCount() / defaultPerPage));
        self.hideDecrement(false);
        self.hideIncrement(true);
        self.refreshTable(_populateConfigListFilterRequest());
    }
    //Pagination END

    self.openFilter = function () {
        self.filterExpand(!self.filterExpand());
        if (!self.filterExpand()) {
            self.ClearFilter();
        };
    };

    self.ApplyFilter = function (data, event) {
        var filterParams = _populateConfigListFilterRequest();
        filterParams.applyFilter = true;
        _populateConfigApplyFilter(filterParams);
        _defaultPagination();
        self.refreshTable(filterParams);
    }

    function _populateConfigApplyFilter(iRequest) {
        if (self.selectedSubScreen() === defaultSubScreen) {
            iRequest.StateName = self.filterStateInput();
            iRequest.ActionName = self.filterActionInput();
        } else {
            iRequest.FromState = self.filterFromStateInput();
            iRequest.ToState = self.filterToStateInput();
        }
        return iRequest;
    }

    self.ClearFilter = function (data, event) {
        self.filterExpand(false);
        _clearFilterInputs();
        _defaultPagination();
        self.refreshTable(_populateConfigListFilterRequest());
    };

    function _clearFilterInputs() {
        self.filterActionInput("");
    };

    function _defaultPagination() {
        self.currentPage(1);
        self.totalListsCount(0);
        self.currentPage(1);
        self.hideDecrement(false);
        self.hideIncrement(false);
    };

    self.selectSubScreen = function (mainScren, subScreen) {
        self.userconfigList.removeAll();
        _defaultPagination();
        self.selectedSubScreen(subScreen);
        self.selectedMainScreen(mainScren);
        self.refreshTable(_populateConfigListFilterRequest());
    };

    self.loadEditDetails = function (data, event) {
    };

    function _populateConfigListFilterRequest() {
        return {
            "isStateTransition": self.selectedSubScreen() === defaultSubScreen ? "false" : "true",
            "processName": self.selectedMainScreen()
        };
    }

    self.refreshCurrentTable = function () {
        self.refreshTable(_populateConfigListFilterRequest());
		self.isConfigChanged(false);
    };

    self.refreshTable = function (params) {
        var offset = (self.currentPage() - 1) * defaultPerPage;
        self.fetchConfiguratorList(offset, defaultPerPage, params);
    };

    self.fetchConfiguratorList = function (offset, limit, params) {
        cc_notification_services.getUserNotificationConfig(_populateConfiguratorRequest(offset, limit, params), function (response_data, status) {
            if (status !== "ERROR") {
                _populateRowDatatable(offset, response_data);
            } else {

            }
        });
    };

    self.saveUserNotifiConfig = function () {
        self.isConfigChanged(false);
        var request = _prepareRequestData();
        if (request.newUserConfig.length > 0 || request.configList.length > 0) {
            cc_notification_services.createOrUpdateUserConfigNotificService(request, function (response_data, status) {
				if(status!="ERROR"){
					successToast(2000, getTranslationMessage("Changes saved successfully"));
					self.refreshTable(_populateConfigListFilterRequest());
					self.isConfigChanged(false);
				}
				else{
                    self.isConfigChanged(true);
					 showOrHideErrorInfo("div_listErrorInfoArea", true, getTranslationMessage("An error occurred while updating notification preferences. Contact your administrator."), 5000);
				}
            });
        }
    };

    self.toggleEmailCheckBox = function (data, event) {
        data.emailEnabled(!data.emailEnabled());
        data.isDirty(true);
		self.isConfigChanged(true);
    };

    function _prepareRequestData() {
        var reqData = { newUserConfig: [], configList: [] };
        if (self.isNewUserConfig()) {
            for (let index = 0; index < self.userconfigList().length; index++) {
                var element = self.userconfigList()[index];
                if (!element.emailEnabled()) {
                    reqData.configList.push(_populateConfigRow(element));
                }
            }
        } else {
            for (let index = 0; index < self.userconfigList().length; index++) {
                var element = self.userconfigList()[index];
                if (element.isDirty()) {
                    reqData.configList.push(_populateConfigRow(element));
                }
            }
        }
        return reqData;
    };

    function _populateConfigRow(iElement) {
        var config = {};
        config.ProcessId = iElement.ProcessId();
        config.Id = iElement.Id();
        config.Id1 = iElement.Id1();
        config.emailEnabled = iElement.emailEnabled() ? "TRUE" : "FALSE";
        config.inAppEnabled = iElement.inAppEnabled();
        return config;
    }

    function _populateConfiguratorRequest(offset, limit, params) {
        if (!params) {
            params = {};
        }
        params["processName"] = self.selectedMainScreen();
        params["isStateTransition"] = self.selectedSubScreen() === "Actions" ? "false" : "true";
        return params;
    };

    function _toggleDeleteButton() {
        var count = 0;
        self.userconfigList().forEach(ele => ele.deleteSelected() ? (count++) : 0);
        if (count > 0) {
            document.getElementById("id_deleteConfigListActionBar").classList.remove("hidden");
        } else {
            document.getElementById("id_deleteConfigListActionBar").classList.add("hidden");
        }
    }

    function _populateRowDatatable(offset, response_data) {
        if (response_data.ProcessRegResponse) {
            var dataList = !_isStateTransition() ? response_data.ProcessRegResponse.getActionsFilteredListResponse.actionsResponse.FindZ_INT_ActionsListResponse.RelatedActions : response_data.ProcessRegResponse.getProcessFilterStateResponse.FilterResponse.FindZ_INT_RelatedProcessStatesResponse.RelatedProcessState;
            self.userconfigList.removeAll();
            self.isNewUserConfig(true);
            if (Array.isArray(dataList)) {
                for (var i = 0; i < dataList.length; i++) {
                    self.userconfigList.push(ko.mapping.fromJS(_populateNewUserConfigData(dataList[i])));
                }
            }
        } else if (response_data.UserNotifConfigResponse) {
            var dataList = response_data.UserNotifConfigResponse.FindZ_INT_UserNotificationConfigListResponse.RelatedNotificationConfig;
            self.userconfigList.removeAll();
            self.isNewUserConfig(false);
            if (Array.isArray(dataList)) {
                for (var i = 0; i < dataList.length; i++) {
                    self.userconfigList.push(ko.mapping.fromJS(_populateUserConfigData(dataList[i])));
                }
            }
        } else {
            self.userconfigList.removeAll();
        }

    };

    function _isStateTransition() {
        return self.selectedSubScreen() === defaultSubScreen ? false : true;
    }


    self.fetchAllProcess = function () {
        if (self.allProcessList().length <= 0) {
            cc_notification_services.getAllProcessListService({}, function (response_data, status) {
                // console.log(response_data);
                cc_notification_services.getAllAccessibleProcessService({}, function (response_data1, status1) {
                    if (status !== "ERROR" && status1 !== "ERROR") {
                        var processList = response_data.Process;
                        var accessableProcessArr = _getTextValue(response_data1.Response).split(",");
                        for (let index = 0; index < processList.length; index++) {
                            const element = processList[index];
                            if (accessableProcessArr.indexOf(element.Name) > -1){
                            // && ("Obligation management" !== element.Name)) {
                                let subTabs = (OBLIGATION_MANAGEMENT == element.Name) ? subNavActions : subNavList;
                                self.allProcessList.push(_populateProcessResponseData(ko.mapping.fromJS(element)));
                                l_UserNotifiConfigNavModel.leftNavList.push(ko.mapping.fromJS({ Name: element.Name, SubNav: subTabs, expandSection: index === 0 ? true : false }));
                            }
                        }
                        l_UserNotifiConfigNavModel.selectedMainScreen(l_UserNotifiConfigNavModel.leftNavList()[0].Name());
                        self.selectedMainScreen(l_UserNotifiConfigNavModel.leftNavList()[0].Name());
                        self.fetchConfiguratorList(self.currentPage() - 1, defaultPerPage,
                            _populateConfigListFilterRequest());
                    }
                });

            });
        }
    }

    function _populateProcessResponseData(iData) {
        var process = {};
        process.Name = iData.Name;
        process.Id = iData["Process-id"].Id;
        return process;
    }

    function _populateNewUserConfigData(response_data) {
        // console.log(response_data);
        var confObj = { emailEnabled: true, inAppEnabled: true };
        if (!_isStateTransition()) {
            confObj.Id = response_data["RelatedActions-id"].Id;
            confObj.Id1 = response_data["RelatedActions-id"].Id1;
            confObj.Action = response_data.Name;
        } else {
            confObj.Id = response_data["RelatedProcessState-id"].Id;
            confObj.Id1 = response_data["RelatedProcessState-id"].Id1;
            confObj.State = response_data.Name;
        }
        confObj.Process = _getTextValue(getTextValue(response_data.Owner.Name));
        confObj.ProcessId = _getTextValue(response_data.Owner.Id);
        confObj.isDirty = true;
        confObj.deleteSelected = false;
        return confObj;
    };
    function _populateUserConfigData(response_data) {
        // console.log(response_data);
        var confObj = { emailEnabled: response_data["EmailSubscribed"] === "TRUE" ? true : false, inAppEnabled: true };
        if (!_isStateTransition()) {
            confObj.Action = _getTextValue(response_data.Action.Name);
            confObj.Process = _getTextValue(getTextValue(response_data.Action.Owner.Name));
            confObj.ProcessId = _getTextValue(response_data.Action.Owner["Process-id"].Id);
        } else {
            confObj.State = _getTextValue(response_data.ProcessState.Name);
            confObj.Process = _getTextValue(getTextValue(response_data.ProcessState.Owner.Name));
            confObj.ProcessId = _getTextValue(response_data.ProcessState.Owner["Process-id"].Id);
        }
        confObj.Id = response_data["RelatedNotificationConfig-id"].Id;
        confObj.Id1 = response_data["RelatedNotificationConfig-id"].Id1;
        confObj.isDirty = false;
        confObj.deleteSelected = false;
        return confObj;
    };

    function _min(a, b) {
        if (a > b)
            return b;
        else
            return a;
    }

    self.toggleDeleteButton = function (data) {
        data.deleteSelected(!data.deleteSelected());
        _toggleDeleteButton();
    }

    self.enableAll = function () {
        self.userconfigList().forEach(ele => {
            ele.emailEnabled(true);
            ele.isDirty(true);
			self.isConfigChanged(true);
        });

    }

    self.disableAll = function () {
        self.userconfigList().forEach(ele => {
            ele.emailEnabled(false);
            ele.isDirty(true);
			self.isConfigChanged(true);
        });
    }

    self.toggleAllDeleteButton = function (data) {
        var isSelectAllButton = document.getElementById("id_selectAllConfigLists").classList.contains("cc-checkbox-select-all-off") ? true : false;
        self.userconfigList().forEach(function (ele) {
            ele.deleteSelected(isSelectAllButton);
        });
        if (isSelectAllButton) {
            document.getElementById("id_selectAllConfigLists").classList.remove("cc-checkbox-select-all-off");
            document.getElementById("id_selectAllConfigLists").classList.add("cc-checkbox-select-all-on");
        } else {
            document.getElementById("id_selectAllConfigLists").classList.remove("cc-checkbox-select-all-on");
            document.getElementById("id_selectAllConfigLists").classList.add("cc-checkbox-select-all-off");
        }
        _toggleDeleteButton();
    }

    self.deleteFromSelection = function (data, event) {
        var deleteConfigCt = 0;
        self.userconfigList().forEach(function (ele) {
            if (ele.deleteSelected()) {
                deleteConfigCt++;
            }
        });
        document.getElementById("numberOfDeleteCount").innerHTML = "Delete (" + deleteConfigCt + " items)";
        $("#deleteConfigListModal").modal({
            backdrop: 'static',
            keyboard: false
        });

        $('button#deleteConfigListYes').off("click");
        $('button#deleteConfigListYes').on('click', function (_event) {
            document.getElementById("numberOfDeleteCount").innerHTML = "Delete";
            _deleteConfigList();
        });
        document.getElementById("id_selectAllConfigLists").classList.remove("cc-checkbox-select-all-on");
        document.getElementById("id_selectAllConfigLists").classList.add("cc-checkbox-select-all-off");
    };

    self.closeConfigModal = function () {
        $("#deleteConfigListModal").modal('hide');
    }

    function _deleteConfigList() {
        var deleteConfigIds = [];
        self.userconfigList().forEach(function (ele) {
            if (ele.deleteSelected()) {
                deleteConfigIds.push({ "Id": ele.configId() });
                ele.deleteSelected(false);
            }
        });
        cc_notification_services.deleteConfigListService({ "Configurator": deleteConfigIds }, function (response_data, status) {
            if (status != "ERROR") {
                // console.log("delete success");
                displaySuccessToast("Configurator deleted.");
            }
            _toggleDeleteButton();
            self.refreshCurrentTable();
        });
        // console.log(deleteConfigIds);
    }

    // function to initializa data of SubOrg List screen
    ; (function init() {
        self.fetchAllProcess();

    })();
}


function toggle(data) {
    data(!data());
}

function _getTextValue(obj) {
    return obj && obj.text ? obj.text : obj;
}

function displayConfigCreateScreen() {
    l_UserNotifiConfigSubListModel.displayScreen(false);
}

function displayConfigListScreen() {
    l_UserNotifiConfigSubListModel.displayScreen(true);
}

function displayErrorToast(errorMessage, inValidList) {
    if (errorMessage) {
        updateToastContent(getTranslationMessage(errorMessage));
    }
    errorToastToggle('show');
    setTimeout(function () {
        errorToastToggle('hide');
    }, 5000);
}

function displaySuccessToast(success_msg) {
    successToast(2000, getTranslationMessage(success_msg));
}

function contentText(inValidList) {
    str = null;
    for (i = 0; i < inValidList.length; i++)
        if (i == 0)
            str = getTranslationMessage("{0}: A value is required", [inValidList[i]]);
        else
            str = str + "<br>" + getTranslationMessage("{0}: A value is required", [inValidList[i]]);
    return str;
}

var l_UserNotifiConfigNavModel = new UserNotifiConfigNavModel();
var l_UserNotifiConfigSubListModel = new UserNotifiConfigSubListModel();

$(document).ready(function () {
    ko.applyBindings(l_UserNotifiConfigNavModel, document.getElementById("configurator_nav_container"));
    ko.applyBindings(l_UserNotifiConfigSubListModel, document.getElementById("subList_container"));
    var i_locale = getlocale();
    var rtl_css = '../../../../../com/opentext/apps/utils/css/rtlappscommon.css';
    translateLabels("com/opentext/apps/commoncomponents/BasicComponents/BasicComponents", i_locale, true);
    loadRTLIfRequired(i_locale, rtl_css);

    if (window.parent.parent) {
        configuratorIframe = $('[src*="usernotificationsconfig.htm"]', window.parent.parent.document);
        if (configuratorIframe) {
            configuratorIframe.css('border', 'none');
        }
    }
    createToastDiv();
    var styleAttr = document.getElementById("successToast").getAttribute("style");
    document.getElementById("successToast").setAttribute("style", styleAttr + ";z-index:5999");
});


