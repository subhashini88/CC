package com.opentext.apps.ccworkflow.rule.exceptions;

import com.eibus.localization.message.Message;
import com.eibus.localization.message.MessageSet;

public class CCRuleEngineAlertMessages {
	public static final MessageSet CC_WORKFLOW_MESSAGE_SET = MessageSet.getMessageSet("com.opentext.apps.commoncomponents.ccworkflow.Messages");

	public static final Message ERROR_IN_RULES_FETCHING = CC_WORKFLOW_MESSAGE_SET.getMessage("errorinrulesfetching");
	public static final Message ERROR_CONTRACT_DATA_FETCHING = CC_WORKFLOW_MESSAGE_SET.getMessage("errorincontractdatafetching");
	public static final Message ERROR_IN_RULE_LOGIC_VALIDATION = CC_WORKFLOW_MESSAGE_SET.getMessage("errorinrulelogicvalidation");
	public static final Message ERROR_EMPTY_RULE_LOGIC = CC_WORKFLOW_MESSAGE_SET.getMessage("erroremptyrulelogic");
	public static final Message ERROR_IN_RULE_CONDITION_VALIDATION = CC_WORKFLOW_MESSAGE_SET.getMessage("errorinruleconditionvalidation");
	public static final Message ERROR_IN_RULE_EXECUTION = CC_WORKFLOW_MESSAGE_SET.getMessage("errorinruleexecution");
	public static final Message ERROR_RULE_ENGINE_RESPONSE = CC_WORKFLOW_MESSAGE_SET.getMessage("errorinruleengineresponse");
	public static final Message ERROR_IN_CUSTOM_ATTRIBUTES_FETCHING = CC_WORKFLOW_MESSAGE_SET.getMessage("errorincustomattributesfetching");
	public static final Message ERROR_IN_BPM_EXECUTION = CC_WORKFLOW_MESSAGE_SET.getMessage("errorinBPMExecution");
	

}
