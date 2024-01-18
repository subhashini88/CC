package com.opentext.apps.ccworkflow.postExecutorJson;


import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExecutorActionJson {
	
	@JsonProperty("pathBPM")
	private String pathBPM;
	
	@JsonProperty("BPM")
	private String BPM;
	
	@JsonProperty("namespace")
	private String namespace;

	@JsonProperty("eventName")
	private String eventName;
	
	@JsonProperty("inputObject")
	private String inputObject;
	
	@JsonProperty("type")
	private String type;

	public String getType() {
		return type;
	}

	public String getPathBPM() {
		return pathBPM;
	}
	public String getBPM() {
		return BPM;
	}
	public String getNamespace() {
		return namespace;
	}
	
	public String getEventName() {
		return eventName;
	}
	
	public String getInputObject() {
		return inputObject;
	}

	@Override
	public String toString() {
		return "ExecutorActionJson [pathBPM=" + pathBPM + ", eventName=" + eventName + ", inputObject=" + inputObject
				+ "]";
	}

}
