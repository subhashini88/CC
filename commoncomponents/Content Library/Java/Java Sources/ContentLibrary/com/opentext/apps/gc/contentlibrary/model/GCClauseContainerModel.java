package com.opentext.apps.gc.contentlibrary.model;

public class GCClauseContainerModel extends AbstractGCContainerModel {

	private int clauseId;
	private String name;
	private String itemID;
	private String content;
	private String htmlContent;
	private String initialContainingClauseId;

	public int getClauseId() {
		return clauseId;
	}

	public void setClauseId(int clauseId) {
		this.clauseId = clauseId;
	}

	public String getItemID() {
		return itemID;
	}

	public void setItemID(String itemID) {
		this.itemID = itemID;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getHtmlContent() {
		return htmlContent;
	}

	public void setHtmlContent(String htmlContent) {
		this.htmlContent = htmlContent;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getInitialContainingClauseId() {
		return initialContainingClauseId;
	}

	public void setInitialContainingClauseId(String initialContainingClauseId) {
		this.initialContainingClauseId = initialContainingClauseId;
	}

}
