$.cordys.json.defaults.removeNamespacePrefix = true;
var l_rulesList_model;
var l_rulesListFilter_model;
var l_ruleDetails_model;
var l_activityListForSelection_model;
var l_ruleConditionLeftOperandForSelection_model;
var l_activityListDetails_model;
var rulesListOffsetValue = 0;
var rulesListLimitValue = 25;
var selectedRulesListMap = {};
var defaultIDforSelectDropdown = ""


const actionNameLabelMap = new Map(
    [['SendForReview', 'Send for review'], ['Terminate','Terminate'],
    ['CancelTerminate', 'Cancel terminate'], ['RenewalReminder', 'Renewal - Action reminder'],
    ['OBL-Not-Met', 'Not met'],['OBL-Met-Success', 'Met'],
    ['OBL-InValid', 'Invalid'], ['OBL-InActive', 'Inactive']
]
);

const RLMetadata = Object.freeze({
    CLAUSE: {
        TYPE : "CLAUSE",
        VALUE: "CLAUSEWORKFLOW",
        ACT_VALUE : "Clause",
        LABEL: "Clauses",
        PROCESS: "Clause",
        PURPOSE : "CLARULE;"
    },
    TEMPLATE : {
        TYPE : "TEMPLATE",
        VALUE: "TEMPLATEWORKFLOW",
        ACT_VALUE : "Template",
        LABEL: "Templates",
        PROCESS: "Template",
        PURPOSE : "TEMRULE;"
    },
    CONTRACT : {
        TYPE : "CONTRACT",
        VALUE: "CONTRACTWORKFLOW",
        ACT_VALUE : "Contract",
        LABEL: "Contracts",
        PROCESS: "Contract",
        PURPOSE : "CTRRULE;"
    },
    OBLIGATION : {
        TYPE : "OBLIGATION",
        VALUE: "OBLIGATIONWORKFLOW",
        ACT_VALUE : "Obligation",
        LABEL: "Obligations",
        PROCESS: "Obligation",
        PURPOSE : "OBLRULE;"
    }
})


var RulesListModel = function () {
    var self = this;
    self.ruleType = ko.observable(RLMetadata.CLAUSE);
    self.RulesList = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.numOfRules = ko.observable('');
    self.numOfRulesInCurrentPage = ko.observable('');
    self.numOfPages = ko.observable('');
    self.isFilterApplied = ko.observable(false);
    self.openSelectedItem = function (iItem) {
        if (iItem["Rule-id"] && iItem.CreationType!="DEFAULT-IMPORTED") {
            var l_itemId = iItem["Rule-id"].ItemId;
            openRuleCreateOrEditForm(l_itemId);
        }
    }
    self.confirmRuleStatusChange = function (iItem, event) {
        if (iItem["Rule-id"].ItemId) {
            var statusToChange = iItem.Status == "ACTIVE" ? "INACTIVE" : "ACTIVE";
            changeRuleStatus(iItem["Rule-id"].ItemId, statusToChange);
        }
        event.stopPropagation();
    }
    self.confirmRuleDelete = function (iItem, event) {
        if (iItem["Rule-id"].ItemId) {
            deleteRuleFromRow(iItem["Rule-id"].ItemId, iItem.Name);
        }
        event.stopPropagation();
    }
    self.onRuleRowCheckboxValueChanged = function (iItem, event) {
        var l_currentClassName = event.currentTarget.className;
        if (l_currentClassName == "cc-select-column cc-checkbox-off") {
            $(event.currentTarget).removeClass("cc-checkbox-off")
            $(event.currentTarget).addClass("cc-checkbox-on")
            selectedRulesListMap[iItem["Rule-id"].ItemId] = iItem.Name;
            $(event.currentTarget.parentElement.parentElement).css("background-color", "#CBD3D9")
        }
        else if (l_currentClassName == "cc-select-column cc-checkbox-on") {
            $(event.currentTarget).removeClass("cc-checkbox-on")
            $(event.currentTarget).addClass("cc-checkbox-off")
            delete selectedRulesListMap[iItem["Rule-id"].ItemId];
            $(event.currentTarget.parentElement.parentElement).css("background-color", "transparent")
        }
        event.stopPropagation();
		$("#btn_openRuleFromActionBar").prop("disabled", false);
		$("#btn_editRuleFromActionBar").prop("disabled", false);
		$("#btn_deleteRuleFromActionBar").prop("disabled", false);
        if (Object.keys(selectedRulesListMap).length <= 0) {
            $("#div_selectAllRules").removeClass("cc-checkbox-select-all-partial");
            $("#div_selectAllRules").removeClass("cc-checkbox-select-all-on");
            $("#div_selectAllRules").addClass("cc-checkbox-select-all-off");
            $("#btn_openRuleFromActionBar").css("display", "none");
            $("#btn_editRuleFromActionBar").css("display", "none");
            $("#btn_deleteRuleFromActionBar").css("display", "none");
        } else if (Object.keys(selectedRulesListMap).length == 1) {
            if (1 == l_rulesList_model.numOfRulesInCurrentPage()) {
                $("#div_selectAllRules").removeClass("cc-checkbox-select-all-off");
                $("#div_selectAllRules").removeClass("cc-checkbox-select-all-partial");
                $("#div_selectAllRules").addClass("cc-checkbox-select-all-on");
                $("#btn_openRuleFromActionBar").css("display", "inline");
                $("#btn_editRuleFromActionBar").css("display", "inline");
                $("#btn_deleteRuleFromActionBar").css("display", "inline");
            } else {
                $("#div_selectAllRules").removeClass("cc-checkbox-select-all-off");
                $("#div_selectAllRules").removeClass("cc-checkbox-select-all-on");
                $("#div_selectAllRules").addClass("cc-checkbox-select-all-partial");
                $("#btn_openRuleFromActionBar").css("display", "inline");
                $("#btn_editRuleFromActionBar").css("display", "inline");
                $("#btn_deleteRuleFromActionBar").css("display", "inline");
            }
        } else if (Object.keys(selectedRulesListMap).length > 1 && Object.keys(selectedRulesListMap).length < l_rulesList_model.numOfRulesInCurrentPage()) {
            $("#div_selectAllRules").removeClass("cc-checkbox-select-all-off");
            $("#div_selectAllRules").removeClass("cc-checkbox-select-all-on");
            $("#div_selectAllRules").addClass("cc-checkbox-select-all-partial");
            $("#btn_openRuleFromActionBar").css("display", "none");
            $("#btn_editRuleFromActionBar").css("display", "none");
            $("#btn_deleteRuleFromActionBar").css("display", "inline");
        } else if (Object.keys(selectedRulesListMap).length == l_rulesList_model.numOfRulesInCurrentPage()) {
            $("#div_selectAllRules").removeClass("cc-checkbox-select-all-off");
            $("#div_selectAllRules").removeClass("cc-checkbox-select-all-partial");
            $("#div_selectAllRules").addClass("cc-checkbox-select-all-on");
        }
		if(hasDefaultImportedItem()){
			$("#btn_openRuleFromActionBar").prop("disabled", true);
			$("#btn_editRuleFromActionBar").prop("disabled", true);
			$("#btn_deleteRuleFromActionBar").prop("disabled", true);
		}
    }
    self.onSelectAllRulesCheckboxValueChanged = function (iItem, event) {
        var l_currentClassName = event.currentTarget.className;
		$("#btn_openRuleFromActionBar").prop("disabled", false);
		$("#btn_editRuleFromActionBar").prop("disabled", false);
		$("#btn_deleteRuleFromActionBar").prop("disabled", false);
        if (l_currentClassName == "cc-select-column cc-checkbox-select-all-off" || l_currentClassName == "cc-select-column cc-checkbox-select-all-partial") {
            $(event.currentTarget).removeClass("cc-checkbox-select-all-off");
            $(event.currentTarget).removeClass("cc-checkbox-select-all-partial");
            $(event.currentTarget).addClass("cc-checkbox-select-all-on");
            $("#table_rulesTable").find('tbody .cc-select-column').removeClass("cc-checkbox-off");
            $("#table_rulesTable").find('tbody .cc-select-column').addClass("cc-checkbox-on");
            $("#table_rulesTable").find('tbody tr').css("background-color", "#CBD3D9");
            $("#btn_openRuleFromActionBar").css("display", "none");
            $("#btn_editRuleFromActionBar").css("display", "none");
            $("#btn_deleteRuleFromActionBar").css("display", "inline");
            l_rulesList_model.RulesList().forEach(function (iToken) {
                selectedRulesListMap[iToken["Rule-id"].ItemId] = iToken.Name;
            });
        }
        else if (l_currentClassName == "cc-select-column cc-checkbox-select-all-on") {
            $(event.currentTarget).removeClass("cc-checkbox-select-all-on");
            $(event.currentTarget).addClass("cc-checkbox-select-all-off");
            $("#table_rulesTable").find('tbody .cc-select-column').removeClass("cc-checkbox-on");
            $("#table_rulesTable").find('tbody .cc-select-column').addClass("cc-checkbox-off");
            $("#table_rulesTable").find('tbody tr').css("background-color", "transparent")
            $("#btn_openRuleFromActionBar").css("display", "none");
            $("#btn_editRuleFromActionBar").css("display", "none");
            $("#btn_deleteRuleFromActionBar").css("display", "none");
            selectedRulesListMap = {};
        }
        event.stopPropagation();
		if(hasDefaultImportedItem()){
			$("#btn_openRuleFromActionBar").prop("disabled", true);
			$("#btn_editRuleFromActionBar").prop("disabled", true);
			$("#btn_deleteRuleFromActionBar").prop("disabled", true);
		}
    }
    self.rowDrag = function (data, event, index) {
        self.sourceRuleIndex = index;
    }
    self.rowDrop = function (data, event, index) {
        if (!self.isFilterApplied()) {
            var l_targetIndex = index;
            var l_sourceIndex = self.sourceRuleIndex;
            if (self.sourceRuleIndex !== -1 && (l_targetIndex !== l_sourceIndex)) {
                var l_startIndex = (l_targetIndex > l_sourceIndex) ? l_sourceIndex : l_targetIndex;
                var l_endIndex = (l_targetIndex < l_sourceIndex) ? l_sourceIndex : l_targetIndex;
                var ruleOrderMap = {};
                for (var i = l_startIndex; i <= l_endIndex; i++) {
                    ruleOrderMap[i] = self.RulesList()[i].Order;
                }
                var l_draggedRuleData = self.RulesList()[l_sourceIndex];
                self.RulesList.remove(l_draggedRuleData);
                self.RulesList.splice(l_targetIndex, 0, l_draggedRuleData);
                var l_UpdateParameters = {};
                l_UpdateParameters.RulesToUpdateOrder = {};
                l_UpdateParameters.RulesToUpdateOrder.Rule = [];
                for (var i = l_startIndex; i <= l_endIndex; i++) {
                    var l_ruleForOrderUpdate = {};
                    var l_ruleObject = self.RulesList()[i];
                    l_ruleObject.Order = ruleOrderMap[i];
                    if (l_ruleObject) {
                        l_ruleForOrderUpdate.RuleID = l_ruleObject["Rule-id"].Id;
                        l_ruleForOrderUpdate.RuleItemID = l_ruleObject["Rule-id"].ItemId;
                        l_ruleForOrderUpdate.RuleOrder = ruleOrderMap[i];
                    }
                    l_UpdateParameters.RulesToUpdateOrder.Rule.push(l_ruleForOrderUpdate);
                }
                UpdateRuleOrdersOnDragDrop(l_UpdateParameters);
            }
            self.sourceRuleIndex = -1;
            self.targetRuleIndex = -1;
        }
    }
    self.rowDragEnter = function (data, event, index) {
        self.targetRuleIndex = index;
        event.preventDefault();
    }
    self.rowDragLeave = function (data, event) {
        self.targetRuleIndex = -1;
        event.preventDefault();
    }
    self.rowDragOver = function (data, event, index) {
        self.targetRuleIndex = index;
        event.preventDefault();
    }
    self.allowDrop = function (event) {
        event.preventDefault();
    }
    self.preventDrop = function (event) {
        event.preventDefault();
    }
}
var RulesListFilterModel = function () {
    var self = this;
    var l_ruleNameFilterElement = document.getElementById("input_ruleNameFilter");
    var l_ruleDescriptionFilterElement = document.getElementById("input_ruleDescriptionFilter");
    var l_ruleTypeFilterElement = document.getElementById("input_ruleCTRTypeFilter");
    var l_ruleStateFilterElement = document.getElementById("input_ruleStateFilter");
    var l_ruleCreatedByFilterElement = document.getElementById("input_ruleCreatedByFilter");
    self.ClearRulesListFilter = function () {
        l_ruleNameFilterElement.value = "";
        l_ruleDescriptionFilterElement.value = "";
        l_ruleTypeFilterElement.value = "";
        l_ruleStateFilterElement.value = "";
        l_ruleCreatedByFilterElement.value = "";
    }
    self.getRulesListFilterObject = function () {
        self.CurrentFilterObject = {
            "ruleNameFilter": l_ruleNameFilterElement.value,
            "ruleDescriptionFilter": l_ruleDescriptionFilterElement.value,
            "ruleTypeFilter": l_ruleTypeFilterElement.value,
            "ruleStateFilter": l_ruleStateFilterElement.value,
            "ruleCreatedByFilter": l_ruleCreatedByFilterElement.value,
            "ruleInstanceType" : l_rulesList_model.ruleType().VALUE,
            "offset": rulesListOffsetValue,
            "limit": rulesListLimitValue,
        };
        return self.CurrentFilterObject;
    }
}
var RuleDetailsModel = function () {
    var self = this;

    self.ruleID = ko.observable('');
    self.ruleItemID = ko.observable('');
    self.ruleOrder = ko.observable('');

    self.ruleName = ko.observable('');
    self.ruleDescription = ko.observable('');
    self.ruleSelectedTaskListName = ko.observable('');
    self.ruleSelectedTaskListItemID = ko.observable('');
    self.ruleSelectedOrganizationName = ko.observable('');
    self.ruleSelectedOrganizationItemID = ko.observable('');
    self.ruleSelectedContractTypeID = ko.observable('');
    self.ruleSelectedProcessID = ko.observable('');
    self.ruleSelectedStateID = ko.observable('');
    self.ruleSelectedActionID = ko.observable('');
    self.ruleDefaultActionID = ko.observable('');

    self.contractTypes = ko.observableArray([]);
    self.statesOfSelectedProcess = ko.observableArray([]);
    self.actionsOfSelectedProcess = ko.observableArray([]);
    self.allActionsOfSelectedProcess = [];


    self.ruleLogic = ko.observable();
    self.lastSavedRuleLogic = "";
    self.ruleConditions = ko.observableArray([]);
    self.currentRuleConditionIndex = ko.observable(0);

    self.deletedRuleConditions = ko.observableArray([]);

    self.ruleLogicSummary = ko.observable('');
    self.ruleLogicValidationErrors = ko.observable('');
    
    self.ruleType = l_rulesList_model.ruleType();
    self.stateLabel = ko.observable(self.ruleType.LABEL.slice(0,-1));

    self.updateRelatedActions = function(iItem, iEvent){
        const selectedState = iEvent.currentTarget.options[iEvent.currentTarget.options.selectedIndex].text;
        self.actionsOfSelectedProcess(self.allActionsOfSelectedProcess.filter(action => (
            action.postActiveAction == undefined || (action.postActiveAction == (selectedState == 'Active')))
            ));
        self.ruleSelectedActionID("");
    }

    self.removeRuleCondition = function (data) {
        self.deletedRuleConditions.push(data);
        self.ruleConditions.remove(data);
    }
    self.addRuleCondition = function (i_Item) {
        if (validateCurrentRuleConditionMandatoryFields(i_Item)) {
            var l_ruleCondition = new RuleConditionModel();
            setActionToRuleCondition(l_ruleCondition, 'CRT_RC');
            self.ruleConditions.push(l_ruleCondition);
        }
        translatePage();
    }
}

var RuleConditionModel = function () {
    var self = this;

    self.ownerRuleID = ko.observable('');
    self.ownerRuleItemID = ko.observable('');
    self.ruleConditionID = ko.observable('');
    self.ruleConditionItemID = ko.observable('');

    self.ruleConditionOrder = ko.observable('');
    self.ruleConditionLeftOperandItemID = ko.observable('');
    self.ruleConditionLeftOperandName = ko.observable('');
    self.ruleConditionLeftOperandType = ko.observable('');
    self.ruleConditionLeftOperandDataType = ko.observable('');
    self.ruleConditionLeftOperandPath = ko.observable('');
    self.ruleConditionLeftOperandXpath = ko.observable('');
    self.ruleConditionLeftOperandAttrType = ko.observable('');
    self.ruleConditionLeftOperCustomAttrName = ko.observable('');
    self.ruleConditionLeftOperCustomAttrType = ko.observable('');
    self.ruleConditionLeftOperandValidationMsg = ko.observable('');
    self.ruleConditionSelectedOperator = ko.observable('');
    self.ruleConditionOperatorValidationMsg = ko.observable('');
    self.ruleConditionValue = ko.observable('');
    self.ruleConditionValueType = ko.observable('');
    self.ruleConditionValueValidationMsg = ko.observable('');
    self.defaultResult = ko.observable('false');

    self.ruleConditionBooleanOperators = ko.observableArray([
        { Value: "", Name: "-Select operator-" },
        { Value: "EQUALTO", Name: "Equal to" },
        { Value: "NOTEQUALTO", Name: "Not equal to" }]);
    self.ruleConditionDateOperators = ko.observableArray([
        { Value: "", Name: "-Select operator-" },
        { Value: "EQUALTO", Name: "Equal to" },
        { Value: "NOTEQUALTO", Name: "Not equal to" },
        { Value: "EMPTY", Name: "Empty" },
        { Value: "NOTEMPTY", Name: "Not empty" },
        { Value: "GREATERTHAN", Name: "Greater than" },
        { Value: "GREATERTHANOREQUALTO", Name: "Greater than or equal to" },
        { Value: "LESSTHAN", Name: "Less than" },
        { Value: "LESSTHANOREQUALTO", Name: "Less than or equal to" }]);
    self.ruleConditionDecimalOperators = ko.observableArray([
        { Value: "", Name: "-Select operator-" },
        { Value: "EQUALTO", Name: "Equal to" },
        { Value: "NOTEQUALTO", Name: "Not equal to" },
        { Value: "EMPTY", Name: "Empty" },
        { Value: "NOTEMPTY", Name: "Not empty" },
        { Value: "GREATERTHAN", Name: "Greater than" },
        { Value: "GREATERTHANOREQUALTO", Name: "Greater than or equal to" },
        { Value: "LESSTHAN", Name: "Less than" },
        { Value: "LESSTHANOREQUALTO", Name: "Less than or equal to" }]);
    self.ruleConditionDurationOperators = ko.observableArray([
        { Value: "", Name: "-Select operator-" },
        { Value: "EQUALTO", Name: "Equal to" },
        { Value: "NOTEQUALTO", Name: "Not equal to" },
        { Value: "EMPTY", Name: "Empty" },
        { Value: "NOTEMPTY", Name: "Not empty" },
        { Value: "GREATERTHAN", Name: "Greater than" },
        { Value: "GREATERTHANOREQUALTO", Name: "Greater than or equal to" },
        { Value: "LESSTHAN", Name: "Less than" },
        { Value: "LESSTHANOREQUALTO", Name: "Less than or equal to" }]);
    self.ruleConditionFloatOperators = ko.observableArray([
        { Value: "", Name: "-Select operator-" },
        { Value: "EQUALTO", Name: "Equal to" },
        { Value: "NOTEQUALTO", Name: "Not equal to" },
        { Value: "EMPTY", Name: "Empty" },
        { Value: "NOTEMPTY", Name: "Not empty" },
        { Value: "GREATERTHAN", Name: "Greater than" },
        { Value: "GREATERTHANOREQUALTO", Name: "Greater than or equal to" },
        { Value: "LESSTHAN", Name: "Less than" },
        { Value: "LESSTHANOREQUALTO", Name: "Less than or equal to" }]);
    self.ruleConditionIntegerOperators = ko.observableArray([
        { Value: "", Name: "-Select operator-" },
        { Value: "EQUALTO", Name: "Equal to" },
        { Value: "NOTEQUALTO", Name: "Not equal to" },
        { Value: "EMPTY", Name: "Empty" },
        { Value: "NOTEMPTY", Name: "Not empty" },
        { Value: "GREATERTHAN", Name: "Greater than" },
        { Value: "GREATERTHANOREQUALTO", Name: "Greater than or equal to" },
        { Value: "LESSTHAN", Name: "Less than" },
        { Value: "LESSTHANOREQUALTO", Name: "Less than or equal to" }]);
    self.ruleConditionLongTextOperators = ko.observableArray([
        { Value: "", Name: "-Select operator-" },
        { Value: "EQUALTO", Name: "Equal to" },
        { Value: "NOTEQUALTO", Name: "Not equal to" },
        { Value: "CONTAINS", Name: "Contains" },
        { Value: "EMPTY", Name: "Empty" },
        { Value: "NOTEMPTY", Name: "Not empty" }]);
    self.ruleConditionTextOperators = ko.observableArray([
        { Value: "", Name: "-Select operator-" },
        { Value: "EQUALTO", Name: "Equal to" },
        { Value: "NOTEQUALTO", Name: "Not equal to" },
        { Value: "CONTAINS", Name: "Contains" },
        { Value: "EMPTY", Name: "Empty" },
        { Value: "NOTEMPTY", Name: "Not empty" }]);
    self.ruleConditionEnumeratedTextOperators = ko.observableArray([
        { Value: "", Name: "-Select operator-" },
        { Value: "EQUALTO", Name: "Equal to" },
        { Value: "NOTEQUALTO", Name: "Not equal to" },
        { Value: "EMPTY", Name: "Empty" },
        { Value: "NOTEMPTY", Name: "Not empty" }]);

    self._initialized = ko.observable(false);
    self.ruleConditionDirtyFlag = new ko.oneTimeDirtyFlag(self);

    self.currentRuleCondition = function (iItem, event) {
        l_ruleDetails_model.currentRuleConditionIndex(l_ruleDetails_model.ruleConditions().indexOf(self));
    };

    self.setDefaultResultOfCondition = function(defaultResult){
        if(self.defaultResult()!=defaultResult)
            self.defaultResult(defaultResult);
    }
}
var RuleConditionOperandModal = function () {
    var self = this;

    self.ID = '';
    self.ItemID = '';

    self.Name = '';
    self.Type = '';
    self.DataType = '';
    self.Path = '';
    self.Xpath = '';
}
var ActivityListModel = function () {
    var self = this;
    self.ActivityListList = ko.observableArray([]);
    self.selectedActivityListItemID = ko.observable('');
    self.selectedActivityListName = ko.observable('');
    self.selectActivityListRadioButton = function (iItem, event) {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
        if (iItem["ActivityList-id"]) {
            var l_itemId = iItem["ActivityList-id"].ItemId;
            self.selectedActivityListItemID(l_itemId);
            self.selectedActivityListName(iItem.Name);
        }
    }
    self.onActivityListRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        if (iItem["ActivityList-id"]) {
            var l_itemId = iItem["ActivityList-id"].ItemId;
            self.selectedActivityListItemID(l_itemId);
            self.selectedActivityListName(iItem.Name);
        }
        event.stopPropagation();
    }
}
var OrganizationsListModel = function () {
    var self = this;
    self.OrganizationsList = ko.observableArray([]);
    self.selectedOrganizationItemID = ko.observable('');
    self.selectedOrganizationName = ko.observable('');
    self.selectOrganizationRadioButton = function (iItem, event) {
        if ($("#div_selectAllOrganizations").attr("class") == "cc-checkbox cc-checkbox-off") {
            $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
            $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
            if (iItem["GCOrganization-id"]) {
                var l_itemId = iItem["GCOrganization-id"].ItemId;
                self.selectedOrganizationItemID(l_itemId);
                self.selectedOrganizationName(iItem.Name);
            }
        }
    }
    self.onOrganizationRowRadioButtonValueChanged = function (iItem, event) {
        if ($("#div_selectAllOrganizations").attr("class") == "cc-checkbox cc-checkbox-off") {
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
    self.onAllOrganizationsCheckboxValueChanged = function (iItem, event) {
        var l_currentClassName = event.currentTarget.className;
        if (l_currentClassName == "cc-checkbox cc-checkbox-off") {
            $(event.currentTarget).removeClass("cc-checkbox-off")
            $(event.currentTarget).addClass("cc-checkbox-on")
            $("#table_organizationsList").find('tbody .cc-select-column').removeClass("cc-radio-off");
            $("#table_organizationsList").find('tbody .cc-select-column').removeClass("cc-radio-on");
            $("#table_organizationsList").find('tbody .cc-select-column').addClass("cc-radio-on-disabled");
            $("#input_organizationsSearchFilter").attr("disabled", "disabled");
            $("#input_organizationsSearchFilter").next().css("cursor", "not-allowed")
            self.selectedOrganizationName("All");
            self.selectedOrganizationItemID("");
        }
        else if (l_currentClassName == "cc-checkbox cc-checkbox-on") {
            $(event.currentTarget).removeClass("cc-checkbox-on")
            $(event.currentTarget).addClass("cc-checkbox-off")
            $("#table_organizationsList").find('tbody .cc-select-column').removeClass("cc-radio-on-disabled");
            $("#table_organizationsList").find('tbody .cc-select-column').addClass("cc-radio-off");
            $("#input_organizationsSearchFilter").removeAttr('disabled');
            $("#input_organizationsSearchFilter").next().css("cursor", "pointer")
            self.selectedOrganizationName("");
            self.selectedOrganizationItemID("");
        }
    }
}
const attrType = ["GENERAL", "CUSTOM"];
var RuleConditionLeftOperandModel = function () {
    var self = this;
    self.RuleConditionLeftOperandList = ko.observableArray([]);
    self.RuleConditionCustAttrLeftOperandList = ko.observableArray([]);
    self.selectedRuleConditionLeftOperandItemID = ko.observable('');
    self.selectedRuleConditionLeftOperandName = ko.observable('');
    self.selectedRuleConditionLeftOperandType = ko.observable('');
    self.selectedRuleConditionLeftOperandDataType = ko.observable('');
    self.selectedRuleConditionLeftOperandPath = ko.observable('');
    self.selectedRuleConditionLeftOperandXpath = ko.observable('');
    self.selectedRuleConditionLeftOperandAttrType = ko.observable(attrType[0]);
    self.selectedRuleConditionLeftOperCustomAttrName = ko.observable('');
    self.selectedRuleConditionLeftOperCustomAttrType = ko.observable('');
    self.selectRuleConditionLeftOperandRadioButton = function (iItem, event) {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
        _populateSelectedContractProperty(iItem);
    }
    self.onRuleConditionLeftOperandRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        _populateSelectedContractProperty(iItem);
        event.stopPropagation();
    }

    function _populateSelectedContractProperty(iItem) {
        if (document.getElementById("div_custAttr").children[0].classList.value.indexOf("cc-radio-off") > -1) {
            if (iItem["RuleConditionOperand-id"]) {
                var l_itemId = iItem["RuleConditionOperand-id"].ItemId;
                self.selectedRuleConditionLeftOperandItemID(l_itemId);
                self.selectedRuleConditionLeftOperandName(iItem.DisplayName);
                self.selectedRuleConditionLeftOperandType(iItem.Type);
                self.selectedRuleConditionLeftOperandDataType(iItem.DataType);
                self.selectedRuleConditionLeftOperandPath(iItem.Path);
                self.selectedRuleConditionLeftOperandXpath(iItem.Xpath);
            }
        } else {
            self.selectedRuleConditionLeftOperandAttrType(attrType[1]);
            self.selectedRuleConditionLeftOperandName(getTextValue(iItem.Name));
            self.selectedRuleConditionLeftOperCustomAttrName(getTextValue(iItem.Name));
            self.selectedRuleConditionLeftOperCustomAttrType(getTextValue(iItem.DataType));
            self.selectedRuleConditionLeftOperandDataType(getTextValue(iItem.DataType));
        }
    }
}
var RuleLogicParser = function () {
    var self = this;
    self.l_ruleLogicExpression = "";
    self.parsingPosition = "";
    self.parsingCharacter = "";

    // For error detection.
    self.ruleLogicErrorPosition = "";
    self.ruleLogicErrorCode = "";
    self.ruleLogicExpression = "";
    self.noOfRuleConditions = "";

    self.startParsing = function (i_ruleLogicExpression, i_noOfRuleConditions) {
        var result = false;
        // Check for null, empty and ($ , &, | and Z) symbols.
        if (!i_ruleLogicExpression || i_ruleLogicExpression === "") {
            self.ruleLogicErrorCode = "404";
            return result;
        }
        self.ruleLogicErrorPosition = i_ruleLogicExpression.indexOf("$");
        if (self.ruleLogicErrorPosition >= 0) {
            return false;
        }
        self.ruleLogicErrorPosition = i_ruleLogicExpression.indexOf("&");
        if (self.ruleLogicErrorPosition >= 0) {
            return false;
        }
        self.ruleLogicErrorPosition = i_ruleLogicExpression.indexOf("|");
        if (self.ruleLogicErrorPosition >= 0) {
            return false;
        }
        self.ruleLogicErrorPosition = i_ruleLogicExpression.indexOf("Z");
        if (self.ruleLogicErrorPosition >= 0) {
            return false;
        }
        self.ruleLogicErrorPosition = i_ruleLogicExpression.indexOf("z");
        if (self.ruleLogicErrorPosition >= 0) {
            return false;
        }
        var l_ruleConditionNumbers = i_ruleLogicExpression.match(new RegExp("[0-9]+", "g"));
        if (l_ruleConditionNumbers) {
            for (i = 0; i < l_ruleConditionNumbers.length; i++) {
                if (parseInt(l_ruleConditionNumbers[i]) > parseInt(i_noOfRuleConditions) || parseInt(l_ruleConditionNumbers[i]) == 0) {
                    self.ruleLogicErrorPosition = i_ruleLogicExpression.indexOf(l_ruleConditionNumbers[i]);
                    return false;
                }
            }
            for (i = 1; i <= i_noOfRuleConditions; i++) {
                if (l_ruleConditionNumbers.indexOf(i.toString()) == -1) {
                    self.ruleLogicErrorCode = "Condition \"" + i + "\" is not used in the logic. Include all the conditions before validating the logic.";
                    return false;
                }
            }
        }
        // Replace all integers with z.
        var l_expression = i_ruleLogicExpression.replace(new RegExp("[0-9]+", "g"), "z");
        // to lower case.
        l_expression = l_expression.toLowerCase();
        // Replace and with &, or with |.
        l_expression = l_expression.replace(new RegExp("(and)+", "g"), "&")
        l_expression = l_expression.replace(new RegExp("(or)", "g"), "|");
        // Remove all spaces.
        l_expression = l_expression.replace(new RegExp("[ ]+", "g"), "");

        // Initialize;
        self.l_ruleLogicExpression = l_expression + '$'; // Append $ at the end.
        self.ruleLogicExpression = i_ruleLogicExpression + '$';
        self.parsingPosition = 0;
        self.parsingCharacter = self.l_ruleLogicExpression.charAt(self.parsingPosition);
        self.ruleLogicErrorPosition = 0;

        // Start execution.
        l_validationResult = self.initiateValidation();
        if (l_validationResult)
            self.ruleLogicErrorPosition = -2;
        return l_validationResult;
    }
    self.initiateValidation = function () {
        if ('z' == self.parsingCharacter) {
            self.matchExpCharacters();
            return self.validateExpression();
        } else if ('(' == self.parsingCharacter) {
            self.matchExpCharacters();
            self.initiateValidation();
            if (')' == self.parsingCharacter) {
                self.matchExpCharacters();
                return self.validateExpression();
            } else {
                return false;
            }
        }
        self.skipSpacesInOriginalExpression();
        return false;
    }
    self.validateExpression = function () {
        if ('&' == self.parsingCharacter || '|' == self.parsingCharacter) {
            self.matchExpCharacters();
            var matched = self.initiateValidation();
            return matched ? self.validateExpression() : matched;
        }
        return (self.parsingCharacter == '$' && (self.parsingPosition + 1) == self.l_ruleLogicExpression.length);
    }
    self.matchExpCharacters = function () {
        self.updateErrorPosition();
        if (self.parsingPosition < self.l_ruleLogicExpression.length - 1) {
            self.parsingCharacter = self.l_ruleLogicExpression.charAt(++self.parsingPosition);
        }
    }
    self.updateErrorPosition = function () {
        // Skip space in original string.
        self.skipSpacesInOriginalExpression();
        if (self.parsingPosition < self.l_ruleLogicExpression.length - 1) {
            if (self.parsingCharacter == '(' || self.parsingCharacter == ')')
                self.ruleLogicErrorPosition++;
            else if (self.parsingCharacter == '&')
                self.ruleLogicErrorPosition = self.ruleLogicErrorPosition + 3;
            else if (self.parsingCharacter == '|')
                self.ruleLogicErrorPosition = self.ruleLogicErrorPosition + 2;
            else if (self.parsingCharacter == 'z') {
                // Skip continuous digits in original string.
                while (self.ruleLogicExpression.charAt(self.ruleLogicErrorPosition) >= '0' && self.ruleLogicExpression.charAt(self.ruleLogicErrorPosition) <= '9') {
                    self.ruleLogicErrorPosition++;
                }
            }
        }
        self.skipSpacesInOriginalExpression();
    }
    self.skipSpacesInOriginalExpression = function () {
        while (self.ruleLogicExpression.charAt(self.ruleLogicErrorPosition) == ' ') {
            self.ruleLogicErrorPosition++;
        }
    }
    self.getErrorPosition = function () {
        return self.ruleLogicErrorPosition;
    }
    self.getErrorCode = function () {
        return self.ruleLogicErrorCode;
    }
}
var ActivityListDetails = function () {
    var self = this;
    self.tasks = ko.observableArray([]);
}
var Task = function () {
    var self = this;

    self.type = ko.observable('');
    self.name = ko.observable('');
    self.description = ko.observable('');
};

var RuleTabsModel = function(){
    let self = this;
    self.allTabs = Object.values(RLMetadata);
    self.selectedTab = ko.observable(RLMetadata.CLAUSE.TYPE);
    self.loadSelectedTab = (iItem) => {
        self.selectedTab(iItem.TYPE);
        l_rulesList_model.ruleType(RLMetadata[iItem.TYPE]);
        l_ruleDetails_model.stateLabel(RLMetadata[iItem.TYPE].LABEL.slice(0,-1));
        listRules();
    }
}

let isCTRType = () =>{
    return l_rulesList_model.ruleType().TYPE === RLMetadata.CONTRACT.TYPE;
}

let isCLATEMPType = () =>{
    return l_rulesList_model.ruleType().TYPE === RLMetadata.CLAUSE.TYPE || l_rulesList_model.ruleType().TYPE === RLMetadata.TEMPLATE.TYPE;
}

let isOBLType = () =>{
    return l_rulesList_model.ruleType().TYPE === RLMetadata.OBLIGATION.TYPE;
}

$(function () {
    var i_locale = getlocale();
    var rtl_css = '../../../../../com/opentext/apps/utils/css/rtlappscommon.css';
    translateLabels("com/opentext/apps/commoncomponents/CCConfigurableWorkflow/CCConfigurableWorkflow", i_locale);
    loadRTLIfRequired(i_locale, rtl_css);

    if (window.parent.parent) {
        rulesListIframe = $('[src*="ruleslist.htm"]', window.parent.parent.document);
        if (rulesListIframe) {
            rulesListIframe.css('border', 'none');
        }
    }

    createToastDiv();
    l_rulesList_model = new RulesListModel();
    ko.applyBindings(l_rulesList_model, document.getElementById("div_ruleListData"));
    l_rulesListFilter_model = new RulesListFilterModel();
    ko.applyBindings(new RuleTabsModel(), $("#div_rulesListTabs")[0]);
    ko.applyBindings(l_rulesListFilter_model, document.getElementById("div_ruleListFilter"));
    l_ruleDetails_model = new RuleDetailsModel();
    ko.applyBindings(l_ruleDetails_model, document.getElementById("div_createOrUpdateRuleModal"));
    l_activityListForSelection_model = new ActivityListModel();
    ko.applyBindings(l_activityListForSelection_model, document.getElementById("div_selectRuleActivityListModal"));
    l_organizationsForSelection_model = new OrganizationsListModel();
    ko.applyBindings(l_organizationsForSelection_model, document.getElementById("div_selectOrganizationModal"));
    l_ruleConditionLeftOperandForSelection_model = new RuleConditionLeftOperandModel();
    ko.applyBindings(l_ruleConditionLeftOperandForSelection_model, document.getElementById("div_selectRuleConditionLeftOperandModal"));
    l_activityListDetails_model = new ActivityListDetails();
    ko.applyBindings(l_activityListDetails_model, document.getElementById("div_viewSelectedActivityListDetailsModal"));
    hideRulesListFilter();
    listRules();

    $("#btn_filterRuleList").click(function (iEventObject) {
        if ($("#div_ruleListFilter").attr('apps-toggle') == "expanded") {
            $("#div_ruleListFilter").toggle();
            document.getElementById("div_ruleListFilter").setAttribute("apps-toggle", 'collapsed');
            $("#div_ruleListData").removeClass("col-md-9");
            $("#div_ruleListData").addClass("col-md-12");
        }
        else if ($("#div_ruleListFilter").attr('apps-toggle') == "collapsed") {
            $("#div_ruleListFilter").toggle();
            //setTimeout(function () { $("#div_ruleListFilter").toggle('slow'); }, 0);
            document.getElementById("div_ruleListFilter").setAttribute("apps-toggle", 'expanded');
            $("#div_ruleListData").removeClass("col-md-12");
            $("#div_ruleListData").addClass("col-md-9");
        }
    });
    $(".cc-filter-header").click(function (iEventObject) {
        var l_headerSpan = $(this)
        l_headerSpan.next().slideToggle();
        if (l_headerSpan.attr('apps-toggle') == "expanded") {
            hideOrShowRulesFilterContainerBody(l_headerSpan[0], false);
        }
        else if (l_headerSpan.attr('apps-toggle') == "collapsed") {
            hideOrShowRulesFilterContainerBody(l_headerSpan[0], true);
        }
    });
});
function hideRulesListFilter() {
    $("#div_ruleListFilter").hide();
    document.getElementById("div_ruleListFilter").setAttribute("apps-toggle", 'collapsed');
    $("#div_ruleListData").removeClass("col-md-9");
    $("#div_ruleListData").addClass("col-md-12");
}
function listRules() {
    $("#btn_openRuleFromActionBar").css("display", "none");
    $("#btn_editRuleFromActionBar").css("display", "none");
    $("#btn_deleteRuleFromActionBar").css("display", "none");
    $("#div_selectAllRules").removeClass("cc-checkbox-select-all-partial");
    $("#div_selectAllRules").removeClass("cc-checkbox-select-all-on");
    $("#div_selectAllRules").addClass("cc-checkbox-select-all-off");
    selectedRulesListMap = {};
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/configworkflow/20.2",
        method: "GetRulesWithFilters",
        parameters: l_rulesListFilter_model.getRulesListFilterObject(),
        success: function (data) {
            addDataToRulesListView(data.FindZ_INT_RulesListResponse.Rule, l_rulesList_model);
            if (undefined != data.FindZ_INT_RulesListResponse["@total"]) {
                l_rulesList_model.numOfRules(data.FindZ_INT_RulesListResponse["@total"]);
            } else {
                l_rulesList_model.numOfRules(0);
            }
            if (l_rulesList_model.numOfRules() != 0) {
                l_rulesList_model.numOfPages(Math.ceil(l_rulesList_model.numOfRules() / rulesListLimitValue));
            } else {
                l_rulesList_model.numOfPages(1);
            }
            updatePaginationParams();
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_listErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the rules. Contact your administrator."), 10000);
            return false;
        }
    });
}
function addDataToRulesListView(iElementList, iModel) {
    iModel.RulesList.removeAll();
    if (iElementList) {
        if (iElementList.length) {
            iModel.numOfRulesInCurrentPage(iElementList.length);
            iElementList.forEach(function (iElement) {
                iModel.RulesList.push(iElement);
            });
        }
        else {
            iModel.numOfRulesInCurrentPage("1");
            iModel.RulesList.push(iElementList);
        }
    }
}
function hideOrShowRulesFilterContainerBody(iElement, iShow) {
    if (iShow) {
        iElement.setAttribute("apps-toggle", 'expanded');
        iElement.lastElementChild.src = "../../../../../com/opentext/apps/utils/img/caret_up.svg";
    }
    else {
        iElement.setAttribute("apps-toggle", 'collapsed');
        iElement.lastElementChild.src = "../../../../../com/opentext/apps/utils/img/caret_down.svg";
    }
}
function updateLimitValue(iElement) {
    rulesListOffsetValue = 0;
    l_rulesList_model.currentPage('1');
    rulesListLimitValue = $(iElement).val();
    listRules();
}
function callOpenRuleCreateForm() {
    openRuleCreateOrEditForm();
}
function callOpenRuleSummaryForm() {
    if (Object.keys(selectedRulesListMap).length == 1) {
        openRuleCreateOrEditForm(Object.keys(selectedRulesListMap)[0]);
    }
}
function openRuleCreateOrEditForm(i_ruleItemID) {
    $('#div_createOrUpdateRuleModal').modal({
        backdrop: 'static',
        keyboard: false
    })
    clearRuleDetailsModelData();
    if (i_ruleItemID) {
        $("#span_createOrEditModalHeading").text(getTranslationMessage("Edit") + " ");
        $("#btn_createOrUpdateRule").text(getTranslationMessage("Update rule"));
        loadRuleDetails(i_ruleItemID);
    } else {
        $("#span_createOrEditModalHeading").text(getTranslationMessage("Create") + " ");
        $("#btn_createOrUpdateRule").text(getTranslationMessage("Create rule"));
        loadRuleDetails("");
    }
}

function getGCActionByProcessIDAndPurpose(l_processItemID, callback){
    let reqObj = {};
    let methodName;
    let addToDropDown = false;
    reqObj.processID = l_processItemID;
    reqObj.purpose = l_rulesList_model.ruleType().PURPOSE;
    
    if(isCTRType() || isOBLType()){
        methodName = "GetAllGCActionByProcessIDAndPurpose";
        addToDropDown = true;
    }else{
        methodName = "GetGCActionByProcessIDAndPurpose";
        reqObj.actionName = "SendForReview";
    }
    
    $.cordys.ajax({
        namespace: "http://schemas/OpenTextBasicComponents/GCProcess.RelatedGCActions/operations",
        method: methodName,
        parameters:reqObj,
        success: function (data) {
            if(data.RelatedGCActions){
                if(addToDropDown){
                    addDataToActionDropdown(data.RelatedGCActions, l_ruleDetails_model)
                }else{
                    if (data.RelatedGCActions["RelatedGCActions-id"].Id1) {
                        l_ruleDetails_model.ruleDefaultActionID(data.RelatedGCActions["RelatedGCActions-id"].Id1);
                    }
                }
            }
            callback(SUCCESS);
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while loading the rule data. Contact your administrator."), 10000);
            return false;
        }
    });

}
function loadRuleDetails(i_ruleItemID) {
    let reqObj = {};
    reqObj.processName = l_rulesList_model.ruleType().PROCESS;
    reqObj.purpose = l_rulesList_model.ruleType().PURPOSE;

    $.cordys.ajax({
        namespace: "http://schemas/OpenTextBasicComponents/GCProcess/operations",
        method: "GetGCProcessByNameAndPurpose",
        parameters: reqObj,
        success: function (data) {
            var l_processItemID = "";
            if (data.GCProcess && data.GCProcess["GCProcess-id"] && data.GCProcess["GCProcess-id"].Id) {
                l_processItemID = data.GCProcess["GCProcess-id"].Id;
                l_ruleDetails_model.ruleSelectedProcessID(l_processItemID);
                
                getGCActionByProcessIDAndPurpose(l_processItemID, function(status){
                    if(status == SUCCESS){
                        reqObj = {};
                        reqObj.processID = l_processItemID;
                        reqObj.purpose = l_rulesList_model.ruleType().PURPOSE;
                        $.cordys.ajax({
                            namespace: "http://schemas/OpenTextBasicComponents/GCProcess.RelatedGCState/operations",
                            method: "GetGCStatesByProcessIDAndPurpose",
                            parameters:reqObj,
                            success: function (data) {
                                if (data.RelatedGCState) {
                                    addDataToStateDropdown(data.RelatedGCState, l_ruleDetails_model);
                                }
								if (i_ruleItemID) {
                                            loadRuleinstanceData(i_ruleItemID);
                                            $("#select_ruleContractType").css('cursor', '');
                                            $("#select_ruleContractType").removeAttr("disabled");
                                } else {
										addContractTypesDataToRuleBasicDetailsView(l_ruleDetails_model, data.RelatedGCState);
                                        if(isCTRType() || isOBLType()){
                                            var ruleCondition = new RuleConditionModel();
                                            l_ruleDetails_model.lastSavedRuleLogic = "";
                                            l_ruleDetails_model.ruleConditions.push(ruleCondition);
                                            if((l_ruleDetails_model.ruleSelectedOrganizationItemID()=="" || l_ruleDetails_model.ruleSelectedOrganizationItemID()==undefined) && (l_ruleDetails_model.ruleSelectedOrganizationName()=="" || l_ruleDetails_model.ruleSelectedOrganizationName()==undefined)){
                                                $("#select_ruleContractType").css('cursor', 'not-allowed');
                                                $("#select_ruleContractType").attr("disabled", "disabled");
                                            }
                                        }else{
                                            $("#select_ruleContractType").css('cursor', '');
                                            $("#select_ruleContractType").removeAttr("disabled");
                                        }

                                }
                                translatePage();
                            },
                            error: function (responseFailure) {
                                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while loading the contract states. Contact your administrator."), 10000);
                                return false;
                            }
                        });
                    }
                });
            }
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while loading the rule data. Contact your administrator."), 10000);
            return false;
        }
    });
}
function addDataToContractTypeDropdown(iElementList, iModel) {
    
    if (iElementList) {
        if (iElementList.length) {
            iElementList.forEach(function (iElement) {
                iModel.contractTypes.push({ "contractTypeID": iElement["GCType-id"].Id, "contractTypeName": iElement.Name, selected: false });
            });
        }
        else {
            iModel.contractTypes.push({ "contractTypeID": iElementList["GCType-id"].Id, "contractTypeName": iElementList.Name, selected: false });
        }
    }
	
}
function addDataToStateDropdown(iElementList, iModel) {
    iModel.statesOfSelectedProcess.removeAll();
    iModel.statesOfSelectedProcess.push({ "GCStateID": defaultIDforSelectDropdown, "GCStateName": getTranslationMessage("-Select-") });
    if (iElementList) {
        if (iElementList.length) {
            iElementList.forEach(function (iElement) {
                iModel.statesOfSelectedProcess.push({ "GCStateID": iElement["RelatedGCState-id"].Id1, "GCStateName": iElement.Name});
            });
        }
        else {
            iModel.statesOfSelectedProcess.push({ "GCStateID": iElementList["RelatedGCState-id"].Id1, "GCStateName": iElementList.Name});
        }
    }
}
function addDataToActionDropdown(iElementList, iModel) {
    iModel.allActionsOfSelectedProcess = [];
        iModel.allActionsOfSelectedProcess.push({ "GCActionID": defaultIDforSelectDropdown, "GCActionName": getTranslationMessage("-Select-") });
        if (iElementList) {
            if (iElementList.length) {
                iElementList.forEach(function (iElement) {
                    iModel.allActionsOfSelectedProcess.push({ "GCActionID": iElement["RelatedGCActions-id"].Id1, "GCActionName": actionNameLabelMap.get(iElement.Name), postActiveAction: iElement.Name !== 'SendForReview' });
                });
            }
            else {
                iModel.allActionsOfSelectedProcess.push({ "GCActionID": iElementList["RelatedGCActions-id"].Id1, "GCActionName": actionNameLabelMap.get(iElementList.Name), postActiveAction: iElementList.Name !== 'SendForReview' });
            }
        }
    if(isOBLType()){
        iModel.actionsOfSelectedProcess(iModel.allActionsOfSelectedProcess);
    }
}

function loadRuleinstanceData(i_ruleItemID) {
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/configworkflow/20.2",
        method: "GetRuleInstanceData",
        parameters:
        {
            "ruleInstanceID": getIDfromItemID(i_ruleItemID)
        },
        success: function (data) {
            if (data.ruleInstanceData) {
				addDataToRuleBasicDetailsView(data.ruleInstanceData, l_ruleDetails_model);
            }
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while loading the rule details. Contact your administrator."), 10000);
            return false;
        }
    });
}

function addDataToRuleBasicDetailsView(iElement, iModel){
	l_iElement = iElement.ruleBasicDetails.FindZ_INT_AllRulesListResponse.Rule;
	if (l_iElement["RelatedGCOrganization"]) {
        iModel.ruleSelectedOrganizationName(getTextValue(l_iElement["RelatedGCOrganization"].Name));
        iModel.ruleSelectedOrganizationItemID(l_iElement["RelatedGCOrganization"]["GCOrganization-id"].ItemId);
    } else {
        iModel.ruleSelectedOrganizationName("All");
        $("#div_selectAllOrganizations").removeClass("cc-checkbox-off")
        $("#div_selectAllOrganizations").addClass("cc-checkbox-on")
    }
	
	addContractTypesDataToRuleBasicDetailsView(iModel, iElement, addRemainingDataToRuleBasicDetailsView);
}

function addContractTypesDataToRuleBasicDetailsView(iModel, iElement, addDataToRuleBasicDetailsView) {
	if(!iModel.ruleSelectedOrganizationItemID()){
		$.cordys.ajax({
			namespace: "http://schemas/OpenTextBasicComponents/GCType/operations",
			method: "GetActiveTypes",
			parameters: {},
			success: function (data) {
				iModel.contractTypes.removeAll();
				iModel.contractTypes.push({ "contractTypeID": defaultIDforSelectDropdown, "contractTypeName": getTranslationMessage("All contract types") });
				if (data.GCType) {
					addDataToContractTypeDropdown(data.GCType, iModel);
				}  
                if(addDataToRuleBasicDetailsView){
                    addDataToRuleBasicDetailsView(iElement, iModel);
                }
			},
			error: function (responseFailure) {
				showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while loading the contract types. Contact your administrator."), 10000);
				return false;
			}
		});
	}else{
		$.cordys.ajax({
			namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
			method: "GetFilteredCtrTypes",
			parameters: {"OrgID": iModel.ruleSelectedOrganizationItemID().split('.')[1]},
			success: function (data) {
				iModel.contractTypes.removeAll();
				iModel.contractTypes.push({ "contractTypeID": defaultIDforSelectDropdown, "contractTypeName": getTranslationMessage("All contract types") });
				if (data.filteredTypes.FindZ_INT_FilteredTypesResponse.GCType) {
					addDataToContractTypeDropdown(data.filteredTypes.FindZ_INT_FilteredTypesResponse.GCType, iModel);
				}  
                if(addDataToRuleBasicDetailsView){
                    addDataToRuleBasicDetailsView(iElement, iModel);
                }
			},
			error: function (responseFailure) {
				showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while loading the contract types. Contact your administrator."), 10000);
				return false;
			}
		});
	}
}

function addRemainingDataToRuleBasicDetailsView(iElement, iModel) {
    l_iElement = iElement.ruleBasicDetails.FindZ_INT_AllRulesListResponse.Rule;
    
    iModel.ruleID(l_iElement["Rule-id"].Id);
    iModel.ruleItemID(l_iElement["Rule-id"].ItemId);
    iModel.ruleOrder(l_iElement.Order);

    iModel.ruleName(l_iElement.Name);
    iModel.ruleDescription(l_iElement.Description);
    iModel.ruleSelectedTaskListName(getTextValue(l_iElement["RelatedActivityList"].Name));

	
    iModel.ruleSelectedTaskListItemID(l_iElement["RelatedActivityList"]["ActivityList-id"].ItemId);
    if(l_iElement["RelatedGCType"] && l_iElement["RelatedGCType"]["GCType-id"]){
        iModel.ruleSelectedContractTypeID(l_iElement["RelatedGCType"]["GCType-id"].Id);
    }
    iModel.ruleSelectedProcessID(l_iElement["RelatedGCProcess"]["GCProcess-id"].Id);

    if(!isOBLType()){
        iModel.ruleSelectedStateID(l_iElement["RelatedGCState"]["RelatedGCState-id"].Id1);
    }
    
    if(isCTRType()){
        l_ruleDetails_model.actionsOfSelectedProcess(l_ruleDetails_model.allActionsOfSelectedProcess.filter(action => (
            action.postActiveAction==undefined || (action.postActiveAction == (getTextValue(l_iElement.RelatedGCState.Name) == 'Active')))
            ));
            iModel.ruleSelectedActionID(l_iElement["RelatedGCAction"]["RelatedGCActions-id"].Id1);
    }

    if(isOBLType()){
        l_ruleDetails_model.actionsOfSelectedProcess(l_ruleDetails_model.allActionsOfSelectedProcess);
        iModel.ruleSelectedActionID(l_iElement["RelatedGCAction"]["RelatedGCActions-id"].Id1);
    }
        
    iModel.ruleLogic(l_iElement.Logic);
    iModel.lastSavedRuleLogic = l_iElement.Logic;
    var ruleConditionOperandList = [];
    if (iElement.ruleLeftOperands) {
        var l_ruleLeftOperands = iElement.ruleLeftOperands.RuleConditionOperand;
        if (l_ruleLeftOperands) {
            if (l_ruleLeftOperands.length) {
                for (var i = 0; i < l_ruleLeftOperands.length; i++) {
                    var ruleLeftOperand = formRuleLeftOperandDetails(l_ruleLeftOperands[i]);
                    if (ruleLeftOperand) {
                        ruleConditionOperandList[ruleLeftOperand.ID] = ruleLeftOperand;
                    }
                }
            }
            else {
                var ruleLeftOperand = formRuleLeftOperandDetails(l_ruleLeftOperands);
                if (ruleLeftOperand) {
                    ruleConditionOperandList[ruleLeftOperand.ID] = ruleLeftOperand;
                }
            }
        }
    }
    if (iElement.ruleConditions) {
        addDataToRuleConditionsView(iElement.ruleConditions, iModel, ruleConditionOperandList);
    } else {
        var ruleCondition = new RuleConditionModel();
        //ruleCondition.ruleConditionOrder("1");
        iModel.ruleConditions.push(ruleCondition);
    }
}
function addDataToRuleConditionsView(iElement, iModel, ruleConditionOperandList) {
    l_ruleConditions = iElement.RuleConditions;
    ruleConditionList = [];
    if (l_ruleConditions) {
        if (l_ruleConditions.length) {
            for (var i = 0; i < l_ruleConditions.length; i++) {
                var ruleCondition = new RuleConditionModel();

                ruleCondition.ownerRuleID(l_ruleConditions[i].Owner["Rule-id"].Id);
                ruleCondition.ownerRuleItemID(l_ruleConditions[i].Owner["Rule-id"].ItemId);
                ruleCondition.ruleConditionID(l_ruleConditions[i]["RuleConditions-id"].Id1);
                ruleCondition.ruleConditionItemID(l_ruleConditions[i]["RuleConditions-id"].ItemId1);

                ruleCondition.ruleConditionOrder(l_ruleConditions[i].Order);
                if (l_ruleConditions[i].LeftOperandType != "CUSTOM") {
                    ruleCondition.ruleConditionLeftOperandItemID(l_ruleConditions[i].RuleLeftOperand["RuleConditionOperand-id"].ItemId);
                    ruleCondition.ruleConditionLeftOperandName(ruleConditionOperandList[l_ruleConditions[i].RuleLeftOperand["RuleConditionOperand-id"].Id].DisplayName);
                    ruleCondition.ruleConditionLeftOperandType(ruleConditionOperandList[l_ruleConditions[i].RuleLeftOperand["RuleConditionOperand-id"].Id].Type);
                    ruleCondition.ruleConditionLeftOperandDataType(ruleConditionOperandList[l_ruleConditions[i].RuleLeftOperand["RuleConditionOperand-id"].Id].DataType);
                    ruleCondition.ruleConditionLeftOperandPath(ruleConditionOperandList[l_ruleConditions[i].RuleLeftOperand["RuleConditionOperand-id"].Id].Path);
                    ruleCondition.ruleConditionLeftOperandXpath(ruleConditionOperandList[l_ruleConditions[i].RuleLeftOperand["RuleConditionOperand-id"].Id].Xpath);
                    ruleCondition.ruleConditionLeftOperandAttrType(ruleConditionOperandList[l_ruleConditions[i].RuleLeftOperand["RuleConditionOperand-id"].Id].AttrType);
                    ruleCondition.ruleConditionLeftOperCustomAttrName(ruleConditionOperandList[l_ruleConditions[i].RuleLeftOperand["RuleConditionOperand-id"].Id].CustomAttrName);
                    ruleCondition.ruleConditionLeftOperCustomAttrType(ruleConditionOperandList[l_ruleConditions[i].RuleLeftOperand["RuleConditionOperand-id"].Id].CustomAttrType);
                    ruleCondition.ruleConditionLeftOperandAttrType('GENERAL');
                } else {
                    ruleCondition.ruleConditionLeftOperandItemID('');
                    ruleCondition.ruleConditionLeftOperandName(l_ruleConditions[i].CustomAttrName);
                    ruleCondition.ruleConditionLeftOperandType('');
                    ruleCondition.ruleConditionLeftOperandDataType(l_ruleConditions[i].CustomAttrType);
                    ruleCondition.ruleConditionLeftOperandPath('');
                    ruleCondition.ruleConditionLeftOperandXpath('');
                    ruleCondition.ruleConditionLeftOperandAttrType('CUSTOM');
                    ruleCondition.ruleConditionLeftOperCustomAttrName(l_ruleConditions[i].CustomAttrName);
                    ruleCondition.ruleConditionLeftOperCustomAttrType(l_ruleConditions[i].CustomAttrType);
                }

                ruleCondition.ruleConditionSelectedOperator(l_ruleConditions[i].Operator);
                ruleCondition.ruleConditionValue(l_ruleConditions[i].Value);
                ruleCondition.ruleConditionValueType(l_ruleConditions[i].ValueType);
                if(l_ruleConditions[i].DefaultResult && l_ruleConditions[i].DefaultResult.toLowerCase()=="true"){
                    ruleCondition.defaultResult('true');
                }
                
                ruleCondition._initialized(true);

                if (ruleCondition) {
                    ruleConditionList[ruleCondition.ruleConditionID()] = ruleCondition;
                }
            }
        }
        else {
            var ruleCondition = new RuleConditionModel();

            ruleCondition.ownerRuleID(l_ruleConditions.Owner["Rule-id"].Id);
            ruleCondition.ownerRuleItemID(l_ruleConditions.Owner["Rule-id"].ItemId);
            ruleCondition.ruleConditionID(l_ruleConditions["RuleConditions-id"].Id1);
            ruleCondition.ruleConditionItemID(l_ruleConditions["RuleConditions-id"].ItemId1);

            ruleCondition.ruleConditionOrder(l_ruleConditions.Order);
            if (l_ruleConditions.LeftOperandType != "CUSTOM") {
                ruleCondition.ruleConditionLeftOperandItemID(l_ruleConditions.RuleLeftOperand["RuleConditionOperand-id"].ItemId);
                ruleCondition.ruleConditionLeftOperandName(ruleConditionOperandList[l_ruleConditions.RuleLeftOperand["RuleConditionOperand-id"].Id].DisplayName);
                ruleCondition.ruleConditionLeftOperandType(ruleConditionOperandList[l_ruleConditions.RuleLeftOperand["RuleConditionOperand-id"].Id].Type);
                ruleCondition.ruleConditionLeftOperandDataType(ruleConditionOperandList[l_ruleConditions.RuleLeftOperand["RuleConditionOperand-id"].Id].DataType);
                ruleCondition.ruleConditionLeftOperandPath(ruleConditionOperandList[l_ruleConditions.RuleLeftOperand["RuleConditionOperand-id"].Id].Path);
                ruleCondition.ruleConditionLeftOperandXpath(ruleConditionOperandList[l_ruleConditions.RuleLeftOperand["RuleConditionOperand-id"].Id].Xpath);
                ruleCondition.ruleConditionLeftOperandAttrType(ruleConditionOperandList[l_ruleConditions.RuleLeftOperand["RuleConditionOperand-id"].Id].AttrType);
                ruleCondition.ruleConditionLeftOperCustomAttrName(ruleConditionOperandList[l_ruleConditions.RuleLeftOperand["RuleConditionOperand-id"].Id].CustomAttrName);
                ruleCondition.ruleConditionLeftOperCustomAttrType(ruleConditionOperandList[l_ruleConditions.RuleLeftOperand["RuleConditionOperand-id"].Id].CustomAttrType);
                ruleCondition.ruleConditionLeftOperandAttrType('GENERAL');
            } else {
                ruleCondition.ruleConditionLeftOperandItemID('');
                ruleCondition.ruleConditionLeftOperandName(l_ruleConditions.CustomAttrName);
                ruleCondition.ruleConditionLeftOperandType('');
                ruleCondition.ruleConditionLeftOperandDataType(l_ruleConditions.CustomAttrType);
                ruleCondition.ruleConditionLeftOperandPath('');
                ruleCondition.ruleConditionLeftOperandXpath('');
                ruleCondition.ruleConditionLeftOperandAttrType('CUSTOM');
                ruleCondition.ruleConditionLeftOperCustomAttrName(l_ruleConditions.CustomAttrName);
                ruleCondition.ruleConditionLeftOperCustomAttrType(l_ruleConditions.CustomAttrType);
            }

            ruleCondition.ruleConditionSelectedOperator(l_ruleConditions.Operator);
            ruleCondition.ruleConditionValue(l_ruleConditions.Value);
            ruleCondition.ruleConditionValueType(l_ruleConditions.ValueType);
            if(l_ruleConditions.DefaultResult && l_ruleConditions.DefaultResult.toLowerCase()=="true"){
                ruleCondition.defaultResult('true');
            }
            ruleCondition._initialized(true);

            if (ruleCondition) {
                ruleConditionList[ruleCondition.ruleConditionID()] = ruleCondition;
            }
        }

        function _populateCustomAttrRuleCondition(ruleCondition, ruleConditionOperandList, l_ruleConditions) {

        }

        //var ruleConditionItems = Object.values(ruleConditionList);
        var ruleConditionItems = Object.keys(ruleConditionList).map(function (e) {
            return ruleConditionList[e]
        })
        ruleConditionItems.sort(compare);
        for (var i = 0; i < ruleConditionItems.length; i++) {
            iModel.ruleConditions.push(ruleConditionItems[i]);
        }
        generateRuleSummary();
    }
    else {
        var ruleCondition = new RuleConditionModel();
        //ruleCondition.ruleConditionOrder("1");
        iModel.ruleConditions.push(ruleCondition);
    }
}
function compare(a, b) {
    if (a.ruleConditionOrder() < b.ruleConditionOrder()) {
        return -1;
    }
    if (a.ruleConditionOrder() > b.ruleConditionOrder()) {
        return 1;
    }
    return 0;
}
function formRuleLeftOperandDetails(iElement) {
    if (iElement) {
        var ruleConditionOperand = new RuleConditionOperandModal();

        ruleConditionOperand.ID = iElement['RuleConditionOperand-id'].Id;
        ruleConditionOperand.ItemID = iElement['RuleConditionOperand-id'].ItemId;

        ruleConditionOperand.Name = getTextValue(iElement.Name);
        ruleConditionOperand.DisplayName = getTextValue(iElement.DisplayName);
        ruleConditionOperand.Type = getTextValue(iElement.Type);
        ruleConditionOperand.DataType = getTextValue(iElement.DataType);
        ruleConditionOperand.Path = getTextValue(iElement.Path);
        ruleConditionOperand.Xpath = getTextValue(iElement.Xpath);
        return ruleConditionOperand;
    }
}
function changeRuleStatus(iItemID, iStatus) {
    $("#div_changeRuleStatusModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    $('button#btn_changeRuleStatusYes').off("click");
    $('button#btn_changeRuleStatusYes').on('click', function (_event) {
        $.cordys.ajax({
            namespace: "http://schemas/OpenTextCCConfigurableWorkflow/Rule/operations",
            method: "UpdateRule",
            parameters:
            {
                "Rule-id": { "ItemId": iItemID },
                "Rule-update": { "Status": iStatus }
            },
            success: function (data) {
                successToast(3000, getTranslationMessage("Rule status changed."));
                listRules();
            },
            error: function (responseFailure) {
                showOrHideErrorInfo("div_listErrorInfoArea", true, getTranslationMessage("An error occurred while changing the rule status. Contact your administrator."), 10000);
                return false;
            }
        });
    });
}
function deleteRuleFromRow(iItemID, i_ruleName) {
    $("#div_deleteRuleModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    $("#span_NumOfRulesToDelete").text(i_ruleName);
    $('button#btn_deleteRuleYes').off("click");
    $('button#btn_deleteRuleYes').on('click', function (_event) {
        deleteRule(iItemID);
    });
}
function deleteRule(iItemID) {
    $.cordys.ajax({
        namespace: "http://schemas/OpenTextCCConfigurableWorkflow/Rule/operations",
        method: "DeleteRule",
        parameters:
        {
            "Rule-id": { "ItemId": iItemID },
        },
        success: function (data) {
            successToast(3000, getTranslationMessage("Rule deleted."));
            listRules();
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_listErrorInfoArea", true, getTranslationMessage("An error occurred while deleting the rule. Contact your administrator."), 10000);
            return false;
        }
    });
}
function deleteRuleFromActionBar() {
    $("#div_deleteRuleModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    //$("#span_NumOfRulesToDelete").text(" (" + Object.keys(selectedRulesListMap).length + " items)");
    $("#span_NumOfRulesToDelete").text("");
    $('button#btn_deleteRuleYes').off("click");
    $('button#btn_deleteRuleYes').on('click', function (_event) {
        for (iElement in selectedRulesListMap) {
            deleteRule(iElement);
        }
    });
}
function UpdateRuleOrdersOnDragDrop(l_rulesToUpdateOrders) {
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/configworkflow/20.2",
        method: "UpdateRuleOrdersOnDragDrop",
        parameters: l_rulesToUpdateOrders,
        success: function (data) {
            successToast(3000, "Rules order updated.");
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_listErrorInfoArea", true, getTranslationMessage("An error occurred while changing the rule order. Contact your administrator."), 10000);
            listRules();
            return false;
        }
    });
}
function updatePaginationParams() {
    if (l_rulesList_model.currentPage() == 1) {
        document.getElementById("li_ruleListLeftNavigation").style.display = "none";
        document.getElementById("li_ruleListRightNavigation").style.display = "inline";
    }
    if (parseInt(l_rulesList_model.numOfRules()) <= parseInt(rulesListLimitValue)) {
        l_rulesList_model.currentPage('1');
        $('#li_ruleListLeftNavigation,#li_ruleListRightNavigation').css('display', 'none');
    }
}
function goToPreviousPage() {
    if (l_rulesList_model.currentPage() > 1) {
        rulesListOffsetValue = parseInt(rulesListOffsetValue) - parseInt(rulesListLimitValue);
        l_rulesList_model.currentPage(parseInt(l_rulesList_model.currentPage()) - 1);
    }
    if (l_rulesList_model.currentPage() < Math.ceil(l_rulesList_model.numOfRules() / rulesListLimitValue)) {
        document.getElementById("li_ruleListRightNavigation").style.removeProperty("display");
    }
    if (l_rulesList_model.currentPage() == 1) {
        document.getElementById("li_ruleListLeftNavigation").style.display = "none";
    }
    if (l_rulesList_model.currentPage() < 1)
        return;
    listRules();
}
function goToNextPage() {
    if (l_rulesList_model.currentPage() < Math.ceil(l_rulesList_model.numOfRules() / rulesListLimitValue)) {
        rulesListOffsetValue = parseInt(rulesListOffsetValue) + parseInt(rulesListLimitValue);
        l_rulesList_model.currentPage(isNaN(parseInt(l_rulesList_model.currentPage())) ? 0 : parseInt(l_rulesList_model.currentPage()));
        l_rulesList_model.currentPage(parseInt(l_rulesList_model.currentPage()) + 1);
    }
    if (l_rulesList_model.currentPage() == Math.ceil(l_rulesList_model.numOfRules() / rulesListLimitValue)) {
        document.getElementById("li_ruleListRightNavigation").style.display = "none";
    }
    if (l_rulesList_model.currentPage() > 1) {
        document.getElementById("li_ruleListLeftNavigation").style.removeProperty("display");
    }
    listRules();
}
function goToLastPage() {
    rulesListOffsetValue = (Math.ceil(l_rulesList_model.numOfRules() / rulesListLimitValue) - 1) * rulesListLimitValue;
    l_rulesList_model.currentPage(Math.ceil(l_rulesList_model.numOfRules() / rulesListLimitValue));
    $('#li_ruleListRightNavigation').css('display', 'none');
    $('#li_ruleListLeftNavigation').css('display', 'inline');
    listRules();
}
function goToFirstPage() {
    rulesListOffsetValue = 0;
    l_rulesList_model.currentPage('1');
    $('#li_ruleListRightNavigation').css('display', 'inline');
    $('#li_ruleListLeftNavigation').css('display', 'none');
    listRules()
}
function ApplyFilterOnRulesList(event, iSrcElement) {
    if (document.getElementById("input_ruleNameFilter").value != "" || document.getElementById("input_ruleDescriptionFilter").value != "" || document.getElementById("input_ruleCTRTypeFilter").value != "" || document.getElementById("input_ruleStateFilter").value != "" || document.getElementById("input_ruleCreatedByFilter").value != "") {
        $("#btn_clearFilterActionBar").css('display', 'inline');
        l_rulesList_model.isFilterApplied(true);
    } else {
        $("#btn_clearFilterActionBar").css('display', 'none');
        l_rulesList_model.isFilterApplied(false);
    }
    listRules();
    hideRulesListFilter();
}
function ClearRulesListFilter(event, iSrcElement) {
    l_rulesListFilter_model.ClearRulesListFilter();
    $("#btn_clearFilterActionBar").css('display', 'none');
    l_rulesList_model.isFilterApplied(false);
    listRules();
    hideRulesListFilter();
}
function clearRuleDetailsModelData() {
    l_ruleDetails_model.ruleID('');
    l_ruleDetails_model.ruleItemID('');
    l_ruleDetails_model.ruleOrder('');

    l_ruleDetails_model.ruleName('');
    l_ruleDetails_model.ruleDescription('');
    l_ruleDetails_model.ruleSelectedTaskListName('');
    l_ruleDetails_model.ruleSelectedTaskListItemID('');
    l_ruleDetails_model.ruleSelectedOrganizationName('');
    l_ruleDetails_model.ruleSelectedOrganizationItemID('');
    l_ruleDetails_model.ruleSelectedContractTypeID('');
    l_ruleDetails_model.ruleSelectedProcessID('');
    l_ruleDetails_model.ruleSelectedStateID('');
    l_ruleDetails_model.ruleSelectedActionID('');
    l_ruleDetails_model.ruleDefaultActionID('');

    l_ruleDetails_model.contractTypes.removeAll();
    l_ruleDetails_model.statesOfSelectedProcess.removeAll();
    l_ruleDetails_model.actionsOfSelectedProcess.removeAll();


    l_ruleDetails_model.ruleLogic('');
    l_ruleDetails_model.ruleConditions.removeAll();
    l_ruleDetails_model.deletedRuleConditions.removeAll();

    l_ruleDetails_model.ruleLogicSummary('');
    _clearErrorClasses();
}

function _clearErrorClasses() {
    $("#input_ruleName").removeClass("cc-error");
    $("#input_ruleActivityList").removeClass("cc-error");
    $("#input_ruleOrganization").removeClass("cc-error");
    $("#select_ruleContractType").removeClass("cc-error");
    $(".select_ruleState").removeClass("cc-error");
    $("#select_ruleAction").removeClass("cc-error");
    $("#table_organizationsList").find('tbody .cc-select-column').removeClass("cc-radio-on-disabled");
    $("#table_organizationsList").find('tbody .cc-select-column').addClass("cc-radio-off");
    $("#input_organizationsSearchFilter").removeAttr('disabled');
    $("#input_organizationsSearchFilter").next().css("cursor", "pointer");
    l_organizationsForSelection_model.selectedOrganizationName("");
    l_organizationsForSelection_model.selectedOrganizationItemID("");
    l_ruleDetails_model.ruleLogicValidationErrors("");
}

function removeErrorClass(iEvent) {
    $(iEvent).removeClass("cc-error");
}
ko.oneTimeDirtyFlag = function (i_Item) {
    var _initialized = false;
    var result = ko.computed(function () {
        if (!i_Item._initialized()) {
            return false;
        }
        if (!_initialized) {
            _initialized = true;
            return false;
        }
        return true;
    });
    return result;
};
function createOrUpdateRule() {
    if (l_ruleDetails_model) {
        if (l_ruleDetails_model.ruleItemID()) {
            updateRule();
        } else {
            createRule();
        }
    }
}

function changeAttrType() {

    var targetElement = event.currentTarget.firstElementChild
    var l_currentClassName = targetElement.className;
    if (l_currentClassName == "cc-select-column cc-radio-off") {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on").addClass("cc-radio-off");
        $(targetElement).removeClass("cc-radio-off")
        $(targetElement).addClass("cc-radio-on")
    }
    if (event.currentTarget.id == "div_generalAttr") {
        $("#RuleConditionCustAttrLeftOperandList_id").addClass('hidden');
        $("#RuleConditionLeftOperandList_id").removeClass('hidden');
    }
    else if (event.currentTarget.id == "div_custAttr") {
        $("#RuleConditionLeftOperandList_id").addClass('hidden');
        $("#RuleConditionCustAttrLeftOperandList_id").removeClass('hidden');
    }
}

function createRule() {
    if (validateRuleMandatoryFields()) {
        if (generateRuleSummary()) {
            var ruleCreateObject = formRuleCreateOrUpdateObject(l_ruleDetails_model, false);
            if (ruleCreateObject) {
                $.cordys.ajax({
                    method: "CreateRuleInstance",
                    namespace: "http://schemas.opentext.com/apps/cc/configworkflow/20.2",
                    parameters: ruleCreateObject,
                    success: function (responseSuccess) {
                        if (responseSuccess) {
                            $('#div_createOrUpdateRuleModal').modal('hide');
                            successToast(3000, "Rule created.");
                            listRules();
                        } else {
                            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while creating the rule. Contact your administrator."), 10000);
                        }
                    },
                    error: function (responseFailure) {
                        showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while creating the rule. Contact your administrator."), 10000);
                        return false;
                    }
                });
            }
        }
    }
}
function updateRule() {
    if (validateRuleMandatoryFields()) {
        if (generateRuleSummary()) {
            var ruleUpdateObject = formRuleCreateOrUpdateObject(l_ruleDetails_model, true);
            if (ruleUpdateObject) {
                $.cordys.ajax({
                    method: "UpdateRuleInstance",
                    namespace: "http://schemas.opentext.com/apps/cc/configworkflow/20.2",
                    parameters: ruleUpdateObject,
                    success: function (responseSuccess) {
                        if (responseSuccess) {
                            $('#div_createOrUpdateRuleModal').modal('hide');
                            successToast(3000, "Rule updated.");
                            listRules();
                        } else {
                            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while updating the rule. Contact your administrator."), 10000);
                        }
                    },
                    error: function (responseFailure) {
                        showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while updating the rule. Contact your administrator."), 10000);
                        return false;
                    }
                });
            }
        }
    }
}
function formRuleCreateOrUpdateObject(iRuleDetailModel, iIsUpdate) {
    var l_rule = {};
    var properties = {};
    if (iRuleDetailModel) {
        properties.Type = l_rulesList_model.ruleType().VALUE;
        properties.Name = iRuleDetailModel.ruleName();
        properties.Description = iRuleDetailModel.ruleDescription();
        properties.RelatedActivityList = iRuleDetailModel.ruleSelectedTaskListItemID();
        properties.RelatedOrganization = iRuleDetailModel.ruleSelectedOrganizationItemID();
        properties.RelatedGCType = iRuleDetailModel.ruleSelectedContractTypeID();
        properties.RelatedGCProcess = iRuleDetailModel.ruleSelectedProcessID();
        properties.RelatedGCState = iRuleDetailModel.ruleSelectedStateID();
        
        if(isCTRType()){
            properties.RelatedGCAction = iRuleDetailModel.ruleSelectedActionID();
            properties.RuleConditions = {};
            properties.RuleConditions.RuleCondition = [];
            properties.DeletedRuleConditions = {};
            properties.DeletedRuleConditions.RuleCondition = [];
            if (iRuleDetailModel.ruleConditions()) {
                for (var i = 0; i < iRuleDetailModel.ruleConditions().length; i++) {
                    if (iRuleDetailModel.ruleConditions()[i] && iRuleDetailModel.ruleConditions()[i].ruleConditionDirtyFlag()) {
                        setActionToRuleCondition(iRuleDetailModel.ruleConditions()[i], 'UPD_ACT');
                    }
                    properties.RuleConditions.RuleCondition.push(formRuleConditionCreateOrUpdateObject(iRuleDetailModel.ruleConditions()[i], iIsUpdate));
                }
            }
            properties.Logic = iRuleDetailModel.ruleLogic();
        }
        else if(isOBLType()){
            properties.RelatedGCAction = iRuleDetailModel.ruleSelectedActionID();
        }
        else{
            properties.RelatedGCAction = iRuleDetailModel.ruleDefaultActionID();
        }

        if (iIsUpdate) {
            properties.RuleID = iRuleDetailModel.ruleID;
            properties.RuleItemID = iRuleDetailModel.ruleItemID;

            if (iRuleDetailModel.deletedRuleConditions().length > 0) {
                for (var i = 0; i < iRuleDetailModel.deletedRuleConditions().length; i++) {
                    if (!(iRuleDetailModel.deletedRuleConditions()[i].ruleConditionID() == "" || iRuleDetailModel.deletedRuleConditions()[i].ruleConditionItemID() == "")) {
                        properties.DeletedRuleConditions.RuleCondition.push(formRuleConditionDeleteObject(iRuleDetailModel.deletedRuleConditions()[i]));
                    }
                }
            }
        }
    }
    l_rule.Rule = properties;
    return l_rule;
}
function formRuleConditionCreateOrUpdateObject(iRuleConditionModel, iIsUpdate) {
    var l_ruleCondition = {};
    if (iRuleConditionModel) {
        l_ruleCondition.Order = getRuleConditionOrder(iRuleConditionModel);
        l_ruleCondition.RuleLeftOperand = iRuleConditionModel.ruleConditionLeftOperandItemID();
        l_ruleCondition.Operator = iRuleConditionModel.ruleConditionSelectedOperator();
        l_ruleCondition.Value = iRuleConditionModel.ruleConditionValue();
        l_ruleCondition.ValueType = iRuleConditionModel.ruleConditionValueType();
        l_ruleCondition.AttrType = iRuleConditionModel.ruleConditionLeftOperandAttrType();
        l_ruleCondition.CustomAttrName = iRuleConditionModel.ruleConditionLeftOperCustomAttrName();
        l_ruleCondition.CustomAttrType = iRuleConditionModel.ruleConditionLeftOperCustomAttrType();
        l_ruleCondition.DefaultResult = iRuleConditionModel.defaultResult();
    }
    if (iIsUpdate) {
        l_ruleCondition.RuleConditionID = iRuleConditionModel.ruleConditionID();
        l_ruleCondition.RuleConditionItemID = iRuleConditionModel.ruleConditionItemID();
    }
    return l_ruleCondition;
}
function formRuleConditionDeleteObject(iRuleConditionModel) {
    var l_ruleCondition = {};
    if (iRuleConditionModel) {
        l_ruleCondition.RuleConditionID = iRuleConditionModel.ruleConditionID();
        l_ruleCondition.RuleConditionItemID = iRuleConditionModel.ruleConditionItemID();
    }
    return l_ruleCondition;
}
function validateRuleMandatoryFields() {
    var validationFlag = true;
    if (l_ruleDetails_model.ruleName() == "") {
        $("#input_ruleName").addClass("cc-error");
        validationFlag = false;
    }
    if (l_ruleDetails_model.ruleSelectedTaskListItemID() == "" || l_ruleDetails_model.ruleSelectedTaskListItemID() == undefined) {
        $("#input_ruleActivityList").addClass("cc-error");
        validationFlag = false;
    }
    if (isCTRType() && $("#div_selectAllOrganizations").attr("class") == "cc-checkbox cc-checkbox-off") {
        if (l_ruleDetails_model.ruleSelectedOrganizationItemID() == "" || l_ruleDetails_model.ruleSelectedOrganizationItemID() == undefined) {
            $("#input_ruleOrganization").addClass("cc-error");
            validationFlag = false;
        }
    }
    if (!isOBLType() && (l_ruleDetails_model.ruleSelectedStateID() == "" || l_ruleDetails_model.ruleSelectedStateID() == undefined)) {
        $(".select_ruleState").addClass("cc-error");
        validationFlag = false;
    }

    if(isCTRType() || isOBLType()){
        if (l_ruleDetails_model.ruleSelectedActionID() == "" || l_ruleDetails_model.ruleSelectedActionID() == undefined) {
            $("#select_ruleAction").addClass("cc-error");
            validationFlag = false;
        }
    }
    return validationFlag;
}

function validateCurrentRuleConditionDataTypes(i_Item) {
    validateCurrentRuleConditionMandatoryFields(ko.dataFor(i_Item))
}
function validateCurrentRuleConditionMandatoryFields(i_Item) {
    var validationFlag = true;
    var l_currentRuleconditionIndex = l_ruleDetails_model.ruleConditions().indexOf(i_Item);
    if ((i_Item.ruleConditionLeftOperandAttrType() == "CUSTOM" && !i_Item.ruleConditionLeftOperCustomAttrName()) || (i_Item.ruleConditionLeftOperandAttrType() != "CUSTOM" && i_Item.ruleConditionLeftOperandItemID() == "")) {
        validationFlag = false;
        l_ruleDetails_model.ruleConditions()[l_currentRuleconditionIndex].ruleConditionLeftOperandValidationMsg(getTranslationMessage("Please select a value."));
    } else {
        l_ruleDetails_model.ruleConditions()[l_currentRuleconditionIndex].ruleConditionLeftOperandValidationMsg('');
    }
    if (i_Item.ruleConditionSelectedOperator() == "") {
        validationFlag = false;
        l_ruleDetails_model.ruleConditions()[l_currentRuleconditionIndex].ruleConditionOperatorValidationMsg(getTranslationMessage("Please select a value."));
    } else {
        l_ruleDetails_model.ruleConditions()[l_currentRuleconditionIndex].ruleConditionOperatorValidationMsg('');
    }
    if (i_Item.ruleConditionValue() == "") {
        if (!(i_Item.ruleConditionSelectedOperator() == "NOTEMPTY" || i_Item.ruleConditionSelectedOperator() == "EMPTY")) {
            validationFlag = false;
            l_ruleDetails_model.ruleConditions()[l_currentRuleconditionIndex].ruleConditionValueValidationMsg(getTranslationMessage("Please enter a value."));
        }
        else {
            l_ruleDetails_model.ruleConditions()[l_currentRuleconditionIndex].ruleConditionValueValidationMsg('');
        }
    } else {
        l_ruleDetails_model.ruleConditions()[l_currentRuleconditionIndex].ruleConditionValueValidationMsg('');
    }
    if (validationFlag) {
        validationFlag = validateRuleConditionDataTypes(l_ruleDetails_model.ruleConditions()[l_currentRuleconditionIndex]);
    }
    return validationFlag;
}
function getRuleConditionOrder(iRuleCondition) {
    return l_ruleDetails_model.ruleConditions().indexOf(iRuleCondition) + 1;
}
function setActionToRuleCondition(iRuleCondition, iAction) {
    if (iRuleCondition && iAction) {
        if (!iRuleCondition.iAction) {
            iRuleCondition.iAction = iAction;
        } else if (iAction == iRuleCondition.iAction || iRuleCondition.iAction == 'CRT_RC') {
        } else {
            if ((iRuleCondition.iAction == 'UPD_RC' && iAction == 'UPD_ORD') || (iRuleCondition.iAction == 'UPD_ORD' && iAction == 'UPD_RC')) {
                iRuleCondition.iAction = 'UPD_RC_AND_ORD';
            }
        }
    }
}
function revertRuleLogicChanges() {
    l_ruleDetails_model.ruleLogic(l_ruleDetails_model.lastSavedRuleLogic);
}
function validateRuleConditions() {
    var l_validationFlag = true;
    if (l_ruleDetails_model.ruleConditions()) {
        var l_ruleConditionsToValidate = l_ruleDetails_model.ruleConditions();
        for (var i = 0; i < l_ruleConditionsToValidate.length; i++) {
            if (l_ruleConditionsToValidate[i].ruleConditionLeftOperandDataType() == "" || l_ruleConditionsToValidate[i].ruleConditionLeftOperandDataType() == undefined) {
                l_validationFlag = false;
                l_ruleConditionsToValidate[i].ruleConditionLeftOperandValidationMsg(getTranslationMessage("Please enter a value."));
            } else {
                l_ruleConditionsToValidate[i].ruleConditionLeftOperandValidationMsg("");
            }
            if (l_ruleConditionsToValidate[i].ruleConditionSelectedOperator() == "" || l_ruleConditionsToValidate[i].ruleConditionSelectedOperator() == undefined) {
                l_validationFlag = false;
                l_ruleConditionsToValidate[i].ruleConditionOperatorValidationMsg(getTranslationMessage("Please enter a value."));
            } else {
                l_ruleConditionsToValidate[i].ruleConditionOperatorValidationMsg("");
            }
            if (!(l_ruleConditionsToValidate[i].ruleConditionSelectedOperator() == "EMPTY" || l_ruleConditionsToValidate[i].ruleConditionSelectedOperator() == "NOTEMPTY")) {
                if (l_ruleConditionsToValidate[i].ruleConditionValue() == "" || l_ruleConditionsToValidate[i].ruleConditionValue() == undefined) {
                    l_validationFlag = false;
                    l_ruleConditionsToValidate[i].ruleConditionValueValidationMsg(getTranslationMessage("Please enter a value."));
                } else {
                    l_ruleConditionsToValidate[i].ruleConditionValueValidationMsg("");
                }
            }
            if (l_validationFlag) {
                l_validationFlag = validateRuleConditionDataTypes(l_ruleConditionsToValidate[i])
            }
        }
    }
    return l_validationFlag;
}
function validateRuleConditionDataTypes(i_ruleConditionObject) {
    var l_validationFlag = true;
    if (!(i_ruleConditionObject.ruleConditionSelectedOperator() == "EMPTY" || i_ruleConditionObject.ruleConditionSelectedOperator() == "NOTEMPTY")) {
        if (i_ruleConditionObject.ruleConditionLeftOperandDataType() == "DECIMAL") {
            if (!$.isNumeric(i_ruleConditionObject.ruleConditionValue())) {
                l_validationFlag = false;
                i_ruleConditionObject.ruleConditionValueValidationMsg(getTranslationMessage("Please enter a numeric value."));
            } else {
                i_ruleConditionObject.ruleConditionValueValidationMsg("");
            }
        } else if (i_ruleConditionObject.ruleConditionLeftOperandDataType() == "FLOAT") {
            if (!$.isNumeric(i_ruleConditionObject.ruleConditionValue())) {
                l_validationFlag = false;
                i_ruleConditionObject.ruleConditionValueValidationMsg(getTranslationMessage("Please enter a numeric value."));
            } else {
                i_ruleConditionObject.ruleConditionValueValidationMsg("");
            }
        } else if (i_ruleConditionObject.ruleConditionLeftOperandDataType() == "INTEGER") {
            if (!$.isNumeric(i_ruleConditionObject.ruleConditionValue())) {
                l_validationFlag = false;
                i_ruleConditionObject.ruleConditionValueValidationMsg(getTranslationMessage("Please enter a numeric value."));
            } else {
                i_ruleConditionObject.ruleConditionValueValidationMsg("");
            }
        } else if (i_ruleConditionObject.ruleConditionLeftOperandDataType() == "DURATION") {
            if (!$.isNumeric(i_ruleConditionObject.ruleConditionValue())) {
                l_validationFlag = false;
                i_ruleConditionObject.ruleConditionValueValidationMsg(getTranslationMessage("Please enter a numeric value."));
            } else {
                i_ruleConditionObject.ruleConditionValueValidationMsg("");
            }
        } else if (i_ruleConditionObject.ruleConditionLeftOperandDataType() == "DATE") {
            if (!moment(i_ruleConditionObject.ruleConditionValue(), "MM/DD/YYYY", true).isValid()) {
                l_validationFlag = false;
                i_ruleConditionObject.ruleConditionValueValidationMsg(getTranslationMessage("Please enter a date in MM/DD/YYYY."));
            } else {
                i_ruleConditionObject.ruleConditionValueValidationMsg("");
            }
        } else if (i_ruleConditionObject.ruleConditionLeftOperandDataType() == "BOOLEAN") {
            if (!(i_ruleConditionObject.ruleConditionValue() == "Yes" || i_ruleConditionObject.ruleConditionValue() == "No")) {
                l_validationFlag = false;
                i_ruleConditionObject.ruleConditionValueValidationMsg(getTranslationMessage("Please enter Yes or No."));
            } else {
                i_ruleConditionObject.ruleConditionValueValidationMsg("");
            }
        } else if (i_ruleConditionObject.ruleConditionLeftOperandDataType() == "TEXT") {

        } else if (i_ruleConditionObject.ruleConditionLeftOperandDataType() == "LONGTEXT") {

        } else if (i_ruleConditionObject.ruleConditionLeftOperandDataType() == "ENUMERATEDTEXT") {

        }
    }
    return l_validationFlag;
}
function generateRuleSummary() {
    if(!isCTRType()){
        return true;
    }
    if (validateRuleConditions()) {
        if (!(l_ruleDetails_model.ruleLogic() == undefined)) {
            var l_ruleLogicParser = new RuleLogicParser();
            if (l_ruleLogicParser.startParsing(l_ruleDetails_model.ruleLogic(), l_ruleDetails_model.ruleConditions().length)) {
                l_ruleDetails_model.ruleLogicValidationErrors("");
                var l_ruleLogicSplits = l_ruleDetails_model.ruleLogic().match(new RegExp("[(]|[0-9]|(and)|(or)|[)]", "ig"));
                buildRuleSummary(l_ruleLogicSplits);
                return true;
            } else {
                var l_errorPosition = l_ruleLogicParser.getErrorPosition();
                var l_errorCode = l_ruleLogicParser.getErrorCode();
                if (l_errorCode == "404") {
                    l_ruleDetails_model.ruleLogicValidationErrors(getTranslationMessage("Please add the logic."));
                } else {
                    if (l_errorCode.length > 0) {
                        l_ruleDetails_model.ruleLogicValidationErrors(l_errorCode);
                    } else {
                        l_ruleDetails_model.ruleLogicValidationErrors(getTranslationMessage("Unable to validate the logic. Syntax error in position") + " " + l_errorPosition + " " + getTranslationMessage("of the logic."));
                    }
                }
                setTimeout(function(){
                    l_ruleDetails_model.ruleLogicValidationErrors("");
                },2000);
                return false;
            }
        }
    }
}
function buildRuleSummary(iRuleLogicStack) {
    var l_ruleLogicSummaryExpression = "<p>" + getTranslationMessage("IF");
    for (var i = 0; i < iRuleLogicStack.length; i++) {
        var e = iRuleLogicStack[i];
        if (e.toUpperCase() !== "OR" && e.toUpperCase() !== "AND" && e !== ")" && e !== "(") {
            var l_ruleCondition = l_ruleDetails_model.ruleConditions()[+e - 1];
            if (l_ruleCondition) {
                if (l_ruleCondition.ruleConditionSelectedOperator() == "EMPTY" || l_ruleCondition.ruleConditionSelectedOperator() == "NOTEMPTY") {
                    var expr = "<ruleConditionBold>\"" + l_ruleCondition.ruleConditionLeftOperandName() + "\"</ruleConditionBold>  " + getOperatorText(l_ruleCondition.ruleConditionSelectedOperator());
                } else {
                    var expr = "<ruleConditionBold>\"" + l_ruleCondition.ruleConditionLeftOperandName() + "\"</ruleConditionBold>  " + getOperatorText(l_ruleCondition.ruleConditionSelectedOperator()) + "  <ruleConditionBold>\"" + l_ruleCondition.ruleConditionValue() + "\"</ruleConditionBold>";
                }
                if (l_ruleLogicSummaryExpression[l_ruleLogicSummaryExpression.length - 1] === "(") {
                    l_ruleLogicSummaryExpression = l_ruleLogicSummaryExpression + expr;
                } else {
                    l_ruleLogicSummaryExpression = l_ruleLogicSummaryExpression + "\n" + expr;
                }
            }
        } else if (e.toUpperCase() === "OR" || e.toUpperCase() === "AND" || e === "(") {
            l_ruleLogicSummaryExpression = l_ruleLogicSummaryExpression + "\n" + e.toUpperCase();
        } else if (e === ")") {
            l_ruleLogicSummaryExpression = l_ruleLogicSummaryExpression + e;
        }
    };
    l_ruleLogicSummaryExpression = l_ruleLogicSummaryExpression + "\n " + getTranslationMessage("THEN") + " \n " + getTranslationMessage("Do") + "  " + "<ruleConditionBold>\"" + l_ruleDetails_model.ruleSelectedTaskListName() + "\"</ruleConditionBold></p>";
    l_ruleDetails_model.ruleLogicSummary(l_ruleLogicSummaryExpression);
}
function getOperatorText(iOperator) {
    var l_operatorText;
    switch (iOperator) {
        case 'EQUALTO':
            l_operatorText = "Equal to";
            break;
        case 'NOTEQUALTO':
            l_operatorText = "Not equal to";
            break;
        case 'CONTAINS':
            l_operatorText = "Contains";
            break;
        case 'DOESNOTCONTAIN':
            l_operatorText = "Does not contain";
            break;
        case 'EMPTY':
            l_operatorText = "Empty";
            break;
        case 'NOTEMPTY':
            l_operatorText = "Not empty";
            break;
        case 'GREATERTHAN':
            l_operatorText = "Greater than";
            break;
        case 'GREATERTHANOREQUALTO':
            l_operatorText = "Greater than or equal to";
            break;
        case 'LESSTHAN':
            l_operatorText = "Less than";
            break;
        case 'LESSTHANOREQUALTO':
            l_operatorText = "Less than or equal to";
            break;
    }
    return getTranslationMessage(l_operatorText);
}
function getDatatypeText(iDatatype) {
    var l_dataTypeText;
    switch (iDatatype) {
        case 'BOOLEAN':
            l_dataTypeText = "Boolean";
            break;
        case 'DATE':
            l_dataTypeText = "Date";
            break;
        case 'DECIMAL':
            l_dataTypeText = "Decimal";
            break;
        case 'DURATION':
            l_dataTypeText = "Duration";
            break;
        case 'ENUMERATEDTEXT':
            l_dataTypeText = "Enumerated text";
            break;
        case 'FLOAT':
            l_dataTypeText = "Float";
            break;
        case 'INTEGER':
            l_dataTypeText = "Integer";
            break;
        case 'LONGTEXT':
            l_dataTypeText = "Long text";
            break;
        case 'TEXT':
            l_dataTypeText = "Text";
            break;
        case 'NUMBER':
            l_dataTypeText = "Number";
            break;
        case 'ENUM':
            l_dataTypeText = "Enum";
            break;
        case 'ENUMERATEDTEXT':
            l_dataTypeText = "Enumerated Text";
            break;
    }
    return getTranslationMessage(l_dataTypeText);
}
function openActivityListSelectionModal() {
    $("#div_selectRuleActivityListModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    ListAllActivityLists();
    $('button#btn_selectActivityListForRuleYes').off("click");
    $('button#btn_selectActivityListForRuleYes').on('click', function (_event) {
        l_ruleDetails_model.ruleSelectedTaskListName(l_activityListForSelection_model.selectedActivityListName());
        l_ruleDetails_model.ruleSelectedTaskListItemID(l_activityListForSelection_model.selectedActivityListItemID());
        $("#input_ruleActivityList").removeClass("cc-error");
    });
}
function ListAllActivityLists() {
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/configworkflow/20.2",
        method: "GetActivityListwithFilters",
        parameters: {
            "activityType" : l_rulesList_model.ruleType().ACT_VALUE,
            "activityName": $("#input_activityListSearchFilter").val(),
            "description": "",
            "activityStatus": "ACTIVE",
            "offset": "0",
            "limit": "200"
        },
        success: function (data) {
            addDataToActivityListLookup(data.FindZ_INT_ActivityListResponse.ActivityList, l_activityListForSelection_model);
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the task lists. Contact your administrator."), 10000);
            return false;
        }
    });
}
function addDataToActivityListLookup(iElementList, iModel) {
    iModel.ActivityListList.removeAll();
    if (iElementList) {
        if (iElementList.length) {
            iElementList.forEach(function (iElement) {
                iModel.ActivityListList.push(iElement);
            });
        }
        else {
            iModel.ActivityListList.push(iElementList);
        }
    }
}
function openOrganizationSelectionModal() {
    $("#div_selectOrganizationModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    $("#div_selectAllOrganizations").removeClass("cc-checkbox-on")
    $("#div_selectAllOrganizations").addClass("cc-checkbox-off")
    ListOrganizations();
    $('button#btn_selectOrganizationForRuleYes').off("click");
    $('button#btn_selectOrganizationForRuleYes').on('click', function (_event) {
		
        l_ruleDetails_model.ruleSelectedOrganizationName(l_organizationsForSelection_model.selectedOrganizationName());
        l_ruleDetails_model.ruleSelectedOrganizationItemID(l_organizationsForSelection_model.selectedOrganizationItemID());
		addContractTypesDataToRuleBasicDetailsView(l_ruleDetails_model);
		l_ruleDetails_model.ruleSelectedContractTypeID("");
		$("#select_ruleContractType").css('cursor', '');
		$("#select_ruleContractType").removeAttr("disabled");
		if((l_ruleDetails_model.ruleSelectedOrganizationItemID() == "" || l_ruleDetails_model.ruleSelectedOrganizationItemID() == undefined) && (l_ruleDetails_model.ruleSelectedOrganizationName()=="" || l_ruleDetails_model.ruleSelectedOrganizationName()==undefined)){
			$("#select_ruleContractType").css('cursor', 'not-allowed');
			$("#select_ruleContractType").attr("disabled", "disabled");
		}
        $("#input_ruleOrganization").removeClass("cc-error");
    });
}
function ListOrganizations(uiSelectOp) {
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
            if (!uiSelectOp && l_ruleDetails_model.ruleSelectedOrganizationItemID() == "" && l_ruleDetails_model.ruleSelectedOrganizationName() == "All") {
                $("#div_selectAllOrganizations").removeClass("cc-checkbox-off")
                $("#div_selectAllOrganizations").addClass("cc-checkbox-on")
                $("#table_organizationsList").find('tbody .cc-select-column').removeClass("cc-radio-off");
                $("#table_organizationsList").find('tbody .cc-select-column').addClass("cc-radio-on-disabled");
                $("#input_organizationsSearchFilter").attr("disabled", "disabled");
                $("#input_organizationsSearchFilter").next().css("cursor", "not-allowed")
            }
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the organizations. Contact your administrator."), 10000);
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
function openRuleConditionLeftOperandSelectionModal() {
    $("#div_selectRuleConditionLeftOperandModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    ListAllRuleConditionOperands();
    addDataToOprandListCustAttrView(l_ruleDetails_model);
    $('button#btn_selectRuleConditionLeftOperandYes').off("click");
    $('button#btn_selectRuleConditionLeftOperandYes').on('click', function (_event) {
        var l_ruleConditionIndex = l_ruleDetails_model.currentRuleConditionIndex();
        if (document.getElementById("div_custAttr").children[0].classList.value.indexOf("cc-radio-off") > -1) {
            l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandItemID(l_ruleConditionLeftOperandForSelection_model.selectedRuleConditionLeftOperandItemID());
            l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandName(l_ruleConditionLeftOperandForSelection_model.selectedRuleConditionLeftOperandName());
            l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandType(l_ruleConditionLeftOperandForSelection_model.selectedRuleConditionLeftOperandType());
            l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandDataType(l_ruleConditionLeftOperandForSelection_model.selectedRuleConditionLeftOperandDataType());
            l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandPath(l_ruleConditionLeftOperandForSelection_model.selectedRuleConditionLeftOperandPath());
            l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandXpath(l_ruleConditionLeftOperandForSelection_model.selectedRuleConditionLeftOperandXpath());
            l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandAttrType("GENERAL");
        } else {
            l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandName(l_ruleConditionLeftOperandForSelection_model.selectedRuleConditionLeftOperandName());
            l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandAttrType("CUSTOM");
            l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperCustomAttrName(l_ruleConditionLeftOperandForSelection_model.selectedRuleConditionLeftOperCustomAttrName());
            l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperCustomAttrType(l_ruleConditionLeftOperandForSelection_model.selectedRuleConditionLeftOperCustomAttrType());
            l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandDataType(l_ruleConditionLeftOperandForSelection_model.selectedRuleConditionLeftOperandDataType());
            l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandPath('');
            l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandXpath('');
        }

        l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionSelectedOperator("");
        l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionValue("");

        var l_ruleConditionValueElement = $("[ruleConditionIndex=" + l_ruleConditionIndex + "]").find('td .input_ruleConditionRightOperand');
        if (l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandDataType() == "BOOLEAN") {
            l_ruleConditionValueElement.attr("placeholder", getTranslationMessage("Enter Yes or No"));
        }
        if (l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandDataType() == "DATE") {
            l_ruleConditionValueElement.attr("placeholder", getTranslationMessage("Enter date (MM/DD/YYYY)"));
        }
        if ((l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandDataType() == "DECIMAL") || (l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandDataType() == "NUMBER")) {
            l_ruleConditionValueElement.attr("placeholder", getTranslationMessage("Enter a numeric value"));
        }
        if (l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandDataType() == "DURATION") {
            l_ruleConditionValueElement.attr("placeholder", getTranslationMessage("Enter a numeric value"));
        }
        if (l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandDataType() == "FLOAT") {
            l_ruleConditionValueElement.attr("placeholder", getTranslationMessage("Enter a numeric value"));
        }
        if (l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandDataType() == "INTEGER") {
            l_ruleConditionValueElement.attr("placeholder", getTranslationMessage("Enter a numeric value"));
        }
        if (l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandDataType() == "LONGTEXT") {
            l_ruleConditionValueElement.attr("placeholder", getTranslationMessage("Enter text"));
        }
        if (l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandDataType() == "TEXT") {
            l_ruleConditionValueElement.attr("placeholder", getTranslationMessage("Enter text"));
        }
        if ((l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandDataType() == "ENUMERATEDTEXT") || (l_ruleDetails_model.ruleConditions()[l_ruleConditionIndex].ruleConditionLeftOperandDataType() == "ENUM")) {
            l_ruleConditionValueElement.attr("placeholder", getTranslationMessage("Enter text"));
        }
    });
}
function ListAllRuleConditionOperands() {
    $.cordys.ajax({
        namespace: "http://schemas/OpenTextCCConfigurableWorkflow/RuleConditionOperand/operations",
        method: "GetAllRuleConditionOperands",
        parameters: {
        },
        success: function (data) {
            addDataToRuleConditionLeftOperandLookup(data.RuleConditionOperand, l_ruleConditionLeftOperandForSelection_model);
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the contract properties. Contact your administrator."), 10000);
            return false;
        }
    });
}


function addDataToOprandListCustAttrView(iModel) {
        $.cordys.ajax({
            method: "GetCTRtypesforAttribute",
            namespace: "http://schemas.opentext.com/apps/cc/customattributes/21.4",
            parameters: {
                'ctrTypeID': iModel.ruleSelectedContractTypeID()
            }
        }).done(function (data) {
            var iElementList = data.FindZ_INT_TypeAttrMappingResponse.AttributeMapping;
            l_ruleConditionLeftOperandForSelection_model.RuleConditionCustAttrLeftOperandList.removeAll();
            if (iElementList) {
                addDataToRuleConditionCustAttrLeftOperandLookup(iElementList, l_ruleConditionLeftOperandForSelection_model);
            }
        }).fail(function (error) {

        });
};
function addDataToRuleConditionCustAttrLeftOperandLookup(iElementList, iModel) {
    iModel.RuleConditionCustAttrLeftOperandList.removeAll();
    if (iElementList) {
        if (iElementList.length) {
            iElementList.forEach(function (iElement) {
                iElement.RelatedAttributeDefinition.DataType.text = changeType(iElement.RelatedAttributeDefinition.DataType.text);
                iModel.RuleConditionCustAttrLeftOperandList.push(iElement.RelatedAttributeDefinition);
            });
        }
        else {
            iElementList.RelatedAttributeDefinition.DataType.text = changeType(iElementList.RelatedAttributeDefinition.DataType.text);
            iModel.RuleConditionCustAttrLeftOperandList.push(iElementList.RelatedAttributeDefinition);
        }
    }

    function changeType(iType) {
        if (iType === "NUMBER") {
            return "DECIMAL";
        } else if (iType === "ENUM") {
            return "ENUMERATEDTEXT";
        } else {
            return iType;
        }
    }
}

function addDataToRuleConditionLeftOperandLookup(iElementList, iModel) {
    iModel.RuleConditionLeftOperandList.removeAll();
    if (iElementList) {
        if (iElementList.length) {
            iElementList.forEach(function (iElement) {
                iModel.RuleConditionLeftOperandList.push(iElement);
            });
        }
        else {
            iModel.RuleConditionLeftOperandList.push(iElementList);
        }
    }
}
function openSelectedActivityListDetailsModal() {
    if (l_ruleDetails_model.ruleSelectedTaskListItemID()) {
        $("#div_viewSelectedActivityListDetailsModal").modal({
            backdrop: 'static',
            keyboard: false
        });
        loadActivityListDetails(l_ruleDetails_model.ruleSelectedTaskListItemID());
    }
}
function loadActivityListDetails(itemId) {
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/configworkflow/20.2",
        method: "GetActivityCompleteDetails",
        parameters: { "ItemID": itemId },
        success: function (data) {
            addDataToActivityListDetailsView(data, l_activityListDetails_model);
            //$("#id_activityListModalType").text("Edit " + data.ActivityList.Name);
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while loading the task list details. Contact your administrator."), 10000);
            return false;
        }
    });
}
function addDataToActivityListDetailsView(i_Element, i_activity) {
    var taskList = [];
    if (i_Element && i_activity) {
        if (i_Element.Activities) {
            var i_elementList = i_Element.Activities.Activity;
            if (i_elementList) {
                if (i_elementList.length) {
                    for (var i = 0; i < i_elementList.length; i++) {
                        var task = formTaskDetails(i_elementList[i], i_Element.ContainingActivitiesList.ContainingActivities[i].Order);
                        if (task) {
                            taskList[task.itemId] = task;
                        }
                    }
                }
                else {
                    var task = formTaskDetails(i_elementList, i_Element.ContainingActivitiesList.ContainingActivities.Order);
                    if (task) {
                        taskList[task.itemId] = task;
                    }
                }
            }
        }
        var taskItems = Object.keys(taskList).map(function (e) {
            return taskList[e]
        })
        taskItems.sort(compareTaskOrders);
        l_activityListDetails_model.tasks.removeAll();
        for (var i = 0; i < taskItems.length; i++) {
            l_activityListDetails_model.tasks.push(taskItems[i]);
        }
    }
}
function compareTaskOrders(a, b) {
    if (a.taskOrder < b.taskOrder) {
        return -1;
    }
    if (a.taskOrder > b.taskOrder) {
        return 1;
    }
    return 0;
}
function formTaskDetails(iElement, iOrder) {
    if (iElement) {
        var task = new Task();
        task.name(iElement.Name);
        task.description(iElement.Description);
        task.type(iElement.TypeOfActivity);
        task.taskOrder = iOrder;
        task.id = iElement['Activity-id'].Id;
        task.itemId = iElement['Activity-id'].ItemId;
        return task;
    }
}
const TaskTypes = Object.freeze({
    DEFAULT: { label: '- select task type', value: '' },
    STANDARD: { label: 'Standard', value: 'STANDARD' },
    APPROVAL: { label: 'Approval', value: 'APPROVAL' },
    STATE_TRANSITION: { label: 'State transition', value: 'STATE_TRANSITION' },
    CUSTOM: { label: 'Custom', value: 'CUSTOM' }
})

function getTaskTypeLabel(key) {
    if (key) {
        var item = TaskTypes[key];
        if (item) {
            return getTranslationMessage(item.label);
        }
    }
}

//DOM Manipulation methods
function toggleAllTabs(){
    $("#div_rulesListTabs").toggle();
    if($("#div_rulesListTabs").is(":hidden")){
        $("#div_listContainer").removeClass("col-md-10").addClass("col-md-12");
        $("#id_caret-icon").removeClass('caretup-icon rtl-caretdown-icon').addClass('caretdown-icon rtl-caretup-icon');
    }else{
        $("#div_listContainer").removeClass("col-md-12").addClass("col-md-10");
        $("#id_caret-icon").removeClass('caretdown-icon rtl-caretup-icon').addClass('caretup-icon rtl-caretdown-icon');
    }
}

function hasDefaultImportedItem(){
    const ruleLists = l_rulesList_model.RulesList();
	
	const filteredItems = ruleLists.filter(item => {
	  return (
		item.CreationType === "DEFAULT-IMPORTED" &&
		selectedRulesListMap[item["Rule-id"].ItemId]
	  );
	});

	return filteredItems.length > 0;

}