$.cordys.json.defaults.removeNamespacePrefix = true;
var new_sec_ind = 1000;
var contractTypeID;
var clauserelatedId;
var binding_cancel_counter = 0;
var offsetValue = 0;
var limitValue = 10;
var is_last_page_clicked = 0;
var is_first_page_clicked = 0;
var srcsecorder;
var trgsecorder;
var srcclorder = null;
var srcsecorder_clause
var srcclorder_clause
var clauseselectedarray = [];
var cInstanceId;
var isDirty = false;
var isNewTemplate = false;

var l_current_numberingFormat = _DEFAULT_NUMBERING_FORMAT;
var l_default_numberingFormat = "decimal";
var g_addedSections = 0;
var g_addedClauses = 0;
var g_defaultSection = '';
var g_selectedConditionModel;
function translateOnLoad() {
	if (document.getElementById("Section_name") != null)
		document.getElementById("Section_name").placeholder = getTranslationMessage("Section name");
	if (document.getElementById("myInput") != null)
		document.getElementById("myInput").placeholder = getTranslationMessage("Search by clause name");
	if (document.getElementById("Section_name2") != null)
		document.getElementById("Section_name2").placeholder = getTranslationMessage("Section name");
	if (document.getElementById("id_versionsummary") != null)
		document.getElementById("id_versionsummary").placeholder = getTranslationMessage("Add template change summary");
	if (document.getElementById("TSC_NewSection") != null)
		document.getElementById("TSC_NewSection").title = getTranslationMessage("Add new section");
	if (document.getElementById("TSC_ShowClauseList") != null)
		document.getElementById("TSC_ShowClauseList").title = getTranslationMessage("Show clause list");
	if (document.getElementById("TSC_HideClauseList") != null)
		document.getElementById("TSC_HideClauseList").title = getTranslationMessage("Hide clause list");
	if (document.getElementById("TSC_SaveChanges") != null)
		document.getElementById("TSC_SaveChanges").title = getTranslationMessage("Save changes");
	if (document.getElementById("TSC_CancelChanges") != null)
		document.getElementById("TSC_CancelChanges").title = getTranslationMessage("Cancel changes");
	if (document.getElementById("TSC_CollapseAll") != null)
		document.getElementById("TSC_CollapseAll").title = getTranslationMessage("Collapse all");
	if (document.getElementById("TSC_ExpandAll") != null)
		document.getElementById("TSC_ExpandAll").title = getTranslationMessage("Expand all");
	if (document.getElementById("TSC_MoveUp") != null)
		document.getElementById("TSC_MoveUp").title = getTranslationMessage("Move up");
	if (document.getElementById("TSC_MoveDown") != null)
		document.getElementById("TSC_MoveDown").title = getTranslationMessage("Move down");
	if (document.getElementById("TSC_DeleteSection") != null)
		document.getElementById("TSC_DeleteSection").title = getTranslationMessage("Delete section");
	if (document.getElementById("number_Style") != null)
		document.getElementById("number_Style").title = getTranslationMessage("Number style");
	if (document.getElementById("decrease_Indent") != null)
		document.getElementById("decrease_Indent").title = getTranslationMessage("Decrease indent");
	if (document.getElementById("increase_Indent") != null)
		document.getElementById("increase_Indent").title = getTranslationMessage("Increase indent");
	if (document.getElementById("multilevel_ON") != null)
		document.getElementById("multilevel_ON").title = getTranslationMessage("Multilevel numbering: ON");
	if (document.getElementById("multilevel_OFF") != null)
		document.getElementById("multilevel_OFF").title = getTranslationMessage("Multilevel numbering: OFF");
	if (document.getElementById("add_section1") != null)
		document.getElementById("add_section1").title = getTranslationMessage("Add section");
	if (document.getElementById("add_section2") != null)
		document.getElementById("add_section2").title = getTranslationMessage("Add section");
	if (document.getElementById("show_clause_lib") != null)
		document.getElementById("show_clause_lib").title = getTranslationMessage("Show clause library");
	if (document.getElementById("hide_clause_lib") != null)
		document.getElementById("hide_clause_lib").title = getTranslationMessage("Hide clause library");
	if (document.getElementById("collapse_allsections") != null)
		document.getElementById("collapse_allsections").title = getTranslationMessage("Collapse all sections");
	if (document.getElementById("expand_allsections") != null)
		document.getElementById("expand_allsections").title = getTranslationMessage("Expand all sections");
	if (document.getElementById("SectionList") != null)
		document.getElementById("SectionList").title = getTranslationMessage("Navigate to section");
	if (document.getElementById("collapse_allsections1") != null)
		document.getElementById("collapse_allsections1").title = getTranslationMessage("Collapse all sections");
	if (document.getElementById("expand_allsections1") != null)
		document.getElementById("expand_allsections1").title = getTranslationMessage("Expand all sections");
	/* if (document.getElementById("id_cut_section") != null)
		document.getElementById("id_cut_section").title = getTranslationMessage("Cut section");
	if (document.getElementById("id_move_section_up") != null)
		document.getElementById("id_move_section_up").title = getTranslationMessage("Move section up");
	if (document.getElementById("id_move_section_down") != null)
		document.getElementById("id_move_section_down").title = getTranslationMessage("Move section down");
	if (document.getElementById("id_delete_section") != null)
		document.getElementById("id_delete_section").title = getTranslationMessage("Delete section"); */
	if (document.getElementById("multilevl_arabic") != null)
		document.getElementById("multilevl_arabic").title = getTranslationMessage("Multilevel Arabic numerals");
	if (document.getElementById("multilevl_lower_L") != null)
		document.getElementById("multilevl_lower_L").title = getTranslationMessage("Multilevel Lowercase letters");
	if (document.getElementById("multilevl_upper_L") != null)
		document.getElementById("multilevl_upper_L").title = getTranslationMessage("Multilevel Uppercase letters");
	if (document.getElementById("multilevl_lower_R") != null)
		document.getElementById("multilevl_lower_R").title = getTranslationMessage("Multilevel Lowercase Roman numerals");
	if (document.getElementById("multilevl_upper_R") != null)
		document.getElementById("multilevl_upper_R").title = getTranslationMessage("Multilevel Uppercase Roman numerals");
	translatePage();
}

var VersionInfoModel = function () {
	var self = this;
	this.Version;
	this.VersionSummary = ko.observable();
}
var UpdateClauseModel = function () {
	this.count = ko.observable();
	this.showClauseIds = ko.observable();
	this.clauselist = ko.observableArray();
	this.templateStatus = ko.observable();
}
var updatesModel = new UpdateClauseModel();
updatesModel.showClauseIds(true);


var l_sectionandclause_model = new SectionsAndClausesDataModel();
var l_versioninfo_model = new VersionInfoModel();
l_sectionandclause_model.DeletedClauses.Clauses = {};
l_sectionandclause_model.DeletedClauses.Clauses.Clause = [];
l_sectionandclause_model.DeletedSections.Sections = {};
l_sectionandclause_model.DeletedSections.Sections.Section = [];
$(document).ready(function () {
	REFRESH_CK_EDITOR_INSTANCE = false;
	$('[src*="template_sectionandclauses.htm"]', window.parent.parent.document).parent().css('padding-left', '0px');
	ko.applyBindings(updatesModel, document.getElementById("warnToastContainer"));
	createToastDiv();
	loadSectionsAndClausesData();

	g_selectedConditionModel = new SelectedClauseConditionModel();
	ko.applyBindings(g_selectedConditionModel, document.getElementById("ruleConditionContent"));
	ko.applyBindings(g_selectedConditionModel, document.getElementById("ViewConditionContent"));

	$(document).on('mouseenter', '.clause_Iterator,.secandcls-title, .outline-logo, .outline-title, .outline-party-details, .outline-static, .outline-header, .outline-buyer-details, .outline-seller-details ', function () {
		$(this).find(":button").show();
	}).on('mouseleave', '.clause_Iterator,.secandcls-title, .outline-logo, .outline-title, .outline-party-details, .outline-static, .outline-header, .outline-buyer-details, .outline-seller-details', function () {
		$(this).find(":button").hide();
	});

	$(document).on('click', '#secandcls > ol > li, #secandcls > ul > li', function () {
		$(this).find('ol , ul').slideToggle();
		$(this).prev().toggleClass("right-point").toggleClass("down-point");
	});

	$(document).on('click', '#logoUpload-ok', function () {
		var imgURL = "../../../../../logo/" + $('#logoUpload-input').val();
		$("#contractLogo > img").attr('src', imgURL);
	});

	$('#sectionList').on('change', function (e) {
		if (e.originalEvent !== undefined) {
			selectSection($(this).val());
		}
	});
	attacheventstoCheckBox();
	ko.applyBindings(clause_list_model, document.getElementById("clausediv"));
	ko.applyBindings(clause_list_model, document.getElementById("div_ClausesList"));
});
function attacheventstoCheckBox() {
	$("#ckbCheckAll").click(function () {
		$(".checkBoxClass").prop('checked', $(this).prop('checked'));
	});

}

function loadSectionsAndClausesData() {
	l_sectionandclause_model.DeletedClauses.Clauses = {};
	l_sectionandclause_model.DeletedClauses.Clauses.Clause = [];
	l_sectionandclause_model.DeletedSections.Sections = {};
	l_sectionandclause_model.DeletedSections.Sections.Section = [];
	l_sectionandclause_model.clearcutPasteData();
	templateItemId = getUrlParameterValue(
		"instanceId", null, true);
	/* window.parent.publicAPIProvider.getItemData(templateItemId).then(function(iData){
		
		if(iData.DefaultContainingSection)
		{
			g_defaultSection = iData.DefaultContainingSection.relatedItemId;
		}
	}); */
	window.templateItemId = templateItemId;
	cInstanceId = getId(templateItemId);

	// addToastDiv("Sections and their clauses are saved.");
	if (cInstanceId) {
		l_sectionandclause_model.DeletedClauses.Clauses.Clause = [];
		l_sectionandclause_model.DeletedSections.Sections.Section = [];
		SectionsAndClausesDataModel = $.cordys
			.ajax({
				namespace: "http://schemas/OpenTextContentLibrary/16.5",
				method: "GetTemplateDetails",
				parameters: {
					"TemplateItemId": templateItemId
				},
				success: function (
					data) {
						if (data) {
							if(data.TemplateDetails.Details.GCTemplate.TemplateType == "Internal template"){
								$('#loadingMsg').css('display', 'none');
								$('#CC_Summary').css('display', 'block');
							}
							else if(data.TemplateDetails.Details.GCTemplate.TemplateType == "Internal party document"){
								$('#loadingMsg').css('display', 'none');
								$('#internalPartyDocumentType').css('display', 'block');
							}
							else if(data.TemplateDetails.Details.GCTemplate.TemplateType == "External party document"){
								$('#loadingMsg').css('display', 'none');
								$('#externalPartyDocumentType').css('display', 'block');
							}
								sectionClauseMappings = [];
								l_sectionandclause_model.template_Z_INT_Status = data.TemplateDetails.Details.GCTemplate.Z_INT_Status;
								l_versioninfo_model.Version = data.TemplateDetails.Details.GCTemplate.Version;
								l_versioninfo_model.VersionSummary(getTextValue(data.TemplateDetails.Details.GCTemplate.VersionSummary));
								updatesModel.templateStatus = data.TemplateDetails.Details.GCTemplate.Z_INT_Status;
								check_z_int_status()
								//Contract type id...
								contractTypeID = data.TemplateDetails.Details.GCTemplate.Type["GCType-id"].Id;

								currentState = data.TemplateDetails.Details.GCTemplate.Lifecycle.CurrentState;
								l_sectionandclause_model.template_LifecycleState = currentState;
								resultMappings = data.TemplateDetails.ContainingClauses.ContainingClauses;
								if (resultMappings) {
									if (resultMappings.length == undefined) {
										sectionClauseMappings.push(resultMappings);
									} else {
										sectionClauseMappings.push.apply(sectionClauseMappings, resultMappings);
									}
									if (data.TemplateDetails.Details.GCTemplate.StylingAttributes && !data.TemplateDetails.Details.GCTemplate.StylingAttributes["@nil"] && JSON.parse(data.TemplateDetails.Details.GCTemplate.StylingAttributes)) {
										var styleJson = JSON.parse(data.TemplateDetails.Details.GCTemplate.StylingAttributes);
										l_current_numberingFormat = getNumberingStyle(styleJson.numberingStyle);
										if (styleJson.cascading && _CASCADE_OFF === styleJson.cascading) {
											l_sectionandclause_model.cascadeDocLevel(_CASCADE_OFF);
										} else {
											l_sectionandclause_model.cascadeDocLevel(_CASCADE_ON);
										}
									}
									if (data.TemplateDetails.Details.GCTemplate.DefaultContainingSection) {
										l_sectionandclause_model.newTMPFormat(true);
										g_defaultSection = data.TemplateDetails.Details.GCTemplate.DefaultContainingSection['ContainingSections-id'].ItemId1;
									}
									l_sectionandclause_model.SCMappingsToBind.removeAll();
									if (sectionClauseMappings) {
										document.getElementById("defaultContainer").style.display = "none";
										_populateRootSectionsAndClauses(l_sectionandclause_model.SCMappingsToBind, sectionClauseMappings, data.TemplateDetails.Details.GCTemplate.DefaultContainingSection);
									}

									if (binding_cancel_counter != 1) {
										l_sectionandclause_model.optionsCaption(undefined);
										ko.applyBindings(l_sectionandclause_model, document.getElementById("div_sectionsAndClausesContent"));
										ko.applyBindings(l_sectionandclause_model, document.getElementById("div_sectionsAndClausesHeader"));
										ko.applyBindings(l_versioninfo_model, document.getElementById("change_summary_dialogue_id"));
									}

								} else {
									isNewTemplate = true;
									l_sectionandclause_model.newTMPFormat(true);
									l_sectionandclause_model.SCMappingsToBind.removeAll();
									l_sectionandclause_model.optionsCaption("No sections added");
									document.getElementById("defaultContainer").style.display = "block";
									if (binding_cancel_counter != 1) {
										ko.applyBindings(l_sectionandclause_model, document.getElementById("div_sectionsAndClausesContent"));
										ko.applyBindings(l_sectionandclause_model, document.getElementById("div_sectionsAndClausesHeader"));
										ko.applyBindings(l_versioninfo_model, document.getElementById("change_summary_dialogue_id"));
									}
								}
								if (l_current_numberingFormat) {
									$(".decimal-numbering").removeClass("decimal-numbering").addClass(l_current_numberingFormat + "-numbering");
									$(".decimal-numbering-ol-li").removeClass("decimal-numbering-ol-li").addClass(l_current_numberingFormat + "-numbering-ol-li");
								}
								getSectionsWithLatestClauses(templateItemId);
								setTimeout(function () {
									translateOnLoad();
								}, 0);
							
						}
					}
				});
	}
}




function check_z_int_status() {
	if (l_sectionandclause_model.template_Z_INT_Status != "Draft") {
		$("#divbutton_sec, .showClauseLibrary,.hideClauseLibrary,#save_sectionMappings,#divbutton_cl").css("display", "none");
		$(".droptarget_section").attr("draggable", "false");
	}
}

function dragstartli(event, element) {
	srcsecorder = element.getAttribute('secorder');
	element.style.opacity = "0.4"
	srcclorder = null;
}

// When the draggable p element enters the droptarget_clause, change the DIVS's border style
function dragenterli(event, element) {
	event.preventDefault();
}

// By default, data/elements cannot be dropped in other elements. To allow a
// drop, we must prevent the default handling of the element
function dragoverli(event, element) {
	event.preventDefault();
	event.stopPropagation();
	element.style.border = "3px dotted green";
	element.placeholder = "Drop Here";
}
function dragleaveli(event, element) {
	event.stopPropagation();
	//event.preventDefault();
	element.style.border = "";
	element.placeholder = "none";
	element.style.opacity = "1"
}
function ondropli(event, element) {
	event.preventDefault();
	event.stopPropagation();
	$("#save_sectionMappings, #Cancel").prop("disabled", false);
	trgsecorder = element.getAttribute('secorder');
	if (!srcclorder) {
		section = l_sectionandclause_model.SCMappingsToBind()[srcsecorder];
		l_sectionandclause_model.SCMappingsToBind.splice(srcsecorder, 1);   //droptarget
		l_sectionandclause_model.SCMappingsToBind.splice(trgsecorder, 0, section);

	}
	else {
		clause = l_sectionandclause_model.SCMappingsToBind()[srcsecorder_clause].clauses()[srcclorder];
		l_sectionandclause_model.SCMappingsToBind()[srcsecorder_clause].clauses.splice(srcclorder, 1);
		l_sectionandclause_model.SCMappingsToBind()[trgsecorder].clauses.push(clause);

	}
	$('#Sec_li_' + l_sectionandclause_model.SCMappingsToBind()[srcsecorder].sectionindex).css('margin-bottom', '0px');
	srcsecorder = 0;
	element.style.border = "";
	element.placeholder = "none";
}

//clause draganddrop
function dragstartliclause(event, element) {
	event.stopPropagation();
	srcsecorder_clause = element.getAttribute('secorder');
	srcclorder = element.getAttribute('clorder');
	element.style.opacity = "0.4";
}



// When the draggable p element enters the droptarget_clause, change the DIVS's border style
function dragenterliclause(event, element) {
	event.preventDefault();
	event.stopPropagation();
}

// By default, data/elements cannot be dropped in other elements. To allow a
// drop, we must prevent the default handling of the element
function dragoverliclause(event, element) {
	if (srcclorder != null) {
		event.preventDefault();
		event.stopPropagation();
		element.style.border = "3px dotted green";
		element.placeholder = "Drop Here";
		return true;
	}
	else {
		element.style.border = "";
		element.placeholder = "";
		srcclorder = null;
		return false;
	}

}
function dragleaveliclause(event, element) {
	event.stopPropagation();
	element.style.border = "";
	element.placeholder = "none";
	//srcclorder = null;
}
function ondropliclause(event, element) {
	//event.preventDefault();		
	$("#save_sectionMappings, #Cancel").prop("disabled", false);
	if (srcclorder != null) {
		event.stopPropagation();
		var trgsecorder_clause = element.getAttribute('secorder');
		var trgclorder_clause = element.getAttribute('clorder')
		clause = l_sectionandclause_model.SCMappingsToBind()[srcsecorder_clause].clauses()[srcclorder]
		l_sectionandclause_model.SCMappingsToBind()[srcsecorder_clause].clauses.splice(srcclorder, 1);
		l_sectionandclause_model.SCMappingsToBind()[trgsecorder_clause].clauses.splice(trgclorder_clause, 0, clause);
		srcclorder = null;
		element.style.border = "";
		element.placeholder = "none";
	}


}

// When the draggable p element leaves the droptarget_clause, reset the DIVS's border style

function addSection(pos) {
	document.getElementById("defaultContainer").style.display = "none";
	var newSectionOrder = l_sectionandclause_model.SCMappingsToBind().length;
	var currSelection = sectionList.selectedIndex;
	var l_newSectionId = getNewSectionId();
	var section = {
		type: _SECTION,
		showContainer: 'true',
		cascade: ko.observable(_getCascadeFlagInherit(true, null)),
		inherited: ko.observable(true),
		nonumbering: ko.observable(false),
		numberingStyle: ko.observable(""),
		action: _NEW_SECTION,
		options: ko.observable(false),
		sectionName: ko.observable("Untitled"),
		clauseOrder: new_sec_ind,
		containingSectionID: l_newSectionId,
		isNew: true,
		containerID: l_newSectionId,
		uniqueid: currSelection,
		secorder: "",
		initialContainingSectionID: "",
		container: ko.observableArray([]),
		parentContainerID: ""
	};
	if (!isNaN(pos)) {
		l_sectionandclause_model.SCMappingsToBind.splice(pos, 0, section);
	} else {
		l_sectionandclause_model.SCMappingsToBind.splice(newSectionOrder + 1, 0, section);
	}
	sectionList.selectedIndex = currSelection + 1;
	l_sectionandclause_model.optionsCaption(undefined);
	var index = pos || (pos == 0) ? pos : newSectionOrder + 1
	for (var i = index; i < l_sectionandclause_model.SCMappingsToBind().length; i++) {
		if (!l_sectionandclause_model.SCMappingsToBind()[i].action) {
			l_sectionandclause_model.SCMappingsToBind()[i].action = _UPDATE_ORDER;
		} else if (l_sectionandclause_model.SCMappingsToBind()[i].type === _SECTION && l_sectionandclause_model.SCMappingsToBind()[i].action === _UPDATE_SECTION) {
			l_sectionandclause_model.SCMappingsToBind()[i].action = _UPDATE_SECTION_NAME_ORDER;
		} else if (l_sectionandclause_model.SCMappingsToBind()[i].type === _CLAUSE && l_sectionandclause_model.SCMappingsToBind()[i].action === _UPDATE_LINKED_CLAUSE) {
			l_sectionandclause_model.SCMappingsToBind()[i].action = _UPDATE_LINKED_CLAUSE_ORDER;
		} else if (l_sectionandclause_model.SCMappingsToBind()[i].type === _CLAUSE && l_sectionandclause_model.SCMappingsToBind()[i].action === _UPDATE_NONSTANDARD_CLAUSE) {
			l_sectionandclause_model.SCMappingsToBind()[i].action = _UPDATE_NONSTANDARD_CLAUSE_ORDER;
		} else if (l_sectionandclause_model.SCMappingsToBind()[i].type === _CLAUSE && l_sectionandclause_model.SCMappingsToBind()[i].action === _CONVERT_TO_NONSTANDARD) {
			l_sectionandclause_model.SCMappingsToBind()[i].action = _CONVERT_TO_NONSTANDARD_ORDER;
		}
	}

	$(".droptarget_section").css('border', '');

	if (sectionList.length === sectionList.selectedIndex + 1) {
		$('.droptarget_section').css('margin-bottom', '0px');
		$('#Sec_li_' + new_sec_ind).css('margin-bottom', '150px');
	}

	$('#Sec_li_' + new_sec_ind).css({ 'border-style': 'solid', 'border-color': 'rgba(3, 122, 252, 0.89)' });
	new_sec_ind++;

	isDirty = true;
	selectSection(l_newSectionId, true, true);
	disableSaveandCancel(false);
	disableInsertClauseBtn(false);
	updateNumberingStyleWithParentStyle(section, l_current_numberingFormat);
}


//add new Nested section
function addNestedSection(data, pos) {
	if (data.options) {
		data.options(false);
	}
	var newSectionOrder = data.container().length;
	if (!newSectionOrder) {
		newSectionOrder = 1 + (+newSectionOrder);
	}
	var l_newSectionId = getNewSectionId();
	var currSelection = sectionList.selectedIndex;
	newSectionOrder = l_sectionandclause_model.addSectionParentData().container ?
		l_sectionandclause_model.addSectionParentData().container().indexOf(l_sectionandclause_model.addSectionData())
		: l_sectionandclause_model.addSectionParentData().SCMappingsToBind().indexOf(l_sectionandclause_model.addSectionData());
	var section = {
		type: _SECTION,
		showContainer: 'true',
		options: ko.observable(false),
		cascade: ko.observable(_getCascadeFlagInherit(true, data)),
		inherited: ko.observable(true),
		nonumbering: ko.observable(false),
		numberingStyle: ko.observable(""),
		action: _NEW_SECTION,
		sectionName: ko.observable("Untitled"),
		sectionOrder: newSectionOrder,
		clauseOrder: newSectionOrder,
		sectionindex: new_sec_ind,
		containingSectionID: "",
		isNew: true,
		uniqueid: currSelection,
		containerID: l_newSectionId,
		containingSectionID: l_newSectionId,
		initialContainingSectionID: "",
		container: ko.observableArray([]),
		parentContainerID: data.containerID,
		parentContainer: data
	};
	if (!isNaN(pos)) {
		data.container.splice(pos, 0, section);
	} else {
		data.container.push(section);
	}

	$('#Sec_li_' + new_sec_ind).css({ 'border-style': 'solid', 'border-color': 'rgba(3, 122, 252, 0.89)' });
	new_sec_ind++;

	if (l_sectionandclause_model.addSectionParentData().container) {
		l_sectionandclause_model.addSectionParentData().container().forEach((ele, ind) => {
			if (pos < ind) {
				_updateOrderActionOnSectionOrClause(ele);
			}
		});
	}

	isDirty = true;
	selectSection(l_newSectionId, true, true);
	disableSaveandCancel(false);
	disableInsertClauseBtn(false);
	updateNumberingStyleWithParentStyle(section, l_current_numberingFormat);
}



function onCancel() {
	$("#cancelModal").modal();
	$('button#cancelChanges').off("click");
	$('button#cancelChanges').on('click', function (event) {
		binding_cancel_counter = 1;
		loadSectionsAndClausesData();
		isDirty = false;

	});
}
function getAllAttributes(elem) {
	var attributes = elem.prop("attributes");
	var listOfAttr = "";
	if (elem.length) {
		$.each(attributes, function () {
			listOfAttr = listOfAttr + this.name + " = " + this.value + " ";
		});
	}
	return listOfAttr;
}
function saveSectionClauseMappings() {
	if (!isDirty) {
		$("#no_changes_to_Save").modal();
		return isDirty;
	}
	// Checking required fields.....
	for (var k = 0; k < document.getElementsByClassName('sectionNameInput').length; k++) {
		if (document.getElementsByClassName('sectionNameInput')[k].value == '') { alert(getTranslationMessage("missing section name!!")); return }
	}

	if (l_sectionandclause_model && l_sectionandclause_model.SCMappingsToBind() && l_sectionandclause_model.SCMappingsToBind().length >= 0) {
		l_sectionandclause_model.clearcutPasteData();
		templateItemId = getUrlParameterValue(
			"instanceId", null, true);
		cInstanceId = getId(templateItemId);
		SectionClauseMappings = {};
		SectionClauseMappings.templateid = cInstanceId;
		SectionClauseMappings.templateitemid = templateItemId;
		var Container = [];
		for (var i = 0; i < l_sectionandclause_model.SCMappingsToBind().length; i++) {
			var l_updatedSection = l_sectionandclause_model.SCMappingsToBind()[i];
			if (l_updatedSection) {
				_prepareRequestForUpdateContainer(Container, l_sectionandclause_model.SCMappingsToBind()[i], i);
			}
		}
		_prepareRequestForDeleted(Container);
		SectionClauseMappings.Sections = Container;
		$.cordys.ajax({
			method: "SaveTemplate",
			namespace: "http://schemas.opentext.com/apps/contentlibrary/19.2",
			parameters: {
				"templateItemID": templateItemId,
				"Containers": { "Container": Container },
				"StylingAttributes": JSON.stringify({ "numberingStyle": l_current_numberingFormat, cascading: l_sectionandclause_model.cascadeDocLevel() })
			}
		}).done(function (data) {
			successToast(3000, "Sections and their clauses are saved.");
			binding_cancel_counter = 1;
			loadSectionsAndClausesData();
			isDirty = false;
			$("#successToast").css("top", "42px");
			$("#save_sectionMappings, #Cancel").prop("disabled", true);
		}).fail(function (error) {
			notifyValidation(getTranslationMessage("Error: {0}, while updating the Section & Clause mappings", [error]));
		});

	}
}

function _prepareRequestForDeleted(sectionTempToUpdate) {
	if (l_sectionandclause_model.DeletedClauses.Clauses && l_sectionandclause_model.DeletedClauses.Clauses.Clause) {
		l_sectionandclause_model.DeletedClauses.Clauses.Clause.forEach((secOrClause, index) => {
			secOrClause.action = _DELETE_CONTAINER;
			_prepareRequestForUpdateContainer(sectionTempToUpdate, secOrClause, index, _DELETE_CONTAINER);
		});
	}
	if (l_sectionandclause_model.DeletedSections.Sections && l_sectionandclause_model.DeletedSections.Sections.Section) {
		l_sectionandclause_model.DeletedSections.Sections.Section.forEach((secOrClause, index) => {
			secOrClause.action = _DELETE_CONTAINER;
			_prepareRequestForUpdateContainer(sectionTempToUpdate, secOrClause, index, _DELETE_CONTAINER);
		});
	}
}

function _prepareRequestForUpdateContainer(sectionTempToUpdate, l_updatedSection, order, action) {
	if (action) {
		l_updatedSection.action = action;
	}
	_prepareReqForSecOrClause(sectionTempToUpdate, l_updatedSection, order);
	if (l_updatedSection.container().length > 0) {
		l_updatedSection.container().forEach((clauseOrSectionEle, index) => {
			_prepareRequestForUpdateContainer(sectionTempToUpdate, clauseOrSectionEle, index, action);
		});
	}
}

function _prepareReqForSecOrClause(sectionTempToUpdate, l_updatedSection, order) {
	var clauseOrSection = null;
	if (l_updatedSection && l_updatedSection.type === _CLAUSE) {
		clauseOrSection = _prepareClauseUpdateRequest(l_updatedSection);
	} else {
		clauseOrSection = _prepareSectionUpdateRequest(l_updatedSection);
	}
	if (order !== null && !isNaN(order)) {
		clauseOrSection.Order = order;
	}
	sectionTempToUpdate.push(clauseOrSection);
}

function _prepareClauseUpdateRequest(l_updatedClause) {
	var clauseTempToUpdate = {};
	clauseTempToUpdate.ClauseName = l_updatedClause.clauseName;
	clauseTempToUpdate.StylingAttributes = JSON.stringify({
		cascading: l_updatedClause.inherited() ? _CASCADE_INHERITED : l_updatedClause.cascade(),
		nonumbering: l_updatedClause.nonumbering(),
		numberingstyle: l_updatedClause.numberingStyle()
	});
	clauseTempToUpdate.LinkedSectionID = "";
	clauseTempToUpdate.SectionName = "";
	clauseTempToUpdate.InitialContainingSectionID = "";
	clauseTempToUpdate.InitialContainingClauseID = l_updatedClause.initialContainingClauseID;
	clauseTempToUpdate.Order = l_updatedClause.clauseOrder;
	if (l_updatedClause.containerID != "") {
		clauseTempToUpdate.ContainingClauseID = l_updatedClause.containerID;
		clauseTempToUpdate.ParentContainerID = l_updatedClause.parentContainerID;
	}
	clauseTempToUpdate.LinkedClauseID = l_updatedClause.id;
	clauseTempToUpdate.isMovedToRoot = l_updatedClause.isMovedToRoot;
	clauseTempToUpdate["@action"] = l_updatedClause.action;
	clauseTempToUpdate["@type"] = _CLAUSE;

	if (l_updatedClause.containerConditions) {
		var l_obj = l_updatedClause.containerConditions[0];
		if (l_obj && l_obj.UserAction && (l_obj.UserAction != _DELETE_CONDITION || l_obj.ConditionId)) {
			clauseTempToUpdate.ClauseCondition = {};
			clauseTempToUpdate.ClauseCondition.SourceContainerId = l_updatedClause.containerID;
			clauseTempToUpdate.ClauseCondition.ConditionId = l_obj.ConditionId;
			clauseTempToUpdate.ClauseCondition.ConditionAction = l_obj.ConditionAction;
			clauseTempToUpdate.ClauseCondition.UserAction = l_obj.UserAction;
			clauseTempToUpdate.ClauseCondition.TargetRuleId = l_obj.TargetRuleId;
			clauseTempToUpdate.ClauseCondition.TargetClauseId = l_obj.TargetClauseId;
			clauseTempToUpdate.ClauseCondition.TargetContainingClauseId = l_obj.TargetContainingClauseId;
		}
	}
	return clauseTempToUpdate;
}

function _prepareSectionUpdateRequest(l_updatedSection) {
	sectionTempToUpdate = {};
	sectionTempToUpdate.ContainingClauseID = l_updatedSection.containerID;
	sectionTempToUpdate.ParentContainerID = l_updatedSection.parentContainerID;
	sectionTempToUpdate.LinkedSectionID = l_updatedSection.containingSectionID;
	sectionTempToUpdate.InitialContainingSectionID = l_updatedSection.initialContainingSectionID;
	sectionTempToUpdate.InitialContainingClauseID = "";
	sectionTempToUpdate.Order = l_updatedSection.clauseOrder;
	sectionTempToUpdate.isMovedToRoot = l_updatedSection.isMovedToRoot;
	sectionTempToUpdate.LinkedClauseID = "";
	sectionTempToUpdate.SectionName = l_updatedSection.sectionName();
	sectionTempToUpdate.ClauseName = "";
	sectionTempToUpdate.StylingAttributes = JSON.stringify({
		cascading: l_updatedSection.inherited() ? _CASCADE_INHERITED : l_updatedSection.cascade(),
		nonumbering: l_updatedSection.nonumbering(),
		numberingstyle: l_updatedSection.numberingStyle()
	});
	sectionTempToUpdate["@action"] = l_updatedSection.action;
	sectionTempToUpdate["@type"] = _SECTION;
	return sectionTempToUpdate;
}


var binding_counter = 0;
var ClauseListServiceModel;
var ClauseListModel = function () {
	self = this;
	self.Listed_Clauses = ko.observableArray([]);
	self.currentPage = ko.observable(1);
	self.clauses_selected_count = ko.observable('');
	self.total_clauses_count = ko.observable();
	self.selectedClauseID = ko.observable('');
	self.selectedClauseName = ko.observable('');
	self.ClauseRowClicked = function (iItem, event) {
		$(event.currentTarget.parentElement).find('.cc-radio-on').removeClass("cc-radio-on");
		$(event.currentTarget).find('.cc-select-column').addClass("cc-radio-on");
		if (iItem.id) {
			self.selectedClauseID(iItem.id);
			self.selectedClauseName(iItem.clauseName);
			$("#btn_ClauseSelectionYes").attr("disabled", false);
		}
	}
	self.ClauseRowRadiobuttonClicked = function (iItem, event) {
		$(event.currentTarget.parentElement.parentElement.parentElement).find('.cc-radio-on').removeClass("cc-radio-on");
		$(event.currentTarget).addClass("cc-radio-on");
		if (iItem.id) {
			self.selectedClauseID(iItem.id);
			self.selectedClauseName(iItem.clauseName);
			$("#btn_ClauseSelectionYes").attr("disabled", false);
		}
		event.stopPropagation();
		return true;
	}
}
var clause_list_model = new ClauseListModel();
function addDataToView(iElementList, iModel) {
	iModel.Listed_Clauses.removeAll();
	clause = {};
	clause.typeid = clauserelatedId;
	if (iElementList) {
		if (iElementList.length != undefined) {
			for (var i = 0; i < (iElementList.length); i++) {
				clause = {};
				clause.clauseName = iElementList[i].Name;
				clause.plaincontent = iElementList[i].PlainContent;
				clause.htmlcontent = iElementList[i].HtmlContent;
				clause.id = iElementList[i]["GCClause-id"].Id;
				clause.itemid = iElementList[i]["GCClause-id"].ItemId;
				clause.clauseid = iElementList[i].ClauseId;
				clause.isglobal = iElementList[i].GlobalClause;
				clause.typeid = clauserelatedId;
				clause.clauseCategory = iElementList[i].RelatedClauseCategory["GCClauseCategory-id"].ItemId;
				iModel.Listed_Clauses.push(clause);
			}
		}
		else {
			clause.clauseName = iElementList.Name;
			clause.plaincontent = iElementList.PlainContent;
			clause.htmlcontent = iElementList.HtmlContent;
			clause.id = iElementList["GCClause-id"].Id;
			clause.itemid = iElementList["GCClause-id"].ItemId;
			clause.clauseid = iElementList.ClauseId;
			clause.isglobal = iElementList.GlobalClause;
			clause.typeid = clauserelatedId;
			clause.clauseCategory = iElementList.RelatedClauseCategory["GCClauseCategory-id"].ItemId;
			iModel.Listed_Clauses.push(clause);
		}
		attachevents_to_Clause_Library();  //attaching events to clause library
	}

}

function getClauseCategory(clauseCategoryItemID) {
	$.cordys.ajax({
		method: "ReadGCClauseCategory",
		namespace: "http://schemas/OpenTextContentLibrary/GCClauseCategory/operations",
		parameters:
		{
			'GCClauseCategory-id':
			{
				'ItemId': clauseCategoryItemID
			}
		}
	}).done(function (data) {
		$("#clausecategory_textbox").text(data.GCClauseCategory.Name);
	}).fail(function (error) {

	});
}

function attachevents_to_Clause_Library() {
	var selectedID;
	$('.closebtn').on('click', function () {
		$('#clausePreview').css({ 'width': '0', 'padding-left': '0' });
		$(".list-group-item").css('background-color', '');
	})
	//Attaching  event on click of clause item
	$(".list-group-item").on("click", function () {
		//event = event || window.event;
		var clickedID = this.getAttribute('id');
		getClauseCategory(this.getAttribute('clauseCategory'));
		if (clickedID === selectedID) {
			$('#clausePreview').css({ 'width': '0', 'padding-left': '0' });
			$(".list-group-item").css('background-color', '');
			selectedID = undefined;
		}
		else {
			$('#clausePreview').css({ 'width': '400px', 'padding-left': '8px' });
			$("#clausename_textbox").text(this.getAttribute('clausename'));
			$("#clausecontent_textbox").html(this.getAttribute('clausecontent'));
			$(".list-group-item").css('background-color', '');
			if ($(this).css('background-color') === 'rgb(255, 255, 255)' && $(this).children()[0].checked == false) {
				$(this).css('background-color', 'darkgrey');
			}
			else {
				$(this).css('background-color', '');
			}
			selectedID = clickedID;
		}
	});

	//when a clause item chechbox is checked,changing count of selected clauses
	$('.clause_library').change(function () {
		$('#clausePreview').css({ 'width': '0px', 'padding-left': '0px' });
		$(".list-group-item").css('background-color', '');
		if ($(this).prop("checked") == true) {
			var id = $(this).parent()[0].getAttribute('id');
			clauseselectedarray.push(id);
			clause_list_model.clauses_selected_count(isNaN(parseInt(clause_list_model.clauses_selected_count())) ? 0 : parseInt(clause_list_model.clauses_selected_count()));
			clause_list_model.clauses_selected_count(parseInt(clause_list_model.clauses_selected_count()) + 1);
			// if (sectionList.length > 0) {
			$("#insert_selected_btn").prop("disabled", false);
			// }
		}
		if ($(this).prop("checked") == false) {
			clause_list_model.clauses_selected_count(parseInt(clause_list_model.clauses_selected_count()) - 1);
			var getid = $(this).parent()[0].getAttribute('id');
			var getidindex = clauseselectedarray.indexOf(getid);
			clauseselectedarray.splice(getidindex, 1);
			if (clause_list_model.clauses_selected_count() == 0)
				clause_list_model.clauses_selected_count('');
			if ($(".clause_library:checked").length == 0) {
				$("#insert_selected_btn").prop("disabled", true);
			}
		}
	});
	$('.clause_library').click(function () {
		event.stopPropagation();
	})
}

function ListAllClauses(iBrowseScreen) {
	if(iBrowseScreen)
	{
		clause_list_model.selectedClauseID('');
		clause_list_model.selectedClauseName('');
		ListAllClausesbyParams($('#input_ClauseListSearchFilter').val(),document.getElementById("checkbox_global_dialog").checked,'',true);
	}
	else
	{
		var searchelmnt = $('#myInput').val();
		var isGlobal = document.getElementById("checkbox_global").checked;	
		ListAllClausesbyParams(searchelmnt, isGlobal,'',iBrowseScreen);
	}
}

function ListAllClausesbyParams(iSearchText , bGlobal, iLimit , iBrowseScreen) {
	var searchelmnt = iSearchText;
	var isGlobal = bGlobal;
	var local_contracttype = contractTypeID;
	limitValue = iLimit?iLimit:10;
	if (is_first_page_clicked) {
		offsetValue = 0;
		clause_list_model.currentPage('1');
		is_first_page_clicked = 1;
		$(getIdbyScreen('incrementer',iBrowseScreen)).css('display', 'inline');
		$(getIdbyScreen('decrementer',iBrowseScreen)).css('display', 'none');
		is_first_page_clicked = 0;
	}
	if (is_last_page_clicked) {
		offsetValue = (Math.ceil(clause_list_model.total_clauses_count() / 10) - 1) * 10;
		clause_list_model.currentPage(Math.ceil(clause_list_model.total_clauses_count() / 10));
		is_last_page_clicked = 0;
		$(getIdbyScreen('incrementer',iBrowseScreen)).css('display', 'none');
		$(getIdbyScreen('decrementer',iBrowseScreen)).css('display', 'inline');
		is_last_page_clicked = 0;
	}
	if (isGlobal == true) {
		local_contracttype = "";
	}
	if (searchelmnt && clause_list_model.currentPage() === 1) {
		offsetValue = 0;
	}
	if (clause_list_model.total_clauses_count() <= 10) {
		clause_list_model.currentPage('1');
		$(getIdbyScreen('incrementer',iBrowseScreen)).css('display', 'none');
		$(getIdbyScreen('decrementer',iBrowseScreen)).css('display', 'none');		
	}

	$.cordys.ajax({
		namespace: "http://schemas/OpenTextContentLibrary/GCClause/operations",
		method: "GetClausesbyNameTypeandState",
		parameters: {
			"TypeID": local_contracttype,
			"State": "Active",
			"ClauseName": searchelmnt,
			"GlobalClause": isGlobal ? "true" : "false",
			"Cursor": {
				'@xmlns': 'http://schemas.opentext.com/bps/entity/core',
				'@offset': offsetValue,
				'@limit': limitValue
			}
		},
		success: function (data) {
			if (data.GCClause != undefined) {
				addDataToView(data.GCClause, clause_list_model);
				$(getIdbyScreen('noresults',iBrowseScreen)).css('display', 'none');
				$(getIdbyScreen('paginationID',iBrowseScreen)).css({ 'display': 'block', 'height': '17%' });
				$(getIdbyScreen('clauseListID',iBrowseScreen)).css({ 'display': 'block', 'height': '60%' });
			}
			if (data.GCClause === undefined) {
				clause_list_model.Listed_Clauses.removeAll();
				$(getIdbyScreen('noresults',iBrowseScreen)).css('display', 'block');
				$(getIdbyScreen('paginationID',iBrowseScreen)).css({ 'display': 'none', 'height': '0' });
				$(getIdbyScreen('clauseListID',iBrowseScreen)).css({ 'display': 'none', 'height': '0' });
			}
		}
	});
}
function getIdbyScreen(iId, iBroseScreen)
{
	return ('#'+((iBroseScreen==true)?'browse_'+iId:iId));
}
function addSelectedStandardClauses() {
	document.getElementById("defaultContainer").style.display = "none";
	if (l_sectionandclause_model.addSectionData()) {
		var current_section_index = sectionList.selectedIndex;
		var clauses_length = l_sectionandclause_model.addSectionData().container().length;
		for (var i = 0; i < clauseselectedarray.length; ++i) {
			var l_newContClauseId = getNewContainingClauseId();
			var l_sectionOrClause = l_sectionandclause_model.addSectionData();
			var element = document.getElementById(clauseselectedarray[i]);
			var clause_name = element.getAttribute("clausename");
			if (element.getAttribute("clausecontent") === null) {
				var clause_content = "";
			}
			else {
				var clause_content = element.getAttribute("clausecontent");
			}
			var clause_Id = element.getAttribute("id");
			var clause_ItemId = element.getAttribute("itemid");
			var clauseid = element.getAttribute("clauseid");
			var l_clause = {
				type: _CLAUSE,
				showContainer: 'true',
				hasCondition: ko.observable(false),
				cascade: ko.observable(_getCascadeFlagInherit(true, l_sectionOrClause)),
				inherited: ko.observable(true),
				nonumbering: ko.observable(false),
				numberingStyle: ko.observable(""),
				action: _NEW_LINKED_CLAUSE,
				parentContainerID: l_sectionOrClause.containerID,
				parentContainer: l_sectionOrClause,
				containingClauseID: l_newContClauseId + "",
				containerID: l_newContClauseId,
				initialContainingClauseID: "",
				sectionOrder: clauses_length + "",
				clauseOrder: clauses_length + "",
				clauseID: clauseid + "",
				id: clause_Id + "",
				itemid: clause_ItemId + "",
				clauseName: clause_name + "",
				clauseHTMLContent: clause_content + "",
				isNew: true,
				hasCondition: ko.observable(false),
				containerConditions: [],
				container: ko.observableArray([])
			}
			l_clause.sectionName = ko.computed(function () {
				return l_clause.clauseName;
			}, l_clause);
			updateNumberingStyleWithParentStyle(l_clause, l_current_numberingFormat);
			l_sectionandclause_model.addSectionData().container.splice(clauses_length + 1, 0, l_clause);
			clauses_length++;
		}
	} else {
		var clauses_length = l_sectionandclause_model.SCMappingsToBind().length;
		for (var i = 0; i < clauseselectedarray.length; ++i) {
			var l_newContClauseId = getNewContainingClauseId();
			var element = document.getElementById(clauseselectedarray[i]);
			var clause_name = element.getAttribute("clausename");
			if (element.getAttribute("clausecontent") === null) {
				var clause_content = "";
			}
			else {
				var clause_content = element.getAttribute("clausecontent");
			}
			var clause_Id = element.getAttribute("id");
			var clause_ItemId = element.getAttribute("itemid");
			var clauseid = element.getAttribute("clauseid");
			var l_clause = {
				type: _CLAUSE,
				showContainer: 'true',
				hasCondition: ko.observable(false),
				cascade: ko.observable(_getCascadeFlagInherit(true, l_sectionandclause_model)),
				inherited: ko.observable(true),
				nonumbering: ko.observable(false),
				numberingStyle: ko.observable(""),
				action: _NEW_LINKED_CLAUSE,
				parentContainerID: "",
				containingClauseID: l_newContClauseId + "",
				containerID: l_newContClauseId,
				initialContainingClauseID: "",
				sectionOrder: clauses_length + "",
				clauseOrder: clauses_length + "",
				clauseID: clauseid + "",
				id: clause_Id + "",
				itemid: clause_ItemId + "",
				clauseName: clause_name + "",
				clauseHTMLContent: clause_content + "",
				isNew: true,
				hasCondition: ko.observable(false),
				containerConditions: [],
				container: ko.observableArray([])
			}
			l_clause.sectionName = ko.computed(function () {
				return l_clause.clauseName;
			}, l_clause);
			updateNumberingStyleWithParentStyle(l_clause, l_current_numberingFormat);
			l_sectionandclause_model.SCMappingsToBind.splice(clauses_length + 1, 0, l_clause);
			clauses_length++;
		}
	}
	uncheck_modal();
	delete clauseselectedarray;
	clauseselectedarray = [];
	disableSaveandCancel(false);
	isDirty = true;
	$("#insert_selected_btn").prop("disabled", true);
}


function addSelectedStandardClausesBefore() {
	addSelectedStandardClausesAfterBefore(0);
	toggleOptions('insertStandardClbtnCont', 'open');
}

function addSelectedStandardClausesAfter() {
	addSelectedStandardClausesAfterBefore(1);
	toggleOptions('insertStandardClbtnCont', 'open');
}

function addSelectedStandardClausesAfterBefore(pos) {
	if (l_sectionandclause_model.addSectionData() && l_sectionandclause_model.addSectionParentData()) {
		var index = 0;
		var l_clausesLength = 0;
		for (var claus in clauseselectedarray) {
			l_clausesLength = l_sectionandclause_model.addSectionParentData().container ? l_sectionandclause_model.addSectionParentData().container().indexOf(l_sectionandclause_model.addSectionData()) : l_sectionandclause_model.addSectionParentData().SCMappingsToBind().indexOf(l_sectionandclause_model.addSectionData());
			l_clausesLength = l_clausesLength + index;
			var l_listElement = clauseselectedarray[claus];
			if (l_listElement) {
				var l_clause = _prepareStdClause(l_listElement, l_sectionandclause_model.addSectionParentData(), l_clausesLength);
				updateNumberingStyleWithParentStyle(l_clause, l_current_numberingFormat);
				if (l_sectionandclause_model.addSectionParentData().container) {
					l_sectionandclause_model.addSectionParentData().container.splice(l_clausesLength + pos, 0, l_clause);
				} else {
					l_sectionandclause_model.addSectionParentData().SCMappingsToBind.splice(l_clausesLength + pos, 0, l_clause);
				}
				if (pos > 0) { //After
					index++;
				}
			}
		}

		if (l_sectionandclause_model.addSectionParentData().container) {
			l_sectionandclause_model.addSectionParentData().container().forEach((ele, ind) => {
				if (l_clausesLength + pos < ind) {
					_updateOrderActionOnSectionOrClause(ele);
				}
			});
		} else {
			l_sectionandclause_model.addSectionParentData().SCMappingsToBind().forEach((ele, ind) => {
				if (l_clausesLength + pos < ind) {
					_updateOrderActionOnSectionOrClause(ele);
				}
			});
		}

		uncheck_modal();
		delete clauseselectedarray;
		clauseselectedarray = [];
		disableSaveandCancel(false);
		$("#insert_selected_btn").prop("disabled", true);
		isDirty = true;
	}
}

function _prepareStdClause(l_listElement, l_sectionOrClause, clauses_length) {
	var l_newContClauseId = getNewContainingClauseId();
	var element = document.getElementById(l_listElement);
	var clause_name = element.getAttribute("clausename");
	if (element.getAttribute("clausecontent") === null) {
		var clause_content = "";
	}
	else {
		var clause_content = element.getAttribute("clausecontent");
	}
	var clause_Id = element.getAttribute("id");
	var clause_ItemId = element.getAttribute("itemid");
	var clauseid = element.getAttribute("clauseid");
	var l_clause = {
		type: _CLAUSE,
		showContainer: 'true',
		hasCondition: ko.observable(false),
		action: _NEW_LINKED_CLAUSE,
		cascade: ko.observable(_getCascadeFlagInherit(true, l_sectionOrClause)),
		inherited: ko.observable(true),
		nonumbering: ko.observable(false),
		numberingStyle: ko.observable(""),
		parentContainerID: l_sectionOrClause.containerID ? l_sectionOrClause.containerID : "",
		parentContainer: l_sectionOrClause,
		containingClauseID: l_newContClauseId + "",
		containerID: l_newContClauseId,
		initialContainingClauseID: "",
		sectionOrder: clauses_length + "",
		clauseOrder: clauses_length + "",
		clauseID: clauseid + "",
		id: clause_Id + "",
		itemid: clause_ItemId + "",
		clauseName: clause_name + "",
		clauseHTMLContent: clause_content + "",
		isNew: true,
		container: ko.observableArray([])
	};
	l_clause.sectionName = ko.computed(function () {
		return l_clause.clauseName;
	}, l_clause);
	return l_clause;
}

function uncheck_modal() {
	document.getElementById("myInput").value = "";
	clause_list_model.clauses_selected_count('');
	$(".list-group-item").css('background-color', '');
	var ul = document.getElementById("ul-list-group");
	var items = ul.getElementsByTagName("li");
	for (var i = 0; i < (items.length); i++) {
		if (items[i].children[0].checked == true) {
			items[i].children[0].checked = false;
		}
	}
}

function getClauseRelatedTypeId(ClauseId) {
	$.cordys.ajax({
		method: "ReadGCType",
		namespace: "http://schemas/OpenTextBasicComponents/GCType/operations",
		parameters: {
			"GCType-id":
			{
				"Id": ClauseId
			}
		}
	}).done(function (data) {
		clauserelatedId = data.GCType.Name;
		return clauserelatedId;
	}).fail(function (error) {
		alert(error);
	});

}

//get Clauses Count
function getClausesCount(iBrowseScreen) {
	var isGlobal = document.getElementById("checkbox_global").checked;
	var local_contracttype = contractTypeID;
	var temp_clausename = "";
	if (isGlobal == true) {
		local_contracttype = "";
	}
	var l_searchFieldSelector = (iBrowseScreen==true)?'#input_ClauseListSearchFilter':'#myInput';
	if ($(l_searchFieldSelector).val()) {
		temp_clausename = $(l_searchFieldSelector).val();
	}
	$.cordys.ajax({
		method: "getClauseCount",
		namespace: "http://schemas/OpenTextContentLibrary/18.4",
		parameters: {
			"TypeID": local_contracttype,
			"State": "Active",
			"ClauseName": temp_clausename,
			"GlobalClause": isGlobal ? "true" : "false"
		}
	}).done(function (data) {
		clauseselectedarray = [];
		clause_list_model.clauses_selected_count('');
		clause_list_model.total_clauses_count(data.Count.text);
		ListAllClauses(iBrowseScreen);
	}).fail(function (error) {

	});
}



function clearSearchFilter() {
	document.getElementById("myInput").value = "";
}

function showClauseLibrary() {
	getClauseRelatedTypeId(contractTypeID);
	$(".showClauseLibrary").css("display", "none");
	$(".hideClauseLibrary").css("display", "inline-block");
	$("#clausediv").css("display", "block");
	$("#div_sectionsAndClausesContent").addClass("col-md-8 col-xs-8 rtl-float-right");
	attachEvents();
	
	/* getClausesCount();
	if (clause_list_model.currentPage() == 1) {
		document.getElementById("decrementer").style.display = "none";
	} */
	decrementToLast();

}

function hideClauseLibrary() {
	$("#clausediv, .hideClauseLibrary").css("display", "none");
	$(".showClauseLibrary").css("display", "inline-block");
	$("#div_sectionsAndClausesContent").removeClass("col-md-8 col-xs-8 rtl-float-right");
	clause_list_model.clauses_selected_count('');
	$('#clausePreview').css({ 'width': '0', 'padding-left': '0' });
	$(".list-group-item").css('background-color', '');
}

function attachEvents() {
	$('#input_img').click(function () {
		clause_list_model.currentPage('1');
		offsetValue = 0;
		$('#decrementer').css('display', 'none');
		$('#incrementer').css('display', 'inline');
		getClausesCount();
	});
	$('#myInput').keypress(function (e) {
		var key = e.which;
		if (key == 13)  // the enter key code
		{
			clause_list_model.currentPage('1');
			offsetValue = 0;
			$('#decrementer').css('display', 'none');
			$('#incrementer').css('display', 'inline');
			getClausesCount();
			return false;
		}
	});
	$('#checkbox_global').change(function () {
		offsetValue = 0;
		clauseselectedarray = [];
		clause_list_model.clauses_selected_count('');
		clause_list_model.currentPage('1');
		$('#decrementer').css('display', 'none');
		$('#incrementer').css('display', 'inline');
		getClausesCount();
	});
}
function incrementOffsetLimit(iBrowseScreen,iModel, iEvent) {
	clause_list_model.clauses_selected_count('');
	clauseselectedarray = [];
	if (clause_list_model.currentPage() < Math.ceil(clause_list_model.total_clauses_count() / 10)) {
		offsetValue = offsetValue + 10;
		clause_list_model.currentPage(isNaN(parseInt(clause_list_model.currentPage())) ? 0 : parseInt(clause_list_model.currentPage()));
		clause_list_model.currentPage(parseInt(clause_list_model.currentPage()) + 1);
	}
	if (clause_list_model.currentPage() == Math.ceil(clause_list_model.total_clauses_count() / 10)) {		
		$(getIdbyScreen('incrementer',iBrowseScreen)).css('display', 'none');		
	}
	if (clause_list_model.currentPage() > 1) {
		$(getIdbyScreen('decrementer',iBrowseScreen)).css('display', 'inline');
	}
	ListAllClauses(iBrowseScreen==true);
}
function decrementOffsetLimit(iBrowseScreen,iModel, iEvent) {
	clause_list_model.clauses_selected_count('');
	clauseselectedarray = [];
	if (clause_list_model.currentPage() > 1) {
		offsetValue = offsetValue - 10;
		clause_list_model.currentPage(parseInt(clause_list_model.currentPage()) - 1);
	}
	if (clause_list_model.currentPage() < Math.ceil(clause_list_model.total_clauses_count() / 10)) {
		$(getIdbyScreen('incrementer',iBrowseScreen)).css('display', 'inline');
	}
	if (clause_list_model.currentPage() == 1) {
		$(getIdbyScreen('decrementer',iBrowseScreen)).css('display', 'none');
	}
	if (clause_list_model.currentPage() < 1)
		return;
	ListAllClauses(iBrowseScreen==true);
}
function incrementToLast(iBrowseScreen,iModel, iEvent) {
	clause_list_model.clauses_selected_count('');
	clauseselectedarray = [];
	is_last_page_clicked = 1;
	getClausesCount(iBrowseScreen==true);
}
function decrementToLast(iBrowseScreen,iModel, iEvent) {
	clause_list_model.clauses_selected_count('');
	clauseselectedarray = [];
	is_first_page_clicked = 1;
	getClausesCount(iBrowseScreen==true)
}
function enableSaveandCancel() {
	$("#save_sectionMappings, #Cancel").prop("disabled", false);
}

function warnSectionsWithLatestClauses(data) {
	$('#warnToastContainer').css("display", "block");
	var warnHead = 'Current template has new updates.';
	var clauseIDs = '';
	var count = 0;
	if (data && data.versionDetails) {
		if (data.versionDetails.length) {
			data.versionDetails.forEach(function (iElement) {
				showWarningToDiv('#active_warn_' + iElement.containerID);
				updatesModel.clauselist.push(iElement.LatestClause);
				count++;
			});
		} else {
			showWarningToDiv('#active_warn_' + data.versionDetails.containerID);
			updatesModel.clauselist.push(data.versionDetails.LatestClause);
			count++;
		}
	}
	updatesModel.count(count);
	if (count > 0) {
		document.getElementById("updateMessage").textContent = getTranslationMessage("This template has {0} updates.", count);
	}
	if (count > 5) {
		updatesModel.showClauseIds(false);
	}
}
function showWarningToDiv(ID) {
	$(ID).css('display', 'inline');
}

function getSectionsWithLatestClauses(templateID) {
	if (templateID) {
		var request = '<TemplateItemID>' + templateID + '</TemplateItemID>';
		SectionsAndClausesDataModel = $.cordys
			.ajax({
				namespace: "http://schemas.opentext.com/apps/contentlibrary/19.2",
				method: "GetAllOtherActiveClauseVerions",
				parameters: request,
				success: function (
					data) {
					if (data) {
						if (updatesModel) {
							updatesModel.count(0);
							updatesModel.clauselist.removeAll();
						}
						warnSectionsWithLatestClauses(data);
					}
				}
			});
	}

}

function toggleWarnToastContent() {
	var toastContentObj = document.getElementById("warnToastContent");
	var arrowBtnObj = document.getElementById("arrowBtn");
	if (toastContentObj.style.display === "none") {
		toastContentObj.style.display = "block";
		arrowBtnObj.className = "up";
	} else {
		toastContentObj.style.display = "none";
		arrowBtnObj.className = "down";
	}
}

function toggleOptions(elementId, className) {
	elementId = "#" + elementId;
	if ($(elementId).hasClass(className)) {
		$(elementId).removeClass(className);
	}
	else {
		$(elementId).addClass(className);
	}
}
function closeWarnToast() {
	$('#warnToastContainer').remove();
}

function expandAllSections() {
	$(".expandAllSections").hide();
	$(".collapseAllSections").show();
	$(".expandAllSections").attr("style", "display:none");
	$(".panel-collapse").addClass("in");
	$(".accordion-toggle").removeClass("collapsed");
}

function collapseAllSections() {
	$(".collapseAllSections").hide();
	$(".expandAllSections").show();
	$(".expandAllSections").attr("style", "display:inline-block");
	$(".panel-collapse").removeClass("in");
	$(".accordion-toggle").addClass("collapsed");

}

function openChangeSummaryModel(iEventObject) {
	$("#change_summary_dialogue_id").modal();
}

function changeSummaryFormrModelOpenIfRequired() {
	if (l_versioninfo_model && (l_versioninfo_model.Version == '1.0' || l_versioninfo_model.Version == '' || getTextValue(l_versioninfo_model.VersionSummary()))) {
		saveSectionClauseMappings();
	} else {
		openChangeSummaryModel();
	}
}

function saveChangeSummaryAndClauseMappings() {
	updateTemplate();
	saveSectionClauseMappings();
}

function updateTemplate() {
	if (l_versioninfo_model && getTextValue(l_versioninfo_model.VersionSummary())) {
		$.cordys.ajax(
			{
				method: "UpdateGCTemplate",
				namespace: "http://schemas/OpenTextContentLibrary/GCTemplate/operations",
				parameters:
				{
					"GCTemplate-id": { "Id": cInstanceId },
					"GCTemplate-update": { "VersionSummary": getTextValue(l_versioninfo_model.VersionSummary()) }
				},
			}).done(function (data) {
			}).fail(function (error) {
			})
	}
}



function togglePanel(panelNumber) {
	if ($('#Accordian_' + panelNumber).hasClass('collapsed')) {
		$('#Panel_' + panelNumber).addClass("in");
		$('#Accordian_' + panelNumber).removeClass("collapsed");
	}
	else {
		$('#Panel_' + panelNumber).removeClass("in");
		$('#Accordian_' + panelNumber).addClass("collapsed");
	}
}

//=================================================================================================================

function openClauseList() {
	var l_val = document.getElementById("actionSelect").value;
	if (l_val == 'HIDE') {
		return;
	}
	showClauseSelectionDialog();
}

function onActionSelectionChanged()
{
	var l_val = document.getElementById("actionSelect").value;
	if(l_val == 'HIDE')
	{
		g_selectedConditionModel.TargetClauseId('');
		g_selectedConditionModel.TargetClauseName('');
	}
	modifyRuleSummary();
	enableDisableTargetClauseSelection(l_val);
}
function enableDisableTargetClauseSelection(iValue)
{
	$("#target_clause").prop("disabled",(iValue != 'REPLACE'));
	$("#target_clause").next().css('cursor',((iValue != 'REPLACE')? "not-allowed":"pointer"));
	$("#target_clause").parent().css("opacity",((iValue != 'REPLACE')? "0.5": "1"));
	
}
function ViewConditionForRead(sectionOrClause, sectionIndex, parent, event) {
	
	if(sectionOrClause.containerConditions && sectionOrClause.containerConditions[0])
	{
		l_selectedConditionObj = sectionOrClause.containerConditions[0];
		g_selectedConditionModel.applyValuesToSelectedCondition(sectionOrClause.containerConditions[0]);
		g_selectedConditionModel.availableActions().forEach(function(iObj){
			if(iObj.value==g_selectedConditionModel.ConditionAction())
			{
				g_selectedConditionModel.ActionLabel(getTranslationMessage(iObj.label));
				return;
			}
		});
		loadRuleLogicSummary();
		$("#viewConditionModal").modal();
	}
}
var l_selectedConditionObj = {};
function applyOrViewCondition(sectionOrClause, sectionIndex, parent, event) {
	if(!g_defaultSection && (!isNewTemplate))
	{
		alert("save template before applying condition");
	}
	
	if(sectionOrClause.containerConditions && sectionOrClause.containerConditions[0])
	{
		l_selectedConditionObj = sectionOrClause.containerConditions[0];
		g_selectedConditionModel.applyValuesToSelectedCondition(sectionOrClause.containerConditions[0]);
		loadRuleLogicSummary();
	}
	else
	{
		l_selectedConditionObj = {};
		l_selectedConditionObj.SourceContainingClause = sectionOrClause.containingClauseID;
		l_selectedConditionObj.ParentContainingClause = '';
		l_selectedConditionObj.ConditionAction = '';
		l_selectedConditionObj.ConditionId = '';
		l_selectedConditionObj.TargetContainingClauseId = '';
		l_selectedConditionObj.TargetClauseName= '';
		l_selectedConditionObj.TargetClauseId= '';
		l_selectedConditionObj.TargetRuleName = '';
		l_selectedConditionObj.TargetRuleId = '';			
		l_selectedConditionObj.TargetRuleSummary = '';
		sectionOrClause.containerConditions.push(l_selectedConditionObj);
		g_selectedConditionModel.applyValuesToSelectedCondition(l_selectedConditionObj);				
	}
	if(!l_selectedConditionObj.setClauseHasCondition)
	{
		l_selectedConditionObj.setClauseHasCondition=function()
		{
			sectionOrClause.hasCondition(true);
		}
	}
	if(window.ApplyFilterOnRulesList)
	{
		window.ApplyFilterOnRulesList();
	}
	enableDisableTargetClauseSelection(g_selectedConditionModel.ConditionAction());
	hideClauseLibrary();
	$("#applyconditionModal").modal();
}

function loadRuleLogicSummary()
{
	if(g_selectedConditionModel.TargetRuleId() && (!g_selectedConditionModel.TargetRuleSummary()))
	{
		loadRuleSummary(g_selectedConditionModel.TargetRuleId());			
	}
}

function DeleteAppliedCondition(sectionOrClause, sectionIndex, parent, event) {
	if(sectionOrClause.containerConditions && sectionOrClause.containerConditions[0])
	{
		var l_obj = sectionOrClause.containerConditions[0];
		l_obj.ConditionAction = '';
		l_obj.TargetClauseName= '';
		l_obj.TargetClauseId= '';
		l_obj.TargetRuleName = '';
		l_obj.TargetRuleId = '';			
		l_obj.TargetRuleSummary = '';
		l_obj.UserAction = _DELETE_CONDITION;		
		sectionOrClause.hasCondition(false);
		isDirty = true;
	}
}

window.isRuleModalUsed = true;

var SelectedClauseConditionModel = function () {

    var self = this;
    self.SourceContainingClause = ko.observable('');
	self.ParentContainingClause = ko.observable('');
    self.ConditionAction = ko.observable('');
	self.ConditionId = ko.observable('');
	self.TargetContainingClauseId = ko.observable('');
	self.TargetClauseName= ko.observable('');
	self.TargetClauseId= ko.observable('');
	self.TargetRuleName = ko.observable('');
	self.TargetRuleId = ko.observable('');
	self.TargetRuleSummary = ko.observable('');
	self.ActionLabel = ko.observable('');
	
	self.applyValuesToSelectedCondition=function(iCondObject)
	{
		self.SourceContainingClause(iCondObject.SourceContainingClause);
		self.ParentContainingClause(iCondObject.ParentContainingClause);
		self.ConditionAction(iCondObject.ConditionAction);
		self.ConditionId(iCondObject.ConditionId);
		self.TargetContainingClauseId(iCondObject.TargetContainingClauseId);
		self.TargetClauseId(iCondObject.TargetClauseId);
		self.TargetClauseName(iCondObject.TargetClauseName);
		self.TargetRuleName(iCondObject.TargetRuleName);
		self.TargetRuleId(iCondObject.TargetRuleId);		
		self.TargetRuleSummary(iCondObject.TargetRuleSummary);		
	}
	
	window.setSelectedRuleId = function(iId,iRuleName, iRuleSummary)
	{
		self.selectedRuleId = iId;
		self.selectedRuleName = iRuleName;
		self.selectedRuleSummary = iRuleSummary;		
	}
	window.onRuleDeletedFromList = function(iId)
	{
		if(self.selectedRuleId == iId)
		{
			self.selectedRuleId = '';
			self.selectedRuleName = '';
			self.selectedRuleSummary = '';	
		}
	}
	window.updateRuleSummary = function(iRuleSummary)
	{
		self.TargetRuleSummary(iRuleSummary);
	}
	
	self.onActionSelectionChanged = onActionSelectionChanged; 
	self.availableActions = ko.observableArray([
		 { label: 'Hide', value: 'HIDE' },
		 { label: 'Replace', value: 'REPLACE' }]);
}
function closeApplyConditionDialog()
{		
	
	l_selectedConditionObj.setClauseHasCondition.call();		
	l_selectedConditionObj.ParentContainingClause = g_selectedConditionModel.ParentContainingClause();
	l_selectedConditionObj.ConditionAction = g_selectedConditionModel.ConditionAction();
	l_selectedConditionObj.ConditionId = g_selectedConditionModel.ConditionId();
	l_selectedConditionObj.TargetContainingClauseId = g_selectedConditionModel.TargetContainingClauseId();
	l_selectedConditionObj.TargetClauseName= g_selectedConditionModel.TargetClauseName();
	l_selectedConditionObj.TargetClauseId= g_selectedConditionModel.TargetClauseId();
	l_selectedConditionObj.TargetRuleName = g_selectedConditionModel.TargetRuleName();
	l_selectedConditionObj.TargetRuleId = g_selectedConditionModel.TargetRuleId();			
	l_selectedConditionObj.TargetRuleSummary = g_selectedConditionModel.TargetRuleSummary();		
	
	$("#applyconditionModal").modal('hide');
}
function onApplyConditionOK()
{
	var l_validateFlag = ValidateApplyConditionValues();
	if(!l_validateFlag)
	{
		return;
	}
	if(g_selectedConditionModel.ConditionId())
	{
		l_selectedConditionObj.UserAction = _UPDATED_CONDITION;
	}
	else
	{
		l_selectedConditionObj.UserAction = _NEW_CONDITION;
	}
	isDirty = true;
	closeApplyConditionDialog();
}

function ValidateApplyConditionValues()
{
	if((!g_selectedConditionModel.ConditionAction()) || (!g_selectedConditionModel.TargetRuleId()))
	{
		displayValidationError(getTranslationMessage("Mandatory fields cannot be empty."),"div_formErrorInfoArea");
		return false;
	}
	if((g_selectedConditionModel.ConditionAction()!='HIDE')&& (!g_selectedConditionModel.TargetClauseId()))
	{
		displayValidationError(getTranslationMessage("Mandatory fields cannot be empty."),"div_formErrorInfoArea");
		return false;
	}
	return true;
}

function displayValidationError(iValidationErrorMsg, iElementId)
{
	showOrHideErrorInfo(iElementId, true, iValidationErrorMsg, 5000);
}

//=================================================================================================

function onRuleSelectionOK()
{
	if(g_selectedConditionModel.selectedRuleId)
	{	
		g_selectedConditionModel.TargetRuleId(g_selectedConditionModel.selectedRuleId);
		g_selectedConditionModel.TargetRuleName(g_selectedConditionModel.selectedRuleName);
		g_selectedConditionModel.TargetRuleSummary(g_selectedConditionModel.selectedRuleSummary);
		loadRuleLogicSummary();
		closeRuleSelectionDialog();
	}
	else
	{
		displayValidationError(getTranslationMessage("Select a rule from the list."),"cc-rule-error-info-area");
	}
}

function closeRuleSelectionDialog(data, event) {
	$("#RuleSelection").modal('hide');
	g_selectedConditionModel.selectedRuleId = '';
	g_selectedConditionModel.selectedRuleName = '';
	g_selectedConditionModel.selectedRuleSummary = '';
}

function openRuleSelectionDialog(data, event) {
	g_selectedConditionModel.selectedRuleId = '';
	g_selectedConditionModel.selectedRuleName = '';
	g_selectedConditionModel.selectedRuleSummary = '';
	$("#RuleSelection").modal();
}

//=================================================================================================

function closeClauseSelection (data, event) {
	HideClauseSelectionDialog();
}

function onClauseSelected()
{
	if(!clause_list_model.selectedClauseID())
	{
		displayValidationError(getTranslationMessage("Select a clause from the list."),"cc-clause-error-info-area");
		return;
	}
	g_selectedConditionModel.TargetClauseId(clause_list_model.selectedClauseID());
	g_selectedConditionModel.TargetClauseName(clause_list_model.selectedClauseName());
	modifyRuleSummary();
	HideClauseSelectionDialog();
}

function HideClauseSelectionDialog()
{
	$("#div_selectClause").modal('hide');
	clause_list_model.selectedClauseID('');
	clause_list_model.selectedClauseName('');
	$('#ClausesListTable').find('.cc-radio-on').removeClass("cc-radio-on");	
}

function showClauseSelectionDialog(){
	//Clear the existing filter.
	if($('#input_ClauseListSearchFilter')){
		$('#input_ClauseListSearchFilter').val('');
	}
	ListAllClausesForDialog();
	$("#div_selectClause").modal();
}
function ListAllClausesForDialog(){
	is_first_page_clicked = 1;
	getClausesCount(true);	
}
//=====================================================================================================


function loadRuleSummary(iRuleId) {
    $.cordys.ajax({
        namespace: "http://schemas.opentext.com/apps/cc/configworkflow/20.2",
        method: "GetRuleInstanceData",
        parameters:
        {
            "ruleInstanceID": iRuleId
        },
        success: function (data) {
            if (data.ruleInstanceData) {
                generateRuleSummaryFromData(data.ruleInstanceData);				
            }
        },
        error: function (responseFailure) {
            showOrHideErrorInfo("div_modalErrorInfoArea", true, getTranslationMessage("An error occurred while loading the rule details. Contact your administrator."), 10000);
            return false;
        }
    });
}

function generateRuleSummaryFromData(iRuleDetails)
{
	var l_ruleObj = {};
	var l_ruleData = iRuleDetails.ruleBasicDetails.FindZ_INT_AllRulesListResponse.Rule;
    
    l_ruleObj.ruleLogic = l_ruleData.Logic;
    l_ruleObj.lastSavedRuleLogic = l_ruleData.Logic;
	l_ruleObj.ruleConditions = []; 
	
	var l_ruleConditionOperandList = [];
    if (iRuleDetails.ruleLeftOperands) {
        var l_ruleLeftOperands = iRuleDetails.ruleLeftOperands.RuleConditionOperand;
        if (l_ruleLeftOperands) {
            if (l_ruleLeftOperands.length) {
                for (var i = 0; i < l_ruleLeftOperands.length; i++) {
                    var ruleLeftOperand = formRuleLeftOperandDetails(l_ruleLeftOperands[i]);
                    if (ruleLeftOperand) {
                        l_ruleConditionOperandList[ruleLeftOperand.ID] = ruleLeftOperand;
                    }
                }
            }
            else {
                var ruleLeftOperand = formRuleLeftOperandDetails(l_ruleLeftOperands);
                if (ruleLeftOperand) {
                    l_ruleConditionOperandList[ruleLeftOperand.ID] = ruleLeftOperand;
                }
            }
        }
    }
    
    if (iRuleDetails.ruleConditions) {
		var l_ruleConditions = iRuleDetails.ruleConditions.RuleConditions;
		if(l_ruleConditions && l_ruleConditions.length)
		{
			for (var i = 0; i < l_ruleConditions.length; i++) 
			{
				l_ruleObj.ruleConditions.push(getRuleConditionObject(l_ruleConditions[i],l_ruleConditionOperandList));
			}
		}
		else if(l_ruleConditions)
		{
			l_ruleObj.ruleConditions.push(getRuleConditionObject(l_ruleConditions,l_ruleConditionOperandList));
		}       
    }
	buildRuleSummary(l_ruleObj);
}

function formRuleLeftOperandDetails(iElement) {
    if (iElement) {
        var ruleConditionOperand={};
        ruleConditionOperand.ID = iElement['RuleConditionOperand-id'].Id;
        ruleConditionOperand.Name = getTextValue(iElement.Name);
        ruleConditionOperand.DisplayName = getTextValue(iElement.DisplayName);        
        return ruleConditionOperand;
    }
}

function getRuleConditionObject(iConditionDetails, iRuleConditionOperandList)
{
	var l_ruleCondition={};
	if (iConditionDetails.LeftOperandType != "CUSTOM") 
	{		
		l_ruleCondition.ruleConditionLeftOperandName = iRuleConditionOperandList[iConditionDetails.RuleLeftOperand["RuleConditionOperand-id"].Id].DisplayName;
	} 
	else 
	{		
		l_ruleCondition.ruleConditionLeftOperandName = iConditionDetails.CustomAttrName;		
	}

	l_ruleCondition.ruleConditionSelectedOperator = iConditionDetails.Operator;
	l_ruleCondition.ruleConditionValue= iConditionDetails.Value;	
	return l_ruleCondition;
}

function buildRuleSummary(iRuleObj) {
	var l_ruleLogicSplits = iRuleObj.ruleLogic.match(new RegExp("[(]|[0-9]|(and)|(or)|[)]", "ig"));
    var l_ruleLogicSummaryExpression = "<p style='display:inline'>" + getTranslationMessage("IF");
    for (var i = 0; i < l_ruleLogicSplits.length; i++) {
        var e = l_ruleLogicSplits[i];
        if (e.toUpperCase() !== "OR" && e.toUpperCase() !== "AND" && e !== ")" && e !== "(") {
            var l_ruleCondition = iRuleObj.ruleConditions[+e - 1];
            if (l_ruleCondition) {
                if (l_ruleCondition.ruleConditionSelectedOperator == "EMPTY" || l_ruleCondition.ruleConditionSelectedOperator == "NOTEMPTY") {
                    var expr = "<ruleConditionBold>\"" + l_ruleCondition.ruleConditionLeftOperandName + "\"</ruleConditionBold>  " + getOperatorText(l_ruleCondition.ruleConditionSelectedOperator);
                } else {
                    var expr = "<ruleConditionBold>\"" + l_ruleCondition.ruleConditionLeftOperandName + "\"</ruleConditionBold>  " + getOperatorText(l_ruleCondition.ruleConditionSelectedOperator) + "  <ruleConditionBold>\"" + l_ruleCondition.ruleConditionValue + "\"</ruleConditionBold>";
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
	if(g_selectedConditionModel.ConditionAction()=='HIDE')
	{	
		l_ruleLogicSummaryExpression = l_ruleLogicSummaryExpression + "\n " + getTranslationMessage("THEN") + " \n </p><span>" + getTranslationMessage("Hide this clause")+ "</span>";
	}
	else
	{
		l_ruleLogicSummaryExpression = l_ruleLogicSummaryExpression + "\n " + getTranslationMessage("THEN") + " \n </p><span>" + getTranslationMessage("Replace with") + "  " + "<ruleConditionBold>\"" + g_selectedConditionModel.TargetClauseName() + "\"</ruleConditionBold></span>";
	}
    g_selectedConditionModel.TargetRuleSummary(l_ruleLogicSummaryExpression);
}
function modifyRuleSummary()
{
	if(!g_selectedConditionModel.TargetRuleSummary())
	{
		return;
	}
	var l_ruleLogicSummaryExpression = g_selectedConditionModel.TargetRuleSummary()
	if((l_ruleLogicSummaryExpression.lastIndexOf("<span>"))>0)
	{
		l_ruleLogicSummaryExpression = l_ruleLogicSummaryExpression.substring(0,l_ruleLogicSummaryExpression.lastIndexOf("<span>"));
	}
	if(g_selectedConditionModel.ConditionAction()=='HIDE')
	{	
		l_ruleLogicSummaryExpression = l_ruleLogicSummaryExpression + "<span>" + getTranslationMessage("Hide this clause")+ "</span>";
	}
	else
	{
		l_ruleLogicSummaryExpression = l_ruleLogicSummaryExpression + "<span>" + getTranslationMessage("Replace with") + "  " + "<ruleConditionBold>\"" + g_selectedConditionModel.TargetClauseName() + "\"</ruleConditionBold></span>";
	}
    g_selectedConditionModel.TargetRuleSummary(l_ruleLogicSummaryExpression);
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