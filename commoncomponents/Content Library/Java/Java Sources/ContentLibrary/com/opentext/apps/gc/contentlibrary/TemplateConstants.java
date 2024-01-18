package com.opentext.apps.gc.contentlibrary;

public interface TemplateConstants {
	StringBuilder TEMPLATE_CASE_MODEL_XML = new StringBuilder("<data>"+
			"  <GetCaseModelResponse xmlns:SOAP=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns=\"http://schemas.cordys.com/casemanagement/modeladministration/1.0\">"+
			"    <model name=\"com/opentext/apps/gc/GCTemplate#ef#/bb/Lifecycle/Lifecycle/GCTemplate\" space=\"organization\" status=\"ACTIVE\" id=\"F8E4E399-CF40-A1ED-A9E4-926FD60C3160\" latestrevision=\"002B6743-E6B0-A1EE-8266-C83C24C0B16D\" publishedDate=\"1686627240222\">"+
			"      <description>GCTemplate</description>"+
			"      <runtimedefinition>"+
			"        <case:casemodel xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns4=\"http://schemas/OpenTextContentLibrary/Template\" xmlns:ns3=\"http://schemas/OpenTextContentLibrary/Template/operations\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns20=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/Type\" xmlns:ns8=\"http://schemas/OpenTextContentLibrary/GCTemplate/operations\" xmlns:ns7=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns13=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns9=\"http://schemas/OpenTextContentLibrary/GCTemplate\" xmlns:ns12=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns11=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns10=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns17=\"http://schemas/OpenTextDocumentGeneration/DocLayout\" xmlns:ns16=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns15=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns14=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns19=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns18=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns171=\"http://schemas/OpenTextDocumentGeneration/DocPreview\" xmlns:ns181=\"http://schemas/OpenTextContentLibrary/GCTemplate.ContainingSections\" xmlns:ns191=\"http://schemas/OpenTextContentLibrary/GCTemplate.TemplateDocPreview\" xmlns:ns201=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns21=\"http://schemas/OpenTextContentLibrary/GCTemplate.Activityflow\" xmlns:ns22=\"http://schemas/OpenTextPartyManagement/Party\" xmlns:ns23=\"http://schemas/OpenTextContentLibrary/GCTemplate.Contents\" xmlns=\"\">"+
			"          <case:caseproperties>"+
			"            <case:name>com/opentext/apps/gc/GCTemplate#ef#/bb/Lifecycle/Lifecycle/GCTemplate</case:name>"+
			"            <case:description>GCTemplate</case:description>"+
			"            <case:priority>MEDIUM</case:priority>"+
			"            <case:mode>lifecycle</case:mode>"+
			"            <case:version>2</case:version>"+
			"            <case:caseidentifiers>"+
			"              <case:identifier name=\"CurrentState\" description=\"Current Functional State\" expression=\"case:caseinstanceproperties/case:currentstate/text()\" type=\"STRING\" identifierID=\"002B6743-E6B0-A1EE-8266-C83C24C4F16D\" />"+
			"            </case:caseidentifiers>"+
			"            <case:duedate type=\"duration\" dynamic=\"false\" />"+
			"            <case:escalation />"+
			"          </case:caseproperties>"+
			"          <case:businessevents />"+
			"          <case:followups>"+
			"            <case:followup activityid=\"B4B676CD-53D8-A1E8-AFF7-545112F88874\" activityname=\"General task\" activitytype=\"HUMANTASK\" stateId=\"C4D98747-A6D9-A1E8-AC6B-9141000AC86E\" stateName=\"Template life cycle\" />"+
			"          </case:followups>"+
			"          <sm:scxml xmlns:sm=\"http://www.w3.org/2005/07/scxml\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" version=\"1.0\" initialstate=\"RootCaseModelState\">"+
			"            <sm:datamodel>"+
			"              <sm:data name=\"case:messagemap\">"+
			"                <case:caseinstanceproperties />"+
			"                <case:casevariables />"+
			"                <case:attachments />"+
			"              </sm:data>"+
			"            </sm:datamodel>"+
			"            <sm:state id=\"RootCaseModelState\" name=\"Default State\" initialstate=\"C4D98747-A6D9-A1E8-AC6B-9141000AC86E\" statedbID=\"002B6743-E6B0-A1EE-8266-C83C24C0F16D\">"+
			"              <sm:onentry />"+
			"              <sm:state id=\"C4D98747-A6D9-A1E8-AC6B-9141000AC86E\" name=\"Template life cycle\" statedbID=\"002B6743-E6B0-A1EE-8266-C83C24C1316D\">"+
			"                <sm:onentry />"+
			"                <sm:transition sourceActivity=\"Template life cycle\" event=\"B4B676CD-53D8-A1E8-AFF7-545112F88874.planned\">"+
			"                  <case:releaseactivity activity=\"B4B676CD-53D8-A1E8-AFF7-545112F88874\" name=\"General task\" srctype=\"LOCAL\" activitycluster=\"StateCluster_Template life cycle\" activitydbID=\"002B6743-E6B0-A1EE-8266-C83C24C1716D\" />"+
			"                </sm:transition>"+
			"                <sm:state id=\"C4D98747-A6D9-A1E8-AC6B-9140FFFDC86E\" name=\"Draft\" statedbID=\"002B6743-E6B0-A1EE-8266-C83C24C1B16D\">"+
			"                  <sm:onentry>"+
			"                    <case:releaseactivity xmlns:ns23=\"http://schemas/OpenTextContentLibrary/GCTemplate.Contents\" xmlns:ns22=\"http://schemas/OpenTextPartyManagement/Party\" xmlns:ns21=\"http://schemas/OpenTextContentLibrary/GCTemplate.Activityflow\" xmlns:ns201=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns191=\"http://schemas/OpenTextContentLibrary/GCTemplate.TemplateDocPreview\" xmlns:ns181=\"http://schemas/OpenTextContentLibrary/GCTemplate.ContainingSections\" xmlns:ns171=\"http://schemas/OpenTextDocumentGeneration/DocPreview\" xmlns:ns18=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns19=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns14=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns15=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns16=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns17=\"http://schemas/OpenTextDocumentGeneration/DocLayout\" xmlns:ns10=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns11=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns12=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns9=\"http://schemas/OpenTextContentLibrary/GCTemplate\" xmlns:ns13=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns7=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns8=\"http://schemas/OpenTextContentLibrary/GCTemplate/operations\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/Type\" xmlns:ns20=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns3=\"http://schemas/OpenTextContentLibrary/Template/operations\" xmlns:ns4=\"http://schemas/OpenTextContentLibrary/Template\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" activity=\"B4B676CD-53D8-A1E8-AF24-3799359DC874\" name=\"StateTransitionsForTemplate\" srctype=\"LOCAL\" activitycluster=\"StateCluster_Draft\" activitydbID=\"002B6743-E6B0-A1EE-8266-C83C24C1F16D\" />"+
			"                  </sm:onentry>"+
			"                  <sm:transition isDefault=\"true\" event=\"DraftToApproved\" target=\"C4D98747-A6D9-A1E8-AC6B-D6941645886E\" usereventid=\"B4B676CD53D8A1E8AEC0B8A819D94874\" />"+
			"                  <sm:transition isDefault=\"false\" event=\"DraftToArchive\" target=\"C4D98747-A6D9-A1E8-AC6B-E4A9DA3A486E\" usereventid=\"B4B676CD53D8A1E8B479CA7AB9E78877\" />"+
			"                  <sm:transition event=\"B4B676CD-53D8-A1E8-AF24-3799359DC874.done B4B676CD-53D8-A1E8-B902-4111D02D887B.planned\" sourceActivity=\"StateTransitionsForTemplate\">"+
			"                    <case:releaseactivity xmlns:ns23=\"http://schemas/OpenTextContentLibrary/GCTemplate.Contents\" xmlns:ns22=\"http://schemas/OpenTextPartyManagement/Party\" xmlns:ns21=\"http://schemas/OpenTextContentLibrary/GCTemplate.Activityflow\" xmlns:ns201=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns191=\"http://schemas/OpenTextContentLibrary/GCTemplate.TemplateDocPreview\" xmlns:ns181=\"http://schemas/OpenTextContentLibrary/GCTemplate.ContainingSections\" xmlns:ns171=\"http://schemas/OpenTextDocumentGeneration/DocPreview\" xmlns:ns18=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns19=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns14=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns15=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns16=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns17=\"http://schemas/OpenTextDocumentGeneration/DocLayout\" xmlns:ns10=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns11=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns12=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns9=\"http://schemas/OpenTextContentLibrary/GCTemplate\" xmlns:ns13=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns7=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns8=\"http://schemas/OpenTextContentLibrary/GCTemplate/operations\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/Type\" xmlns:ns20=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns3=\"http://schemas/OpenTextContentLibrary/Template/operations\" xmlns:ns4=\"http://schemas/OpenTextContentLibrary/Template\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" activity=\"B4B676CD-53D8-A1E8-B902-4111D02D887B\" name=\"UpdateTemplateStatus\" srctype=\"LOCAL\" activitycluster=\"StateCluster_Draft\" activitydbID=\"002B6743-E6B0-A1EE-8266-C83C24C2316D\" />"+
			"                  </sm:transition>"+
			"                </sm:state>"+
			"                <sm:state id=\"C4D98747-A6D9-A1E8-AC6B-D6941645886E\" name=\"Approved\" statedbID=\"002B6743-E6B0-A1EE-8266-C83C24C2716D\">"+
			"                  <sm:onentry>"+
			"                    <case:releaseactivity xmlns:ns23=\"http://schemas/OpenTextContentLibrary/GCTemplate.Contents\" xmlns:ns22=\"http://schemas/OpenTextPartyManagement/Party\" xmlns:ns21=\"http://schemas/OpenTextContentLibrary/GCTemplate.Activityflow\" xmlns:ns201=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns191=\"http://schemas/OpenTextContentLibrary/GCTemplate.TemplateDocPreview\" xmlns:ns181=\"http://schemas/OpenTextContentLibrary/GCTemplate.ContainingSections\" xmlns:ns171=\"http://schemas/OpenTextDocumentGeneration/DocPreview\" xmlns:ns18=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns19=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns14=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns15=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns16=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns17=\"http://schemas/OpenTextDocumentGeneration/DocLayout\" xmlns:ns10=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns11=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns12=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns9=\"http://schemas/OpenTextContentLibrary/GCTemplate\" xmlns:ns13=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns7=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns8=\"http://schemas/OpenTextContentLibrary/GCTemplate/operations\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/Type\" xmlns:ns20=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns3=\"http://schemas/OpenTextContentLibrary/Template/operations\" xmlns:ns4=\"http://schemas/OpenTextContentLibrary/Template\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" activity=\"B4B676CD-53D8-A1E8-AF24-379935978874\" name=\"StateTransitionsForTemplate\" srctype=\"LOCAL\" activitycluster=\"StateCluster_Approved\" activitydbID=\"002B6743-E6B0-A1EE-8266-C83C24C2B16D\" />"+
			"                  </sm:onentry>"+
			"                  <sm:transition isDefault=\"true\" event=\"ApprovedToActive\" target=\"C4D98747-A6D9-A1E8-AC6B-E4A9DA4C486E\" usereventid=\"B4B676CD53D8A1E8AEC0B8A819D34874\" />"+
			"                  <sm:transition isDefault=\"false\" event=\"ApprovedToArchive\" target=\"C4D98747-A6D9-A1E8-AC6B-E4A9DA3A486E\" usereventid=\"B4B676CD53D8A1E8B479CA7AB9EE4877\" />"+
			"                  <sm:transition event=\"B4B676CD-53D8-A1E8-AF24-379935978874.done B4B676CD-53D8-A1E8-B902-4111D029887B.planned\" sourceActivity=\"StateTransitionsForTemplate\">"+
			"                    <case:releaseactivity xmlns:ns23=\"http://schemas/OpenTextContentLibrary/GCTemplate.Contents\" xmlns:ns22=\"http://schemas/OpenTextPartyManagement/Party\" xmlns:ns21=\"http://schemas/OpenTextContentLibrary/GCTemplate.Activityflow\" xmlns:ns201=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns191=\"http://schemas/OpenTextContentLibrary/GCTemplate.TemplateDocPreview\" xmlns:ns181=\"http://schemas/OpenTextContentLibrary/GCTemplate.ContainingSections\" xmlns:ns171=\"http://schemas/OpenTextDocumentGeneration/DocPreview\" xmlns:ns18=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns19=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns14=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns15=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns16=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns17=\"http://schemas/OpenTextDocumentGeneration/DocLayout\" xmlns:ns10=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns11=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns12=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns9=\"http://schemas/OpenTextContentLibrary/GCTemplate\" xmlns:ns13=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns7=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns8=\"http://schemas/OpenTextContentLibrary/GCTemplate/operations\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/Type\" xmlns:ns20=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns3=\"http://schemas/OpenTextContentLibrary/Template/operations\" xmlns:ns4=\"http://schemas/OpenTextContentLibrary/Template\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" activity=\"B4B676CD-53D8-A1E8-B902-4111D029887B\" name=\"UpdateTemplateStatus\" srctype=\"LOCAL\" activitycluster=\"StateCluster_Approved\" activitydbID=\"002B6743-E6B0-A1EE-8266-C83C24C2F16D\" />"+
			"                  </sm:transition>"+
			"                </sm:state>"+
			"                <sm:state id=\"C4D98747-A6D9-A1E8-AC6B-E4A9DA4C486E\" name=\"Active\" statedbID=\"002B6743-E6B0-A1EE-8266-C83C24C3316D\">"+
			"                  <sm:onentry>"+
			"                    <case:releaseactivity xmlns:ns23=\"http://schemas/OpenTextContentLibrary/GCTemplate.Contents\" xmlns:ns22=\"http://schemas/OpenTextPartyManagement/Party\" xmlns:ns21=\"http://schemas/OpenTextContentLibrary/GCTemplate.Activityflow\" xmlns:ns201=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns191=\"http://schemas/OpenTextContentLibrary/GCTemplate.TemplateDocPreview\" xmlns:ns181=\"http://schemas/OpenTextContentLibrary/GCTemplate.ContainingSections\" xmlns:ns171=\"http://schemas/OpenTextDocumentGeneration/DocPreview\" xmlns:ns18=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns19=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns14=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns15=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns16=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns17=\"http://schemas/OpenTextDocumentGeneration/DocLayout\" xmlns:ns10=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns11=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns12=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns9=\"http://schemas/OpenTextContentLibrary/GCTemplate\" xmlns:ns13=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns7=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns8=\"http://schemas/OpenTextContentLibrary/GCTemplate/operations\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/Type\" xmlns:ns20=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns3=\"http://schemas/OpenTextContentLibrary/Template/operations\" xmlns:ns4=\"http://schemas/OpenTextContentLibrary/Template\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" activity=\"B4B676CD-53D8-A1E8-AF24-37993591C874\" name=\"StateTransitionsForTemplate\" srctype=\"LOCAL\" activitycluster=\"StateCluster_Active\" activitydbID=\"002B6743-E6B0-A1EE-8266-C83C24C3716D\" />"+
			"                  </sm:onentry>"+
			"                  <sm:transition isDefault=\"false\" event=\"ActiveToArchive\" target=\"C4D98747-A6D9-A1E8-AC6B-E4A9DA3A486E\" usereventid=\"B4B676CD53D8A1E8AEC0B8A819CD4874\" />"+
			"                  <sm:transition event=\"B4B676CD-53D8-A1E8-AF24-37993591C874.done B4B676CD-53D8-A1E8-B902-4111D025887B.planned\" sourceActivity=\"StateTransitionsForTemplate\">"+
			"                    <case:releaseactivity xmlns:ns23=\"http://schemas/OpenTextContentLibrary/GCTemplate.Contents\" xmlns:ns22=\"http://schemas/OpenTextPartyManagement/Party\" xmlns:ns21=\"http://schemas/OpenTextContentLibrary/GCTemplate.Activityflow\" xmlns:ns201=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns191=\"http://schemas/OpenTextContentLibrary/GCTemplate.TemplateDocPreview\" xmlns:ns181=\"http://schemas/OpenTextContentLibrary/GCTemplate.ContainingSections\" xmlns:ns171=\"http://schemas/OpenTextDocumentGeneration/DocPreview\" xmlns:ns18=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns19=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns14=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns15=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns16=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns17=\"http://schemas/OpenTextDocumentGeneration/DocLayout\" xmlns:ns10=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns11=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns12=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns9=\"http://schemas/OpenTextContentLibrary/GCTemplate\" xmlns:ns13=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns7=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns8=\"http://schemas/OpenTextContentLibrary/GCTemplate/operations\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/Type\" xmlns:ns20=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns3=\"http://schemas/OpenTextContentLibrary/Template/operations\" xmlns:ns4=\"http://schemas/OpenTextContentLibrary/Template\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" activity=\"B4B676CD-53D8-A1E8-B902-4111D025887B\" name=\"UpdateTemplateStatus\" srctype=\"LOCAL\" activitycluster=\"StateCluster_Active\" activitydbID=\"002B6743-E6B0-A1EE-8266-C83C24C3B16D\" />"+
			"                  </sm:transition>"+
			"                </sm:state>"+
			"                <sm:state id=\"C4D98747-A6D9-A1E8-AC6B-E4A9DA3A486E\" name=\"Archived\" statedbID=\"002B6743-E6B0-A1EE-8266-C83C24C3F16D\">"+
			"                  <sm:onentry>"+
			"                    <case:releaseactivity xmlns:ns23=\"http://schemas/OpenTextContentLibrary/GCTemplate.Contents\" xmlns:ns22=\"http://schemas/OpenTextPartyManagement/Party\" xmlns:ns21=\"http://schemas/OpenTextContentLibrary/GCTemplate.Activityflow\" xmlns:ns201=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns191=\"http://schemas/OpenTextContentLibrary/GCTemplate.TemplateDocPreview\" xmlns:ns181=\"http://schemas/OpenTextContentLibrary/GCTemplate.ContainingSections\" xmlns:ns171=\"http://schemas/OpenTextDocumentGeneration/DocPreview\" xmlns:ns18=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns19=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns14=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns15=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns16=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns17=\"http://schemas/OpenTextDocumentGeneration/DocLayout\" xmlns:ns10=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns11=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns12=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns9=\"http://schemas/OpenTextContentLibrary/GCTemplate\" xmlns:ns13=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns7=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns8=\"http://schemas/OpenTextContentLibrary/GCTemplate/operations\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/Type\" xmlns:ns20=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns3=\"http://schemas/OpenTextContentLibrary/Template/operations\" xmlns:ns4=\"http://schemas/OpenTextContentLibrary/Template\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" activity=\"B4B676CD-53D8-A1E8-AF24-37993588C874\" name=\"StateTransitionsForTemplate\" srctype=\"LOCAL\" activitycluster=\"StateCluster_Archived\" activitydbID=\"002B6743-E6B0-A1EE-8266-C83C24C4316D\" />"+
			"                  </sm:onentry>"+
			"                  <sm:transition isDefault=\"false\" event=\"C4D98747-A6D9-A1E8-AC6B-E4A9DA3A486E.done\" cond=\"\" target=\"final_state\" />"+
			"                  <sm:transition event=\"B4B676CD-53D8-A1E8-AF24-37993588C874.done B4B676CD-53D8-A1E8-B902-4E7DF803087B.planned\" sourceActivity=\"StateTransitionsForTemplate\">"+
			"                    <case:releaseactivity xmlns:ns23=\"http://schemas/OpenTextContentLibrary/GCTemplate.Contents\" xmlns:ns22=\"http://schemas/OpenTextPartyManagement/Party\" xmlns:ns21=\"http://schemas/OpenTextContentLibrary/GCTemplate.Activityflow\" xmlns:ns201=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns191=\"http://schemas/OpenTextContentLibrary/GCTemplate.TemplateDocPreview\" xmlns:ns181=\"http://schemas/OpenTextContentLibrary/GCTemplate.ContainingSections\" xmlns:ns171=\"http://schemas/OpenTextDocumentGeneration/DocPreview\" xmlns:ns18=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns19=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns14=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns15=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns16=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns17=\"http://schemas/OpenTextDocumentGeneration/DocLayout\" xmlns:ns10=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns11=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns12=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns9=\"http://schemas/OpenTextContentLibrary/GCTemplate\" xmlns:ns13=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns7=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns8=\"http://schemas/OpenTextContentLibrary/GCTemplate/operations\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/Type\" xmlns:ns20=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns3=\"http://schemas/OpenTextContentLibrary/Template/operations\" xmlns:ns4=\"http://schemas/OpenTextContentLibrary/Template\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" activity=\"B4B676CD-53D8-A1E8-B902-4E7DF803087B\" name=\"UpdateTemplateStatus\" srctype=\"LOCAL\" activitycluster=\"StateCluster_Archived\" activitydbID=\"002B6743-E6B0-A1EE-8266-C83C24C4716D\" />"+
			"                  </sm:transition>"+
			"                </sm:state>"+
			"              </sm:state>"+
			"              <sm:transition event=\"Case.close\" target=\"final_state\" />"+
			"            </sm:state>"+
			"            <sm:final id=\"final_state\" statedbID=\"002B6743-E6B0-A1EE-8266-C83C24C4B16D\" />"+
			"          </sm:scxml>"+
			"          <case:lifecyclestaticaction id=\"C4D98747A6D9A1E8AC6B83420E6DC86E\" />"+
			"          <case:activitycluster id=\"C4D98747-A6D9-A1E8-AC6B-83420EC8486E\" name=\"__MainCluster__\" locator=\"__MainCluster__\">"+
			"            <case:activitycluster id=\"C4D98747-A6D9-A1E8-AC6B-91410008486E\" name=\"StateCluster_Template life cycle\" locator=\"StateCluster_Template life cycle\">"+
			"              <case:activity id=\"B4B676CD-53D8-A1E8-AFF7-545112F88874\" name=\"General task\" type=\"HUMANTASK\">"+
			"                <case:implementation>"+
			"                  <HumanInteraction xmlns=\"http://schemas.cordys.com/notification/workflow/1.0\">"+
			"                    <EntityDetails>"+
			"                      <LayoutId>B4B676CD-53D8-A1E8-B902-4E7DF7F6C87B</LayoutId>"+
			"                    </EntityDetails>"+
			"                    <Subject>General task</Subject>"+
			"                    <Priority source=\"other\" dynamic=\"false\">3</Priority>"+
			"                    <SendTo>"+
			"                      <Target type=\"user\">"+
			"                        <Assignee dynamic=\"true\">case:caseinstanceproperties/case:instantiationuser</Assignee>"+
			"                      </Target>"+
			"                    </SendTo>"+
			"                  </HumanInteraction>"+
			"                </case:implementation>"+
			"                <case:associatedevents />"+
			"                <case:escalation />"+
			"              </case:activity>"+
			"              <case:activitycluster id=\"C4D98747-A6D9-A1E8-AC6B-AC06C43F486E\" name=\"StateCluster_Draft\" locator=\"StateCluster_Draft\">"+
			"                <case:activity id=\"B4B676CD-53D8-A1E8-AF24-3799359DC874\" name=\"StateTransitionsForTemplate\" type=\"BPMTASK\">"+
			"                  <case:implementation>"+
			"                    <case:processname>com/opentext/apps/gc/notifications/StateTransitionsForTemplate</case:processname>"+
			"                    <case:Priority source=\"asInMainCase\" />"+
			"                  </case:implementation>"+
			"                  <case:messages />"+
			"                  <case:followups>"+
			"                    <case:followup xmlns:ns23=\"http://schemas/OpenTextContentLibrary/GCTemplate.Contents\" xmlns:ns22=\"http://schemas/OpenTextPartyManagement/Party\" xmlns:ns21=\"http://schemas/OpenTextContentLibrary/GCTemplate.Activityflow\" xmlns:ns201=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns191=\"http://schemas/OpenTextContentLibrary/GCTemplate.TemplateDocPreview\" xmlns:ns181=\"http://schemas/OpenTextContentLibrary/GCTemplate.ContainingSections\" xmlns:ns171=\"http://schemas/OpenTextDocumentGeneration/DocPreview\" xmlns:ns18=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns19=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns14=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns15=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns16=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns17=\"http://schemas/OpenTextDocumentGeneration/DocLayout\" xmlns:ns10=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns11=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns12=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns9=\"http://schemas/OpenTextContentLibrary/GCTemplate\" xmlns:ns13=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns7=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns8=\"http://schemas/OpenTextContentLibrary/GCTemplate/operations\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/Type\" xmlns:ns20=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns3=\"http://schemas/OpenTextContentLibrary/Template/operations\" xmlns:ns4=\"http://schemas/OpenTextContentLibrary/Template\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" activityid=\"B4B676CD-53D8-A1E8-B902-4111D02D887B\" activityname=\"UpdateTemplateStatus\" activitytype=\"BPMTASK\" stateId=\"C4D98747-A6D9-A1E8-AC6B-9140FFFDC86E\" stateName=\"Draft\" type=\"AUTOMATIC\" />"+
			"                  </case:followups>"+
			"                </case:activity>"+
			"                <case:activity id=\"B4B676CD-53D8-A1E8-B902-4111D02D887B\" name=\"UpdateTemplateStatus\" type=\"BPMTASK\">"+
			"                  <case:implementation>"+
			"                    <case:processname>com/opentext/apps/gc/template/Update/UpdateTemplateStatus</case:processname>"+
			"                    <case:Priority source=\"asInMainCase\" />"+
			"                  </case:implementation>"+
			"                  <case:messages />"+
			"                </case:activity>"+
			"              </case:activitycluster>"+
			"              <case:activitycluster id=\"C4D98747-A6D9-A1E8-AC6B-D6941643086E\" name=\"StateCluster_Approved\" locator=\"StateCluster_Approved\">"+
			"                <case:activity id=\"B4B676CD-53D8-A1E8-AF24-379935978874\" name=\"StateTransitionsForTemplate\" type=\"BPMTASK\">"+
			"                  <case:implementation>"+
			"                    <case:processname>com/opentext/apps/gc/notifications/StateTransitionsForTemplate</case:processname>"+
			"                    <case:Priority source=\"asInMainCase\" />"+
			"                  </case:implementation>"+
			"                  <case:messages />"+
			"                  <case:followups>"+
			"                    <case:followup xmlns:ns23=\"http://schemas/OpenTextContentLibrary/GCTemplate.Contents\" xmlns:ns22=\"http://schemas/OpenTextPartyManagement/Party\" xmlns:ns21=\"http://schemas/OpenTextContentLibrary/GCTemplate.Activityflow\" xmlns:ns201=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns191=\"http://schemas/OpenTextContentLibrary/GCTemplate.TemplateDocPreview\" xmlns:ns181=\"http://schemas/OpenTextContentLibrary/GCTemplate.ContainingSections\" xmlns:ns171=\"http://schemas/OpenTextDocumentGeneration/DocPreview\" xmlns:ns18=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns19=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns14=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns15=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns16=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns17=\"http://schemas/OpenTextDocumentGeneration/DocLayout\" xmlns:ns10=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns11=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns12=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns9=\"http://schemas/OpenTextContentLibrary/GCTemplate\" xmlns:ns13=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns7=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns8=\"http://schemas/OpenTextContentLibrary/GCTemplate/operations\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/Type\" xmlns:ns20=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns3=\"http://schemas/OpenTextContentLibrary/Template/operations\" xmlns:ns4=\"http://schemas/OpenTextContentLibrary/Template\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" activityid=\"B4B676CD-53D8-A1E8-B902-4111D029887B\" activityname=\"UpdateTemplateStatus\" activitytype=\"BPMTASK\" stateId=\"C4D98747-A6D9-A1E8-AC6B-D6941645886E\" stateName=\"Approved\" type=\"AUTOMATIC\" />"+
			"                  </case:followups>"+
			"                </case:activity>"+
			"                <case:activity id=\"B4B676CD-53D8-A1E8-B902-4111D029887B\" name=\"UpdateTemplateStatus\" type=\"BPMTASK\">"+
			"                  <case:implementation>"+
			"                    <case:processname>com/opentext/apps/gc/template/Update/UpdateTemplateStatus</case:processname>"+
			"                    <case:Priority source=\"asInMainCase\" />"+
			"                  </case:implementation>"+
			"                  <case:messages />"+
			"                </case:activity>"+
			"              </case:activitycluster>"+
			"              <case:activitycluster id=\"C4D98747-A6D9-A1E8-AC6B-E4A9DA49C86E\" name=\"StateCluster_Active\" locator=\"StateCluster_Active\">"+
			"                <case:activity id=\"B4B676CD-53D8-A1E8-AF24-37993591C874\" name=\"StateTransitionsForTemplate\" type=\"BPMTASK\">"+
			"                  <case:implementation>"+
			"                    <case:processname>com/opentext/apps/gc/notifications/StateTransitionsForTemplate</case:processname>"+
			"                    <case:Priority source=\"asInMainCase\" />"+
			"                  </case:implementation>"+
			"                  <case:messages />"+
			"                  <case:followups>"+
			"                    <case:followup xmlns:ns23=\"http://schemas/OpenTextContentLibrary/GCTemplate.Contents\" xmlns:ns22=\"http://schemas/OpenTextPartyManagement/Party\" xmlns:ns21=\"http://schemas/OpenTextContentLibrary/GCTemplate.Activityflow\" xmlns:ns201=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns191=\"http://schemas/OpenTextContentLibrary/GCTemplate.TemplateDocPreview\" xmlns:ns181=\"http://schemas/OpenTextContentLibrary/GCTemplate.ContainingSections\" xmlns:ns171=\"http://schemas/OpenTextDocumentGeneration/DocPreview\" xmlns:ns18=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns19=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns14=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns15=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns16=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns17=\"http://schemas/OpenTextDocumentGeneration/DocLayout\" xmlns:ns10=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns11=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns12=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns9=\"http://schemas/OpenTextContentLibrary/GCTemplate\" xmlns:ns13=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns7=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns8=\"http://schemas/OpenTextContentLibrary/GCTemplate/operations\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/Type\" xmlns:ns20=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns3=\"http://schemas/OpenTextContentLibrary/Template/operations\" xmlns:ns4=\"http://schemas/OpenTextContentLibrary/Template\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" activityid=\"B4B676CD-53D8-A1E8-B902-4111D025887B\" activityname=\"UpdateTemplateStatus\" activitytype=\"BPMTASK\" stateId=\"C4D98747-A6D9-A1E8-AC6B-E4A9DA4C486E\" stateName=\"Active\" type=\"AUTOMATIC\" />"+
			"                  </case:followups>"+
			"                </case:activity>"+
			"                <case:activity id=\"B4B676CD-53D8-A1E8-B902-4111D025887B\" name=\"UpdateTemplateStatus\" type=\"BPMTASK\">"+
			"                  <case:implementation>"+
			"                    <case:processname>com/opentext/apps/gc/template/Update/UpdateTemplateStatus</case:processname>"+
			"                    <case:Priority source=\"asInMainCase\" />"+
			"                  </case:implementation>"+
			"                  <case:messages />"+
			"                </case:activity>"+
			"              </case:activitycluster>"+
			"              <case:activitycluster id=\"C4D98747-A6D9-A1E8-AC6B-E4A9DA37C86E\" name=\"StateCluster_Archived\" locator=\"StateCluster_Archived\">"+
			"                <case:activity id=\"B4B676CD-53D8-A1E8-AF24-37993588C874\" name=\"StateTransitionsForTemplate\" type=\"BPMTASK\">"+
			"                  <case:implementation>"+
			"                    <case:processname>com/opentext/apps/gc/notifications/StateTransitionsForTemplate</case:processname>"+
			"                    <case:Priority source=\"asInMainCase\" />"+
			"                  </case:implementation>"+
			"                  <case:messages />"+
			"                  <case:followups>"+
			"                    <case:followup xmlns:ns23=\"http://schemas/OpenTextContentLibrary/GCTemplate.Contents\" xmlns:ns22=\"http://schemas/OpenTextPartyManagement/Party\" xmlns:ns21=\"http://schemas/OpenTextContentLibrary/GCTemplate.Activityflow\" xmlns:ns201=\"http://schemas.opentext.com/entitymodeling/buildingblocks/activityflow/1.0\" xmlns:ns191=\"http://schemas/OpenTextContentLibrary/GCTemplate.TemplateDocPreview\" xmlns:ns181=\"http://schemas/OpenTextContentLibrary/GCTemplate.ContainingSections\" xmlns:ns171=\"http://schemas/OpenTextDocumentGeneration/DocPreview\" xmlns:ns18=\"http://schemas.cordys.com/bpm/execution/1.0\" xmlns:ns19=\"http://schemas.cordys.com/cws/1.0\" xmlns:ns14=\"http://schemas.opentext.com/entitymodeling/buildingblocks/tracking/1.0\" xmlns:ns15=\"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0\" xmlns:ns16=\"http://schemas/OpenTextEntityIdentityComponents/Identity\" xmlns:ns17=\"http://schemas/OpenTextDocumentGeneration/DocLayout\" xmlns:ns10=\"http://schemas/OpenTextBasicComponents/GCType\" xmlns:ns11=\"http://schemas/OpenTextBasicComponents/GCProperties/operations\" xmlns:ns12=\"http://schemas.opentext.com/bps/entity/core\" xmlns:ns9=\"http://schemas/OpenTextContentLibrary/GCTemplate\" xmlns:ns13=\"http://schemas/OpenTextBasicComponents/GCProperties\" xmlns:ns7=\"http://schemas/OpenTextContentLibrary/18.4\" xmlns:ns8=\"http://schemas/OpenTextContentLibrary/GCTemplate/operations\" xmlns:ns5=\"http://schemas/OpenTextBasicComponents/Type\" xmlns:ns20=\"http://schemas.cordys.com/General/1.0/\" xmlns:ns6=\"http://schemas.opentext.com/entitymodeling/buildingblocks/lifecycle/1.0\" xmlns:ns3=\"http://schemas/OpenTextContentLibrary/Template/operations\" xmlns:ns4=\"http://schemas/OpenTextContentLibrary/Template\" xmlns:ns1=\"http://schemas.cordys.com/default\" xmlns:ns2=\"http://schemas.cordys.com/bpm/instance/1.0\" xmlns:sm=\"http://www.w3.org/2005/07/scxml\" xmlns:case=\"http://schemas.cordys.com/casemanagement/1.0\" activityid=\"B4B676CD-53D8-A1E8-B902-4E7DF803087B\" activityname=\"UpdateTemplateStatus\" activitytype=\"BPMTASK\" stateId=\"C4D98747-A6D9-A1E8-AC6B-E4A9DA3A486E\" stateName=\"Archived\" type=\"AUTOMATIC\" />"+
			"                  </case:followups>"+
			"                </case:activity>"+
			"                <case:activity id=\"B4B676CD-53D8-A1E8-B902-4E7DF803087B\" name=\"UpdateTemplateStatus\" type=\"BPMTASK\">"+
			"                  <case:implementation>"+
			"                    <case:processname>com/opentext/apps/gc/template/Update/UpdateTemplateStatus</case:processname>"+
			"                    <case:Priority source=\"asInMainCase\" />"+
			"                  </case:implementation>"+
			"                  <case:messages />"+
			"                </case:activity>"+
			"              </case:activitycluster>"+
			"            </case:activitycluster>"+
			"          </case:activitycluster>"+
			"          <case:state id=\"RootCaseModelState\" name=\"Default State\">"+
			"            <case:state id=\"C4D98747-A6D9-A1E8-AC6B-9141000AC86E\" name=\"Template life cycle\">"+
			"              <case:state id=\"C4D98747-A6D9-A1E8-AC6B-9140FFFDC86E\" name=\"Draft\">"+
			"                <case:duedate type=\"duration\" dynamic=\"false\" />"+
			"                <case:escalation />"+
			"                <case:associatedevents>"+
			"                  <case:event name=\"DraftToApproved\" description=\"DraftToApproved\" />"+
			"                  <case:event name=\"DraftToArchive\" description=\"DraftToArchive\" />"+
			"                </case:associatedevents>"+
			"                <case:reachableStates>"+
			"                  <case:reachableState>C4D98747-A6D9-A1E8-AC6B-D6941645886E</case:reachableState>"+
			"                  <case:reachableState>C4D98747-A6D9-A1E8-AC6B-E4A9DA4C486E</case:reachableState>"+
			"                  <case:reachableState>C4D98747-A6D9-A1E8-AC6B-E4A9DA3A486E</case:reachableState>"+
			"                  <case:reachableState>C4D98747-A6D9-A1E8-AC6B-9141000AC86E</case:reachableState>"+
			"                </case:reachableStates>"+
			"              </case:state>"+
			"              <case:state id=\"C4D98747-A6D9-A1E8-AC6B-D6941645886E\" name=\"Approved\">"+
			"                <case:duedate type=\"duration\" dynamic=\"false\" />"+
			"                <case:escalation />"+
			"                <case:associatedevents>"+
			"                  <case:event name=\"ApprovedToActive\" description=\"ApprovedToActive\" />"+
			"                  <case:event name=\"ApprovedToArchive\" description=\"ApprovedToArchive\" />"+
			"                </case:associatedevents>"+
			"                <case:reachableStates>"+
			"                  <case:reachableState>C4D98747-A6D9-A1E8-AC6B-E4A9DA4C486E</case:reachableState>"+
			"                  <case:reachableState>C4D98747-A6D9-A1E8-AC6B-E4A9DA3A486E</case:reachableState>"+
			"                  <case:reachableState>C4D98747-A6D9-A1E8-AC6B-9141000AC86E</case:reachableState>"+
			"                  <case:reachableState>C4D98747-A6D9-A1E8-AC6B-9140FFFDC86E</case:reachableState>"+
			"                </case:reachableStates>"+
			"              </case:state>"+
			"              <case:state id=\"C4D98747-A6D9-A1E8-AC6B-E4A9DA4C486E\" name=\"Active\">"+
			"                <case:duedate type=\"duration\" dynamic=\"false\" />"+
			"                <case:escalation />"+
			"                <case:associatedevents>"+
			"                  <case:event name=\"ActiveToArchive\" description=\"ActiveToArchive\" />"+
			"                </case:associatedevents>"+
			"                <case:reachableStates>"+
			"                  <case:reachableState>C4D98747-A6D9-A1E8-AC6B-D6941645886E</case:reachableState>"+
			"                  <case:reachableState>C4D98747-A6D9-A1E8-AC6B-E4A9DA3A486E</case:reachableState>"+
			"                  <case:reachableState>C4D98747-A6D9-A1E8-AC6B-9141000AC86E</case:reachableState>"+
			"                  <case:reachableState>C4D98747-A6D9-A1E8-AC6B-9140FFFDC86E</case:reachableState>"+
			"                </case:reachableStates>"+
			"              </case:state>"+
			"              <case:state id=\"C4D98747-A6D9-A1E8-AC6B-E4A9DA3A486E\" name=\"Archived\">"+
			"                <case:duedate type=\"duration\" dynamic=\"false\" />"+
			"                <case:escalation />"+
			"                <case:reachableStates>"+
			"                  <case:reachableState>C4D98747-A6D9-A1E8-AC6B-D6941645886E</case:reachableState>"+
			"                  <case:reachableState>C4D98747-A6D9-A1E8-AC6B-E4A9DA4C486E</case:reachableState>"+
			"                  <case:reachableState>C4D98747-A6D9-A1E8-AC6B-9141000AC86E</case:reachableState>"+
			"                  <case:reachableState>C4D98747-A6D9-A1E8-AC6B-9140FFFDC86E</case:reachableState>"+
			"                </case:reachableStates>"+
			"              </case:state>"+
			"              <case:duedate type=\"duration\" dynamic=\"false\" />"+
			"              <case:escalation />"+
			"              <case:reachableStates>"+
			"                <case:reachableState>C4D98747-A6D9-A1E8-AC6B-D6941645886E</case:reachableState>"+
			"                <case:reachableState>C4D98747-A6D9-A1E8-AC6B-E4A9DA4C486E</case:reachableState>"+
			"                <case:reachableState>C4D98747-A6D9-A1E8-AC6B-E4A9DA3A486E</case:reachableState>"+
			"                <case:reachableState>C4D98747-A6D9-A1E8-AC6B-9140FFFDC86E</case:reachableState>"+
			"              </case:reachableStates>"+
			"            </case:state>"+
			"          </case:state>"+
			"          <ExecutionPolicy xmlns=\"\" name=\"GCTemplate\" ACLForSubProcesses=\"1\" />"+
			"        </case:casemodel>"+
			"      </runtimedefinition>"+
			"      <designtimedefinition />"+
			"    </model>"+
			"  </GetCaseModelResponse>"+
			"</data>");
}
