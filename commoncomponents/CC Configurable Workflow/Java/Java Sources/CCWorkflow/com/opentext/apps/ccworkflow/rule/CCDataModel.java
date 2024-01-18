package com.opentext.apps.ccworkflow.rule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import com.cordys.cpc.bsf.soap.SOAPRequestObject;
import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;
import com.eibus.xml.nom.Node;
import com.eibus.xml.nom.internal.NOMDocumentPool;
import com.opentext.apps.ccworkflow.rule.enums.CCOperandTypeEnum;
import com.opentext.apps.ccworkflow.rule.enums.CCOperatorEnum;
import com.opentext.apps.ccworkflow.rule.enums.CCPropertyDataTypeEnum;
import com.opentext.apps.ccworkflow.rule.enums.CCValueTypeEnum;
import com.opentext.apps.ccworkflow.rule.exceptions.CCRuleEngineAlertMessages;
import com.opentext.apps.ccworkflow.rule.exceptions.CCRuleEngineException;
import com.opentext.apps.ccworkflow.rule.utils.NomUtil;

public class CCDataModel {

	private static final CordysLogger logger = CordysLogger.getCordysLogger(CCDataModel.class);
	private static String logger_indentifier = "com.opentext.apps.commoncomponents.ccworkflow";

	public int readContract(String contractId, boolean isCreate, int relations) {

		int readContractResponse = 0, readContractRequestParams = 0;
		if (!isCreate) {
			try {
				SOAPRequestObject readContractRequest = new SOAPRequestObject(
						"http://schemas.opentext.com/apps/contractcenter/16.3", "GetContractDataforRules", null, null);
				readContractRequestParams = NomUtil.parseXML("<ContractId>" + contractId + "</ContractId>");
				readContractRequest.addParameterAsXml(readContractRequestParams);
				readContractRequest.addParameterAsXml(relations);
				readContractResponse = readContractRequest.sendAndWait();

			} catch (Exception e) {
				logger._log(logger_indentifier, Severity.ERROR, e,
						CCRuleEngineAlertMessages.ERROR_CONTRACT_DATA_FETCHING);
				throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_CONTRACT_DATA_FETCHING);
			} finally {
				NomUtil.cleanAll(readContractRequestParams);
			}
		} else {
			try {
				SOAPRequestObject readContractRequest = new SOAPRequestObject(
						"http://schemas.opentext.com/apps/contractcenter/16.3", "GetContractRelationsforRules", null,
						null);
				readContractRequestParams = NomUtil.parseXML("<ContractId>" + contractId + "</ContractId>");
				readContractRequest.addParameterAsXml(readContractRequestParams);
				readContractResponse = readContractRequest.sendAndWait();
			} catch (Exception e) {
				logger._log(logger_indentifier, Severity.ERROR, e,
						CCRuleEngineAlertMessages.ERROR_CONTRACT_DATA_FETCHING);
				throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_CONTRACT_DATA_FETCHING);
			} finally {
				NomUtil.cleanAll(readContractRequestParams);
			}
		}
		return readContractResponse;
	}
	
	public int readClause(String clauseId, boolean isCreate) {

		int readClauseResponse = 0, readClauseRequestParams = 0;
		
			try {
				SOAPRequestObject readClauseRequest = new SOAPRequestObject(
						"http://schemas/OpenTextContentLibrary/GCClause/operations", "ReadGCClause", null, null);
				readClauseRequestParams = NOMDocumentPool.getInstance().createElement("GCClause-id");	
				int idNode = NomUtil.parseXML("<Id>" + clauseId + "</Id>");
				NomUtil.appendChild(idNode, readClauseRequestParams);
				readClauseRequest.addParameterAsXml(readClauseRequestParams);
				readClauseResponse = readClauseRequest.sendAndWait();

			} catch (Exception e) {
				logger._log(logger_indentifier, Severity.ERROR, e,
						CCRuleEngineAlertMessages.ERROR_CONTRACT_DATA_FETCHING);
				throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_CONTRACT_DATA_FETCHING);
			} finally {
				NomUtil.cleanAll(readClauseRequestParams);
			}
		
		return readClauseResponse;
	}
	
	public int readTemplate(String templateId, boolean isCreate) {

		int readTemplateResponse = 0, readTemplateRequestParams = 0;
		
			try {
				SOAPRequestObject readTemplateRequest = new SOAPRequestObject(
						"http://schemas/OpenTextContentLibrary/GCTemplate/operations", "ReadGCTemplate", null, null);
				readTemplateRequestParams = NOMDocumentPool.getInstance().createElement("GCTemplate-id");	
				int idNode = NomUtil.parseXML("<Id>" + templateId + "</Id>");
				NomUtil.appendChild(idNode, readTemplateRequestParams);
				readTemplateRequest.addParameterAsXml(readTemplateRequestParams);
				readTemplateResponse = readTemplateRequest.sendAndWait();

			} catch (Exception e) {
				logger._log(logger_indentifier, Severity.ERROR, e,
						CCRuleEngineAlertMessages.ERROR_CONTRACT_DATA_FETCHING);
				throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_CONTRACT_DATA_FETCHING);
			} finally {
				NomUtil.cleanAll(readTemplateRequestParams);
			}
		
		return readTemplateResponse;
	}

	public int readObligation(String obligationId, boolean isCreate) {

		int readObligationResponse = 0, getObligationDetailsParams = 0;
		
			try {
				SOAPRequestObject getObligationDetails = new SOAPRequestObject(
						"http://schemas.opentext.com/apps/contractcenter/16.3", "GetObligationDetails", null, null);
				getObligationDetailsParams = NOMDocumentPool.getInstance().createElement("Obligations-id");
				
				String[] obligationIds = obligationId.split("\\.");
				String CTRid = obligationIds[1];
				String OBLid = obligationIds[2];
				
				int CTRidNode = NomUtil.parseXML("<Id>" + CTRid + "</Id>");
				int OBLidNode = NomUtil.parseXML("<Id1>" + OBLid + "</Id1>");
				NomUtil.appendChild(CTRidNode, getObligationDetailsParams);
				NomUtil.appendChild(OBLidNode, getObligationDetailsParams);
				getObligationDetails.addParameterAsXml(getObligationDetailsParams);
				readObligationResponse = getObligationDetails.sendAndWait();

			} catch (Exception e) {
				logger._log(logger_indentifier, Severity.ERROR, e,
						CCRuleEngineAlertMessages.ERROR_CONTRACT_DATA_FETCHING);
				throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_CONTRACT_DATA_FETCHING);
			} finally {
				NomUtil.cleanAll(getObligationDetailsParams);
			}
		
		return readObligationResponse;
	}
	
	public List<CCRule> readAllRules(String process, String state, String type, String action, String status,
			String organizationId) {

		List<CCRule> rules = new ArrayList<CCRule>();
		int readRulesResponse = 0, tempParameterNode = 0;
		try {
			SOAPRequestObject readContractRequest = new SOAPRequestObject(
					"http://schemas.opentext.com/apps/cc/configworkflow/20.2", "GetRulesForExecution", null, null);

			tempParameterNode = NomUtil.parseXML("<ProcessFilter>" + process + "</ProcessFilter>");
			readContractRequest.addParameterAsXml(tempParameterNode);
			tempParameterNode = NomUtil.parseXML("<StateFilter>" + state + "</StateFilter>");
			readContractRequest.addParameterAsXml(tempParameterNode);
			tempParameterNode = NomUtil.parseXML("<ActionFilter>" + action + "</ActionFilter>");
			readContractRequest.addParameterAsXml(tempParameterNode);
			tempParameterNode = NomUtil.parseXML("<TypeIdFilter>" + type + "</TypeIdFilter>");
			readContractRequest.addParameterAsXml(tempParameterNode);
			tempParameterNode = NomUtil.parseXML("<RuleStatusFilter>" + status + "</RuleStatusFilter>");
			readContractRequest.addParameterAsXml(tempParameterNode);
			tempParameterNode = NomUtil.parseXML("<OrganizationIdFilter>" + organizationId + "</OrganizationIdFilter>");
			readContractRequest.addParameterAsXml(tempParameterNode);
			readRulesResponse = readContractRequest.sendAndWait();
			int nodes[] = NomUtil.getNodeList(".//Rules//Rule", readRulesResponse);
			for (int ruleNode : nodes) {
				CCRule rule = createRuleObjFromResoponse(ruleNode);
				rules.add(rule);
			}
			Collections.sort(rules);
		} catch (Exception e) {
			logger._log(logger_indentifier, Severity.ERROR, e, CCRuleEngineAlertMessages.ERROR_IN_RULES_FETCHING);
			throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_IN_RULES_FETCHING);
		} finally {
			NomUtil.cleanAll(tempParameterNode, readRulesResponse);
		}
		return rules;
	}

	private CCRule createRuleObjFromResoponse(int ruleNode) {
		CCRule rule = new CCRule();
		rule.setName(Node.getDataWithDefault(NomUtil.getNode(".//Name", ruleNode), null));
		rule.setOrder(Integer.valueOf(Node.getDataWithDefault(NomUtil.getNode(".//Order", ruleNode), "0")));
		rule.setCode(Node.getDataWithDefault(NomUtil.getNode(".//Code", ruleNode), null));
		rule.setCreationType(Node.getDataWithDefault(NomUtil.getNode(".//CreationType", ruleNode), null));
		rule.setId(Integer.valueOf(Node.getDataWithDefault(NomUtil.getNode(".//Rule-id//Id", ruleNode), "0")));
		rule.setItemId(Node.getDataWithDefault(NomUtil.getNode(".//Rule-id//ItemId", ruleNode), null));
		rule.setRuleLogic(Node.getDataWithDefault(NomUtil.getNode(".//Logic", ruleNode), null));
		rule.setActivityListId(Integer.valueOf(Node
				.getDataWithDefault(NomUtil.getNode(".//RelatedActivityList//ActivityList-id//Id", ruleNode), "0")));
		rule.setActivityListItemId(Node.getDataWithDefault(
				NomUtil.getNode(".//RelatedActivityList//ActivityList-id//ItemId", ruleNode), null));

		// Commented because conditions are being read while execution.
		int nodes[] = new int[0];// NomUtil.getNodeList(".//Conditions//RuleConditions", ruleNode);
		for (int conditionNode : nodes) {
			CCCondition condition = createConditionObjFromResoponse(conditionNode);
			condition.setRuleName(rule.getName());
			rule.addCondition(condition);
		}

		return rule;
	}

	private CCCondition createConditionObjFromResoponse(int conditionNode) {
		CCCondition condition = new CCCondition();
		condition.setId(Integer.valueOf(
				Node.getDataWithDefault(NomUtil.getNode(".//RuleConditionOperand-id//Id", conditionNode), "0")));
		condition.setRuleId(
				Integer.valueOf(Node.getDataWithDefault(NomUtil.getNode(".//Owner//Rule-id//Id", conditionNode), "0")));
		condition.setItemId(
				Node.getDataWithDefault(NomUtil.getNode(".//RuleConditionOperand-id//ItemId", conditionNode), null));
		condition.setConditionNumber(
				Integer.valueOf(Node.getDataWithDefault(NomUtil.getNode(".//Order", conditionNode), "0")));
		condition.setName(Node.getDataWithDefault(NomUtil.getNode(".//RuleLeftOperand//Name", conditionNode), null));
		condition.setOperator(CCOperatorEnum
				.valueOf(Node.getDataWithDefault(NomUtil.getNode(".//Operator", conditionNode), "EQUALTO")));
		condition
				.setProperty(Node.getDataWithDefault(NomUtil.getNode(".//RuleLeftOperand//Name", conditionNode), null));
		String operandType = Node.getDataWithDefault(NomUtil.getNode(".//LeftOperandType", conditionNode), null);

		if (CCOperandTypeEnum.CUSTOM_ATTRIBUTE.getValue().equals(operandType)) {
			condition.setOperandType(CCOperandTypeEnum.CUSTOM_ATTRIBUTE);
			condition.setCustomAttributeName(
					Node.getDataWithDefault(NomUtil.getNode(".//CustomAttrName", conditionNode), null));
			condition.setPropertyDataType(CCPropertyDataTypeEnum
					.valueOf(Node.getDataWithDefault(NomUtil.getNode(".//CustomAttrType", conditionNode), "TEXT")));
		} else {
			condition.setOperandType(CCOperandTypeEnum.GENERAL_ATTRIBUTE);
			condition.setPropertyDataType(CCPropertyDataTypeEnum.valueOf(
					Node.getDataWithDefault(NomUtil.getNode(".//RuleLeftOperand//DataType", conditionNode), "TEXT")));
		}
		condition.setValueType(CCValueTypeEnum
				.valueOf(Node.getDataWithDefault(NomUtil.getNode(".//RuleLeftOperand//Type", conditionNode), "VALUE")));
		condition.setDefaultResult("true".equalsIgnoreCase(
				Node.getDataWithDefault(NomUtil.getNode(".//DefaultResult", conditionNode), "false")) ? true : false);

		if (CCOperatorEnum.IN_LIST.equals(condition.getOperator())
				|| CCOperatorEnum.NOT_IN_LIST.equals(condition.getOperator())) {
			condition.setValues(Node.getDataWithDefault(NomUtil.getNode(".//Value", conditionNode), "").split(","));
		} else {
			condition.setValue(Node.getDataWithDefault(NomUtil.getNode(".//Value", conditionNode), null));
		}
		condition.setxPath(Node.getDataWithDefault(NomUtil.getNode(".//RuleLeftOperand//Xpath", conditionNode), null));

		String isMultiField = Node
				.getDataWithDefault(NomUtil.getNode(".//RuleLeftOperand//IsMultiField", conditionNode), null);
		condition.setIsMultField(isMultiField);

		return condition;
	}

	public List<CCCondition> getRuleConditions(int ruleId) {
		List<CCCondition> conditions = new ArrayList<CCCondition>();
		int readConditionsResponse = 0, tempParameterNode = 0;
		try {
			SOAPRequestObject readContractRequest = new SOAPRequestObject(
					"http://schemas.opentext.com/apps/cc/configworkflow/20.2", "GetRuleConditionsForExecution", null,
					null);
			tempParameterNode = NomUtil.parseXML("<ruleId>" + ruleId + "</ruleId>");
			readContractRequest.addParameterAsXml(tempParameterNode);
			readConditionsResponse = readContractRequest.sendAndWait();
			int nodes[] = NomUtil.getNodeList(".//Conditions//RuleConditions", readConditionsResponse);
			for (int conditionNode : nodes) {
				CCCondition condition = createConditionObjFromResoponse(conditionNode);
				conditions.add(condition);
			}
		} catch (Exception e) {
			logger._log(logger_indentifier, Severity.ERROR, e, CCRuleEngineAlertMessages.ERROR_IN_RULES_FETCHING);
			throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_IN_RULES_FETCHING);
		} finally {
			NomUtil.cleanAll(tempParameterNode, readConditionsResponse);
		}
		return conditions;
	}

	public List<CCCondition> getRuleConditions(String ruleIds) {
		List<CCCondition> conditions = new ArrayList<CCCondition>();
		if (Objects.nonNull(ruleIds) && !ruleIds.isBlank()) {
			int readConditionsResponse = 0, tempParameterNode = 0;
			try {
				SOAPRequestObject readContractRequest = new SOAPRequestObject(
						"http://schemas.opentext.com/apps/cc/configworkflow/20.2", "GetRuleConditionsForExecution",
						null, null);
				tempParameterNode = NomUtil.parseXML("<ruleId>" + ruleIds + "</ruleId>");
				readContractRequest.addParameterAsXml(tempParameterNode);
				readConditionsResponse = readContractRequest.sendAndWait();
				int nodes[] = NomUtil.getNodeList(".//Conditions//RuleConditions", readConditionsResponse);
				for (int conditionNode : nodes) {
					CCCondition condition = createConditionObjFromResoponse(conditionNode);
					conditions.add(condition);
				}
			} catch (Exception e) {
				logger._log(logger_indentifier, Severity.ERROR, e, CCRuleEngineAlertMessages.ERROR_IN_RULES_FETCHING);
				throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_IN_RULES_FETCHING);
			} finally {
				NomUtil.cleanAll(tempParameterNode, readConditionsResponse);
			}
		}
		return conditions;
	}

	public Map<String, String> getCustomAttibutesOfContract(String contractItemId) {
		Map<String, String> customAttributes = new HashMap<String, String>();
		int readCustomAttributesResponse = 0, tempParameterNode = 0;
		try {
			SOAPRequestObject readCustomAttributesRequest = new SOAPRequestObject(
					"http://schemas.opentext.com/apps/contractcenter/16.3", "GetMappedCustomAttributes", null, null);
			tempParameterNode = NomUtil.parseXML("<ContractItemId>" + contractItemId + "</ContractItemId>");
			readCustomAttributesRequest.addParameterAsXml(tempParameterNode);
			readCustomAttributesResponse = readCustomAttributesRequest.sendAndWait();
			int nodes[] = NomUtil.getNodeList(".//FindZ_INT_RelatedAttributesListResponse//RelatedAttributes",
					readCustomAttributesResponse);
			for (int customAttributeNode : nodes) {
				String key = Node.getDataWithDefault(NomUtil.getNode(".//Name", customAttributeNode), null);
				if (Objects.nonNull(key) && !key.isBlank()) {
					String value = Node.getDataWithDefault(NomUtil.getNode(".//Value", customAttributeNode), null);
					customAttributes.put(key, value);
				}

			}
		} catch (Exception e) {
			logger._log(logger_indentifier, Severity.ERROR, e,
					CCRuleEngineAlertMessages.ERROR_IN_CUSTOM_ATTRIBUTES_FETCHING);
			throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_IN_CUSTOM_ATTRIBUTES_FETCHING);
		} finally {
			NomUtil.cleanAll(tempParameterNode, readCustomAttributesResponse);
		}
		return customAttributes;
	}

	public Map<String, CCRule> readContractAuthoringRulesOnUpdate(String contractId) {
		Map<String, CCRule> rules = new HashMap<String, CCRule>();
		int readRulesResponse = 0, tempParameterNode = 0;
		try {
			SOAPRequestObject readContractRequest = new SOAPRequestObject(
					"http://schemas.opentext.com/apps/contractcenter/16.3", "GetContractAuthoringRules", null, null);

			tempParameterNode = NomUtil.parseXML("<ContractId>" + contractId + "</ContractId>");
			readContractRequest.addParameterAsXml(tempParameterNode);
			readRulesResponse = readContractRequest.sendAndWait();
			int nodes[] = NomUtil.getNodeList(".//Rules//RuleResult", readRulesResponse);
			for (int ruleResultNode : nodes) {
				String ruleResultItemId = Node
						.getDataWithDefault(NomUtil.getNode(".//RuleResult-id//ItemId1", ruleResultNode), null);
				if (Objects.nonNull(ruleResultItemId) && !ruleResultItemId.isBlank()) {
					CCRule rule = createRuleObjFromResoponse(NomUtil.getNode(".//Rule", ruleResultNode));
					rules.put(ruleResultItemId, rule);
				}
			}
		} catch (Exception e) {
			logger._log(logger_indentifier, Severity.ERROR, e, CCRuleEngineAlertMessages.ERROR_IN_RULES_FETCHING);
			throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_IN_RULES_FETCHING);
		} finally {
			NomUtil.cleanAll(tempParameterNode, readRulesResponse);
		}
		return rules;
	}

	public Map<String, CCRule> readContractAuthoringRulesOnCreate(String contractId) {
		Map<String, CCRule> rules = new HashMap<String, CCRule>();
		Map<String, String> tempIdsMap = new HashMap<String, String>();
		int readRulesResponse = 0, tempParameterNode = 0;
		try {
			SOAPRequestObject readContractRequest = new SOAPRequestObject(
					"http://schemas/OpenTextContractCenter/Contract.RuleResult/operations", "getContractRuleResults",
					null, null);

			tempParameterNode = NomUtil.parseXML("<contractId>" + contractId + "</contractId>");
			readContractRequest.addParameterAsXml(tempParameterNode);
			readRulesResponse = readContractRequest.sendAndWait();
			int nodes[] = NomUtil.getNodeList(".//RuleResult", readRulesResponse);
			StringBuilder ids = new StringBuilder();
			for (int ruleResultNode : nodes) {
				String ruleResultItemId = Node
						.getDataWithDefault(NomUtil.getNode(".//RuleResult-id//ItemId1", ruleResultNode), null);
				if (Objects.nonNull(ruleResultItemId) && !ruleResultItemId.isBlank()) {
					String ruleId = Node.getDataWithDefault(NomUtil.getNode(".//Rule-id//Id", ruleResultNode), null);
					if (Objects.nonNull(ruleId) && !ruleId.isBlank()) {
						ids.append(ruleId).append(",");
					}
					tempIdsMap.put(ruleResultItemId, ruleId);
				}
			}
			if (ids.length() > 0) {
				ids.deleteCharAt(ids.length() - 1);
			}
			Map<String, CCRule> rulesTempMap = getAllRequiredRulesInfo(ids);
			tempIdsMap.keySet().forEach(ruleResultId -> {
				rules.put(ruleResultId, rulesTempMap.get(tempIdsMap.get(ruleResultId)));
			});
		} catch (Exception e) {
			logger._log(logger_indentifier, Severity.ERROR, e, CCRuleEngineAlertMessages.ERROR_IN_RULES_FETCHING);
			throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_IN_RULES_FETCHING);
		} finally {
			NomUtil.cleanAll(tempParameterNode, readRulesResponse);
		}
		return rules;
	}

	private Map<String, CCRule> getAllRequiredRulesInfo(StringBuilder ids) {
		Map<String, CCRule> rules = new HashMap<String, CCRule>();
		int readRulesResponse = 0, tempParameterNode = 0;
		try {
			SOAPRequestObject readContractRequest = new SOAPRequestObject(
					"http://schemas.opentext.com/apps/cc/configworkflow/20.2", "GetAuthoringRulesForExecution", null,
					null);

			tempParameterNode = NomUtil.parseXML("<ruleIDFilter>" + ids + "</ruleIDFilter>");
			readContractRequest.addParameterAsXml(tempParameterNode);
			readRulesResponse = readContractRequest.sendAndWait();
			int nodes[] = NomUtil.getNodeList(".//Rules/Rule", readRulesResponse);
			for (int ruleResultNode : nodes) {
				CCRule rule = createRuleObjFromResoponse(ruleResultNode);
				rules.put(String.valueOf(rule.getId()), rule);
			}
		} catch (Exception e) {
			logger._log(logger_indentifier, Severity.ERROR, e, CCRuleEngineAlertMessages.ERROR_IN_RULES_FETCHING);
			throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_IN_RULES_FETCHING);
		} finally {
			NomUtil.cleanAll(tempParameterNode, readRulesResponse);
		}
		return rules;
	}
}
