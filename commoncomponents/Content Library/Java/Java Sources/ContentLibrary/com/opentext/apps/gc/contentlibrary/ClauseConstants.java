package com.opentext.apps.gc.contentlibrary;

public interface ClauseConstants {

	StringBuilder CLAUSE_CASE_MODEL_XML = new StringBuilder("<data>"+
			"	  <GetCaseModelResponse xmlns:SOAP=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns=\"http://schemas.cordys.com/casemanagement/modeladministration/1.0\">"+
			"	    <model name=\"com/opentext/apps/gc/GCClause#ef#/bb/Lifecycle/Lifecycle/GCClause\" space=\"organization\" status=\"ACTIVE\" id=\"F8E4E399-CF40-A1ED-A9E4-926FD66AB160\" latestrevision=\"002B6743-E6B0-A1EE-8266-C6BE1267316D\" publishedDate=\"1686627236160\">"+
			"	      <description>GCClause</description>"+
			"	      <runtimedefinition>"+
			"	        <case:casemodel xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns4=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns3=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns8=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns7=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns13=\"http://schemas/OpenTextContentLibrary/GCClause\" xmlns:ns9=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns12=\"http://schemas/OpenTextContentLibrary/GCClause/operations\" xmlns:ns11=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns10=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns17=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns16=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns15=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns14=\"http://schemas/OpenTextContentLibrary/GCClauseCategory\" xmlns:ns171=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns18=\"http://schemas/OpenTextContentLibrary/GCClause.Activityflow\" xmlns=\"\">"+
			"	          <case:caseproperties>"+
			"	            <case:name>com/opentext/apps/gc/GCClause#ef#/bb/Lifecycle/Lifecycle/GCClause</case:name>"+
			"	            <case:description>GCClause</case:description>"+
			"	            <case:priority>MEDIUM</case:priority>"+
			"	            <case:mode>lifecycle</case:mode>"+
			"	            <case:version>2</case:version>"+
			"	            <case:caseidentifiers>"+
			"	              <case:identifier name=\"CurrentState\" description=\"Current Functional State\" expression=\"case:caseinstanceproperties/case:currentstate/text()\" type=\"STRING\" identifierID=\"002B6743-E6B0-A1EE-8266-C6BE126B716D\" />"+
			"	            </case:caseidentifiers>"+
			"	            <case:duedate type=\"duration\" dynamic=\"false\" />"+
			"	            <case:escalation />"+
			"	          </case:caseproperties>"+
			"	          <case:businessevents />"+
			"	          <case:followups>"+
			"	            <case:followup activityid=\"484D7EE4-6263-A1E8-B2E3-5198A10E4896\" activityname=\"General task\" activitytype=\"HUMANTASK\" stateId=\"F8B156BC-2CB7-A1E8-AC41-5D80BE7A3031\" stateName=\"Clause life cycle\" />"+
			"	          </case:followups>"+
			"	          <sm:scxml xmlns:sm=\"http://www.w3.org/2005/07/scxml\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" version=\"1.0\" initialstate=\"RootCaseModelState\">"+
			"	            <sm:datamodel>"+
			"	              <sm:data name=\"case:messagemap\">"+
			"	                <case:caseinstanceproperties />"+
			"	                <case:casevariables />"+
			"	                <case:attachments />"+
			"	              </sm:data>"+
			"	            </sm:datamodel>"+
			"	            <sm:state id=\"RootCaseModelState\" name=\"Default State\" initialstate=\"F8B156BC-2CB7-A1E8-AC41-5D80BE7A3031\" statedbID=\"002B6743-E6B0-A1EE-8266-C6BE1267716D\">"+
			"	              <sm:onentry />"+
			"	              <sm:state id=\"F8B156BC-2CB7-A1E8-AC41-5D80BE7A3031\" name=\"Clause life cycle\" statedbID=\"002B6743-E6B0-A1EE-8266-C6BE1267B16D\">"+
			"	                <sm:onentry />"+
			"	                <sm:transition sourceActivity=\"Clause life cycle\" event=\"484D7EE4-6263-A1E8-B2E3-5198A10E4896.planned\">"+
			"	                  <case:releaseactivity activity=\"484D7EE4-6263-A1E8-B2E3-5198A10E4896\" name=\"General task\" srctype=\"LOCAL\" activitycluster=\"StateCluster_Clause life cycle\" activitydbID=\"002B6743-E6B0-A1EE-8266-C6BE1267F16D\" />"+
			"	                </sm:transition>"+
			"	                <sm:state id=\"F8B156BC-2CB7-A1E8-AC41-6BE5170FB031\" name=\"Draft\" statedbID=\"002B6743-E6B0-A1EE-8266-C6BE1268316D\">"+
			"	                  <sm:onentry>"+
			"	                    <case:releaseactivity xmlns:ns18=\"http://schemas/OpenTextContentLibrary/GCClause.Activityflow\" xmlns:ns171=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns14=\"http://schemas/OpenTextContentLibrary/GCClauseCategory\" xmlns:ns15=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns16=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns17=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns10=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns11=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns12=\"http://schemas/OpenTextContentLibrary/GCClause/operations\" xmlns:ns9=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns13=\"http://schemas/OpenTextContentLibrary/GCClause\" xmlns:ns7=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns8=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns3=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns4=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" activity=\"B4B676CD-53D8-A1E8-B381-155C2C7AC876\" name=\"StateTransitionForClause\" srctype=\"LOCAL\" activitycluster=\"StateCluster_Draft\" activitydbID=\"002B6743-E6B0-A1EE-8266-C6BE1268716D\" />"+
			"	                  </sm:onentry>"+
			"	                  <sm:transition isDefault=\"true\" event=\"DraftToApproved\" target=\"F8B156BC-2CB7-A1E8-AC41-6BE51705B031\" usereventid=\"F8B156BC2CB7A1E8AC6177A83E27B031\" />"+
			"	                  <sm:transition isDefault=\"false\" event=\"DraftToArchive\" target=\"F8B156BC-2CB7-A1E8-AC41-7101BB873031\" usereventid=\"B4B676CD53D8A1E8B38170936F1F8876\" />"+
			"	                  <sm:transition event=\"B4B676CD-53D8-A1E8-B381-155C2C7AC876.done B4B676CD-53D8-A1E8-B902-DFF88D65087B.planned\" sourceActivity=\"StateTransitionForClause\">"+
			"	                    <case:releaseactivity xmlns:ns18=\"http://schemas/OpenTextContentLibrary/GCClause.Activityflow\" xmlns:ns171=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns14=\"http://schemas/OpenTextContentLibrary/GCClauseCategory\" xmlns:ns15=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns16=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns17=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns10=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns11=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns12=\"http://schemas/OpenTextContentLibrary/GCClause/operations\" xmlns:ns9=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns13=\"http://schemas/OpenTextContentLibrary/GCClause\" xmlns:ns7=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns8=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns3=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns4=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" activity=\"B4B676CD-53D8-A1E8-B902-DFF88D65087B\" name=\"UpdateClauseStatus\" srctype=\"LOCAL\" activitycluster=\"StateCluster_Draft\" activitydbID=\"002B6743-E6B0-A1EE-8266-C6BE1268B16D\" />"+
			"	                  </sm:transition>"+
			"	                </sm:state>"+
			"	                <sm:state id=\"F8B156BC-2CB7-A1E8-AC41-6BE51705B031\" name=\"Approved\" statedbID=\"002B6743-E6B0-A1EE-8266-C6BE1268F16D\">"+
			"	                  <sm:onentry>"+
			"	                    <case:releaseactivity xmlns:ns18=\"http://schemas/OpenTextContentLibrary/GCClause.Activityflow\" xmlns:ns171=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns14=\"http://schemas/OpenTextContentLibrary/GCClauseCategory\" xmlns:ns15=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns16=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns17=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns10=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns11=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns12=\"http://schemas/OpenTextContentLibrary/GCClause/operations\" xmlns:ns9=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns13=\"http://schemas/OpenTextContentLibrary/GCClause\" xmlns:ns7=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns8=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns3=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns4=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" activity=\"B4B676CD-53D8-A1E8-B381-155C2C784876\" name=\"StateTransitionForClause\" srctype=\"LOCAL\" activitycluster=\"StateCluster_Approved\" activitydbID=\"002B6743-E6B0-A1EE-8266-C6BE1269316D\" />"+
			"	                  </sm:onentry>"+
			"	                  <sm:transition isDefault=\"true\" event=\"ApprovedToActive\" target=\"F8B156BC-2CB7-A1E8-AC41-7101BB92B031\" usereventid=\"F8B156BC2CB7A1E8AC6177A83E253031\" />"+
			"	                  <sm:transition isDefault=\"false\" event=\"ApprovedToArchive\" target=\"F8B156BC-2CB7-A1E8-AC41-7101BB873031\" usereventid=\"B4B676CD53D8A1E8B38170936F198876\" />"+
			"	                  <sm:transition event=\"B4B676CD-53D8-A1E8-B381-155C2C784876.done B4B676CD-53D8-A1E8-B902-DFF88D61087B.planned\" sourceActivity=\"StateTransitionForClause\">"+
			"	                    <case:releaseactivity xmlns:ns18=\"http://schemas/OpenTextContentLibrary/GCClause.Activityflow\" xmlns:ns171=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns14=\"http://schemas/OpenTextContentLibrary/GCClauseCategory\" xmlns:ns15=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns16=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns17=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns10=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns11=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns12=\"http://schemas/OpenTextContentLibrary/GCClause/operations\" xmlns:ns9=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns13=\"http://schemas/OpenTextContentLibrary/GCClause\" xmlns:ns7=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns8=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns3=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns4=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" activity=\"B4B676CD-53D8-A1E8-B902-DFF88D61087B\" name=\"UpdateClauseStatus\" srctype=\"LOCAL\" activitycluster=\"StateCluster_Approved\" activitydbID=\"002B6743-E6B0-A1EE-8266-C6BE1269716D\" />"+
			"	                  </sm:transition>"+
			"	                </sm:state>"+
			"	                <sm:state id=\"F8B156BC-2CB7-A1E8-AC41-7101BB92B031\" name=\"Active\" statedbID=\"002B6743-E6B0-A1EE-8266-C6BE1269B16D\">"+
			"	                  <sm:onentry>"+
			"	                    <case:releaseactivity xmlns:ns18=\"http://schemas/OpenTextContentLibrary/GCClause.Activityflow\" xmlns:ns171=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns14=\"http://schemas/OpenTextContentLibrary/GCClauseCategory\" xmlns:ns15=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns16=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns17=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns10=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns11=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns12=\"http://schemas/OpenTextContentLibrary/GCClause/operations\" xmlns:ns9=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns13=\"http://schemas/OpenTextContentLibrary/GCClause\" xmlns:ns7=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns8=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns3=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns4=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" activity=\"B4B676CD-53D8-A1E8-B381-155C2C75C876\" name=\"StateTransitionForClause\" srctype=\"LOCAL\" activitycluster=\"StateCluster_Active\" activitydbID=\"002B6743-E6B0-A1EE-8266-C6BE1269F16D\" />"+
			"	                  </sm:onentry>"+
			"	                  <sm:transition isDefault=\"false\" event=\"ActiveToArchive\" target=\"F8B156BC-2CB7-A1E8-AC41-7101BB873031\" usereventid=\"F8B156BC2CB7A1E8AC6177A83E22B031\" />"+
			"	                  <sm:transition event=\"B4B676CD-53D8-A1E8-B381-155C2C75C876.done B4B676CD-53D8-A1E8-B902-DFF88D5D087B.planned\" sourceActivity=\"StateTransitionForClause\">"+
			"	                    <case:releaseactivity xmlns:ns18=\"http://schemas/OpenTextContentLibrary/GCClause.Activityflow\" xmlns:ns171=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns14=\"http://schemas/OpenTextContentLibrary/GCClauseCategory\" xmlns:ns15=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns16=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns17=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns10=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns11=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns12=\"http://schemas/OpenTextContentLibrary/GCClause/operations\" xmlns:ns9=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns13=\"http://schemas/OpenTextContentLibrary/GCClause\" xmlns:ns7=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns8=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns3=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns4=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" activity=\"B4B676CD-53D8-A1E8-B902-DFF88D5D087B\" name=\"UpdateClauseStatus\" srctype=\"LOCAL\" activitycluster=\"StateCluster_Active\" activitydbID=\"002B6743-E6B0-A1EE-8266-C6BE126A316D\" />"+
			"	                  </sm:transition>"+
			"	                </sm:state>"+
			"	                <sm:state id=\"F8B156BC-2CB7-A1E8-AC41-7101BB873031\" name=\"Archived\" statedbID=\"002B6743-E6B0-A1EE-8266-C6BE126A716D\">"+
			"	                  <sm:onentry>"+
			"	                    <case:releaseactivity xmlns:ns18=\"http://schemas/OpenTextContentLibrary/GCClause.Activityflow\" xmlns:ns171=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns14=\"http://schemas/OpenTextContentLibrary/GCClauseCategory\" xmlns:ns15=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns16=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns17=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns10=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns11=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns12=\"http://schemas/OpenTextContentLibrary/GCClause/operations\" xmlns:ns9=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns13=\"http://schemas/OpenTextContentLibrary/GCClause\" xmlns:ns7=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns8=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns3=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns4=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" activity=\"B4B676CD-53D8-A1E8-B381-155C2C724876\" name=\"StateTransitionForClause\" srctype=\"LOCAL\" activitycluster=\"StateCluster_Archived\" activitydbID=\"002B6743-E6B0-A1EE-8266-C6BE126AB16D\" />"+
			"	                  </sm:onentry>"+
			"	                  <sm:transition isDefault=\"false\" event=\"F8B156BC-2CB7-A1E8-AC41-7101BB873031.done\" cond=\"\" target=\"final_state\" />"+
			"	                  <sm:transition event=\"B4B676CD-53D8-A1E8-B381-155C2C724876.done B4B676CD-53D8-A1E8-B902-DFF88D59087B.planned\" sourceActivity=\"StateTransitionForClause\">"+
			"	                    <case:releaseactivity xmlns:ns18=\"http://schemas/OpenTextContentLibrary/GCClause.Activityflow\" xmlns:ns171=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns14=\"http://schemas/OpenTextContentLibrary/GCClauseCategory\" xmlns:ns15=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns16=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns17=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns10=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns11=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns12=\"http://schemas/OpenTextContentLibrary/GCClause/operations\" xmlns:ns9=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns13=\"http://schemas/OpenTextContentLibrary/GCClause\" xmlns:ns7=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns8=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns3=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns4=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" activity=\"B4B676CD-53D8-A1E8-B902-DFF88D59087B\" name=\"UpdateClauseStatus\" srctype=\"LOCAL\" activitycluster=\"StateCluster_Archived\" activitydbID=\"002B6743-E6B0-A1EE-8266-C6BE126AF16D\" />"+
			"	                  </sm:transition>"+
			"	                </sm:state>"+
			"	              </sm:state>"+
			"	              <sm:transition event=\"Case.close\" target=\"final_state\" />"+
			"	            </sm:state>"+
			"	            <sm:final id=\"final_state\" statedbID=\"002B6743-E6B0-A1EE-8266-C6BE126B316D\" />"+
			"	          </sm:scxml>"+
			"	          <case:lifecyclestaticaction id=\"F8B156BC2CB7A1E8AC413D5F3FEE7031\" />"+
			"	          <case:activitycluster id=\"F8B156BC-2CB7-A1E8-AC41-5D80BE85B031\" name=\"__MainCluster__\" locator=\"__MainCluster__\">"+
			"	            <case:activitycluster id=\"F8B156BC-2CB7-A1E8-AC41-5D80BE77B031\" name=\"StateCluster_Clause life cycle\" locator=\"StateCluster_Clause life cycle\">"+
			"	              <case:activity id=\"484D7EE4-6263-A1E8-B2E3-5198A10E4896\" name=\"General task\" type=\"HUMANTASK\">"+
			"	                <case:implementation>"+
			"	                  <HumanInteraction xmlns=\"http://schemas.cordys.com/notification/workflow/1.0\">"+
			"	                    <EntityDetails>"+
			"	                      <LayoutId>484D7EE4-6263-A1E8-B2E4-44891551C896</LayoutId>"+
			"	                    </EntityDetails>"+
			"	                    <Subject>General task</Subject>"+
			"	                    <Priority source=\"other\" dynamic=\"false\">3</Priority>"+
			"	                    <SendTo>"+
			"	                      <Target type=\"user\">"+
			"	                        <Assignee dynamic=\"true\">case:caseinstanceproperties/case:instantiationuser</Assignee>"+
			"	                      </Target>"+
			"	                    </SendTo>"+
			"	                  </HumanInteraction>"+
			"	                </case:implementation>"+
			"	                <case:associatedevents />"+
			"	                <case:escalation />"+
			"	              </case:activity>"+
			"	              <case:activitycluster id=\"F8B156BC-2CB7-A1E8-AC41-6BE5170D3031\" name=\"StateCluster_Draft\" locator=\"StateCluster_Draft\">"+
			"	                <case:activity id=\"B4B676CD-53D8-A1E8-B381-155C2C7AC876\" name=\"StateTransitionForClause\" type=\"BPMTASK\">"+
			"	                  <case:implementation>"+
			"	                    <case:processname>com/opentext/apps/gc/notifications/StateTransitionForClause</case:processname>"+
			"	                    <case:Priority source=\"asInMainCase\" />"+
			"	                  </case:implementation>"+
			"	                  <case:messages />"+
			"	                  <case:followups>"+
			"	                    <case:followup xmlns:ns18=\"http://schemas/OpenTextContentLibrary/GCClause.Activityflow\" xmlns:ns171=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns14=\"http://schemas/OpenTextContentLibrary/GCClauseCategory\" xmlns:ns15=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns16=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns17=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns10=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns11=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns12=\"http://schemas/OpenTextContentLibrary/GCClause/operations\" xmlns:ns9=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns13=\"http://schemas/OpenTextContentLibrary/GCClause\" xmlns:ns7=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns8=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns3=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns4=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" activityid=\"B4B676CD-53D8-A1E8-B902-DFF88D65087B\" activityname=\"UpdateClauseStatus\" activitytype=\"BPMTASK\" stateId=\"F8B156BC-2CB7-A1E8-AC41-6BE5170FB031\" stateName=\"Draft\" type=\"AUTOMATIC\" />"+
			"	                  </case:followups>"+
			"	                </case:activity>"+
			"	                <case:activity id=\"B4B676CD-53D8-A1E8-B902-DFF88D65087B\" name=\"UpdateClauseStatus\" type=\"BPMTASK\">"+
			"	                  <case:implementation>"+
			"	                    <case:processname>com/opentext/apps/gc/clause/Update/UpdateClauseStatus</case:processname>"+
			"	                    <case:Priority source=\"asInMainCase\" />"+
			"	                  </case:implementation>"+
			"	                  <case:messages />"+
			"	                </case:activity>"+
			"	              </case:activitycluster>"+
			"	              <case:activitycluster id=\"F8B156BC-2CB7-A1E8-AC41-6BE517033031\" name=\"StateCluster_Approved\" locator=\"StateCluster_Approved\">"+
			"	                <case:activity id=\"B4B676CD-53D8-A1E8-B381-155C2C784876\" name=\"StateTransitionForClause\" type=\"BPMTASK\">"+
			"	                  <case:implementation>"+
			"	                    <case:processname>com/opentext/apps/gc/notifications/StateTransitionForClause</case:processname>"+
			"	                    <case:Priority source=\"asInMainCase\" />"+
			"	                  </case:implementation>"+
			"	                  <case:messages />"+
			"	                  <case:followups>"+
			"	                    <case:followup xmlns:ns18=\"http://schemas/OpenTextContentLibrary/GCClause.Activityflow\" xmlns:ns171=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns14=\"http://schemas/OpenTextContentLibrary/GCClauseCategory\" xmlns:ns15=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns16=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns17=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns10=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns11=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns12=\"http://schemas/OpenTextContentLibrary/GCClause/operations\" xmlns:ns9=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns13=\"http://schemas/OpenTextContentLibrary/GCClause\" xmlns:ns7=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns8=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns3=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns4=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" activityid=\"B4B676CD-53D8-A1E8-B902-DFF88D61087B\" activityname=\"UpdateClauseStatus\" activitytype=\"BPMTASK\" stateId=\"F8B156BC-2CB7-A1E8-AC41-6BE51705B031\" stateName=\"Approved\" type=\"AUTOMATIC\" />"+
			"	                  </case:followups>"+
			"	                </case:activity>"+
			"	                <case:activity id=\"B4B676CD-53D8-A1E8-B902-DFF88D61087B\" name=\"UpdateClauseStatus\" type=\"BPMTASK\">"+
			"	                  <case:implementation>"+
			"	                    <case:processname>com/opentext/apps/gc/clause/Update/UpdateClauseStatus</case:processname>"+
			"	                    <case:Priority source=\"asInMainCase\" />"+
			"	                  </case:implementation>"+
			"	                  <case:messages />"+
			"	                </case:activity>"+
			"	              </case:activitycluster>"+
			"	              <case:activitycluster id=\"F8B156BC-2CB7-A1E8-AC41-7101BB903031\" name=\"StateCluster_Active\" locator=\"StateCluster_Active\">"+
			"	                <case:activity id=\"B4B676CD-53D8-A1E8-B381-155C2C75C876\" name=\"StateTransitionForClause\" type=\"BPMTASK\">"+
			"	                  <case:implementation>"+
			"	                    <case:processname>com/opentext/apps/gc/notifications/StateTransitionForClause</case:processname>"+
			"	                    <case:Priority source=\"asInMainCase\" />"+
			"	                  </case:implementation>"+
			"	                  <case:messages />"+
			"	                  <case:followups>"+
			"	                    <case:followup xmlns:ns18=\"http://schemas/OpenTextContentLibrary/GCClause.Activityflow\" xmlns:ns171=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns14=\"http://schemas/OpenTextContentLibrary/GCClauseCategory\" xmlns:ns15=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns16=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns17=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns10=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns11=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns12=\"http://schemas/OpenTextContentLibrary/GCClause/operations\" xmlns:ns9=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns13=\"http://schemas/OpenTextContentLibrary/GCClause\" xmlns:ns7=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns8=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns3=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns4=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" activityid=\"B4B676CD-53D8-A1E8-B902-DFF88D5D087B\" activityname=\"UpdateClauseStatus\" activitytype=\"BPMTASK\" stateId=\"F8B156BC-2CB7-A1E8-AC41-7101BB92B031\" stateName=\"Active\" type=\"AUTOMATIC\" />"+
			"	                  </case:followups>"+
			"	                </case:activity>"+
			"	                <case:activity id=\"B4B676CD-53D8-A1E8-B902-DFF88D5D087B\" name=\"UpdateClauseStatus\" type=\"BPMTASK\">"+
			"	                  <case:implementation>"+
			"	                    <case:processname>com/opentext/apps/gc/clause/Update/UpdateClauseStatus</case:processname>"+
			"	                    <case:Priority source=\"asInMainCase\" />"+
			"	                  </case:implementation>"+
			"	                  <case:messages />"+
			"	                </case:activity>"+
			"	              </case:activitycluster>"+
			"	              <case:activitycluster id=\"F8B156BC-2CB7-A1E8-AC41-7101BB84B031\" name=\"StateCluster_Archived\" locator=\"StateCluster_Archived\">"+
			"	                <case:activity id=\"B4B676CD-53D8-A1E8-B381-155C2C724876\" name=\"StateTransitionForClause\" type=\"BPMTASK\">"+
			"	                  <case:implementation>"+
			"	                    <case:processname>com/opentext/apps/gc/notifications/StateTransitionForClause</case:processname>"+
			"	                    <case:Priority source=\"asInMainCase\" />"+
			"	                  </case:implementation>"+
			"	                  <case:messages />"+
			"	                  <case:followups>"+
			"	                    <case:followup xmlns:ns18=\"http://schemas/OpenTextContentLibrary/GCClause.Activityflow\" xmlns:ns171=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns14=\"http://schemas/OpenTextContentLibrary/GCClauseCategory\" xmlns:ns15=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns16=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns17=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns10=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns11=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns12=\"http://schemas/OpenTextContentLibrary/GCClause/operations\" xmlns:ns9=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns13=\"http://schemas/OpenTextContentLibrary/GCClause\" xmlns:ns7=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns8=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns3=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns4=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" activityid=\"B4B676CD-53D8-A1E8-B902-DFF88D59087B\" activityname=\"UpdateClauseStatus\" activitytype=\"BPMTASK\" stateId=\"F8B156BC-2CB7-A1E8-AC41-7101BB873031\" stateName=\"Archived\" type=\"AUTOMATIC\" />"+
			"	                  </case:followups>"+
			"	                </case:activity>"+
			"	                <case:activity id=\"B4B676CD-53D8-A1E8-B902-DFF88D59087B\" name=\"UpdateClauseStatus\" type=\"BPMTASK\">"+
			"	                  <case:implementation>"+
			"	                    <case:processname>com/opentext/apps/gc/clause/Update/UpdateClauseStatus</case:processname>"+
			"	                    <case:Priority source=\"asInMainCase\" />"+
			"	                  </case:implementation>"+
			"	                  <case:messages />"+
			"	                </case:activity>"+
			"	              </case:activitycluster>"+
			"	            </case:activitycluster>"+
			"	          </case:activitycluster>"+
			"	          <case:state id=\"RootCaseModelState\" name=\"Default State\">"+
			"	            <case:state id=\"F8B156BC-2CB7-A1E8-AC41-5D80BE7A3031\" name=\"Clause life cycle\">"+
			"	              <case:state id=\"F8B156BC-2CB7-A1E8-AC41-6BE5170FB031\" name=\"Draft\">"+
			"	                <case:duedate type=\"duration\" dynamic=\"false\" />"+
			"	                <case:escalation />"+
			"	                <case:associatedevents>"+
			"	                  <case:event name=\"DraftToApproved\" description=\"DraftToApproved\" />"+
			"	                  <case:event name=\"DraftToArchive\" description=\"DraftToArchive\" />"+
			"	                </case:associatedevents>"+
			"	                <case:reachableStates>"+
			"	                  <case:reachableState>F8B156BC-2CB7-A1E8-AC41-6BE51705B031</case:reachableState>"+
			"	                  <case:reachableState>F8B156BC-2CB7-A1E8-AC41-7101BB92B031</case:reachableState>"+
			"	                  <case:reachableState>F8B156BC-2CB7-A1E8-AC41-5D80BE7A3031</case:reachableState>"+
			"	                  <case:reachableState>F8B156BC-2CB7-A1E8-AC41-7101BB873031</case:reachableState>"+
			"	                </case:reachableStates>"+
			"	              </case:state>"+
			"	              <case:state id=\"F8B156BC-2CB7-A1E8-AC41-6BE51705B031\" name=\"Approved\">"+
			"	                <case:duedate type=\"duration\" dynamic=\"false\" />"+
			"	                <case:escalation />"+
			"	                <case:associatedevents>"+
			"	                  <case:event name=\"ApprovedToActive\" description=\"ApprovedToActive\" />"+
			"	                  <case:event name=\"ApprovedToArchive\" description=\"ApprovedToArchive\" />"+
			"	                </case:associatedevents>"+
			"	                <case:reachableStates>"+
			"	                  <case:reachableState>F8B156BC-2CB7-A1E8-AC41-7101BB92B031</case:reachableState>"+
			"	                  <case:reachableState>F8B156BC-2CB7-A1E8-AC41-6BE5170FB031</case:reachableState>"+
			"	                  <case:reachableState>F8B156BC-2CB7-A1E8-AC41-5D80BE7A3031</case:reachableState>"+
			"	                  <case:reachableState>F8B156BC-2CB7-A1E8-AC41-7101BB873031</case:reachableState>"+
			"	                </case:reachableStates>"+
			"	              </case:state>"+
			"	              <case:state id=\"F8B156BC-2CB7-A1E8-AC41-7101BB92B031\" name=\"Active\">"+
			"	                <case:duedate type=\"duration\" dynamic=\"false\" />"+
			"	                <case:escalation />"+
			"	                <case:associatedevents>"+
			"	                  <case:event name=\"ActiveToArchive\" description=\"ActiveToArchive\" />"+
			"	                </case:associatedevents>"+
			"	                <case:reachableStates>"+
			"	                  <case:reachableState>F8B156BC-2CB7-A1E8-AC41-6BE51705B031</case:reachableState>"+
			"	                  <case:reachableState>F8B156BC-2CB7-A1E8-AC41-6BE5170FB031</case:reachableState>"+
			"	                  <case:reachableState>F8B156BC-2CB7-A1E8-AC41-5D80BE7A3031</case:reachableState>"+
			"	                  <case:reachableState>F8B156BC-2CB7-A1E8-AC41-7101BB873031</case:reachableState>"+
			"	                </case:reachableStates>"+
			"	              </case:state>"+
			"	              <case:state id=\"F8B156BC-2CB7-A1E8-AC41-7101BB873031\" name=\"Archived\">"+
			"	                <case:duedate type=\"duration\" dynamic=\"false\" />"+
			"	                <case:escalation />"+
			"	                <case:reachableStates>"+
			"	                  <case:reachableState>F8B156BC-2CB7-A1E8-AC41-6BE51705B031</case:reachableState>"+
			"	                  <case:reachableState>F8B156BC-2CB7-A1E8-AC41-7101BB92B031</case:reachableState>"+
			"	                  <case:reachableState>F8B156BC-2CB7-A1E8-AC41-6BE5170FB031</case:reachableState>"+
			"	                  <case:reachableState>F8B156BC-2CB7-A1E8-AC41-5D80BE7A3031</case:reachableState>"+
			"	                </case:reachableStates>"+
			"	              </case:state>"+
			"	              <case:duedate type=\"duration\" dynamic=\"false\" />"+
			"	              <case:escalation />"+
			"	              <case:reachableStates>"+
			"	                <case:reachableState>F8B156BC-2CB7-A1E8-AC41-6BE51705B031</case:reachableState>"+
			"	                <case:reachableState>F8B156BC-2CB7-A1E8-AC41-7101BB92B031</case:reachableState>"+
			"	                <case:reachableState>F8B156BC-2CB7-A1E8-AC41-6BE5170FB031</case:reachableState>"+
			"	                <case:reachableState>F8B156BC-2CB7-A1E8-AC41-7101BB873031</case:reachableState>"+
			"	              </case:reachableStates>"+
			"	            </case:state>"+
			"	          </case:state>"+
			"	          <ExecutionPolicy xmlns=\"\" name=\"GCClause\" ACLForSubProcesses=\"1\" />"+
			"	        </case:casemodel>"+
			"	      </runtimedefinition>"+
			"	      <designtimedefinition />"+
			"	    </model>"+
			"	  </GetCaseModelResponse>"+
			"	</data>");
	
}
