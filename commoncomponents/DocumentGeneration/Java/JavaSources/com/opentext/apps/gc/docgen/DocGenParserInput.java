package com.opentext.apps.gc.docgen;

import java.math.BigInteger;

public class DocGenParserInput {

	private Boolean isBold = false;
	private Boolean isItallic = false;
	private Boolean isStrikeThrough=false;
	private Boolean isUnderline=false;
	private String fontColor = "";
	private int fontSize = 0;
	private String backgroundColor = "";
	private String fontFamily = "";
	private BigInteger numId=null;
	private int levelNum =-1 ;
	private int addlLevel = -1;
	private int bulletInteger=109;
	private int currentLeft = 0;
	private String lvlRoute = "";
	private String prevNums="";
	private Boolean isNumUsed = false; 
	private String defColour = "";
	private int numSysCount = 1;
	
	public DocGenParserInput()
	{		
	}
	
	public DocGenParserInput(DocGenParserInput dgParseInput)
	{
		if(dgParseInput.isBold)
		{
			this.setBold();
		}
		if(dgParseInput.isItallic)
		{
			this.setItallic();
		}
		if(dgParseInput.isUnderline)
		{
			this.setUnderline();
		}
		if(dgParseInput.isStrikeThrough)
		{
			this.setStrikeThrough();
		}
		this.setColor(dgParseInput.getColor());
		this.setFontSize(dgParseInput.getFontSize());
		this.setFontFamily(dgParseInput.getFontFamily());
		this.setBackgroundColor(dgParseInput.getBackgroundColor());
		this.setNumID(dgParseInput.getNumID());
		this.setBulletInt(dgParseInput.getBulletInt());
		this.setNumLevel(dgParseInput.getNumLevel());
		this.setCurrentLeft(dgParseInput.getCurrentLeft());
		this.setLvlRoute(dgParseInput.getLvlRoute());
		this.setAddlLevel(dgParseInput.getAddlLevel());
		this.setIsNumUsed(dgParseInput.getIsNumUsed());
		this.setPrevNums(dgParseInput.getPrevNums());
		this.setDefColour(dgParseInput.getDefColour());
		this.setNumSysCount(dgParseInput.getNumSysCount());
	}
	
	public Boolean isBold()
	{
		return this.isBold;
	}
	
	public Boolean isItallic()
	{
		return this.isItallic;
	}
	
	public Boolean isUnderline()
	{
		return this.isUnderline;
	}
	
	public Boolean isStrikeThrough()
	{
		return this.isStrikeThrough;
	}
	
	public String getColor()
	{
		return this.fontColor;
	}
	
	public int getFontSize()
	{
		return this.fontSize;
	}
	
	public String getBackgroundColor()
	{
		return this.backgroundColor;
	}
	
	public String getFontFamily()
	{
		return this.fontFamily;
	}
	
	public int getNumLevel()
	{
		return this.levelNum;
	}
	
	public BigInteger getNumID()
	{
		return this.numId;
	}
	
	public int getBulletInt()
	{
		return this.bulletInteger;
	}
	
	public int getCurrentLeft()
	{
		return this.currentLeft;
	}
	
	public String getLvlRoute()
	{
		return this.lvlRoute;
	}
	
	public int getNumSysCount()
	{
		return this.numSysCount;
	}
	
	public void setBold()
	{
		this.isBold = true;
	}
	
	public void setItallic()
	{
		this.isItallic = true;
	}
	
	public void setUnderline()
	{
		this.isUnderline = true;
	}
	
	public void setStrikeThrough()
	{
		this.isStrikeThrough = true;
	}

	public void setColor(String fColor) 
	{		
		this.fontColor = fColor;
	}
	
	public void setFontSize(int fSize) 
	{		
		this.fontSize = fSize;
	}
	
	public void setBackgroundColor(String iColor) 
	{		
		this.backgroundColor = iColor;
	}
	
	public void setFontFamily(String iFontFamily) 
	{		
		this.fontFamily	= iFontFamily;
	}
	
	public void setNumLevel(int iNumLevel)
	{
		this.levelNum=iNumLevel;
	}
	
	public void setNumID(BigInteger iNumId)
	{
		this.numId=iNumId;
	}
	
	public void setNumSysCount(int iNumSysCount)
	{
		this.numSysCount=iNumSysCount;
	}
	
	public void setBulletInt(final int iBltNum)
	{
		if(iBltNum<110)
		{
			this.bulletInteger=110;
		}
		else if(iBltNum>112)
		{
			this.bulletInteger=112;
		}
		else
		{
			this.bulletInteger=iBltNum;
		}
	}
	
	public void resetNumberingInputs()
	{
		this.numId=null;
		this.levelNum =-1 ;
		this.bulletInteger=109;
		
	}
	
	public void resetDefaultFontStyle()
	{
		this.fontSize = 0;		
		this.fontFamily = "";
		this.fontColor="";
	}
	
	public void setCurrentLeft(final int iValue)
	{
		this.currentLeft=iValue;
	}
	
	public void setLvlRoute(final String lvlPath) 
	{		
		this.lvlRoute = lvlPath;
	}
	
	public int getAddlLevel() {
		return addlLevel;
	}

	public void setAddlLevel(final int iAddlLevel) {
		this.addlLevel = iAddlLevel;
	}
	
	public String getPrevNums() {
		return prevNums;
	}

	public void setPrevNums(final String iValue) {
		this.prevNums = iValue;
	}

	public Boolean getIsNumUsed() {
		return isNumUsed;
	}

	public void setIsNumUsed(final Boolean iNumUsed) {
		this.isNumUsed = iNumUsed;
	}
	public String getDefColour() {
		return defColour;
	}

	public void setDefColour(String iColour) {
		this.defColour = iColour;
	}
}
