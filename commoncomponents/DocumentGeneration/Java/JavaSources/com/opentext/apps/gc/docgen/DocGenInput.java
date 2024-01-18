package com.opentext.apps.gc.docgen;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map.Entry;

import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTAbstractNum;

public class DocGenInput {

	private String Start_Pattern = "";
	private String End_Pattern = "";
	private String Storage_Ticket="";
	private String Sample_Input_ItemId="";
	private Boolean isParaCreated = false;
	private int CreatedRuns_Count = 0;
	public LinkedHashMap<BigInteger,String> createdIds = null;
	private HashSet<BigInteger> CreatedAbstractIds = null;
	CTAbstractNum exstAbstractNum = null;
	private int paraLeft = 0;
	public HashMap<String, NumberingInput> numStyle=null;
	

	public DocGenInput()
	{
		this.createdIds = new LinkedHashMap<BigInteger,String>();
		this.CreatedAbstractIds =  new HashSet<BigInteger>();
	}
	
	public DocGenInput(final String iStartPattern, final String iEndPattern, final String iStorageTicket, final String iSampleInputId)
	{
		this.setStartPattern(iStartPattern);
		this.setEndPattern(iEndPattern);
		this.setStorageTicket(iStorageTicket);
		this.setSampleInputItemId(iSampleInputId);
		this.createdIds = new LinkedHashMap<BigInteger,String>();
		this.CreatedAbstractIds =  new HashSet<BigInteger>();
	}
	
	public String getStartPattern()
	{
		return this.Start_Pattern;
	}
	
	public String getEndPattern()
	{
		return this.End_Pattern;
	}
	
	public String getStorageTicket()
	{
		return this.Storage_Ticket;
	}
	
	public String getSampleInputItemId()
	{
		return this.Sample_Input_ItemId;
	}
	
	public Boolean getIsParaCreated()
	{
		return this.isParaCreated;
	}
	
	public int getCreatedRunsCount()
	{
		return this.CreatedRuns_Count;
	}
	
	public int getParaLeft()
	{
		return this.paraLeft;
	}
	
	public void setStartPattern(final String iValue)
	{
		this.Start_Pattern = iValue;
	}
	
	public void setEndPattern(final String iValue)
	{
		this.End_Pattern = iValue;
	}
	
	public void setStorageTicket(final String iValue)
	{
		this.Storage_Ticket = iValue;
	}
	
	public void setSampleInputItemId(final String iValue)
	{
		this.Sample_Input_ItemId = iValue;
	}
	
	public void setIsParaCreated(final Boolean iValue)
	{
		this.isParaCreated = iValue;
	}
	
	public void setCreatedRunsCount(final int iValue)
	{
		this.CreatedRuns_Count = iValue;
	}
	
	public void setParaLeft(final int iValue)
	{
		this.paraLeft = iValue;
	}
	
	public void addCreatedAbstractIds(final BigInteger iCreatedId) {
		this.CreatedAbstractIds.add(iCreatedId);
	}
	public Boolean hasCreatedabstractId(final BigInteger iValue)
	{
		if(this.CreatedAbstractIds==null)
		{
			return false;
		}
		return this.CreatedAbstractIds.contains(iValue);
	}
		
	public void addCreatedNumID(final BigInteger iKey,final String iValue)
	{
		this.createdIds.put(iKey, iValue);
	}
	
	public Boolean hasCreatedId(final BigInteger iValue)
	{
		if(this.createdIds==null)
		{
			return false;
		}
		return this.createdIds.containsKey(iValue);
	}

	public BigInteger getOrUpdateNumberingRoute(final String lrouteText, HashSet<BigInteger> usedIds) {
		if("".equalsIgnoreCase(lrouteText))
		{
			return null;
		}
		Iterator<Entry<BigInteger, String>> lItr = this.createdIds.entrySet().iterator();
		while(lItr.hasNext())
		{
			Entry<BigInteger, String> lCreatedIdEntry = lItr.next();
			if(usedIds!=null && usedIds.contains(lCreatedIdEntry.getKey()))
			{
				continue;
			}
			if("".equalsIgnoreCase(lCreatedIdEntry.getValue()))
			{
				continue;
			}
			if("COMPLETED".equalsIgnoreCase(lCreatedIdEntry.getValue()))
			{
				continue;
			}
			if(lrouteText.equalsIgnoreCase(lCreatedIdEntry.getValue()))
			{
				return lCreatedIdEntry.getKey();
			}
			else if(lCreatedIdEntry.getValue().startsWith(lrouteText))
			{
				return lCreatedIdEntry.getKey();
			}
			else if(lrouteText.startsWith(lCreatedIdEntry.getValue()))
			{
				lCreatedIdEntry.setValue(lrouteText);
				return lCreatedIdEntry.getKey();
			}
		}
		return null;		
	}
	
	public CTAbstractNum getExstAbstractNum() {
		return exstAbstractNum;
	}

	public void setExstAbstractNum(CTAbstractNum iAbstractNum) {
		this.exstAbstractNum = iAbstractNum;
	}
	
	public NumberingInput getNumInput(final String fKey)
	{
		if(this.numStyle != null && this.numStyle.containsKey(fKey))
		{
			return this.numStyle.get(fKey);
		}
		return null;
	}
	
	public NumberingInput getOrCreateNumInput(final String fKey, XWPFRun iRun)
	{
		return getOrCreateNumInput(fKey,iRun.getFontSize(), iRun.getFontFamily(), iRun.getColor());
	}
	
	public NumberingInput getOrCreateNumInput(final String fKey, final int fSize, final String fFamily,final String fColor)
	{
		createNumStyleMapIfNotExist();
		if(this.numStyle.containsKey(fKey))
		{
			return this.numStyle.get(fKey);
		}
		else
		{
			NumberingInput lNumInput =  new NumberingInput(fColor, fSize,fFamily);
			this.numStyle.put(fKey, lNumInput);
			return lNumInput;
		}
	}
	
	private void createNumStyleMapIfNotExist()
	{
		if(this.numStyle==null)
		{
			this.numStyle = new HashMap<String, NumberingInput>();
		}
		
	}

	public class NumberingInput
	{
		private String numFontColor = "";
		private int numFontSize = 0;
		private String numFontFamily = "";
		public NumberingInput()
		{
			
		}
		
		public NumberingInput(final String fColor, final int fSize, final String fFamily)
		{
			this.numFontColor=fColor;
			this.numFontSize = fSize;
			this.numFontFamily = fFamily;
		}
		
		public String getColor()
		{
			return this.numFontColor;
		}		
		public int getFontSize()
		{
			return this.numFontSize;
		}
		public String getFontFamily()
		{
			return this.numFontFamily;
		}
		
		public void setColor(String fColor) 
		{		
			this.numFontColor = fColor;
		}		
		public void setFontSize(int fSize) 
		{		
			this.numFontSize = fSize;
		}
		public void setFontFamily(String iFontFamily) 
		{		
			this.numFontFamily	= iFontFamily;
		}
	}
}
