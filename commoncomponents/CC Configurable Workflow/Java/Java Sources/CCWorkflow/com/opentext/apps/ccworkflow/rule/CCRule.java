package com.opentext.apps.ccworkflow.rule;

import java.util.Objects;
import java.util.Set;
import java.util.TreeSet;

public class CCRule implements Comparable<CCRule> {

	private String name;
	private int id;
	private String itemId;
	private String ruleLogic;
	private String code;
	private int order;
	private String creationType;
	private Set<CCCondition> conditions;
	private boolean result;
	private int activityListId;
	private String activityListItemId;

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

	public String getRuleLogic() {
		return ruleLogic;
	}

	public void setRuleLogic(String ruleLogic) {
		this.ruleLogic = ruleLogic;
	}

	public Set<CCCondition> getConditions() {
		if (Objects.isNull(conditions)) {
			conditions = new TreeSet<CCCondition>();
		}
		return conditions;
	}

	public void addCondition(CCCondition condition) {
		if (Objects.isNull(conditions)) {
			conditions = new TreeSet<CCCondition>();
		}
		conditions.add(condition);
	}

	public boolean isResult() {
		return result;
	}

	public void setResult(boolean result) {
		this.result = result;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getCreationType() {
		return creationType;
	}

	public void setCreationType(String creationType) {
		this.creationType = creationType;
	}
	
	public int getOrder() {
		return order;
	}

	public void setOrder(int order) {
		this.order = order;
	}

	public int compareTo(CCRule rule) {
		if (!this.getCreationType().equals("DEFAULT") && rule.getCreationType().equals("DEFAULT")) {
            return -1;
        } else if (this.getCreationType().equals("DEFAULT") && !rule.getCreationType().equals("DEFAULT")) {
            return 1;
        } else if (!this.getCreationType().equals("DEFAULT") && !rule.getCreationType().equals("DEFAULT")) {
            int orderComparison = Integer.compare(this.getOrder(), rule.getOrder());
            if (orderComparison == 0) {
                return Integer.compare(this.hashCode(), rule.hashCode());
            } else {
                return orderComparison;
            }
        } else {
            return Integer.compare(this.getOrder(), rule.getOrder());
        }
	}

	public int getActivityListId() {
		return activityListId;
	}

	public void setActivityListId(int activityListId) {
		this.activityListId = activityListId;
	}

	public String getActivityListItemId() {
		return activityListItemId;
	}

	public void setActivityListItemId(String activityListItemId) {
		this.activityListItemId = activityListItemId;
	}

}
