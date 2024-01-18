$.cordys.json.defaults.removeNamespacePrefix = true;



// Services start----------------------------------------------
var cc_notification_services = (function () {
    var self = {};
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
            method: "createOrUpdateConfiguratorDetails",
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
    }
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
    }

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

const subNavList = ["Actions", "State transitions"];
const leftNavList = [{ Name: "Contract management", SubNav: subNavList, expandSection: true }, { Name: "Contract request", SubNav: subNavList, expandSection: false }, { Name: "Clause management", SubNav: subNavList, expandSection: false }, { Name: "Template management", SubNav: subNavList, expandSection: false },{ Name: "Obligation management", SubNav: subNavList, expandSection: false }];
const defaultSubScreen = "Actions";
const defaultMainScreen = "Contract management";

function ConfiguratorNavModel() {
    var self = this;
    self.leftNavList = ko.mapping.fromJS(leftNavList);
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
        l_ConfiguratorSubListModel.selectSubScreen(mainScren, subScreen);
    }

}

function ConfiguratorSubListModel() {
    var self = this;
    self.displayScreen = ko.observable(true);
    self.selectedMainScreen = ko.observable(defaultMainScreen);
    self.selectedSubScreen = ko.observable(defaultSubScreen);

    self.filterExpand = ko.observable(false);
    self.filterAction = ko.observable(defaultFilterVal);
    self.filterOptions = ko.observableArray(filterList);
    self.configuratorList = ko.observableArray();

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


    self.allProcessList = ko.observableArray();


    //Pagination START
    self.totalListsCount = ko.observable(0);
    self.currentPage = ko.observable(1);
    self.hideDecrement = ko.observable(true);
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
        self.hideDecrement(true);
        self.hideIncrement(false);
		
    };

    self.selectSubScreen = function (mainScren, subScreen) {
        self.configuratorList.removeAll();
        _defaultPagination();
        self.selectedSubScreen(subScreen);
        self.selectedMainScreen(mainScren);
        self.refreshTable(_populateConfigListFilterRequest());
    };

    self.loadEditDetails = function (data, event) {
        l_ConfiguratorCreateModel.editMode(true)
        l_ConfiguratorCreateModel.loadConfigEditDetails(data.configId());
    };

    function _populateConfigListFilterRequest() {
        return {
            "IsStateTransition": self.selectedSubScreen() === defaultSubScreen ? "false" : "true",
            "ProcessName": self.selectedMainScreen()
        };
    }

    self.refreshCurrentTable = function () {
        self.refreshTable(_populateConfigListFilterRequest());
    };

    self.refreshTable = function (params) {
        var offset = (self.currentPage() - 1) * defaultPerPage;
        self.fetchConfiguratorList(offset, defaultPerPage, params);
    };

    self.fetchConfiguratorList = function (offset, limit, params) {
        cc_notification_services.getConfiguratorListService(_populateConfiguratorRequest(offset, limit, params), function (response_data, status) {
            if (status !== "ERROR") {
                _populateDatatable(offset, response_data);
            }
        });
    };

    self.openConfiguratorCreateForm = function () {
        l_ConfiguratorCreateModel.cleanCreateModal();
        displayConfigCreateScreen();
    }
    self.openConfiguratorEditForm = function (data) {
        l_ConfiguratorCreateModel.cleanCreateModal();
        l_ConfiguratorCreateModel.editMode(true);
        l_ConfiguratorCreateModel.configId(data.configId());
        displayConfigCreateScreen();
    }

    function _populateConfiguratorRequest(offset, limit, params) {
        if (!params) {
            params = {};
        }
        params["offset"] = offset;
        params["limit"] = limit;
        return params;
    };

    function _toggleDeleteButton() {
        var count = 0;
        self.configuratorList().forEach(ele => ele.deleteSelected() ? (count++) : 0);
        if (count > 0) {
            document.getElementById("id_deleteConfigListActionBar").classList.remove("hidden");
        } else {
            document.getElementById("id_deleteConfigListActionBar").classList.add("hidden");
        }
    }

    function _populateDatatable(offset, response_data) {
        if (response_data.Response.ConfigList.FindZ_INT_ConfiguratorDisplayListResponse && response_data.Response.ConfigList.FindZ_INT_ConfiguratorDisplayListResponse.Configurator) {
            var configList = response_data.Response.ConfigList.FindZ_INT_ConfiguratorDisplayListResponse.Configurator;
            var rolesList = response_data.Response.RolesList.Roles;
            self.configuratorList.removeAll();
            if (Array.isArray(configList)) {
                for (var i = 0; i < configList.length; i++) {
                    var roles = rolesList.find(ele => ele.ConfiguratorId === configList[i]["Configurator-id"].Id);
                    self.configuratorList.push(ko.mapping.fromJS(_populateConfigData(configList[i], roles.Role)));
                }
            } else {
                var roles = rolesList && Array.isArray(rolesList) ?
                    rolesList.find(ele => ele.ConfiguratorId === configList["Configurator-id"].Id) :
                    (rolesList.ConfiguratorId === configList["Configurator-id"].Id ? rolesList : {});
                self.configuratorList.push(ko.mapping.fromJS(_populateConfigData(configList, roles.Role)));
            }
            var total = response_data.Response.ConfigList.FindZ_INT_ConfiguratorDisplayListResponse["@total"];
            self.totalListsCount(total);
            self.currentPage(offset / defaultPerPage + 1);
        } else {
            self.configuratorList.removeAll();
            self.totalListsCount(0);
            self.currentPage(offset / defaultPerPage + 1);
        }
    };

    self.fetchAllProcess = function () {
        if (self.allProcessList().length <= 0) {
            cc_notification_services.getAllProcessListService({}, function (response_data, status) {
                // console.log(response_data);
                if (status !== "ERROR") {
                    var processList = response_data.Process;
                    for (let index = 0; index < processList.length; index++) {
                        const element = processList[index];
                        self.allProcessList.push(_populateProcessResponseData(ko.mapping.fromJS(element)));
                    }
                }
            });
        }
    }

    function _populateProcessResponseData(iData) {
        var process = {};
        process.Name = iData.Name;
        process.Id = iData["Process-id"].Id;
        return process;
    }

    function _populateConfigData(response_data, roles_response) {
        var confObj = {};
        // console.log(response_data);
        confObj.configId = response_data["Configurator-id"].Id;
        confObj.configItemId = response_data["Configurator-id"].ItemId;
        if (response_data.IsStateTransition === "false") {
            confObj.Action = _getTextValue(response_data.RegisteredAction.Name);
            confObj.State = "";
            if (response_data.RegisteredState && response_data.RegisteredState.Name) {
                confObj.State = _getTextValue(response_data.RegisteredState.Name);
            }
        } else {
            confObj.FromState = response_data.RegisteredFromState ? _getTextValue(response_data.RegisteredFromState.Name) : "";
            if (response_data.RegisteredToState && response_data.RegisteredToState.Name) {
                confObj.ToState = _getTextValue(response_data.RegisteredToState.Name);
            }
        }
        confObj.Process = _getTextValue(response_data.RegisteredProcess.Name);
        confObj.EmailTemplate = _getTextValue(response_data.RegisteredTemplate.TemplateDisplayName) ?
            _getTextValue(response_data.RegisteredTemplate.TemplateDisplayName) : _getTextValue(response_data.RegisteredTemplate.Name);
        var recepients_html = "";
        if (roles_response) {
            var roles = roles_response.GetRegisteredRoleResponse.Role;
            if (roles && Array.isArray(roles)) {
                for (let index = 0; index < _min(roles.length, 2); index++) {
                    const element = roles[index];
                    recepients_html = recepients_html + "<label style='margin-top:13px'>" + _getTextValue(element.Name) + "</label>" + "<br>";
                }
            } else if (roles) {
                recepients_html = recepients_html + "<label style='margin-top:13px'>" + _getTextValue(roles.Name) + "</label>" + "<br>";
            }
        }

        confObj.Recipients = recepients_html;

        var addln_recepients_html = "";
        if (roles_response && response_data.CCList) {
            var ccList = response_data.CCList.split(";");
            if (ccList && Array.isArray(ccList)) {
                for (let index = 0; index < _min(ccList.length, 2); index++) {
                    const element = ccList[index];
                    addln_recepients_html = addln_recepients_html + "<label style='margin-top:13px'>" + element + "</label>" + "<br>";
                }
            } else if (ccList) {
                addln_recepients_html = addln_recepients_html + "<label style='margin-top:13px'>" + ccList + "</label>" + "<br>";
            }
        }

        confObj.AdditionalRecipients = _getTextValue(addln_recepients_html);
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
    self.toggleAllDeleteButton = function (data) {
        var isSelectAllButton = document.getElementById("id_selectAllConfigLists").classList.contains("cc-checkbox-select-all-off") ? true : false;
        self.configuratorList().forEach(function (ele) {
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
        self.configuratorList().forEach(function (ele) {
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
        self.configuratorList().forEach(function (ele) {
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
        self.fetchConfiguratorList(self.currentPage() - 1, defaultPerPage,
            _populateConfigListFilterRequest());
    })();
}

function ConfiguratorCreateModel() {
    var self = this;
    self.displayScreen = ko.observable(false);
    self.selectedMainScreen = ko.observable(defaultMainScreen);
    self.selectedSubScreen = ko.observable(defaultSubScreen);
    self.configId = ko.observable();
    self.editMode = ko.observable(false);
    self.actionDisplayName = ko.observable();
    self.actionDisplayNameEmpty = ko.observable();
    self.actionId = ko.observable();
    self.emailEnabled = ko.observable(true);
    self.inAppEnabled = ko.observable(true);
    self.watcherEnabled = ko.observable(true);
    self.fromStateName = ko.observable();
    self.fromStateNameEmpty = ko.observable();
    self.fromStateId = ko.observable();
    self.toStateName = ko.observable();
    self.toStateNameEmpty = ko.observable();
    self.toStateId = ko.observable();
    self.statusValue = ko.observable("ENABLED");
    self.emailTemplateDisplayName = ko.observable();
    self.emailTemplateDisplayNameEmpty = ko.observable();
    self.emailTemplateId = ko.observable();
    self.additionalRecipients = ko.observable();
    self.recipientGroups = ko.observableArray();
    self.deleteRecipientGroups = ko.observableArray();
    self.isDirty = ko.observable(false);

    self.formErrors = ko.observableArray();

    //Action model data start ------------------
    self.actionList = ko.observableArray();
    self.filterActionName = ko.observable();
    //Action model data end --------------------

    //ToState model data start ------------------
    self.toStateList = ko.observableArray();
    self.filterToStateName = ko.observable();
    //Tostate model data end --------------------

    //FromState model data start ------------------
    self.fromStateList = ko.observableArray();
    self.filterFromStateName = ko.observable();
    //FromState model data end --------------------

    //Email model data start ------------------
    self.emailList = ko.observableArray();
    self.filterEmailName = ko.observable();
    //Email model data end --------------------

    //Recepient model data start ------------------
    self.recepientList = ko.observableArray();
    self.filterRecepientName = ko.observable();
    //Recepient model data end --------------------

    self.openConfiguratorList = function () {
        displayConfigListScreen();
        _clearConfiguratorModel();
    }
    self.saveConfigurator = function () {
        if (_isValidCreateForm()) {
            var configRequest = _populateConfiguratorCreateRequest();
            if (self.editMode()) {
                configRequest = _populateConfiguratorUpdateRequest(configRequest);
            }
            cc_notification_services.createOrUpdateConfiguratorService(configRequest, function (response_data, status) {
                // console.log(response_data);
                if (status !== "ERROR") {
                    l_ConfiguratorSubListModel.refreshCurrentTable();
                    displaySuccessToast("Configurator created");
                } else {
                    displayErrorToast(" An error occurred while creating the configurator. Contact your administrator.")
                }
                _clearConfiguratorModel();
                displayConfigListScreen();
            });
        }
    }

    function _isValidCreateForm() {
        var isValidForm = true;
        if (!_isStateTransistion() && !self.actionDisplayName()) {
            isValidForm = false;
            self.formErrors.push("Action");

        }
        if (_isStateTransistion() && !self.toStateName()) {
            isValidForm = false;
            self.formErrors.push("New state");
        }
        if (!self.emailTemplateDisplayName()) {
            isValidForm = false;
            self.formErrors.push("Email template");
        }
        if (!isValidForm) {
            displayErrorToast(null, self.formErrors());
        }
        _cleanFormErrors();
        return isValidForm;
    }

    function _isStateTransistion() {
        return self.selectedSubScreen() !== subNavList[0];
    }


    function _cleanFormErrors() {
        setTimeout(function () {
            self.formErrors.removeAll();
        }, 3000);
    }

    self.confirmCancel = function () {
        _clearConfiguratorModel();
        displayConfigListScreen();
    }

    function _clearConfiguratorModel() {
        self.cleanCreateModal();
    }

    self.loadConfigEditDetails = function (configId) {
        self.cleanCreateModal();
        cc_notification_services.getConfiguratorDetailService({
            configId: configId
        }, function (response_data, status) {
            // console.log(response_data);
            if (status !== "ERROR") {
                var configResponse = response_data.Response.ConfigResponse.FindZ_INT_ConfiguratorDisplayListResponse.Configurator;
                var rolesResponse = response_data.Response.RolesResponse.GetRegisteredRoleOutput.GetRegisteredRoleResponse;
                self.editMode(true);
                _populateConfigEditScreen(configResponse, rolesResponse);
            }
        }
        );
    }

    function _populateConfigEditScreen(req_config_data, req_roles_data) {
        self.configId(req_config_data["Configurator-id"].Id);
        var fromStateName = req_config_data.IsStateTransition === "false" ?
            _getTextValue(req_config_data.RegisteredState ? req_config_data.RegisteredState.Name : "") :
            _getTextValue(req_config_data.RegisteredFromState ? req_config_data.RegisteredFromState.Name : "");
        var fromStateId = req_config_data.IsStateTransition === "false" ?
            req_config_data.RegisteredState ? req_config_data.RegisteredState["RelatedProcessState-id"].Id1 : "" :
            _getTextValue(req_config_data.RegisteredFromState ? req_config_data.RegisteredFromState["RelatedProcessState-id"].Id1 : "");
        self.fromStateName(fromStateName);
        self.fromStateId(fromStateId);
        if (req_config_data.EmailEnabled && req_config_data.EmailEnabled === "false") {
            self.emailEnabled(false);
        }
        if (req_config_data.InAppEnabled && req_config_data.InAppEnabled === "false") {
            self.inAppEnabled(false);
        }
        if (req_config_data.WatcherEnabled && req_config_data.WatcherEnabled === "false") {
            self.watcherEnabled(false);
        }
        if (req_config_data.IsStateTransition !== "false") {
            self.toStateName(_getTextValue(req_config_data.RegisteredToState.Name));
            self.toStateId(_getTextValue(req_config_data.RegisteredToState["RelatedProcessState-id"].Id1));
        } else {
            self.actionId(_getTextValue(req_config_data.RegisteredAction["RelatedActions-id"].Id1));
            self.actionDisplayName(_getTextValue(req_config_data.RegisteredAction.Name));
        }
        self.statusValue("ENABLED");
        self.emailTemplateDisplayName(_getTextValue(req_config_data.RegisteredTemplate.TemplateDisplayName) ? _getTextValue(req_config_data.RegisteredTemplate.TemplateDisplayName) : _getTextValue(req_config_data.RegisteredTemplate.Name));
        self.emailTemplateId(_getTextValue(req_config_data.RegisteredTemplate["RelatedTemplates-id"].Id1));
        self.additionalRecipients(req_config_data.CCList);
        if (req_roles_data && req_roles_data.Role) {
            var roles = req_roles_data.Role;
            if (Array.isArray(roles)) {
                for (let index = 0; index < roles.length; index++) {
                    const element = roles[index];
                    self.recipientGroups.push(ko.mapping.fromJS(_populateRecepientGroups(element)));
                }
            } else {
                self.recipientGroups.push(ko.mapping.fromJS(_populateRecepientGroups(roles)));
            }

        }
        displayConfigCreateScreen();
    }

    function _populateRecepientGroups(req_recepient) {
        var recepient = {};
        recepient.recepientName = req_recepient.IdentityDisplayName.text;
        recepient.roleId = req_recepient["Identity-id"].Id;
        recepient.isNew = false;
        return recepient;
    }

    function _populateConfiguratorUpdateRequest(request_data) {
        request_data.data.ConfiguratorId = self.configId();
        return request_data;
    }
    function _populateConfiguratorCreateRequest() {
        var request = {};
        request.CCList = self.additionalRecipients();
        request.IsStateTransition = self.selectedSubScreen() === defaultSubScreen ? "false" : "true";
        request.RegisteredAction = { "Id1": self.actionId() };
        request.RegisteredFromState = { "Id1": self.fromStateId() };
        request.RegisteredToState = { "Id1": self.toStateId() };
        var processObs = l_ConfiguratorSubListModel.allProcessList().filter(ele => ele.Name() === self.selectedMainScreen());
        request.RegisteredProcess = { "Id": processObs[0].Id() };
        request.RegisteredState = { "Id1": self.fromStateId() };
        request.RegisteredTemplate = { "Id1": self.emailTemplateId() };
        request.EmailEnabled = self.emailEnabled() ? "true" : "false";
        request.InAppEnabled = self.inAppEnabled() ? "true" : "false";
        request.WatcherEnabled = self.watcherEnabled() ? "true" : "false";
        var groups = [];
        self.recipientGroups().forEach(ele => {
            if (ele.isNew()) {
                groups.push({ Id: ele.roleId() })
            }
        }
        );
        request.RecipientGroups = { "Group": groups };
        var deletegroups = [];
        self.deleteRecipientGroups().forEach(ele => {
            if (!ele.isNew()) {
                deletegroups.push({ Id: ele.roleId() })
            }
        }
        );
        request.DeleteRecepientGroups = { "Group": deletegroups };
        request["Tracking-create"] = { "CreatedBy": { "Identity-id": "" } };//TBD
        return { data: request };
    }

    self.removeRecepientFromSelectedList = function (data, event) {
        if (!data.isNew()) {
            self.deleteRecipientGroups.push(data);
        }
        var removed = self.recipientGroups.remove(data);
        self.isDirty(true);
    }

    //Action model events start-------------------------
    self.openActionSelectionModal = function () {
        $('#div_selectActionListModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        self.getActionsList({ "offset": 0, "limit": 200 });
    }
    self.closeActionModal = function () {
        _closeActionModelData();
        _clearActionModelData();
    }
    self.filterActions = function () {
        var filterParams = {};
        filterParams.applyFilter = true;
        filterParams.actionName = self.filterActionName();
        self.getActionsList(filterParams);
    }
    self.clickRadioAction = function (data, event) {
        self.actionList().forEach(ele => { ele.selected(false) });
        data.selected(true);
    }

    self.selectAction = function () {
        var selected = self.actionList().filter(ele => ele.selected());
        // console.log(selected);
        if (selected && selected.length > 0) {
            self.actionDisplayName(selected[0].actionName());
            self.actionId(selected[0].relatedActionsId());
            _clearActionModelData();
            _closeActionModelData();
        } else {
            //ERROR TBD
        }
        self.isDirty(true);
    }
    self.getActionsList = function (params = {}) {
        cc_notification_services.getActionsFilteredListService(params, function (response, status) {
            // console.log(response);
            if (status != "ERROR") {
                self.actionList.removeAll();
                var actionsList = response.actionsResponse.FindZ_INT_ActionsListResponse.RelatedActions;
                if (Array.isArray(actionsList)) {
                    var fileredActions = actionsList.filter(e => e.Owner.Name.text === l_ConfiguratorSubListModel.selectedMainScreen());
                    for (let index = 0; index < fileredActions.length; index++) {
                        self.actionList.push(ko.mapping.fromJS(_populateActionData(fileredActions[index])));
                    }
                } else if (actionsList) {
                    if (actionsList.Owner.Name.text === l_ConfiguratorSubListModel.selectedMainScreen()) {
                        self.actionList.push(ko.mapping.fromJS(_populateActionData(actionsList)));
                    }
                }

            }
        });
    }

    function _populateActionData(actionReq) {
        let actionObj = {};
        actionObj.actionName = actionReq.Name;
        actionObj.selected = false;
        actionObj.relatedActionsId = actionReq["RelatedActions-id"]["Id1"];
        return actionObj;
    }

    function _clearActionModelData() {
        self.actionList.removeAll();
    }
    function _closeActionModelData() {
        $('#div_selectActionListModal').modal('hide');
    }
    //Action model events end-------------------------


    //fromState model events start-------------------------
    self.openFromStateSelectionModal = function () {
        $('#div_selectFromStateListModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        self.getFromStateList({ "offset": 0, "limit": 200 });
    }
    self.closeFromStateModal = function () {
        _closeFromStateModelData();
        _clearFromStateModelData();
    }
    self.filterFromState = function () {
        var filterParams = {};
        filterParams.applyFilter = true;
        filterParams.processState = self.filterFromStateName();
        self.getFromStateList(filterParams);
    }
    self.clickRadioFromState = function (data, event) {
        self.fromStateList().forEach(ele => { ele.selected(false) });
        data.selected(true);
    }

    self.selectFromState = function () {
        var selected = self.fromStateList().filter(ele => ele.selected());
        // console.log(selected);
        if (selected && selected.length > 0) {
            self.fromStateName(selected[0].stateName());
            self.fromStateId(selected[0].stateId());
        } else {
            //ERROR TBD
        }
        _clearFromStateModelData();
        _closeFromStateModelData();
        self.isDirty(true);
    }

    self.getFromStateList = function (params = {}) {
        cc_notification_services.getProcessStateFilteredListService(params, function (response, status) {
            // console.log(response);
            if (status != "ERROR") {
                self.fromStateList.removeAll();
                var statesList = response.FilterResponse.FindZ_INT_RelatedProcessStatesResponse.RelatedProcessState;
                if (Array.isArray(statesList)) {
                    var statesFilteredList = statesList.filter(e => e.Owner.Name.text === l_ConfiguratorSubListModel.selectedMainScreen());
                    for (let index = 0; index < statesFilteredList.length; index++) {
                        self.fromStateList.push(ko.mapping.fromJS(_populateStateData(statesFilteredList[index])));
                    }
                } else if (statesList && statesList.Owner.Name.text === l_ConfiguratorSubListModel.selectedMainScreen()) {
                    self.fromStateList.push(ko.mapping.fromJS(_populateStateData(statesList)));
                }

            }
        });
    }

    function _populateStateData(stateResponse) {
        let stateObj = {};
        stateObj.stateName = stateResponse.Name;
        stateObj.selected = false;
        stateObj.stateId = stateResponse["RelatedProcessState-id"].Id1;
        return stateObj;
    }

    function _clearFromStateModelData() {
        self.fromStateList.removeAll();
    }

    function _closeFromStateModelData() {
        $('#div_selectFromStateListModal').modal('hide');
    }

    //Status model events end-------------------------

    //toState model events start-------------------------
    self.openToStateSelectionModal = function () {
        $('#div_selectToStateListModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        self.getToStateList({ "offset": 0, "limit": 200 });
    }
    self.closeToStateModal = function () {
        $('#div_selectToStateListModal').modal('hide');
        _clearToStateModelData();
    }
    self.filterToState = function () {
        var filterParams = {};
        filterParams.applyFilter = true;
        filterParams.processState = self.filterToStateName();
        self.getToStateList(filterParams);
    }
    self.clickRadioToState = function (data) {
        self.toStateList().forEach(ele => { ele.selected(false) });
        data.selected(true);
    }
    self.selectToState = function () {
        var selected = self.toStateList().filter(ele => ele.selected());
        // console.log(selected);
        if (selected && selected.length > 0) {
            self.toStateName(selected[0].stateName());
            self.toStateId(selected[0].stateId());
        } else {
            //ERROR TBD
        }
        _closeToStateModelData();
        _clearToStateModelData();
    }
    self.getToStateList = function (params = {}) {
        cc_notification_services.getProcessStateFilteredListService(params, function (response, status) {
            // console.log(response);
            if (status != "ERROR") {
                self.toStateList.removeAll();
                var statesList = response.FilterResponse.FindZ_INT_RelatedProcessStatesResponse.RelatedProcessState;
                if (Array.isArray(statesList)) {
                    var statesFilteredList = statesList.filter(e => e.Owner.Name.text === l_ConfiguratorSubListModel.selectedMainScreen());
                    for (let index = 0; index < statesFilteredList.length; index++) {
                        self.toStateList.push(ko.mapping.fromJS(_populateStateData(statesFilteredList[index])));
                    }
                } else if (statesList && statesList.Owner.Name.text === l_ConfiguratorSubListModel.selectedMainScreen()) {
                    self.toStateList.push(ko.mapping.fromJS(_populateStateData(statesList)));
                }

            }
        });
    }

    function _populateStateData(stateResponse) {
        let stateObj = {};
        stateObj.stateName = stateResponse.Name;
        stateObj.selected = false;
        stateObj.stateId = stateResponse["RelatedProcessState-id"].Id1;
        return stateObj;
    }
    function _closeToStateModelData() {
        $('#div_selectToStateListModal').modal('hide');
    }
    function _clearToStateModelData() {
        self.toStateList.removeAll();
    }
    //Status model events end-------------------------


    //Email model events start-------------------------
    self.openEmailSelectionModal = function () {
        $('#div_selectEmailListModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        self.getEmailList({ "offset": 0, "limit": 200 });
    }
    self.closeEmailModal = function () {
        $('#div_selectEmailListModal').modal('hide');
        _clearEmailModelData();
    }
    self.filterEmail = function () {
        var filterParams = {};
        filterParams.applyFilter = true;
        filterParams.emailTemplateName = self.filterEmailName();
        self.getEmailList(filterParams);
    }
    self.clickRadioEmail = function (data) {
        self.emailList().forEach(ele => { ele.selected(false) });
        data.selected(true);
    }
    self.selectEmail = function () {
        var selected = self.emailList().filter(ele => ele.selected());
        if (selected && selected.length > 0) {
            self.emailTemplateDisplayName(selected[0].emailName());
            self.emailTemplateId(selected[0].emailTemplateId());
            _closeEmailModelData()
            _clearEmailModelData();
        } else {
            //ERROR TBD
        }
        self.isDirty(true);
    }

    self.getEmailList = function (params = {}) {
        self.emailList.removeAll();
        params.processName = self.selectedMainScreen();
        cc_notification_services.getTemplatesFilteredListService(params, function (response, status) {
            // console.log(response);
            if (status !== "ERROR") {
                var emailTemplList = response.Response.FindZ_INT_TemplatesListResponse.RelatedTemplates;
                if (Array.isArray(emailTemplList)) {
                    for (let index = 0; index < emailTemplList.length; index++) {
                        const element = emailTemplList[index];
                        self.emailList.push(ko.mapping.fromJS(_populateEmailTemplModelData(element)));
                    }
                } else if (emailTemplList) {
                    self.emailList.push(ko.mapping.fromJS(_populateEmailTemplModelData(emailTemplList)));
                }
            }
        });
    }

    function _populateEmailTemplModelData(iData) {
        var emailTemp = {};
        emailTemp.emailName = iData.TemplateDisplayName ? iData.TemplateDisplayName : iData.Name;
        emailTemp.emailTemplateId = iData["RelatedTemplates-id"].Id1;
        emailTemp.selected = false;
        return emailTemp;
    }

    function _closeEmailModelData() {
        $('#div_selectEmailListModal').modal('hide');
    }
    function _clearEmailModelData() {
        self.emailList.removeAll();
    }
    //Email model events end-------------------------
    //Recepient model events start-------------------------
    self.openRecepientSelectionModal = function () {
        $('#div_selectRecepientListModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        self.getRecepientList({ "offset": 0, "limit": 200 });
    }
    self.closeRecepientModal = function () {
        _closeRecepientModelData();
        _clearRecepientModelData();
    }
    self.filterRecepient = function () {
        self.getRecepientList();
    }
    self.clickRadioRecepient = function (data) {
        data.selected(!data.selected());
    }
    self.selectRecepient = function () {
        var selected = self.recepientList().filter(ele => ele.selected());
        if (selected && selected.length > 0) {
            for (let index = 0; index < selected.length; index++) {
                const element = selected[index];
                var addedInForm = self.recipientGroups().find(ele => ele.roleId() === element.roleId());
                if (!addedInForm) {
                    self.recipientGroups.push(ko.mapping.fromJS(_populateRecepientGroup(element)));
                }
            }
            _closeRecepientModelData();
            _clearRecepientModelData();
        } else {
            //ERROR TBD
        }
        self.isDirty(true);
    }

    function _populateRecepientGroup(recepient_data) {
        var recepient = {};
        recepient.recepientName = recepient_data.recepientName()
        recepient.roleId = recepient_data.roleId();
        recepient.isNew = true;
        return recepient;
    }

    self.getRecepientList = function () {
        self.recepientList.removeAll();
        cc_notification_services.getAllUserRolesFilteredListService({ "contains": self.filterRecepientName() }, function (response, status) {
            // console.log(response);
            if (status !== "ERROR") {
                var roles = response.Role;
                if (Array.isArray(roles)) {
                    for (let index = 0; index < roles.length; index++) {
                        const element = roles[index];
                        self.recepientList.push(ko.mapping.fromJS(_populateRecepientData(element)));
                    }
                } else if (roles) {
                    self.recepientList.push(ko.mapping.fromJS(_populateRecepientData(roles)));
                }

            }
        });
    }

    function _populateRecepientData(response_data) {
        return {
            "recepientName": response_data.Name.text,
            roleId: response_data["Identity-id"].Id,
            selected: false
        };
    }

    function _closeRecepientModelData() {
        $('#div_selectRecepientListModal').modal('hide');
    }
    function _clearRecepientModelData() {
    }
    //Status model events end-------------------------

    self.cleanCreateModal = function () {
        self.editMode(false);
        self.configId("");
        self.actionDisplayName("");
        self.actionDisplayNameEmpty(false);
        self.actionId("");
        self.fromStateName("");
        self.fromStateNameEmpty(false);
        self.fromStateId("");
        self.toStateName("");
        self.toStateNameEmpty(false);
        self.toStateId("");
        self.statusValue("ENABLED");
        self.emailTemplateDisplayName("");
        self.emailTemplateDisplayNameEmpty(false);
        self.emailTemplateId("");
        self.additionalRecipients("");
        self.emailEnabled(true);
        self.inAppEnabled(true);
        self.watcherEnabled(true);
        self.recipientGroups.removeAll();
        self.deleteRecipientGroups.removeAll();
        self.formErrors.removeAll();
        self.isDirty(false);
    }

}

function toggle(data) {
    data(!data());
}

function _getTextValue(obj) {
    return obj && obj.text ? obj.text : obj;
}

function displayConfigCreateScreen() {
    l_ConfiguratorCreateModel.selectedSubScreen(l_ConfiguratorSubListModel.selectedSubScreen());
    l_ConfiguratorCreateModel.selectedMainScreen(l_ConfiguratorSubListModel.selectedMainScreen());
    l_ConfiguratorSubListModel.displayScreen(false);
    l_ConfiguratorCreateModel.displayScreen(true);
}

function displayConfigListScreen() {
    l_ConfiguratorSubListModel.displayScreen(true);
    l_ConfiguratorCreateModel.displayScreen(false);
}

function displayErrorToast(errorMessage, inValidList) {
    if (inValidList && Array.isArray(inValidList) && inValidList.length > 1) {
        updateToastContent(getTranslationMessage("{0} errors", [inValidList.length]), contentText(inValidList));
        contentText(inValidList);
    } else if (inValidList && Array.isArray(inValidList)) {
        updateToastContent(getTranslationMessage("{0}: A value is required.", inValidList));
    } else if (errorMessage) {
        updateToastContent(getTranslationMessage(errorMessage));
    }
    errorToastToggle('show');
    setTimeout(function () {
        errorToastToggle('hide');
    }, 5000);
}

function displaySuccessToast(success_msg) {
    successToast(success_msg)
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



var l_ConfiguratorNavModel = new ConfiguratorNavModel();
var l_ConfiguratorSubListModel = new ConfiguratorSubListModel();
var l_ConfiguratorCreateModel = new ConfiguratorCreateModel();


$(document).ready(function () {
    ko.applyBindings(l_ConfiguratorNavModel, document.getElementById("configurator_nav_container"));
    ko.applyBindings(l_ConfiguratorSubListModel, document.getElementById("subList_container"));
    ko.applyBindings(l_ConfiguratorCreateModel, document.getElementById("create_configurator_container"));
    var i_locale = getlocale();
    var rtl_css = '../../../../../com/opentext/apps/utils/css/rtlappscommon.css';
    translateLabels("com/opentext/apps/commoncomponents/BasicComponents/BasicComponents", i_locale, true);
    loadRTLIfRequired(i_locale, rtl_css);

    if (window.parent.parent) {
        configuratorIframe = $('[src*="ConfiguratorManagement.htm"]', window.parent.parent.document);
        if (configuratorIframe) {
            configuratorIframe.css('border', 'none');
        }
    }
    createToastDiv();
    var styleAttr = document.getElementById("successToast").getAttribute("style");
    document.getElementById("successToast").setAttribute("style", styleAttr + ";z-index:5999");
});


