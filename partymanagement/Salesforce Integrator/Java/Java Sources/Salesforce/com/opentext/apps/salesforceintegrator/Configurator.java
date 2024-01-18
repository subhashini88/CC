package com.opentext.apps.salesforceintegrator;

public class Configurator {

	private String username;
	private String password;
	private String clientID;
	private String clientSecret;
	private String appURL;
	private String apiVersion;
	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getClientID() {
		return clientID;
	}

	public void setClientID(String clientID) {
		this.clientID = clientID;
	}

	public String getClientSecret() {
		return clientSecret;
	}

	public void setClientSecret(String clientSecret) {
		this.clientSecret = clientSecret;
	}

	public String getAppURL() {
		return appURL;
	}

	public void setAppURL(String appURL) {
		this.appURL = appURL;
	}
	
	public String getAPIVersion() {
		return apiVersion;
	}

	public void setAPIVerion(String apiVersion) {
		this.apiVersion = apiVersion;
	}

}
