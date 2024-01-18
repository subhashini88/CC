package com.opentext.apps.gc.contentlibrary.model;

public class GCSectionContainerModel extends AbstractGCContainerModel {

	private int sectionId;
	private String name;
	private String itemID;
	private String initialContainingSectionId;
	private String initialContainingClauseId;

	public int getSectionId() {
		return sectionId;
	}

	public void setSectionId(int sectionId) {
		this.sectionId = sectionId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getItemID() {
		return itemID;
	}

	public void setItemID(String itemID) {
		this.itemID = itemID;
	}

	public String getInitialContainingSectionId() {
		return initialContainingSectionId;
	}

	public void setInitialContainingSectionId(String initialContainingSectionId) {
		this.initialContainingSectionId = initialContainingSectionId;
	}

	public String getInitialContainingClauseId() {
		return initialContainingClauseId;
	}

	public void setInitialContainingClauseId(String initialContainingClauseId) {
		this.initialContainingClauseId = initialContainingClauseId;
	}

}
