package com.opentext.apps.ccworkflow.postExecutorJson;


import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExecutorJsonBody {
	
	@JsonProperty("ccProcessType")
	private String ccProcessType;
	
	@JsonProperty("message")
	private Map<String, String> message;
	
	@JsonProperty("actions")
	private Map<String, ExecutorActionJson> actions;
	
	@JsonProperty("actListInstanceItemId")
	private String actListInstanceItemId;

	public String getCCProcessType() {
		return ccProcessType;
	}
	public String getActListInstanceItemId() {
		return actListInstanceItemId;
	}

	public void setCCProcessType(String ccProcessType) {
		this.ccProcessType = ccProcessType;
	}

	public Map<String, String> getMessage() {
		return message;
	}

	public void setMessage(Map<String, String> message) {
		this.message = message;
	}

	public Map<String, ExecutorActionJson> getActions() {
		return actions;
	}

	public void setActions(Map<String, ExecutorActionJson> actions) {
		this.actions = actions;
	}

	@Override
	public String toString() {
		return "ExecutorJsonBody [ccProcessType=" + ccProcessType + ", message="
				+ message + ", actions=" + actions + "]";
	}

	

	
}
