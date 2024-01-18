//Gloabal variables, Static Data
var KOSubOrgMainModel;
var listOffsetValue = 0;
var listLimitValue = 25;

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
const activePages = ["SUBORG", "ADDRESSES", "MEMBERS"];

const defaultPerPage = 25;
const listPerPageArr = [
    { key: 0, val: "Show all" },
    { key: 100, val: "100 per page" },
    { key: 50, val: "50 per page" },
    { key: 25, val: "25 per page" }];

//Page Models
function SubOrgMembersModel(params) {
    var self = this;
    self.parentOrgData = params;
    self.filterUserName = ko.observable(defaultFilterVal);
    self.filterUserNameInput = ko.observable("");
    self.filterUserNameExpand = ko.observable(true);
    self.filterExpand = ko.observable(false);
    self.filterOptions = ko.observableArray(filterList);
    self.membersList = ko.observableArray([]);

    //Pagination START
    self.totalListsCount = ko.observable(0);
    self.currentPage = ko.observable(1);
    self.hideDecrement = ko.observable(false);
    self.hideIncrement = ko.observable(false);

    // Confirmation Variables
    self.confirmationModalHeader = ko.observable();
    self.confirmationModalMsg = ko.observable();
    self.confirmButtonText = ko.observable();

    filterList.forEach(function(iElement){
        iElement.key = getTranslationMessage(iElement.key);
      })

    function prepareMembersModel(data) {
        var selfMem = { "OrganizationMembers": {}, "Owner": { "GCOrganization": {} }, "ParticipatingPerson": { "Person": {} } };
        selfMem.StartDate = ko.observable(data["StartDate"] ? formateDatetoLocale(data["StartDate"].replace('Z','')) : data["StartDate"]);
        selfMem.EndDate = ko.observable(data["EndDate"] ? formateDatetoLocale(data["EndDate"].replace('Z','')) : data["EndDate"]);
        selfMem.JobTitle = ko.observable(data["JobTitle"]);
        selfMem.UserName = ko.observable(_getTextValue(data["ParticipatingPerson"].DisplayName));
        selfMem.UserId = ko.observable(_getTextValue(data["ParticipatingPerson"].User_ID));
        selfMem.LastName = ko.observable(_getTextValue(data["ParticipatingPerson"].LastName));
        selfMem.FirstName = ko.observable(_getTextValue(data["ParticipatingPerson"].FirstName));
        selfMem.OrganizationMembers.Id = ko.observable(data["OrganizationMembers-id"].Id);
        selfMem.OrganizationMembers.Id1 = ko.observable(data["OrganizationMembers-id"].Id1);
        selfMem.OrganizationMembers.ItemId = ko.observable(data["OrganizationMembers-id"].ItemId);
        selfMem.OrganizationMembers.ItemId1 = ko.observable(data["OrganizationMembers-id"].ItemId1);
        selfMem.Owner.GCOrganization.Id = ko.observable(data["Owner"]["GCOrganization-id"].Id);
        selfMem.Owner.GCOrganization.ItemId = ko.observable(data["Owner"]["GCOrganization-id"].ItemId);
        selfMem.ParticipatingPerson.Person.Id = ko.observable(data["ParticipatingPerson"]["Person-id"].Id);
        selfMem.ParticipatingPerson.Person.ItemId = ko.observable(data["ParticipatingPerson"]["Person-id"].ItemId);
        selfMem.visibleButtonOptions = ko.observable(false);
        selfMem.IsPrimaryContact = ko.observable(data["IsPrimaryContact"]);
        selfMem.ContactTypeName = ko.observable(data["RelatedContactType"] ?_getTextValue(data["RelatedContactType"].Name):"");
      
        return selfMem;
    }



    self.decrementToLast = function () {
        self.currentPage(1);
        self.hideDecrement(true);
        self.hideIncrement(false);
        self.refreshTable();
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
        self.refreshTable();
    }

    self.incrementOffsetLimit = function () {
        var totalPages = Math.ceil(self.totalListsCount() / defaultPerPage);
        if (self.currentPage() < Math.ceil(self.totalListsCount() / defaultPerPage)) {
            self.currentPage(self.currentPage() + 1);
        }
        if (self.currentPage() == Math.ceil(self.totalListsCount() / defaultPerPage)) {
            self.hideIncrement(true);
        }
        if (self.currentPage() > 1) {
            self.hideDecrement(false);
        }
        self.refreshTable();
    }

    self.incrementToLast = function () {
        self.currentPage(Math.ceil(self.totalListsCount() / defaultPerPage));
        self.hideDecrement(false);
        self.hideIncrement(true);
        self.refreshTable();
    }
    //Pagination END


    self.openFilter = function () {
        self.filterExpand(!self.filterExpand());
        if (!self.filterExpand()) {
            self.ClearFilter();
        }
    }

    self.ApplyFilter = function () {
        var filterParams = {};
        filterParams.applyFilter = true;
        filterParams.filterUserName = self.filterUserNameInput();
        _defaultPagination();
        self.refreshTable(filterParams);
        self.filterExpand(!self.filterExpand());
		if(filterParams.filterUserName.length>0){
			$("#btn_mem_clearFilterActionBar").css('display', 'inline');
		} else {
			$("#btn_mem_clearFilterActionBar").css('display', 'none');
		}
    }
    self.ClearFilter = function () {
        self.filterExpand(false);
        _clearFilterInputs();
        _defaultPagination();
        self.refreshTable();
        $("#btn_mem_clearFilterActionBar").css('display', 'none');
    }

    function _clearFilterInputs() {
        self.filterUserNameInput("");
    }
    function _defaultPagination() {
        self.currentPage(1);
    }

    self.deleteMember = function (data, event) {
        self.confirmationModalHeader(getTranslationMessage("Delete"));
        self.confirmationModalMsg(getTranslationMessage("Delete the selected member?"));
        self.confirmButtonText(getTranslationMessage("Delete"));
        $("#confirmationMembersModal").modal({
            backdrop: 'static',
            keyboard: false
        });
        $('button#confirmYes').off("click");
        $('button#confirmYes').on('click', function (_event) {
            cc_org_services.deleteMember(prepareDeleteMemberRequest(data), function (response, status) {
                if (status !== "ERROR") {
                    self.membersList.remove(data);
                    self.totalListsCount(self.totalListsCount() - 1);
                } else {
                    showOrHideErrorInfo("div_modalMemberErrorInfoArea", true, getTranslationMessage("Unable to delete the member. Contact your administrator."), 10000);
                }
            });
        });
    }

    function prepareDeleteMemberRequest(data) {
        var request = {
            "GCOrganization-id": { "ItemId": data.Owner.GCOrganization.ItemId },
            "OrganizationMembers": {
                "OrganizationMembers-id": { "ItemId1": data.OrganizationMembers.ItemId1, "ItemId": data.OrganizationMembers.ItemId }
            }
        };
        return request;
    }

    self.openMembersEditForm = function (data, event) {
        params.openMembersEditForm(data.OrganizationMembers.ItemId1(), event);
    }

    self.openMembersCreateForm = function (data, event) {
        params.openMembersCreateForm(data, event);
    }

    self.showOptionsVisibility = function (data, event) {
        data.visibleButtonOptions(true);
    }
    self.hideOptionsVisibility = function (data, event) {
        data.visibleButtonOptions(false);
    };

    self.refreshTable = function (params) {
        var offset = (self.currentPage() - 1) * defaultPerPage;
        self.getMembersList(offset, defaultPerPage, params);
    };

    self.getMembersList = function (offset, limit, params) {
        var input = { orgData: self.parentOrgData, offset: offset, limit: limit };
        if (params) {
            input.filter = params;
        }
        cc_org_services.getMembersList(populateOrgReqMembersListObj(input), function (response, status) {
            translatePage();
            if (status !== "ERROR") {
                self.membersList.removeAll();
                var members = response.OrgMembers.FindZ_INT_OrgUsersListResponse.OrganizationMembers;
                if (members && Array.isArray(members)) {
                    var len = members.length;
                    for (var i = 0; i < len; i++) {
                        self.membersList.push(prepareMembersModel(members[i]));
                    }
                } else if (members) {
                    self.membersList.push(prepareMembersModel(members));
                }
                self.totalListsCount(response.OrgMembers.FindZ_INT_OrgUsersListResponse["@total"]);
                self.currentPage(offset / defaultPerPage + 1);
            } else {
                showOrHideErrorInfo("div_modalMemberErrorInfoArea", true, getTranslationMessage("Unable to retrieve the member list. Contact your administrator."), 10000);
            };
        });
    };


    // function to initializa data of Addresses List screen
    ; (function init() {
        self.getMembersList(self.currentPage() - 1, defaultPerPage);
    })();

};

function SubOrgTabsConfigModel(params) {
    var self = this;
    self.parentOrgData = params;
	self.activeSubPage = ko.observable('');
	
	//Contract tabs config props
	self.activeSubPages = ["CTRDefaultVals", "CTRTabs"];
	self.UncheckedTabs=KOSubOrgMainModel.currentOrgDisplay().orgDetails.CTRTabsConfig()!=null?KOSubOrgMainModel.currentOrgDisplay().orgDetails.CTRTabsConfig().split(';'):[];
	self.ALLTabs = ko.observableArray(['CTRdetails','Obl','SectandCs','Terms','Docs','Emails','Disc','Approvals','Asgmts','Tasklist','Renandamend','LinkedCTRs','Relatedorgs']);
	self.TabsUnchecked= ko.observableArray(self.UncheckedTabs);
	self.TabsChecked = ko.observableArray(symmetricDifference(self.ALLTabs(),self.TabsUnchecked()));
	self.TabsCheckedFinal = ko.observableArray([]);
	
	//Contract default values props
	self.lookupModels = {"l_OrgsList_model":new OrgsListModel(),"l_CTRTypesList_model":new CTRTypesListModel(),"l_TemplatesList_model":new TemplatesListModel(),"l_CountryList_model":new CountryListModel(),"l_CurrencyList_model":new CurrencyListModel()};
	self.defaultValuesConfigFlag = ko.observable(false);
	self.defaultValue_CONTRACTTERM = ko.observable('');
    self.defaultValue_PERPETUAL = ko.observable('false');
    self.defaultValue_ISEXECUTED = ko.observable('false');
    self.defaultValue_ISEXTERNAL = ko.observable('false');
    self.defaultValue_COUNTRY = ko.observable('');
    self.defaultValue_CURRENCY = ko.observable('');
    self.defaultValue_ORGANIZATION = ko.observable('');
    self.defaultValue_CONTRACTTYPE = ko.observable('');
    self.defaultValue_TEMPLATETYPE = ko.observable('');
    self.defaultValue_TEMPLATE = ko.observable('');
	
	self.dirtyFlag = ko.observable(false);
	
	self.selectSubPage = function (pageName) {
		self.dirtyFlag(false);
		loadCTRDefaultValuesProps();
        if (self.activeSubPage() !== pageName) {
            clearAndLoadSubPageData(pageName);
        }
    };
	
	function clearAndLoadSubPageData(activeSubPage) {
		
        if (!activeSubPage) {
            activeSubPage = self.activeSubPages[0];//default page
        }
        self.activeSubPage('');// clear active flag as empty till model is loaded
        self.activeSubPage(activeSubPage);// populate active flag as empty after model is loaded
    }
	
	//Contract tabs functions
	function symmetricDifference(a1, a2) {
	  var result = [];
	  for (var i = 0; i < a1.length; i++) {
		if (a2.indexOf(a1[i]) === -1) {
		  result.push(a1[i]);
		}
	  }
	  for (i = 0; i < a2.length; i++) {
		if (a1.indexOf(a2[i]) === -1) {
		  result.push(a2[i]);
		}
	  }
	  return result;
	}
	
	self.TabsChecked.subscribe(function(newValue) {
		var updateObj = prepareUpdateOrgCtrTabsRequest();
		cc_org_services.updateSubOrg(updateObj, responseUpdateSubOrgCtrTabs);
		self.UncheckedTabs=symmetricDifference(self.ALLTabs(),self.TabsChecked());
		KOSubOrgMainModel.currentOrgDisplay().orgDetails.CTRTabsConfig(self.UncheckedTabs.join(";"));
	});
	
	function responseUpdateSubOrgCtrTabs(data, status) {
        if (status !== "ERROR") {
        } else {
            
            showOrHideErrorInfo("div_modalSubOrgCreateErrorInfoArea", true, getTranslationMessage("Unable to update the organization") + errorMsg + getTranslationMessage(". Contact your administrator."), 10000);
            
        }
    };
	
	
	
	function prepareUpdateOrgCtrTabsRequest(){
        var request = {};
		self.TabsCheckedFinal(symmetricDifference(self.ALLTabs(),self.TabsChecked()));
		var TabsUnchecked=self.TabsCheckedFinal().join(";");
        request["GCOrganization-id"] = {};
        request["GCOrganization-id"]["Id"] = KOSubOrgMainModel.currentOrgDisplay().orgDetails.Id();
        request["GCOrganization-update"] = {};
		if(TabsUnchecked!="")
		request["GCOrganization-update"]["CTRTabsConfiguration"] = TabsUnchecked;
		else
		request["GCOrganization-update"]["CTRTabsConfiguration"]= {'@xsi:nil': 'true', "@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance"};

        return request;
    }
	
	//Contract default values functions
	
	self.updateIsExecuted = function (value, iItem, event) {
			self.defaultValue_ISEXECUTED(value);
			if (value == 'true') {
				self.defaultValue_TEMPLATETYPE("None");
				self.defaultValue_TEMPLATE("");
			}
			self.dirtyFlag(true);
		event.stopPropagation();
    }
	self.updateIsExternal = function (value, iItem, event) {
			self.defaultValue_ISEXTERNAL(value);
			if (value == 'true') {
				self.defaultValue_TEMPLATETYPE("None");
				self.defaultValue_TEMPLATE("");
			}
			self.dirtyFlag(true);
		event.stopPropagation();
    }
	self.updatePerpetual = function (value, iItem, event) {
			self.defaultValue_PERPETUAL(value);
			
			if (value == 'true') {
				self.defaultValue_CONTRACTTERM("")
				$('#ContractTermPreviewModel').css("display", "none");
			}
			self.dirtyFlag(true);
		event.stopPropagation();
    }
	
	self.templateTypechange = function (obj, event) {
		self.defaultValue_TEMPLATE("");
		self.dirtyFlag(true);
    }
	
	self.cancelCTRDefaultValSaveOREdit = function (){
		$("#cancelModal").modal();
		$('button#cancelDefaultValChanges').off("click");
		$('button#cancelDefaultValChanges').on('click', function (_event) {
			loadCTRDefaultValuesProps();
			self.dirtyFlag(false);
			self.selectSubPage("CTRDefaultVals");
		});
	}
	
	self.clearCTRDefaultValues = function (){
		$("#clearConfigModal").modal();
		$('button#clearDefaultValueConfigModal').off("click");
		$('button#clearDefaultValueConfigModal').on('click', function (_event) {
			KOSubOrgMainModel.currentOrgDisplay().orgDetails.CTRDefaultValues("");
			cc_org_services.updateSubOrg(prepareUpdateOrgRequest(), responseUpdateSubOrg);
			self.dirtyFlag(false);
			self.defaultValuesConfigFlag(false);
			self.selectSubPage("CTRDefaultVals");
		});
	}
	
	self.saveCTRDefaultValues = function (){
	
		if ((self.defaultValue_CONTRACTTERM() != undefined && self.defaultValue_CONTRACTTERM() != "")) {
			var months = "";
			var days = "";
			if (self.defaultValue_CONTRACTTERM().lastIndexOf("month(s)") > 0) {
				months = self.defaultValue_CONTRACTTERM().substring(0, self.defaultValue_CONTRACTTERM().lastIndexOf(" month(s)"))
			}
			if (self.defaultValue_CONTRACTTERM().lastIndexOf("day(s)") > 0) {
				if (months != "") {
					days = self.defaultValue_CONTRACTTERM().substring(self.defaultValue_CONTRACTTERM().lastIndexOf("month(s), ") + "month(s), ".length, self.defaultValue_CONTRACTTERM().lastIndexOf(" day(s)"))
					self.defaultValue_CONTRACTTERM("P" + months + "M" + days + "D");
				}
				else {
					days = self.defaultValue_CONTRACTTERM().substring(0, self.defaultValue_CONTRACTTERM().lastIndexOf(" day(s)"))
					self.defaultValue_CONTRACTTERM("P" + days + "D");
				}
			}
			else {
				self.defaultValue_CONTRACTTERM("P" + months + "M");
			}
		}
		else {
			self.defaultValue_CONTRACTTERM("");
		}
	
		var l_configPropValue = "ORGANIZATION_NAME:" + JSON.stringify(self.defaultValue_ORGANIZATION())
			+ ";CONTRACTTYPE:" + JSON.stringify(self.defaultValue_CONTRACTTYPE())
			+ ";ISEXECUTED:" + self.defaultValue_ISEXECUTED()
			+ ";ISEXTERNAL:" + self.defaultValue_ISEXTERNAL()
			+ ";TEMPLATETYPE:" + self.defaultValue_TEMPLATETYPE()
			+ ";TEMPLATE:" + JSON.stringify(self.defaultValue_TEMPLATE())
			+ ";CONTRACTTERM:" + self.defaultValue_CONTRACTTERM()
			+ ";PERPETUAL:" + self.defaultValue_PERPETUAL()
			+ ";COUNTRY:" + JSON.stringify(self.defaultValue_COUNTRY())
			+ ";CURRENCY:" + JSON.stringify(self.defaultValue_CURRENCY());
		KOSubOrgMainModel.currentOrgDisplay().orgDetails.CTRDefaultValues(l_configPropValue);
		cc_org_services.updateSubOrg(prepareUpdateOrgRequest(), responseUpdateSubOrg);
		
	}
	
	function responseUpdateSubOrg(data, status) {
        if (status !== "ERROR") {
			successToast(3000, getTranslationMessage("Changes saved successfully"));
			self.dirtyFlag(false);
			loadCTRDefaultValuesProps();
			self.selectSubPage("CTRDefaultVals");
        } else {
            
            showOrHideErrorInfo("div_modalSubOrgCreateErrorInfoArea", true, getTranslationMessage("Unable to update the organization") + errorMsg + getTranslationMessage(". Contact your administrator."), 10000);
            
        }
    };
	
	
	
	function prepareUpdateOrgRequest() {
        var request = {};
        request["GCOrganization-id"] = {};
        request["GCOrganization-id"]["Id"] = KOSubOrgMainModel.currentOrgDisplay().orgDetails.Id();
        request["GCOrganization-update"] = {};
		if(KOSubOrgMainModel.currentOrgDisplay().orgDetails.CTRDefaultValues()!="")
		request["GCOrganization-update"]["CTR_DEFAULT_VALUES"] = KOSubOrgMainModel.currentOrgDisplay().orgDetails.CTRDefaultValues();
		else
		request["GCOrganization-update"]["CTR_DEFAULT_VALUES"]= {'@xsi:nil': 'true', "@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance"};

        return request;
    }
	
	function clearDefaultValueConfigValues(){
			self.defaultValue_ORGANIZATION({'ItemId':KOSubOrgMainModel.currentOrgDisplay().orgDetails.ItemId(),'Name':KOSubOrgMainModel.currentOrgDisplay().orgDetails.Name()});
			self.defaultValue_CONTRACTTYPE("");
			self.defaultValue_ISEXECUTED('false');
			self.defaultValue_ISEXTERNAL('false');
			self.defaultValue_TEMPLATETYPE("None");
			self.defaultValue_TEMPLATE("");
			self.defaultValue_CONTRACTTERM("");
			self.defaultValue_PERPETUAL('false');
			self.defaultValue_COUNTRY("");
			self.defaultValue_CURRENCY("");
	}
	
	function loadCTRDefaultValuesProps(obj, event) {
		var l_defaultPropsArray = KOSubOrgMainModel.currentOrgDisplay().orgDetails.CTRDefaultValues()?KOSubOrgMainModel.currentOrgDisplay().orgDetails.CTRDefaultValues().split(";"):[];
		if(KOSubOrgMainModel.currentOrgDisplay().orgDetails.CTRDefaultValues() && KOSubOrgMainModel.currentOrgDisplay().orgDetails.CTRDefaultValues()!=""){
			self.defaultValuesConfigFlag(true);
		}
		else{
			clearDefaultValueConfigValues()
		}
            l_defaultPropsArray.forEach(function (defaultProp) {
                if (defaultProp.includes(":")) {
                    var l_keyValueArray = defaultProp.split(/:(.*)/s);
                    if (l_keyValueArray[0] === "ORGANIZATION_NAME") {
                        self.defaultValue_ORGANIZATION(l_keyValueArray[1]!=''?JSON.parse(l_keyValueArray[1]):{'ItemId':KOSubOrgMainModel.currentOrgDisplay().orgDetails.ItemId(),'Name':KOSubOrgMainModel.currentOrgDisplay().orgDetails.Name()});
                    }
                    if (l_keyValueArray[0] === "CONTRACTTYPE") {
                        self.defaultValue_CONTRACTTYPE(l_keyValueArray[1]!=''?JSON.parse(l_keyValueArray[1]):'');
                    }
                    if (l_keyValueArray[0] === "ISEXECUTED") {
                        self.defaultValue_ISEXECUTED(l_keyValueArray[1]!=''?l_keyValueArray[1]:'false');
                    }
                    if (l_keyValueArray[0] === "ISEXTERNAL") {
                        self.defaultValue_ISEXTERNAL(l_keyValueArray[1]!=''?l_keyValueArray[1]:'false');
                    }
                    if (l_keyValueArray[0] === "TEMPLATETYPE") {
                        self.defaultValue_TEMPLATETYPE(l_keyValueArray[1]!=''?l_keyValueArray[1]:'None');
                    }
                    if (l_keyValueArray[0] === "TEMPLATE") {
                        self.defaultValue_TEMPLATE(l_keyValueArray[1]!=''?JSON.parse(l_keyValueArray[1]):'');
                    }
                    if (l_keyValueArray[0] === "CONTRACTTERM") {
						var l_contractTermDuration = l_keyValueArray[1];
						if (l_contractTermDuration.lastIndexOf("M") > 0 && l_contractTermDuration.lastIndexOf("D") > 0 && getTextValue(l_contractTermDuration.substring(l_contractTermDuration.lastIndexOf("P") + 1, l_contractTermDuration.lastIndexOf("M"))) > 0 && getTextValue(l_contractTermDuration.substring(l_contractTermDuration.lastIndexOf("M") + 1, l_contractTermDuration.lastIndexOf("D"))) > 0) {
							 self.defaultValue_CONTRACTTERM(getTextValue(l_contractTermDuration.substring(l_contractTermDuration.lastIndexOf("P") + 1, l_contractTermDuration.lastIndexOf("M"))) + " month(s), " + getTextValue(l_contractTermDuration.substring(l_contractTermDuration.lastIndexOf("M") + 1, l_contractTermDuration.lastIndexOf("D"))) + " day(s)");
						}
						else if (l_contractTermDuration.lastIndexOf("M") > 0 && getTextValue(l_contractTermDuration.substring(l_contractTermDuration.lastIndexOf("P") + 1, l_contractTermDuration.lastIndexOf("M"))) > 0) {
							 self.defaultValue_CONTRACTTERM(getTextValue(l_contractTermDuration.substring(l_contractTermDuration.lastIndexOf("P") + 1, l_contractTermDuration.lastIndexOf("M"))) + " month(s)");
						}
						else if (l_contractTermDuration.lastIndexOf("D") > 0 && getTextValue(l_contractTermDuration.substring(l_contractTermDuration.lastIndexOf("P") + 1, l_contractTermDuration.lastIndexOf("D"))) > 0) {
							 self.defaultValue_CONTRACTTERM(getTextValue(l_contractTermDuration.substring(l_contractTermDuration.lastIndexOf("P") + 1, l_contractTermDuration.lastIndexOf("D"))) + " day(s)");
						} else {
							 self.defaultValue_CONTRACTTERM("");
						}
                    }
                    if (l_keyValueArray[0] === "PERPETUAL") {
                        self.defaultValue_PERPETUAL(l_keyValueArray[1]!=''?l_keyValueArray[1]:'false');
                    }
                    if (l_keyValueArray[0] === "COUNTRY") {
                        self.defaultValue_COUNTRY(l_keyValueArray[1]!=''?JSON.parse(l_keyValueArray[1]):'');
                    }
                    if (l_keyValueArray[0] === "CURRENCY") {
                        self.defaultValue_CURRENCY(l_keyValueArray[1]!=''?JSON.parse(l_keyValueArray[1]):'');
                    }
                }
            })
    }
	
	
	; (function init() {
		loadCTRDefaultValuesProps();
		clearAndLoadSubPageData(self.activeSubPages[0]);
		$(".cc-filter-header").click(function (iEventObject) {
			var l_headerSpan = $(this)
			l_headerSpan.next().slideToggle();
			if (l_headerSpan.attr('apps-toggle') == "expanded") {
				hideOrShowContractsFilterContainerBody(l_headerSpan[0], false);
			}
			else if (l_headerSpan.attr('apps-toggle') == "collapsed") {
				hideOrShowContractsFilterContainerBody(l_headerSpan[0], true);
			}
		});
    })();
};

/**
 * Addresses List Model in Sub Page
*/
function SubOrgAddressesModel(params) {
    var self = this;
    self.parentOrgData = params;
    self.addressList = ko.observableArray([]);
    self.filterAddressTitle = ko.observable(defaultFilterVal);
    self.filterAddressTitleExpand = ko.observable(true);
    self.filterAddress = ko.observable("");
    self.filterAddressExpand = ko.observable(true);
    self.filterExpand = ko.observable(false);
    self.filterOptions = ko.observableArray(filterList);
    //Pagination START
    self.totalListsCount = ko.observable(0);
    self.totalListsPageCount = ko.observable(1);
    self.currentPage = ko.observable(1);
    self.hideDecrement = ko.observable(false);
    self.hideIncrement = ko.observable(false);

    self.decrementToLast = function () {
        self.currentPage(1);
        self.hideDecrement(true);
        self.hideIncrement(false);
        populateDummyData(self.currentPage() - 1, defaultPerPage);
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
        populateDummyData(self.currentPage() - 1, defaultPerPage);
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
        populateDummyData(self.currentPage() - 1, defaultPerPage);
    }

    self.incrementToLast = function () {
        self.currentPage(Math.ceil(self.totalListsCount() / defaultPerPage));
        self.hideDecrement(false);
        self.hideIncrement(true);
        populateDummyData(self.totalListsPageCount() - 1, defaultPerPage);
    }
    //Pagination END

    /**
  * Propagated the Edit call to Parent/Main Object.
 */
    self.openAddressEditForm = function (data, event) {
        params.openAddressEditForm(data.addressId());
        event.stopPropagation();
    }
    self.openAddressCreateForm = function (data, event) {
        params.openAddressCreateForm(data, event);
    }
    self.openFilter = function () {
        self.filterExpand(!self.filterExpand());
    }

    self.ApplyFilter = function (data, event) {

    }
    self.ClearFilter = function (data, event) {
        self.filterExpand(false);
    }
    self.showOptionsVisibility = function (data, event) {
        data.visibleButtonOptions("visible");
    }
    self.hideOptionsVisibility = function (data, event) {
        data.visibleButtonOptions("hidden");
    }

    function populateDummyData() {
        var i = 0;
        while (i < 3) {// will fetch the sub list
            var subOrgObs = ko.mapping.fromJS({ visibleButtonOptions: "hidden", addressId: i + '', addressTitle: self.parentOrgData.orgDetails.Name() + 'Address Title -' + i, address: 'Adress-' + 1, primary: false });
            self.addressList.push(subOrgObs);
            i++;
        }
    }
    // function to initializa data of Addresses List screen
    ; (function init() {
        populateDummyData();
    })();

    function init() {
        populateDummyData();
    }
    init();

};
/**
 * List Model of the Sub Page in the Sub-Org Main Page.
*/
function SubOrgListModel(params) {
    var self = this;
    self.parentOrgData = params;
    self.subOrgList = ko.observableArray([]);
    self.filterExpand = ko.observable(false);
    self.filterOrgName = ko.observable(defaultFilterVal);
    self.filterOrgNameInput = ko.observable("");
    self.filterOrgNameExpand = ko.observable(true);
    self.filterOrgDesc = ko.observable(defaultFilterVal);
    self.filterOrgDescInput = ko.observable("");
    self.filterOrgDescExpand = ko.observable(true);
    self.filterOptions = ko.observableArray(filterList);

    //Pagination START
    self.totalListsCount = ko.observable(0);
    self.currentPage = ko.observable(1);
    self.hideDecrement = ko.observable(false);
    self.hideIncrement = ko.observable(false);

    filterList.forEach(function(iElement){
        iElement.key = getTranslationMessage(iElement.key);
      })

    self.decrementToLast = function () {
        self.currentPage(1);
        self.hideDecrement(true);
        self.hideIncrement(false);
        self.refreshTable();
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
        self.refreshTable();
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
        self.refreshTable();
    }

    self.incrementToLast = function () {
        self.currentPage(Math.ceil(self.totalListsCount() / defaultPerPage));
        self.hideDecrement(false);
        self.hideIncrement(true);
        self.refreshTable();
    }
    //Pagination END

    self.openDepartmentCreateForm = function (data, event) {
        params.openDepartmentCreateForm(data, event);
    }

    self.openFilter = function () {
        self.filterExpand(!self.filterExpand());
        if (!self.filterExpand()) {
            self.ClearFilter();
        };
    };

    self.ApplyFilter = function (data, event) {
        var filterParams = {};
        filterParams.applyFilter = true;
        filterParams.filterOrgName = self.filterOrgNameInput();
        filterParams.filterOrgDesc = self.filterOrgDescInput();
        _defaultPagination();
        self.refreshTable(filterParams);
    }
    self.ClearFilter = function (data, event) {
        self.filterExpand(false);
        _clearFilterInputs();
        _defaultPagination();
        self.refreshTable();
    };

    function _clearFilterInputs() {
        self.filterOrgNameInput("");
        self.filterOrgDescInput("");
    };
    function _defaultPagination() {
        self.currentPage(1);
    };

    self.refreshTable = function (params) {
        var offset = (self.currentPage() - 1) * defaultPerPage;
        self.fetchSubOrgList(offset, defaultPerPage, params);
    };

    self.fetchSubOrgList = function (offset, limit, filterParams) {
        var reqObj = {};
        reqObj["parentOrgID"] = self.parentOrgData.orgDetails.Id();
        reqObj["orgName"] = "";
        reqObj["orgDescription"] = "";
        reqObj["offset"] = offset;
        reqObj["limit"] = limit;
        if (filterParams && filterParams.applyFilter) {
            _applyReqObjFilterParams(reqObj, filterParams);
        }
        cc_org_services.getSubOrgListService(reqObj, function (data_response, status) {
            translatePage();
            if (status !== "ERROR") {
                self.subOrgList.removeAll();
                if (data_response.OrgsResponse) {
                    var GCOrganization = data_response.OrgsResponse.FindZ_INT_OrgListResponse.GCOrganization;
                    var totalCount = data_response.OrgsResponse.FindZ_INT_OrgListResponse["@total"];
                    if (Array.isArray(GCOrganization)) {
                        var len = GCOrganization.length;
                        for (var i = 0; i < len; i++) {
                            var subOrg = populateOrgData(GCOrganization[i]);
                            var subOrgObs = ko.mapping.fromJS(subOrg);
                            self.subOrgList.push(subOrgObs);
                        }
                        self.totalListsCount(+totalCount);

                    } else if (GCOrganization) {
                        var subOrg = populateOrgData(GCOrganization);
                        var subOrgObs = ko.mapping.fromJS(subOrg);
                        self.subOrgList.push(subOrgObs);
                        self.totalListsCount(totalCount);
                    }
                }
                self.currentPage(offset / defaultPerPage + 1);
            } else {
                showOrHideErrorInfo("div_modalSubOrgListErrorInfoArea", true, getTranslationMessage("Unable to retrieve the organization list. Contact your administrator."), 10000);
            };
        }
        );
    };

    function _applyReqObjFilterParams(inputReq, filterParams) {
        inputReq["orgName"] = filterParams.filterOrgName;
        inputReq["orgDescription"] = filterParams.filterOrgDesc;
    };

    // function to initializa data of SubOrg List screen
    ; (function init() {
        var offset = (self.currentPage() - 1) * defaultPerPage;
        self.fetchSubOrgList(offset, defaultPerPage);
    })();
}


function CreateMemberModel(params, editMode, memberId, subOrgMainModel) {
    var self = this;

    self.clicked = false;

    self.parentOrgData = editMode ? ko.observable({}) : params;
    self.memberId = ko.observable(memberId);
    self.editMode = ko.observable(editMode ? true : false);
    self.pageLoaded = ko.observable(true);
    self.departmentRootList = ko.observableArray([]);
    self.subOrgsMapped = ko.observableArray([]);
    self.subOrgsRemovedSpecialAccess = ko.observableArray([]);
    self.userList = ko.observableArray([]);
    self.contacttypeList = ko.observableArray([]);
    //create form properties start
    self.formUserItemId = ko.observable("");
    self.formUserName = ko.observable("");
    self.formUserNameEmpty = ko.observable(false);
    self.formPosition = ko.observable("");
    self.formStartDate = ko.observable("");
    self.formStartDatetoLocale = ko.observable("");
    self.formStartDateErrorMsg = ko.observable("");
    self.formEndDate = ko.observable("");
    self.formEndDatetoLocale = ko.observable("");
    self.formEndDateErrorMsg = ko.observable("");
    self.isPrimaryContact = ko.observable(false);
    self.formContactType =  ko.observable("");
    self.formContactTypeItemId =  ko.observable("");

    //create form properties end


    self.filterUserName = ko.observable();

    //Create Button Modal Start
    self.visibleButtonOptions = ko.observable(true);
    const buttonOperations = [{ name: getTranslationMessage("Save and create another"), key: "SAVEOPEN" }, { name: getTranslationMessage("Add member"), key: "SAVE" }];
    self.buttonOperationList = ko.observableArray([]);
    if (self.editMode()) {
        buttonOperations[1].name = getTranslationMessage("Update member");
        self.currentActiveButton = ko.mapping.fromJS(buttonOperations[1]);
    } else {
        self.buttonOperationList.push(buttonOperations[0]);
        self.currentActiveButton = ko.mapping.fromJS(buttonOperations[1]);
    }
    self.currentActiveButton = ko.mapping.fromJS(buttonOperations[1]);
    self.openButtonOptions = function () {
        if ("visible" !== self.visibleButtonOptions()) {
            self.visibleButtonOptions("visible");
        } else {
            self.visibleButtonOptions("hidden");
        }
    };
    /**
     * data of Org Related to Additional Access grant to Users
    */
    self.fetchSubOrgList = function (data, event) {
        if (data && data.suborgList && data.suborgList().length === 0) {
            var reqObj = {};
            reqObj["parentOrgID"] = data.orgDetails.Id();
            reqObj["orgName"] = "";
            reqObj["orgDescription"] = "";
            reqObj["offset"] = "";
            reqObj["limit"] = "";
            cc_org_services.getSubOrgListService(reqObj, function (data_response, status) {
                if (status !== "ERROR") {
                    data.suborgList.removeAll();
                    if (data_response.OrgsResponse) {
                        var GCOrganization = data_response.OrgsResponse.FindZ_INT_OrgListResponse.GCOrganization;
                        if (Array.isArray(GCOrganization)) {
                            var len = GCOrganization.length;
                            if (len > 0) {
                                for (var i = 0; i < len; i++) {
                                    _populateOrgDataInList(GCOrganization[i], data, data.suborgList);
                                }
                                if (data.expand) {
                                    data.expand(!data.expand());
                                }
                            }
                        } else if (GCOrganization) {
                            _populateOrgDataInList(GCOrganization, data, data.suborgList);
                            if (data.expand) {
                                data.expand(!data.expand());
                            }
                        } else {
                            data.expand(false);
                        }
                        _selectOrgFromList(data.suborgList());
                    }
                    else {
                        data.expand(false);
                    }
                } else {
                    showOrHideErrorInfo("div_modalCreateMembersErrorInfoArea", true, getTranslationMessage("Unable to retrieve the organization list. Contact your administrator."), 10000);
                };
            }
            );
        } else {
            if (data.expand) {
                data.expand(!data.expand());
            }
        }
    }
    /**
     * Fetches Data of Root Organizations
    */
    self.fetchRootOrgList = function () {
        self.departmentRootList.removeAll();
        cc_org_services.getRootOrgListService({}, function (data_response, status) {
            if (status !== "ERROR") {
                if (Array.isArray(data_response.GCOrganization)) {
                    var len = data_response.GCOrganization.length;
                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            _populateOrgDataInList(data_response.GCOrganization[i], null, self.departmentRootList);
                        }
                    }
                } else if (data_response.GCOrganization) {
                    _populateOrgDataInList(data_response.GCOrganization, null, self.departmentRootList);
                }
                _selectOrgFromList(self.departmentRootList());
            } else {
                showOrHideErrorInfo("div_modalCreateMembersErrorInfoArea", true, getTranslationMessage("Unable to retrieve the organization list. Contact your administrator."), 10000);
            };
        }
        );
    }

    function _populateOrgDataInList(responseData, parentOrgData, orgList) {
        var subOrg = populateOrgData(responseData, parentOrgData);
        subOrg.expand = false;
        subOrg.suborgList = [];
        var subOrgObs = ko.mapping.fromJS(subOrg);

        subOrgObs.checked = ko.observable(false);
        subOrgObs.disableSelect = ko.observable(false);
        subOrgObs.expanSubOrg = self.expanSubOrg;
        subOrgObs.onDepartmentRowCheckboxValueChanged = self.onDepartmentRowCheckboxValueChanged;
        orgList.push(subOrgObs);
    }

    self.openUserModal = function () {
        if (!self.editMode()) {
            $('#div_selectUserListModal').modal({
                backdrop: 'static',
                keyboard: false
            });
            self.getUsers({ "offset": 0, "limit": 200 });
        }
    };
    self.openContactModal = function () {
            $('#div_selectContactTypeListModal').modal({
                backdrop: 'static',
                keyboard: false
            });
            self.getContactTypeList({ "offset": 0, "limit": 200 });
    };

    self.filterUsers = function () {
        var request = { "personName": self.filterUserName(), "offset": 0, "limit": 200 };
        self.getUsers(request);
    };

    self.getUsers = function (filterObj) {
        self.userList.removeAll();
        cc_org_services.getUsersList(filterObj, function (response, status) {
            if (status !== "ERROR") {
                var personResp = response.Persons.FindPersonListInternalResponse.Person;
                if (personResp && Array.isArray(personResp)) {
                    var len = personResp.length;
                    for (var i = 0; i < len; i++) {
                        var person = personResp[i];
                        if (person.User_ID) {
                            self.userList.push(ko.mapping.fromJS({
                                Id: person["Person-id"].Id, ItemId: person["Person-id"].ItemId, UserId: person.User_ID,
                                selected: false, LastName: person.LastName, FirstName: person.FirstName,
                                MiddleName: person.MiddleName, Name: person.FirstName
                            }));
                        };
                    }
                } else if (personResp) {
                    if (personResp.User_ID) {
                        self.userList.push(ko.mapping.fromJS({
                            Id: personResp["Person-id"].Id, ItemId: personResp["Person-id"].ItemId, UserId: personResp.User_ID,
                            selected: false, LastName: personResp.LastName, FirstName: personResp.FirstName,
                            MiddleName: personResp.MiddleName, Name: personResp.FirstName
                        }));
                    };
                }
            } else {
                showOrHideErrorInfo("div_modalPersonsErrorInfoArea", true, getTranslationMessage("Unable to retrieve the user list. Contact your administrator."), 10000);
            };
        });
    };


    self.filterContactTypes = function () {
        var request = { "contacttype": document.getElementById("filterContactTypeInput").value, "offset": 0, "limit": 200 };
        self.getContactTypeList(request);
    };

    self.getContactTypeList = function (filterObj) {
        self.contacttypeList.removeAll();
        cc_org_services.getContactTypeList(filterObj, function (response, status) {
            if (status !== "ERROR") {
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

    self.clickRadioUser = function (data, event) {
        var len = self.userList().length;
        for (var i = 0; i < len; i++) {
            var user = self.userList()[i];
            if ((user.Id() !== data.Id()) && user.selected()) {
                user.selected(false);
            } else if (user.Id() === data.Id()) {
                user.selected(true);
            }
        };
        event.stopPropagation();
    }

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

    self.selectUser = function () {
        var selectedUser = null;
        for (var i = 0; i < self.userList().length; i++) {
            if (self.userList()[i].selected()) {
                selectedUser = self.userList()[i];
            }
        };
        if (selectedUser) {
            self.formUserNameEmpty(false);
            self.formUserItemId(selectedUser.ItemId());
            self.formUserName(selectedUser.UserId());
        };
        self.filterUserName("");
        self.closeUserModal();
    };

    self.closeUserModal = function () {
        $('#div_selectUserListModal').modal('hide');
        self.filterUserName("");
        self.userList.removeAll();
    };

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

    self.closeContactTypeModal = function () {
        $('#div_selectContactTypeListModal').modal('hide');
        self.contacttypeList.removeAll();
    };

    function _removeSpecialAccessOrg(orgData) {
        var len = self.subOrgsMapped().length;
        for (var i = 0; i < len; i++) {
            var mappedOrg = self.subOrgsMapped()[i];
            if (orgData.orgDetails.ItemId() === mappedOrg.orgDetails.ItemId()) {
                _unCheckAndRemoveData(mappedOrg, orgData);
                break;
            }
        }
    }

    function _unCheckAndRemoveData(mappedOrg, orgData) {
        if (orgData.orgDetails.ItemId() === mappedOrg.orgDetails.ItemId()) {
            self.subOrgsMapped.remove(mappedOrg);
            _addTosubOrgsRemovedSpecialAccess(mappedOrg);
        }
    }

    function _addTosubOrgsRemovedSpecialAccess(mappedOrg) {
        if (mappedOrg.membershipId) {
            self.subOrgsRemovedSpecialAccess.push(mappedOrg);
        }
    }

    function _addSpecialAccessOrg(orgData) {
        var orgMember = { orgDetails: {} };
        orgMember.orgDetails.BreadCrumb = ko.observable(orgData.orgDetails.Name());
        orgMember.orgDetails.Id = ko.observable(orgData.orgDetails.Id());
        orgMember.orgDetails.ItemId = ko.observable(orgData.orgDetails.ItemId());
        orgMember.orgDetails.Name = ko.observable(orgData.orgDetails.Name());
        orgMember.orgTreeObj = orgData;
        var parentOrg = orgData.ParentOrganization;
        if (parentOrg && parentOrg.ItemId) {
            orgMember.ParentOrganization = { orgDetails: {} };
            orgMember.orgDetails.BreadCrumb(orgData.ParentOrganization.orgDetails.Name() + ">" + orgMember.orgDetails.BreadCrumb());
            orgMember.ParentOrganization.orgDetails.Id = ko.observable(orgData.ParentOrganization.Id());
            orgMember.ParentOrganization.orgDetails.ItemId = ko.observable(orgData.ParentOrganization.ItemId());
            orgMember.ParentOrganization.orgDetails.Name = ko.observable(orgData.ParentOrganization.orgDetails.Name());
        }
        self.subOrgsMapped.push(orgMember);
    }
    self.onDepartmentRowCheckboxValueChanged = function (data, event) {
        if (self.parentOrgData().orgDetails.ItemId() !== data.orgDetails.ItemId()) {
            if (data.checked()) {
                _removeSpecialAccessOrg(data);
                data.checked(false);
            } else {
                _addSpecialAccessOrg(data);
                data.checked(true);
            }
        };
        event.stopPropagation();
    }

    self.removeOrgFromSelectedList = function (data, event) {
        self.subOrgsMapped.remove(data);
        _addTosubOrgsRemovedSpecialAccess(data);
        if (data.orgTreeObj && data.orgTreeObj.checked) {
            data.orgTreeObj.checked(false);
        }
        event.stopPropagation();
    }

    self.changeButtonOperation = function (data) {
        self.buttonOperationList.splice(0, self.buttonOperationList().length);
        self.visibleButtonOptions("hidden");
        for (var i = 0; i < buttonOperations.length; i++) {
            var oper = buttonOperations[i];
            if (oper.name !== data.name) {
                self.buttonOperationList.push(oper);
            } else {
                self.currentActiveButton.name(oper.name);
                self.currentActiveButton.key(oper.key);
            }
        }
        self.createOperation();
    };

    self.createOperation = function () {
        var errors = [];
        if (_validation(errors)) {
            if (self.editMode()) {
                updateMembersForm();
              
            } else {
                saveMembersForm();
            }

        } else {

        }
    }

    function _closeCreateModel() {
        if (self.currentActiveButton.key() === "SAVE") {
            $("#create_Members_modal .close")[0].click();
        }
    }

    self.cancelOperation = function () {
        cleaMembersForm();
    }

    function _refreshMembersListModel() {
        if (subOrgMainModel) {
            subOrgMainModel.selectAndRefreshSubPage("MEMBERS");
        }
    };

    self.togglePrimaryContact = function (data, event) {
        self.isPrimaryContact(event.target.checked);
    }

    //Create Button Modal End
    function saveMembersForm() {
        if(!self.clicked){
            self.clicked = true;
        var formdata = _populateFormObj();
        cc_org_services.createMember(populateReqCreateMembersObj(self.parentOrgData(), formdata), function (response, status) {
            if (status !== "ERROR") {
                successToast(3000, getTranslationMessage("Member created."));
                _refreshMembersListModel();
                cleaMembersForm();
                self.clicked=false;
                _closeCreateModel();
                
            } else {
                self.clicked=false;
                var errorMsg = "Unable to create the member. Contact your administrator.";
                if (response.responseJSON.faultstring.text) {
                    errorMsg = getTranslationMessage("Unable to create the member.") + " " + response.responseJSON.faultstring.text;
                }
                showOrHideErrorInfo("div_modalCreateMembersErrorInfoArea", true, errorMsg, 10000);
            };
        });
    }
    }
    function updateMembersForm() {
        if(!self.clicked){
            self.clicked = true;
        var formdata = _populateFormObj();
        formdata.additionalAccess = formdata.additionalAccess.filter(function (e) {
            return !e.membershipId;
        });
        var reqObj = _populateReqUpdateMembersObj(populateReqCreateMembersObj(self.parentOrgData(), formdata));
        cc_org_services.updateMember(reqObj,
            function (response, status) {
                if (status !== "ERROR") {
                    successToast(3000, getTranslationMessage("Member updated."));
                    _refreshMembersListModel();
                    cleaMembersForm();
                    _closeCreateModel();
                } else {
                    self.clicked=false;
                    var errorMsg = "Unable to update the member. Contact your administrator.";
                    if (response.responseJSON.faultstring.text) {
                        errorMsg = getTranslationMessage("Unable to update the member.") + " " + response.responseJSON.faultstring.text;
                    }
                    showOrHideErrorInfo("div_modalCreateMembersErrorInfoArea", true, errorMsg, 10000);
                };
            });
        }
    }
    function _populateReqUpdateMembersObj(reqData) {
        reqData["MembershipUpdate"]["general"].membershipId = self.memberId();
        var len = self.subOrgsRemovedSpecialAccess().length;
        if (len > 0) {
            reqData["MembershipUpdate"]["special"]["RemovedMembership"] = { member: [] };
            for (var i = 0; i < len; i++) {
                _populateReqRemovedMembers(reqData, self.subOrgsRemovedSpecialAccess()[i]);
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
                if (existingMember.relatedAssignment!=undefined && existingMember.relatedAssignment.assignmentId!=undefined && existingMember.relatedAssignment.assignmentId.ItemId!=undefined) {
                    assignmentId = existingMember.relatedAssignment.assignmentId.ItemId();
                    reqData["MembershipUpdate"]["special"]["ExistingMemberShip"].member.push({
                        membershipId: existingMember.membershipId(),
                        gcOrgId: existingMember.orgDetails.ItemId(),
                        assignmentId: assignmentId
                    });
                }
            }
        }
        return reqData;
    }

    function _populateReqRemovedMembers(requestData, removedMember) {
        var assignmentId = "";
        if (removedMember.relatedAssignment && removedMember.relatedAssignment.assignmentId && removedMember.relatedAssignment.assignmentId.ItemId) {
            assignmentId = removedMember.relatedAssignment.assignmentId.ItemId();
        }
        requestData["MembershipUpdate"]["special"]["RemovedMembership"].member.push({
            membershipId: removedMember.membershipId(),
            gcOrgId: removedMember.orgDetails.ItemId(),
            assignmentId: assignmentId
        });
    }


    function _populateFormObj() {
        return {
            formUserName: self.formUserName(),
            formPosition: self.formPosition(),
            formStartDate: self.formStartDate(),
            formEndDate: self.formEndDate(),
            formUserItemId: self.formUserItemId(),
            additionalAccess: self.subOrgsMapped(),
            isPrimaryContact: self.isPrimaryContact(),
            contactTypeItemId: self.formContactTypeItemId()
        };
    }

    function _validation(errors) {
        var isValidReqData = true, isValidDates=true;
      //  var errorsTemp = [];
        _clearErrors();
        isValidReqData &= _validateRequiredData(errors);
        isValidDates &= _validateDates(errors);

       /* if (Array.isArray(errors) && (errorsTemp.length > 0)) {
            errors.removeAll();
            var len = errorsTemp.length;
            for (var i = 0; i < len; i++) {
                errors.push(errorsTemp[i]);
            }
        }*/
        if (isValidReqData && isValidDates){
            errors=[];
        }
        return isValidReqData && isValidDates;
    }

    function _validateDates(errors) {
        var isValid = true;
        //TODO:check the pattern of the input date
        if (self.formEndDate()) {
            if (!self.formStartDate()) {
                errors.push("ERROR: Enter start date.");
                self.formStartDateErrorMsg(getTranslationMessage("Select a start date."));
                isValid = false;
            } else if (new Date(self.formStartDate()) - new Date(self.formEndDate()) > 0) {
                errors.push("ERROR: start date cannot be greater than end date.");
                self.formStartDateErrorMsg(getTranslationMessage("Start date cannot be greater than end date."));
                isValid = false;
            }
        }
        return isValid;
    };

    function _clearErrors() {
       
        self.formStartDateErrorMsg("");
        self.formEndDateErrorMsg("");
        self.formUserNameEmpty(false);
    }

    function _validateRequiredData(errors) {
        var isValid = true;
        if (!self.formUserItemId()) {
            isValid = false;
            self.formUserNameEmpty(true);
            errors.push("ERROR: User name cannot be empty.");
        }
        if (!self.formStartDate()) {
            isValid = false;
            self.formStartDateErrorMsg(getTranslationMessage("Select a start date."));
            errors.push("ERROR:  StartDateEmpty name cannot be empty.");
        }
        return isValid;
    };

    function cleaMembersForm() {
        self.formUserItemId("");
        self.formUserName("");
        self.formPosition("");
        self.formStartDate("");
        self.formEndDate("");
        self.formStartDatetoLocale("");
        self.formEndDatetoLocale("");
        self.fetchRootOrgList();
        self.isPrimaryContact(false);
        self.formContactType("");
        self.formContactTypeItemId("");
        self.subOrgsMapped.removeAll();
    }
    self.destroy = function () {
        $("#endDate").datepicker("destroy");
        $("#startDate").datepicker("destroy");
    }

    self.bindEndDatePickerKeyPress = function() {
        var input = document.getElementById('endDate');
        input.addEventListener('keydown', function(event) {
            const key = event.key; // const {key} = event; ES6+
            if (key === "Backspace" || key === "Delete") {
                self.formEndDate('');
                self.formEndDatetoLocale('');
                var errors = [];
                _validation(errors)
            }else{
                event.preventDefault();
            }
        });
    }

    self.bindStartDatePickerKeyPress = function() {
        var input = document.getElementById('startDate');
        input.addEventListener('keydown', function(event) {
            const key = event.key; // const {key} = event; ES6+
            if (key === "Backspace" || key === "Delete") {
                self.formStartDate('');
                self.formStartDatetoLocale('');
                var errors = [];
                _validation(errors)
            }else{
                event.preventDefault();
            }
        });
    }
   
    self.bindJqueryFunc = function () {
        var format = "yy-mm-dd";
        $("#endDate").datepicker({
            dateFormat: format,
            onSelect: function (dateText, inst) {
                self.formEndDate(dateText);
                self.formEndDatetoLocale(formateDatetoLocale(dateText));
                var errors = [];
                _validation(errors)
            }
        });
        $("#startDate").datepicker({
            dateFormat: format,
            onSelect: function (dateText, inst) {
                self.formStartDate(dateText);
                self.formStartDatetoLocale(formateDatetoLocale(dateText));
                var errors = [];
                _validation(errors)
            }
        });
    };

    self.expanSubOrg = function (data, event) {
        if (data.expand) {
            if (!data.expand()) {
                self.fetchSubOrgList(data, event);
            } else {
                data.expand(!data.expand());
            }
        }
        event.stopPropagation();
    };

    function _populateMembersFormData(response) {
        var generalMemeberDetailsArr = response.generalMemberDetails.FindZ_INT_OrgUsersListResponse.OrganizationMembers;
        var specialMemeberDetailsArr = response.specialMembersList.FindZ_INT_OrgUsersListResponse.OrganizationMembers;
        if (generalMemeberDetailsArr.AccessType === "GENERAL" && self.memberId() === generalMemeberDetailsArr["OrganizationMembers-id"].ItemId1) {
            var org = {
                orgDetails: {
                    ItemId: ko.observable(generalMemeberDetailsArr["Owner"]["GCOrganization-id"]["ItemId"])
                    , Name: ko.observable(_getTextValue(generalMemeberDetailsArr["Owner"]["Name"]))
                }
            };
            if (generalMemeberDetailsArr.Owner.ParentOrganization && generalMemeberDetailsArr.Owner.ParentOrganization.Name) {
                org.ParentOrganization = { orgDetails: { Name: ko.observable(_getTextValue(generalMemeberDetailsArr.Owner.ParentOrganization.Name)) } };
            };
            self.parentOrgData(org);
            self.formUserItemId(generalMemeberDetailsArr["ParticipatingPerson"]["Person-id"]["ItemId"]);
            self.formUserName(_getTextValue(generalMemeberDetailsArr["ParticipatingPerson"]["User_ID"]));
            self.formPosition(generalMemeberDetailsArr["JobTitle"]);
            var startDate = generalMemeberDetailsArr["StartDate"];
            self.formStartDate(startDate ? startDate.replace('Z','') : startDate);
            var endDate = generalMemeberDetailsArr["EndDate"];
            self.formEndDate(endDate ? endDate.replace('Z','') : endDate);
            self.isPrimaryContact((generalMemeberDetailsArr["IsPrimaryContact"] && generalMemeberDetailsArr["IsPrimaryContact"]==="true") ? true:false);
            self.formStartDatetoLocale(startDate ? formateDatetoLocale(startDate) : startDate);
            self.formEndDatetoLocale(endDate ? formateDatetoLocale(endDate) : endDate);
            if(generalMemeberDetailsArr["RelatedContactType"] ){
                self.formContactType(_getTextValue(generalMemeberDetailsArr["RelatedContactType"]["Name"]));
                self.formContactTypeItemId(generalMemeberDetailsArr["RelatedContactType"]["GCContactType-id"]["ItemId"] );
            }
        }
        if (specialMemeberDetailsArr && Array.isArray(specialMemeberDetailsArr)) {
            var len = specialMemeberDetailsArr.length;
            self.subOrgsMapped.removeAll();
            for (var i = 0; i < len; i++) {
                self.subOrgsMapped.push(_populateSpeacialAccessModal(specialMemeberDetailsArr[i]));
            }
        } else if (specialMemeberDetailsArr) {
            self.subOrgsMapped.push(_populateSpeacialAccessModal(specialMemeberDetailsArr));
        }
    };

    function _populateSpeacialAccessModal(memberDetails) {
        var member = { orgDetails: {} };
        var owner = memberDetails["Owner"];
        member.orgDetails.BreadCrumb = ko.observable((owner.ParentOrganization && owner.ParentOrganization.Name ?
            _getTextValue(owner.ParentOrganization.Name) + ">" : "") + _getTextValue(owner.Name));
        member.orgDetails.Id = ko.observable(owner["GCOrganization-id"].Id);
        member.orgDetails.ItemId = ko.observable(owner["GCOrganization-id"].ItemId);
        member.orgDetails.Name = ko.observable(_getTextValue(owner.Name));
        member.membershipId = ko.observable(memberDetails["OrganizationMembers-id"].ItemId1);
        if (owner.ParentOrganization) {
            member.ParentOrganization = { orgDetails: {} };
            member.ParentOrganization.orgDetails.Id = ko.observable(owner.ParentOrganization["GCOrganization-id"].ItemId.split(".")[1]);
            member.ParentOrganization.orgDetails.ItemId = ko.observable(owner.ParentOrganization["GCOrganization-id"].ItemId);
            member.ParentOrganization.orgDetails.Name = ko.observable(_getTextValue(owner.ParentOrganization.Name));
        }
        if (memberDetails.RelatedAssignment
            && memberDetails.RelatedAssignment["Assignment-id"]
            && memberDetails.RelatedAssignment["Assignment-id"].ItemId) {
            member.relatedAssignment = {
                assignmentId: { ItemId: ko.observable(memberDetails.RelatedAssignment["Assignment-id"].ItemId) }
            };
        }

        return member;
    }

    function _selectOrgFromList(orgList) {
        if (orgList && orgList.length > 0) {
            var orgSpecialMappedLen = self.subOrgsMapped().length;
            var orgListLen = orgList.length;
            if (self.subOrgsMapped() && self.subOrgsMapped().length > 0) {
                for (var indexM = 0; indexM < orgSpecialMappedLen; indexM++) {
                    var org = self.subOrgsMapped()[indexM];
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
            if (org && orgTreeObj.orgDetails.ItemId() === org.orgDetails.ItemId()) {
                if (orgTreeObj.checked) {
                    orgTreeObj.checked(true);
                }
                org.orgTreeObj = orgTreeObj;
            }
            if (self.parentOrgData().orgDetails.ItemId() === orgTreeObj.orgDetails.ItemId()) {
                orgTreeObj.checked(true);
                orgTreeObj.disableSelect(true);
            }
        }
    }

    ; (function init() {
        if (self.editMode()) {
            cc_org_services.loadMemberDetails({ "Member": { "membershipId": self.memberId() } }, function (response, status) {
                if (status !== "ERROR") {
                    _populateMembersFormData(response);
                    self.fetchRootOrgList();
                } else {
                    showOrHideErrorInfo("div_modalCreateMembersErrorInfoArea", true, getTranslationMessage("Unable to load the member details. Contact your administrator."), 10000);
                }
            });
        } else {
            self.fetchRootOrgList();
        }

    })();
}


function CreateAddressModel(params, editMode, addressId) {
    var self = this;
    self.parentOrgData = params;
    self.editMode = ko.observable(editMode ? true : false);
    self.countriesList = ko.observableArray([{ code: "--select--" }, { code: "US" }, { code: "CA" }, { code: "IND" }]);
    self.statesList = ko.observableArray([{ code: "--select--" }, { code: "St1" }, { code: "St2" }, { code: "St3" }]);

    //Form Elements start
    self.formPrimaryAddress = ko.observable("");
    self.formAddressTitle = ko.observable("");
    self.formAddressLine1 = ko.observable("");
    self.formAddressLine2 = ko.observable("");
    self.formCountry = ko.observable("--select--");
    self.formState = ko.observable("--select--");
    self.formCity = ko.observable("");
    self.formPostalCode = ko.observable("");
    //Form Elements end

    //Create Button Modal Start
    self.visibleButtonOptions = ko.observable(true);
    const buttonOperations = [{ name: "Save and create another", key: "SAVEOPEN" }, { name: "Create address", key: "SAVE" }];
    self.buttonOperationList = ko.observableArray([]);
    if (self.editMode()) {
        buttonOperations[1].name = "Update address";
        self.currentActiveButton = ko.mapping.fromJS(buttonOperations[1]);
    } else {
        self.buttonOperationList.push(buttonOperations[0]);
        self.currentActiveButton = ko.mapping.fromJS(buttonOperations[1]);
    }
    self.currentActiveButton = ko.mapping.fromJS(buttonOperations[1]);
    self.openButtonOptions = function () {
        if ("visible" !== self.visibleButtonOptions()) {
            self.visibleButtonOptions("visible");
        } else {
            self.visibleButtonOptions("hidden");
        }
    };

    self.changeButtonOperation = function (data) {
        self.buttonOperationList.splice(0, self.buttonOperationList().length);
        self.visibleButtonOptions("hidden");
        for (var i = 0; i < buttonOperations.length; i++) {
            var oper = buttonOperations[i];
            if (oper.name !== data.name) {
                self.buttonOperationList.push(oper);
            } else {
                self.currentActiveButton.name(oper.name);
                self.currentActiveButton.key(oper.key);
            }
        }
        self.createOperation();
    };

    self.createOperation = function () {
        if (self.editMode()) {
            clearFrom();
        } else {
            saveAddressForm();
        }

        if (self.currentActiveButton.key() === "SAVE") {
            $("#create_Address_modal .close")[0].click();
        }
    }

    self.cancelOperation = function () {
        clearFrom();
    }
    //Create Button Modal End

    function saveAddressForm() {
        clearFrom();
    }

    function clearFrom() {
        self.formPrimaryAddress("");
        self.formAddressTitle("");
        self.formAddressLine1("");
        self.formAddressLine2("");
        self.formCountry("--select--");
        self.formState("--select--");
        self.formCity("");
        self.formPostalCode("");
    }
    self.openAddressCreateForm = function () {
        $('#create_Address_modal').modal({
            backdrop: 'static',
            keyboard: false
        })
    }
}


function CreateSubOrgModel(params, editMode, subOrgMainModel) {
    var self = this;
    self.editMode = ko.observable(editMode ? true : false);
    if (self.editMode()) {
        self.currentOrgData = params;
    } else {
        self.parentOrgData = params;
    };
    // Modal Form Elements 
    self.formSubOrgName = ko.observable("");
    self.formSubOrgNameEmpty = ko.observable("");
    self.formSubOrgCode = ko.observable("");
	self.formSubOrgBWSTemplateId = ko.observable("");
    self.formSubOrgCostCenterId = ko.observable("");
    self.formDescription = ko.observable("");

    //Create Button Modal Start
    self.visibleButtonOptions = ko.observable(true);
    const buttonOperations = [{ name: getTranslationMessage("Save and create another"), key: "SAVEOPEN" }, { name: getTranslationMessage("Create sub-organization"), key: "SAVE" }];
    self.buttonOperationList = ko.observableArray([]);
    if (self.editMode()) {
        if (self.currentOrgData && self.currentOrgData().ParentOrganization && self.currentOrgData().ParentOrganization.orgDetails) {
            buttonOperations[1].name = getTranslationMessage("Update sub-organization");
        } else {
            buttonOperations[1].name = getTranslationMessage("Update organization");
        }
        self.currentActiveButton = ko.mapping.fromJS(buttonOperations[1]);
        populateFormData();
    } else {
        self.buttonOperationList.push(buttonOperations[0]);
        self.currentActiveButton = ko.mapping.fromJS(buttonOperations[1]);
    }
    self.openButtonOptions = function () {
        if ("visible" !== self.visibleButtonOptions()) {
            self.visibleButtonOptions("visible");
        } else {
            self.visibleButtonOptions("hidden");
        }
    };

    function populateFormData() {
        self.formSubOrgName(self.currentOrgData().orgDetails.Name());
		self.formSubOrgBWSTemplateId(self.currentOrgData().orgDetails.BWSTemplateID());
        self.formSubOrgCostCenterId(self.currentOrgData().orgDetails.CostCenterId());
        self.formSubOrgCode(self.currentOrgData().orgDetails.OrgCode());
        self.formDescription(self.currentOrgData().orgDetails.Description());
    };

    self.changeButtonOperation = function (data) {
        self.buttonOperationList.splice(0, self.buttonOperationList().length);
        self.visibleButtonOptions("hidden");
        for (var i = 0; i < buttonOperations.length; i++) {
            var oper = buttonOperations[i];
            if (oper.name !== data.name) {
                self.buttonOperationList.push(oper);
            } else {
                self.currentActiveButton.name(oper.name);
                self.currentActiveButton.key(oper.key);
            }
        }
        self.createOperation();
    };

    self.createOperation = function () {
        if (_validateForm()) {
            if (self.editMode()) {
                self.updateSubOrg();

            } else {
                self.saveSubOrg();
            }

        }
    };

    function _closeCreateModel() {
        if (self.currentActiveButton.key() === "SAVE") {
            $("#create_department_modal .close")[0].click();
        }
    }
    function _validateForm() {
        var isValidForm = true;
        _clearFormErrors();
        if (!self.formSubOrgName() || !self.formSubOrgName().trim()) {
            isValidForm = false;
            self.formSubOrgNameEmpty(true);
        }
        return isValidForm;
    }

    function _clearFormErrors() {
        self.formSubOrgNameEmpty(false);
    }

    self.cancelOperation = function () {
        clearCreateForm();
    }

    self.saveSubOrg = function () {
        var requestObj = prepareSubOrgCreateRequest();
        cc_org_services.createSubOrg(requestObj, function (data, status) {
            if (status !== "ERROR") {
                var subOrgParentObj = prepareSubOrgParentRequest(data);
                cc_org_services.addSubOrgToParent(subOrgParentObj, function (dataMapping, status) {
                    if (status !== "ERROR") {
                        cc_org_services.getOrgDetails(preparefetchOrgDetailsRequest(data.GCOrganization["GCOrganization-id"].ItemId), function (responseData, status) {
                            if (status !== "ERROR") {
                                var dataOrg = populateOrgData(responseData.GCOrganization, self.parentOrgData());
                                dataOrg.populateOrgDetails = self.parentOrgData().populateOrgDetails;
                                dataOrg.expanSubOrg = self.parentOrgData().expanSubOrg;
                                dataOrg.expand = false;
                                dataOrg.showOptions = false;
                                dataOrg.suborgList = [];
                                var curentOrgObs = ko.mapping.fromJS(dataOrg);
                                curentOrgObs.openDepartmentCreateForm = self.parentOrgData().openDepartmentCreateForm;
                                curentOrgObs.openAddressEditForm = self.parentOrgData().openAddressEditForm;
                                curentOrgObs.openAddressCreateForm = self.parentOrgData().openAddressCreateForm;
                                curentOrgObs.openMembersEditForm = self.parentOrgData().openMembersEditForm;
                                curentOrgObs.openMembersCreateForm = self.parentOrgData().openMembersCreateForm;
                                self.parentOrgData().suborgList.push(curentOrgObs);
                                _refreshSubObgListModel();
                                _closeCreateModel();
                            } else {
                                showOrHideErrorInfo("div_modalSubOrgCreateErrorInfoArea", true, getTranslationMessage("Unable to retrieve the organization list. Contact your administrator."), 10000);
                            }
                        });
                    } else {
                        showOrHideErrorInfo("div_modalSubOrgCreateErrorInfoArea", true, getTranslationMessage("Unable to create the organization. Contact your administrator."), 10000);
                    }
                });
                clearCreateForm();
            } else {
                var errorMsg = "";
                if (data.responseText.indexOf("Sub-organization name already exist") > 0) {
                    errorMsg = ", Sub-organization name already exist.";
                    showOrHideErrorInfo("div_modalSubOrgCreateErrorInfoArea", true, getTranslationMessage("This sub-organization name is already in use. Specify a different name."), 10000);
                } else if(data.responseText.indexOf("This cost center ID is already in use. Specify a different ID.") > 0) {
                    errorMsg = ", cost center ID already exist.";
                    showOrHideErrorInfo("div_modalSubOrgCreateErrorInfoArea", true, getTranslationMessage("This cost center ID is already in use. Specify a different ID."), 10000);   
                } else {
                    showOrHideErrorInfo("div_modalSubOrgCreateErrorInfoArea", true, getTranslationMessage("Unable to create the organization") + errorMsg + getTranslationMessage(". Contact your administrator."), 10000);
                }
            }
        });
    };

    function _refreshSubObgListModel() {
        if (subOrgMainModel) {
            subOrgMainModel.selectAndRefreshSubPage("SUBORG");
        }
    };

    self.updateSubOrg = function (requestData) {
        cc_org_services.updateSubOrg(prepareUpdateOrgRequest(), responseUpdateSubOrg);
    };

    function prepareUpdateOrgRequest() {
        var request = {};
        request["GCOrganization-id"] = {};
        request["GCOrganization-id"]["Id"] = self.currentOrgData().orgDetails.Id();
        request["GCOrganization-update"] = {};
        request["GCOrganization-update"]["Name"] = self.formSubOrgName();
		if(self.formSubOrgBWSTemplateId()!="")
		request["GCOrganization-update"]["BWSTemplateID"] = self.formSubOrgBWSTemplateId();
		else
		request["GCOrganization-update"]["BWSTemplateID"] = {'@xsi:nil': 'true', "@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance"};
        request["GCOrganization-update"]["CostCenterId"] = self.formSubOrgCostCenterId();
        request["GCOrganization-update"]["OrgCode"] = self.formSubOrgCode();
        request["GCOrganization-update"]["Description"] = self.formDescription();

        return request;
    }

    function responseUpdateSubOrg(data, status) {
        if (status !== "ERROR") {
            _updateParentLeftNavFields();
            _refreshSubObgListModel();
            clearCreateForm();
            _closeCreateModel();
        } else {
            var errorMsg="";
            if(data.responseText.indexOf("This cost center ID is already in use. Specify a different ID.") > 0) {
                errorMsg = ", cost center ID already exist.";
                showOrHideErrorInfo("div_modalSubOrgCreateErrorInfoArea", true, getTranslationMessage("This cost center ID is already in use. Specify a different ID."), 10000);   
            } else {
            showOrHideErrorInfo("div_modalSubOrgCreateErrorInfoArea", true, getTranslationMessage("Unable to update the organization") + errorMsg + getTranslationMessage(". Contact your administrator."), 10000);
            }
        }
    };

    function _updateParentLeftNavFields() {
        self.currentOrgData().orgDetails.Name(self.formSubOrgName());
		self.currentOrgData().orgDetails.BWSTemplateID(self.formSubOrgBWSTemplateId());
        self.currentOrgData().orgDetails.CostCenterId(self.formSubOrgCostCenterId());
        self.currentOrgData().orgDetails.OrgCode(self.formSubOrgCode());
        self.currentOrgData().orgDetails.Description(self.formDescription());
    }





    function prepareSubOrgParentRequest(data) {
        var subOrgParentReqObj = { "GCOrganization-id": {}, "SubOrganizations": { "GCOrganization-id": {} } };
        subOrgParentReqObj["GCOrganization-id"].Id = self.parentOrgData().orgDetails.Id();
        subOrgParentReqObj["SubOrganizations"]["GCOrganization-id"].Id = data.GCOrganization["GCOrganization-id"].Id;
        return subOrgParentReqObj;
    }

    function prepareSubOrgCreateRequest() {
        var requestObj = {};
        requestObj["GCOrganization-create"] = {};
        requestObj["GCOrganization-create"]["Name"] = self.formSubOrgName();
        requestObj["GCOrganization-create"]["Description"] = self.formDescription();
        requestObj["GCOrganization-create"]["OrgCode"] = self.formSubOrgCode();
		requestObj["GCOrganization-create"]["BWSTemplateID"] = self.formSubOrgBWSTemplateId();
        requestObj["GCOrganization-create"]["CostCenterId"] = self.formSubOrgCostCenterId();
        requestObj["GCOrganization-create"]["ParentOrganization"] = { "GCOrganization-id": { "Id": self.parentOrgData().orgDetails.Id() } };
        return requestObj;
    }

    function clearCreateForm() {
        self.formSubOrgName("");
		self.formSubOrgBWSTemplateId("");
        self.formSubOrgCostCenterId("");
        self.formSubOrgCode("");
        self.formDescription("");
    };
}

/**
 * Main Model of Whole View, while uses the list Models like SubOrgListModel, SubOrgAddressesModel and SubOrgMembersModel
*/
function SubOrgMainModel(itemId) {
    var self = this;
    self.itemId = ko.observable(itemId);
    self.activePage = ko.observable('');
    self.currentOrgDisplay = ko.observable();
    self.parentOrgDisplay = ko.observable({});
    self.subOrgModel = ko.observable();
    self.departmentRootList = ko.observableArray([]);
    self.descShowMore = ko.observable(false);
    self.showOrgOptions = ko.observable(false);
    self.pageLoaded = ko.observable(false);
	self.hideCTRTabsconfigFlag = ko.observable(false);
    //Create Pages
    self.subOrgCreateOrgModel = ko.observable();
    self.subOrgCreateAddressesModel = ko.observable();
    self.subOrgCreateMembersModel = ko.observable();

    // Confirmation Variables
    self.confirmationModalHeader = ko.observable();
    self.confirmationModalMsg = ko.observable();
    self.confirmButtonText = ko.observable();

    /**
     * Will expand the Left Nav Tree and Get all the list Sub Org List from DB and
     *  Populated the Same in left Nav. 
    */
    self.expanSubOrg = function (data, event) {
        if (data.expand) {
            if (!data.expand()) {
                self.fetchSubOrgList(data, data.expand);
            } else {
                data.expand(!data.expand());
            }
        };
        event.stopPropagation();
    }



    /**
     * will populate the Screen with the selecte Org and Refresh all the Page into the selected 
     * Sub org as current org.
    */
    self.populateOrgDetails = function (data, event, parentData) {
        if ((data && data.isRootOrg && data.isRootOrg()) || !parentData) {
            parentData = {};
        }
        if (self.currentOrgDisplay().orgDetails.Id() !== data.orgDetails.Id()) {
            self.fetchSubOrgList(data);
            _hideShowOptions(self.currentOrgDisplay());
            self.currentOrgDisplay(data);
            self.parentOrgDisplay(parentData);
            populateCallBackFunc(self.currentOrgDisplay());
            clearAndLoadMainPageData(self.activePage(), data);
            self.descShowMore();
        }
    };

    function _hideShowOptions(data) {
        if (data.showOptions) {
            data.showOptions(false);
        }
    };

    /**
     * Adding Callback functions to Current data to open create Model from Sub Model
     * */
    function populateCallBackFunc(data) {
        if (data) {
            data.openDepartmentCreateForm = self.openDepartmentCreateForm;
            data.openAddressEditForm = self.openAddressEditForm;
            data.openAddressCreateForm = self.openAddressCreateForm;
            data.openMembersEditForm = self.openMembersEditForm;
            data.openMembersCreateForm = self.openMembersCreateForm;
        }
    }

    /**
     * Will clear the Sub Model Page and Load the New Sub Page Model before change of Sub Page View
     * **/
    function clearAndLoadMainPageData(activePage, initParams) {
        if (!activePage) {
            activePage = activePages[0];//default page
        }
        self.activePage('');// clear active flag as empty till model is loaded
        if ("SUBORG" === activePage) {
            self.subOrgModel(new SubOrgListModel(initParams));
        } else if ("ADDRESSES" === activePage) {
            self.subOrgModel(new SubOrgAddressesModel(initParams));//Load Addresses subPage Model
        } else if ("MEMBERS" === activePage) {
            self.subOrgModel(new SubOrgMembersModel(initParams));//Load Members subPage Model
        }
		else if ("CTRTabsConfiguration" === activePage) {
            self.subOrgModel(new SubOrgTabsConfigModel(initParams));//Load Members subPage Model
        }
        self.activePage(activePage);// populate active flag as empty after model is loaded
    }

    self.fetchSubOrgList = function (data, expandOrg) {
        if (data && data.suborgList) {
            var reqObj = {};
            reqObj["parentOrgID"] = data.orgDetails.Id();
            reqObj["orgName"] = "";
            reqObj["orgDescription"] = "";
            reqObj["offset"] = "";
            reqObj["limit"] = "";
            cc_org_services.getSubOrgListService(reqObj, function (data_response, status) {
                translatePage();
                if (status !== "ERROR") {
                    data.suborgList.removeAll();
                    if (data_response.OrgsResponse) {
                        var GCOrganization = data_response.OrgsResponse.FindZ_INT_OrgListResponse.GCOrganization;
                        if (Array.isArray(GCOrganization)) {
                            var len = GCOrganization.length;
                            for (var i = 0; i < len; i++) {
                                var subOrg = populateOrgData(GCOrganization[i], data);
                                populateSubOrgCallBack(subOrg);
                                var subOrgObs = ko.mapping.fromJS(subOrg);
                                data.suborgList.push(subOrgObs);
                            }
                            if (expandOrg) {
                                expandOrg(!expandOrg());
                            }
                        } else if (GCOrganization) {
                            var subOrg = populateOrgData(GCOrganization, data);
                            populateSubOrgCallBack(subOrg);
                            var subOrgObs = ko.mapping.fromJS(subOrg);
                            data.suborgList.push(subOrgObs);
                            if (expandOrg) {
                                expandOrg(!expandOrg());
                            }
                        }
                    }
                } else {
                    showOrHideErrorInfo("div_modalSubOrgMainErrorInfoArea", true, getTranslationMessage("Unable to retrieve the organization list. Contact your administrator."), 10000);
                };
            }
            );
        }
    }

    self.selectAndRefreshSubPage = function (pageName) {
        if (self.activePage() !== pageName) {
            self.selectSubPage(pageName);
        } else {
            self.subOrgModel().refreshTable();
        }
    };

    self.selectSubPage = function (pageName) {
        if (self.activePage() !== pageName) {
            clearAndLoadMainPageData(pageName, self.currentOrgDisplay());
        }
    };

    self.changeVisiblityOrgOptions = function (data, event) {
        self.populateOrgDetails(data, event);
        if (data.showOptions) {
            data.showOptions(!data.showOptions());
        }
        event.stopPropagation();
        translatePage();
    };
    self.openDepartmentEditForm = function (data, event) {
        hideOptions(event);
        self.subOrgCreateOrgModel(new CreateSubOrgModel(self.currentOrgDisplay, true, self));
        $("#create_department_modal").modal({
            backdrop: 'static',
            keyboard: false
        });
        event.stopPropagation();
        translatePage();
    }

    self.openDepartmentCreateForm = function (data, event) {
        hideOptions(event);
        self.subOrgCreateOrgModel(new CreateSubOrgModel(self.currentOrgDisplay, false, self));
        $("#create_department_modal").modal({
            backdrop: 'static',
            keyboard: false
        });
        event.stopPropagation();
        translatePage();
    }
    self.openAddressEditForm = function (addressId) {
        self.subOrgCreateAddressesModel(new CreateAddressModel(null, true, addressId));
        $("#create_Address_modal").modal({
            backdrop: 'static',
            keyboard: false
        });
        event.stopPropagation();
        translatePage();

    }
    self.openAddressCreateForm = function (data, event) {
        hideOptions(event);
        self.subOrgCreateAddressesModel(new CreateAddressModel(self.currentOrgDisplay));
        $("#create_Address_modal").modal({
            backdrop: 'static',
            keyboard: false
        });
        event.stopPropagation();
        translatePage();
    };

    self.openMembersEditForm = function (memberId, event) {
        var membersModal = new CreateMemberModel(null, true, memberId, self);
        membersModal.clicked = false;
        self.subOrgCreateMembersModel(membersModal);
        $("#create_Members_modal").modal({
            backdrop: 'static',
            keyboard: false
        });
        setTimeout(function () {
            membersModal.bindJqueryFunc();
            membersModal.bindEndDatePickerKeyPress();
            membersModal.bindStartDatePickerKeyPress();
        }, 0);
        event.stopPropagation();
        translatePage();
    };

    self.openMembersCreateForm = function (data, event) {
        hideOptions(event);
        var membersModal = new CreateMemberModel(self.currentOrgDisplay, false, null, self);
        membersModal.clicked = false;
        self.subOrgCreateMembersModel(membersModal);
        $("#create_Members_modal").modal({
            backdrop: 'static',
            keyboard: false
        });

        setTimeout(function () {
            membersModal.bindJqueryFunc();
            membersModal.bindEndDatePickerKeyPress();
            membersModal.bindStartDatePickerKeyPress();
        }, 0);
        event.stopPropagation();
        translatePage();
    }

    self.deleteSubOrg = function (data, event, parent) {
        hideOptions(event);
        self.validateDelete(data, function (msg, status) {
            if (status !== "ERROR") {
                self.confirmationModalHeader(getTranslationMessage("Delete"));
                //self.confirmationModalMsg("");
                if (status === "WARNING") {
                    self.confirmationModalMsg(msg);
                }
                else{
                    self.confirmationModalMsg(getTranslationMessage("Delete the sub-organization?"));
                }
                self.confirmButtonText(getTranslationMessage("Delete"));
                $("#confirmationOrgModal").modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $('button#confirmYes').off("click");
                $('button#confirmYes').on('click', function (_event) {
                    cc_org_services.deleteSubOrg(prepareDeleteOrgDetailsRequest(data.orgDetails.ItemId()), function (response, status) {
                        if (status !== "ERROR") {
                            self.populateOrgDetails(parent, event);
                            parent.suborgList.remove(data);
                        } else {
                            showOrHideErrorInfo("div_modalSubOrgMainErrorInfoArea", true, getTranslationMessage("Unable to delete the organization. Contact your administrator."), 10000);
                        }
                    });
                });
            } else {
                showOrHideErrorInfo("div_modalSubOrgMainErrorInfoArea", true, msg, 10000);
            }
        });
        event.stopPropagation();
    }


    self.validateDelete = function (data, callBackFunc) {
        var reqObj = { "gcOrgId": data.orgDetails.ItemId() };
        cc_org_services.validateDeleteSubOrg(reqObj, function (response, status) {
            if (status !== "ERROR") {
                if (("FAILED" === _getTextValue(response.status)) && callBackFunc) {
                    callBackFunc(getTranslationMessage("An error occurred while deleting the organization.") + " "+ getTranslationMessage(_getTextValue(response.responseMsg)), "ERROR");
                } else if ((("WARNING" === _getTextValue(response.status))) && callBackFunc) {
                    callBackFunc(_getTextValue(response.responseMsg), _getTextValue(response.status));
                } else if (callBackFunc) {
                    callBackFunc();
                } else {
                    showOrHideErrorInfo("div_modalSubOrgMainErrorInfoArea", true, getTranslationMessage("Unable to delete the organization. Contact your administrator."), 10000);
                }
            } else {
                showOrHideErrorInfo("div_modalSubOrgMainErrorInfoArea", true, getTranslationMessage("Unable to delete the organization. Contact your administrator."), 10000);
            }
        });
    }

    /**
    **
    Hides the options List displayed on Left Navigation of sub-Org List
    **/
    function hideOptions(event) {
        //get UL element and change the Visibility
        if (event && event.target.tagName === "SPAN") {
            event.target.parentElement.parentElement.style.visibility = "hidden";
        } else if (event && event.target.tagName === "LI") {
            event.target.parentElement.style.visibility = "hidden";
        }
    }

    function populateSubOrgCallBack(data) {
        data.populateOrgDetails = self.populateOrgDetails;
        data.expanSubOrg = self.expanSubOrg;
        data.expand = false;
        data.showOptions = false;
        data.suborgList = [];
    };

	function hideCTRTabsConfigTab() {
        self.hideCTRTabsconfigFlag(false);
        cc_org_services.CTRTabsConfig(function (response, status) {
            if (status !== "ERROR") {
				self.hideCTRTabsconfigFlag(response.GC.CTRTabsConfig=="true"?true:false);
            } else {
                showOrHideErrorInfo("div_modalPersonsErrorInfoArea", true, "Unable to retrieve the contact type list. Contact your administrator.", 10000);
            };
        });
    };
    /*
    *Initial call to update initial data
    **/
    ; (function init() {
        cc_org_services.getOrgDetails(preparefetchOrgDetailsRequest(self.itemId()), function (responseData, status) {
            if (status !== "ERROR") {
                var data = populateOrgData(responseData.GCOrganization, null);
                data.isRootOrg = true;
                populateSubOrgCallBack(data);
                var curentOrgObs = ko.mapping.fromJS(data);
                self.departmentRootList.push(curentOrgObs);
                populateCallBackFunc(curentOrgObs);
                self.currentOrgDisplay(curentOrgObs);
                clearAndLoadMainPageData(activePages[0], curentOrgObs);
				hideCTRTabsConfigTab();
                self.pageLoaded(true);
            } else {
                showOrHideErrorInfo("div_modalSubOrgMainErrorInfoArea", true, getTranslationMessage("Unable to load the organization details. Contact your administrator."), 10000);
            }
        });
    })();

};


//Knockout Binding Models End


//Global util functions start
function prepareDeleteOrgDetailsRequest(itemId) {
    var requestObj = { "GCOrganization": {} };
    requestObj["GCOrganization"]["GCOrganization-id"] = {};
    requestObj["GCOrganization"]["GCOrganization-id"]["ItemId"] = itemId;
    return requestObj;
}
function preparefetchOrgDetailsRequest(itemId) {
    var requestObj = {};
    requestObj["GCOrganization-id"] = {};
    requestObj["GCOrganization-id"]["ItemId"] = itemId;
    return requestObj;
}

function populateOrgData(responseData, parentOrgData) {
    var data = {};
    data.orgDetails = {};
    data.orgDetails["Id"] = responseData["GCOrganization-id"]["Id"];
    data.orgDetails["ItemId"] = responseData["GCOrganization-id"]["ItemId"];
    data.orgDetails["Name"] = responseData["Name"];
    data.orgDetails["Description"] = responseData["Description"];
    data.orgDetails["Code"] = responseData["Code"];
	data.orgDetails["BWSTemplateID"] = responseData["BWSTemplateID"];
    data.orgDetails["CostCenterId"] = responseData["CostCenterId"];
    data.orgDetails["OrgCode"] = responseData["OrgCode"];
    data.orgDetails["CreationType"] = responseData["CreationType"];
    data.orgDetails["Status"] = responseData["Status"];
    data.orgDetails["BreadCrumb"] = responseData["Name"];
	data.orgDetails["CTRTabsConfig"] = responseData["CTRTabsConfiguration"];
	data.orgDetails["CTRDefaultValues"] = responseData["CTR_DEFAULT_VALUES"];
    data.depth = 0;
    if (parentOrgData && parentOrgData.depth) {
        data.depth = (parentOrgData.depth() + 1);
    }
    if (responseData.ParentOrganization) {
        populateParentObj(data, responseData, parentOrgData);
    }
    return data;
}
function populateParentObj(data, responseData, parentOrgData) {
    data.ParentOrganization = {};
    data.ParentOrganization["Id"] = responseData.ParentOrganization["GCOrganization-id"]["Id"];
    data.ParentOrganization["ItemId"] = responseData.ParentOrganization["GCOrganization-id"]["ItemId"];
    if (parentOrgData && parentOrgData.orgDetails) {
        data.ParentOrganization.orgDetails = {};
        data.ParentOrganization.orgDetails["Name"] = parentOrgData.orgDetails.Name();
    }
    return data;
}
function populateOrgReqMembersListObj(input) {
    var request = {};
    request["orgID"] = input.orgData.orgDetails.Id();
    request["offset"] = input.offset;
    request["limit"] = input.limit;
    request["accessType"] = "LEAD,GENERAL";
    if (input.filter && input.filter.applyFilter) {
        request["memUserID"] = input.filter.filterUserName;
    }
    return request;
}
function populateReqCreateMembersObj(orgData, formData) {
    var request = { "MembershipUpdate": { "general": {}, "special": { "AdditionalMembership": { "member": [] } } } };
    if (orgData && orgData.orgDetails) {
        request["MembershipUpdate"]["general"].gcOrgId = orgData.orgDetails.ItemId();
    }
    request["MembershipUpdate"]["general"].jobTitle = formData.formPosition;
    request["MembershipUpdate"]["general"].startDate = formData.formStartDate;
    request["MembershipUpdate"]["general"].endDate = formData.formEndDate;
    request["MembershipUpdate"]["general"]["participatingPerson"] = formData.formUserItemId;
    request["MembershipUpdate"]["general"]["isPrimaryContact"]= formData.isPrimaryContact && formData.isPrimaryContact === true?"true":"false" ;
    if(formData.contactTypeItemId){
        request["MembershipUpdate"]["general"]["contactTypeItemId"]= formData.contactTypeItemId;
    }
    if (Array.isArray(formData.additionalAccess) && formData.additionalAccess.length > 0) {
        var len = formData.additionalAccess.length;
        for (var i = 0; i < len; i++) {
            if (!formData.additionalAccess[i].membershipId) {
                var mem = { "gcOrgId": formData.additionalAccess[i].orgDetails.ItemId(), "participatingPerson": formData.formUserItemId };
                request["MembershipUpdate"]["special"]["AdditionalMembership"]["member"].push(mem);
            }
        }
    };
    return request;
};

function toggle(data) {
    data(!data());
}

function _getTextValue(obj) {
    return obj && obj.text ? obj.text : "";
}

//organization lookup model
var OrgsListModel = function () {
    var self = this;

	
    self.RecordsList = ko.observableArray([]);
    self.selectedOrgName = ko.observable('');

	self.currentPage = ko.observable(1);
    self.numOfRecords = ko.observable('');
    self.numOfPages = ko.observable('');
    self.isFilterApplied = ko.observable(false);
	
	var l_orgNameFilterElement = document.getElementById("input_orgNameFilter");
    var l_orgCodeFilterElement = document.getElementById("input_orgCodeFilter");
	var l_parentOrgNameFilterElement = document.getElementById("input_parentOrgNameFilter");

    self.selectedOrgItemId = ko.observable('');
	
	self.selectOrgListRadioButton = function (iItem, event) {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
        if (iItem["GCOrganization-id"]) {
            var l_itemId = iItem["GCOrganization-id"].ItemId;
            self.selectedOrgItemId(l_itemId);
            self.selectedOrgName(iItem.Name);
        }
    }
    self.onOrgListRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        if (iItem["GCOrganization-id"]) {
			var l_itemId = iItem["GCOrganization-id"].ItemId;
            self.selectedOrgItemId(l_itemId);
            self.selectedOrgName(iItem.Name)
        }
        event.stopPropagation();
    }
    self.ClearOrgsListFilter = function () {
		l_orgNameFilterElement = document.getElementById("input_orgNameFilter");
		l_orgCodeFilterElement = document.getElementById("input_orgCodeFilter");
		l_parentOrgNameFilterElement = document.getElementById("input_parentOrgNameFilter");
		if(l_orgNameFilterElement!=null && l_orgCodeFilterElement!=null && l_parentOrgNameFilterElement!=null){
			l_orgNameFilterElement.value = "";
			l_orgCodeFilterElement.value = "";
			l_parentOrgNameFilterElement.value = "";
		}
    }
    self.getOrgsListFilterObject = function () {
		l_orgNameFilterElement = document.getElementById("input_orgNameFilter");
		l_orgCodeFilterElement = document.getElementById("input_orgCodeFilter");
		l_parentOrgNameFilterElement = document.getElementById("input_parentOrgNameFilter");
        self.CurrentFilterObject = {
            "orgName": l_orgNameFilterElement.value ,
            "orgCode": l_orgCodeFilterElement.value,
            "parentOrgName": l_parentOrgNameFilterElement.value,
            "offset": listOffsetValue,
			"limit": listLimitValue
        };
        return self.CurrentFilterObject;
    }
}
function openOrgSelectionModal() {
    $("#div_selectOrgModal").modal({
        backdrop: 'static',
        keyboard: false
    });
	ClearOrgsListFilter();
	KOSubOrgMainModel.subOrgModel().lookupModels.l_OrgsList_model.currentPage('1');
    ListOrganizations();
    $('button#btn_selectOrgYes').off("click");
    $('button#btn_selectOrgYes').on('click', function (_event) {
        KOSubOrgMainModel.subOrgModel().defaultValue_ORGANIZATION({"ItemId":KOSubOrgMainModel.subOrgModel().lookupModels.l_OrgsList_model.selectedOrgItemId(),"Name":KOSubOrgMainModel.subOrgModel().lookupModels.l_OrgsList_model.selectedOrgName()});
		KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTYPE("");
		KOSubOrgMainModel.subOrgModel().defaultValue_TEMPLATETYPE("None");
		KOSubOrgMainModel.subOrgModel().defaultValue_TEMPLATE("");
		KOSubOrgMainModel.subOrgModel().dirtyFlag(true);
    });
	
}
function clearOrgSelection() {
	KOSubOrgMainModel.subOrgModel().defaultValue_ORGANIZATION("");
	KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTYPE("");
	KOSubOrgMainModel.subOrgModel().defaultValue_TEMPLATETYPE("None");
	KOSubOrgMainModel.subOrgModel().defaultValue_TEMPLATE("");
	KOSubOrgMainModel.subOrgModel().dirtyFlag(true);
}
function ClearOrgsListFilter(event, iSrcElement) {
    KOSubOrgMainModel.subOrgModel().lookupModels.l_OrgsList_model.ClearOrgsListFilter();
    $(".btn_clearFilterActionBar").css('display', 'none');
    KOSubOrgMainModel.subOrgModel().lookupModels.l_OrgsList_model.isFilterApplied(false);
	KOSubOrgMainModel.subOrgModel().lookupModels.l_OrgsList_model.currentPage('1');
	listOffsetValue=0;
    ListOrganizations();
    hideOrgsListFilter();
}
function hideOrgsListFilter() {
    $(".div_ListFilter").hide();
    document.getElementsByClassName("div_ListFilter")[0].setAttribute("apps-toggle", 'collapsed');
    $("#div_orgListData").removeClass("col-md-9");
    $("#div_orgListData").addClass("col-md-12");
}
function ApplyFilterOnOrgsList(event, iSrcElement) {
    if (document.getElementById("input_orgNameFilter").value != "" || document.getElementById("input_orgCodeFilter").value != "" || document.getElementById("input_parentOrgNameFilter").value != "") {
        $(".btn_clearFilterActionBar").css('display', 'inline');
        KOSubOrgMainModel.subOrgModel().lookupModels.l_OrgsList_model.isFilterApplied(true);
    } else {
        $(".btn_clearFilterActionBar").css('display', 'none');
        KOSubOrgMainModel.subOrgModel().lookupModels.l_OrgsList_model.isFilterApplied(false);
    }
	KOSubOrgMainModel.subOrgModel().lookupModels.l_OrgsList_model.currentPage('1');
	listOffsetValue=0;
    ListOrganizations();
    hideOrgsListFilter();
}
function ListOrganizations(uiSelectOp) {
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
        method: "GetOrgsWithFilters",
        parameters: KOSubOrgMainModel.subOrgModel().lookupModels.l_OrgsList_model.getOrgsListFilterObject(),
        success: function (data) {
            addDataToLookup(data.OrgsResponse.FindZ_INT_OrgListResponse.GCOrganization, KOSubOrgMainModel.subOrgModel().lookupModels.l_OrgsList_model);
            if (undefined != data.OrgsResponse.FindZ_INT_OrgListResponse["@total"]) {
					KOSubOrgMainModel.subOrgModel().lookupModels.l_OrgsList_model.numOfRecords(data.OrgsResponse.FindZ_INT_OrgListResponse["@total"]);
            } else {
                KOSubOrgMainModel.subOrgModel().lookupModels.l_OrgsList_model.numOfRecords(0);
            }
			
            if (KOSubOrgMainModel.subOrgModel().lookupModels.l_OrgsList_model.numOfRecords() != 0) {
                KOSubOrgMainModel.subOrgModel().lookupModels.l_OrgsList_model.numOfPages(Math.ceil(KOSubOrgMainModel.subOrgModel().lookupModels.l_OrgsList_model.numOfRecords() / listLimitValue));
            } else {
                KOSubOrgMainModel.subOrgModel().lookupModels.l_OrgsList_model.numOfPages(1);
            }
            updatePaginationParams(KOSubOrgMainModel.subOrgModel().lookupModels.l_OrgsList_model);
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the organizations. Contact your administrator."), 10000);
            return false;
        }
    });
}

//contract type lookup model
var CTRTypesListModel = function () {
    var self = this;

	
    self.RecordsList = ko.observableArray([]);
    self.selectedCTRTypeName = ko.observable('');

	self.currentPage = ko.observable(1);
    self.numOfRecords = ko.observable('');
    self.numOfPages = ko.observable('');
    self.isFilterApplied = ko.observable(false);
	
	var l_CTRTypeNameFilterElement = document.getElementById("input_CTRTypeNameFilter");
    var l_CTIntentTypeFilterElement = document.getElementById("input_CTIntentTypeFilter");
	var l_CTDescFilterElement = document.getElementById("input_CTDescFilter");

    self.selectedCTRTypeItemId = ko.observable('');
	
	self.selectCTRTypeListRadioButton = function (iItem, event) {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
        if (iItem["GCType-id"]) {
            var l_itemId = iItem["GCType-id"].ItemId;
            self.selectedCTRTypeItemId(l_itemId);
            self.selectedCTRTypeName(iItem.Name);
        }
    }
    self.onCTRTypeListRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        if (iItem["GCType-id"]) {
			var l_itemId = iItem["GCType-id"].ItemId;
            self.selectedCTRTypeItemId(l_itemId);
            self.selectedCTRTypeName(iItem.Name)
        }
        event.stopPropagation();
    }
    self.ClearCTRTypesListFilter = function () {
		l_CTRTypeNameFilterElement = document.getElementById("input_CTRTypeNameFilter");
		l_CTIntentTypeFilterElement = document.getElementById("input_CTIntentTypeFilter");
		l_CTDescFilterElement = document.getElementById("input_CTDescFilter");
		if(l_CTRTypeNameFilterElement!=null && l_CTIntentTypeFilterElement!=null && l_CTDescFilterElement!=null){
			l_CTRTypeNameFilterElement.value = "";
			l_CTIntentTypeFilterElement.value = "";
			l_CTDescFilterElement.value = "";
		}
    }
    self.getCTRTypesListFilterObject = function () {
		l_CTRTypeNameFilterElement = document.getElementById("input_CTRTypeNameFilter");
		l_CTIntentTypeFilterElement = document.getElementById("input_CTIntentTypeFilter");
		l_CTDescFilterElement = document.getElementById("input_CTDescFilter");
        self.CurrentFilterObject = {
            "Name": l_CTRTypeNameFilterElement.value ,
            "IntentType": l_CTIntentTypeFilterElement.value,
            "Description": l_CTDescFilterElement.value,
			"OrgID": KOSubOrgMainModel.subOrgModel().defaultValue_ORGANIZATION().ItemId.split('.')[1],
            "offset": listOffsetValue,
			"limit": listLimitValue
        };
        return self.CurrentFilterObject;
    }
}
function openCTRTypeSelectionModal() {
	if( KOSubOrgMainModel.subOrgModel().defaultValue_ORGANIZATION()=="")
		return;
    $("#div_selectCTRTypeModal").modal({
        backdrop: 'static',
        keyboard: false
    });
	ClearCTRTypesListFilter();
	KOSubOrgMainModel.subOrgModel().lookupModels.l_CTRTypesList_model.currentPage('1');
    ListCTRTypes();
    $('button#btn_selectCTRTypeYes').off("click");
    $('button#btn_selectCTRTypeYes').on('click', function (_event) {
        KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTYPE({"ItemId":KOSubOrgMainModel.subOrgModel().lookupModels.l_CTRTypesList_model.selectedCTRTypeItemId(),"Name":KOSubOrgMainModel.subOrgModel().lookupModels.l_CTRTypesList_model.selectedCTRTypeName()});
		KOSubOrgMainModel.subOrgModel().defaultValue_TEMPLATETYPE("None");
		KOSubOrgMainModel.subOrgModel().defaultValue_TEMPLATE("");
		KOSubOrgMainModel.subOrgModel().dirtyFlag(true);
    });
}
function clearCTRTypeSelection() {
	if(KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTYPE()!=""){
		KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTYPE("");
		KOSubOrgMainModel.subOrgModel().defaultValue_TEMPLATETYPE("None");
		KOSubOrgMainModel.subOrgModel().defaultValue_TEMPLATE("");
		KOSubOrgMainModel.subOrgModel().dirtyFlag(true);
	}
}
function ClearCTRTypesListFilter(event, iSrcElement) {
    KOSubOrgMainModel.subOrgModel().lookupModels.l_CTRTypesList_model.ClearCTRTypesListFilter();
    $(".btn_clearFilterActionBar").css('display', 'none');
    KOSubOrgMainModel.subOrgModel().lookupModels.l_CTRTypesList_model.isFilterApplied(false);
	KOSubOrgMainModel.subOrgModel().lookupModels.l_CTRTypesList_model.currentPage('1');
	listOffsetValue=0;
    ListCTRTypes();
    hideCTRTypesListFilter();
}
function hideCTRTypesListFilter() {
    $(".div_ListFilter").hide();
    document.getElementsByClassName("div_ListFilter")[0].setAttribute("apps-toggle", 'collapsed');
    $("#div_CTRTypeListData").removeClass("col-md-9");
    $("#div_CTRTypeListData").addClass("col-md-12");
}
function ApplyFilterOnCTRTypesList(event, iSrcElement) {
    if (document.getElementById("input_CTRTypeNameFilter").value != "" || document.getElementById("input_CTIntentTypeFilter").value != "" || document.getElementById("input_CTDescFilter").value != "") {
        $(".btn_clearFilterActionBar").css('display', 'inline');
        KOSubOrgMainModel.subOrgModel().lookupModels.l_CTRTypesList_model.isFilterApplied(true);
    } else {
        $(".btn_clearFilterActionBar").css('display', 'none');
        KOSubOrgMainModel.subOrgModel().lookupModels.l_CTRTypesList_model.isFilterApplied(false);
    }
	KOSubOrgMainModel.subOrgModel().lookupModels.l_CTRTypesList_model.currentPage('1');
	listOffsetValue=0;
    ListCTRTypes();
    hideCTRTypesListFilter();
}
function ListCTRTypes(uiSelectOp) {
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
        method: "GetFilteredCtrTypes",
        parameters: KOSubOrgMainModel.subOrgModel().lookupModels.l_CTRTypesList_model.getCTRTypesListFilterObject(),
        success: function (data) {
            addDataToLookup(data.filteredTypes.FindZ_INT_FilteredTypesResponse.GCType, KOSubOrgMainModel.subOrgModel().lookupModels.l_CTRTypesList_model);
            if (undefined != data.filteredTypes.FindZ_INT_FilteredTypesResponse["@total"]) {
					KOSubOrgMainModel.subOrgModel().lookupModels.l_CTRTypesList_model.numOfRecords(data.filteredTypes.FindZ_INT_FilteredTypesResponse["@total"]);
            } else {
                KOSubOrgMainModel.subOrgModel().lookupModels.l_CTRTypesList_model.numOfRecords(0);
            }
			
            if (KOSubOrgMainModel.subOrgModel().lookupModels.l_CTRTypesList_model.numOfRecords() != 0) {
                KOSubOrgMainModel.subOrgModel().lookupModels.l_CTRTypesList_model.numOfPages(Math.ceil(KOSubOrgMainModel.subOrgModel().lookupModels.l_CTRTypesList_model.numOfRecords() / listLimitValue));
            } else {
                KOSubOrgMainModel.subOrgModel().lookupModels.l_CTRTypesList_model.numOfPages(1);
            }
            updatePaginationParams(KOSubOrgMainModel.subOrgModel().lookupModels.l_CTRTypesList_model);
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the contract types. Contact your administrator."), 10000);
            return false;
        }
    });
}

//Template lookup model
var TemplatesListModel = function () {
    var self = this;

	
    self.RecordsList = ko.observableArray([]);
    self.selectedTemplateName = ko.observable('');

	self.currentPage = ko.observable(1);
    self.numOfRecords = ko.observable('');
    self.numOfPages = ko.observable('');
    self.isFilterApplied = ko.observable(false);
	
	var l_TemplateNameFilterElement = document.getElementById("input_TemplateNameFilter");
    var l_TemplateIDFilterElement = document.getElementById("input_templateIDFilter");
	var l_TemplateDescFilterElement = document.getElementById("input_templateDescFilter");

    self.selectedTemplateItemId = ko.observable('');
	
	self.selectTemplateListRadioButton = function (iItem, event) {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
        if (iItem["GCTemplate-id"]) {
            var l_itemId = iItem["GCTemplate-id"].ItemId;
            self.selectedTemplateItemId(l_itemId);
            self.selectedTemplateName(iItem.Name);
        }
    }
    self.onTemplateListRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        if (iItem["GCTemplate-id"]) {
			var l_itemId = iItem["GCTemplate-id"].ItemId;
            self.selectedTemplateItemId(l_itemId);
            self.selectedTemplateName(iItem.Name)
        }
        event.stopPropagation();
    }
    self.ClearTemplatesListFilter = function () {
		l_TemplateNameFilterElement = document.getElementById("input_TemplateNameFilter");
		l_TemplateIDFilterElement = document.getElementById("input_templateIDFilter");
		l_TemplateDescFilterElement = document.getElementById("input_templateDescFilter");
		if(l_TemplateNameFilterElement!=null && l_TemplateIDFilterElement!=null && l_TemplateDescFilterElement!=null){
			l_TemplateNameFilterElement.value = "";
			l_TemplateIDFilterElement.value = "";
			l_TemplateDescFilterElement.value = "";
		}
    }
    self.getTemplatesListFilterObject = function () {
		l_TemplateNameFilterElement = document.getElementById("input_TemplateNameFilter");
		l_TemplateIDFilterElement = document.getElementById("input_templateIDFilter");
		l_TemplateDescFilterElement = document.getElementById("input_templateDescFilter");
        self.CurrentFilterObject = {
            "templateName": l_TemplateNameFilterElement.value ,
            "templateID": l_TemplateIDFilterElement.value,
            "description": l_TemplateDescFilterElement.value,
			"state": "Active",
			"contractTypeID": KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTYPE().ItemId.split('.')[1],
			"templateType": KOSubOrgMainModel.subOrgModel().defaultValue_TEMPLATETYPE(),
            "offset": listOffsetValue,
			"limit": listLimitValue
        };
        return self.CurrentFilterObject;
    }
}
function openTemplateSelectionModal() {
	if( KOSubOrgMainModel.subOrgModel().defaultValue_ORGANIZATION()=="" || KOSubOrgMainModel.subOrgModel().defaultValue_TEMPLATETYPE()=="None")
		return;
    $("#div_selectTemplateModal").modal({
        backdrop: 'static',
        keyboard: false
    });
	ClearTemplatesListFilter();
	KOSubOrgMainModel.subOrgModel().lookupModels.l_TemplatesList_model.currentPage('1');
    ListTemplates();
    $('button#btn_selectTemplateYes').off("click");
    $('button#btn_selectTemplateYes').on('click', function (_event) {
        KOSubOrgMainModel.subOrgModel().defaultValue_TEMPLATE({"ItemId":KOSubOrgMainModel.subOrgModel().lookupModels.l_TemplatesList_model.selectedTemplateItemId(),"Name":KOSubOrgMainModel.subOrgModel().lookupModels.l_TemplatesList_model.selectedTemplateName()});
		KOSubOrgMainModel.subOrgModel().dirtyFlag(true);
    });
	
}
function clearTemplateSelection() {
	if(KOSubOrgMainModel.subOrgModel().defaultValue_TEMPLATE()!=""){
		KOSubOrgMainModel.subOrgModel().defaultValue_TEMPLATE("");
		KOSubOrgMainModel.subOrgModel().dirtyFlag(true);
	}
}
function ClearTemplatesListFilter(event, iSrcElement) {
    KOSubOrgMainModel.subOrgModel().lookupModels.l_TemplatesList_model.ClearTemplatesListFilter();
    $(".btn_clearFilterActionBar").css('display', 'none');
    KOSubOrgMainModel.subOrgModel().lookupModels.l_TemplatesList_model.isFilterApplied(false);
	KOSubOrgMainModel.subOrgModel().lookupModels.l_TemplatesList_model.currentPage('1');
	listOffsetValue=0;
    ListTemplates();
    hideTemplatesListFilter();
}
function hideTemplatesListFilter() {
    $(".div_ListFilter").hide();
    document.getElementsByClassName("div_ListFilter")[0].setAttribute("apps-toggle", 'collapsed');
    $("#div_TemplateListData").removeClass("col-md-9");
    $("#div_TemplateListData").addClass("col-md-12");
}
function ApplyFilterOnTemplatesList(event, iSrcElement) {
    if (document.getElementById("input_TemplateNameFilter").value != "" || document.getElementById("input_templateIDFilter").value != "" || document.getElementById("input_templateDescFilter").value != "") {
        $(".btn_clearFilterActionBar").css('display', 'inline');
        KOSubOrgMainModel.subOrgModel().lookupModels.l_TemplatesList_model.isFilterApplied(true);
    } else {
        $(".btn_clearFilterActionBar").css('display', 'none');
        KOSubOrgMainModel.subOrgModel().lookupModels.l_TemplatesList_model.isFilterApplied(false);
    }
	KOSubOrgMainModel.subOrgModel().lookupModels.l_TemplatesList_model.currentPage('1');
	listOffsetValue=0;
    ListTemplates();
    hideTemplatesListFilter();
}
function ListTemplates(uiSelectOp) {
    $.cordys.ajax({
        namespace: "http://schemas/OpenTextContentLibrary/16.5",
        method: "GetTemplateswithFilters",
        parameters: KOSubOrgMainModel.subOrgModel().lookupModels.l_TemplatesList_model.getTemplatesListFilterObject(),
        success: function (data) {
            addDataToLookup(data.outputResponse.FindZ_INT_TemplatesForLookupResponse.GCTemplate, KOSubOrgMainModel.subOrgModel().lookupModels.l_TemplatesList_model);
            if (undefined != data.outputResponse.FindZ_INT_TemplatesForLookupResponse["@total"]) {
					KOSubOrgMainModel.subOrgModel().lookupModels.l_TemplatesList_model.numOfRecords(data.outputResponse.FindZ_INT_TemplatesForLookupResponse["@total"]);
            } else {
                KOSubOrgMainModel.subOrgModel().lookupModels.l_TemplatesList_model.numOfRecords(0);
            }
			
            if (KOSubOrgMainModel.subOrgModel().lookupModels.l_TemplatesList_model.numOfRecords() != 0) {
                KOSubOrgMainModel.subOrgModel().lookupModels.l_TemplatesList_model.numOfPages(Math.ceil(KOSubOrgMainModel.subOrgModel().lookupModels.l_TemplatesList_model.numOfRecords() / listLimitValue));
            } else {
                KOSubOrgMainModel.subOrgModel().lookupModels.l_TemplatesList_model.numOfPages(1);
            }
            updatePaginationParams(KOSubOrgMainModel.subOrgModel().lookupModels.l_TemplatesList_model);
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the templates. Contact your administrator."), 10000);
            return false;
        }
    });
}

//country lookup model
var CountryListModel = function () {
    var self = this;

	
    self.RecordsList = ko.observableArray([]);
    self.selectedCountryName = ko.observable('');

	self.currentPage = ko.observable(1);
    self.numOfRecords = ko.observable('');
    self.numOfPages = ko.observable('');
    self.isFilterApplied = ko.observable(false);
	
	var l_CountryNameFilterElement = document.getElementById("input_CountryNameFilter");
    var l_CountryCodeFilterElement = document.getElementById("input_CountryCodeFilter");
	var l_CountryRegionFilterElement = document.getElementById("input_countryRegionFilter");

    self.selectedCountryItemId = ko.observable('');
	
	self.selectCountryListRadioButton = function (iItem, event) {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
        if (iItem["RelatedCountries-id"]) {
            var l_itemId = iItem["RelatedCountries-id"].ItemId1;
            self.selectedCountryItemId(l_itemId);
            self.selectedCountryName(getTextValue(iItem.LinkedCountry.Country_Name));
        }
    }
    self.onCountryListRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        if (iItem["RelatedCountries-id"]) {
			var l_itemId = iItem["RelatedCountries-id"].ItemId1;
            self.selectedCountryItemId(l_itemId);
            self.selectedCountryName(getTextValue(iItem.LinkedCountry.Country_Name));
        }
        event.stopPropagation();
    }
    self.ClearCountryListFilter = function () {
		l_CountryNameFilterElement = document.getElementById("input_CountryNameFilter");
		l_CountryCodeFilterElement = document.getElementById("input_CountryCodeFilter");
		l_CountryRegionFilterElement = document.getElementById("input_countryRegionFilter");
		if(l_CountryNameFilterElement!=null && l_CountryCodeFilterElement!=null && l_CountryRegionFilterElement!=null){
			l_CountryNameFilterElement.value = "";
			l_CountryCodeFilterElement.value = "";
			l_CountryRegionFilterElement.value = "";
		}
    }
    self.getCountryListFilterObject = function () {
		l_CountryNameFilterElement = document.getElementById("input_CountryNameFilter");
		l_CountryCodeFilterElement = document.getElementById("input_CountryCodeFilter");
		l_CountryRegionFilterElement = document.getElementById("input_countryRegionFilter");
        self.CurrentFilterObject = {
            "countryName": l_CountryNameFilterElement.value ,
            "countryCode": l_CountryCodeFilterElement.value,
            "regionName": l_CountryRegionFilterElement.value,
			"countryStatus": "ACTIVE",
            "offset": listOffsetValue,
			"limit": listLimitValue
        };
        return self.CurrentFilterObject;
    }
}
function openCountrySelectionModal() {
    $("#div_selectCountryModal").modal({
        backdrop: 'static',
        keyboard: false
    });
	ClearCountryListFilter();
	KOSubOrgMainModel.subOrgModel().lookupModels.l_CountryList_model.currentPage('1');
    ListCountries();
    $('button#btn_selectCountryYes').off("click");
    $('button#btn_selectCountryYes').on('click', function (_event) {
        KOSubOrgMainModel.subOrgModel().defaultValue_COUNTRY({"ItemId":KOSubOrgMainModel.subOrgModel().lookupModels.l_CountryList_model.selectedCountryItemId(),"Name":KOSubOrgMainModel.subOrgModel().lookupModels.l_CountryList_model.selectedCountryName()});
		KOSubOrgMainModel.subOrgModel().dirtyFlag(true);
    });
	
}
function clearCountrySelection() {
	if(KOSubOrgMainModel.subOrgModel().defaultValue_COUNTRY()!=""){
		KOSubOrgMainModel.subOrgModel().defaultValue_COUNTRY("");
		KOSubOrgMainModel.subOrgModel().dirtyFlag(true);
	}
}
function ClearCountryListFilter(event, iSrcElement) {
    KOSubOrgMainModel.subOrgModel().lookupModels.l_CountryList_model.ClearCountryListFilter();
    $(".btn_clearFilterActionBar").css('display', 'none');
    KOSubOrgMainModel.subOrgModel().lookupModels.l_CountryList_model.isFilterApplied(false);
	KOSubOrgMainModel.subOrgModel().lookupModels.l_CountryList_model.currentPage('1');
	listOffsetValue=0;
    ListCountries();
    hideCountryListFilter();
}
function hideCountryListFilter() {
    $(".div_ListFilter").hide();
    document.getElementsByClassName("div_ListFilter")[0].setAttribute("apps-toggle", 'collapsed');
    $("#div_CountryListData").removeClass("col-md-9");
    $("#div_CountryListData").addClass("col-md-12");
}
function ApplyFilterOnCountryList(event, iSrcElement) {
    if (document.getElementById("input_CountryNameFilter").value != "" || document.getElementById("input_CountryCodeFilter").value != "" || document.getElementById("input_countryRegionFilter").value != "") {
        $(".btn_clearFilterActionBar").css('display', 'inline');
        KOSubOrgMainModel.subOrgModel().lookupModels.l_CountryList_model.isFilterApplied(true);
    } else {
        $(".btn_clearFilterActionBar").css('display', 'none');
        KOSubOrgMainModel.subOrgModel().lookupModels.l_CountryList_model.isFilterApplied(false);
    }
	KOSubOrgMainModel.subOrgModel().lookupModels.l_CountryList_model.currentPage('1');
	listOffsetValue=0;
    ListCountries();
    hideCountryListFilter();
}
function ListCountries(uiSelectOp) {
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/contractcenter/16.3",
        method: "getCountrieswithfilters",
        parameters: KOSubOrgMainModel.subOrgModel().lookupModels.l_CountryList_model.getCountryListFilterObject(),
        success: function (data) {
            addDataToLookup(data.countries.FindZ_INT_CountryListResponse.RelatedCountries, KOSubOrgMainModel.subOrgModel().lookupModels.l_CountryList_model);
            if (undefined != data.countries.FindZ_INT_CountryListResponse["@total"]) {
					KOSubOrgMainModel.subOrgModel().lookupModels.l_CountryList_model.numOfRecords(data.countries.FindZ_INT_CountryListResponse["@total"]);
            } else {
                KOSubOrgMainModel.subOrgModel().lookupModels.l_CountryList_model.numOfRecords(0);
            }
			
            if (KOSubOrgMainModel.subOrgModel().lookupModels.l_CountryList_model.numOfRecords() != 0) {
                KOSubOrgMainModel.subOrgModel().lookupModels.l_CountryList_model.numOfPages(Math.ceil(KOSubOrgMainModel.subOrgModel().lookupModels.l_CountryList_model.numOfRecords() / listLimitValue));
            } else {
                KOSubOrgMainModel.subOrgModel().lookupModels.l_CountryList_model.numOfPages(1);
            }
            updatePaginationParams(KOSubOrgMainModel.subOrgModel().lookupModels.l_CountryList_model);
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the countries. Contact your administrator."), 10000);
            return false;
        }
    });
}

//currency lookup model
var CurrencyListModel = function () {
    var self = this;

	
    self.RecordsList = ko.observableArray([]);
    self.selectedCurrencyName = ko.observable('');

	self.currentPage = ko.observable(1);
    self.numOfRecords = ko.observable('');
    self.numOfPages = ko.observable('');
    self.isFilterApplied = ko.observable(false);
	
	var l_CurrencyNameFilterElement = document.getElementById("input_CurrencyNameFilter");
    var l_ConvertionRateFilterElement = document.getElementById("input_ConversionRateFilter");
	var l_CurrencyDescFilterElement = document.getElementById("input_currencyDescFilter");

    self.selectedCurrencyItemId = ko.observable('');
	
	self.selectCurrencyListRadioButton = function (iItem, event) {
        $(event.currentTarget.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
        if (iItem["Currency-id"]) {
            var l_itemId = iItem["Currency-id"].ItemId;
            self.selectedCurrencyItemId(l_itemId);
            self.selectedCurrencyName(getTextValue(iItem.Name));
        }
    }
    self.onCurrencyListRowRadioButtonValueChanged = function (iItem, event) {
        $(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-select-column').removeClass("cc-radio-on");
        $(event.currentTarget).addClass("cc-radio-on");
        if (iItem["Currency-id"]) {
			var l_itemId = iItem["Currency-id"].ItemId;
            self.selectedCurrencyItemId(l_itemId);
            self.selectedCurrencyName(getTextValue(iItem.Name));
        }
        event.stopPropagation();
    }
    self.ClearCurrencyListFilter = function () {
		l_CurrencyNameFilterElement = document.getElementById("input_CurrencyNameFilter");
		l_ConvertionRateFilterElement = document.getElementById("input_ConversionRateFilter");
		l_CurrencyDescFilterElement = document.getElementById("input_currencyDescFilter");
		if(l_CurrencyNameFilterElement!=null && l_ConvertionRateFilterElement!=null && l_CurrencyDescFilterElement!=null){
			l_CurrencyNameFilterElement.value = "";
			l_ConvertionRateFilterElement.value = "";
			l_CurrencyDescFilterElement.value = "";
		}
    }
    self.getCurrencyListFilterObject = function () {
		l_CurrencyNameFilterElement = document.getElementById("input_CurrencyNameFilter");
		l_ConvertionRateFilterElement = document.getElementById("input_ConversionRateFilter");
		l_CurrencyDescFilterElement = document.getElementById("input_currencyDescFilter");
        self.CurrentFilterObject = {
            "currencyName": l_CurrencyNameFilterElement.value ,
            "convertionRate": l_ConvertionRateFilterElement.value,
            "description": l_CurrencyDescFilterElement.value,
			"Status": "ACTIVE",
            "offset": listOffsetValue,
			"limit": listLimitValue
        };
        return self.CurrentFilterObject;
    }
}
function openCurrencySelectionModal() {
    $("#div_selectCurrencyModal").modal({
        backdrop: 'static',
        keyboard: false
    });
	ClearCurrencyListFilter();
	KOSubOrgMainModel.subOrgModel().lookupModels.l_CurrencyList_model.currentPage('1');
    ListCurrencies();
    $('button#btn_selectCurrencyYes').off("click");
    $('button#btn_selectCurrencyYes').on('click', function (_event) {
        KOSubOrgMainModel.subOrgModel().defaultValue_CURRENCY({"ItemId":KOSubOrgMainModel.subOrgModel().lookupModels.l_CurrencyList_model.selectedCurrencyItemId(),"Name":KOSubOrgMainModel.subOrgModel().lookupModels.l_CurrencyList_model.selectedCurrencyName()});
		KOSubOrgMainModel.subOrgModel().dirtyFlag(true);
    });
	
}
function clearCurrencySelection() {
	if(KOSubOrgMainModel.subOrgModel().defaultValue_CURRENCY()!=""){
		KOSubOrgMainModel.subOrgModel().defaultValue_CURRENCY("");
		KOSubOrgMainModel.subOrgModel().dirtyFlag(true);
	}
}
function ClearCurrencyListFilter(event, iSrcElement) {
    KOSubOrgMainModel.subOrgModel().lookupModels.l_CurrencyList_model.ClearCurrencyListFilter();
    $(".btn_clearFilterActionBar").css('display', 'none');
    KOSubOrgMainModel.subOrgModel().lookupModels.l_CurrencyList_model.isFilterApplied(false);
	KOSubOrgMainModel.subOrgModel().lookupModels.l_CurrencyList_model.currentPage('1');
	listOffsetValue=0;
    ListCurrencies();
    hideCurrencyListFilter();
}
function hideCurrencyListFilter() {
    $(".div_ListFilter").hide();
    document.getElementsByClassName("div_ListFilter")[0].setAttribute("apps-toggle", 'collapsed');
    $("#div_CurrencyListData").removeClass("col-md-9");
    $("#div_CurrencyListData").addClass("col-md-12");
}
function ApplyFilterOnCurrencyList(event, iSrcElement) {
    if (document.getElementById("input_CurrencyNameFilter").value != "" || document.getElementById("input_ConversionRateFilter").value != "" || document.getElementById("input_currencyDescFilter").value != "") {
        $(".btn_clearFilterActionBar").css('display', 'inline');
        KOSubOrgMainModel.subOrgModel().lookupModels.l_CurrencyList_model.isFilterApplied(true);
    } else {
        $(".btn_clearFilterActionBar").css('display', 'none');
        KOSubOrgMainModel.subOrgModel().lookupModels.l_CurrencyList_model.isFilterApplied(false);
    }
	KOSubOrgMainModel.subOrgModel().lookupModels.l_CurrencyList_model.currentPage('1');
	listOffsetValue=0;
    ListCurrencies();
    hideCurrencyListFilter();
}
function ListCurrencies(uiSelectOp) {
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/contractcenter/16.3",
        method: "getCurrencieswithfilters",
        parameters: KOSubOrgMainModel.subOrgModel().lookupModels.l_CurrencyList_model.getCurrencyListFilterObject(),
        success: function (data) {
            addDataToLookup(data.currencies.FindZ_INT_CurrencyListResponse.Currency, KOSubOrgMainModel.subOrgModel().lookupModels.l_CurrencyList_model);
            if (undefined != data.currencies.FindZ_INT_CurrencyListResponse["@total"]) {
					KOSubOrgMainModel.subOrgModel().lookupModels.l_CurrencyList_model.numOfRecords(data.currencies.FindZ_INT_CurrencyListResponse["@total"]);
            } else {
                KOSubOrgMainModel.subOrgModel().lookupModels.l_CurrencyList_model.numOfRecords(0);
            }
			
            if (KOSubOrgMainModel.subOrgModel().lookupModels.l_CurrencyList_model.numOfRecords() != 0) {
                KOSubOrgMainModel.subOrgModel().lookupModels.l_CurrencyList_model.numOfPages(Math.ceil(KOSubOrgMainModel.subOrgModel().lookupModels.l_CurrencyList_model.numOfRecords() / listLimitValue));
            } else {
                KOSubOrgMainModel.subOrgModel().lookupModels.l_CurrencyList_model.numOfPages(1);
            }
            updatePaginationParams(KOSubOrgMainModel.subOrgModel().lookupModels.l_CurrencyList_model);
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while retrieving the countries. Contact your administrator."), 10000);
            return false;
        }
    });
}

//Contract term lookup
function openContractTermModal(attrData) {
    if ($('#ContractTermPreviewModel').css("display") == "none" && KOSubOrgMainModel.subOrgModel().defaultValue_PERPETUAL() == "false")
        $('#ContractTermPreviewModel').css("display", "block");
    else
        $('#ContractTermPreviewModel').css("display", "none");

    addDataToContractTermLookup();
    $('button#btn_contractTermYes').off("click");
    $('button#btn_contractTermYes').on('click', function (_event) {
        if ($("#input_contractTermMonths").val() != "" && $("#input_contractTermDays").val() != "") {
            KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTERM($("#input_contractTermMonths").val() + " month(s), " + $("#input_contractTermDays").val() + " day(s)");
        }
        else if ($("#input_contractTermMonths").val() != "") {
            KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTERM($("#input_contractTermMonths").val() + " month(s)");
        }
        else if ($("#input_contractTermDays").val() != "") {
            KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTERM($("#input_contractTermDays").val() + " day(s)");
        }
        else {
            KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTERM("");
        }
        $('#ContractTermPreviewModel').css("display", "none");
		if(KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTERM()!="")
			KOSubOrgMainModel.subOrgModel().dirtyFlag(true);
    });
}

function closeContractTermModal(attrData) {
    $('#ContractTermPreviewModel').css("display", "none");
}

function addDataToContractTermLookup() {
    var months = "";
    var days = "";
    if (KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTERM() && KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTERM().lastIndexOf("month(s)") > 0) {
        months = KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTERM().substring(0, KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTERM().lastIndexOf(" month(s)"))
    }
    if (KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTERM() && KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTERM().lastIndexOf("day(s)") > 0) {
        if (months != "") {
            days = KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTERM().substring(KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTERM().lastIndexOf("month(s), ") + "month(s), ".length, KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTERM().lastIndexOf(" day(s)"))
        }
        else {
            days = KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTERM().substring(0, KOSubOrgMainModel.subOrgModel().defaultValue_CONTRACTTERM().lastIndexOf(" day(s)"))
        }
    }
    $("#input_contractTermMonths").val(months);
    $("#input_contractTermDays").val(days);
}

//common lookup functions

	function toggleFilterList(iEventObject) {
		if ($(".div_ListFilter").attr('apps-toggle') == "expanded") {
			$(".div_ListFilter").toggle();
			$('.div_ListFilter').each(function() {
				$(this).attr('apps-toggle','collapsed');
			});
			//document.getElementsByClassName("div_ListFilter").setAttribute("apps-toggle", 'collapsed');
			$(".div_ListData").removeClass("col-md-9");
			$(".div_ListData").addClass("col-md-12");
		}
		else if ($(".div_ListFilter").attr('apps-toggle') == "collapsed") {
			$(".div_ListFilter").toggle();
			//setTimeout(function () { $("#div_contractListFilter").toggle('slow'); }, 0);
			$('.div_ListFilter').each(function() {
				$(this).attr('apps-toggle','expanded');
			});
			//document.getElementsByClassName("div_ListFilter").setAttribute("apps-toggle", 'expanded');
			$(".div_ListData").removeClass("col-md-12");
			$(".div_ListData").addClass("col-md-9");
		}
	}
function updatePaginationParams(iModel) {
	
    if (iModel.currentPage() == 1) {
		$(".li_ListLeftNavigation").css("display", "none");
		$(".li_ListRightNavigation").css("display", "inline");
    }
    if (parseInt(iModel.numOfRecords()) <= parseInt(listLimitValue)) {
		iModel.currentPage('1');
        $('.li_ListLeftNavigation,.li_ListRightNavigation').css('display', 'none');
    }
}
function goToPreviousPage(iModel,listRecords) {
    if (iModel.currentPage() > 1) {
        listOffsetValue = parseInt(listOffsetValue) - parseInt(listLimitValue);
        iModel.currentPage(parseInt(iModel.currentPage()) - 1);
    }
    if (iModel.currentPage() < Math.ceil(iModel.numOfRecords() / listLimitValue)) {
		$(".li_ListRightNavigation").css("display", "inline");
        //document.getElementById("li_ListRightNavigation").style.removeProperty("display");
    }
    if (iModel.currentPage() == 1) {
		$(".li_ListLeftNavigation").css("display", "none");
    }
    if (iModel.currentPage() < 1)
        return;
    listRecords();
}
function goToNextPage(iModel,listRecords) {
    if (iModel.currentPage() < Math.ceil(iModel.numOfRecords() / listLimitValue)) {
        listOffsetValue = parseInt(listOffsetValue) + parseInt(listLimitValue);
        iModel.currentPage(isNaN(parseInt(iModel.currentPage())) ? 0 : parseInt(iModel.currentPage()));
        iModel.currentPage(parseInt(iModel.currentPage()) + 1);
    }
    if (iModel.currentPage() == Math.ceil(iModel.numOfRecords() / listLimitValue)) {
		$(".li_ListRightNavigation").css("display", "none");
    }
    if (iModel.currentPage() > 1) {
		$(".li_ListLeftNavigation").css("display", "inline");
        //document.getElementById("li_ListLeftNavigation").style.removeProperty("display");
    }
    listRecords();
}
function goToLastPage(iModel,listRecords) {
    listOffsetValue = (Math.ceil(iModel.numOfRecords() / listLimitValue) - 1) * listLimitValue;
    iModel.currentPage(Math.ceil(iModel.numOfRecords() / listLimitValue));
    $('.li_ListRightNavigation').css('display', 'none');
    $('.li_ListLeftNavigation').css('display', 'inline');
    listRecords();
}
function goToFirstPage(iModel,listRecords) {
    listOffsetValue = 0;
    iModel.currentPage('1');
    $('.li_ListRightNavigation').css('display', 'inline');
    $('.li_ListLeftNavigation').css('display', 'none');
    listRecords();
}
function addDataToLookup(iElementList, iModel) {
    iModel.RecordsList.removeAll();
    if (iElementList) {
        if (iElementList.length) {
            iElementList.forEach(function (iElement) {
                iModel.RecordsList.push(iElement);
            });
        }
        else {
            iModel.RecordsList.push(iElementList);
        }
    }
}

//Global util functions End

$(document).ready(function () {
    var cInstanceId = getUrlParameterValue("instanceId", null, true);
	KOSubOrgMainModel = new SubOrgMainModel(cInstanceId);
	ko.applyBindings(KOSubOrgMainModel, document.getElementById("department_list_form_container"));

    var i_locale = getlocale();
    var rtl_css = '../../../../../com/opentext/apps/utils/css/rtlappscommon.css';
    translateLabels("com/opentext/apps/commoncomponents/BasicComponents/BasicComponents", i_locale, true);
    loadRTLIfRequired(i_locale,rtl_css);

    if (window.parent.parent) {
        organizationSummaryIframe = $('[src*="organizationsummary.htm"]', window.parent.parent.document);
        if (organizationSummaryIframe) {
            organizationSummaryIframe.css('border', 'none');
        }
    }
    createToastDiv();
    var styleAttr=document.getElementById("successToast").getAttribute("style");
    document.getElementById("successToast").setAttribute("style",styleAttr+";z-index:5999");
});





