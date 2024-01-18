package com.opentext.apps.ccworkflow.rule;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Stack;

import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;
import com.eibus.xml.nom.Node;
import com.opentext.apps.ccworkflow.rule.enums.CCOperandTypeEnum;
import com.opentext.apps.ccworkflow.rule.enums.CCOperatorEnum;
import com.opentext.apps.ccworkflow.rule.enums.CCPropertyDataTypeEnum;
import com.opentext.apps.ccworkflow.rule.enums.CCValueTypeEnum;
import com.opentext.apps.ccworkflow.rule.exceptions.CCRuleEngineAlertMessages;
import com.opentext.apps.ccworkflow.rule.exceptions.CCRuleEngineException;
import com.opentext.apps.ccworkflow.rule.utils.CCRuleEngineUtilites;
import com.opentext.apps.ccworkflow.rule.utils.NomUtil;

public class CCRuleEngine {

	private static final String OBLIGATION = "Obligation";
	private static final String TEMPLATE = "Template";
	private static final String CLAUSE = "Clause";
	private static final String CONTRACT = "Contract";
	private static final CordysLogger logger = CordysLogger.getCordysLogger(CCRuleEngine.class);
	private static String logger_indentifier = "com.opentext.apps.commoncomponents.ccworkflow";

	private static String ACTION_FILTER = "SendForReview";
	private static String RULE_STATUS_FILTER = "ACTIVE";

	private CCDataModel dataModel;
	private CCLogicValidator logicValidator;

	public CCRuleEngine() {
		dataModel = new CCDataModel();
		logicValidator = new CCLogicValidator();
	}

	public boolean validateCondition(CCCondition condition) {
		boolean result = false;
		try {
			if (Objects.nonNull(condition)) {
				if (condition.isAttributePresentInContract()) {
					if (CCOperatorEnum.EMPTY.equals(condition.getOperator())) {
						result = CCRuleEngineUtilites.empty(condition.getPropertyValue());
					} else if (CCOperatorEnum.NOTEMPTY.equals(condition.getOperator())) {
						result = !CCRuleEngineUtilites.empty(condition.getPropertyValue());
					} else if (CCPropertyDataTypeEnum.BOOLEAN.equals(condition.getPropertyDataType())) {
						result = booleanOperations(condition);
					} else if (CCPropertyDataTypeEnum.TEXT.equals(condition.getPropertyDataType())) {
						result = textOperations(condition);
					} else if (CCPropertyDataTypeEnum.LONGTEXT.equals(condition.getPropertyDataType())) {
						result = textOperations(condition);
					} else if (CCPropertyDataTypeEnum.ENUMERATEDTEXT.equals(condition.getPropertyDataType())) {
						result = textOperations(condition);
					} else if (CCPropertyDataTypeEnum.INTEGER.equals(condition.getPropertyDataType())) {
						result = numberOperations(condition);
					} else if (CCPropertyDataTypeEnum.FLOAT.equals(condition.getPropertyDataType())) {
						result = decimalOperations(condition);
					} else if (CCPropertyDataTypeEnum.DECIMAL.equals(condition.getPropertyDataType())) {
						result = decimalOperations(condition);
					} else if (CCPropertyDataTypeEnum.DATE.equals(condition.getPropertyDataType())) {
						result = dateOperations(condition);
					} else if (CCPropertyDataTypeEnum.DURATION.equals(condition.getPropertyDataType())) {
						result = durationOperations(condition);
					}
				} else {
					return condition.isDefaultResult();
				}
			}
		} catch (Exception e) {
			logger._log(logger_indentifier, Severity.ERROR, e,
					"Error while while validating the rule (" + condition.getRuleName() + ") condition ("
							+ condition.getName() + "), Contact the administrator.");
			throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_IN_RULE_CONDITION_VALIDATION, e,
					condition.getRuleName(), condition.getName());
		}
		return result;
	}

	private boolean booleanOperations(CCCondition condition) {
		boolean result = false;
		Boolean propertyValue = null, providedValue = null;
		propertyValue = Boolean.valueOf(condition.getPropertyValue());
		providedValue = "true".equalsIgnoreCase(condition.getValue()) || "yes".equalsIgnoreCase(condition.getValue())
				? true
				: false;
		if (CCOperatorEnum.EQUALTO.equals(condition.getOperator())) {
			result = CCRuleEngineUtilites.equals(propertyValue, providedValue);
		} else if (CCOperatorEnum.NOTEQUALTO.equals(condition.getOperator())) {
			result = !CCRuleEngineUtilites.equals(propertyValue, providedValue);
		}
		return result;
	}

	private boolean durationOperations(CCCondition condition) {
		boolean result = false;
		Integer propertyValue = null, providedValue = null;

		if (Objects.nonNull(condition.getPropertyValue()) && !condition.getPropertyValue().isBlank()
				&& Objects.nonNull(condition.getValue()) && !condition.getValue().isBlank()) {
			String temp = condition.getPropertyValue();
			try {
				propertyValue = temp.contains("M")
						? Integer.valueOf(temp.substring(temp.indexOf('P') + 1, temp.indexOf('M')))
						: 0;
				providedValue = Integer.valueOf(condition.getValue()).intValue();
			} catch (NumberFormatException ex) {
				return condition.isDefaultResult();
			}

			if (CCOperatorEnum.EQUALTO.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.equals(propertyValue, providedValue);
			} else if (CCOperatorEnum.NOTEQUALTO.equals(condition.getOperator())) {
				result = !CCRuleEngineUtilites.equals(propertyValue, providedValue);
			} else if (CCOperatorEnum.GREATERTHAN.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.greaterThan(propertyValue, providedValue);
			} else if (CCOperatorEnum.GREATERTHANOREQUALTO.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.greaterThanOrEqual(propertyValue, providedValue);
			} else if (CCOperatorEnum.LESSTHAN.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.lessThan(propertyValue, providedValue);
			} else if (CCOperatorEnum.LESSTHANOREQUALTO.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.lessThanOrEqual(propertyValue, providedValue);
			} else if (CCOperatorEnum.EMPTY.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.empty(propertyValue);
			} else if (CCOperatorEnum.NOTEMPTY.equals(condition.getOperator())) {
				result = !CCRuleEngineUtilites.empty(propertyValue);
			}
		} else {
			result = condition.isDefaultResult();
		}
		return result;
	}

	private boolean dateOperations(CCCondition condition) {
		boolean result = false;
		DateFormat dateFormat1 = CCOperandTypeEnum.CUSTOM_ATTRIBUTE.equals(condition.getOperandType())
				? new SimpleDateFormat("yyyy-MM-dd")
				: new SimpleDateFormat("yyyy-MM-dd'Z'");
		DateFormat dateFormat2 = new SimpleDateFormat("MM/dd/yyyy");
		Date propertyValue = null, providedValue = null;
		if (Objects.nonNull(condition.getPropertyValue()) && !condition.getPropertyValue().isBlank()
				&& Objects.nonNull(condition.getValue()) && !condition.getValue().isBlank()) {
			try {
				propertyValue = dateFormat1.parse(condition.getPropertyValue());
				providedValue = dateFormat2.parse(condition.getValue());
			} catch (ParseException ex) {
				return condition.isDefaultResult();
			}

			if (CCOperatorEnum.EQUALTO.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.equals(propertyValue, providedValue);
			} else if (CCOperatorEnum.NOTEQUALTO.equals(condition.getOperator())) {
				result = !CCRuleEngineUtilites.equals(propertyValue, providedValue);
			} else if (CCOperatorEnum.GREATERTHAN.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.greaterThan(propertyValue, providedValue);
			} else if (CCOperatorEnum.GREATERTHANOREQUALTO.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.greaterThanOrEqual(propertyValue, providedValue);
			} else if (CCOperatorEnum.LESSTHAN.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.lessThan(propertyValue, providedValue);
			} else if (CCOperatorEnum.LESSTHANOREQUALTO.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.lessThanOrEqual(propertyValue, providedValue);
			} else if (CCOperatorEnum.EMPTY.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.empty(propertyValue);
			} else if (CCOperatorEnum.NOTEMPTY.equals(condition.getOperator())) {
				result = !CCRuleEngineUtilites.empty(propertyValue);
			}
		} else {
			result = condition.isDefaultResult();
		}
		return result;

	}

	private boolean numberOperations(CCCondition condition) {
		boolean result = false;
		Long propertyValue = null, providedValue = null;
		if (Objects.nonNull(condition.getPropertyValue()) && !condition.getPropertyValue().isBlank()
				&& Objects.nonNull(condition.getValue()) && !condition.getValue().isBlank()) {
			try {
				propertyValue = Long.valueOf(condition.getPropertyValue());
			} catch (NumberFormatException ex) {
				try {
					propertyValue = Double.valueOf(condition.getPropertyValue()).longValue();
				} catch (NumberFormatException e) {
					return condition.isDefaultResult();
				}
			}
			try {
				providedValue = Long.valueOf(condition.getValue());
			} catch (NumberFormatException ex) {
				try {
					providedValue = Double.valueOf(condition.getValue()).longValue();
				} catch (NumberFormatException e) {
					return condition.isDefaultResult();
				}
			}
			if (CCOperatorEnum.EQUALTO.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.equals(propertyValue, providedValue);
			} else if (CCOperatorEnum.NOTEQUALTO.equals(condition.getOperator())) {
				result = !CCRuleEngineUtilites.equals(propertyValue, providedValue);
			} else if (CCOperatorEnum.GREATERTHAN.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.greaterThan(propertyValue, providedValue);
			} else if (CCOperatorEnum.GREATERTHANOREQUALTO.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.greaterThanOrEqual(propertyValue, providedValue);
			} else if (CCOperatorEnum.LESSTHAN.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.lessThan(propertyValue, providedValue);
			} else if (CCOperatorEnum.LESSTHANOREQUALTO.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.lessThanOrEqual(propertyValue, providedValue);
			} else if (CCOperatorEnum.EMPTY.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.empty(condition.getPropertyValue());
			} else if (CCOperatorEnum.NOTEMPTY.equals(condition.getOperator())) {
				result = !CCRuleEngineUtilites.empty(condition.getPropertyValue());
			}
		} else {
			result = condition.isDefaultResult();
		}

		return result;
	}

	private boolean decimalOperations(CCCondition condition) {
		boolean result = false;
		Double propertyValue = null, providedValue = null;
		if (Objects.nonNull(condition.getPropertyValue()) && !condition.getPropertyValue().isBlank()) {
			try {
				propertyValue = Double.valueOf(condition.getPropertyValue());
				providedValue = Double.valueOf(condition.getValue());
			} catch (NumberFormatException ex) {
				return condition.isDefaultResult();
			}
			if (CCOperatorEnum.EQUALTO.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.equals(propertyValue, providedValue);
			} else if (CCOperatorEnum.NOTEQUALTO.equals(condition.getOperator())) {
				result = !CCRuleEngineUtilites.equals(propertyValue, providedValue);
			} else if (CCOperatorEnum.GREATERTHAN.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.greaterThan(propertyValue, providedValue);
			} else if (CCOperatorEnum.GREATERTHANOREQUALTO.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.greaterThanOrEqual(propertyValue, providedValue);
			} else if (CCOperatorEnum.LESSTHAN.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.lessThan(propertyValue, providedValue);
			} else if (CCOperatorEnum.LESSTHANOREQUALTO.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.lessThanOrEqual(propertyValue, providedValue);
			} else if (CCOperatorEnum.EMPTY.equals(condition.getOperator())) {
				result = CCRuleEngineUtilites.empty(condition.getPropertyValue());
			} else if (CCOperatorEnum.NOTEMPTY.equals(condition.getOperator())) {
				result = !CCRuleEngineUtilites.empty(condition.getPropertyValue());
			}
		} else {
			result = condition.isDefaultResult();
		}

		return result;
	}

	private boolean textOperations(CCCondition condition) {
		boolean result = false;
		if (CCOperatorEnum.EQUALTO.equals(condition.getOperator())) {
			if ("TRUE".equals(condition.getIsMultField())) {
				result = CCRuleEngineUtilites.equals(condition.getMultiPropValues(), condition.getValue());
			} else {
				result = CCRuleEngineUtilites.equals(condition.getPropertyValue(), condition.getValue());
			}
		} else if (CCOperatorEnum.NOTEQUALTO.equals(condition.getOperator())) {
			if ("TRUE".equals(condition.getIsMultField())) {
				result = !CCRuleEngineUtilites.equals(condition.getMultiPropValues(), condition.getValue());
			} else {
				result = !CCRuleEngineUtilites.equals(condition.getPropertyValue(), condition.getValue());
			}
		} else if (CCOperatorEnum.CONTAINS.equals(condition.getOperator())) {
			result = CCRuleEngineUtilites.contains(condition.getPropertyValue(), condition.getValue());
		} else if (CCOperatorEnum.DOESNOTCONTAIN.equals(condition.getOperator())) {
			result = !CCRuleEngineUtilites.contains(condition.getPropertyValue(), condition.getValue());
		} else if (CCOperatorEnum.EMPTY.equals(condition.getOperator())) {
			if ("TRUE".equals(condition.getIsMultField())) {
				result = CCRuleEngineUtilites.empty(condition.getMultiPropValues());
			} else {
				result = CCRuleEngineUtilites.empty(condition.getPropertyValue());
			}
			
		} else if (CCOperatorEnum.NOTEMPTY.equals(condition.getOperator())) {
			result = !CCRuleEngineUtilites.empty(condition.getPropertyValue());
		} else if (CCOperatorEnum.IN_LIST.equals(condition.getOperator())) {
			result = CCRuleEngineUtilites.inList(condition.getPropertyValue(), Arrays.asList(condition.getValues()));
		} else if (CCOperatorEnum.NOT_IN_LIST.equals(condition.getOperator())) {
			result = !CCRuleEngineUtilites.inList(condition.getPropertyValue(), Arrays.asList(condition.getValues()));
		}
		return result;
	}

	public boolean executeRule(CCRule rule) {
		boolean result = false;
		if (Objects.nonNull(rule) && Objects.nonNull(rule.getRuleLogic())) {
			if (logicValidator.validate(rule.getRuleLogic())) {
				try {
					String ruleLogic = rule.getRuleLogic().toUpperCase().replaceAll("AND", "&").replaceAll("OR", "|")
							.replaceAll(" ", "");
					for (CCCondition condition : rule.getConditions()) {

						// Validate condition and throw exception if any.
						boolean conditionResult = validateCondition(condition);
						ruleLogic = ruleLogic.replaceAll(String.valueOf(condition.getConditionNumber()),
								(conditionResult) ? "T" : "F");
						condition.setResult(conditionResult);
					}
					rule.setRuleLogic(ruleLogic);
					result = evaluateExpression(rule.getRuleLogic());
					rule.setResult(result);
				} catch (Exception e) {
					logger._log(logger_indentifier, Severity.ERROR, e,
							"Error while while executing the" + rule.getName() + "rule, Contact the administrator.");
					throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_IN_RULE_EXECUTION, rule.getName());
				}
			} else {
				logger._log(logger_indentifier, Severity.ERROR, null, "Error while while validating the rule logic for"
						+ rule.getName() + "rule, Contact the administrator.");
				throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_IN_RULE_LOGIC_VALIDATION,
						rule.getName());
			}
		} else

		{
			logger._log(logger_indentifier, Severity.ERROR, null,
					"Rule logic shouldn't be empty for" + rule.getName() + "rule, Contact the administrator.");
			throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_EMPTY_RULE_LOGIC, rule.getName());
		}
		return result;
	}

	public int startRulesExecution(String instanceId, String processName, String actionName, int relations) {
		int ruleExecutionResultNode = 0;
		if (Objects.nonNull(instanceId)) {
			int instanceData = 0;
					
			switch (processName) {
	            case CONTRACT:
	            	instanceData = dataModel.readContract(instanceId, false, relations);
	                break;
	            case CLAUSE:
	            	instanceData = dataModel.readClause(instanceId, false);
	                break;
	            case TEMPLATE:
	            	instanceData = dataModel.readTemplate(instanceId, false);
	                break;
	            case OBLIGATION:
	            	instanceData = dataModel.readObligation(instanceId, false);
	                break;
			}

			String ruleItemId = "";
			String activityListItemId = "";
			String ruleName = "";
			String organizationItemId = "";
			String organizationId = "";
			String instanceItemId = "";
			String contractTypeId = "";
			boolean defaultRule = true;

			String state = Node.getDataWithDefault(NomUtil.getNode(".//Lifecycle//CurrentState", instanceData), "").equals("")?
					null:Node.getDataWithDefault(NomUtil.getNode(".//Lifecycle//CurrentState", instanceData), "");
			if(processName.equals(CONTRACT) && state.equals("Pending Activation")){
				state = "Active";
			}
			
			switch (processName) {
			case CONTRACT:
				contractTypeId =  Node
						.getDataWithDefault(NomUtil.getNode(".//ContractType/GCType-id//Id", instanceData), "");
				instanceItemId = Node.
						getDataWithDefault(NomUtil.getNode(".//Contract-id//ItemId", instanceData), "");
				organizationItemId =  Node.getDataWithDefault(
						NomUtil.getNode(".//RelatedOrganization/GCOrganization-id/ItemId", instanceData), "");
				organizationId = Node.getDataWithDefault(
						NomUtil.getNode(".//RelatedOrganization/GCOrganization-id/Id", instanceData), "");
				break;
			case CLAUSE:
				contractTypeId = Node
	  					.getDataWithDefault(NomUtil.getNode(".//RelatedType/GCType-id//Id", instanceData), "");
				instanceItemId = Node.
						getDataWithDefault(NomUtil.getNode(".//GCClause-id//ItemId", instanceData), "");
				break;
			case TEMPLATE:
				contractTypeId = Node.getDataWithDefault(NomUtil.getNode(".//Type/GCType-id//Id", instanceData), "");
				instanceItemId = Node.
						getDataWithDefault(NomUtil.getNode(".//GCTemplate-id//ItemId", instanceData), "");
				break;
			case OBLIGATION:
				contractTypeId = Node.getDataWithDefault(NomUtil.getNode(".//ContractType/GCType-id//Id", instanceData), "");
				instanceItemId = Node.
						getDataWithDefault(NomUtil.getNode(".//Obligations-id//ItemId", instanceData), "");
				organizationItemId =  Node.getDataWithDefault(
						NomUtil.getNode(".//RelatedOrganization/GCOrganization-id/ItemId", instanceData), "");
				organizationId = organizationItemId.split("\\.")[1];
				break;
			}

			
			List<CCRule> rules = dataModel.readAllRules(processName, state, contractTypeId, actionName,
					RULE_STATUS_FILTER, organizationId);
			Map<String, String> customAttributes = null;
			for (CCRule rule : rules) {
				boolean result = false;
				fetchConditionsOfRule(rule);
				if(!rule.getConditions().isEmpty()) {
					fillRuleConditionsWithModelValues(rule, instanceData, customAttributes);
					result = executeRule(rule);
				}
				else
					result = true;
				if (result) {
					ruleItemId = rule.getItemId();
					activityListItemId = String.valueOf(rule.getActivityListItemId());
					defaultRule = false;
					ruleName = rule.getName();
					// Breaking execution.
					break;
				}
			}

			try {
				ruleExecutionResultNode = NomUtil.parseXML("<ExecutionResult></ExecutionResult>");
				int ruleItemIdNode = NomUtil.parseXML("<RuleItemId>" + ruleItemId + "</RuleItemId>");
				int contractItemIdNode = NomUtil.parseXML("<InstanceItemId>" + instanceItemId + "</InstanceItemId>");
				int activityListItemNode = NomUtil
						.parseXML("<TaskListItemId>" + activityListItemId + "</TaskListItemId>");
				int defaultRuleNode = NomUtil.parseXML("<DefaultRule>" + defaultRule + "</DefaultRule>");
				int ruleNameNode = NomUtil.parseXML("<Rulename>" + ruleName + "</Rulename>");
				int organizationItemNode = NomUtil
						.parseXML("<OrganizationItemId>" + organizationItemId + "</OrganizationItemId>");
				NomUtil.appendChild(contractItemIdNode, ruleExecutionResultNode);
				NomUtil.appendChild(ruleNameNode, ruleExecutionResultNode);
				NomUtil.appendChild(ruleItemIdNode, ruleExecutionResultNode);
				NomUtil.appendChild(activityListItemNode, ruleExecutionResultNode);
				NomUtil.appendChild(organizationItemNode, ruleExecutionResultNode);
				NomUtil.appendChild(defaultRuleNode, ruleExecutionResultNode);
			} catch (Exception e) {
				logger._log(logger_indentifier, Severity.ERROR, e,
						"Error while while rule engine response, Contact the administrator.");
				throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_RULE_ENGINE_RESPONSE);
			} finally {
				NomUtil.cleanAll(instanceData);
			}
		}
		return ruleExecutionResultNode;
	}

	public int startRulesExecutionForAuthoring(String contractId, int relations, boolean isOnCreate) {
		final int ruleExecutionResultNode = NomUtil.parseXML("<ExecutionResult></ExecutionResult>");
		if (Objects.nonNull(contractId)) {
			int contractData = dataModel.readContract(contractId, isOnCreate, relations);
			Map<String, CCRule> rules = isOnCreate ? dataModel.readContractAuthoringRulesOnCreate(contractId)
					: dataModel.readContractAuthoringRulesOnUpdate(contractId);
			Map<String, String> customAttributes = null;
			fetchConditionsOfAllRules(rules);

			// This can be executed with multithreading.
			rules.keySet().forEach(key -> {
				fillRuleConditionsWithModelValues(rules.get(key), contractData, customAttributes);
				executeRule(rules.get(key));
			});
			try {
				rules.keySet().forEach(key -> {
					int resultNode = formRuleResultForaRule(key, rules.get(key));
					NomUtil.appendChild(resultNode, ruleExecutionResultNode);
				});
			} catch (Exception e) {
				logger._log(logger_indentifier, Severity.ERROR, null,
						"Error while while rule engine response, Contact the administrator.");
				throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_RULE_ENGINE_RESPONSE);
			} finally {
				NomUtil.cleanAll(contractData);
			}
		}
		return ruleExecutionResultNode;

	}

	private int formRuleResultForaRule(String key, CCRule ccRule) {
		int ruleResultNode = 0, ruleResultItemIdNode = 0, ruleItemId = 0, resultNode = 0;
		ruleResultNode = NomUtil.parseXML("<RuleResult></RuleResult>");
		if (Objects.nonNull(key) && !key.isBlank()) {
			ruleResultItemIdNode = NomUtil.parseXML("<RuleResultItemId>" + key + "</RuleResultItemId>");
			NomUtil.appendChild(ruleResultItemIdNode, ruleResultNode);
		}

		ruleItemId = NomUtil.parseXML("<RuleItemId>" + ccRule.getItemId() + "</RuleItemId>");
		resultNode = NomUtil.parseXML("<result>" + ccRule.isResult() + "</result>");

		NomUtil.appendChild(ruleItemId, ruleResultNode);
		NomUtil.appendChild(resultNode, ruleResultNode);
		return ruleResultNode;
	}

	private void fetchConditionsOfRule(CCRule rule) {

		if (Objects.nonNull(rule) && Objects.nonNull(rule.getId())) {
			List<CCCondition> conditions = dataModel.getRuleConditions(rule.getId());
			rule.getConditions().addAll(conditions);
		}
	}

	private void fetchConditionsOfAllRules(Map<String, CCRule> rules) {

		if (Objects.nonNull(rules) && rules.size() > 0) {
			Map<Integer, CCRule> rulesMap = new HashMap<Integer, CCRule>();
			StringBuilder ids = new StringBuilder();
			rules.keySet().forEach(key -> {
				ids.append(rules.get(key).getId()).append(",");
				rulesMap.put(rules.get(key).getId(), rules.get(key));
			});
			if (ids.length() > 0) {
				ids.deleteCharAt(ids.length() - 1);
			}
			List<CCCondition> conditions = dataModel.getRuleConditions(ids.toString());
			if (conditions.size() > 0) {
				conditions.forEach(condition -> {
					CCRule ccRule = rulesMap.get(condition.getRuleId());
					if (Objects.nonNull(ccRule)) {
						ccRule.addCondition(condition);
					}
				});
			}
		}
	}

	private void fillRuleConditionsWithModelValues(CCRule rule, int contractNode,
			Map<String, String> customAttributes) {
		for (CCCondition condition : rule.getConditions()) {
			if (CCOperandTypeEnum.CUSTOM_ATTRIBUTE.equals(condition.getOperandType())) {
				if (Objects.nonNull(condition.getCustomAttributeName())
						&& !condition.getCustomAttributeName().isBlank()) {
					if (CCValueTypeEnum.VALUE.equals(condition.getValueType())) {
						if (Objects.isNull(customAttributes)) {
							String contractItemId = Node
									.getDataWithDefault(NomUtil.getNode(".//Contract-id//ItemId", contractNode), "");
							customAttributes = dataModel.getCustomAttibutesOfContract(contractItemId);
						}
						if (customAttributes.containsKey(condition.getCustomAttributeName())) {
							condition.setAttributePresentInContract(true);
							condition.setPropertyValue(customAttributes.get(condition.getCustomAttributeName()));
						}
					}
				}
			} else {
				if (Objects.nonNull(condition.getxPath()) && !condition.getxPath().isBlank()) {
					condition.setAttributePresentInContract(true);
					if (CCValueTypeEnum.VALUE.equals(condition.getValueType())) {
						if ("TRUE".equals(condition.getIsMultField())) {
							List<String> multiValues = getMultiValues(condition, contractNode);
							condition.setMultiPropValues(multiValues);
						} else {
							condition.setPropertyValue(
									Node.getDataWithDefault(NomUtil.getNode(condition.getxPath(), contractNode), null));
						}
					}
				}
			}
		}
	}

	private List<String> getMultiValues(CCCondition condition, int contractNode) {
		int[] nodes = NomUtil.getNodeList(condition.getxPath(), contractNode);
		List<String> multiValues = new ArrayList<>();
		if (null != nodes && nodes.length > 0) {
			for (int i : nodes) {
				String nodeVal1 = NomUtil.getData(i);
				multiValues.add(nodeVal1);
			}
		}
		return multiValues;
	}

	private boolean evaluateExpression(String expression) {
		int index = expression.length() - 1;
		Stack<Character> stack = new Stack<Character>();
		while (index >= 0) {
			if ('(' == expression.charAt(index)) {
				StringBuilder str = new StringBuilder();
				while (!stack.empty() && ')' != stack.peek()) {
					str.append(stack.pop());
				}
				if (stack.empty() || ')' != stack.peek()) {
					throw new RuntimeException();
				}
				stack.pop();
				char c = (breakExpression(str.toString())) ? 'T' : 'F';
				stack.push(c);
			} else {
				stack.push(expression.charAt(index));
			}
			index--;

		}
		StringBuilder finalExpression = new StringBuilder();
		while (!stack.empty()) {
			finalExpression.append(stack.pop());
		}
		return breakExpression(finalExpression.toString());
	}

	public boolean breakExpression(String expression) {
		boolean result = false;
		if (expression.length() > 0) {
			if (expression.length() == 1) {
				result = value(expression.charAt(0));
			} else if (expression.length() == 2) {
				if ('!' == expression.charAt(0)) {
					result = notOperation(expression.charAt(1));
				}
			} else if (expression.length() == 3) {
				if ('&' == expression.charAt(1)) {
					result = andOperation(expression.charAt(0), expression.charAt(2));
				}
				if ('|' == expression.charAt(1)) {
					result = orOperation(expression.charAt(0), expression.charAt(2));
				}
			} else {
				if ('!' == expression.charAt(0)) {
					char c = (expression.charAt(1) == 'T') ? 'F' : 'T';
					result = breakExpression(c + expression.substring(2));
				} else {
					result = value(expression.charAt(0));
					if ('&' == expression.charAt(1)) {
						result = result && breakExpression(expression.substring(2));
					} else if ('|' == expression.charAt(1)) {
						result = result || breakExpression(expression.substring(2));
					}
				}
			}
		}
		return result;
	}

	public boolean andOperation(char a, char b) {
		if (a == 'T' && b == 'T')
			return true;
		return false;
	}

	public boolean orOperation(char a, char b) {
		if (a == 'T' || b == 'T')
			return true;
		return false;
	}

	public boolean notOperation(char a) {
		if (a == 'T')
			return false;
		return true;
	}

	public boolean value(char a) {
		return ('T' == a) ? true : false;
	}
}
