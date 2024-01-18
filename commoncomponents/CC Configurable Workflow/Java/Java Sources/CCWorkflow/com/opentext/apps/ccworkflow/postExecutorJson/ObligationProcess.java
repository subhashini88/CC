package com.opentext.apps.ccworkflow.postExecutorJson;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.cordys.cpc.bsf.soap.SOAPRequestObject;
import com.eibus.util.logger.CordysLogger;
import com.opentext.apps.ccworkflow.rule.CCRuleEngine;
import com.opentext.apps.ccworkflow.rule.exceptions.CCRuleEngineAlertMessages;
import com.opentext.apps.ccworkflow.rule.exceptions.CCRuleEngineException;
import com.opentext.apps.ccworkflow.rule.utils.NomUtil;
import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;

public class ObligationProcess {
	
	ExecutorJsonBody exeJsonBody;
	String otherProps;
	String processType;
	String actionsToPerform;
	private static final CordysLogger logger = CordysLogger.getCordysLogger(CCRuleEngine.class);
	private static String logger_indentifier = "com.opentext.apps.commoncomponents.ccworkflow";

	public ObligationProcess(String processType, String actionsToPerform, String otherProps, ExecutorJsonBody exeJsonBody) {
		this.exeJsonBody = exeJsonBody;
		this.otherProps = otherProps;
		this.processType = processType;
		this.actionsToPerform = actionsToPerform;
	}

	public String trigger() {
		
		String[] allActionsToPerform = actionsToPerform.split(";"); 
		Map<String, ExecutorActionJson> allActions = exeJsonBody.getActions();
		
		for (String action : allActionsToPerform) {
			switch (allActions.get(action).getType()) {
			case "ExecuteProcess":
				triggerBPM(allActions.get(action));
				break;
			case "sendEvent":
				break;
			}
//			for (ExecutorActionJson executorActionJson : obj) {
//				if(executorActionJson.getEventName().equals(eve)) {
//					return eve;
//				}
//			}
		}
		 
		return "NoEvents";
		
	}

	private void triggerBPM(ExecutorActionJson executorActionJson) {
		//Execute Process BPM trigger
		int executeProcessResp = 0;
		SOAPRequestObject executeProcessRequest = 
				new SOAPRequestObject("http://schemas.cordys.com/bpm/execution/1.0","ExecuteProcess", null, null);
		int receiverNode = NomUtil.parseXML("<receiver>"+executorActionJson.getPathBPM()+"</receiver>");
		int actListInstanceItemIdNode = NomUtil.parseXML("<actListInstanceItemId>" + exeJsonBody.getActListInstanceItemId() + 
				"</actListInstanceItemId>");
		int inputObjectNode = NomUtil.parseXML(executorActionJson.getInputObject());
		NomUtil.setAttribute(inputObjectNode, "xmlns", executorActionJson.getNamespace());
		NomUtil.appendChild(actListInstanceItemIdNode, inputObjectNode);
		int msgNode =  NomUtil.parseXML("<message>"+ NomUtil.writeToString(inputObjectNode) + "</message>");
		int typeNode = NomUtil.parseXML("<type>definition</type>");
		
		executeProcessRequest.addParameterAsXml(msgNode);
		executeProcessRequest.addParameterAsXml(receiverNode);
		//executeProcessRequest.addParameterAsXml(actListInstanceItemIdNode);
		executeProcessRequest.addParameterAsXml(typeNode);
		
		try {
			executeProcessResp=executeProcessRequest.execute();
		}catch (Exception e) {
			logger._log(logger_indentifier, Severity.ERROR, e,"Error while executing " + executorActionJson.getBPM() + 
					".Contact the administrator.");
			throw new CCRuleEngineException(CCRuleEngineAlertMessages.ERROR_IN_BPM_EXECUTION, executorActionJson.getBPM());
		}
		finally {
			NomUtil.cleanAll(executeProcessResp,msgNode,receiverNode);
		}
	}

}
