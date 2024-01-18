/*********************** Variables. *********************************/

// Global variables.
var _IS_NEW_SCHEMA = true;
var g_addedSections = 0;
var g_addedClauses = 0;

/*************************************************************** */

/*********************** Constants. *********************************/

// Action constants.
const _UPDATE_ORDER = "UPD_ORDER";
const _NEW_SECTION = "NEW_SEC";
const _UPDATE_SECTION = "UPD_SEC_NAME";
const _UPDATE_SECTION_NAME_ORDER = "UPD_SEC_NAME_ORD";
const _NEW_LINKED_CLAUSE = "NEW_LINKED_CLA";
const _UPDATE_LINKED_CLAUSE = "UPD_LINKED_CLA";
const _UPDATE_LINKED_CLAUSE_ORDER = "UPD_LINKED_CLA_ORD";
const _NEW_NONSTANDARD_CLAUSE = "NEW_NONSTD_CLA";
const _UPDATE_NONSTANDARD_CLAUSE = "UPD_NONSTD_CLA";
const _UPDATE_NONSTANDARD_CLAUSE_ORDER = "UPD_NONSTD_CLA_ORD";
const _CONVERT_TO_NONSTANDARD = "CNVT_TO_NONSTD";
const _CONVERT_TO_NONSTANDARD_ORDER = "CNVT_TO_NONSTD_ORD";
const _DELETE_CONTAINER = "DELETE";
const _NEW_CONDITION = "NEW_CONDITION";
const _UPDATED_CONDITION = "UPDATE_CONDITION";
const _DELETE_CONDITION = "DELETE_CONDITION";

// Cascading constants.
const _CASCADE_ON = "ON";
const _CASCADE_OFF = "OFF";
const _CASCADE_INHERITED = "INHERITED";

// Type constants.
const _CLAUSE = "CLAUSE";
const _SECTION = "SECTION";

// Numbering style constants. Simple means without nested effect.
const _DEFAULT_NUMBERING_FORMAT = "decimal";
const _DECIMAL_FORMAT = "decimal";
const _LOWER_ALPHA_FORMAT = "lower-alpha";
const _UPPER_ALPHA_FORMAT = "upper-alpha";
const _LOWER_ROMAN_FORMAT = "lower-roman";
const _UPPER_ROMAN_FORMAT = "upper-roman";
const _DECIMAL_SIMPLE_FORMAT = "decimal-simple";
const _LOWER_ALPHA_SIMPLE_FORMAT = "lower-alpha-simple";
const _UPPER_ALPHA_SIMPLE_FORMAT = "upper-alpha-simple";
const _LOWER_ROMAN_SIMPLE_FORMAT = "lower-roman-simple";
const _UPPER_ROMAN_SIMPLE_FORMAT = "upper-roman-simple";

/*************************************************************** */

/********************** Methods **********************************/

// Generating next section id.
function getNewSectionId() {
	var l_id = "New_Section_" + g_addedSections;
	g_addedSections++;
	return l_id;
}

// Generating next clause id.
function getNewContainingClauseId() {
	var l_id = "New_ContainingClause_" + g_addedClauses;
	g_addedClauses++;
	return l_id;
}

// Get id from item id.
function getId(inputId) {
	var res = inputId.split(".");
	return res[res.length - 1];
}

// Get no numbering value as true or false. If null false value will be returned.
function getNoNumberingFlag(value) {
	var result = false;
	if (value && (value == true || value === 'true' || value === 'TRUE')) {
		result = true;
	}
	return result;
}

// Get numbering style based on provided value. If null default numbering will be returned.
function getNumberingStyle(numberingStyle, docLevelNumbering) {
	var numberingStyleResult = docLevelNumbering ? docLevelNumbering : _DEFAULT_NUMBERING_FORMAT;
	if (_DECIMAL_FORMAT === numberingStyle) {
		numberingStyleResult = _DECIMAL_FORMAT;
	} else if (_LOWER_ALPHA_FORMAT === numberingStyle) {
		numberingStyleResult = _LOWER_ALPHA_FORMAT;
	} else if (_UPPER_ALPHA_FORMAT === numberingStyle) {
		numberingStyleResult = _UPPER_ALPHA_FORMAT;
	} else if (_LOWER_ROMAN_FORMAT === numberingStyle) {
		numberingStyleResult = _LOWER_ROMAN_FORMAT;
	} else if (_UPPER_ROMAN_FORMAT === numberingStyle) {
		numberingStyleResult = _UPPER_ROMAN_FORMAT;
	} else if (_DECIMAL_SIMPLE_FORMAT === numberingStyle) {
		numberingStyleResult = _DECIMAL_SIMPLE_FORMAT;
	} else if (_LOWER_ALPHA_SIMPLE_FORMAT === numberingStyle) {
		numberingStyleResult = _LOWER_ALPHA_SIMPLE_FORMAT;
	} else if (_UPPER_ALPHA_SIMPLE_FORMAT === numberingStyle) {
		numberingStyleResult = _UPPER_ALPHA_SIMPLE_FORMAT;
	} else if (_LOWER_ROMAN_SIMPLE_FORMAT === numberingStyle) {
		numberingStyleResult = _LOWER_ROMAN_SIMPLE_FORMAT;
	} else if (_UPPER_ROMAN_SIMPLE_FORMAT === numberingStyle) {
		numberingStyleResult = _UPPER_ROMAN_SIMPLE_FORMAT;
	}
	return numberingStyleResult;
}


// Update section action.
function updateSectionAction(l_item, event) {
	if (!l_item.action) {
		l_item.action = _UPDATE_SECTION;
	} else if (l_item.action === _UPDATE_ORDER) {
		l_item.action = _UPDATE_SECTION_NAME_ORDER;
	}
	isDirty = true;
}

// Update clause action.
function updateClauseAction(data, event) {
	if (!data.action) {
		data.action = _UPDATE_NONSTANDARD_CLAUSE;
	} else if (data.action === _UPDATE_ORDER) {
		data.action = _UPDATE_NONSTANDARD_CLAUSE_ORDER;
	}
	isDirty = true;
}

// Update authoring operations on a section or clause with order.
function _updateOrderActionOnSectionOrClause(sectionOrClause) {
	if (!sectionOrClause.action) {
		sectionOrClause.action = _UPDATE_ORDER;
	} else if (sectionOrClause.type === _SECTION && sectionOrClause.action === _UPDATE_SECTION) {
		sectionOrClause.action = _UPDATE_SECTION_NAME_ORDER;
	} else if (sectionOrClause.type === _CLAUSE && sectionOrClause.action === _UPDATE_LINKED_CLAUSE) {
		sectionOrClause.action = _UPDATE_LINKED_CLAUSE_ORDER;
	} else if (sectionOrClause.type === _CLAUSE && sectionOrClause.action === _UPDATE_NONSTANDARD_CLAUSE) {
		sectionOrClause.action = _UPDATE_NONSTANDARD_CLAUSE_ORDER;
	} else if (sectionOrClause.type === _CLAUSE && sectionOrClause.action === _CONVERT_TO_NONSTANDARD) {
		sectionOrClause.action = _CONVERT_TO_NONSTANDARD_ORDER;
	}
}


function updateNumberingStyleWithParentStyle(container, docLevelNumbering) {
	var numberingStyle = "";
	if (container) {
		if (container.parentContainer) {
			if (container.parentContainer.container && container.parentContainer.container().length > 0) {
				numberingStyle = container.parentContainer.container()[0].numberingStyle();
			} else {
				numberingStyle = container.parentContainer.numberingStyle ? numberingStyle = container.parentContainer.numberingStyle() : "";
			}
		}
		container.numberingStyle(getNumberingStyle(numberingStyle, docLevelNumbering));

		// Re-setting no numbering flag to reflect in UI.
		if (container.nonumbering()) {
			container.nonumbering(false);
			container.nonumbering(true);
		}
		if (container.parentContainer) {
			if (container.numberingStyle && container.parentContainer.numberingStyle &&
				container.numberingStyle() !== container.parentContainer.numberingStyle()) {
				_cascadeToggleAllNodes(container, _CASCADE_OFF, true);
				_updateNumberingStyleToSimple(container);
				container.inherited(false);
			}
		}
	}
}

function _updateNumberingStyleToSimple(container) {
	if (container) {
		if (!container.numberingStyle().includes("-simple")) {
			container.numberingStyle(container.numberingStyle() + "-simple");
			_updateOrderActionOnSectionOrClause(container);
		}
		if (container.container() && container.container().length > 0) {
			for (var i = 0; i < container.container().length; i++) {
				_updateNumberingStyleToSimple(container.container()[i]);
			}

		}

	}
}

function updateNumberingStyleOptions(container, docLevelNumbering) {
	if (container) {

		if (container.parentContainer) {
			$("#option_decimal").addClass($("#option_decimal").hasClass('disable_option') ? '' : 'disable_option');
			$("#option_lower-alpha").addClass($("#option_lower-alpha").hasClass('disable_option') ? '' : 'disable_option');
			$("#option_upper-alpha").addClass($("#option_upper-alpha").hasClass('disable_option') ? '' : 'disable_option');
			$("#option_lower-roman").addClass($("#option_lower-roman").hasClass('disable_option') ? '' : 'disable_option');
			$("#option_upper-roman").addClass($("#option_upper-roman").hasClass('disable_option') ? '' : 'disable_option');
			if (container.parentContainer.numberingStyle && docLevelNumbering === container.parentContainer.numberingStyle() ||
				!container.parentContainer.numberingStyle().includes("simple")) {
				if ($("#option_" + container.parentContainer.numberingStyle()).hasClass('disable_option')) {
					$("#option_" + container.parentContainer.numberingStyle()).removeClass('disable_option');
				}
			}

		} else {
			$("#option_decimal").removeClass($("#option_decimal").hasClass('disable_option') ? 'disable_option' : '');
			$("#option_lower-alpha").removeClass($("#option_lower-alpha").hasClass('disable_option') ? 'disable_option' : '');
			$("#option_upper-alpha").removeClass($("#option_upper-alpha").hasClass('disable_option') ? 'disable_option' : '');
			$("#option_lower-roman").removeClass($("#option_lower-roman").hasClass('disable_option') ? 'disable_option' : '');
			$("#option_upper-roman").removeClass($("#option_upper-roman").hasClass('disable_option') ? 'disable_option' : '');
		}

		if (container.nonumbering()) {
			$("#option_no-numbering").addClass('disable_option');
		} else {
			if ($("#option_no-numbering").hasClass('disable_option')) {
				$("#option_no-numbering").removeClass('disable_option');
			}
		}
	}
}

function getParentClauseCascadeFlag(parentModel) {
	var cascadeFlag = parentModel.cascadeDocLevel();
	if (parentModel.addSectionData() && parentModel.addSectionData().type === _CLAUSE &&
		parentModel.addSectionParentData() && parentModel.addSectionParentData().type === _CLAUSE) {
		cascadeFlag = parentModel.addSectionParentData().cascade();
	}
	return cascadeFlag;
}

function addNumberingAndCascadeInfo(clauseOrSecTemp, clauseOrSecFromRead, parentCascadeInfo, parentModel, docLevelNumbering) {

	// Initialize with default values.
	clauseOrSecTemp.cascade = ko.observable((parentCascadeInfo) ? parentCascadeInfo : parentModel.cascadeDocLevel());
	clauseOrSecTemp.inherited = ko.observable(true);
	clauseOrSecTemp.nonumbering = ko.observable(false);
	clauseOrSecTemp.numberingStyle = ko.observable("");
	var numberingStyleFromContract = null;
	if (clauseOrSecFromRead && getTextValue(clauseOrSecFromRead.StylingAttributes)) {
		var cascadeFlagFromContract = null;
		var nonumberingFromContract = null;
		try {
			var stylingAttributesObj = JSON.parse(getTextValue(clauseOrSecFromRead.StylingAttributes));
			cascadeFlagFromContract = stylingAttributesObj.cascading;
			nonumberingFromContract = stylingAttributesObj.nonumbering;
			numberingStyleFromContract = stylingAttributesObj.numberingstyle;
		} catch (e) { }

		// Add cascade info.
		if (cascadeFlagFromContract && _CASCADE_INHERITED === cascadeFlagFromContract) {
			clauseOrSecTemp.cascade(parentCascadeInfo ? parentCascadeInfo : parentModel.cascadeDocLevel());
			clauseOrSecTemp.inherited(true);
		} else if (cascadeFlagFromContract && _CASCADE_OFF === cascadeFlagFromContract) {
			clauseOrSecTemp.cascade(_CASCADE_OFF);
			clauseOrSecTemp.inherited(false);
		} else {
			clauseOrSecTemp.cascade(_CASCADE_ON);
			clauseOrSecTemp.inherited(false);
		}

		// Add no numbering info.
		clauseOrSecTemp.nonumbering(getNoNumberingFlag(nonumberingFromContract));
	}

	// Add numbering style. 
	clauseOrSecTemp.numberingStyle(getNumberingStyle(numberingStyleFromContract, docLevelNumbering));
}

// Reloading all CK editor instances.
function _reLoadSectionCKEditor(iSectionOrClause, destroyOnly) {
	if (iSectionOrClause.type === _CLAUSE) {
		destroyCkEditorInstance(iSectionOrClause.containerID);
		if (!destroyOnly) {
			loadCKEditor(iSectionOrClause.containerID + '_clauseHTMLContent');
		}
	}
	if (iSectionOrClause.container && iSectionOrClause.container().length > 0) {
		iSectionOrClause.container().forEach(sectionOrclause => {
			if (sectionOrclause.type === _CLAUSE) {
				destroyCkEditorInstance(sectionOrclause.containerID);
				if (!destroyOnly) {
					loadCKEditor(sectionOrclause.containerID + '_clauseHTMLContent');
				}
			}
			if (sectionOrclause.container().length > 0) {
				_reLoadSectionCKEditor(sectionOrclause, destroyOnly)
			}
		});
	}
}

// will check container is related to targetContainer or not.
function ancestorsCheck(container, targetContainer) {
	var result = false;
	if (container) {
		var temp = targetContainer;
		while (temp) {
			if (container == temp) {
				result = true;
				break;
			}
			temp = temp.parentContainer;
		}
	}
	return result;
}