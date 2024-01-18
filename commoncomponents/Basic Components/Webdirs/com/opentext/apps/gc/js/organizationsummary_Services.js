$.cordys.json.defaults.removeNamespacePrefix = true;
var cc_org_services = (function () {
    var self = this;
    //Sub Org Services START
    self.getRootOrgListService = function (requestOrgMappingObj, subOrgReponseCallBack) {
        $.cordys.ajax({
            method: "GetRootOrganizations",
            namespace: "http://schemas/OpenTextBasicComponents/GCOrganization/operations",
            parameters: requestOrgMappingObj,
            success: function (responseSuccess) {
                subOrgReponseCallBack(responseSuccess);
            },
            error: function (responseFailure) {
                subOrgReponseCallBack(responseFailure, "ERROR");
                return false;
            }
        });
    };

    self.getSubOrgListService = function (requestOrgMappingObj, subOrgReponseCallBack) {
        $.cordys.ajax({
            method: "GetOrgsWithFilters",
            namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
            parameters: requestOrgMappingObj,
            success: function (responseSuccess) {
                subOrgReponseCallBack(responseSuccess);
            },
            error: function (responseFailure) {
                subOrgReponseCallBack(responseFailure, "ERROR");
                return false;
            }
        });
    };

    self.getOrgDetails = function (requestOrgObj, subOrgReponseCallBack) {
        $.cordys.ajax({
            method: "ReadGCOrganization ",
            namespace: "http://schemas/OpenTextBasicComponents/GCOrganization/operations",
            parameters: requestOrgObj,
            success: function (responseSuccess) {
                subOrgReponseCallBack(responseSuccess);
            },
            error: function (responseFailure) {
                subOrgReponseCallBack(responseFailure, "ERROR");
                return false;
            }
        });
    };

    self.deleteSubOrgService = function (requestOrgMappingObj, subOrgReponseCallBack) {
        $.cordys.ajax({
            method: "RemoveFromSubOrganizations",
            namespace: "http://schemas/OpenTextBasicComponents/GCOrganization/operations",
            parameters: requestOrgMappingObj,
            success: function (responseSuccess) {
                subOrgReponseCallBack(responseSuccess);
            },
            error: function (responseFailure) {
                subOrgReponseCallBack(responseFailure, "ERROR");
                return false;
            }
        });
    };

    self.getSubOrgAddressesList = function (orgId, populateOrgListCallbackFunc) {
        if (data) {
            populateOrgListCallbackFunc(data);
        } else {
            populateOrgListCallbackFunc(null, "ERROR");
        }
    };

    /**
    * Create  the Org Details based on input
   */
    self.createSubOrg = function (subOrgCreateObject, reponseCallBack) {
        $.cordys.ajax({
            method: "CreateGCOrganization",
            namespace: "http://schemas/OpenTextBasicComponents/GCOrganization/operations",
            parameters: subOrgCreateObject,
            success: function (responseSuccess) {
                reponseCallBack(responseSuccess);
            },
            error: function (responseFailure) {
                reponseCallBack(responseFailure, "ERROR");
                return false;
            }
        });
    };

    /**
    * Adds Sub org to Parent Org.
   */
    self.addSubOrgToParent = function (subOrgUpdateObject, reponseCallBack) {
        $.cordys.ajax({
            method: "AddToSubOrganizations",
            namespace: "http://schemas/OpenTextBasicComponents/GCOrganization/operations",
            parameters: subOrgUpdateObject,
            success: function (responseSuccess) {
                reponseCallBack(responseSuccess);
            },
            error: function (responseFailure) {
                reponseCallBack(responseFailure, "ERROR");
                return false;
            }
        });
    };

    /**
    * Update Org Details.
   */
    self.updateSubOrg = function (subOrgUpdateObject, reponseCallBack) {
        $.cordys.ajax({
            method: "UpdateGCOrganization",
            namespace: "http://schemas/OpenTextBasicComponents/GCOrganization/operations",
            parameters: subOrgUpdateObject,
            success: function (responseSuccess) {
                reponseCallBack(responseSuccess);
            },
            error: function (responseFailure) {
                reponseCallBack(responseFailure, "ERROR");
                return false;
            }
        });
    };
    /**
    * Update Org Details.
   */
    self.deleteSubOrg = function (subOrgDeleteObject, reponseCallBack) {
        $.cordys.ajax({
            method: "DeleteGCOrganization",
            namespace: "http://schemas/OpenTextBasicComponents/GCOrganization/operations",
            parameters: subOrgDeleteObject,
            success: function (responseSuccess) {
                reponseCallBack(responseSuccess);
            },
            error: function (responseFailure) {
                reponseCallBack(responseFailure, "ERROR");
                return false;
            }
        });
    };
    /**
     * Vlaidates the org deletion before delete.
     * **/
    self.validateDeleteSubOrg = function (subOrgDeleteObject, reponseCallBack) {
        $.cordys.ajax({
            method: "ValidateGCOrgDeletion",
            namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
            parameters: subOrgDeleteObject,
            success: function (responseSuccess) {
                reponseCallBack(responseSuccess);
            },
            error: function (responseFailure) {
                reponseCallBack(responseFailure, "ERROR");
                return false;
            }
        });
    };
    //Sub Org Services END

    //Memebers Services Start.
    self.getUsersList = function (requestUserListObj, reponseCallBack) {
        $.cordys.ajax({
            method: "GetIdentityPersoswithFilters",
            namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
            parameters: requestUserListObj,
            success: function (responseSuccess) {
                reponseCallBack(responseSuccess);
            },
            error: function (responseFailure) {
                reponseCallBack(responseFailure, "ERROR");
                return false;
            }
        });
    };
    self.getMembersList = function (requestMembersListObj, reponseCallBack) {
        $.cordys.ajax({
            method: "GetOrgMemberswithFilters",
            namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
            parameters: requestMembersListObj,
            success: function (responseSuccess) {
                reponseCallBack(responseSuccess);
            },
            error: function (responseFailure) {
                reponseCallBack(responseFailure, "ERROR");
                return false;
            }
        });
    };

    self.createMember = function (requestCreateMember, reponseCallBack) {
        $.cordys.ajax({
            method: "UpdateGCOrganizationMembership",
            namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
            parameters: requestCreateMember,
            success: function (responseSuccess) {
                reponseCallBack(responseSuccess);
            },
            error: function (responseFailure) {
                reponseCallBack(responseFailure, "ERROR");
                return false;
            }
        });
    };

    self.updateMember = function (requestUpdateMember, reponseCallBack) {
        $.cordys.ajax({
            method: "UpdateGCOrganizationMembership",
            namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
            parameters: requestUpdateMember,
            success: function (responseSuccess) {
                reponseCallBack(responseSuccess);
            },
            error: function (responseFailure) {
                reponseCallBack(responseFailure, "ERROR");
                return false;
            }
        });
    };
    
    self.loadMemberDetails = function (requestloadMemberDetails, reponseCallBack) {
        $.cordys.ajax({
            method: "ReadGCOrganizationMembership",
            namespace: "http://schemas.opentext.com/apps/cc/basiccomponents/20.2",
            parameters: requestloadMemberDetails,
            success: function (responseSuccess) {
                reponseCallBack(responseSuccess);
            },
            error: function (responseFailure) {
                reponseCallBack(responseFailure, "ERROR");
                return false;
            }
        });
    };

    self.deleteMember = function (requestDeleteMember, reponseCallBack) {
        $.cordys.ajax({
            method: "DeleteOrganizationMembers",
            namespace: "http://schemas/OpenTextBasicComponents/GCOrganization/operations",
            parameters: requestDeleteMember,
            success: function (responseSuccess) {
                reponseCallBack(responseSuccess);
            },
            error: function (responseFailure) {
                reponseCallBack(responseFailure, "ERROR");
                return false;
            }
        });
    };

    self.getContactTypeList = function (requestContactTypeListObj, reponseCallBack) {
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
    //Memebers Services End.
	
	//Contract Tabs Config Services Start
	self.CTRTabsConfig = function (reponseCallBack) {
        $.cordys.ajax({
            method: "ReadGC",
            namespace: "http://schemas/OpenTextBasicComponents/GC/operations",
            parameters: {},
            success: function (responseSuccess) {
                reponseCallBack(responseSuccess);
            },
            error: function (responseFailure) {
                reponseCallBack(responseFailure, "ERROR");
                return false;
            }
        });
    };
    
    return self;
}());