/*********** Variables. ************************/

// Variable for reloading CK Editor instance.
var REFRESH_CK_EDITOR_INSTANCE = false;

var replaceContainersMap = new Map();
var sourceReplaceMap = new Map();
/*********** Models. ************************/

// Sections and clause model.
var SectionsAndClausesDataModel = function () {
	var self = this;
	this.contract_LifecycleState = ko.observable();
	this.contract_Z_INT_Status = ko.observable();
	this.template_LifecycleState = ko.observable();
	this.template_Z_INT_Status = ko.observable();
	this.SCMappingsToBind = ko.observableArray([]);
	this.optionsCaption = ko.observable("No sections added");
	this.newTMPFormat = ko.observable(false);
	this.DeletedClauses = {};
	this.DeletedSections = {};
	this.currentOpenOptions = ko.observable();
	this.cutContainerData = ko.observable();
	this.cutContainerParentData = ko.observable();
	this.pasteContainerData = ko.observable();
	this.pasteContainerParentData = ko.observable();
	this.addSectionData = ko.observable();
	this.addSectionParentData = ko.observable();
	this.addSectionParentParentData = ko.observable();
	this.showSectionActionOptions = ko.observable(false);
	this.cascadeDocLevel = ko.observable(_CASCADE_ON);
	this.addSectionBefore = function () {
		if (self.addSectionData()) {
			var pos = self.addSectionParentData().container ? self.addSectionParentData().container().indexOf(self.addSectionData()) : self.addSectionParentData().SCMappingsToBind().indexOf(self.addSectionData());
			_addSectionAftBef(pos);
		}
		self.showSectionActionOptions(false);
	}
	this.addSectionAfter = function () {
		if (self.addSectionData()) {
			var pos = self.addSectionParentData().container ? self.addSectionParentData().container().indexOf(self.addSectionData()) : self.addSectionParentData().SCMappingsToBind().indexOf(self.addSectionData());
			_addSectionAftBef(pos + 1);
		}
		self.showSectionActionOptions(false);
	}
	function _addSectionAftBef(pos) {
		if (!self.addSectionParentData().container) {
			addSection(pos);
		} else {
			addNestedSection(self.addSectionParentData(), pos);
		}
		isDirty = true;
		//updateDefaultNumberingStyle();
		_clearcutPasteData();
	}
	this.change_dropDown = function (_item, event) {
		$('#sectionList').val(_item.containerID);
		event.stopPropagation();
	}
	this.cutContainer = function (data, parent, event) {
		if (data.options) {
			data.options(!data.options());
		}
		if (!self.cutContainerData()) {
			_clearcutPasteData();
			self.cutContainerData(data);
			self.cutContainerParentData(parent);
		}
		event.stopPropagation();
	}
	this.cancelCut = function () {
		_clearcutPasteData();
	}
	function _clearcutPasteData() {
		self.cutContainerData(null);
		self.pasteContainerData(null);
		self.pasteContainerParentData(null);
		self.cutContainerParentData(null);
		self.addSectionData(null);
		self.addSectionParentData(null);
		self.addSectionParentParentData(null);

	}
	this.clearcutPasteData = function () {
		self.cutContainerData(null);
		self.pasteContainerData(null);
		self.pasteContainerParentData(null);
		self.cutContainerParentData(null);
		self.addSectionData(null);
		self.addSectionParentData(null);
		self.addSectionParentParentData(null);
	}
	this.selectContainer = function (data, parent, parentparent, event) {
		if (self.cutContainerData()) {
			if ((self.cutContainerData() != data) && !ancestorsCheck(self.cutContainerData(), data)) {
				self.pasteContainerData(data);
				self.pasteContainerParentData(parent);
			}
		} else {
			self.addSectionData(data);
			self.addSectionParentData(parent);
			self.addSectionParentParentData(parentparent);
		}
		updateNumberingStyleOptions(data);
		if (event) {
			event.stopPropagation();
		}
	}
	this.pasteBeforeContainer = function () {
		if (self.pasteContainerData()) {
			_pasteContainerData(0);
			_clearcutPasteData();
		}
	}
	this.pasteAfterContainer = function () {
		if (self.pasteContainerData()) {
			_pasteContainerData(1);
			_clearcutPasteData();
		}
	}
	this.indentIncrease = function () {
		if (self.addSectionData() && self.addSectionParentParentData() && (self.addSectionParentParentData().container || self.addSectionParentParentData().SCMappingsToBind)) {
			var currentPos = self.addSectionParentParentData().container ? self.addSectionParentParentData().container().indexOf(self.addSectionParentData()) : self.addSectionParentParentData().SCMappingsToBind().indexOf(self.addSectionParentData());
			var currentDataPos = self.addSectionParentData().container ? self.addSectionParentData().container().indexOf(self.addSectionData()) : self.addSectionParentData().SCMappingsToBind().indexOf(self.addSectionData());
			self.addSectionParentData().container ? self.addSectionParentData().container.remove(self.addSectionData()) : self.addSectionParentData().SCMappingsToBind.remove(self.addSectionData());
			if (REFRESH_CK_EDITOR_INSTANCE) {
				_reLoadSectionCKEditor(self.addSectionData(), true);
			}
			_updateOrderFromIndex(self.addSectionParentData(), currentDataPos);
			var newParentContainerId = self.addSectionParentParentData().containerID ? self.addSectionParentParentData().containerID : "";
			_updateIsMovedToRoot(self.addSectionData(), self.addSectionData().parentContainerID, newParentContainerId);
			self.addSectionData().parentContainerID = newParentContainerId;
			self.addSectionData().parentContainer = self.addSectionParentParentData();
			self.addSectionParentParentData().container ? self.addSectionParentParentData().container.splice(currentPos + 1, 0, self.addSectionData()) : self.addSectionParentParentData().SCMappingsToBind.splice(currentPos + 1, 0, self.addSectionData())
			_updateOrderFromIndex(self.addSectionParentParentData(), currentPos + 1);
			if (REFRESH_CK_EDITOR_INSTANCE) {
				_reLoadSectionCKEditor(self.addSectionData(), false);
			}
			isDirty = true;
			// updateDefaultNumberingStyle();
			updateNumberingStyleWithParentStyle(self.addSectionData(), l_current_numberingFormat);
			if (self.addSectionData().inherited()) {
				var newStatus = self.addSectionParentParentData().cascade ? self.addSectionParentParentData().cascade() : self.cascadeDocLevel();
				_cascadeToggleAllNodes(self.addSectionData(), newStatus, true);
			}
		}
		_clearcutPasteData();
	}

	function _updateIsMovedToRoot(clauseOrSec, prevParentContainerId, newParentContainerId) {
		if (prevParentContainerId && !newParentContainerId) {
			clauseOrSec.isMovedToRoot = 'true';
		}
	}

	this.indentDecrease = function () {
		if (self.addSectionData()) {
			var currentPos = self.addSectionParentData().container ? self.addSectionParentData().container().indexOf(self.addSectionData()) : self.addSectionParentData().SCMappingsToBind().indexOf(self.addSectionData());
			if (currentPos > 0) {
				var sourceObsData = self.addSectionParentData().container ? self.addSectionParentData().container()[currentPos - 1] : self.addSectionParentData().SCMappingsToBind()[currentPos - 1];
				self.addSectionParentData().container ? self.addSectionParentData().container.remove(self.addSectionData()) : self.addSectionParentData().SCMappingsToBind.remove(self.addSectionData());
				self.addSectionData().parentContainerID = sourceObsData.containerID;
				self.addSectionData().parentContainer = sourceObsData;
				_updateOrderActionOnSectionOrClause(self.addSectionData());
				_updateOrderFromIndex(self.addSectionParentData(), currentPos);
				sourceObsData.container.push(self.addSectionData());
				if (REFRESH_CK_EDITOR_INSTANCE) {
					_reLoadSectionCKEditor(self.addSectionData(), false);
				}
				isDirty = true;
				// updateDefaultNumberingStyle();
				updateNumberingStyleWithParentStyle(self.addSectionData(), l_current_numberingFormat);
				if (self.addSectionData().inherited()) {
					var newStatus = sourceObsData.cascade ? sourceObsData.cascade() : l_sectionandclause_model.cascadeDocLevel();
					_cascadeToggleAllNodes(self.addSectionData(), newStatus, true);
				}
			}
		}
		_clearcutPasteData();
	}

	function _updateOrderFromIndex(parentObservable, pos) {
		if (parentObservable.container) {
			parentObservable.container().forEach((clauseOrSec, index) => {
				if (index >= pos) {
					_updateOrderActionOnSectionOrClause(clauseOrSec);
				}
			});
		} else {
			parentObservable.SCMappingsToBind().forEach((clauseOrSec, index) => {
				if (index >= pos) {
					_updateOrderActionOnSectionOrClause(clauseOrSec);
				}
			});
		}
	}

	function _pasteContainerData(pos) {
		var cutIndex = -1;
		var pasteIndex = -1;
		if (self.pasteContainerParentData().container) {
			if (self.cutContainerParentData().SCMappingsToBind) {
				cutIndex = self.cutContainerParentData().SCMappingsToBind.indexOf(self.cutContainerData());
				self.cutContainerParentData().SCMappingsToBind.remove(self.cutContainerData());
			} else {
				cutIndex = self.cutContainerParentData().container.indexOf(self.cutContainerData());
				self.cutContainerParentData().container.remove(self.cutContainerData());
			}
			var index = self.pasteContainerParentData().container().indexOf(self.pasteContainerData());
			if (REFRESH_CK_EDITOR_INSTANCE) {
				_reLoadSectionCKEditor(self.cutContainerData(), true);
			}
			self.pasteContainerParentData().container.splice(index + pos, 0, _updateSectionData());

			if (REFRESH_CK_EDITOR_INSTANCE) {
				_reLoadSectionCKEditor(self.cutContainerData(), false);
			}
		} else {
			if (self.cutContainerParentData().SCMappingsToBind) {
				cutIndex = self.cutContainerParentData().SCMappingsToBind.indexOf(self.cutContainerData());
				self.cutContainerParentData().SCMappingsToBind.remove(self.cutContainerData());
			} else {
				cutIndex = self.cutContainerParentData().container.indexOf(self.cutContainerData());
				self.cutContainerParentData().container.remove(self.cutContainerData());
			}
			var index = self.pasteContainerParentData().SCMappingsToBind().indexOf(self.pasteContainerData());
			if (REFRESH_CK_EDITOR_INSTANCE) {
				_reLoadSectionCKEditor(self.cutContainerData(), true);
			}
			self.pasteContainerParentData().SCMappingsToBind.splice(index + pos, 0, _updateSectionData());
			if (REFRESH_CK_EDITOR_INSTANCE) {
				_reLoadSectionCKEditor(self.cutContainerData(), false);
			}
		}
		if (self.cutContainerData().inherited()) {
			var newStatus = self.pasteContainerParentData().cascade ? self.pasteContainerParentData().cascade() : self.cascadeDocLevel();
			_cascadeToggleAllNodes(self.cutContainerData(), newStatus, true);
		}
		// updateDefaultNumberingStyle();
		pasteIndex = index + pos;
		_updateClauseOrderFromPos(self.cutContainerParentData().SCMappingsToBind ? self.cutContainerParentData().SCMappingsToBind : self.cutContainerParentData().container, cutIndex)
		_updateClauseOrderFromPos(self.pasteContainerParentData().SCMappingsToBind ? self.pasteContainerParentData().SCMappingsToBind : self.pasteContainerParentData().container, pasteIndex)
		isDirty = true;
	}

	function _updateClauseOrderFromPos(secOrClaArrObs, pos) {
		if (pos > -1 && secOrClaArrObs && secOrClaArrObs().length > 0) {
			for (var index = pos; index < secOrClaArrObs().length; index++) {
				var sectionOdClause = secOrClaArrObs()[index];
				sectionOdClause.clauseOrder = index;
				_updateOrderActionOnSectionOrClause(sectionOdClause);
			}
		}
	}

	function _updateSectionData() {
		_updateOrderActionOnSectionOrClause(self.cutContainerData());
		_updateOrderActionOnSectionOrClause(self.cutContainerParentData());
		_updateOrderActionOnSectionOrClause(self.pasteContainerParentData());
		var newParentContainerId = self.pasteContainerParentData().SCMappingsToBind ? "" : self.pasteContainerParentData().containerID;
		_updateIsMovedToRoot(self.cutContainerData(), self.cutContainerData().parentContainerID, newParentContainerId);
		self.cutContainerData().parentContainerID = newParentContainerId;
		self.cutContainerData().parentContainer = newParentContainerId ? self.pasteContainerParentData() : null;
		updateNumberingStyleWithParentStyle(self.cutContainerData(), l_current_numberingFormat);
		return self.cutContainerData();
	}

}

/*********************** Methods. (Actions) *************************/

// Select a section or clause.
function selectSection(iValue, bSetSelection, bSetValue, bNoScrolling) {
	$(".droptarget_section").css('border', '');
	$(".droptarget_clause").css('border', '');
	var l_sectionElement = document.getElementById(iValue + '_Container');
	if (l_sectionElement) {
		if (!bNoScrolling) {
			$('#m_secandcls').animate({
				scrollTop: l_sectionElement.offsetTop - 70
			}, 500);
		}
		if (bSetSelection) {
			sectionList.selectedSectionOrder = l_sectionElement.getAttribute("sectionorder");
		}
		if (bSetValue) {
			sectionList.value = iValue;
		}
		$('#' + iValue + '_Container').css({ 'border-style': 'solid', 'border-color': 'rgba(3, 122, 252, 0.89)' });
		var sectionArr = l_sectionandclause_model.SCMappingsToBind().filter(e => iValue === e.containerID);
		if (sectionArr.length > 0) {
			_updateAddSectionParentData(sectionArr[0], l_sectionandclause_model, null);
		}
	}
}

// Delete a section.
function deleteSection(l_index) {
	$("#sectionModal").modal();
	$('button#deleteSection').off("click");
	$('button#deleteSection').on('click', function (_event) {
		l_sectionToDelete = l_sectionandclause_model.SCMappingsToBind.splice(l_index, 1)[0];
		for (var i = l_index; i < l_sectionandclause_model.SCMappingsToBind().length; i++) {
			if (!l_sectionandclause_model.SCMappingsToBind()[i].action) {
				l_sectionandclause_model.SCMappingsToBind()[i].action = _UPDATE_SECTION;
			}
		}
		if (!l_sectionToDelete.isNew) {
			l_section = {};
			l_section.containingSectionID = l_sectionToDelete.containingSectionID;
			l_sectionandclause_model.DeletedSections.Sections.Section.push(l_section);
		}
		if (sectionList.length === 0) {
			sectionList.selectedSectionOrder = null;
			document.getElementById("defaultContainer").style.display = "block";
			l_sectionandclause_model.optionsCaption("No sections added");
		}
		disableSaveandCancel(false);
		l_sectionandclause_model.clearcutPasteData();
		isDirty = true;
	});

}

// Delete a sub section.
function deleteSubSection(l_index, parent, data) {
	if (data.options) {
		data.options(false);
	}
	$("#sectionModal").modal();
	$('button#deleteSection').off("click");
	$('button#deleteSection').on('click', function (_event) {
		if (data && parent.container) {
			l_index = parent.container.indexOf(data);
			l_sectionToDelete = parent.container.remove(data);
			for (var i = l_index; i < parent.container.length; i++) {
				if (parent.container[i].type === _SECTION && !parent.container[i].action) {
					parent.container[i].action = _UPDATE_ORDER;
				}
			}
		} else {
			l_index = l_sectionandclause_model.SCMappingsToBind.indexOf(data);
			l_sectionToDelete = l_sectionandclause_model.SCMappingsToBind.remove(data);
			for (var i = l_index; i < l_sectionandclause_model.SCMappingsToBind().length; i++) {
				if (l_sectionandclause_model.SCMappingsToBind()[i].type === _SECTION && !l_sectionandclause_model.SCMappingsToBind()[i].action) {
					l_sectionandclause_model.SCMappingsToBind()[i].action = _UPDATE_ORDER;
				}
			}
		}

		if (!data.isNew) {
			l_sectionandclause_model.DeletedSections.Sections.Section.push(data);
			isDirty = true;
		}
		if (sectionList.length === 0) {
			sectionList.selectedSectionOrder = null;
			document.getElementById("defaultContainer").style.display = "block";
			l_sectionandclause_model.optionsCaption("No sections added");
		}
		disableSaveandCancel(false);
		l_sectionandclause_model.clearcutPasteData();
	});

}

// Delete a clause.
function deleteClause(l_index, parent, data, event) {
	$("#clauseModal").modal();
	$('button#removeClause').off("click");
	$('button#removeClause').on('click', function (_event) {
		var l_section = parent;
		var l_clause = data;
		if (parent.container) {
			l_section.container.remove(data);
			// _removeReplaceSourceCont(l_section.container, data);
			for (var i = l_index; i < l_section.container().length; i++) {
				if (!l_section.container()[i].action) {
					l_section.container()[i].action = _UPDATE_ORDER;
				}
			}
		} else {
			l_index = l_sectionandclause_model.SCMappingsToBind.indexOf(data);
			l_sectionandclause_model.SCMappingsToBind.remove(data);
			// _removeReplaceSourceCont(l_sectionandclause_model.SCMappingsToBind, data);
			for (var i = l_index; i < l_sectionandclause_model.SCMappingsToBind().length; i++) {
				if (!l_sectionandclause_model.SCMappingsToBind()[i].action) {
					l_sectionandclause_model.SCMappingsToBind()[i].action = _UPDATE_ORDER;
				}
			}
		}
		// if (!replaceContainersMap.has(l_clause.containerID)) {
		checkAndDeleteClause(l_clause);
		// }
		disableSaveandCancel(false);
		l_sectionandclause_model.clearcutPasteData();
	});
	isDirty = true;
}

/**
 * 
 * Removes the Replace source container on Replaced container delete.
*/
function _removeReplaceSourceCont(parentContainer, currentContainer) {
	if (replaceContainersMap.has(currentContainer.containerID)) {// Replaced container
		var sourceCont = replaceContainersMap.get(currentContainer.containerID).sourceContainer;
		currentContainer.container.removeAll();
		parentContainer.remove(sourceCont);
		checkAndDeleteClause(sourceCont);
	} else {//If Source container is deleted
		replaceContainersMap.forEach((val, key) => {
			if (val.sourceContainer === currentContainer) {
				var repCont = val.replaceContainer;
				repCont.container.removeAll();
				parentContainer.remove(repCont);
				// checkAndDeleteClause(repCont);
			}
		});
	}
}

// Move a section down.
function moveDown(sectionOrClause, sectionIndex, parent, reloadCKInstance, event) {
	if (sectionOrClause.type === _SECTION) {
		sectionOrClause.options(false);
	}
	var lengthBool = parent.container ? (parent.container().length > (sectionIndex + 1)) : (parent.SCMappingsToBind().length > (sectionIndex + 1))
	if (parent && lengthBool) {
		$(".droptarget_section").css('border', '');
		var sectionToMoveDown = sectionOrClause;
		var l_otherSection = parent.container ? parent.container()[sectionIndex + 1] : parent.SCMappingsToBind()[sectionIndex + 1];
		if (sectionToMoveDown && l_otherSection) {
			sectionToMoveDown.clauseOrder = sectionToMoveDown.clauseOrder + 1;
			l_otherSection.clauseOrder = l_otherSection.clauseOrder - 1;
			if (parent.container) {
				parent.container.remove(sectionOrClause);   //droptarget
				parent.container.splice(sectionIndex + 1, 0, sectionToMoveDown);
			} else {
				parent.SCMappingsToBind.remove(sectionOrClause);   //droptarget
				parent.SCMappingsToBind.splice(sectionIndex + 1, 0, sectionToMoveDown);
			}
			if (sectionOrClause.type === _SECTION) {
				$("#" + sectionOrClause.containerID + "_Container").css('margin-bottom', '0px');
				selectSection(sectionToMoveDown.containingSectionID, true, true);
				disableSaveandCancel(false);
			}
			isDirty = true;
			if (reloadCKInstance) {
				_reLoadSectionCKEditor(sectionOrClause);
			}
			if (!sectionToMoveDown.action) {
				sectionToMoveDown.action = _UPDATE_ORDER;
			} else if (sectionOrClause.type === _SECTION && sectionToMoveDown.action === _UPDATE_SECTION) {
				sectionToMoveDown.action = _UPDATE_SECTION_NAME_ORDER;
			} else if (sectionOrClause.type === _CLAUSE && sectionToMoveDown.action === _UPDATE_LINKED_CLAUSE) {
				sectionToMoveDown.action = _UPDATE_LINKED_CLAUSE_ORDER;
			} else if (sectionOrClause.type === _CLAUSE && sectionToMoveDown.action === _UPDATE_NONSTANDARD_CLAUSE) {
				sectionToMoveDown.action = _UPDATE_NONSTANDARD_CLAUSE_ORDER;
			} else if (sectionOrClause.type === _CLAUSE && sectionToMoveDown.action === _CONVERT_TO_NONSTANDARD) {
				sectionToMoveDown.action = _CONVERT_TO_NONSTANDARD_ORDER;
			}
			if (!l_otherSection.action) {
				l_otherSection.action = _UPDATE_ORDER;
			} else if (sectionOrClause.type === _SECTION && l_otherSection.action === _UPDATE_SECTION) {
				l_otherSection.action = _UPDATE_SECTION_NAME_ORDER;
			} else if (sectionOrClause.type === _CLAUSE && l_otherSection.action === _UPDATE_LINKED_CLAUSE) {
				l_otherSection.action = _UPDATE_LINKED_CLAUSE_ORDER;
			} else if (sectionOrClause.type === _CLAUSE && l_otherSection.action === _UPDATE_NONSTANDARD_CLAUSE) {
				l_otherSection.action = _UPDATE_NONSTANDARD_CLAUSE_ORDER;
			} else if (sectionOrClause.type === _CLAUSE && l_otherSection.action === _CONVERT_TO_NONSTANDARD) {
				l_otherSection.action = _CONVERT_TO_NONSTANDARD_ORDER;
			}
		}
	}
}


// Move a section up.
function moveUp(sectionOrClause, sectionIndex, parent, reloadCKInstance, event) {
	if (sectionOrClause.type === _SECTION) {
		sectionOrClause.options(false);
	}
	if (parent) {
		$(".droptarget_section").css('border', '');
		sectionToMoveup = sectionOrClause;
		var l_otherSection = parent.container ? parent.container()[sectionIndex - 1] : parent.SCMappingsToBind()[sectionIndex - 1];
		if (sectionIndex != 0) {
			if (parent.container) {
				parent.container.remove(sectionToMoveup);   //droptarget
				parent.container.splice(sectionIndex - 1, 0, sectionToMoveup);
			} else {
				parent.SCMappingsToBind.remove(sectionToMoveup);   //droptarget
				parent.SCMappingsToBind.splice(sectionIndex - 1, 0, sectionToMoveup);
			}
			sectionToMoveup.clauseOrder = sectionToMoveup.clauseOrder - 1;
			l_otherSection.clauseOrder = l_otherSection.clauseOrder + 1;
			if (sectionOrClause.type === _SECTION) {
				selectSection(sectionToMoveup.containingSectionID, true, true);
				disableSaveandCancel(false);
			}
			isDirty = true;
			if (reloadCKInstance) {
				_reLoadSectionCKEditor(sectionOrClause);
			}
			if (!sectionToMoveup.action) {
				sectionToMoveup.action = _UPDATE_ORDER;
			} else if (sectionOrClause.type === _SECTION && sectionToMoveup.action === _UPDATE_SECTION) {
				sectionToMoveup.action = _UPDATE_SECTION_NAME_ORDER;
			} else if (sectionOrClause.type === _CLAUSE && sectionToMoveup.action === _UPDATE_LINKED_CLAUSE) {
				sectionToMoveup.action = _UPDATE_LINKED_CLAUSE_ORDER;
			} else if (sectionOrClause.type === _CLAUSE && sectionToMoveup.action === _UPDATE_NONSTANDARD_CLAUSE) {
				sectionToMoveup.action = _UPDATE_NONSTANDARD_CLAUSE_ORDER;
			} else if (sectionOrClause.type === _CLAUSE && sectionToMoveup.action === _CONVERT_TO_NONSTANDARD) {
				sectionToMoveup.action = _CONVERT_TO_NONSTANDARD_ORDER;
			}
			if (!l_otherSection.action) {
				l_otherSection.action = _UPDATE_ORDER;
			} else if (sectionOrClause.type === _SECTION && l_otherSection.action === _UPDATE_SECTION) {
				l_otherSection.action = _UPDATE_SECTION_NAME_ORDER;
			} else if (sectionOrClause.type === _CLAUSE && l_otherSection.action === _UPDATE_LINKED_CLAUSE) {
				l_otherSection.action = _UPDATE_LINKED_CLAUSE_ORDER;
			} else if (sectionOrClause.type === _CLAUSE && l_otherSection.action === _UPDATE_NONSTANDARD_CLAUSE) {
				l_otherSection.action = _UPDATE_NONSTANDARD_CLAUSE_ORDER;
			} else if (sectionOrClause.type === _CLAUSE && l_otherSection.action === _CONVERT_TO_NONSTANDARD) {
				l_otherSection.action = _CONVERT_TO_NONSTANDARD_ORDER;
			}
		}
	}
}

// To remove numbering style.
function removeNumberingStyle() {
	if (l_sectionandclause_model.addSectionData()) {
		var existedValue = l_sectionandclause_model.addSectionData().nonumbering();
		if (!existedValue) {
			_updateOrderActionOnSectionOrClause(l_sectionandclause_model.addSectionData());
			_cascadeToggleAllNodes(l_sectionandclause_model.addSectionData(), _CASCADE_OFF, true);
			_updateNumberingStyleToSimple(l_sectionandclause_model.addSectionData());
		}
		l_sectionandclause_model.addSectionData().nonumbering(true);
		l_sectionandclause_model.addSectionData().inherited(false);
		$("#option_no-numbering").addClass('disable_option');
		isDirty = true;
	}
}

// To toggle numbering style.
function toggleNoNumbering() {
	if (l_sectionandclause_model.addSectionData()) {
		var existedValue = l_sectionandclause_model.addSectionData().nonumbering();
		_updateOrderActionOnSectionOrClause(l_sectionandclause_model.addSectionData());
		if (!existedValue) {
			_cascadeToggleAllNodes(l_sectionandclause_model.addSectionData(), _CASCADE_OFF, true);
		}
		l_sectionandclause_model.addSectionData().nonumbering(!existedValue);
		l_sectionandclause_model.addSectionData().inherited(false);
		isDirty = true;
	}
}

// to update numbering style.
function _updateNumberingStyle(i_numberingFormat) {
	// console.log("cascadeToggle");
	if (l_sectionandclause_model.addSectionData() &&
		l_sectionandclause_model.addSectionData().parentContainer) {
		if (!i_numberingFormat.includes("-simple") &&
			l_sectionandclause_model.addSectionData().parentContainer.numberingStyle() !== i_numberingFormat) {
			event.stopPropagation();
		} else {
			l_sectionandclause_model.addSectionData().nonumbering(false);
			for (var i = 0; i < l_sectionandclause_model.addSectionData().parentContainer.container().length; i++) {
				_updateNumberingStyleOnItem(l_sectionandclause_model.addSectionData().parentContainer.container()[i], i_numberingFormat, true);
				if (i_numberingFormat.includes("-simple")) {
					_cascadeToggleAllNodes(l_sectionandclause_model.addSectionData().parentContainer.container()[i], _CASCADE_OFF, true);
				} else {
					_cascadeToggleAllNodes(l_sectionandclause_model.addSectionData().parentContainer.container()[i], _CASCADE_ON, true);
				}
				l_sectionandclause_model.addSectionData().parentContainer.container()[i].inherited(false);
			}

			if ($("#option_no-numbering").hasClass('disable_option')) {
				$("#option_no-numbering").removeClass('disable_option');
			}
			isDirty = true;
		}
	} else {
		// Global change of style, means all elements need to be changed.
		l_current_numberingFormat = i_numberingFormat;
		for (var i = 0; i < l_sectionandclause_model.SCMappingsToBind().length; i++) {
			_updateNumberingStyleOnItem(l_sectionandclause_model.SCMappingsToBind()[i], i_numberingFormat, true);
			if (i_numberingFormat.includes("-simple")) {
				_cascadeToggleAllNodes(l_sectionandclause_model.SCMappingsToBind()[i], _CASCADE_OFF, true);
			} else {
				_cascadeToggleAllNodes(l_sectionandclause_model.SCMappingsToBind()[i], _CASCADE_ON, true);
			}
		}
		isDirty = true;
	}

}

// update style of a component and its children.
function _updateNumberingStyleOnItem(container, newNumberingStyle, updateChildrenFlag) {
	if (container) {
		container.numberingStyle(getNumberingStyle(newNumberingStyle, l_current_numberingFormat));
		container.nonumbering(false);
		_updateOrderActionOnSectionOrClause(container);
		if (updateChildrenFlag && container.container().length > 0) {
			for (var i = 0; i < container.container().length; i++) {
				_updateNumberingStyleOnItem(container.container()[i], newNumberingStyle, updateChildrenFlag);
			}
		}
	}
}

// cascade toggle.
function cascadeToggle() {
	// console.log("cascadeToggle");
	if (l_sectionandclause_model.addSectionData()) {
		// 		
		var newStatus = l_sectionandclause_model.addSectionData().cascade() === _CASCADE_ON ? _CASCADE_OFF : _CASCADE_ON;
		_cascadeToggleAllNodes(l_sectionandclause_model.addSectionData(), newStatus, true);
		l_sectionandclause_model.addSectionData().inherited(false);
		_updateOrderActionOnSectionOrClause(l_sectionandclause_model.addSectionData());
	} else {
		var newStatus = l_sectionandclause_model.cascadeDocLevel() === _CASCADE_ON ? _CASCADE_OFF : _CASCADE_ON;
		l_sectionandclause_model.cascadeDocLevel(newStatus);
		for (var i = 0; i < l_sectionandclause_model.SCMappingsToBind().length; i++) {
			_cascadeToggleAllNodes(l_sectionandclause_model.SCMappingsToBind()[i], newStatus, true);
		}
	}
	isDirty = true;
	if (document.getElementById("multilevel_ON") != null)
		document.getElementById("multilevel_ON").title = getTranslationMessage("Multilevel numbering: ON");
	if (document.getElementById("multilevel_OFF") != null)
		document.getElementById("multilevel_OFF").title = getTranslationMessage("Multilevel numbering: OFF");
}

// cascade toggle of a component and its children.
function _cascadeToggleAllNodes(container, newCascadeStatus, childrenToggleFlag) {
	if (container && !container.nonumbering()) {
		container.cascade(newCascadeStatus);
		if (!container.inherited()) {
			container.inherited(true);
			_updateOrderActionOnSectionOrClause(container);
		}
		if (childrenToggleFlag && container.container().length > 0) {
			for (var i = 0; i < container.container().length; i++) {
				_cascadeToggleAllNodes(container.container()[i], newCascadeStatus, childrenToggleFlag);
			}
		}
	}
}


/************* Supporting functions. */

/**  Reading template info. */
function _populateOldSectionRecord(SCMappingsFromRead, clauseFromRead, clauseTemp) {
	var sectionArr = SCMappingsFromRead().filter(section => section.type === _SECTION ? (section.sectionOrder === (+clauseFromRead.Owner.SectionOrder)) : false);
	var sectionTemp = {};
	if (Array.isArray(sectionArr) && sectionArr.length > 0) {
		sectionTemp = sectionArr[0];
	}
	if (clauseFromRead.Owner.SectionOrder) {
		sectionTemp.sectionOrder = parseInt(getTextValue(clauseFromRead.Owner.SectionOrder));
		sectionTemp.clauseOrder = sectionTemp.sectionOrder;
	}
	addNumberingAndCascadeInfo(clauseTemp, null, null, l_sectionandclause_model, l_current_numberingFormat);
	if (Array.isArray(sectionArr) && sectionArr.length === 0) {
		sectionTemp.type = _SECTION;
		sectionTemp.showContainer = 'true';
		addNumberingAndCascadeInfo(sectionTemp, null, null, l_sectionandclause_model, l_current_numberingFormat);
		sectionTemp.options = ko.observable(false);
		if (clauseFromRead.Owner.Name) {
			sectionTemp.sectionName = ko.observable(getTextValue(clauseFromRead.Owner.Name));
			sectionTemp.sectionName.subscribe(function (_newText) {
				isDirty = true;
			});
		}
		sectionTemp.containingSectionID = clauseFromRead['ContainingClauses-id'].Id1;
		sectionTemp.containingSectionItemID = clauseFromRead['ContainingClauses-id'].ItemId1;
		sectionTemp.containerItemID = clauseFromRead['ContainingClauses-id'].ItemId2;
		// For making all at same page.old and new section object.
		sectionTemp.initialContainingClauseID = "";
		if (clauseFromRead.Owner.InitialContainingSectionID) {
			sectionTemp.initialContainingSectionID = getTextValue(clauseFromRead.Owner.InitialContainingSectionID);
		}
		else {
			sectionTemp.initialContainingSectionID = clauseFromRead['ContainingClauses-id'].Id1;
		}
		sectionTemp.containerID = getNewSectionId();
		sectionTemp.isNew = false;
		sectionTemp.isMovedToRoot = 'false';
		sectionTemp.parentContainerID = "";
		if (!sectionTemp.container) {
			sectionTemp.container = ko.observableArray([]);
		}
	}
	if (clauseTemp.containerID) { // Execute this code if there is clause inside it.
		// clauseTemp.containerID = getNewContainingClauseId();
		clauseTemp.showContainer = 'true';
		clauseTemp.type = _CLAUSE;
		clauseTemp.sectionOrder = sectionTemp.sectionOrder;
		clauseTemp.sectionName = sectionTemp.sectionName;
		clauseTemp.initialContainingSectionID = sectionTemp.initialContainingSectionID;
		clauseTemp.parentContainerID = sectionTemp.containerID;
		clauseTemp.clauseOrder = parseInt(clauseFromRead.ClauseOrder);
		if (clauseFromRead.InitialContainingClauseID) {
			clauseTemp.initialContainingClauseID = clauseFromRead.InitialContainingClauseID;
		}
		else {
			clauseTemp.initialContainingClauseID = "";
		}
		sectionTemp.container.push(clauseTemp);
		clauseTemp.parentContainer = sectionTemp;
	}
	if (Array.isArray(sectionArr) && sectionArr.length === 0) {
		SCMappingsFromRead.push(sectionTemp);
	}
}

function _populateSection(sectionTemp, sectionFromRead, SCMappingsFromRead, parentCascade) {
	if (sectionFromRead.LinkedSection) {
		sectionTemp.type = _SECTION;
		sectionTemp.showContainer = sectionFromRead.showContainer ? sectionFromRead.showContainer : 'true';
		addNumberingAndCascadeInfo(sectionTemp, sectionFromRead, parentCascade, l_sectionandclause_model, l_current_numberingFormat);
		sectionTemp.options = ko.observable(false);
		if (sectionFromRead.LinkedSection.SectionOrder) {
			sectionTemp.sectionOrder = parseInt(getTextValue(sectionFromRead.LinkedSection.SectionOrder));
		}
		sectionTemp.clauseOrder = +sectionFromRead.ClauseOrder;
		if (sectionFromRead.LinkedSection.Name) {
			sectionTemp.sectionName = ko.observable(getTextValue(sectionFromRead.LinkedSection.Name));
			sectionTemp.sectionName.subscribe(function (_newText) {
				isDirty = true;
			});
		}
		sectionTemp.containingSectionID = sectionFromRead.LinkedSection['ContainingSections-id'].Id1;
		if (sectionFromRead.LinkedSection.InitialContainingSectionID) {
			sectionTemp.initialContainingSectionID = getTextValue(sectionFromRead.LinkedSection.InitialContainingSectionID);
		}
		else {
			sectionTemp.initialContainingSectionID = "";
		}
		sectionTemp.isNew = false;
		sectionTemp.isMovedToRoot = 'false';
		sectionTemp.containerID = sectionFromRead['ContainingClauses-id'].Id2;
		if (!sectionFromRead.InitialContainingClauseID) {
			sectionTemp.initialContainingClauseID = sectionFromRead['ContainingClauses-id'].Id2;
		} else {
			sectionTemp.initialContainingClauseID = sectionFromRead.InitialContainingClauseID;;
		}
		sectionTemp.clauseName = "";
		sectionTemp.clauseHTMLContent = ""
		sectionTemp.container = ko.observableArray([]);
		if (sectionFromRead.ParentContainer) {
			sectionTemp.parentContainerID = sectionFromRead.ParentContainer['ContainingClauses-id'].Id2;
		}
		else {
			sectionTemp.parentContainerID = "";
		}
		SCMappingsFromRead.forEach(sectionOrClause => {
			if (sectionOrClause.ParentContainer && (sectionOrClause.ParentContainer['ContainingClauses-id'].Id2 === sectionTemp.containerID)) {
				var sectionOrClauseTemp = {};
				sectionOrClauseTemp.cascade = ko.observable(l_sectionandclause_model.cascadeDocLevel());
				if (sectionOrClause.LinkedSection) {
					_populateSection(sectionOrClauseTemp, sectionOrClause, SCMappingsFromRead, sectionTemp.cascade());
					sectionTemp.container.push(sectionOrClauseTemp);
					sectionOrClauseTemp.parentContainer = sectionTemp;
				} else if (sectionOrClause.LinkedClause) {
					_populateClause(sectionOrClauseTemp, sectionOrClause, SCMappingsFromRead, sectionTemp.cascade());
					sectionTemp.container.push(sectionOrClauseTemp);
					sectionOrClauseTemp.parentContainer = sectionTemp;
					_addToReplaceContainerMap(
						sectionOrClauseTemp,
						sectionTemp.container(),
						sectionOrClause.RelatedCondition ? getTextValue(sectionOrClause.RelatedCondition.Action) : "",
						sectionOrClause.RelatedCondition ? sectionOrClause.RelatedCondition.SourceContainer["ContainingClauses-id"].Id2 : ""
					);
				}
			}
		});
		_sortArrayOnClauseOrder(sectionTemp.container);
	};
}

function _populateClause(clauseTemp, clauseFromRead, SCMappingsFromRead, parentCascade) {
	clauseTemp.type = _CLAUSE;
	clauseTemp.showContainer = clauseFromRead.showContainer ? clauseFromRead.showContainer : 'true';
	addNumberingAndCascadeInfo(clauseTemp, clauseFromRead, parentCascade, l_sectionandclause_model, l_current_numberingFormat);
	clauseTemp.clauseOrder = parseInt(clauseFromRead.ClauseOrder);
	clauseTemp.containerID = clauseFromRead['ContainingClauses-id'].Id2;
	if (clauseFromRead.InitialContainingClauseID) {
		clauseTemp.initialContainingClauseID = clauseFromRead.InitialContainingClauseID;
	}
	else {
		clauseTemp.initialContainingClauseID = clauseFromRead['ContainingClauses-id'].Id2;
	}
	clauseTemp.containerItemID = clauseFromRead['ContainingClauses-id'].ItemId2;
	clauseTemp.generatedClauseID = "";
	clauseTemp.initialContainingSectionID = "";
	clauseTemp.containingClauseID = clauseFromRead['ContainingClauses-id'].Id2;
	clauseTemp.containingClauseItemID = clauseFromRead['ContainingClauses-id'].ItemId2;
	clauseTemp.clauseID = clauseFromRead.LinkedClause["GCClause-id"].Id;
	clauseTemp.clauseType = getTextValue(clauseFromRead.LinkedClause.ClauseType);
	if (clauseFromRead.LinkedClause.Name) {
		clauseTemp.clauseName = ko.observable(getTextValue(clauseFromRead.LinkedClause.Name));
	} else {
		clauseTemp.clauseName = ko.observable("");
	}
	if (clauseFromRead.LinkedClause.HtmlContent) {
		clauseTemp.clauseHTMLContent = getTextValue(clauseFromRead.LinkedClause.HtmlContent);
	}
	else {
		clauseTemp.clauseHTMLContent = ""
	}
	clauseTemp.isNew = false;
	clauseTemp.isMovedToRoot = 'false';
	clauseTemp.isDirty = ko.observable(false);
	if (clauseTemp.clauseType === 'NONSTANDARD') {
		clauseTemp.isStandard = ko.observable(false);
		clauseTemp.showConvertToNonStandardBtn = ko.observable(false);
		clauseTemp.showReplacewithEqClauseBtn = ko.observable(false);
	}
	else {
		clauseTemp.isStandard = ko.observable(true);
		clauseTemp.showConvertToNonStandardBtn = ko.observable(true);
		clauseTemp.showReplacewithEqClauseBtn = ko.observable(true)
	}
	if (clauseFromRead.ParentContainer) {
		clauseTemp.parentContainerID = clauseFromRead.ParentContainer['ContainingClauses-id'].Id2;
	}
	else {
		clauseTemp.parentContainerID = "";
	}
	clauseTemp.sectionName = ko.computed(function () {
		return clauseTemp.clauseName();
	}, clauseTemp);

	clauseTemp.containerConditions = [];
	clauseTemp.container = ko.observableArray([]);
	clauseTemp.hasCondition = ko.observable(false);
	SCMappingsFromRead.forEach(sectionOrClause => {
		if (sectionOrClause.ParentContainer && (sectionOrClause.ParentContainer['ContainingClauses-id'].Id2 === clauseTemp.containerID)) {
			var sectionOrClauseTemp = {};
			sectionOrClauseTemp.cascade = ko.observable(l_sectionandclause_model.cascadeDocLevel());
			if (sectionOrClause.LinkedSection) {
				_populateSection(sectionOrClauseTemp, sectionOrClause, SCMappingsFromRead, clauseTemp.cascade());
				clauseTemp.container.push(sectionOrClauseTemp);
				sectionOrClauseTemp.parentContainer = clauseTemp;
			} else if (sectionOrClause.LinkedClause) {
				_populateClause(sectionOrClauseTemp, sectionOrClause, SCMappingsFromRead, clauseTemp.cascade());
				clauseTemp.container.push(sectionOrClauseTemp);
				sectionOrClauseTemp.parentContainer = clauseTemp;
				_addToReplaceContainerMap(
					sectionOrClauseTemp,
					clauseTemp.container(),
					sectionOrClause.RelatedCondition ? getTextValue(sectionOrClause.RelatedCondition.Action) : "",
					sectionOrClause.RelatedCondition ? sectionOrClause.RelatedCondition.SourceContainer["ContainingClauses-id"].Id2 : ""
				);
			}
		}
		else if (sectionOrClause.RelatedCondition && (sectionOrClause.RelatedCondition.SourceContainer['ContainingClauses-id'].Id2 === clauseTemp.containerID)) {
			var l_condition = {};
			l_condition.SourceContainingClause = clauseTemp.containerID;
			l_condition.ParentContainingClause = '';
			l_condition.ConditionId = sectionOrClause.RelatedCondition['ConditionalContent-id'].Id;
			l_condition.ConditionAction = getTextValue(sectionOrClause.RelatedCondition.Action);
			l_condition.TargetContainingClauseId = sectionOrClause['ContainingClauses-id'].Id2;
			if (l_condition.ConditionAction != 'HIDE') {
				l_condition.TargetClauseName = getTextValue(sectionOrClause.LinkedClause.Name);
				l_condition.TargetClauseId = sectionOrClause.LinkedClause['GCClause-id'].Id;
			}
			l_condition.TargetRuleName = getTextValue(sectionOrClause.RelatedCondition.ConditionRule.Name);
			l_condition.TargetRuleId = sectionOrClause.RelatedCondition.ConditionRule['Rule-id'].Id;
			l_condition.TargetRuleSummary = getTextValue(sectionOrClause.RelatedCondition.ConditionRule.LogicSummary);
			clauseTemp.containerConditions.push(l_condition);
			clauseTemp.hasCondition(true);
		}
	});
	_sortArrayOnClauseOrder(clauseTemp.container);
}

function _addToReplaceContainerMap(replaceClause, parentContainer, action, sourceContainerId) {
	if (action === 'REPLACE') {
		replaceContainersMap.set(replaceClause.containingClauseID, {
			sourceContainerId: sourceContainerId, replaceContainer: replaceClause, parentContainer: parentContainer,
			sourceContainer: null
		});
		sourceReplaceMap.set(sourceContainerId, replaceClause.containingClauseID);

	}
};

function _addChildrenReplaceContainers() {
	replaceContainersMap.forEach((val, key) => {
		if (val.parentContainer) {
			var sourceCont = null;
			val.parentContainer.forEach(cont => {
				if (cont.containingClauseID === val.sourceContainerId) {
					val.sourceContainer = cont;
					sourceCont = cont;
					if (val.parentContainer && sourceCont && sourceCont.showContainer === 'false') {
						cont.container().forEach(ele => {
							val.replaceContainer.container.push(ele);
						});
						cont.container.removeAll();
					}
					val.replaceContainer.ClauseOrder = val.sourceContainer.ClauseOrder;
					val.replaceContainer.parentContainerID = val.sourceContainer.parentContainerID;
				}
			});
			if (val.parentContainer && sourceCont && sourceCont.showContainer === 'false') {
				console.log("source container not visible:" + sourceCont.containingClauseID);
				val.parentContainer.splice(val.parentContainer.indexOf(val.sourceContainer), 1);
			} else if (val.parentContainer) {
				console.log("source container is visible:" + sourceCont.containingClauseID);
				val.parentContainer.splice(val.parentContainer.indexOf(val.replaceContainer), 1);
			}
		}
	});
}


function _populateRootSectionsAndClauses(SCMappings, SCMappingsFromRead, newRecord) {
	if (!newRecord && l_sectionandclause_model) {
		l_sectionandclause_model.cascadeDocLevel(_CASCADE_OFF);
		l_current_numberingFormat = _DECIMAL_SIMPLE_FORMAT;
	}
	for (var i = 0; i < SCMappingsFromRead.length; i++) {
		var sectionOrClauseTemp = {};
		var sectionOrClauseFromRead = SCMappingsFromRead[i];
		if (sectionOrClauseFromRead.LinkedSection && !sectionOrClauseFromRead.ParentContainer) {
			_populateSection(sectionOrClauseTemp, sectionOrClauseFromRead, SCMappingsFromRead, null);
			SCMappings.push(sectionOrClauseTemp);
		}
		else if ((sectionOrClauseFromRead.LinkedClause && !sectionOrClauseFromRead.ParentContainer)) {
			if (sectionOrClauseFromRead.RelatedCondition && sectionOrClauseFromRead.RelatedCondition.Action != 'HIDE') {

			}
			else {
				if (sectionOrClauseFromRead.LinkedClause) {
					_populateClause(sectionOrClauseTemp, sectionOrClauseFromRead, SCMappingsFromRead, null);
				}
				if (!newRecord) {
					_populateOldSectionRecord(SCMappings, sectionOrClauseFromRead, sectionOrClauseTemp);
				}
				else {
					sectionOrClauseTemp.sectionName = sectionOrClauseTemp.clauseName;
					SCMappings.push(sectionOrClauseTemp);
				}
			}
		}
		else if (!sectionOrClauseFromRead.LinkedClause && sectionOrClauseFromRead.Owner["ContainingSections-id"].Id && !newRecord) {
			_populateOldSectionRecord(SCMappings, sectionOrClauseFromRead, sectionOrClauseTemp);
		}
	}
	_sortArrayOnClauseOrder(SCMappings);
}

function _sortArrayOnClauseOrder(sectionOrClauseObsArr) {
	return sectionOrClauseObsArr ? sectionOrClauseObsArr.sort((e, e1) => e.clauseOrder - e1.clauseOrder) : null;
}

function _getCascadeFlagInherit(inheritFlag, parentSectionOrClause) {
	var cascadeFlag = l_sectionandclause_model.cascadeDocLevel();
	if (inheritFlag && parentSectionOrClause && parentSectionOrClause.cascade) {
		cascadeFlag = parentSectionOrClause.cascade();
	}
	return cascadeFlag;
}

function checkAndDeleteClause(iClause) {
	var l_tobeDeleted = false;
	if (iClause && !iClause.isNew) {
		l_tobeDeleted = true;
		for (var i = 0; i < l_sectionandclause_model.DeletedClauses.Clauses.Clause.length; i++) {
			if (l_sectionandclause_model.DeletedClauses.Clauses.Clause[i].containingClauseID == iClause.containingClauseID) {
				l_tobeDeleted = false;
				break;
			}
		}
		if (l_tobeDeleted) {
			l_sectionandclause_model.DeletedClauses.Clauses.Clause.push(iClause);
		}
	}
	return l_tobeDeleted;
}

function checkAndDeleteSection(iSection) {
	var l_tobeDeleted = false;
	if (iSection && !iSection.isNew) {
		l_tobeDeleted = true;
		for (var i = 0; i < l_sectionandclause_model.DeletedSections.Sections.Section.length; i++) {
			if (l_sectionandclause_model.DeletedSections.Sections.Section[i].containingClauseID == iSection.containingClauseID) {
				l_tobeDeleted = false;
				break;
			}
		}
		if (l_tobeDeleted) {
			l_sectionandclause_model.DeletedSections.Sections.Section.push(iSection);
		}
	}
	return l_tobeDeleted;
}

function _updateAddSectionParentData(data, parent, parentParent) {
	l_sectionandclause_model.addSectionData(data);
	l_sectionandclause_model.addSectionParentData(parent);
	l_sectionandclause_model.addSectionParentParentData(parentParent);
}

function disableSaveandCancel(isDisable) {
	$("#save_sectionMappings, #Cancel").prop("disabled", (isDisable === true));
}

function disableInsertClauseBtn(isDisable) {
	if ($(".clause_library:checked").length > 0) {
		$("#insert_selected_btn").prop("disabled", (isDisable === true));
	}
}

function _clearReplaceMap() {
	replaceContainersMap = new Map();
	sourceReplaceMap = new Map();
}