package com.opentext.apps.ccworkflow.rule.enums;

public enum CCOperandTypeEnum {
	GENERAL_ATTRIBUTE(1, "GENERAL"), CUSTOM_ATTRIBUTE(2, "CUSTOM");

	private int id;
	private String value;

	private CCOperandTypeEnum(int id, String value) {
		this.id = id;
		this.value = value;
	}

	public int getId() {
		return id;
	}

	public String getValue() {
		return value;
	}
}
