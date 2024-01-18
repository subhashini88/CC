$.cordys.json.defaults.removeNamespacePrefix = true;
var cInstanceId;
var versionUniqueId;
var ClauseId = "";
var selectId = "";
var tokenObject = {};
var metadatatokenObject = {};
var custAttrtokenObject = {};
var updateParametersObject = {};
var updateClauseContentObject = {};
var resetParametersObject = {};
var state = "Active";
var savedRange;
var isSaveClicked = false;
var offsetValue = 0;
var limitValue = 5;
var is_last_page_clicked = 0;
var is_first_page_clicked = 0;
var rangetoInsert;
var editor;

var ClauseInstanceDataModel = function () {
	var self = this;
	self.ClauseId = ko.observable();
	self.ClauseName = ko.observable();
	self.ClauseType = ko.observable();
	self.ClauseState = ko.observable();
	self.ClauseDescription = ko.observable();
	self.ClauseComments = ko.observable();
	self.ClauseContent = ko.observable();
	self.HtmlClauseContent = ko.observable();
	self.RelatedTypeId = ko.observable();
	self.RelatedClauseCategoryId = ko.observable();
	self.ActiveTypes = ko.observableArray([]);
	self.AllClauseCategories = ko.observableArray([]);
	self.Version = ko.observable();
	self.ClauseIdentifier = ko.observable();
	self.VersionSummary = ko.observable();
}
var TermsListModel = function () {
	var self = this;
	self.TermsList = ko.observableArray([]);
	self.currentPage = ko.observable(1);
	self.total_terms_count = ko.observable('');
	self.onCheckboxValueChanged = function (iItem, event) {
		var l_checked = event.currentTarget.checked;
		if (l_checked) {
			tokenObject[iItem["GCTerm-id"].Id] = iItem.TermToken;
		}
		else {
			tokenObject[iItem["GCTerm-id"].Id] = null;
		}
	}
	self.onCheckAllValueChanged = function (iItem, event) {
		var l_checked = event.currentTarget.checked;
		if (l_checked) {
			iItem.TermsList().forEach(function (iToken) {
				tokenObject[iToken["GCTerm-id"].Id] = iToken.TermToken;
			});
		}
		else {
			tokenObject = {};
		}
	}
}
var TermReferencesListModel = function () {
	var self = this;
	self.TermReferencesList = ko.observableArray([]);
}

var ContractMetadataListModel = function () {
	var self = this;
	self.ContractMetadataList = ko.observableArray([]);
	self.onCheckboxMetadataValueChanged = function (iItem, event) {
		var l_checked = event.currentTarget.checked;
		if (l_checked) {
			metadatatokenObject[iItem.MetadataName] = iItem.MetadataToken;
		}
		else {
			metadatatokenObject[iItem.MetadataName] = null;
		}
	}
	self.onCheckAllMetadataValueChanged = function (iItem, event) {
		var l_checked = event.currentTarget.checked;
		if (l_checked) {
			iItem.ContractMetadataList().forEach(function (iToken) {
				metadatatokenObject[iToken.MetadataName] = iToken.MetadataToken;
			});
		}
		else {
			metadatatokenObject = {};
		}
	}
}

var ContractCustAttrListModel = function () {
	var self = this;
	self.CustomAttributesList = ko.observableArray([]);
	self.onCheckboxCusAttrValueChanged = function (iItem, event) {
		var l_checked = event.currentTarget.checked;
		if (l_checked) {
			custAttrtokenObject[iItem.CusAttrName] = iItem.CusAttrToken;
		}
		else {
			custAttrtokenObject[iItem.CusAttrName] = null;
		}
	}
	self.onCheckAllCusAttrValueChanged = function (iItem, event) {
		var l_checked = event.currentTarget.checked;
		if (l_checked) {
			iItem.CustomAttributesList().forEach(function (iToken) {
				custAttrtokenObject[iToken.CusAttrName] = iToken.CusAttrToken;
			});
		}
		else {
			custAttrtokenObject = {};
		}
	}
}

var l_clause_model = new ClauseInstanceDataModel();
var l_terms_model = new TermsListModel();
var l_terms_references_model = new TermReferencesListModel();
var l_contractmetadata_model = new ContractMetadataListModel();
var l_contractcustAttr_model = new ContractCustAttrListModel();

$(function () {
	var i_locale = getlocale();
	var rtl_css = '../../../../../com/opentext/apps/utils/css/rtlappscommon.css';
	translateLabels("com/opentext/apps/commoncomponents/ContentLibrary/ContentLibrary", i_locale, true);
	loadRTLIfRequired(i_locale, rtl_css);
	cInstanceId = getUrlParameterValue("instanceId", null, true);
	$('[src*="clausesummary.htm"]', window.parent.parent.document).parent().css('padding-left', '0px');
	loadCKEditor();
	//loadClauseCategories();
	ko.applyBindings(l_terms_model, document.getElementById("termsDiv"));
	ko.applyBindings(l_contractmetadata_model, document.getElementById("div_generalAttributes"));
	ko.applyBindings(l_contractcustAttr_model, document.getElementById("div_customAttributes"));
	ko.applyBindings(l_clause_model, document.getElementById("id_summaryForm"));
	//loadClauseInstanceData();
	// addToastDiv("Clause saved");
	createToastDiv();
	$("#id_clauseName,#id_clauseCategory,#id_contractType,#id_cbxGlobalClause").change(showError);

	$('.enableDisable').on('input', function () {
		$("#id_canceleditClause, #id_saveClauseonEdit").prop("disabled", false);
	});
	$("#id_cbxGlobalClause, #id_contractType, #id_clauseCategory").on('change', function () {
		$("#id_canceleditClause, #id_saveClauseonEdit").prop("disabled", false);
	});
	// $("#id_clauseName,#id_clauseCategory,#id_contractType,#id_cbxGlobalClause").blur(showError);
	// $("#id_clauseCategory,#id_contractType").change(showError);
});

function translatePlaceHolders() {
	if (document.getElementById("id_versionsummary") != null)
		document.getElementById("id_versionsummary").placeholder = getTranslationMessage("Add clause change summary");
	if (document.getElementById("id_searchElement") != null)
		document.getElementById("id_searchElement").placeholder = getTranslationMessage("Search by name");
}

function loadActiveTypes() {
	ActiveTypesModel = $.cordys.ajax(
		{
			namespace: "http://schemas/OpenTextBasicComponents/GCType/operations",
			method: "GetActiveTypes",
			parameters:
			{
			},
			success: function (data) {
				if (data.GCType) {
					addDataToTypesView(data.GCType, l_clause_model);
				}
				loadClauseCategories();
			}
		});
}
function loadClauseCategories() {
	ClauseCategoriesModel = $.cordys.ajax(
		{
			namespace: "http://schemas/OpenTextContentLibrary/GCClauseCategory/operations",
			method: "GetAllClauseCategories ",
			parameters:
			{
			},
			success: function (data) {
				if (data.GCClauseCategory) {
					addDataToClauseCategoriesView(data.GCClauseCategory, l_clause_model);
				}
				loadClauseInstanceData();
			}
		});
}
function loadClauseInstanceData() {
	ClauseInstanceDataModel = $.cordys.ajax(
		{
			namespace: "http://schemas/OpenTextContentLibrary/GCClause/operations",
			method: "ReadGCClause",
			parameters:
			{
				"GCClause-id":
				{
					"ItemId": cInstanceId
				}
			},
			success: function (data) {
				if (data) {
					addDataToClauseView(data, l_clause_model);
					resetParametersObject = data;
				}
			}
		});
}

function loadCKEditor() {
	CKEDITOR.config.skin = 'moono-lisa';
	CKEDITOR.config.contentsCss = '../css/cc_ckeditor.css';
	CKEDITOR.addCss('.cke_menubutton:focus, .cke_menubutton:active{background-color:transparent !important;outline: inherit;}');
	var pluginUrl = getUrlforCustomPlugin();
	CKEDITOR.addCss('.fullselect { -webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}');

	CKEDITOR.plugins.addExternal('insertterms', pluginUrl, 'plugin-insertTerms.js');
	CKEDITOR.plugins.addExternal('insertcontractmetadata', pluginUrl, 'plugin-insertContractMetadata.js');
	CKEDITOR.plugins.addExternal('customliststyles', pluginUrl, 'plugin_customliststyles.js');
	CKEDITOR.plugins.addExternal('custommenu', pluginUrl, 'plugin_custommenu.js');

	editor = CKEDITOR.replace('id_clauseContentdiv', {
		extraPlugins: 'insertterms,insertcontractmetadata,font,colorbutton,customliststyles,custommenu',
		height: 385,
		forcePasteAsPlainText: true,
		toolbar: [
			{ name: 'document', items: ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates'] },
			{ name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
			{ name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'] },
			{ name: 'forms', items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'] },
			{ name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'] },
			{ name: 'paragraph', items: ['NumberedList', 'customlisstyles', 'BulletedList', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language'] },
			{ name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
			{ name: 'insert', items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
			{ name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
			{ name: 'colors', items: ['TextColor', 'BGColor'] },
			{ name: 'tools', items: ['Maximize', 'ShowBlocks'] },
			{ name: 'about', items: ['About'] },
			{ name: 'cccustom', items: ['insertContractMetadata', 'insertTerms'] }
		],
		removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,Undo,Redo,Strike,PasteFromWord,Find,Replace,SelectAll,About,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Subscript,Superscript,CopyFormatting,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,Language,BidiRtl,BidiLtr,Link,Unlink,Anchor,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,Format',
		removePlugins: 'iframe,pagebreak,flash,stylescombo,print,preview,save,smiley,paste,pastefromword,elementspath,magicline',
		extraAllowedContent: 'ol[class](cc-ol-lower-alpha,cc-ol-upper-alpha,cc-ol-lower-roman,cc-ol-upper-roman,cc-ol-lower-alpha-nested,cc-ol-upper-alpha-nested,cc-ol-decimal-nested,cc-ol-lower-roman-nested,cc-ol-upper-roman-nested,cc-ol-decimal)'
	});

	CKEDITOR.config.ccmenu = {
		'customlisstyles': {
			items: [
				{
					name: 'insertdecimal',
					label: '1, 2, 3, ...',
					command: 'insertdecimal'
				},
				{
					name: 'insertlowerroman',
					label: 'i, ii, iii, ...',
					command: 'insertlowerroman'
				},
				{
					name: 'insertupperroman',
					label: 'I, II, III, ...',
					command: 'insertupperroman'
				},
				{
					name: 'insertloweralpha',
					label: 'a, b, c, ...',
					command: 'insertloweralpha'
				},
				{
					name: 'insertupperalpha',
					label: 'A, B, C, ...',
					command: 'insertupperalpha'
				},
				{
					name: 'insertdecimalnested',
					label: '1, 1.1, 1.1.1, ...',
					command: 'insertdecimalnested'
				},
				{
					name: 'insertlowerromannested',
					label: 'i, i.i, i.i.i, ...',
					command: 'insertlowerromannested'
				},
				{
					name: 'insertupperromannested',
					label: 'I, I.I, I.I.I, ...',
					command: 'insertupperromannested'
				},
				{
					name: 'insertloweralphanested',
					label: 'a, a.a, a.a.a, ...',
					command: 'insertloweralphanested',
				},
				{
					name: 'insertupperalphanested',
					label: 'A, A.A, A.A.A, ...',
					command: 'insertupperalphanested',
				},
				{
					name: 'removelist',
					label: 'None',
					command: 'removelist',
				}],
			label: {
				text: 'Number style',
				width: 45,
				visible: true //default value
			},
			icon: getUrlforCustomPlugin() + 'icons/numbered_bullet.png'
		}
	}

	editor.on('instanceReady', function () {
		this.dataProcessor.writer.setRules('p', {
			breakBeforeOpen: false,
			breakAfterOpen: false,
			breakBeforeClose: false,
			breakAfterClose: false
		});

		$(".cke_button__insertcontractmetadata_icon").css("background-size", "17px");
		$(".cke_button__insertterms_icon").css("background-size", "17px");
		$(".cke_button__insertcontractmetadata").closest(".cke_toolbar").css({ "float": "right" });
		$(".cke_button__insertterms").closest(".cke_toolbar").css({ "float": "right" });

		var cke_numberbutton = $(".cke_button__numberedlist");
		if (cke_numberbutton) {
			cke_numberbutton.hide();
		}
		var number_style = $(".cke_button__customlisstyles");
		if (number_style && number_style[0]) {
			number_style[0].title = getTranslationMessage(number_style[0].title);
		}
		loadActiveTypes();
	});
	/* Code for preventing Nested Numbering and bullets 
	editor.on( 'key', function( event ) {
		 if ( event.data.keyCode == 8 ) {
			 event.cancel();
		 }
	 });*/
	editor.on('change', function () {
		$("#id_canceleditClause, #id_saveClauseonEdit").prop("disabled", false);
	});

	editor.on('afterCommandExec', handleAfterCommandExec);
	function handleAfterCommandExec(event) {
		var commandName = event.data.name;
		// For 'indent' commmand
		if (commandName == 'indent') {
			var element = getListElement(editor, 'ol');
			if (element && element.getParent() && element.getParent().getParent()) {
				element.addClass(element.getParent().getParent().getAttribute("class"));
			}
		}
	}
}

function getUrlforCustomPlugin() {
	var url = window.location.href;
	var index = url.indexOf("apps/gc");
	url = url.substring(0, index + 8) + "ckeditor-plugins/";
	return url;
}

function onStateChange(clauseState, Z_INT_Status, version) {
	if (clauseState == "Draft") {
		if (Z_INT_Status == "DraftReview" || Z_INT_Status == "DraftConfigWorkflowReview") {
			$("#id_clauseDescriptiondiv").attr('readonly', true);
			$("#id_clauseDescriptiondiv").css("background-color", "#eee");
			if (document.getElementsByClassName('cke_wysiwyg_frame cke_reset')[0] &&
				document.getElementsByClassName('cke_wysiwyg_frame cke_reset')[0].contentDocument &&
				document.getElementsByClassName('cke_wysiwyg_frame cke_reset')[0].contentDocument.body &&
				document.getElementsByClassName('cke_wysiwyg_frame cke_reset')[0].contentDocument.body.style) {
				document.getElementsByClassName('cke_wysiwyg_frame cke_reset')[0].contentDocument.body.style.backgroundColor = '#eee';
			}
			$("#id_commentsdiv").attr('readonly', true);
			$("#id_commentsdiv").css("cursor", "not-allowed");
			$("#id_commentsdiv").css("background-color", "#eee");
			editClauseDetailsDisable();

		}
		else if (version != '1.0' || version == '') {
			$("#id_clauseDescriptiondiv").attr('readonly', true);
			$("#id_clauseDescriptiondiv").css("background-color", "#eee");
			// document.getElementsByClassName('cke_wysiwyg_frame cke_reset')[0].contentDocument.body.style.backgroundColor='#eee'
			$("#id_commentsdiv").attr('readonly', true);
			$("#id_commentsdiv").css("cursor", "not-allowed");
			$("#id_commentsdiv").css("background-color", "#eee");
			editClauseDetailsDisable();
			editClause();
			$("#id_navBar").removeClass("hideDiv");
			$("#id_summaryForm").css('margin-top', '60px');
		}
		else {
			$("#id_clauseContentdiv").css("height:428");
			$("#id_clauseDescriptiondiv").css("height:135");
			$("#id_commentsdiv").css("height:135");
			$("#id_commentsdiv").attr('contentEditable', 'true');
		}
	}
	else {
		$("#id_clauseDescriptiondiv").attr('readonly', true);
		$("#id_clauseDescriptiondiv").css("background-color", "#eee");
		$("#id_commentsdiv").attr('readonly', true);
		$("#id_commentsdiv").css("cursor", "not-allowed");
		$("#id_commentsdiv").css("background-color", "#eee");
		if (document.getElementsByClassName('cke_wysiwyg_frame cke_reset')[0] &&
			document.getElementsByClassName('cke_wysiwyg_frame cke_reset')[0].contentDocument &&
			document.getElementsByClassName('cke_wysiwyg_frame cke_reset')[0].contentDocument.body &&
			document.getElementsByClassName('cke_wysiwyg_frame cke_reset')[0].contentDocument.body.style) {
			document.getElementsByClassName('cke_wysiwyg_frame cke_reset')[0].contentDocument.body.style.backgroundColor = '#eee';
		}
		editClauseDetailsDisable();

	}
}
function editClauseDetailsDisable() {
	$("#id_clauseName").attr('disabled', 'disabled');
	$("#id_contractType").attr('disabled', 'disabled');
	$("#id_clauseCategory").attr('disabled', 'disabled');
	$("#id_cbxGlobalClause").attr('disabled', 'disabled');
	$("#id_clauseContentdiv").css("height:428");

	disableCkEditor(true);
	$("#id_clauseContentdiv").css("cursor", "not-allowed");
	$("#id_clauseContentdiv *").attr("disabled", "disabled").off('click');
	$("#id_clauseContentdiv").css("background-color", "#eee");
	$("#id_clauseDescriptiondiv").css("height:135");
	$("#id_clauseDescriptiondiv").css("cursor", "not-allowed");
	//  $("#id_clauseDescriptiondiv *").attr("disabled", "disabled").off('click');
	$("#id_commentsdiv").css({ "height": "135", "background-color": "#eee" });

	$("#id_navBar").addClass("hideDiv");
	$("#id_insertTerms").addClass("hideDiv");
	$("#id_insertContractMetadata").addClass("hideDiv");
	$("#id_summaryForm").css('margin-top', '14px');
}
function disableCkEditor(disableFlag) {
	if (editor) {
		if (CKEDITOR.env.ie) {
			editor.readOnly = disableFlag;
		} else {
			editor.setReadOnly(disableFlag);
		}
		if (disableFlag) {
			$(".cke_top").hide();
		} else {
			$(".cke_top").show();
		}
	}
}

function editClause() {
	$("#id_clauseContentdiv").css("height:428");

	var doc = document.getElementsByClassName('cke_wysiwyg_frame').item(0).contentDocument
	doc.body.style.background = "#FFFFFF";
	//$('#id_clauseContentdiv').prop('readonly', false);
	$("#id_clauseContentdiv").css("cursor", "default");
	$("#id_clauseContentdiv *").prop("disabled", false);
	$("#id_clauseContentdiv").css("background-color", "transparent");
	$("#id_clauseDescriptiondiv").css("height:135");
	$('#id_clauseDescriptiondiv').prop('readonly', false);
	$("#id_clauseDescriptiondiv").css("cursor", "default");
	$("#id_clauseDescriptiondiv *").prop("disabled", false);
	$("#id_clauseDescriptiondiv").css("background-color", "transparent");
	$("#id_insertTerms").removeClass("hideDiv");
	$("#id_insertContractMetadata").removeClass("hideDiv");
	disableCkEditor(false);
}

function addDataToClauseView(iElement, iModel) {
	iModel.ClauseId(iElement.GCClause["GCClause-id"].Id);
	ClauseId = iElement.GCClause["GCClause-id"].Id;
	iModel.ClauseName(iElement.GCClause.Name);
	iModel.ClauseType((iElement.GCClause.GlobalClause == "true"));
	iModel.ClauseState(iElement.GCClause.Lifecycle.CurrentState);
	iModel.ClauseDescription(iElement.GCClause.Description);
	iModel.ClauseComments(iElement.GCClause.Comments);
	iModel.ClauseContent(iElement.GCClause.PlainContent);
	iModel.HtmlClauseContent(iElement.GCClause.HtmlContent);
	editor.setData(iElement.GCClause.HtmlContent);
	iModel.RelatedClauseCategoryId(iElement.GCClause.RelatedClauseCategory["GCClauseCategory-id"].Id);
	iModel.Version(iElement.GCClause.Version);
	iModel.VersionSummary(iElement.GCClause.VersionSummary);
	var Z_INT_Status = iElement.GCClause.Z_INT_Status;
	versionUniqueId = iElement.GCClause.ClauseIdentifier ? iElement.GCClause.ClauseIdentifier : cInstanceId;
	enabledisableType(iModel.ClauseType())
	if (!iModel.ClauseType()) {
		iModel.RelatedTypeId(iElement.GCClause.RelatedType["GCType-id"].Id);
	}
	if (iElement.GCClause.Lifecycle.CurrentState) {
		onStateChange(iElement.GCClause.Lifecycle.CurrentState, Z_INT_Status, iElement.GCClause.Version);
	}
}
function resetDataToClauseView(iEventObject) {
	l_clause_model.ClauseName(resetParametersObject.GCClause.Name);
	l_clause_model.ClauseType((resetParametersObject.GCClause.GlobalClause == "true"));
	if (l_clause_model.ClauseType()) {
		l_clause_model.RelatedTypeId(selectId);
		$('#id_contractType').prop('disabled', 'disabled');
		$("#id_contractTypediv").prev().removeClass("apps-required");
	}
	else {
		$('#id_contractType').prop('disabled', false);
		$("#id_contractTypediv").prev().addClass("apps-required");
	}
	l_clause_model.ClauseDescription(resetParametersObject.GCClause.Description);
	l_clause_model.ClauseComments(resetParametersObject.GCClause.Comments);
	l_clause_model.ClauseContent(resetParametersObject.GCClause.PlainContent);
	l_clause_model.HtmlClauseContent(resetParametersObject.GCClause.HtmlContent);
	l_clause_model.VersionSummary(resetParametersObject.GCClause.VersionSummary);
	editor.setData(resetParametersObject.GCClause.HtmlContent);
	l_clause_model.RelatedClauseCategoryId(resetParametersObject.GCClause.RelatedClauseCategory["GCClauseCategory-id"].Id);
	if (resetParametersObject.GCClause == '' || resetParametersObject.GCClause == '1.0') {
		enabledisableType(l_clause_model.ClauseType());
	}
	if (!l_clause_model.ClauseType()) {
		l_clause_model.RelatedTypeId(resetParametersObject.GCClause.RelatedType["GCType-id"].Id);
	}
	//document.getElementById('id_clauseDescriptiondiv').innerText = resetParametersObject.GCClause.Description;
	//document.getElementById('id_commentsdiv').innerText = resetParametersObject.GCClause.Comments;
	//document.getElementById('id_clauseContentdiv').innerHTML = resetParametersObject.GCClause.HtmlContent;
	//document.getElementById('id_clauseContentdiv').value = resetParametersObject.GCClause.PlainContent
	$("#id_canceleditClause, #id_saveClauseonEdit").prop("disabled", true);
	errorToastToggle("hide");
	$('#id_contractType,#id_clauseName,#id_clauseCategory').removeClass("apps-error");
}

function addDataToTypesView(iElementList, iModel) {
	iModel.ActiveTypes.removeAll();
	iModel.ActiveTypes.push({ "typeId": selectId, "typeName": "--Select--" });
	if (iElementList) {
		if (iElementList.length) {
			iElementList.forEach(function (iElement) {
				iModel.ActiveTypes.push({ "typeId": iElement["GCType-id"].Id, "typeName": iElement.Name, selected: false });
			});
		}
		else {
			iModel.ActiveTypes.push({ "typeId": iElementList["GCType-id"].Id, "typeName": iElementList.Name, selected: false });
		}
	}
}
function addDataToClauseCategoriesView(iElementList, iModel) {
	iModel.AllClauseCategories.removeAll();
	iModel.AllClauseCategories.push({ "clausecategoryId": selectId, "clausecategoryName": "--Select--" });
	if (iElementList) {
		if (iElementList.length) {
			iElementList.forEach(function (iElement) {
				iModel.AllClauseCategories.push({ "clausecategoryId": iElement["GCClauseCategory-id"].Id, "clausecategoryName": iElement.Name, selected: false });
			});
		}
		else {
			iModel.AllClauseCategories.push({ "clausecategoryId": iElementList["GCClauseCategory-id"].Id, "clausecategoryName": iElementList.Name, selected: false });
		}
	}
}
function updateCursorParametersObject() {
	return cursorParametersObject = {
	};
}
function loadTermsList(searchElement) {
	$('#selectAll')[0].checked = false;
	if (l_terms_model.currentPage() == 1) {
		document.getElementById("decrementer").style.display = "none";
		document.getElementById("incrementer").style.display = "inline";
	}
	if (l_terms_model.total_terms_count() <= 5) {
		l_terms_model.currentPage('1');
		$('#decrementer,#incrementer').css('display', 'none');
	}
	if (is_first_page_clicked) {
		offsetValue = 0;
		l_terms_model.currentPage('1');
		is_first_page_clicked = 1;
		$('#incrementer').css('display', 'inline');
		$('#decrementer').css('display', 'none');
		is_first_page_clicked = 0;
	}
	if (is_last_page_clicked) {
		offsetValue = (Math.ceil(l_terms_model.total_terms_count() / 5) - 1) * 5;
		l_terms_model.currentPage(Math.ceil(l_terms_model.total_terms_count() / 5));
		is_last_page_clicked = 0;
		$('#incrementer').css('display', 'none');
		$('#decrementer').css('display', 'inline');
		is_last_page_clicked = 0;
	}
	TermsListModel = $.cordys.ajax(
		{
			namespace: "http://schemas/OpenTextBasicComponents/GCTerm/operations",
			method: "GetActiveTerms",
			parameters:
			{
				"termname": searchElement,
				"Cursor": {
					'@xmlns': 'http://schemas.opentext.com/bps/entity/core',
					'@offset': offsetValue,
					'@limit': limitValue
				}
			},
			success: function (data) {
				if (data) {
					addDataToTermsView(data.GCTerm, l_terms_model);
				}
			}
		});
}
function addDataToTermsView(iElementList, iModel) {
	iModel.TermsList.removeAll();
	if (iElementList) {
		if (iElementList.length) {
			iElementList.forEach(function (iElement) {
				iModel.TermsList.push(iElement);
			});
		}
		else {
			iModel.TermsList.push(iElementList);
		}
	}
}
//get active terms count
function getActiveTermsCount() {
	var temp_termname = "";
	if ($('#id_searchElement').val()) {
		temp_termname = $('#id_searchElement').val();
	}
	$.cordys.ajax({
		method: "getActiveTermsCount",
		namespace: "http://schemas/OpenTextContentLibrary/18.4",
		parameters: {
			"termname": temp_termname,
		}
	}).done(function (data) {
		l_terms_model.total_terms_count(data.count.text);
		loadTermsList(temp_termname);
	}).fail(function (error) {

	});
}
function enabledisableType(iValue) {
	if (iValue) {
		l_clause_model.RelatedTypeId(selectId);
		$('#id_contractType').prop('disabled', 'disabled');
		$("#id_contractTypediv").prev().removeClass("apps-required");
	}
	else {
		$('#id_contractType').prop('disabled', false);
		$("#id_contractTypediv").prev().addClass("apps-required");
	}
}
function checkValidation() {
	var validationFlag = true;
	if ($("#id_clauseName").val() == "") {
		$("#id_clauseName").addClass("apps-error");
		validationFlag = false;
	}
	if ($("#id_clauseCategory").val() == "") {
		$("#id_clauseCategory").addClass("apps-error");
		validationFlag = false;
	}
	if (!$("#id_cbxGlobalClause").prop('checked')) {
		if ($("#id_contractType").val() == selectId) {
			$("#id_contractType").addClass("apps-error");
			validationFlag = false;
		}
	}
	return validationFlag;
}
function getPlainTextFromEditorData() {
	var l_text = "";
	if (editor) {
		var l_textNodes = editor.document.getBody().$.childNodes;
		if (l_textNodes && (l_textNodes.length > 0)) {
			l_text += l_textNodes.item(0).textContent;
			for (var indx = 1; indx < l_textNodes.length; indx++) {
				l_text += '\n' + l_textNodes.item(indx).textContent;
			}
		}
	}
	return l_text;
}
function updateUpdatePlainContentObject() {
	var l_plainText = getPlainTextFromEditorData();
	if (l_plainText != "") {
		return l_plainText;
	}
	else {
		return { '@xsi:nil': 'true' };
	}
}
function updateUpdateHtmlContentObject() {
	if (editor.getData() != "") {
		return editor.getData();
	}
	else {
		return { '@xsi:nil': 'true' };
	}
}
function updateUpdateDescriptionObject() {
	if (document.getElementById('id_clauseDescriptiondiv').value != "") {
		return document.getElementById('id_clauseDescriptiondiv').value;
	}
	else {
		return { '@xsi:nil': 'true' };
	}
}
function updateUpdateCommentsObject() {
	if (document.getElementById('id_commentsdiv').value != "") {
		return document.getElementById('id_commentsdiv').value;
	}
	else {
		return { '@xsi:nil': 'true' };
	}
}
function updateVersionSummaryObject() {
	if (document.getElementById('id_versionsummary').value != "") {
		return document.getElementById('id_versionsummary').value;
	}
	else {
		return { '@xsi:nil': 'true' };
	}
}

function updateUpdateParametersObject() {
	l_updatePlainContentObj = updateUpdatePlainContentObject();
	l_updateHtmlContentObj = updateUpdateHtmlContentObject();
	l_updateDescriptionObj = updateUpdateDescriptionObject();
	l_updateCommentsObj = updateUpdateCommentsObject();
	l_updateVersionObj = updateVersionSummaryObject();
	if ($("#id_cbxGlobalClause").prop('checked')) {
		return updateParametersObject = {
			'@xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
			Name: $("#id_clauseName").val(),
			GlobalClause: "true",
			PlainContent: l_updatePlainContentObj,
			HtmlContent: l_updateHtmlContentObj,
			Description: l_updateDescriptionObj,
			Comments: l_updateCommentsObj,
			VersionSummary: l_updateVersionObj,
			RelatedClauseCategory:
			{
				"GCClauseCategory-id":
				{
					Id: $("#id_clauseCategory").val(),
				}
			}
		};
	}
	else {
		return updateParametersObject = {
			'@xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
			Name: $("#id_clauseName").val(),
			GlobalClause: "false",
			PlainContent: l_updatePlainContentObj,
			HtmlContent: l_updateHtmlContentObj,
			Description: l_updateDescriptionObj,
			Comments: l_updateCommentsObj,
			VersionSummary: l_updateVersionObj,
			RelatedClauseCategory:
			{
				"GCClauseCategory-id":
				{
					Id: $("#id_clauseCategory").val(),
				}
			},
			RelatedType:
			{
				"GCType-id":
				{
					Id: $("#id_contractType").val(),
				}
			}
		};
	}
}

function changeSummaryFormrModelOpenIfRequired() {
	if (resetParametersObject.GCClause &&
		(resetParametersObject.GCClause.Version == '1.0' || resetParametersObject.GCClause.Version == '')) {
		updateClause();
	} else {
		openChangeSummaryModel();
	}
}
function updateClause() {
	isSaveClicked = true;
	showError();
	l_updateObj = updateUpdateParametersObject();
	if (checkValidation()) {
		$.cordys.ajax(
			{
				method: "UpdateGCClause",
				namespace: "http://schemas/OpenTextContentLibrary/GCClause/operations",
				parameters:
				{
					"GCClause-id": { "Id": ClauseId },
					"GCClause-update": l_updateObj
				},
			}).done(function (data) {
				successToast(3000, getTranslationMessage("Clause saved"));
				$("#id_canceleditClause, #id_saveClauseonEdit").prop("disabled", true);
				resetParametersObject = data;
			}).fail(function (error) {
			})
	}
}

function callClauseWarning(iEventObject) {
	$("#id_cancelwarning").modal();
}
function openChangeSummaryModel(iEventObject) {
	$("#change_summary_dialogue_id").modal();
}



function callOpenTermsList(clauseContentDivID) {
	tokenObject = {};
	$("#id_insertTermsDialog").modal();
	getActiveTermsCount();
}

function callInsertBtnAction(btnTableID, clauseContentDivID, tknObjectName, tknObject) {
	var l_appendText = '';
	for (elem in tknObject) {
		if (tknObject[elem]) {
			l_appendText += '<span class="fullselect" contenteditable="false">' + tknObject[elem] + '</span> ';
		}
	}
	if (l_appendText) {
		var editor = CKEDITOR.instances[clauseContentDivID];
		editor.insertHtml(l_appendText);
	}
	var tableid = $('#' + btnTableID).parent("table").prop("id");
	$('#' + tableid + ' input[type=checkbox]:checked').removeAttr('checked');
	if (tknObjectName == 'term') {
		$("#id_searchElement").val("");
		$('#selectAll').checked = false;
		l_terms_model.currentPage(1);
		offsetValue = 0;
	} else if (tknObjectName == 'metadata') {
		$('#selectAllMetadata').checked = false;
	}
	else if (tknObjectName == 'custAttr') {
		$('#selectAllCusAttr').checked = false;
	}
	$("#id_canceleditClause, #id_saveClauseonEdit").prop("disabled", false);
}

function createRandomString() {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
function removeErrorClass(iEvent) {
	$(iEvent).removeClass("apps-error");
}
//from here
var inValidList = [];

function contentText() {
	str = null;
	for (i = 0; i < inValidList.length; i++)
		if (i == 0)
			str = getTranslationMessage("{0}: A value is required", [inValidList[i]]);
		else
			str = str + "<br>" + getTranslationMessage("{0}: A value is required", [inValidList[i]]);
	return str;
}

var showError = function () {
	if (isSaveClicked) {
		inValidList = [];
		var nameVaild = $('#id_clauseName').val().replace(/\s/g, "") != "";
		var ccValid = $('#id_clauseCategory').val() != "";
		var ctValid = $('#id_contractType').val() != "";
		var globalClaueValid = (document.getElementById("id_cbxGlobalClause").checked == false);
		if (!nameVaild)
			inValidList.push("Clause name");
		if (globalClaueValid)
			if (!ctValid)
				inValidList.push("Contract type");
		if (!ccValid)
			inValidList.push("Clause category");
		updateToastContent();
		if (inValidList.length == 0) {
			isSaveClicked = false;
			errorToastToggle("hide");
			// successToast(3000);
		}
		else {
			if (inValidList.length == 1)
				updateToastContent(getTranslationMessage("{0}: A value is required.", [inValidList[0]]));
			else
				updateToastContent(getTranslationMessage("{0} errors", [inValidList.length]), contentText());
			errorToastToggle("show");
		}

	}
}
function decrementOffsetLimit() {
	if (l_terms_model.currentPage() > 1) {
		offsetValue = offsetValue - 5;
		l_terms_model.currentPage(parseInt(l_terms_model.currentPage()) - 1);
	}
	if (l_terms_model.currentPage() < Math.ceil(l_terms_model.total_terms_count() / 5)) {
		document.getElementById("incrementer").style.removeProperty("display");
	}
	if (l_terms_model.currentPage() == 1) {
		document.getElementById("decrementer").style.display = "none";
	}
	if (l_terms_model.currentPage() < 1)
		return;
	loadTermsList($('#id_searchElement').val());
}
function incrementOffsetLimit() {
	if (l_terms_model.currentPage() < Math.ceil(l_terms_model.total_terms_count() / 5)) {
		offsetValue = offsetValue + 5;
		l_terms_model.currentPage(isNaN(parseInt(l_terms_model.currentPage())) ? 0 : parseInt(l_terms_model.currentPage()));
		l_terms_model.currentPage(parseInt(l_terms_model.currentPage()) + 1);
	}
	if (l_terms_model.currentPage() == Math.ceil(l_terms_model.total_terms_count() / 5)) {
		document.getElementById("incrementer").style.display = "none";
	}
	if (l_terms_model.currentPage() > 1) {
		document.getElementById("decrementer").style.removeProperty("display");
	}
	loadTermsList($('#id_searchElement').val());
}
function incrementToLast() {
	is_last_page_clicked = 1;
	getActiveTermsCount();
}
function decrementToLast() {
	is_first_page_clicked = 1;
	getActiveTermsCount()
}
function clearData(tknObjectName) {
	if (tknObjectName == 'term') {
		offsetValue = 0;
		l_terms_model.currentPage(1);
		$("#id_searchElement").val("");
		var tableid = $('#id_termsTableBody').parent("table").prop("id");
		$('#' + tableid + ' input[type=checkbox]:checked').removeAttr('checked');
		$('#selectAll').checked = false;
	} else if (tknObjectName == 'metadata') {
		var metadatatableid = $('#id_contractMetadataBody').parent("table").prop("id");
		$('#' + metadatatableid + ' input[type=checkbox]:checked').removeAttr('checked');
		$('#selectAllMetadata').checked = false;
	} else if (tknObjectName == 'custAttr') {
		var custAttrtableid = $('#id_customAttributesBody').parent("table").prop("id");
		$('#' + custAttrtableid + ' input[type=checkbox]:checked').removeAttr('checked');
		$('#selectAllCusAttr').checked = false;
	}
}

function showTooltip() {
	$("#clause-description-tooltip").addClass('clauses-tooltip-shown');
}

function hideTooltip() {
	$("#clause-description-tooltip").removeClass('clauses-tooltip-shown');
}

function addDataToContractMetadataView(iElementList, iModel) {
	$('#selectAllMetadata')[0].checked = false;
	iModel.ContractMetadataList.removeAll();
	if (iElementList) {
		if (iElementList.length) {
			iElementList.forEach(function (iElement) {
				iModel.ContractMetadataList.push(iElement);
			});
		}
		else {
			iModel.ContractMetadataList.push(iElementList);
		}
	}
}

function callOpenContractMetadataList(clauseContentDivID) {
	metadatatokenObject = {};
	custAttrtokenObject = {};
	$("#id_insertContractMetadataDialog").modal();
	addDataToContractMetadataView(metadataStore.data.Metadata, l_contractmetadata_model);
	addDataToContractCustAttrView(l_contractcustAttr_model);
}

function checkAllMetadata(eleMetadata) {
	if (eleMetadata.checked) {
		$('.metadataCheckbox').prop('checked', true);
	}
	else {
		$('.metadataCheckbox').prop('checked', false);
	}
	$('.metadataCheckbox').change(function () {
		$('#selectAllMetadata')[0].checked = false;
	});
}
function addDataToContractCustAttrView(iModel) {
	if (!l_clause_model.ClauseType()) {
		$.cordys.ajax({
			method: "GetCusAttrforCTRType",
			namespace: "http://schemas/OpenTextContentLibrary/18.4",
			parameters: {
				'typeID': l_clause_model.RelatedTypeId()
			}
		}).done(function (data) {
			$('#selectAllCusAttr')[0].checked = false;
			var iElementList = data.cusAttributes.Name
			iModel.CustomAttributesList.removeAll();
			if (iElementList) {
				if (iElementList.length) {
					iElementList.forEach(function (iElement) {
						iModel.CustomAttributesList.push({ "CusAttrName": iElement.text, "CusAttrToken": "[#" + iElement.text + "#]" });
					});
				}
				else {
					iModel.CustomAttributesList.push({ "CusAttrName": iElementList.text, "CusAttrToken": "[#" + iElementList.text + "#]" });
				}
				var temp = "";
			}
		}).fail(function (error) {

		});
	} else {

	}
}
function checkAllCusAttr(eleMetadata) {
	if (eleMetadata.checked) {
		$('.custAttrCheckbox').prop('checked', true);
	}
	else {
		$('.custAttrCheckbox').prop('checked', false);
	}
	$('.custAttrCheckbox').change(function () {
		$('#selectAllCusAttr')[0].checked = false;
	});
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
		document.getElementById("div_generalAttributes").style.display = "block";
		document.getElementById("div_customAttributes").style.display = "none";
		document.getElementById("div_generalAttrActions").style.display = "block";
		document.getElementById("div_customAttrActions").style.display = "none";
	}
	else if (event.currentTarget.id == "div_custAttr") {
		document.getElementById("div_generalAttributes").style.display = "none";
		document.getElementById("div_customAttributes").style.display = "block";
		document.getElementById("div_generalAttrActions").style.display = "none";
		document.getElementById("div_customAttrActions").style.display = "block";
	}
}