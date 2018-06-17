/// <reference path="jquery.js" />
var SGWorld;
var scale = getIEZoomLevel();
//var level = proportion();
//var zoom = {};
var uniqueIDs = {
    "50": {
        "SGWorld": "CLSID:3a4f9191-65a8-11d5-85c1-0001023952c1"
    },
    "65": {
        "TerraExplorer3DWindow": "CLSID:3a4f9192-65a8-11d5-85c1-0001023952c1",
        "TerraExplorerInformationTree": "CLSID:3a4f9193-65a8-11d5-85c1-0001023952c1",
        "TerraExplorerNavigationMap": "CLSID:3a4f9194-65a8-11d5-85c1-0001023952c1",
        "TerraExplorer3DWindowEx": "CLSID:3a4f9196-65a8-11d5-85c1-0001023952c1",
        "SGWorld": "CLSID:3A4F9197-65A8-11D5-85C1-0001023952C1"
    },
    "66": {
        "TerraExplorer3DWindow": "CLSID:3a4f9192-65a8-11d5-85c1-0001023952c1",
        "TerraExplorerInformationTree": "CLSID:3a4f9193-65a8-11d5-85c1-0001023952c1",
        "TerraExplorerNavigationMap": "CLSID:3a4f9194-65a8-11d5-85c1-0001023952c1",
        "TerraExplorer3DWindowEx": "CLSID:3a4f9196-65a8-11d5-85c1-0001023952c1",
        "SGWorld": "CLSID:3A4F9199-65A8-11D5-85C1-0001023952C1"
    },
    "70": {
        "TerraExplorer3DWindow": "CLSID:3a4f9192-65a8-11d5-85c1-0001023952c1",
        "TerraExplorerInformationTree": "CLSID:3a4f9193-65a8-11d5-85c1-0001023952c1",
        "TerraExplorerNavigationMap": "CLSID:3a4f9194-65a8-11d5-85c1-0001023952c1",
        "TerraExplorer3DWindowEx": "CLSID:3a4f9196-65a8-11d5-85c1-0001023952c1",
        "SGWorld": "CLSID:3A4F919C-65A8-11D5-85C1-0001023952C1"
    }
};
function proportion() {
    var levelxy = {};
    var baseXlength = 1920;
    var baseYlength = 1040;//886 884 890
    return function () {
        var levelX = (screen.availWidth)*scale/ baseXlength;
        var levelY = (screen.availHeight)*scale/ baseYlength;
        levelxy.x = levelX;
        levelxy.y = levelY;
        return levelxy;
    }
}
function load_scripts(path) {
    document.write("<script language='javascript' src='" + path + "'></script>");
}
load_scripts("jquery.js");
function createInstance(divID) {
    var obj = document.getElementById("SGWorld");
    if (!obj) {
        obj = document.createElement("object");
        obj.setAttribute("id", "SGWorld");
        obj.setAttribute("name", "SGWorld");//sgworld
        //CLSID:3A4F9199-65A8-11D5-85C1-0001023952C1  66
        obj.setAttribute("classid", "CLSID:3A4F919C-65A8-11D5-85C1-0001023952C1");
        obj.setAttribute("style", "display:none;height:0px");
        document.getElementById(divID) ? document.getElementById(divID).appendChild(obj) : document.body.appendChild(obj);
    }
    return obj;
}
function event_OnLoadFinished(bSuccess) {
    try {
        SGWorld.Project.Settings("RemoveSkylineCopyright") = 1;//
        //SGWorld.Command.Execute(1140, 0);//开启碰撞检测
        SGWorld.IgnoreAccelerators = false;//忽略快捷键
        SGWorld.AttachEvent("OnRButtonDown", function (Flags, X, Y) {
            return true;
        });//屏蔽右键
        // SGWorld.Window.DisablePresentationControl = true;
        // zoom = level.call(null);
        displayPopups("memu", toAbspath("Module/memu.html"), "right", "top", 0, 330, 45,-1,false,false,false,true);//440  330
    } catch (e) {
        document.write(e.message);
    }
}
///获取fly名称
function getFlyName() {
    var flyName = String(SGWorld.Project.Name);
    if (flyName) {
        var start = flyName.lastIndexOf("/") + 1;
        var end = flyName.lastIndexOf(".");
        return flyName.substring(start, end);
    }
    document.write("login first");
}
function isArray(obj) {
    return Array.isArray ? Array.isArray(obj) : {}[toString.call(obj)] === "[object Array]";
}
function isWindow(obj) {
    return obj != null && obj.window == obj;
}
function isOjbect(obj) {
    return (obj != null) && ({}).toString.call(obj) === "[object Object]";
}
function isString(obj) {
    return ({}).toString.call(obj) === "[object String]";
}
function isNumber(obj) {
    //return ({}).toString.call(obj) === "[object Number]";
    return typeof obj==="number";
}
function getURLParameters(name) {
    var vars = {}, hash;
    //var str = "https://www.baidu.com/s?wd=%E5%8F%98%E9%87%8F&tn=92253034_hao_pg&ie=utf-8&rsv_cq=%E7%BB%99%E5%AF%B9%E8%B1%A1%E6%B7%BB%E5%8A%A0%E5%B1%9E%E6%80%A7&rsv_dl=0_right_recommends_merge_28335&euri=5145001";
    name = name||window.location.href;
    var hashes = name.slice(name.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        //vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
window.onload = function () {
    if (SGWorld == undefined) {
        SGWorld = createInstance("body");
    }
   // level = proportion();
}
function loadPointLayer(layerName, srsID, symbolID, imageFullPath) {
    srsID = srsID || 4326;
    var featureLayer = SGWorld.Creator.CreateFeatureLayer("point", "FileName=" + layerName + ";TEPlugName=OGR;", "");
    // var featureLayer = SGWorld.Creator.CreateFeatureLayer(layerName, "Server=http://192.168.78.131/SG/streamer.ashx;WFSVersion =1.0.0;User =admin;Password=544102;CRS_XY_OR_YX=1;LayerName=" + layerName + ";TEPlugName= WFS;", "");
    featureLayer.DataSourceInfo.Attributes.ImportAll = true;
    featureLayer.Streaming = false;
    //修改图层的坐标系统
    featureLayer.CoordinateSystem.InitFromEPSG(srsID);
    //default
    //featureLayer.FeatureGroups.Item(0).DisplayAs = 24;
    //featureLayer.FeatureGroups.SetProperty("Image File", "D:\\Program Files\\Skyline\\TerraExplorer Pro\\Resources\\defaultIcon.gif");
    if (symbolID != undefined && imageFullPath != undefined) {
        featureLayer.FeatureGroups.Item(0).DisplayAs = symbolID;
        featureLayer.FeatureGroups.SetProperty("Image File", toAbspath(imageFullPath));
    }
    featureLayer.FeatureGroups.SetProperty("Altitude Method", 1);
    featureLayer.FeatureGroups.SetProperty("Altitude", 20);
    featureLayer.Refresh();
    //飞到该图层
    SGWorld.Navigate.FlyTo(featureLayer.ID);
    //获取feature集合
    //var features = featureLayer.FeatureGroups.Item(0).GetCurrentFeatures();
}
function loadPolygonLayer(shapefilePath, srsID) {
    srsID = srsID || 4326;
    var featureLayer = SGWorld.Creator.CreateFeatureLayer(shapefilePath, "Server=http://1.203.115.62:8082/SG/streamer.ashx;WFSVersion =1.1.0;User =admin;Password=skyline;CRS_XY_OR_YX=1;LayerName=" + shapefilePath + ";TEPlugName= WFS;", "");
    featureLayer.DataSourceInfo.Attributes.ImportAll = true;
    featureLayer.Streaming = true;
    //修改图层的坐标系统
    featureLayer.CoordinateSystem.InitFromEPSG(srsID);
    //修改填充不透明度和线不透明度
    featureLayer.FeatureGroups.Item(0).DisplayAs = 6;
    featureLayer.FeatureGroups.SetProperty("Fill Opacity", 50);
    featureLayer.FeatureGroups.SetProperty("Line Opacity", 50);
    /****************************TAG***************************/
    featureLayer.FeatureGroups.SetProperty("Altitude Method", 1);
    featureLayer.FeatureGroups.SetProperty("Altitude", 20);
    featureLayer.FeatureGroups.SetProperty("Height", 2.8);
    /*****************************TAG**************************/
    featureLayer.Refresh();
    //飞到该图层
    SGWorld.Navigate.FlyTo(featureLayer.ID);
    //获取feature集合
    var features = featureLayer.FeatureGroups.Item(0).GetCurrentFeatures();
    //alert("featureCount:"+features.Count);
    for (i = 0; i < features.Count; i++) {
        var feature = features.Item(i);
        //var voiceLevel = feature.FeatureAttributes.GetFeatureAttribute("Elevation").Value * 1.0;
        var voiceLevel = feature.FeatureAttributes.GetFeatureAttribute("ID").Value * 1.0 / 100;
        //feature.Tint.FromARGBColor(0xff0000ff);
        if (voiceLevel == 0) {
            feature.Tint.abgrColor = 0x80FFFFFF;
        }
        else {

            if (voiceLevel <= 35) {
                feature.Tint.abgrColor = 0x8000FFBC;
            }
            else if (voiceLevel > 35 && voiceLevel <= 40) {
                feature.Tint.abgrColor = 0x80008000;
            }
            else if (voiceLevel > 40 && voiceLevel <= 45) {
                feature.Tint.abgrColor = 0x80004000;
            }
            else if (voiceLevel > 45 && voiceLevel <= 80) {
                feature.Tint.abgrColor = 0x8000FFFF;
            }
            else if (voiceLevel > 80 && voiceLevel <= 85) {
                feature.Tint.abgrColor = 0x80808080;
            }
            else if (voiceLevel > 85 && voiceLevel <= 90) {
                feature.Tint.abgrColor = 0x8000BCFF;
            }
            else if (voiceLevel > 90 && voiceLevel <= 95) {
                feature.Tint.abgrColor = 0x800000FF;
            }
            else if (voiceLevel > 95 && voiceLevel <= 100) {
                feature.Tint.abgrColor = 0x80000080;
            }
            else if (voiceLevel > 100 && voiceLevel <= 105) {
                feature.Tint.abgrColor = 0x80800080;
            }
            else if (voiceLevel > 105 && voiceLevel <= 110) {
                feature.Tint.abgrColor = 0x80FF0000;
            }
            else if (voiceLevel > 110 && voiceLevel <= 115) {
                feature.Tint.abgrColor = 0x80800000;
            }
            else {//大于85
                feature.Tint.abgrColor = 0x80400000;
            }
        }
    }
}
function abspath() {
    var abspath = "";
    try {
        abspath = unescape(window.location.href);
    }
    catch (e) {
        //abspath = unescape(this.__location);
    }
    // Remove query String
    var index = abspath.indexOf("?");
    if (index > 0) abspath = abspath.substr(0, index - 1);
    index = abspath.lastIndexOf("/");
    var index2 = abspath.lastIndexOf("\\");
    index = (index > index2) ? index : index2;
    if (index <= 0) return abspath;
    abspath = abspath.substring(0, index);
    if (abspath.substring(0, 1) == "/") abspath = abspath.slice(1);
    var re = /file:\/\/\//gi;
    if (abspath.match(re) != null) abspath = abspath.replace(re, ""); // if this is indeed a local file, we strip the "file://" prefix from it.
    return (abspath);
}
function toAbspath(url) {
    if (url.charAt(0) != "/")
        url = "/" + url
    return abspath() + url;
}
function getIEZoomLevel() {
    if (screen.systemXDPI) {//96
        return screen.deviceXDPI / screen.logicalXDPI;//1
    }
    else {
        var body = document.body, r = body.getBoundingClientRect();
        return (r.right - r.left) / body.offsetWidth;
    }
}
function closePopup() {
    if (arguments.length && isString(arguments[0])) {
        SGWorld.Window.RemovePopupByCaption(arguments[0]);
    }
    else {
        try {
            if (arguments.length && arguments[0].ObjectType == 32) {
                SGWorld.Window.RemovePopup(arguments[0]);
                arguments[0] = null;
            }
        } catch (e) {

        }

    }
}//传入pop或者caption 如果是pop 设为null transverse:left right center 
function displayPopups(popname, path, transverse, vertical, margin, width, height, timeout, AllowResize, ShowCaption, AllowDrag, isShow) {
    try { closePopup(popname); } catch (e) { }
    if (!path) {
        popup = SGWorld.Creator.CreatePopupMessage(popname);
        return popup;
    }
    var left = 0;
    var top = 0;
    var popup;
    var screenRectWidth = parseInt(SGWorld.Window.Rect.Width);//1620 1298 100%
    var screenRectHeight = parseInt(SGWorld.Window.Rect.Height);//724 581
    timeout = timeout * 1000 || -1;
margin = parseInt(margin) ? parseInt(margin * scale) : 0;
width = parseInt(width) ? (parseInt(width) * scale + 10) : 200 * scale;
height = parseInt(height) ? (parseInt(height) * scale + 6) : 200 * scale;
isShow = isShow===false?false:true;
if (width > screenRectWidth - 10) {
    width = screenRectHeight - 10;
}
if (height > screenRectHeight - 6) {
    height = screenRectHeight - 6;
}
switch (transverse) {
    case "left":
        left = 0 + margin;
        break;
    case "right":
        left = screenRectWidth - width - margin;
        break;
    case "center":
        left = (screenRectWidth - width) / 2;
        break;
    default: left =parseInt(transverse) + margin; break;
}
switch (vertical) {
    case "top":
        top = 0 + margin;
        break;
    case "bottom":
        top = screenRectHeight - height - margin;
        break;
    case "center":
        top = (screenRectHeight - height) / 2;
        break;
    default: top=parseInt(vertical) + margin; break;
}//
//popup = SGWorld.Creator.CreatePopupMessage(popname, toAbspath(path), left * level().x, top * level().y, width * level().x, height * level().y, timeout);
popup = SGWorld.Creator.CreatePopupMessage(popname, path, left, top, width, height, timeout);
popup.AllowResize = AllowResize;
popup.ShowCaption = ShowCaption;
popup.AllowDrag = AllowDrag;
//popup.Flags = 128;
if (isShow) { SGWorld.Window.ShowPopup(popup); }
//AnchorToView  FocusToRender
return popup;
}
function getObjectID(pathName, objType) {
    var id, kvp = [];
    if (arguments.length == 1) {
        if (isArray(pathName)) {
            for (var item in pathName) {
                id = SGWorld.ProjectTree.FindItem(pathName[item]);
                if (id) {
                    obj = SGWorld.ProjectTree.GetObject(id);
                    kvp.push(id);
                    //kvp[id] = obj;
                }
            }
        }
        else if (isString(pathName)) {
            id = SGWorld.ProjectTree.FindItem(pathName);
            if (id) {
                obj = SGWorld.ProjectTree.GetObject(id);
                //kvp[id] = obj;
                kvp.push(id);
            }

        }
    }
    else {
        if (isArray(pathName)) {
            for (var item in pathName) {
                id = SGWorld.ProjectTree.FindItem(pathName[item]);
                if (id && obj.ObjectType == objType) {
                    obj = SGWorld.ProjectTree.GetObject(id);
                    //kvp[id] = obj;
                    kvp.push(id);
                }
            }
        }
        else if (isString(pathName)) {
            id = SGWorld.ProjectTree.FindItem(pathName);
            if (id && obj.ObjectType == objType) {
                obj = SGWorld.ProjectTree.GetObject(id);
                //kvp[id] = obj;
                kvp.push(id);
            }
        }

    }
    return kvp;
}
function getObjectPair(pathName, objType) {
    var kvp = {};//key:id value:obj
    var id, obj;
    if (arguments.length == 1) {
        if (isArray(pathName)) {
            for (var item in pathName) {
                id = SGWorld.ProjectTree.FindItem(pathName[item]);
                if (id) {
                    obj = SGWorld.ProjectTree.GetObject(id);
                    kvp[id] = obj;
                }
            }
        }
        else if (isString(pathName)) {
            id = SGWorld.ProjectTree.FindItem(pathName);
            if (id) {
                obj = SGWorld.ProjectTree.GetObject(id);
                kvp[id] = obj;
            }

        }
    }
    else {
        if (isArray(pathName)) {
            for (var item in pathName) {
                id = SGWorld.ProjectTree.FindItem(pathName[item]);
                if (id && obj.ObjectType == objType) {
                    obj = SGWorld.ProjectTree.GetObject(id);
                    kvp[id] = obj;
                }
            }
        }
        else if (isString(pathName)) {
            id = SGWorld.ProjectTree.FindItem(pathName);
            if (id && obj.ObjectType == objType) {
                obj = SGWorld.ProjectTree.GetObject(id);
                kvp[id] = obj;
            }
        }

    }
    return kvp;
}
function getObjects(pathName, objType) {
    var obj, kvp = [];
    if (arguments.length == 1) {
        if (isArray(pathName)) {
            for (var item in pathName) {
                id = SGWorld.ProjectTree.FindItem(pathName[item]);
                if (id) {
                    obj = SGWorld.ProjectTree.GetObject(id);
                    //kvp[id] = obj;
                    kvp.push(obj);
                }
            }
        }
        else if (isString(pathName)) {
            id = SGWorld.ProjectTree.FindItem(pathName);
            if (id) {
                obj = SGWorld.ProjectTree.GetObject(id);
                //kvp[id] = obj;
                kvp.push(obj);
            }

        }
    }
    else {
        if (isArray(pathName)) {
            for (var item in pathName) {
                id = SGWorld.ProjectTree.FindItem(pathName[item]);
                if (id && obj.ObjectType == objType) {
                    obj = SGWorld.ProjectTree.GetObject(id);
                    //kvp[id] = obj;
                    kvp.push(obj);
                }
            }
        }
        else if (isString(pathName)) {
            id = SGWorld.ProjectTree.FindItem(pathName);
            if (id && obj.ObjectType == objType) {
                obj = SGWorld.ProjectTree.GetObject(id);
                // kvp[id] = obj;
                kvp.push(obj);
            }
        }

    }
    return kvp;
}
function rainEffect() {
    var range = 20;
    if (SGWorld.Command.IsChecked(2206, 1)) {
        SGWorld.Command.Execute(2206, 0);
        clearInterval(interval);
    }
    else {
        SGWorld.Command.Execute(2206, 1);
        if (range > 100) {
            range = 20;
        }
        var interval = setInterval(function () {
            range += 1;
            SGWorld.Command.Execute(2200, range);
        }, 100);
    }

}
function showTreePopup() {
    var screenRectHeight = SGWorld.Window.Rect.Height;
    displayPopups("Information Tree", toAbspath("tree.html"), "left", "top", 0, 342, screenRectHeight, -1, true, true, true, true);
}
function floatingTE() {
    if (frames["menuIframe"].isClicked) {
        frames["menuIframe"].focusElement();
        if ($("#TE").height() != $(window).height()) {
            $("#TE").css("height", $(window).height());
        }
        else {
            $("#TE").css("height", $(window).height() + 1);
        }
        frames["menuIframe"].focusElement();
        frames["menuIframe"].isClicked = false;
    }
}
function operateGroup(groupName, code) {
    //0--create 1--delete
    var group = SGWorld.ProjectTree.FindItem(groupName);
    if (group == "" && !code) {
        group = SGWorld.ProjectTree.CreateGroup(groupName, "");
        SGWorld.ProjectTree.SelectItem(group);
        return group;
    }
    else if (group != "" && code) {
        SGWorld.ProjectTree.DeleteItem(group);
    }
    else if (group != "" && !code) {
        return group;
    }
    else {
        //group == "" && code
        throw "未选择删除的对象";
    }
}
/*********************************************Query Start********************************************************************/
//var _3dpolygon;
//var isFirstLButtonDown = false;
//var featureID = [];
function query() {
    SGWorld.AttachEvent("OnLButtonDown", query_OnLButtonDown);
    SGWorld.AttachEvent("OnRButtonUp", query_OnRButtonUp);
}
//var _3dpolygon;
var featureID = [];
function query_OnLButtonDown(Flags, X, Y) {
    var cursorCoord = SGWorld.Window.PixelToWorld(X, Y, 8192);
    if (cursorCoord == null) {
        return false;
    }
    var group = operateGroup("query", 0);
    var pos = cursorCoord.Position.Altitude;
    var objid = cursorCoord.ObjectID;
    if (objid) {
        var obj = SGWorld.ProjectTree.GetObject(objid);//feature
        if (obj && obj.ObjectType == 33) {
            var featureValue = obj.FeatureAttributes.GetFeatureAttribute("DKBH").Value;//value
            if (featureID.length) {
                featureID.push(obj.ID);
                if (featureID.length > 2) {
                    featureID.splice(0, 1);
                }
                try {
                    var tem = SGWorld.Creator.GetObject(featureID[0]);
                    tem.Tint.SetAlpha(0);
                    obj.Tint.FromBGRColor(0x008000ff);
                    obj.Tint.SetAlpha(0.5);

                } catch (e) {
                }
            }
            else {//第一次点击
                featureID.push(obj.ID);
                obj.Tint.FromBGRColor(0x008000ff);
                obj.Tint.SetAlpha(0.5);
            }
            //右下方的设计
            //if (X>SGWorld.Window.Rect.Width-660*scale) {
            //    X = SGWorld.Window.Rect.Width - 660 * scale-30*scale;
            //}
            //if (Y > SGWorld.Window.Rect.Height - 455 * scale) {
            //    Y = SGWorld.Window.Rect.Height - 455 * scale -60*scale;
            //}
            //if (Y < 45) {
            //    Y= 45*scale;
            //}
            //左上方的设计
            X -= 660;
            Y -= 455;
            //if (X<0) {

            //}
            //if (Y<0) {

            //}
            displayPopups("查询结果", "http://city.rdpxa.com:8081/systemcenter/forms/dc/BP_FWYJ/FW_YJ_Info.html?TXBHS=" + featureValue,X, Y, -40,660,455, -1, true, true,true,true);
        }
    }
}
function query_OnRButtonUp(Flags, X, Y) {
    SGWorld.DetachEvent("OnRButtonUp", query_OnRButtonUp);
    if (featureID.length > 0) {
        try {
            for (var i = 0; i < featureID.length; i++) {
                var tem = SGWorld.Creator.GetObject(featureID[i]);
                tem.Tint.SetAlpha(0);
            }
        } catch (e) {

        }
        finally {
            featureID.length = 0;
        }
    }
    SGWorld.DetachEvent("OnLButtonDown", query_OnLButtonDown);
    operateGroup("query", 1);
    closePopup("查询结果");
}
/*********************************************Query End********************************************************************/
function toggleVisibility(name) {
    var o = getObjectPair(name);
    if (o) {
        for (var itemID in o) {
            var status = SGWorld.ProjectTree.GetVisibility(itemID);
            status ? SGWorld.ProjectTree.SetVisibility(itemID, false) : SGWorld.ProjectTree.SetVisibility(itemID, true);
        }
    }
}
function setVisibility(name, value) {
    var o = getObjectPair(name);
    if (o) {
        for (var itemID in o) {
            SGWorld.ProjectTree.SetVisibility(itemID, value);
        }
    }
}
function saveFly() {
    SGWorld.Project.Save();
}
function closeFly() {
    SGWorld.Project.Close(true);
}
/**************************************Profile Start***************************************************************/
var gPolyObj;
var gPolylineText = "polyline_";
var groupid;
var profileName;
function startProfile() {
    SGWorld.AttachEvent("OnLButtonDown", DrawPolylineLbuttonDown);
    SGWorld.AttachEvent("OnRButtonUp", DrawPolylineRButtonUp);
    SGWorld.AttachEvent("OnFrame", DrawPolylineOnFrame);
    SGWorld.Window.SetInputMode(1);
}
function DrawPolylineLbuttonDown(Flags, X, Y) {
    var cursorCoord = SGWorld.Window.PixelToWorld(X, Y);
    if (cursorCoord == null) {
        return false;
    }
    groupid = operateGroup("profile");
    if (gPolyObj == null) {
        var points = [cursorCoord.Position.X, cursorCoord.Position.Y, 0, cursorCoord.Position.X, cursorCoord.Position.Y, 0];
        //var arr = new VBArray(points).toArray();
        var geometry = SGWorld.Creator.GeometryCreator.CreateLineStringGeometry(points);
        gPolyObj = SGWorld.Creator.CreatePolyline(geometry, SGWorld.Creator.CreateColor(0, 255, 0, 1), 0, groupid, gPolylineText + new Date().getTime());
        gPolyObj.LineStyle.Width = -2;
        gPolyObj.Geometry.StartEdit();
    }
    else {
        gPolyObj.Geometry.Points.Item(gPolyObj.Geometry.Points.Count - 1).X = cursorCoord.Position.X;
        gPolyObj.Geometry.Points.Item(gPolyObj.Geometry.Points.Count - 1).Y = cursorCoord.Position.Y;
        gPolyObj.Geometry.Points.Item(gPolyObj.Geometry.Points.Count - 1).Z = 0;
        gPolyObj.Geometry.Points.AddPoint(cursorCoord.Position.X, cursorCoord.Position.Y, 0);
    }
}
function DrawPolylineRButtonUp(Flags, X, Y) {
    if (gPolyObj == null || (gPolyObj.ObjectType == 1 && gPolyObj.Geometry.Points.Count <= 2)) {
        return false;
    }
    if (gPolyObj.ObjectType == 1) { gPolyObj.Geometry.Points.DeletePoint(gPolyObj.Geometry.Points.Count - 1); }
    gPolyObj.Geometry.EndEdit();
    SGWorld.DetachEvent("OnLButtonDown", DrawPolylineLbuttonDown);
    SGWorld.DetachEvent("OnRButtonUp", DrawPolylineRButtonUp);
    SGWorld.DetachEvent("OnFrame", DrawPolylineOnFrame);
    //SGWorld.Window.SetInputMode(0);
    reset();
    gPolyObj = null;
    profileName = "剖面图" + Date().toLocaleString();
    //pop = displayPopups(profileName, "profile/TerrainProfilePopup.html?Type=0&ObjID=" + groupid + "&Density=1&Compare=0&Caption=" + profileName + "&lang=1033", "left", "top", 0, 200, 400);
    displayPopups(profileName, toAbspath("profile/TerrainProfilePopup.html?Type=0&ObjID=" + groupid + "&Density=1&Compare=0&Caption=" + profileName + "&lang=1033"), "left", "top", 0, 200, 300);
    return true;
}
function DrawPolylineOnFrame() {
    if (gPolyObj != null) {

        try {
            var mouseInfo = SGWorld.Window.GetMouseInfo()
            var CursorCoord = SGWorld.Window.pixelToWorld(mouseInfo.X, mouseInfo.Y, -1 & ~128);
            if (CursorCoord == null)
                return false;
            if (gPolyObj.ObjectType == 1) {
                gPolyObj.Geometry.Points.Item(gPolyObj.Geometry.Points.count - 1).X = CursorCoord.Position.x;
                gPolyObj.Geometry.Points.Item(gPolyObj.Geometry.Points.count - 1).Y = CursorCoord.Position.y;
                gPolyObj.Geometry.Points.Item(gPolyObj.Geometry.Points.count - 1).Z = CursorCoord.Position.Altitude;
            }
            // gPolyObj.SetParam(5440, 1);//?
        }
        catch (e) { }
    }
}
/************************************Profile End*****************************************************************/
/************************************Route Start*****************************************************/
var Positions = [];
//var Presentation = [];
function viewRoute_OnLButtonDown(Flags, X, Y) {
    var cursorCoord = SGWorld.Window.PixelToWorld(X, Y);
    if (cursorCoord == null) {
        return false;
    }
    //cursorCoord.Position.AltitudeType = 3;
    cursorCoord.Position.ChangeAltitudeType(3);
    Positions.push(cursorCoord.Position);
}
function viewRoute_OnRButtonUp(Flags, X, Y) {
    SGWorld.DetachEvent("OnLButtonDown", viewRoute_OnLButtonDown);
    SGWorld.DetachEvent("OnRButtonUp", viewRoute_OnRButtonUp);
    //SGWorld.DetachEvent("OnFrame", DrawPolylineOnFrame);
    viewRoute(Positions);
    reset();
    //SGWorld.Window.SetInputMode(0);
    Positions.length = 0;
    return true;
}
function viewRoute() {
    var pres = SGWorld.Creator.CreatePresentation();
    if (Positions.length) {
        var avg = Positions[0].Copy().Altitude + 20.0;
        for (var i = 0; i < Positions.length; i++) {
            var pos = Positions[i].Copy();
            pos.Altitude = avg;
            pres.CreateLocationStep(1, 0, "location", pos);
        }
    }
    pres.PlayAlgorithm = 1;
    pres.PlaySpeedFactor = 1;
    // var posPop = displayPopups("Route", "route.html", "center", "bottom", 30, 130, 100, false, false, false, 10);
    displayPopups("Route", toAbspath("route.html"), "center", "bottom", 35, 120, 100, 10, false, false, false, true);
    pres.Play(0);
}
function startViewRoute() {
    SGWorld.AttachEvent("OnLButtonDown", viewRoute_OnLButtonDown);
    SGWorld.AttachEvent("OnRButtonUp", viewRoute_OnRButtonUp);
}
/*************************************Route End*****************************************************/
function reset() {
    var inputMode = SGWorld.Window.GetInputMode();
    if (inputMode != 0)//?,0
        SGWorld.Window.SetInputMode(0);
}
/**************************************Query 3dPolygon  Start***********************************************************/
var _3dpolygon;
function queryOnlyBorder() {
    SGWorld.AttachEvent("OnLButtonDown", queryOnlyBorder_OnLButtonDown);
    SGWorld.AttachEvent("OnRButtonUp", queryOnlyBorder_OnRButtonUp);
}
var searchID = [];
function queryOnlyBorder_OnLButtonDown(Flags, X, Y) {
    var cursorCoord = SGWorld.Window.PixelToWorld(X, Y, 8192);
    if (cursorCoord == null) {
        return false;
    }
    var group = operateGroup("queryOnlyBorder", 0);
    var pos = cursorCoord.Position.Altitude;
    var objid = cursorCoord.ObjectID;
    var lineColor = SGWorld.Creator.CreateColor(0, 255, 0, 255);
    var fillColor = SGWorld.Creator.CreateColor(255, 0, 255, 0);
    if (objid) {
        var obj = SGWorld.ProjectTree.GetObject(objid);//feature
        if (obj && obj.ObjectType == 33) {
            var featureValue = obj.FeatureAttributes.GetFeatureAttribute("DKBH").Value;//value
            if (searchID.length) {
                searchID.push(obj.ID);
                if (searchID.length > 1) {
                    searchID.splice(0, 1);
                }
            }
            else {//第一次点击
                searchID.push(obj.ID);
                //_3dpolygon = SGWorld.Creator.Create3DPolygon(obj.Geometry, pos, lineColor, fillColor, 3, group, "_3dpolygon");
                //_3dpolygon.Position.Altitude -= 3.0;
               // _3dpolygon.LineStyle.Width = 10;
               // _3dpolygon.LineStyle.Color.SetAlpha(0.5);
               // _3dpolygon.FillStyle.Color.SetAlpha(0);
               // _3dpolygon.LineStyle.Color.FromBGRColor(0x008000ff);
            }
            try {
                //var tem = SGWorld.Creator.GetObject(searchID[0]);
                if (_3dpolygon) {
                    SGWorld.Creator.DeleteObject(_3dpolygon.ID);
                    _3dpolygon = null;
                }
                _3dpolygon = SGWorld.Creator.Create3DPolygon(obj.Geometry, pos, lineColor, fillColor, 3, group, "_3dpolygon");
                //_3dpolygon.Position.Altitude -= 3.0;
                _3dpolygon.LineStyle.Width = 10;

            } catch (e) {
            }
            //右下方的设计
            //if (X>SGWorld.Window.Rect.Width-660*scale) {
            //    X = SGWorld.Window.Rect.Width - 660 * scale-30*scale;
            //}
            //if (Y > SGWorld.Window.Rect.Height - 455 * scale) {
            //    Y = SGWorld.Window.Rect.Height - 455 * scale -60*scale;
            //}
            //if (Y < 45) {
            //    Y= 45*scale;
            //}
            //左上方的设计
            var containerWidth = 660;
            var containerHeight = 455;
            var border = -40;
            var _X = X - containerWidth ;//实际左上角坐标
            var _Y = Y - containerHeight ;
            if (_X<0&&_Y>0) {
                var pix_x = SGWorld.Window.PixelToWorld(containerWidth-2*border, Y);
                // SGWorld.Navigate.SetPosition(pix_x.Position);
                pix_x.Position.Distance = 100;
                pix_x.Position.Pitch = 45;
                SGWorld.Navigate.FlyTo(pix_x.Position);
                // X += 2 * 40;
                X = -border;
                Y = _Y;
            }
            else if (_X > 0 && _Y < 0) {
                var pix_y = SGWorld.Window.PixelToWorld(X, containerHeight - 2 * border);
                //SGWorld.Navigate.SetPosition(pix_y.Position);
                pix_y.Position.Distance = 100;
                pix_y.Position.Pitch = 45;
                SGWorld.Navigate.FlyTo(pix_y.Position);
                Y = -border;
                X = _X ;
            }
            else if (_X < 0 && _Y < 0) {
                //var pix_xy = SGWorld.Window.PixelToWorld(X -_X-border, Y -_Y-border*2);
                //var pix_xy = SGWorld.Window.PixelToWorld(X+containerWidth - 2 * border, Y+containerHeight - border * 2);
                var pix_xy = SGWorld.Window.PixelToWorld(containerWidth - 2 * border, containerHeight - 2 * border);
                // SGWorld.Navigate.SetPosition(pix_xy.Position);
                pix_xy.Position.Distance = 100;
                pix_xy.Position.Pitch = 45;
                SGWorld.Navigate.FlyTo(pix_xy.Position);
                X = -border;
                Y = -border;
            }
            else {
                X -= containerWidth;
                Y -= containerHeight;
            }
            displayPopups("查询结果", "http://city.rdpxa.com:8081/systemcenter/forms/dc/BP_FWYJ/FW_YJ_Info.html?TXBHS=" + featureValue, X, Y, border,containerWidth, containerHeight, -1, true, true, true, true);
        }
    }
}
function queryOnlyBorder_OnRButtonUp(Flags, X, Y) {
    SGWorld.DetachEvent("OnLButtonDown", queryOnlyBorder_OnLButtonDown);
    if (_3dpolygon) {
        SGWorld.Creator.DeleteObject(_3dpolygon.ID);
        _3dpolygon = null;
    }
    SGWorld.DetachEvent("OnRButtonUp", queryOnlyBorder_OnRButtonUp);
    operateGroup("queryOnlyBorder", 1);
    closePopup("查询结果");
}
/***************************************Query 3dPolygon  End**********************************************************/
