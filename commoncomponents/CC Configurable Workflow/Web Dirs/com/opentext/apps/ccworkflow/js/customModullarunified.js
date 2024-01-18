$.cordys.json.defaults.removeNamespacePrefix = true;
var l_customModullar_model;

var newTabCount = 0;
var newGroupCount = 0;
var newAttrCount = 0;

var ACTION_UPDATE_TAB = "UPDATE_LINKED_TAB";
var ACTION_UPDATE_GROUP = "UPDATE_LINKED_GROUP";
var ACTION_UPDATE_CTRATTR = "UPDATE_LINKED_CTRATTR";
var ACTION_UPDATE_CUSTATTR = "UPDATE_LINKED_CUSTATTR";

var ACTION_NEW_TAB = "NEW_LINKED_TAB";
var ACTION_NEW_GROUP = "NEW_LINKED_GROUP";
var ACTION_NEW_CTRATTR = "NEW_LINKED_CTR_ATTRIBUTE";
var ACTION_NEW_CUSTATTR = "NEW_LINKED_ATTRIBUTE";

var ACTION_DELETE_GROUP = "UPDATE_DELETE_GROUP";
var ACTION_DELETE_TAB = "UPDATE_DELETE_TAB";

var ATTR_CUSTATTR = "CUSTATTRIBUTE";
var ATTR_CONTATTR = "CONTRACTATTRIBUTE";
var ATTR_GROUP = "GROUP";
var ATTR_TAB = "TAB";

const DATA_TYPE_BOOLEAN = "BOOLEAN";
const DATA_TYPE_NUMBER = "NUMBER";
const DATA_TYPE_TEXT = "TEXT";
const DATA_TYPE_DATE = "DATE";
const DATA_TYPE_ENUM = "ENUM";

var inValidList = [];

var isActionClicked = false;

const defaultTabs = [
    { Name: 'General', isEditable: true, isDeletable: true },
    { Name: 'Accounts', isEditable: false, isDeletable: false },
    { Name: 'Contract lines', isEditable: false, isDeletable: false },
    { Name: 'Tags', isEditable: false, isDeletable: false },
    { Name: 'PO numbers', isEditable: false, isDeletable: true }
];

var cc_customize_services = function () {
    var self = {};

    self.EnableLayoutConfigService = (inreq, callbackfunc) => {
        $.cordys.ajax({
            namespace: "http://schemas.opentext.com/apps/cc/customattributes/21.4",
            method: "EnableLayoutConfig",
            parameters: inreq,
            success: function (data) {
                callbackfunc(data, "SUCCESS");
            },
            error: function (responseFailure) {
                callbackfunc(null, "ERROR");
                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while enabling layout. Contact your administrator."), 10000);
                return false;
            }
        });
    }

    self.DeleteLayoutConfigService = (inreq, callbackfunc) => {
        $.cordys.ajax({
            namespace: "http://schemas.opentext.com/apps/cc/customattributes/21.4",
            method: "DeleteValidLayoutConfig",
            parameters: inreq,
            success: function (data) {
                callbackfunc(data, "SUCCESS");
            },
            error: function (responseFailure) {
                callbackfunc(null, "ERROR");
                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while deleting layout. Contact your administrator."), 10000);
                return false;
            }
        });
    }

    self.saveOrUpdateLayout = (inreq, callbackfunc) => {
        $.cordys.ajax({
            namespace: "http://schemas.opentext.com/apps/cc/customattributes/21.4",
            method: "SaveLayoutConfig",
            parameters: inreq,
            success: function (data) {
                callbackfunc(data, "SUCCESS");
            },
            error: function (responseFailure) {
                callbackfunc(null, "ERROR");
                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while saving layout. Contact your administrator."), 10000);
                return false;
            }
        });
    }
    self.getAllLayoutRelAttrDefService = (inreq, callbackfunc) => {
        $.cordys.ajax({
            namespace: "http://schemas.opentext.com/apps/cc/customattributes/21.4",
            method: "getAllLayoutRelAttrDef",
            parameters: inreq,
            success: function (data) {
                callbackfunc(data, "SUCCESS");
            },
            error: function (responseFailure) {
                callbackfunc(null, "ERROR");
                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the custom attributes properties. Contact your administrator."), 10000);
                return false;
            }
        });
    }
    self.getAllContractRelAttrListService = (inreq, callbackfunc) => {
        $.cordys.ajax({
            namespace: "http://schemas/OpenTextBasicComponents/GCProcess.RelatedGCProps/operations",
            method: "GetGCProcessPropByProcessName",
            parameters: inreq,
            success: function (data) {
                callbackfunc(data, "SUCCESS");
            },
            error: function (responseFailure) {
                callbackfunc(null, "ERROR");
                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the custom attributes properties. Contact your administrator."), 10000);
                return false;
            }
        });
    }

    self.getRelatedAttrDefByLayoutService = (inreq, callbackfunc) => {
        $.cordys.ajax({
            namespace: "http://schemas/OpenTextCustomAttributes/LayoutConfig.RelatedAttrDefinition/operations",
            method: "getRelatedAttrDefByLayoutId",
            parameters: inreq,
            success: function (data) {
                callbackfunc(data, "SUCCESS");
            },
            error: function (responseFailure) {
                callbackfunc(null, "ERROR");
                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the custom attributes properties. Contact your administrator."), 10000);
                return false;
            }
        });
    }

    self.layoutConfigUpdate = (inreq, callbackfunc) => {
        $.cordys.ajax({
            namespace: "http://schemas/OpenTextCustomAttributes/LayoutConfig/operations",
            method: "UpdateLayoutConfig",
            parameters: inreq,
            success: function (data) {
                callbackfunc(data, "SUCCESS");
            },
            error: function (responseFailure) {
                callbackfunc(null, "ERROR");
                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the custom attributes properties. Contact your administrator."), 10000);
                return false;
            }
        });
    }
    self.getCustomAttributesListService = (inreq, callbackfunc) => {
        $.cordys.ajax({
            namespace: "http://schemas.opentext.com/apps/cc/customattributes/21.4",
            method: "GetCTRtypesforAttribute",
            parameters: inreq,
            success: function (data) {
                callbackfunc(data, "SUCCESS");
            },
            error: function (responseFailure) {
                callbackfunc(null, "ERROR");
                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the custom attributes properties. Contact your administrator."), 10000);
                return false;
            }
        });
    }

    self.getLayoutConfigListService = (inreq, callbackfunc) => {
        $.cordys.ajax({
            namespace: "http://schemas/OpenTextCustomAttributes/LayoutConfig/operations",
            method: "getLayoutWithCTRTypeId",
            parameters: inreq,
            success: function (data) {
                callbackfunc(data, "SUCCESS");
            },
            error: function (responseFailure) {
                callbackfunc(null, "ERROR");
                showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the custom attributes properties. Contact your administrator."), 10000);
                return false;
            }
        });
    }
    return self;
}();
// services start

// services end



function Field(name) {
    var self = this;
    self.displayName = ko.observable(name);
    self.fieldType = ko.observable("TEXT");
    self.value = ko.observable();
    return self;
}

function RelatedAttrDef(data, parentLayout) {
    var self = {};
    self.Name = ko.observable();
    self.Id = ko.observable();
    self.Id1 = ko.observable();
    self.ItemId = ko.observable();
    self.ItemId1 = ko.observable();
    self.Order = ko.observable();
    self.Type = ko.observable();
    self.IsMandatory = ko.observable();
    self.GroupID = ko.observable();
    self.IsReadOnly = ko.observable();
    self.isEditable = ko.observable(true);
    self.AttrDefId = ko.observable();
    self.AttrDefType = ko.observable();
    self.AttrDefItemId = ko.observable();
    self.ParentRelAttrDefId = ko.observable();
    self.ParentRelAttrDefId1 = ko.observable();
    self.ParentRelAttrDefItemId = ko.observable();
    self.ParentRelAttrDefItemId1 = ko.observable();
    self.ParentLayout = ko.observable(parentLayout);

    self.Style = ko.observable({ 'Class': ko.observable('flex-cn-cl-25') });

    self.selectGroup = function (data1, event) {
        self.ParentLayout().selectGroup(data1);
    }

    self.selectAttribute = function (data1, parentTab, event) {
        self.ParentLayout().selectAttribute(data1, parentTab, event);
    }

    self.groupNameChange = function (data1, event) {
        if (data1.action() != "NEW_LINKED_GROUP") {
            data1.action("UPDATE_LINKED_GROUP");
        }
    }

    self.tabNameChange = function (data1, event) {
        if (!data1.action() || data1.action() === "NONE") {
            data1.action("UPDATE_LINKED_TAB");
        }
    }

    if (data) {
        self.Id(data["RelatedAttrDefinition-id"].Id);
        self.Id1(data["RelatedAttrDefinition-id"].Id1);
        self.ItemId(data["RelatedAttrDefinition-id"].ItemId);
        self.ItemId1(data["RelatedAttrDefinition-id"].ItemId1);
        self.Order(data.Order);
        self.Type(data.Type);
        self.isEditable(data.IsEditable === "FALSE" ? false : true);
        if (data.Type === "GROUP" || data.Type === "TAB") {
            self.Name(data.RelatedLabel.Label ? getTextValue(data.RelatedLabel.Label) : "");
            if (data.Type === "TAB") {
                self.ParentLayout().Colsize(Number(getTextValue(data.Owner.Colsize)));
            }
        } else if (data.Type === "CUSTATTRIBUTE") {
            self.AttrDefId(data.RelatedDef ? data.RelatedDef.Id : "");
            self.AttrDefItemId(data.RelatedDef ? data.RelatedDef["AttributeDefinition-id"].ItemId : "");
            self.AttrDefType(data.RelatedDef ? getTextValue(data.RelatedDef.DataType) : "");
            self.Name(data.RelatedDef ? getTextValue(data.RelatedDef.Name) : "");
            self.IsMandatory(data.IsMandatory ? getTextValue(data.IsMandatory) : "FALSE");
        } else {
            self.AttrDefId(data.RelatedAttrGCProp ? data.RelatedAttrGCProp["RelatedGCProps-id"].Id1 : "");
            self.AttrDefItemId(data.RelatedAttrGCProp ? data.RelatedAttrGCProp["RelatedGCProps-id"].ItemId1 : "");
            self.AttrDefType(data.RelatedAttrGCProp ? getTextValue(data.RelatedAttrGCProp.DataType) : "");
            self.IsMandatory(data.RelatedAttrGCProp ? getTextValue(data.RelatedAttrGCProp.IsMandatory) : "");
            self.GroupID(data.RelatedAttrGCProp ? getTextValue(data.RelatedAttrGCProp.GroupID) : "");
        }
        self.Name(getTextValue(data.RelatedLabel.Name));
        self.ParentRelAttrDefId(data.SourceAttrDef ? data.SourceAttrDef["RelatedAttrDefinition-id"].Id : "");
        self.ParentRelAttrDefId1(data.SourceAttrDef ? data.SourceAttrDef["RelatedAttrDefinition-id"].Id1 : "");
        self.ParentRelAttrDefItemId(data.SourceAttrDef ? data.SourceAttrDef["RelatedAttrDefinition-id"].ItemId : '');
        self.ParentRelAttrDefItemId1(data.SourceAttrDef ? data.SourceAttrDef["RelatedAttrDefinition-id"].ItemId1 : '');
    } else {
        self.Type("GROUP");
        self.Name("Untitled group")
    }

    return self;
}

function CustAttribute(data) {
    var self = {};
    self.Id = ko.observable(getTextValue(data.RelatedAttributeDefinition["AttributeDefinition-id"].Id));
    self.ItemId = ko.observable(getTextValue(data.RelatedAttributeDefinition["AttributeDefinition-id"].ItemId));
    self.displayName = ko.observable(getTextValue(data.RelatedAttributeDefinition.RelatedLabel.Label));
    console.log(self.displayName())
    self.fieldType = ko.observable(getTextValue(data.RelatedAttributeDefinition.DataType));
    self.selected = ko.observable(false);
    return self;
}

function ContractAttribute(data) {
    var self = {};
    self.Id = ko.observable(getTextValue(data["RelatedGCProps-id"].Id));
    self.Id1 = ko.observable(getTextValue(data["RelatedGCProps-id"].Id1));
    self.ItemId = ko.observable(getTextValue(data["RelatedGCProps-id"].ItemId));
    self.ItemId1 = ko.observable(getTextValue(data["RelatedGCProps-id"].ItemId1));
    self.DisplayName = ko.observable(getTextValue(data.DisplayName));
    self.IsMultiField = ko.observable(getTextValue(data.IsMultiField));
    self.Purpose = ko.observable(getTextValue(data.Purpose));
    self.Xpath = ko.observable(getTextValue(data.Xpath));
    self.Name = ko.observable(getTextValue(data.Name));
    self.CreationType = ko.observable(getTextValue(data.CreationType));
    self.Type = ko.observable(getTextValue(data.DataType));
    self.processId = ko.observable(getTextValue(data.OwnerGCProcess['GCProcess-id'].Id));
    self.processItemId = ko.observable(getTextValue(data.OwnerGCProcess['GCProcess-id'].ItemId));
    self.selected = ko.observable(false);
    self.groupId = ko.observable(getTextValue(data.GroupID));
    self.isMandatory = ko.observable(getTextValue(data.IsMandatory));
    self.isReadOnly = ko.observable(getTextValue(data.IsReadOnly));
    return self;
}


function ContainerNode(data) {
    var self = {};
    self.attr = ko.observable(data);
    self.container = ko.observableArray();
    self.action = ko.observable("NONE");
    self.display = ko.observable(false);
    self.isEditable = ko.observable(data && !data.isEditable() ? false : true);


    self.isDeletable = ko.observable(_deletableTab());
    self.GroupID = ko.observable(data && data.GroupID && data.GroupID() ? data.GroupID() : "");

    self.showOptions = ko.observable(false);

    function _deletableTab() {
        let isDeletable = true;
        if (data.Type() === 'TAB') {
            defaultTabs.forEach(tab => {
                if ((tab.Name === data.Name()) && !tab.isDeletable) {
                    isDeletable = false;
                }
            })
        }
        return isDeletable;
    }

    self.deleteTab = function (data, parent, grandParent, event) {
        _hideOptions();

        _deleteTab(data, parent, grandParent);
    }

    self.deleteGroup = function (data, parent, granParent, event) {
        _hideOptions();
        _deleteGroup(data, parent, granParent);
    }

    function _hideOptions() {
        self.showOptions(false);
    }

    function _deleteTab(attrObs, parent, grandParent) {
        attrObs.action(ACTION_DELETE_TAB);
        parent.displayAttrList.remove(attrObs);
        parent.deletedAttributesList.push(attrObs);
        grandParent.layoutModal().displayAttrList().some(function (element, index) {
            if (element.isEditable() == true) {
                grandParent.layoutModal().displayAttrList()[index].display(true);
                return true
            }
            else return false
        })
    }

    function _deleteGroup(attrObs, parent, granParent) {
        parent.container.remove(attrObs);
        if (attrObs.action().indexOf("NEW") === -1) {
            attrObs.action(ACTION_DELETE_GROUP);
            granParent.deletedAttributesList.push(attrObs);
        }
    }

    self.openTabEditOptions = function () {
        self.showOptions(!self.showOptions());
    }

    self.openGroupEditOptions = function () {
        self.showOptions(!self.showOptions());
    }

    self.openGroupOpenDetails = function (data, layoutObs, event) {
        self.display(!self.display());
    }

    // Move  down.
    self.moveDown = function (data, parent) {
        _hideOptions();
        var index = parent.displayAttrList().indexOf(data);
        if (index < parent.displayAttrList().length - 1) {
            parent.displayAttrList.remove(data);
            parent.displayAttrList.splice(index + 1, 0, data);
            _checkActionAndUpdate(parent.displayAttrList()[index], ACTION_UPDATE_TAB);
            _checkActionAndUpdate(parent.displayAttrList()[index + 1], ACTION_UPDATE_TAB);
        }
        _reOrderList(parent.displayAttrList);
    }

    // Move up.
    self.moveUp = function (data, parent) {
        _hideOptions();
        var index = parent.displayAttrList().indexOf(data);
        if (index > 0) {
            parent.displayAttrList.remove(data);
            parent.displayAttrList.splice(index - 1, 0, data);
            _checkActionAndUpdate(parent.displayAttrList()[index], ACTION_UPDATE_TAB);
            _checkActionAndUpdate(parent.displayAttrList()[index - 1], ACTION_UPDATE_TAB);
        }
        _reOrderList(parent.displayAttrList);
    }
    // Move  down.
    self.moveGroupDown = function (data, parent) {
        _hideOptions();
        var index = parent.container().indexOf(data);
        if (index < parent.container().length - 1) {
            parent.container.remove(data);
            parent.container.splice(index + 1, 0, data);
            _checkActionAndUpdate(parent.container()[index], ACTION_UPDATE_GROUP);
            _checkActionAndUpdate(parent.container()[index + 1], ACTION_UPDATE_GROUP);
        }
        _reOrderList(parent.container);
    }

    // Move up.
    self.moveGroupUp = function (data, parent) {
        _hideOptions();
        var index = parent.container().indexOf(data);
        if (index > 0) {
            parent.container.remove(data);
            parent.container.splice(index - 1, 0, data);
            _checkActionAndUpdate(parent.container()[index], ACTION_UPDATE_GROUP);
            _checkActionAndUpdate(parent.container()[index - 1], ACTION_UPDATE_GROUP);
        }
        _reOrderList(parent.container);
    }

    function _reOrderList(displayAttrList) {
        displayAttrList().forEach((ele, index) => {
            ele.attr().Order(index);
        });
    }

    function _checkActionAndUpdate(data, newaction) {
        if (!(!data.action() || data.action().indexOf("NEW") >= 0)) {
            data.action(newaction);
        }
    }

    return self;
}

function LayoutConfig(data) {
    var self = {};
    self.Id = ko.observable(data ? getTextValue(data["LayoutConfig-id"].Id) : "");
    self.ItemId = ko.observable(data ? getTextValue(data["LayoutConfig-id"].ItemId) : "");
    self.Status = ko.observable(data ? getTextValue(data.Status) : "INACTIVE");
    self.Version = ko.observable(data ? getTextValue(data.Version) : "");
    self.Colsize = ko.observable(data ? +getTextValue(data.Colsize) : 2);
    self.Name = ko.observable(data ? getTextValue(data.Name) : "Untitled layout");
    self.attributeList = ko.observableArray();

    self.showCustAttrList = ko.observable(true);
    self.showContractAttrList = ko.observable(true);

    self.custAttributesList = ko.observableArray();
    self.contractAttributesList = ko.observableArray();

    self.deletedAttributesList = ko.observableArray();

    self.mappedAllRelAttList = ko.observableArray();
    self.fieldGroupsOriginal = ko.observableArray();
    self.fieldGroups = ko.observableArray();
    self.fieldGroupsGp = ko.observableArray();
    self.columnSizeOptions = ko.observableArray([2, 3, 4]);
    self.showRightPanelFields = ko.observable(false);
    self.showRightPanelDetails = ko.observable(false);
    self.isRightPanelEdit = ko.observable(false);
    self.displayAttrList = ko.observableArray();

    self.showCtrAttrSelectList = ko.observable(true);

    self.selectedGroup = ko.observable();
    self.selectedAttribute = ko.observable();
    self.selectedAttributeTabOrGp = ko.observable();
    self.showOptions = ko.observable(false);

    self.addNewAttribureModel = ko.observable(null);

    self.displayLayoutSettings = ko.observable(false);

    //Drag and drop observables
    self.sourceDragAttribute = ko.observable(null);
    self.sourceDragParentGroup = ko.observable(null);
    self.targetDragAttribute = ko.observable(null);
    self.targetDragParentGroup = ko.observable(null);




    function _hideOptions() {
        self.showOptions(false);
    }

    self.showCustAttSelectList = function (data, event) {
        self.showCtrAttrSelectList(false);
    }
    self.showCTRAttSelectList = function (data, event) {
        self.showCtrAttrSelectList(true);
    }

    self.attributeLableChange = function (data, event) {
        console.log(data);
        _changeAttrAction(data, event);
    }


    self.attributeRequiredChange = function (data, event) {
        var isMandatory = data.selectedAttribute().attr().IsMandatory();
        if (isMandatory === 'TRUE') {
            data.selectedAttribute().attr().IsMandatory('FALSE');
        } else {
            data.selectedAttribute().attr().IsMandatory('TRUE');
        }
        _changeAttrAction(data, event);
        return true;
    }

    function _changeAttrAction(data, event) {
        if (data.selectedAttribute().action().indexOf("NEW") === -1) {
            if (data.selectedAttribute().attr().Type() === 'CONTRACTATTRIBUTE') {
                data.selectedAttribute().action(ACTION_UPDATE_CTRATTR);
            } else {
                data.selectedAttribute().action(ACTION_UPDATE_CUSTATTR);
            }
        }
    }

    self.ContractPropertiesClick = function (data, event) {
        console.log(data);
        self.contractAttributesList().forEach(attr => {
            if (data.groupId() && data.groupId() === attr.groupId()) {
                attr.selected(data.selected());
            }
        });
        return true;
    }

    self.deleteLayout = function (data, event, parent) {
        _hideOptions(event);
        $("#confirmationDeleteLayout").modal({
            backdrop: 'static',
            keyboard: false
        });
        $('button#confirmYesDeleteLayout').off("click");
        $('button#confirmYesDeleteLayout').on('click', function (_event) {
            if (data.Id()) {
                isActionClicked = true;
                cc_customize_services.DeleteLayoutConfigService({ 'layoutId': self.Id() }, function (response, status) {
                    if (status !== "ERROR" && response.Response.Status !== "FAILED" && !response.Response.Error) {
                        successToast(3000, getTranslationMessage("Configuration deleted"));
                        refreshCustomizeScreen();
                    } else {
                        let errorMsg = response.Response.Error.Message;
                        if(!errorMsg){
                            errorMsg = response.Response.Error
                        }
                        showError([getTextValue(errorMsg)], ".");
                    }
                });
            } else {
                refreshCustomizeScreen();
            }
        });
        event.stopPropagation();
    }

    self.cloneLayout = function (data, event) {
        l_customModullar_model.cloneLayout(data);
    }


    self.openLayoutEditOptions = function () {
        self.showOptions(!self.showOptions());
    }


    self.toggleLayoutSettings = function () {
        self.displayLayoutSettings(!self.displayLayoutSettings());
    }

    self.changeColumnSizeClick = function (colSize = 2) {
        self.Colsize(colSize);
        self.adjustColLayout();
        self.displayLayoutSettings(false);
    }



    self.adjustColLayout = function () {
        var colSize = self.Colsize();
        self.displayAttrList().forEach(dispTab => {
            dispTab.container().forEach(ele => {
                var count = 0;
                ele.container().forEach(fld => {
                    fld.attr().Style().Class('flex-cn-cl-25');
                    if ((count + 1) % (colSize) === 0) {
                        if (colSize === 3) {
                            fld.attr().Style().Class('flex-cn-cl-50');
                        } else if (colSize === 2) {
                            fld.attr().Style().Class('flex-cn-cl-75');
                        }
                    }
                    count++;
                });
            });
        });
    }

    self.AddFieldToGroup = function (data, event) {
        _addCustAttrToGroup();
        _addContractAttrToGroup();
        self.adjustColLayout();
    }


    function _addContractAttrToGroup() {
        var custselectedLst = self.contractAttributesList().filter(el => el.selected());
        for (let index = 0; index < custselectedLst.length; index++) {
            const element = custselectedLst[index];
            var custAttDef = _populateNewLinkContractAttribute(element);
            self.selectedGroup().container.push(custAttDef);
        }
        self.contractAttributesList().forEach(el => el.selected(false));
    }

    function _populateNewLinkContractAttribute(element) {
        var relAtt = RelatedAttrDef(null, self);
        relAtt.Type("CONTRACTATTRIBUTE");
        _addNewAttributeIds(relAtt);
        relAtt.AttrDefItemId(element.ItemId1());
        relAtt.AttrDefType(element.Type());
        relAtt.IsMandatory(element.isMandatory());
        relAtt.GroupID(element.groupId());
        relAtt.IsReadOnly(element.isReadOnly());
        relAtt.Name(element.DisplayName());
        relAtt.ParentRelAttrDefId(self.selectedGroup().attr().Id());
        relAtt.ParentRelAttrDefId1(self.selectedGroup().attr().Id1());
        relAtt.ParentRelAttrDefItemId(self.selectedGroup().attr().ItemId());
        relAtt.ParentRelAttrDefItemId1(self.selectedGroup().attr().ItemId1());
        var custAttDef = ContainerNode(relAtt);
        custAttDef.action("NEW_LINKED_CTR_ATTRIBUTE");
        return custAttDef;
    }




    function _addCustAttrToGroup() {
        var custselectedLst = self.custAttributesList().filter(el => el.selected());
        for (let index = 0; index < custselectedLst.length; index++) {
            const element = custselectedLst[index];
            var custAttDef = _populateNewLinkedCustAttr(element);
            self.selectedGroup().container.push(custAttDef);
        }
        self.custAttributesList().forEach(el => el.selected(false));
    }


    function _populateNewLinkedCustAttr(element) {
        var relAtt = RelatedAttrDef(null, self);
        relAtt.Type("CUSTATTRIBUTE");
        _addNewCustAttrIds(relAtt);
        relAtt.AttrDefId(element.Id());
        relAtt.AttrDefItemId(element.ItemId());
        relAtt.AttrDefType(element.fieldType());
        relAtt.Name(element.displayName());
        relAtt.ParentRelAttrDefId(self.selectedGroup().attr().Id());
        relAtt.ParentRelAttrDefId1(self.selectedGroup().attr().Id1());
        relAtt.ParentRelAttrDefItemId(self.selectedGroup().attr().ItemId());
        relAtt.ParentRelAttrDefItemId1(self.selectedGroup().attr().ItemId1());
        var custAttDef = ContainerNode(relAtt);
        custAttDef.action("NEW_LINKED_ATTRIBUTE");
        return custAttDef;
    }

    self.selectGroup = function (data, event) {
        self.selectedGroup(data);
        _clearSelectAttribute();
        _hideRightPanel();
    }

    self.unSelectGroup = function (data, event) {
        self.selectedGroup(null);
        _clearSelectAttribute();
        _hideRightPanel();
    }

    self.selectAttribute = function (data, parentTab, event) {
        var attrDefType = data.attr().AttrDefType();
        self.selectedAttribute(data);
        self.selectedAttributeTabOrGp(parentTab);
        data.attr().AttrDefType(attrDefType);
        _clearSelectGroup();
    }

    self.closeRightPanel = function (data, event) {
        _closeClearRightPanel();
    }

    function _closeClearRightPanel() {
        _clearNewAttribute();
        _clearSelectAttribute();
        _clearSelectGroup();
        _clearRightPanel();
        _hideRightPanel();
    }

    function _clearSelectAttribute() {
        self.selectedAttribute(null);
        self.selectedAttributeTabOrGp(null);
    }

    function _clearSelectGroup() {
        self.selectedGroup(null);
    }

    function _clearNewAttribute() {
        self.addNewAttribureModel(null);
    }

    function _clearRightPanel() {
        self.showRightPanelFields(false);
    }


    self.getAllRelatedCustAttDefsbyLayout = function (callBackFunc) {
        if (self.Id()) {
            cc_customize_services.getAllLayoutRelAttrDefService({ layoutId: self.Id() }, function (response, status) {
                if (status === "SUCCESS") {
                    _populateMappedAttrList(response);
                    if (callBackFunc) {
                        callBackFunc("SUCCESS");
                    }

                } else {
                    if (callBackFunc) {
                        callBackFunc("ERROR");
                    }
                }
            });
        }
    }

    function _populateMappedAttrList(response) {
        var relAttDefList = response.Response.FindZ_INT_AllRelatedAttrDefinitionResponse.RelatedAttrDefinition;
        self.mappedAllRelAttList.removeAll();
        if (relAttDefList && Array.isArray(relAttDefList)) {
            for (let index = 0; index < relAttDefList.length; index++) {
                const element = relAttDefList[index];
                self.mappedAllRelAttList.push(RelatedAttrDef(element, self));
            }
        } else if (relAttDefList) {
            self.mappedAllRelAttList.push(RelatedAttrDef(relAttDefList, self));
        }
        self.displayAttrList.removeAll();
        var tabList = self.mappedAllRelAttList().filter(ele => ele.Type() === "TAB");
        for (let index = 0; index < tabList.length; index++) {
            const element = tabList[index];
            addDisplayContainer(self.displayAttrList, element);
        }

        if (self.displayAttrList().length > 0) {
            var dispList = self.displayAttrList().filter(el => el.isEditable());
            dispList[0].display(true);
        }
        self.adjustColLayout();
        self.displayAttrList.sort(sortOnOrder);
    }

    function addDisplayContainer(obsList, attrDefObs) {
        var attrDef = ContainerNode(attrDefObs);
        obsList.push(attrDef);
        var childContainers = self.mappedAllRelAttList()
            .filter(ele => ele.ParentRelAttrDefItemId &&
                ele.ParentRelAttrDefItemId1() === attrDefObs.ItemId1());
        for (let index = 0; index < childContainers.length; index++) {
            const element = childContainers[index];
            addDisplayContainer(attrDef.container, element);
        }
        attrDef.container.sort(sortOnOrder);
    }


    function sortOnOrder(l_ele1, l_ele2) {
        return l_ele1.attr().Order() - l_ele2.attr().Order();
    }

    self.hideRightPanel = function () {
        _hideRightPanel()
    }

    function _hideRightPanel() {
        self.showRightPanelFields(false);
        self.showRightPanelDetails(false);
        self.isRightPanelEdit(false);
        self.selectedAttribute(null);
        self.addNewAttribureModel(null);
    }
    function _hideRightPanelEdit() {
        self.showRightPanelFields(false);
        self.showRightPanelDetails(false);
        self.isRightPanelEdit(false);
        self.addNewAttribureModel(null);
    }

    self.displayTab = function (data, event) {
        _displayTab(data);
    }

    function _displayTab(data) {
        if (data.isEditable()) {
            _hideAllTabs();
            data.display(true);
        }
    }

    self.addFieldTabs = function () {
        var tab = _addNewTab();
        _displayTab(tab);
    }

    self.addAllDefaultTabs = function () {
        for (let index = 0; index < defaultTabs.length; index++) {
            const element = defaultTabs[index];
            _addNewTab(element, true);
        }
        self.displayAttrList().forEach(tab => {
            _displayTab(tab);
        });
        self.adjustColLayout();
    }

    function _addNewTab(l_input, addDefaultAttr = false) {
        var relAttrGroup = RelatedAttrDef(null, self);
        relAttrGroup.Type("TAB");
        relAttrGroup.Name(l_input && l_input.Name ? l_input.Name : "Untitled tab");
        _addNewTabIDs(relAttrGroup);
        var custAttrDef = ContainerNode(relAttrGroup);
        custAttrDef.action("NEW_LINKED_TAB");
        custAttrDef.isEditable(l_input && !l_input.isEditable ? false : true);
        custAttrDef.isDeletable(l_input && l_input.isDeletable ? true : false);
        self.displayAttrList.push(custAttrDef);
        if (custAttrDef.isEditable() && addDefaultAttr) {
            _addNewDefaultLinkedGroup(custAttrDef);
            custAttrDef.display(true);
        }
        _hideAllTabs();
        // custAttrDef.display(true);
        return custAttrDef;
    }




    function _addNewDefaultLinkedGroup(tab) {
        var newGroup = _populateNewLinkedGroup();
        tab.display(true);
        tab.container.push(newGroup);
        self.selectedGroup(newGroup);
        _addDefaultContractAttrsToGroup(newGroup);
        self.selectedGroup(null);
    }

    function _addDefaultContractAttrsToGroup(group) {
        self.populateContractAttributes();
        var addedDefaultAttrs = [];
        self.contractAttributesList().forEach(attr => {
            if (attr.isMandatory() === 'TRUE' && addedDefaultAttrs.indexOf(attr) <= 0) {
                if (attr.groupId()) {
                    _addAllGroupRelatedAttrs(addedDefaultAttrs, attr, group);
                } else {
                    group.container.push(_populateNewLinkContractAttribute(attr));
                    addedDefaultAttrs.push(attr);
                }
            }
        });
    }

    function _addAllGroupRelatedAttrs(addedDefaultAttrs, groupAttr, group) {
        self.contractAttributesList().forEach(attr => {
            if (groupAttr.groupId() && (groupAttr.groupId() === attr.groupId())) {
                group.container.push(_populateNewLinkContractAttribute(attr));
                addedDefaultAttrs.push(attr);
            }
        });
    }

    function _hideAllTabs() {
        self.displayAttrList().forEach(ele => ele.display(false));
    }

    self.addFieldGroups = function () {
        var displayTab = self.displayAttrList().filter(ele => ele.display());
        var custAttrDef = _populateNewLinkedGroup();
        if (displayTab && displayTab.length > 0) {
            displayTab[0].container.push(custAttrDef);
        } else {
            self.displayAttrList()[0].display(true);
            self.displayAttrList()[0].container.push(custAttrDef);
        }
    }


    function _populateNewLinkedGroup() {
        var relAttrGroup = RelatedAttrDef(null, self);
        relAttrGroup.Type("GROUP");
        relAttrGroup.Name("Untitled group");
        _addNewGroupIDs(relAttrGroup);
        var custAttrDef = ContainerNode(relAttrGroup);
        custAttrDef.action("NEW_LINKED_GROUP");
        return custAttrDef;
    }


    self.openFieldList = function (data, event) {
        if (self.showRightPanelFields()) {
            _hideRightPanel();
        } else {
            _hideRightPanel();
            self.populateCustAttributes();
            self.populateContractAttributes();
            self.showRightPanelFields(true);
        }
        event.stopPropagation();
    }

    self.deleteSelectedAttr = function (data, event) {
        $("#div_deleteAttrModal").modal({
            backdrop: 'static',
            keyboard: false
        });
        $('button#btn_deleteAttributeYes').off("click");
        $('button#btn_deleteAttributeYes').on('click', function (_event) {
            if (!self.selectedAttribute().action() || self.selectedAttribute().action().indexOf("NEW") < 0) {
                self.deletedAttributesList.push(self.selectedAttribute());
            }
            self.selectedAttributeTabOrGp().container.remove(self.selectedAttribute());
            _deleteAllGrouprelatedAttrs(self.selectedAttribute().GroupID());
            _clearSelectAttribute();
            self.adjustColLayout();
        });
        event.preventDefault();
        event.stopPropagation();
    }

    function _deleteAllGrouprelatedAttrs(groupID) {
        if (groupID) {
            let selectedTab = self.displayAttrList().filter(ele => ele.display());
            if (selectedTab.length > 0) {
                selectedTab[0].container().forEach(gp => {
                    let groupList = gp.container().filter(ele => ele.GroupID() === groupID);
                    if (groupList.length > 0) {
                        groupList.forEach(ele => {
                            gp.container.remove(ele)
                            if (!ele.action() || ele.action().indexOf("NEW") < 0) {
                                self.deletedAttributesList.push(ele);
                            }
                        });
                    }
                }
                );
            }
        }
    }

    self.openFieldCreateScreen = function (data, event) {
        if (self.showRightPanelDetails()) {
            _hideRightPanel();
        } else {
            _hideRightPanel();
            self.showRightPanelDetails(true);
            self.isRightPanelEdit(false);
            self.addNewAttribureModel(new CustomAttributeModel());
        }
        event.preventDefault();
        event.stopPropagation();
    }

    self.openFieldEditScreen = function (data, event) {
        if (self.showRightPanelDetails()) {
            _hideRightPanelEdit();
        } else {
            _hideRightPanelEdit();
            self.showRightPanelDetails(true);
            self.isRightPanelEdit(true);
        }
        event.stopPropagation();
        event.preventDefault();
    }

    self.populateCustAttributes = function () {
        cc_customize_services.getCustomAttributesListService({ "ctrTypeID": l_customModullar_model.contractType().split(".")[1] }, function (data, status) {
            if (status === "SUCCESS") {
                self.custAttributesList.removeAll();
                var custAttrList = data.FindZ_INT_TypeAttrMappingResponse.AttributeMapping;
                if (null != custAttrList && Array.isArray(custAttrList)) {
                    for (let index = 0; index < custAttrList.length; index++) {
                        const element = custAttrList[index];
                        self.custAttributesList.push(CustAttribute(element));
                    }
                } else if (null != custAttrList) {
                    self.custAttributesList.push(CustAttribute(custAttrList));
                }

            }
        });
    }

    self.populateContractAttributes = function () {
        self.contractAttributesList.removeAll();
        if (null != l_customModullar_model && Array.isArray(l_customModullar_model.contractAttributeList())) {
            for (let index = 0; index < l_customModullar_model.contractAttributeList().length; index++) {
                const element = l_customModullar_model.contractAttributeList()[index];
                self.contractAttributesList.push(element);
            }
        }
    }

    self.populateDefaultTabs = function () {
        self.contractAttributesList.removeAll();
        if (null != l_customModullar_model && Array.isArray(l_customModullar_model.contractAttributeList())) {
            for (let index = 0; index < l_customModullar_model.contractAttributeList().length; index++) {
                const element = l_customModullar_model.contractAttributeList()[index];
                self.contractAttributesList.push(element);
            }
        }
    }


    // Drag and drop functionality start
    self.rowDrag = function (data, parent, event) {
        self.sourceDragAttribute(data);
        self.sourceDragParentGroup(parent);
    }

    self.rowDrop = function (data, parent, event) {
        console.log(data);
        if (data.attr().Type() === 'GROUP') {
            self.sourceDragParentGroup().container.remove(self.sourceDragAttribute());
            data.container.splice(0, 0, self.sourceDragAttribute());
        } else {
            var targetIndex = self.targetDragParentGroup().container().indexOf(self.targetDragAttribute());
            self.sourceDragParentGroup().container.remove(self.sourceDragAttribute());
            self.targetDragParentGroup().container.splice(targetIndex, 0, self.sourceDragAttribute());
        }
        _updateAttributeAction(self.sourceDragAttribute());
        if (data.attr().Type() === 'GROUP') {
            data.container().forEach(attr => {
                _updateAttributeAction(attr);
            });
        } else {
            self.targetDragParentGroup().container().forEach(attr => {
                _updateAttributeAction(attr);
            });
        }
        _clearAllDragData();
        self.adjustColLayout();
        event.preventDefault();
        event.stopPropagation();
    }

    function _updateAttributeAction(attrObj) {
        if (attrObj.attr().Type() === ATTR_CUSTATTR) {
            attrObj.action().indexOf("NEW") < 0 ? attrObj.action(ACTION_UPDATE_CUSTATTR) : "";
        } else if (attrObj.attr().Type() === ATTR_CONTATTR) {
            attrObj.action().indexOf("NEW") < 0 ? attrObj.action(ACTION_UPDATE_CTRATTR) : "";
        }
    }

    self.rowDragEnter = function (data, parent, event) {
        self.targetDragAttribute(data);
        self.targetDragParentGroup(parent);
        event.preventDefault();
    }
    self.rowDragLeave = function (data, parent, event) {
        self.targetDragAttribute(null);
        self.targetDragParentGroup(null);
        event.preventDefault();
    }
    self.rowDragOver = function (data, parent, event) {
        self.targetDragAttribute(data);
        self.targetDragParentGroup(parent);
        event.preventDefault();
    }
    self.allowDrop = function (data, parent, event) {
        event.preventDefault();
    }
    self.preventDrop = function (data, parent, event) {
        event.preventDefault();
    }

    function _clearAllDragData() {
        self.sourceDragAttribute(null);
        self.sourceDragParentGroup(null);
        self.targetDragAttribute(null);
        self.targetDragParentGroup(null);
    }
    // Drag and drop functionality end





    return self;
}

var CustomAttributeModel = function () {
    var self = this;
    self.id = null;
    // Attribute properties.
    self.name = ko.observable("");
    self.label = ko.observable("");
    self.labelid = "";
    self.dataType = ko.observable("");
    self.attributeMedadata = "";
    self.dateFormat = ko.observable("");
    self.selectOptions = ko.observableArray([]);
    self.selectDeletedOptions = ko.observableArray([]);
    self.initialClonedCTRTypes = [];
    self.oldEnumValues = [];
    self.ContractTypes = ko.observableArray([]);
    self.enumValues = ko.observableArray([]);

    self.deletedEnumValues = ko.observable([]);
    self.allOptions = ko.observable([]);

    // Flags to handle
    self.isNewlyCreated = true;
    self.isMetadataUpdated = false;
    self.isLabelUpdated = false;
    self.isContractTypesLoaded = false;

    self.allowDecimal = ko.observable(false);
    self.isEditable = ko.observable(false);
    self.isDirty = ko.observable(false);

    //behavior.
    self.addIntoSelectOptions = function () {
        var option = $("#datatype_dropdown_option").val();
        if (option) {
            option = option.trim();
            var existedItem = false;
            for (var i = 0; i < self.selectOptions().length; i++) {
                if (option == self.selectOptions()[i].option) {
                    existedItem = true;
                    break;
                }
            }
            if (!existedItem && self.selectOptions().length < 100) {
                var optionObject = {};
                if (self.id) {
                    optionObject.id = self.id;
                }
                optionObject.option = option;
                optionObject.order = self.selectOptions().length + 1;
                self.selectOptions.push(optionObject);
                self.isMetadataUpdated = true;
                self.isDirty(true);
            }
        }
        $("#datatype_dropdown_option").val("");
    }

    self.updateLabelChangeFlag = function (option) {

    }

    self.cancelSaveOREdit = function (data, event) {
        $("#btn_addNewAtrribute").prop("disabled", false);
        if (self.isNewlyCreated == true) {
            data.addNewAttribureModel(new CustomAttributeModel());
        }
    }

    self.saveAttribute = function (option) {
        var selectedAttribute = self;
        saveNewAttribute(selectedAttribute);
    }


    function saveNewAttribute(attribute) {
		isActionClicked = true;
        if (attribute && validateMandatoryFields(attribute)) {
            var requestObj = formSaveAttributeObject(attribute);
            if (requestObj) {
                $.cordys.ajax({
                    method: "CreateAttributeWithMappings",
                    namespace: "http://schemas.opentext.com/apps/cc/customattributes/21.4",
                    parameters: requestObj,
                    success: function (responseSuccess) {
                        l_customModullar_model.layoutModal().closeRightPanel();
                    },
                    error: function (responseFailure) {
                        if (responseFailure.responseText.includes("NAME_UNIQUE_ERROR")) {
                            showError([getTranslationMessage("The attribute with the name '" + requestObj.name + "' already exists")], ".");
                        }
                        else {
                            showError([getTranslationMessage("An error occurred while creating the custom attribute. Contact your administrator")], ".");
                        }
                        return false;
                    }
                });
            }
        }
    }


    function formSaveAttributeObject(attribute) {
        var requestObj = {};
        if (attribute) {
            requestObj.name = attribute.name();
            requestObj.datatype = attribute.dataType();
            requestObj.mappings = {};
            requestObj.mappings.newCTRTypeMappings = getNewCTRTypeMappings();
            requestObj.dropdownOptions = getEnums(attribute);
            requestObj.label = attribute.label();
            formMetaDataInJSONFormat(attribute);
            attribute.selectOptions();
            requestObj.attributemetadata = attribute.attributeMedadata;
        }
        return requestObj;
    }

    function getEnums(attribute) {
        var l_options = {};
        l_options["RelatedEnums-create"] = [];
        attribute.selectOptions().forEach(function (val) {
            var l_value = {};
            l_value.enumvalue = val.option;
            l_value.enumlabel = val.option;
            l_value.order = val.order;
            l_options["RelatedEnums-create"].push(l_value);
        })
        return l_options;
    }

    function getNewCTRTypeMappings() {
        var l_mappings = {}
        l_mappings.CTRType = [];
        var l_ctrType = {};
        l_ctrType.CTRTypeID = l_customModullar_model.contractType().split(".")[1];
        l_mappings.CTRType.push(l_ctrType);
        return l_mappings;
    }

    function formMetaDataInJSONFormat(model) {
        if (model) {
            var metaDataObj = {};
            switch (model.dataType()) {
                case DATA_TYPE_BOOLEAN:
                    break;
                case DATA_TYPE_NUMBER:
                    metaDataObj.decimal = model.allowDecimal();
                    break;
                case DATA_TYPE_TEXT:
                    break;
                case DATA_TYPE_DATE:
                    metaDataObj.dateformat = model.dateFormat();
                    break;
                case DATA_TYPE_ENUM:
                    metaDataObj.dropdown = {};
                    metaDataObj.dropdown.options = model.selectOptions();
                    break;
            }
            model.attributeMedadata = JSON.stringify(metaDataObj);
        }
    }

    function validateMandatoryFields(i_attribute) {
        var validationFlag = true;
		var specialChars = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
		var startingWithNumber = /^\d/;
        if (i_attribute.name() == "" || i_attribute.name() == undefined) {
            $("#property_name").addClass("cc-error");
            validationFlag = false;
        }else if(i_attribute.name().match(specialChars)){
			$("#property_name").addClass("cc-error");
			validationFlag = false;
			showError([getTranslationMessage("Name must be composed of letters, numbers, underscores")], ".");
		}
		else if(i_attribute.name().match(startingWithNumber)){
			$("#property_name").addClass("cc-error");
			validationFlag = false;
			showError([getTranslationMessage("Names must begin with letter or an underscore")], ".");
		}
        if (i_attribute.dataType() == "" || i_attribute.dataType() == undefined) {
            $("#property_datatype").addClass("cc-error");
            validationFlag = false;
        }
        if (i_attribute.label() == "" || i_attribute.label() == undefined) {
            $("#property_label").addClass("cc-error");
            validationFlag = false;
        }

        if (i_attribute.dataType() == DATA_TYPE_ENUM && i_attribute.selectOptions().length < 1) {
            $("#datatype_dropdown_option").addClass("cc-error");
            validationFlag = false;
        }
        return validationFlag;
    }

    self.updateMetadataFlag = function (option) {

    }

    self.removeOption = function (option) {
        //CHANGE
        if (option) {
            var rmIndex = self.selectOptions().indexOf(option);
            self.selectOptions.remove(option);
            for (let index = rmIndex; index < self.selectOptions().length; index++) {
                self.selectOptions()[index].order = index + 1;
            }
            self.isMetadataUpdated = true;
            self.isDirty(true);
        }
    }

    self.allowDecimalCheckboxChanged = function (iItem, event) {
        if ($(event.currentTarget).hasClass("cc-checkbox-on")) {
            self.allowDecimal(false);
            self.isMetadataUpdated = true;
            self.isDirty(true);
        }
        else if ($(event.currentTarget).hasClass("cc-checkbox-off")) {
            self.allowDecimal(true);
            self.isMetadataUpdated = true;
            self.isDirty(true);

        }
        event.stopPropagation();
    }

    self.removefromMappedTypes = function (i_type) {
        if (i_type) {
            self.ContractTypes.remove(i_type);
            self.mappingsUpdated = true;
            self.isDirty(true);
        }
    }

    self.removefromEnum = function (i_val) {
        if (i_type) {
            self.enumValues.remove(i_val);
            self.enumUpdated = true;
            self.isDirty(true);
        }
    }
}

var CustomModullar = function () {
    var self = this;
    self.contractType = ko.observable();
    self.isRightPanelEdit = ko.observable(false);
    self.layoutModal = ko.observable();
    self.layoutConfigList = ko.observableArray();
    self.contractAttributeList = ko.observableArray();
    self.displayAllConfigList = ko.observable(true);

    self.toggleDisplayConfButton = function (data, event) {
        self.displayAllConfigList(!self.displayAllConfigList());
    }


    self.openLayoutConfig = function (layOutdata, event, callBackFunc) {
        console.log(layOutdata);
        self.layoutModal(layOutdata);
        layOutdata.getAllRelatedCustAttDefsbyLayout(callBackFunc);
    }

    self.changeLayoutStatus = function (data, event) {
        if (data.Id()) {
            cc_customize_services.EnableLayoutConfigService(_prepareLayoutStatusUpdate(data), function (data, status) {
                if (status === "SUCCESS") {
                    self.populateLayoutList();
                    self.layoutModal(null);
                }
            });
        } else {
            showOrHideErrorInfo("div_layoutmodalErrorInfoArea", true, getTranslationMessage("Save config before enable."), 10000);
        }
    }

    function _prepareLayoutStatusUpdate(data) {
        var req = { "layoutId": data.Id() };
        return req;
    }


    self.populateLayoutList = function (callBackFun) {
        cc_customize_services.getLayoutConfigListService({ "ctrTypeId": self.contractType().split(".")[1] }, function (data, status) {
            if (status === "SUCCESS") {
                self.layoutConfigList.removeAll();
                var layoutConfList = data.LayoutConfig;
                if (null != layoutConfList && Array.isArray(layoutConfList)) {
                    for (let index = 0; index < layoutConfList.length; index++) {
                        const element = layoutConfList[index];
                        var layoutObs = LayoutConfig(element);
                        self.layoutConfigList.push(layoutObs);
                        layoutObs.adjustColLayout();
                    }
                } else if (null != layoutConfList) {
                    var layoutObs = LayoutConfig(layoutConfList);
                    self.layoutConfigList.push(layoutObs);
                    layoutObs.adjustColLayout();
                }
                // if (self.layoutConfigList().length <= 0) {
                //     l_customModullar_model.addNewLayoutModal();
                // }
                if (callBackFun) {
                    callBackFun();
                }
            }
        });
    }

    self.populateContractAttrList = function (req) {
        cc_customize_services.getAllContractRelAttrListService(req, function (data, status) {
            if (status === "SUCCESS") {
                self.contractAttributeList.removeAll();
                var relatedGCProps = data.RelatedGCProps;
                if (null != relatedGCProps && Array.isArray(relatedGCProps)) {
                    for (let index = 0; index < relatedGCProps.length; index++) {
                        const element = relatedGCProps[index];
                        self.contractAttributeList.push(ContractAttribute(element));
                    }
                } else if (null != relatedGCProps) {
                    self.contractAttributeList.push(ContractAttribute(relatedGCProps));
                }
            }
        });
    }

    self.cancelLayoutList = function () {
        if (self.layoutModal().ItemId()) {
            self.layoutModal().deletedAttributesList.removeAll();
            self.layoutModal().getAllRelatedCustAttDefsbyLayout();
        } else {
            refreshCustomizeScreen();
        }
    }
    self.saveLayoutList = function () {
        try {
            var req = _prepareSaveRequest();
            console.log(req);
            if (_validateSaveLayoutForm(req)) {
                cc_customize_services.saveOrUpdateLayout(req, function (response, status) {
                    if (status === "SUCCESS" && !(response.Response &&
                        response.Response.Status === 'FAILED')) {
                        console.log("Saved successfully");
                        successToast(3000, getTranslationMessage("Configuration saved"));
                    } else {
                        var errors = [];
                        if (!response.Response.Errors.Error.Message) {
                            var rawErrors = response.Response.Errors.Error.replaceAll("</Message>", "").split("<Message>");
                            rawErrors.forEach(error => {
                                if (error && error.trim()) {
                                    errors.push(error.trim());
                                }
                            });
                        } else {
                            errors.push(response.Response.Errors.Error.Message);
                        }
                        showError(errors, ".");
                    }
                    refreshCustomizeScreen();
                });
            }
        } catch (e) {
            console.error(e);
            refreshCustomizeScreen();
        }

    }

    self.cloneLayout = function (data) {
        self.openLayoutConfig(data, null, function (status) {
            if (status === "SUCCESS") {
                $("#confirmationCloneLayout").modal({
                    backdrop: 'static',
                    keyboard: false
                });
                document.getElementById("cloneConfigName_input").value = 'Copy of ' + self.layoutModal().Name();
                $('button#confirmYesCloneLayout').off("click");
                $('button#confirmYesCloneLayout').on('click', function (_event) {
                    try {
                        var req = _prepareSaveRequest(true, document.getElementById("cloneConfigName_input").value);
                        document.getElementById("cloneConfigName_input").value = '';
                        console.log(req);
                        if (_validateSaveLayoutForm(req)) {
                            cc_customize_services.saveOrUpdateLayout(req, function (response, status) {
                                if (status === "SUCCESS" && !(response.Response &&
                                    response.Response.Response &&
                                    response.Response.Response.Status === 'FAILED')) {
                                    console.log("Saved successfully");
                                    successToast(3000, getTranslationMessage("Configuration saved"));
                                } else {
                                    var rawErrors = response.Response.Response.Errors.Error.replaceAll("</Message>", "").split("<Message>");
                                    var errors = [];
                                    rawErrors.forEach(error => {
                                        if (error && error.trim()) {
                                            errors.push(error.trim());
                                        }
                                    });
                                    showError(errors);
                                }
                                refreshCustomizeScreen();
                            });
                        } else {
                            refreshCustomizeScreen();
                        }
                    } catch (e) {
                        console.error(e);
                        refreshCustomizeScreen();
                    }
                });
            }
        });
    }

    // self.saveLayoutList = function () {
    //     var req = _prepareSaveRequest();
    //     console.log(req);
    //     if (_validateSaveLayoutForm(req)) {
    //         cc_customize_services.saveOrUpdateLayout(req, function (response, status) {
    //             if (status === "SUCCESS") {
    //                 console.log("Saved successfully");
    //                 successToast(3000, getTranslationMessage("Configuration saved"));
    //                 refreshCustomizeScreen();
    //             }
    //         });
    //     }
    // }

    function _prepareSaveRequest(isClone = false, newLayoutName = "") {
        var attrList = [];
        var deletedAttrList = [];
        isActionClicked = true;
        var req = {
            layoutItemID: !isClone ? self.layoutModal().ItemId() : '',
            typeItemID: self.contractType(),
            layoutName: !isClone ? self.layoutModal().Name() : newLayoutName,
            processName: 'Contract',
            colSize: self.layoutModal().Colsize(),
            version: 0,
            status: !isClone ? self.layoutModal().Status() : "INACTIVE",
            Attributes: { Attribute: attrList },
            DeletedAttrs: { Attribute: !isClone ? deletedAttrList : [] }
        };

        self.layoutModal().displayAttrList().forEach((attr, index) => {
            attr.attr().Order(index);
            _prepareAttrReq(attr, null, attrList, isClone);
        });
        if (!isClone) {
            self.layoutModal().deletedAttributesList().forEach((attr, index) => {
                attr.attr().Order(index);
                _prepareDeletedAttrReq(attr, null, deletedAttrList, isClone);
            });
        }
        return req;
    }

    function _validateSaveLayoutForm(req) {
        var isValidForm = true;
        if (!_validateReqAttrList(req.Attributes.Attribute)) {
            isValidForm = false;
        }

        if (!_validateLayoutName(req)) {
            isValidForm = false;
        }

        return isValidForm;
    }

    function _validateLayoutName(req) {
        var isValidForm = true;
        var errors = [];
        if (!req.layoutName) {
            errors.push("Layout name cannot be empty");
            isValidForm = false;
        }
        showError(errors,".");
        return isValidForm;
    }


    function _validateReqAttrList(attrList) {
        var isValidForm = true;
        var contractReqAttr = self.contractAttributeList().filter(ele => ele.isMandatory() === 'TRUE');
        var errors = [];
        contractReqAttr.forEach(att => {
            var attrres = attrList.find(ele => ele.LinkedAttrDefID === att.ItemId1());
            if (!attrres) {
                isValidForm = false;
                console.log("Mandatory field is missing.");
                errors.push(att.DisplayName());
                console.log(att);
            }
        });

        attrList.forEach(ele => {
            if (!ele.AttrName) {
                isValidForm = false;
                let containerName = ele["@type"].charAt(0).toUpperCase() + ele["@type"].slice(1).toLowerCase();
                errors.push(containerName + " name cannot be empty");
            }
        })

        showError(errors, ".");
        return isValidForm;
    }

    function _prepareAttrReq(attr, parentAttr, reqAttrList, isClone = false) {
        var attrReq = _prepareReqAttrAll(attr, parentAttr, isClone);
        reqAttrList.push(attrReq);
        attr.container().forEach((attCh, index) => {
            attCh.attr().Order(index);
            _prepareAttrReq(attCh, attr, reqAttrList, isClone);
        });
    }

    function _prepareDeletedAttrReq(attr, parentAttr, reqAttrList) {
        var attrReq = _prepareReqAttrAll(attr, parentAttr);
        attr.container().forEach((attCh, index) => {
            attCh.attr().Order(index);
            _prepareDeletedAttrReq(attCh, attr, reqAttrList);
        });
        reqAttrList.push(attrReq);
    }

    function _prepareReqAttrAll(attr, parentAttr, isClone = false) {
        var attrReq = null;
        if (isClone) {
            _addReqCloneId(attr);
        }
        if (attr.attr().Type() === "TAB") {
            attrReq = _populateTabReq(attr, parentAttr, isClone);
        } else if (attr.attr().Type() === "GROUP") {
            attrReq = _populateGroupReq(attr, parentAttr, isClone);
        } else if (attr.attr().Type() === "CUSTATTRIBUTE") {
            attrReq = _populateCustAttrReq(attr, parentAttr, isClone);
            attrReq.IsMandatory = attr.attr().IsMandatory() && attr.attr().IsMandatory() === 'TRUE' ? 'TRUE' : 'FALSE';
        } else if (attr.attr().Type() === "CONTRACTATTRIBUTE") {
            attrReq = _populateContAttrReq(attr, parentAttr, isClone);
            attrReq.IsMandatory = attr.attr().IsMandatory() && attr.attr().IsMandatory() === 'TRUE' ? 'TRUE' : 'FALSE';
        }
        return attrReq;
    }

    function _addReqCloneId(attr) {
        if (attr.attr().Type() === "TAB") {
            _addNewTabIDs(attr.attr());
            attr.action(ACTION_NEW_TAB);
        } else if (attr.attr().Type() === "GROUP") {
            _addNewGroupIDs(attr.attr());
            attr.action(ACTION_NEW_GROUP);
        } else if (attr.attr().Type() === "CUSTATTRIBUTE") {
            _addNewCustAttrIds(attr.attr());
            attr.action(ACTION_NEW_CUSTATTR);
        } else if (attr.attr().Type() === "CONTRACTATTRIBUTE") {
            _addNewAttributeIds(attr.attr());
            attr.action(ACTION_NEW_CTRATTR);
        }
    }

    function _populateTabReq(attr, parentAttr, isClone = false) {
        var attrReq = _populateCommonAttrReq(attr, parentAttr);

        return attrReq;
    }

    function _populateGroupReq(attr, parentAttr, isClone = false) {
        var attrReq = _populateCommonAttrReq(attr, parentAttr);
        return attrReq;
    }

    function _populateCustAttrReq(attr, parentAttr, isClone = false) {
        var attrReq = _populateCommonAttrReq(attr, parentAttr);
        attrReq.LinkedAttrDefID = attr ? attr.attr().AttrDefItemId() : "";
        return attrReq;
    }
    function _populateContAttrReq(attr, parentAttr, isClone = false) {
        var attrReq = _populateCommonAttrReq(attr, parentAttr);
        attrReq.LinkedAttrDefID = attr ? attr.attr().AttrDefItemId() : "";
        return attrReq;
    }

    function _populateCommonAttrReq(attr, parentAttr) {
        return {
            '@type': attr.attr().Type(),
            '@action': attr.action(),
            Id: attr.attr().Id(),
            ItemId1: attr.attr().ItemId1(),
            RelatedAttrDefID: attr.attr().ItemId1(),
            Type: attr.attr().Type(),
            AttrName: attr.attr().Name(),
            Order: attr.attr().Order(),
            RelatedAttrDefItemID1: attr.attr().ItemId1(),
            isEditable: attr.isEditable() ? "TRUE" : "FALSE",
            // isEditable: attr.attr().IsReadOnly(),
            ParentRelAttrDefID: parentAttr ? parentAttr.attr().ItemId1() : "",
        };
    }

    self.addNewLayoutModal = function () {
        var layoutModel = LayoutConfig();
        self.layoutConfigList.push(layoutModel);
        self.layoutModal(layoutModel);
        layoutModel.addAllDefaultTabs();
    }

};




function openPreviewScreen() {
    l_customModullar_model.populateFields(2);
    $('#div_createOrUpdateRuleModal').modal({
        backdrop: 'static',
        keyboard: false
    });

}

function changeColumnSize() {
    var colSize = $("#select_ruleNameFilterOperator").val();
    l_customModullar_model.populateFields(colSize);
}



function changeColumnSizeDec() {
    var col = l_customModullar_model.columnSelected();
    l_customModullar_model.populateFields(col > 2 ? --col : col);
}

function changeColumnSizeInc() {
    var col = l_customModullar_model.columnSelected();
    l_customModullar_model.populateFields(col < 4 ? ++col : col);
}

function checkData(data, event) {
    console.log(data);
}

function toggle(data) {
    data(!data());
}

function refreshCustomizeScreen() {
    l_customModullar_model.populateLayoutList();
    l_customModullar_model.layoutModal(null);
}

function _addNewTabIDs(relAttrGroup) {
    var index = newTabCount++;
    relAttrGroup.Id("NEW_LINKED_TAB" + index);
    relAttrGroup.Id1("NEW_LINKED_TAB" + index);
    relAttrGroup.ItemId("NEW_LINKED_TAB" + index);
    relAttrGroup.ItemId1("NEW_LINKED_TAB" + index);
}


function _addNewGroupIDs(relAttrGroup) {
    var index = newGroupCount++;
    relAttrGroup.Id("NEW_LINKED_GROUP" + index);
    relAttrGroup.Id1("NEW_LINKED_GROUP" + index);
    relAttrGroup.ItemId("NEW_LINKED_GROUP" + index);
    relAttrGroup.ItemId1("NEW_LINKED_GROUP" + index);
}


function _addNewAttributeIds(relAtt) {
    var index1 = newAttrCount++;
    relAtt.Id("NEW_LINKED_CTR_ATTRIBUTE" + index1);
    relAtt.Id1("NEW_LINKED_CTR_ATTRIBUTE" + index1);
    relAtt.ItemId("NEW_LINKED_CTR_ATTRIBUTE" + index1);
    relAtt.ItemId1("NEW_LINKED_CTR_ATTRIBUTE" + index1);
}

function _addNewCustAttrIds(relAtt) {
    var index1 = newAttrCount++;
    relAtt.Id("NEW_LINKED_ATTRIBUTE" + index1);
    relAtt.Id1("NEW_LINKED_ATTRIBUTE" + index1);
    relAtt.ItemId("NEW_LINKED_ATTRIBUTE" + index1);
    relAtt.ItemId1("NEW_LINKED_ATTRIBUTE" + index1);
}


function showError(invalidErrors, msg) {
    if (isActionClicked && invalidErrors && invalidErrors.length > 0) {
        inValidList = invalidErrors;
        updateToastContent();
        if (inValidList.length == 0) {
            isActionClicked = false;
            errorToastToggle("hide");
        }
        else {
            if (inValidList.length == 1)
                updateToastContent(getTranslationMessage("{0}" + (msg ? msg : ": Attribute is required."), [inValidList[0]]));
            else
                updateToastContent(getTranslationMessage("{0} errors", [inValidList.length]), contentText());
            errorToastToggle("show");
        }
        setTimeout(function () {
            errorToastToggle("hide");
        }, 5000);
    }
}


function contentText(msg) {
    str = null;
    for (i = 0; i < inValidList.length; i++)
        if (i == 0)
            str = getTranslationMessage("{0}" + (msg ? msg : ": Attribute is required."), [inValidList[i]]);
        else
            str = str + "<br>" + getTranslationMessage("{0}" + (msg ? msg : ": Attribute is required."), [inValidList[i]]);
    return str;
}




l_customModullar_model = new CustomModullar();
$(function () {
    var i_locale = getlocale();
    var rtl_css = '../../../../../com/opentext/apps/utils/css/rtlappscommon.css';
    translateLabels("com/opentext/apps/ccworkflow/htm/customModullarunified", i_locale);
    loadRTLIfRequired(i_locale, rtl_css);
    if (window.parent.parent) {
        customModullarIframe = $('[src*="customModullarunified.htm"]', window.parent.parent.document);
        if (customModullarIframe) {
            customModullarIframe.css('border', 'none');
        }
    }
    cInstanceId = getUrlParameterValue("instanceId", null, true);
    l_customModullar_model.contractType(cInstanceId);
    l_customModullar_model.populateContractAttrList({ "processName": 'Contract', 'purpose': 'CTRCUSATTR' });
    l_customModullar_model.populateLayoutList(function () {
        //l_customModullar_model.addNewLayoutModal();
    });
    createToastDiv();
    ko.applyBindings(l_customModullar_model, document.getElementById("div_CustomModullarSummary"));
});
