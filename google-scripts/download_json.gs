/*
function onOpen() {
  var ui = SpreadsheetApp.getUi()
  .createMenu('JSON')
  .addItem('Get JSON', 'convertoJSON')
  .addToUi();
}
*/

function doGet(e) {
    var callback   = e.parameters.callback;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheets()[0];
    var vl = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
  
    var obj_arr = [];
    for (var i = 1; i < vl.length; i++) {
        var obj = {};
        for (var j in vl[i]) {
            var x = vl[0][j];
            obj[x] = vl[i][j];
        }
        obj_arr.push(obj);
    }
  
  var response = JSON.stringify(obj_arr, null, '\t');  
  
  var output = ContentService.createTextOutput();
  
  if (callback == undefined) {
    // Serve as JSON
    output.setContent(response).setMimeType(ContentService.MimeType.JSON);
  }
  
  return output;
  
  /*
  var fileName = 'JSON Data ' + (new Date()).toString().slice(0,15);
  var file = DriveApp.createFile(fileName, JSON.stringify(obj_arr, null, 2), MimeType.PLAIN_TEXT);

  var html = HtmlService.createHtmlOutput('<style>.display { width:355px; height:85px; text-align: center; overflow: auto; } </style>You can view the file here:<div class="display"><br><br><a href="' + file.getUrl() + '" target="_blank">' + file.getName() + '</a></div><div style="text-align: center;"><button onclick="google.script.host.close()">Close</button></div>')
  .setSandboxMode(HtmlService.SandboxMode.IFRAME)
  .setWidth(400)
  .setHeight(150);
  
  SpreadsheetApp.getUi().showModelessDialog(html, 'File Details');
  */
}
