package com.opentext.apps.ccworkflow.rule;

import java.util.List;

import com.opentext.apps.ccworkflow.rule.enums.CCOperandTypeEnum;
import com.opentext.apps.ccworkflow.rule.enums.CCOperatorEnum;
import com.opentext.apps.ccworkflow.rule.enums.CCPropertyDataTypeEnum;
import com.opentext.apps.ccworkflow.rule.enums.CCValueTypeEnum;

public class CCCondition implements Comparable<CCCondition> {
	private static final String FALSE = "FALSE";
	private static final String TRUE = "TRUE";
	private String name;
	private int id;
	private int ruleId;
	private String itemId;
	private String property;
	private String propertyValue;
	private String isMultField = FALSE;
	private String xPath;
	private List<String> multiPropValues;
	private CCOperatorEnum operator;
	private CCPropertyDataTypeEnum propertyDataType;
	private CCValueTypeEnum valueType;
	private CCOperandTypeEnum operandType;
	private String customAttributeName;
	private String value;
	private String values[];
	private boolean result;
	private int conditionNumber;
	private String ruleName;
	private boolean defaultResult = false;
	private boolean isAttributePresentInContract = false;

	/**
	 * return String (TRUE or FALSE)
	 **/
	public String getIsMultField() {
		return isMultField;
	}

	/**
	 * Accepts isMultField String TRUE or FALSE
	 **/
	public void setIsMultField(String isMultField) {
		this.isMultField = FALSE;
		if (isMultField != null && isMultField.equals(TRUE)) {
			this.isMultField = TRUE;
		}
	}

	public List<String> getMultiPropValues() {
		return multiPropValues;
	}

	public void setMultiPropValues(List<String> multiPropValues) {
		this.multiPropValues = multiPropValues;
	}

	public String getProperty() {
		return property;
	}

	public void setProperty(String property) {
		this.property = property;
	}

	public String getPropertyValue() {
		return propertyValue;
	}

	public void setPropertyValue(String propertyValue) {
		this.propertyValue = propertyValue;
	}

	public String getxPath() {
		return xPath;
	}

	public void setxPath(String xPath) {
		this.xPath = xPath;
	}

	public CCOperatorEnum getOperator() {
		return operator;
	}

	public void setOperator(CCOperatorEnum operator) {
		this.operator = operator;
	}

	public CCPropertyDataTypeEnum getPropertyDataType() {
		return propertyDataType;
	}

	public void setPropertyDataType(CCPropertyDataTypeEnum propertyDataType) {
		this.propertyDataType = propertyDataType;
	}

	public CCValueTypeEnum getValueType() {
		return valueType;
	}

	public void setValueType(CCValueTypeEnum propertyType) {
		this.valueType = propertyType;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String[] getValues() {
		return values;
	}

	public void setValues(String[] values) {
		this.values = values;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getItemId() {
		return itemId;
	}

	public void setItemId(String itemId) {
		this.itemId = itemId;
	}

	public boolean isResult() {
		return result;
	}

	public void setResult(boolean result) {
		this.result = result;
	}

	public int getConditionNumber() {
		return conditionNumber;
	}

	public void setConditionNumber(int conditionNumber) {
		this.conditionNumber = conditionNumber;
	}

	public int compareTo(CCCondition condition) {
		return condition.conditionNumber - this.conditionNumber;
	}

	public String getRuleName() {
		return ruleName;
	}

	public void setRuleName(String ruleName) {
		this.ruleName = ruleName;
	}

	public CCOperandTypeEnum getOperandType() {
		return operandType;
	}

	public void setOperandType(CCOperandTypeEnum operandType) {
		this.operandType = operandType;
	}

	public String getCustomAttributeName() {
		return customAttributeName;
	}

	public void setCustomAttributeName(String customAttributeName) {
		this.customAttributeName = customAttributeName;
	}

	public boolean isDefaultResult() {
		return defaultResult;
	}

	public void setDefaultResult(boolean defaultResult) {
		this.defaultResult = defaultResult;
	}

	public boolean isAttributePresentInContract() {
		return isAttributePresentInContract;
	}

	public void setAttributePresentInContract(boolean isAttributePresentInContract) {
		this.isAttributePresentInContract = isAttributePresentInContract;
	}

	public int getRuleId() {
		return ruleId;
	}

	public void setRuleId(int ruleId) {
		this.ruleId = ruleId;
	}

}
