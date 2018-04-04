//# sourceURL=application.js

/*
 application.js
 CVlife

 Copyright (c) 2017 Vlife. All rights reserved.
*/

/*
 * This file provides an example skeletal stub for the server-side implementation
 * of a TVML application.
 *
 * A javascript file such as this should be provided at the tvBootURL that is
 * configured in the AppDelegate of the TVML application. Note that  the various
 * javascript functions here are referenced by name in the AppDelegate. This skeletal
 * implementation shows the basic entry points that you will want to handle
 * application lifecycle events.
 */

/**
 * @description The onLaunch callback is invoked after the application JavaScript
 * has been parsed into a JavaScript context. The handler is passed an object
 * that contains options passed in for launch. These options are defined in the
 * swift or objective-c client code. Options can be used to communicate to
 * your JavaScript code that data and as well as state information, like if the
 * the app is being launched in the background.
 *
 * The location attribute is automatically added to the object and represents
 * the URL that was used to retrieve the application JavaScript.
 */
/*
App.onLaunch = function(options) {
    var alert = createAlert("Hello World!", "Welcome to tvOS");
    navigationDocument.pushDocument(alert);
}
*/

var baseURL;
var APIbaseURL ='https://www.vlifetech.com/';
var APIclientId =74;
var APIclientName ='';
var APIshowMT =true;
var APIclientImage;
var APIclientLiveURL;
var selectedElement;
var SchedulelistArray;
var APIcdnURL = 'https://vod.vlifetech.com/1.0/00'+APIclientId+'/';
var LiveCountDownInterval ='';
App.onLaunch = function(options) {
    targetURL = APIbaseURL+'getclientdetailtvml/'+APIclientId;
    loadAndPushDocument(targetURL);

}


function loadAndPushDocument(url) {

    var loadingDocument = loadingTemplate('Loading');
    navigationDocument.pushDocument(loadingDocument);
    var request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.onreadystatechange = function() {

    var documentData = JSON.parse(request.response)

    APIclientImage = APIbaseURL+'img/client/'+documentData.Client.image;
    APIclientName = documentData.Client.name;
    APIclientLiveURL = documentData.Client.iphone_event_url;
    var clientPermission = documentData.Client.permissiontypes_id;

    var menuItem = '<menuItem selectTargetURL="homePageNew"><title>Home</title></menuItem>';
    //menuItem += '<menuItem selectTargetURL="archiveSearchPage"><title>Archive</title></menuItem>';
    menuItem += '<menuItem selectTargetURL="tvprograms"><title>TV Programs</title></menuItem>';
    menuItem += '<menuItem selectTargetURL="otherspeakers"><title>Other Speakers</title></menuItem>';
    menuItem += '<menuItem selectTargetURL="programePage"><title>24*7</title></menuItem>';
    
    
    
   
    

    


    var template = `<?xml version="1.0" encoding="UTF-8" ?>
          <document>
        <menuBarTemplate>
            <menuBar>
                `+ menuItem +`
            </menuBar>
        </menuBarTemplate>
    </document>`
 var parser = new DOMParser();

    var document = parser.parseFromString(template, "application/xml");


            document.addEventListener("select", handleSelectEvent);
            navigationDocument.replaceDocument(document, loadingDocument)


    };
    request.send();
}


function loadingTemplate(title) {
    var loadingDoc = "<document><loadingTemplate><activityIndicator><text>"+APIclientName+" "+title+"</text></activityIndicator></loadingTemplate></document>";
    var parser = new DOMParser();
    var parsedTemplate = parser.parseFromString(loadingDoc, "application/xml");
    return parsedTemplate;
}

function alertTemplate() {
    var alertDoc = "<document><alertTemplate><title>Error</title><description>Page failed to load</description></alertTemplate></document>";
    var parser = new DOMParser();
    var parsedTemplate = parser.parseFromString(alertDoc, "application/xml");
    return parsedTemplate;
}





function handleSelectEvent(event) {
    selectedElement = event.target;

    var targetURL = selectedElement.getAttribute("selectTargetURL");


    if (selectedElement.tagName == "menuItem") {

    if(targetURL == 'homePageNew'){
    targetURL = APIbaseURL+'getclientdetailtvml/'+APIclientId;
    ShowHomePageNew(selectedElement, targetURL);
    }


    if(targetURL == 'livePage'){
    targetURL = APIbaseURL+'getclientdetailtvml/'+APIclientId;

    ShowLivePage(selectedElement, targetURL);
    }
    if(targetURL == 'archivePage'){
    targetURL = APIbaseURL+'getclientmediacategory/'+APIclientId;
    ShowArchivePage(selectedElement, targetURL);
    }

    if(targetURL == 'archiveSearchPage'){
    targetURL = APIbaseURL+'getclientmediacategory/'+APIclientId;
    ShowArchiveSearchPage(selectedElement, targetURL);
    }

    if(targetURL == 'programePage'){
    targetURL = APIbaseURL+'getprogramslistios/'+APIclientId;
    ShowProgramePage(selectedElement, targetURL);
    }

    if(targetURL =='tvprograms'){
    //getMedia(318);
    targetURL = APIbaseURL+'getclientchildcategory/331/'+APIclientId;
    ShowArchiveSearchPageMenu(selectedElement, targetURL,'TV Programs');
    
    }
    
    if(targetURL =='otherspeakers'){
    //getMedia(318);
    targetURL = APIbaseURL+'getclientchildcategory/333/'+APIclientId;
    ShowArchiveSearchPageMenu(selectedElement, targetURL,'Other Speakers');
    
    }
    

    }


}

// show 27*7 programes start here //

var ShowProgramePage = function(menuItem,url) {

var loadingDocument = loadingTemplate('24*7');

     var menuItemDocument = menuItem.parentNode.getFeature("MenuBarDocument");

     menuItemDocument.setDocument(loadingDocument, menuItem)

    var request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.onreadystatechange = function() {

    SchedulelistArray = JSON.parse(request.response);
    var SchedulelistData = SchedulelistArray.Schedulelist;
   
    if(SchedulelistData){
    var mediaFileURL = SchedulelistData['0'].Media.filename;
    var seekto = SchedulelistData[0].Schedule.media_seekto;
    var timeleft = parseInt(SchedulelistData[0].Schedule.media_timeleft);
    var medialist='';
     if( SchedulelistData.length > 6){
     var schLength = 6;
     }else{
     var schLength = SchedulelistData.length;
     }
    
    for(m = 0; m < schLength; m++) {


		            var mediaName = SchedulelistData[0].Media.name.replace(/&/g, "and");
                    var startDate = SchedulelistData[0].Schedule.start_time;
                    var descriptionText = SchedulelistData[0].Media.description.replace(/&/g, "and");//result[0].Media.description;
                    if(SchedulelistData[0].Media.image){
                    var mediaLogo = '<heroImg src="'+  APIbaseURL+'img/media/'+SchedulelistData[0].Media.image +'"/>';
                    }else{
                    var mediaLogo = '<heroImg src="'+  APIclientImage +'"/>';
                    }
                    var mediafileURL =SchedulelistData[0].Media.filename;

				   if(SchedulelistData[m].Media.image){
					  var mediaImage =APIbaseURL+'img/media/'+SchedulelistData[m].Media.image;
				   }else{
					 var mediaImage =APIclientImage;
				   }

			 
			 
			  if(m > 0){
			  var mediaListName = SchedulelistData[m].Media.name.replace(/&/g, "and");
			  var mediaListTime = '@'+SchedulelistData[m].Schedule.start_time_bh;
			  medialist += '<lockup style="tv-text-style: none; font-size:18; font-weight:regular; color:#ffffff;"><img src="'+mediaImage+'" width="300" height="180"/><title>'+mediaListName+'</title><subtitle>'+mediaListTime+'</subtitle></lockup>';
			  }

			 }
    var template = `<?xml version="1.0" encoding="UTF-8" ?>
          <document>
				   <productBundleTemplate>
					  <background>
					  </background>
					  <banner>
						 <stack style="margin:140 0 100 100">
						       <title>`+mediaName+`</title>
						       <row><text>Start Date:`+startDate+`</text></row>
							   <description>`+descriptionText+`</description>

							<row>
							<buttonLockup onselect="playListVideo('`+url+`', '0','0')">
								  <text>Play</text>
							   </buttonLockup>
							</row>
						 </stack>
                        `+mediaLogo+`
					  </banner>
					  <shelf>
						 <header>
							<title>Upcoming Schedules</title>
						 </header>
						 <section>`+medialist+`</section>
					  </shelf>
				   </productBundleTemplate>
		   </document>`
    }else{

    var template = `<?xml version="1.0" encoding="UTF-8" ?>
          <document>
          <alertTemplate>
          <title>Warning</title>
          <description>No Schdule found</description>
          </alertTemplate>
          </document>`

    }



       var parser = new DOMParser();

    var alertDoc = parser.parseFromString(template, "application/xml");


        var menuItemDocument = menuItem.parentNode.getFeature("MenuBarDocument");
        menuItemDocument.setDocument(alertDoc, menuItem)

      		 
  	 playSingleVideoSchedule(SchedulelistData,url)
    };
   
    request.send();



}
// show 27*7 programes start here //
//////////////////////////////////////////////////////////////////////////////////////////////

// home page start here //
var ShowHomePageNew = function(menuItem,url) {

var loadingDocument = loadingTemplate('Home');

     var menuItemDocument = menuItem.parentNode.getFeature("MenuBarDocument");

     menuItemDocument.setDocument(loadingDocument, menuItem)

    var request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.onreadystatechange = function() {

    var documentData = JSON.parse(request.response)
    if(documentData.Media.image){
     var mediaIMG = '<img style="tv-align: left;margin:20 0 20 120;" src="'+  APIbaseURL+'img/media/'+documentData.Media.image +'" width="800" height="400"/>';
    }else{
     var mediaIMG = '<img style="tv-align: left;margin:20 0 20 120;" src="'+  APIbaseURL+'img/client/'+documentData.Client.image +'" width="800" height="400"/>';
    }

    var mediaFileURL = documentData.Media.filename;
    var mediaName = documentData.Media.name.replace(/&/g, "and");
    var mediaName2 = documentData.Media.name.replace("'", "");
    var mediaImg = documentData.Media.image;
    var Mediaext = mediaFileURL.substr(mediaFileURL.lastIndexOf('.') + 1);
    var template = `<?xml version="1.0" encoding="UTF-8" ?>
     		<document><divTemplate>

      			<background>
          </background>
      		   <lockup style="tv-position: left">
      			    <title style="tv-align: left;font-size:50;text-align:center;">` + documentData.Client.name + `</title>
      			    `+mediaIMG+`
      				<row>
				        <buttonLockup onselect="playSingleVideo('`+mediaFileURL+`','`+mediaName2+`','`+mediaImg+`')">
								  <text style="font-size:30">Play</text>
						    </buttonLockup>
				      </row>

				   </lockup>

      			<lockup style="tv-position: right">
      				<img style="tv-align: left;margin:5 0;padding:0;" src="`+APIbaseURL+'img/client/'+documentData.Client.image+`" width="400" height="300"/>
      				<text style="tv-align: left;margin:5 0;font-size:22">` + documentData.Client.address_1 +' '+documentData.Client.address_2+`</text>
      				<text style="tv-align: left;margin:5 0;font-size:22">` + documentData.Client.zip_code+ `</text>
      			  <description style="tv-align: left;margin:5 0;font-size:18;word-wrap:break-word;tv-text-max-lines: 3;">` + documentData.Client.description + `</description>
            
            </lockup>

            


     		</divTemplate></document>`

        var parser = new DOMParser();

        var alertDoc = parser.parseFromString(template, "application/xml");


        var menuItemDocument = menuItem.parentNode.getFeature("MenuBarDocument");
        menuItemDocument.setDocument(alertDoc, menuItem)

    };
    request.send();


}
// home page end here //

///////////////////////////////////////////////

// Show Live Event Page start here //

var ShowLivePage = function(menuItem,url) {

var loadingDocument = loadingTemplate('Live');

     var menuItemDocument = menuItem.parentNode.getFeature("MenuBarDocument");

     menuItemDocument.setDocument(loadingDocument, menuItem)

    var request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.onreadystatechange = function() {

    var documentData = JSON.parse(request.response);
    if(documentData.Liveevent){

    if(documentData.Liveevent.image){
     var LiveeventIMG = '<img style="tv-align: left;margin:20 0;padding:0;" src="'+  APIbaseURL+'img/event/'+documentData.Liveevent.image +'" width="900" height="450"/>';

     }else{
    var LiveeventIMG = '<img style="tv-align: left;margin:20 0;padding:0;" src="'+  APIbaseURL+'img/client/'+documentData.Client.image +'" width="900" height="450"/>';
    }
    var Liveeventtitle = documentData.Liveevent.title.replace(/&/g, "and");
    var template = `<?xml version="1.0" encoding="UTF-8" ?>
     		<document>
     		<divTemplate>

      			<background>
			   </background>
      		   <lockup style="tv-align: center">
      			    <title style="tv-align: center;font-size:50;text-align:center;">` + documentData.Client.name + `</title>
      			    <subtitle style="tv-align: center;font-size:20;text-align:center;">`+Liveeventtitle+`</subtitle>
      			    `+LiveeventIMG+`
      			</lockup>

      			<lockup style="tv-align: bottom">
      			<row  style="tv-align: center;font-size:40;" id="liveplaybtnheading"></row>
      			<row  style="tv-align: center;font-size:30;" id="liveplaybtn"><buttonLockup onselect="playLiveVideo()"><text>Live</text></buttonLockup></row>
      			<row  style="tv-align: center;font-size:15;" id="liveplaybtnheadingbottom"></row>
      			</lockup>

     		</divTemplate>

     		</document>`
     	}else{
     var template = `<?xml version="1.0" encoding="UTF-8" ?>
          <document>
          <alertTemplate>
          <title>Warning</title>
          <description>No Live Event Scheduled</description>
          </alertTemplate>
          </document>`
      }
        var parser = new DOMParser();

        var alertDoc = parser.parseFromString(template, "application/xml");


        var menuItemDocument = menuItem.parentNode.getFeature("MenuBarDocument");
        menuItemDocument.setDocument(alertDoc, menuItem)


        LiveCountDownInterval =  setInterval(function () {
  			getLiveCountDown(alertDoc,documentData)
  		 }, 1000);


    };
    request.send();


}


// Show Live Event Page End here //

//////////////////////////////////////////////////



// Show Archive  Page Start top menyhere //

var ShowArchiveSearchPageMenu = function(menuItem,url,categoryName) {

var loadingDocument = loadingTemplate(categoryName);

     var menuItemDocument = menuItem.parentNode.getFeature("MenuBarDocument");
        menuItemDocument.setDocument(loadingDocument, menuItem)

    var request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.onreadystatechange = function() {

     var categoryListData = JSON.parse(request.response)
     if(categoryListData){
     var mCategory ="";
     var cateLogo ='';
     var cateNameList = [];
    for(i = 0; i < categoryListData.length; i++) {

   cateNameList.push({id:categoryListData[i].Mediacategory.id,name:categoryListData[i].Mediacategory.name,image:categoryListData[i].Mediacategory.image});
   if(categoryListData[i].Mediacategory.image){
    var cateLogo =APIbaseURL+'img/media/'+categoryListData[i].Mediacategory.image;
   }else{
    var cateLogo = APIclientImage;
    }
    var LinkTo ='onselect="getMedia('+categoryListData[i].Mediacategory.id+')"';
    mCategory += '<lockup '+LinkTo+'><img src="'+cateLogo+'" width="200" height="150" /><title>' + categoryListData[i].Mediacategory.name + '</title></lockup>';

   
    }

    var template = `<?xml version="1.0" encoding="UTF-8" ?>
          <document>
              <searchTemplate>
              <searchField/>
			    <collectionList>
			      <grid><section>` + mCategory + `</section></grid>
                </collectionList>
              </searchTemplate>
          </document>`
   }else{

    var template = `<?xml version="1.0" encoding="UTF-8" ?>
          <document>
          <alertTemplate>
          <title>Warning</title>
          <description>No Archive found</description>
          </alertTemplate>
          </document>`

    }
       var parser = new DOMParser();

       var alertDoc = parser.parseFromString(template, "application/xml");


        var menuItemDocument = menuItem.parentNode.getFeature("MenuBarDocument");
        menuItemDocument.setDocument(alertDoc, menuItem)
        search(alertDoc,cateNameList);

    };
    request.send();


}

// Show Archive  Page Start here //

var ShowArchiveSearchPage = function(menuItem,url) {

var loadingDocument = loadingTemplate('Archive');

     var menuItemDocument = menuItem.parentNode.getFeature("MenuBarDocument");
        menuItemDocument.setDocument(loadingDocument, menuItem)

    var request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.onreadystatechange = function() {

     var categoryListData = JSON.parse(request.response)
     if(categoryListData){
     var mCategory ="";
     var cateLogo ='';
     var cateNameList = [];
    for(i = 0; i < categoryListData.length; i++) {

    if(categoryListData[i].Mediacategory.id !=331 && categoryListData[i].Mediacategory.id !=333 ) 
    {
    cateNameList.push({id:categoryListData[i].Mediacategory.id,name:categoryListData[i].Mediacategory.name,image:categoryListData[i].Mediacategory.image});
   if(categoryListData[i].Mediacategory.image){
    var cateLogo =APIbaseURL+'img/media/'+categoryListData[i].Mediacategory.image;
   }else{
    var cateLogo = APIclientImage;
    }
    var LinkTo ='onselect="getMedia('+categoryListData[i].Mediacategory.id+')"';
    mCategory += '<lockup '+LinkTo+'><img src="'+cateLogo+'" width="200" height="150" /><title>' + categoryListData[i].Mediacategory.name + '</title></lockup>';

   }
    }

    var template = `<?xml version="1.0" encoding="UTF-8" ?>
          <document>
              <searchTemplate>
              <searchField/>
			    <collectionList>
			      <grid><section>` + mCategory + `</section></grid>
                </collectionList>
              </searchTemplate>
          </document>`
   }else{

    var template = `<?xml version="1.0" encoding="UTF-8" ?>
          <document>
          <alertTemplate>
          <title>Warning</title>
          <description>No Archive found</description>
          </alertTemplate>
          </document>`

    }
       var parser = new DOMParser();

       var alertDoc = parser.parseFromString(template, "application/xml");


        var menuItemDocument = menuItem.parentNode.getFeature("MenuBarDocument");
        menuItemDocument.setDocument(alertDoc, menuItem)
        search(alertDoc,cateNameList);

    };
    request.send();


}

// Show Archive Page End here //
// Show Archive Search Page Start here //
function search(document,cateNameList) {


 //setInterval (searchResults(document, 'Love',cateNameList), 60000);
    var searchField = document.getElementsByTagName("searchField").item(0);
    var keyboard = searchField.getFeature("Keyboard");

    keyboard.onTextChange = function() {
            var searchText = keyboard.text;
            console.log("Search text changed " + searchText);
            searchResults(document, searchText,cateNameList);
    }
}




function searchResults(doc, searchText,cateNameList) {

    var domImplementation = doc.implementation;
    var lsParser = domImplementation.createLSParser(1, null);
    var lsInput = domImplementation.createLSInput();

   titles = [];

   for (var i = 0; i < cateNameList.length; i++) {

   if(cateNameList[i].name.toLowerCase().search(searchText.toLowerCase()) >= 0){

    titles.push(cateNameList[i]);

   }

   }

lsInput.stringData = `<list>
      <section>
        <header>
          <title>No Results</title>
        </header>
      </section>
    </list>`;


    if (titles.length > 0) {
        lsInput.stringData = `<grid><section id="Results">`;
        for (var i = 0; i < titles.length; i++) {

            if(titles[i].image){
      var cateLogo =APIbaseURL+'img/media/'+titles[i].image;
   }else{
    var cateLogo = APIclientImage;
    }

            var LinkTo ='onselect="getMedia('+titles[i].id+')"';

            lsInput.stringData += `<lockup `+LinkTo+`><img src="`+cateLogo+`" width="200" height="150" /><title>${titles[i].name}</title></lockup>`
        }
        lsInput.stringData += `</section></grid>`;
    }

    lsParser.parseWithContext(lsInput, doc.getElementsByTagName("collectionList").item(0), 2);
}


// Show Archive Search Page End here //

// Show Category Detail Page Start here //

function getMedia(categoryId,mediaID) {


        var JsonURL = APIbaseURL+'getclientmedia/'+categoryId+'/'+APIclientId;
        getMediaList(JsonURL,APIclientId,categoryId,mediaID);
}

function getMediaList(url,ChurchId,categoryId,mediaID) {
       loadingTemplate();
       var templateXHR = new XMLHttpRequest();
       //templateXHR.responseType = "document";
       templateXHR.addEventListener("load", function() {parseMedia(templateXHR.response,ChurchId,categoryId,mediaID)}, false);
       templateXHR.open("GET", url, true);
       templateXHR.send();
}

function parseMedia(information,ChurchId,categoryId,mediaID) {
       var resultArray = JSON.parse(information);
		   var result = resultArray.Media;
		   if(result){
	       var medialist="";
		     var mediaImage ="";

	       var count=result.length;
		   for(m = 0; m < result.length; m++) {
		   var MediacategoryName = result[m].Mediacategory.name;

		          if(mediaID){
					  if(result[m].Media.id == mediaID){
						var mediaName = result[m].Media.name.replace(/&/g, "and");
						var mediaName2 = result[m].Media.name.replace("'", "");
						var mediaImg = result[m].Media.image;
						var startDate = result[m].Media.start_date;
						var descriptionText = result[m].Media.description.replace(/&/g, "and");


						if(result[m].Media.image){
					     var mediaLogo = '<heroImg src="'+  APIbaseURL+'img/media/'+result[m].Media.image +'"/>';
				        }else{
					     var mediaLogo = '<heroImg src="'+APIclientImage+'"/>';
				        }

						var mediaFileURL = result[m].Media.filename;
						var Mediaext = mediaFileURL.substr(mediaFileURL.lastIndexOf('.') + 1);
					  }
                  }else{
                    var mediaName = result[0].Media.name.replace(/&/g, "and");
                    var mediaName2 = result[m].Media.name.replace("'", "");
                    var mediaImg = result[m].Media.image;
                    var startDate = result[0].Media.start_date;
                    var descriptionText = result[0].Media.description.replace(/&/g, "and");//result[0].Media.description;

                    if(result[0].Media.image){
					     var mediaLogo = '<heroImg src="'+  APIbaseURL+'img/media/'+result[0].Media.image +'"/>';
				        }else{
					     var mediaLogo ='<heroImg src="'+APIclientImage+'"/>';
				        }

                    var mediaFileURL = result[0].Media.filename;
                    var Mediaext = mediaFileURL.substr(mediaFileURL.lastIndexOf('.') + 1);
                  }

				   if(result[m].Media.image){
					  var mediaImage =APIbaseURL+'img/media/'+result[m].Media.image;
				   }else{
					 var mediaImage =APIclientImage;
				   }

			  var LinkTo ='onselect="getMedia('+categoryId+','+result[m].Media.id+')"';
			  var mediaListName =result[m].Media.name.replace(/&/g, "and");
        var mStartDate = result[m].Media.start_date;

			  if(APIshowMT == true){
			  medialist += '<lockup '+LinkTo+' style="tv-text-style: none; font-size:18; font-weight:regular; color:#ffffff;"><img src="'+mediaImage+'" width="170" height="130"/><title>'+mediaListName+'</title><subtitle>'+mStartDate+'</subtitle></lockup>';

			  }else{
			  medialist += '<lockup '+LinkTo+' style="tv-text-style: none; font-size:18; font-weight:regular; color:#ffffff;"><img src="'+mediaImage+'" width="170" height="130"/><title>Part '+count+'</title><subtitle>'+mStartDate+'</subtitle></lockup>';
			  }
			  //medialist += '<lockup '+LinkTo+' style="tv-text-style: none; font-size:18; font-weight:regular; color:#ffffff;"><img src="'+mediaImage+'" width="150" height="130"/><title>Part '+count+'</title></lockup>';
 count = count-1;
      }

          var template = `<?xml version="1.0" encoding="UTF-8" ?>
          <document>
				   <productTemplate>
					  <background>
					  </background>
					  <banner>
						 <stack style="margin:60 0 100 100">
						     <title >`+mediaName+`</title>
						     <row ><text>Start Date:`+startDate+`</text></row>
							   <description>`+descriptionText+`</description>

							<row >
							   <buttonLockup onselect="backToCategory()">
								  <text>Go Back</text>
							   </buttonLockup>
							   <buttonLockup onselect="playSingleVideo('`+mediaFileURL+`','`+mediaName2+`','`+mediaImg+`')">
								  <text>Play</text>
							   </buttonLockup>
							</row>
						 </stack>
                        `+mediaLogo+`
					  </banner>
					  <shelf>
						 <header>
							<title>`+MediacategoryName+`</title>
						 </header>
						 <section>`+medialist+`</section>
					  </shelf>
				   </productTemplate>
		   </document>`

		   }else{

    var template = `<?xml version="1.0" encoding="UTF-8" ?>
          <document>
          <alertTemplate>
          <title>Warning</title>
          <description>No Media found</description>
          </alertTemplate>
          </document>`

    }
		   var templateParser = new DOMParser();
		   var parsedTemplate = templateParser.parseFromString(template, "application/xml");
		   navigationDocument.pushDocument(parsedTemplate);
}


function getLiveCountDown(myDoc,documentData) {
    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60;
    var _day = _hour * 24;

    // create Date object for current location
    d = new Date();
    utc = d.getTime()+3600000;
    var offset =documentData.gmtOffset;
    now = new Date(utc + (3600000*offset));

    // return time as a string
   var end = new Date(documentData.Liveevent.startdate+'T'+documentData.Liveevent.start_time);
   var distance = end - now;



        if(distance > 0){
        var liveplaybtn = myDoc.getElementById("liveplaybtn");
        var liveplaybtnheading = myDoc.getElementById("liveplaybtnheading");
        var liveplaybtnheadingbottom = myDoc.getElementById("liveplaybtnheadingbottom");
        var days = Math.floor(distance / _day);
        var hours = Math.floor((distance % _day) / _hour);
        var minutes = Math.floor((distance % _hour) / _minute);
        var seconds = Math.floor((distance % _minute) / _second);
        var liveplaybtnheadingHTML = '<text>Watch Live In</text>';
        var liveplaybtninnerHTML = '<text style="width:80;text-align:center;">'+days+'</text><text style="width:80;text-align:center;">'+hours+'</text><text style="width:80;text-align:center;">'+minutes+'</text><text style="width:80;text-align:center;">'+seconds+'</text>';
        var liveplaybtnheadingbottomHTML = '<text style="width:80;text-align:center;">Days</text><text style="width:80;text-align:center;">Hr</text><text style="width:80;text-align:center;">Min</text><text style="width:80;text-align:center;">Sec</text>';

        liveplaybtnheading.innerHTML = liveplaybtnheadingHTML;
        liveplaybtn.innerHTML = liveplaybtninnerHTML;
        liveplaybtnheadingbottom.innerHTML = liveplaybtnheadingbottomHTML;
        }else{

        //var liveplaybtnheadingHTML = '<text>Watch Live Now '+distance+'</text>';
        // var liveplaybtninnerHTML ='<buttonLockup onselect="playLiveVideo()"><text>Play</text></buttonLockup>';
        //var liveplaybtnheadingbottomHTML  ='';
        //liveplaybtnheading.innerHTML = liveplaybtnheadingHTML;
        //liveplaybtnheadingbottom.innerHTML = liveplaybtnheadingbottomHTML;

        }


}

function backToCategory(){


    targetURL = APIbaseURL+'getclientdetailtvml/'+APIclientId;
    loadAndPushDocument(targetURL);

}

//Play Live media function
function playLiveVideo() {
    var videourl = APIclientLiveURL;//'http://184.72.239.149/vod/smil:BigBuckBunny.smil/playlist.m3u8';

    var singleVideo = new MediaItem('video', videourl);

    var videoList = new Playlist();
    videoList.push(singleVideo);
    var myPlayer = new Player();
    myPlayer.playlist = videoList;
    myPlayer.play();


}


//Play Single media function
function playSingleVideo(filename,mediaName,mediaImg) {
    var videourl = APIcdnURL+filename+'.m3u8';
    //var videourl = 'http://vlifetechnology.com/stbc/BB/TBG029_Boldness_cc.mp4';
    //var videourl ='https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8'; //working close captionss
    var singleVideo = new MediaItem('video', videourl);
    //var mediaName = mediaName.replace(''', "");
    singleVideo.title = mediaName;
    singleVideo.artworkImageURL= APIbaseURL+'img/media/'+mediaImg;
    var videoList = new Playlist();
    videoList.push(singleVideo);
    var myPlayer = new Player();
    myPlayer.playlist = videoList;
    myPlayer.play();
}


//Play Single media function
function playSingleVideoSchedule(SchedulelistData,url) {
    var currentV = 0;
    var videourl = APIcdnURL+SchedulelistData[currentV].Media.filename+'.m3u8';
    
    var seekto = parseInt(SchedulelistData[currentV].Schedule.media_seekto);
    var media_timeleft = parseInt(SchedulelistData[currentV].Schedule.media_timeleft);
    
    
    var pauseAfter = parseInt(SchedulelistData[currentV].Schedule.media_length)*60;
    //var pauseAfter = parseInt(1)*60;
    var seektoNext = seekto+parseInt(pauseAfter);
	
	
    var singleVideo = new MediaItem('video', videourl);
    var videoList = new Playlist();
    singleVideo.title = SchedulelistData[currentV].Media.name;
    singleVideo.artworkImageURL= APIbaseURL+'img/media/'+SchedulelistData[currentV].Media.image;
    videoList.push(singleVideo);
    var myPlayerSch = new Player();
    myPlayerSch.playlist = videoList;
    myPlayerSch.seekToTime(seekto);
    myPlayerSch.play();
    
	setPlaybackEventListenersNew(myPlayerSch,url,seektoNext,currentV);
    
    
}



//Play List media function
function playListVideo(url,seektonew,currentV) {

    var request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.onreadystatechange = function() {
    var SchedulelistArray = JSON.parse(request.response);
    var commerciallistData = SchedulelistArray.commerciallist;
    var SchedulelistData = SchedulelistArray.Schedulelist;
    var currentTime = SchedulelistArray.currentTimeMain;
    var medialength_sec = SchedulelistData[currentV].Schedule.medialength_sec;
    var media_timeleft = parseInt(SchedulelistData[currentV].Schedule.media_timeleft);
    var seekto = parseInt(seektonew);
    if(seekto == 0 && currentV == 0){
    var seekto = parseInt(SchedulelistData[currentV].Schedule.media_seekto);
    }
    var pauseAfter = parseInt(SchedulelistData[currentV].Schedule.media_length)*60;
    //var pauseAfter = parseInt(1)*60;
    var seektoNext = seekto+parseInt(pauseAfter);
    
    var videoList1 = new Playlist();
    var videourl = APIcdnURL+SchedulelistData[currentV].Media.filename+'.m3u8'; 
  	var singleVideo = new MediaItem('video', videourl);
  	singleVideo.title = SchedulelistData[currentV].Media.name;
  	 singleVideo.artworkImageURL= APIbaseURL+'img/media/'+SchedulelistData[currentV].Media.image;
  	videoList1.push(singleVideo);
	

    var myPlayerSchBH = new Player();
    myPlayerSchBH.playlist = videoList1;
    myPlayerSchBH.seekToTime(seekto);
   
    myPlayerSchBH.play();
    
	setPlaybackEventListenersNew(myPlayerSchBH,url,seektoNext,currentV);
    
    };
   
   
    request.send();
    
   
}

function setPlaybackEventListenersNewBH(currentPlayerNew,url,seektoNext,currentV) {

    
 currentPlayerNew.addEventListener("mediaItemWillChange", function(event2) {
        if(event2.reason == 1){
         currentPlayerNew.stop();
         playListVideo(url,0,parseInt(currentV)+1)
         }
      
 });
 
 
}


function setPlaybackEventListenersNew(currentPlayerNew,url,seektoNext,currentV) {

    
currentPlayerNew.addEventListener("timeBoundaryDidCross", function(event) {
        
        currentPlayerNew.stop();
         playcommercialVideo(url,seektoNext,currentV)
        
      
 }, [seektoNext]);
 
 
 currentPlayerNew.addEventListener("mediaItemWillChange", function(event2) {
        if(event2.reason == 1){
         currentPlayerNew.stop();
         playcommercialVideo(url,0,parseInt(currentV)+1 )
        }
      
 });
 
 
}




//Play List media function
function playcommercialVideo(url,seekto,currentV) {

	var commerciallistData = SchedulelistArray.commerciallist;
	if(commerciallistData.length > 0){
	var videoListc = new Playlist();
    var commList =[];
    for(c = 0; c < commerciallistData.length; c++) {
     commList.push(APIcdnURL+commerciallistData[c].Media.filename+'.m3u8');
    }

  for(i = 0; i < commerciallistData.length; i++) {
	var videourlc = commList[Math.floor(Math.random()*commList.length)];
	var singleVideoc = new MediaItem('video', videourlc);
	videoListc.push(singleVideoc);
	}
	
    var myPlayerc = new Player();
    myPlayerc.playlist = videoListc;
    setPlaybackEventListeners(myPlayerc,url,seekto,currentV);
    
    myPlayerc.play();
   }else{
    playListVideo(url,seekto,currentV)
    }
   

}

function setPlaybackEventListeners(currentPlayer,url,seekto,currentV) {
currentPlayer.addEventListener("mediaItemWillChange", function(event) {
        if(event.reason == 1){
        currentPlayer.stop();
        playListVideo(url,seekto,currentV)
        }
      
 });
}

