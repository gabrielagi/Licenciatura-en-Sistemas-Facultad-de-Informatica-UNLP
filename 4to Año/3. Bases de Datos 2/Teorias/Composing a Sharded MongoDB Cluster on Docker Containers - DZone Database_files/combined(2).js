angular.module('dndLists',[]).directive('dndDraggable',['$parse','$timeout','dndDropEffectWorkaround','dndDragTypeWorkaround',function($parse,$timeout,dndDropEffectWorkaround,dndDragTypeWorkaround){return function(scope,element,attr){element.attr("draggable","true");if(attr.dndDisableIf){scope.$watch(attr.dndDisableIf,function(disabled){element.attr("draggable",!disabled);});}
element.on('dragstart',function(event){event=event.originalEvent||event;event.dataTransfer.setData("Text",angular.toJson(scope.$eval(attr.dndDraggable)));event.dataTransfer.effectAllowed=attr.dndEffectAllowed||"move";element.addClass("dndDragging");$timeout(function(){element.addClass("dndDraggingSource");},0);dndDropEffectWorkaround.dropEffect="none";dndDragTypeWorkaround.isDragging=true;dndDragTypeWorkaround.dragType=attr.dndType?scope.$eval(attr.dndType):undefined;$parse(attr.dndDragstart)(scope,{event:event});event.stopPropagation();});element.on('dragend',function(event){event=event.originalEvent||event;var dropEffect=dndDropEffectWorkaround.dropEffect;scope.$apply(function(){switch(dropEffect){case"move":$parse(attr.dndMoved)(scope,{event:event});break;case"copy":$parse(attr.dndCopied)(scope,{event:event});break;}});element.removeClass("dndDragging");element.removeClass("dndDraggingSource");dndDragTypeWorkaround.isDragging=false;event.stopPropagation();});element.on('click',function(event){event=event.originalEvent||event;scope.$apply(function(){$parse(attr.dndSelected)(scope,{event:event});});event.stopPropagation();});element.on('selectstart',function(){if(this.dragDrop)this.dragDrop();return false;});};}]).directive('dndList',['$parse','$timeout','dndDropEffectWorkaround','dndDragTypeWorkaround',function($parse,$timeout,dndDropEffectWorkaround,dndDragTypeWorkaround){return function(scope,element,attr){var placeholder=angular.element("<li class='dndPlaceholder'></li>");var placeholderNode=placeholder[0];var listNode=element[0];var horizontal=attr.dndHorizontalList&&scope.$eval(attr.dndHorizontalList);var externalSources=attr.dndExternalSources&&scope.$eval(attr.dndExternalSources);element.on('dragover',function(event){event=event.originalEvent||event;if(!isDropAllowed(event))return true;if(placeholderNode.parentNode!=listNode){element.append(placeholder);}
if(event.target!==listNode){var listItemNode=event.target;while(listItemNode.parentNode!==listNode&&listItemNode.parentNode){listItemNode=listItemNode.parentNode;}
if(listItemNode.parentNode===listNode&&listItemNode!==placeholderNode){if(isMouseInFirstHalf(event,listItemNode)){listNode.insertBefore(placeholderNode,listItemNode);}else{listNode.insertBefore(placeholderNode,listItemNode.nextSibling);}}}else{if(isMouseInFirstHalf(event,placeholderNode,true)){while(placeholderNode.previousElementSibling&&(isMouseInFirstHalf(event,placeholderNode.previousElementSibling,true)||placeholderNode.previousElementSibling.offsetHeight===0)){listNode.insertBefore(placeholderNode,placeholderNode.previousElementSibling);}}else{while(placeholderNode.nextElementSibling&&!isMouseInFirstHalf(event,placeholderNode.nextElementSibling,true)){listNode.insertBefore(placeholderNode,placeholderNode.nextElementSibling.nextElementSibling);}}}
if(attr.dndDragover&&!invokeCallback(attr.dndDragover,event)){return stopDragover();}
element.addClass("dndDragover");event.preventDefault();event.stopPropagation();return false;});element.on('drop',function(event){event=event.originalEvent||event;if(!isDropAllowed(event))return true;event.preventDefault();var data=event.dataTransfer.getData("Text")||event.dataTransfer.getData("text/plain");var transferredObject;try{transferredObject=JSON.parse(data);}catch(e){return stopDragover();}
if(attr.dndDrop){transferredObject=invokeCallback(attr.dndDrop,event,transferredObject);if(!transferredObject){return stopDragover();}}
var targetArray=scope.$eval(attr.dndList);scope.$apply(function(){targetArray.splice(getPlaceholderIndex(),0,transferredObject);});if(event.dataTransfer.dropEffect==="none"){if(event.dataTransfer.effectAllowed==="copy"||event.dataTransfer.effectAllowed==="move"){dndDropEffectWorkaround.dropEffect=event.dataTransfer.effectAllowed;}else{dndDropEffectWorkaround.dropEffect=event.ctrlKey?"copy":"move";}}else{dndDropEffectWorkaround.dropEffect=event.dataTransfer.dropEffect;}
stopDragover();event.stopPropagation();return false;});element.on('dragleave',function(event){event=event.originalEvent||event;element.removeClass("dndDragover");$timeout(function(){if(!element.hasClass("dndDragover")){placeholder.remove();}},100);});function isMouseInFirstHalf(event,targetNode,relativeToParent){var mousePointer=horizontal?(event.offsetX||event.layerX):(event.offsetY||event.layerY);var targetSize=horizontal?targetNode.offsetWidth:targetNode.offsetHeight;var targetPosition=horizontal?targetNode.offsetLeft:targetNode.offsetTop;targetPosition=relativeToParent?targetPosition:0;return mousePointer<targetPosition+targetSize/2;}
function getPlaceholderIndex(){return Array.prototype.indexOf.call(listNode.children,placeholderNode);}
function isDropAllowed(event){if(!dndDragTypeWorkaround.isDragging&&!externalSources)return false;if(!hasTextMimetype(event.dataTransfer.types))return false;if(attr.dndAllowedTypes&&dndDragTypeWorkaround.isDragging){var allowed=scope.$eval(attr.dndAllowedTypes);if(angular.isArray(allowed)&&allowed.indexOf(dndDragTypeWorkaround.dragType)===-1){return false;}}
if(attr.dndDisableIf&&scope.$eval(attr.dndDisableIf))return false;return true;}
function stopDragover(){placeholder.remove();element.removeClass("dndDragover");return true;}
function invokeCallback(expression,event,item){return $parse(expression)(scope,{event:event,index:getPlaceholderIndex(),item:item||undefined,external:!dndDragTypeWorkaround.isDragging,type:dndDragTypeWorkaround.isDragging?dndDragTypeWorkaround.dragType:undefined});}
function hasTextMimetype(types){if(!types)return true;for(var i=0;i<types.length;i++){if(types[i]==="Text"||types[i]==="text/plain")return true;}
return false;}};}]).factory('dndDragTypeWorkaround',function(){return{}}).factory('dndDropEffectWorkaround',function(){return{}});!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e(jQuery)}(function(e){function i(){e(o).each(function(){e(this).flexMenu({undo:!0}).flexMenu(this.options)})}function n(i){var n,l;n=e("li.flexMenu-viewMore.active"),l=n.not(i),l.removeClass("active").find("> ul").hide()}var l,o=[];e(window).resize(function(){clearTimeout(l),l=setTimeout(function(){i()},200)}),e.fn.flexMenu=function(i){var l,t=e.extend({threshold:2,cutoff:2,linkText:"More <i class='icon-angle-down'></i>",linkTitle:"View More",linkTextAll:"Menu",linkTitleAll:"Open/Close Menu",showOnHover:!0,popupAbsolute:!0,undo:!1},i);return this.options=t,l=e.inArray(this,o),l>=0?o.splice(l,1):o.push(this),this.each(function(){function i(e){var i=Math.ceil(e.offset().top)>=v+x?!0:!1;return i}var l,o,f,u,r,s,a,d=e(this),p=d.find("> li"),c=p.first(),h=p.last(),M=d.find("li").length,v=Math.floor(c.offset().top),x=Math.floor(c.outerHeight(!0)),T=!1;if(i(h)&&M>t.threshold&&!t.undo&&d.is(":visible")){{var w=e('<ul class="flexMenu-popup dropdown-menu" style="display:none;'+(t.popupAbsolute?" position: absolute;":"")+'"></ul>');c.offset().top}for(a=M;a>1;a--){if(l=d.find("> li:last-child"),o=i(l),l.appendTo(w),a-1<=t.cutoff){e(d.children().get().reverse()).appendTo(w),T=!0;break}if(!o)break}d.append(T?'<li class="flexMenu-viewMore flexMenu-allInPopup"><a href="#" title="'+t.linkTitleAll+'">'+t.linkTextAll+"</a></li>":'<li class="flexMenu-viewMore"><a href="#" title="'+t.linkTitle+'">'+t.linkText+"</a></li>"),f=d.find("> li.flexMenu-viewMore"),i(f)&&d.find("> li:nth-last-child(2)").appendTo(w),w.children().each(function(e,i){w.prepend(i)}),f.append(w),u=d.find("> li.flexMenu-viewMore > a"),u.click(function(e){n(f),w.toggle(),f.toggleClass("active"),e.preventDefault()}),t.showOnHover&&"undefined"!=typeof Modernizr&&!Modernizr.touch&&f.hover(function(){w.show(),e(this).addClass("active")},function(){w.hide(),e(this).removeClass("active")})}else if(t.undo&&d.find("ul.flexMenu-popup")){for(s=d.find("ul.flexMenu-popup"),r=s.find("li").length,a=1;r>=a;a++)s.find("> li:first-child").appendTo(d);s.remove(),d.find("> li.flexMenu-viewMore").remove()}})}});TH.factory('ArticleAdsService',function(TH$Request){return function(edition,width){function makeTags(article,level,noPartner){var tags=[];if(article.portal){tags.push(article.portal.code);}
if(article.partner&&article.partner.isSponsoringArticle&&article.partner.details.partnerLevel==3){tags.push(article.partner.details.code);tags=['content-'+tags.join('-')];}else if(article.partner&&article.partner.isSponsoringArticle){tags.push(article.partner.details.code);tags=['platinum-'+tags.join('-')];}
return tags;}
var ads={};ads.top=(edition)?{}:{show:function(){return true;},tags:function(article){if(article.partner&&article.partner.isSponsoringArticle){return makeTags(article,'platinum');}else{return makeTags(article,null,null);}},slot:function(){if(width>768){return'/2916070/dz2_article_billboard_new';}else{return'/2916070/dz2_mobile_leaderboard';}},size:function(){if(width>1024){return[[728,90],[970,250]];}else if(width<768){return[320,50];}else{return[728,90];}}};ads.sl1={slot:function(){return'/2916070/dz2_sponsor_logo';},size:function(){return[[100,100],[300,100]];},tags:function(article,index){if((article.partner&&article.partner.isSponsoringArticle)){return makeTags(article,'platinum');}else{return makeTags(article,null,true);}}};ads.sl2={slot:function(){return'/2916070/dz2_sponsor_logo';},size:function(){return[[100,100],[300,100]];},tags:function(article){return makeTags(article,null,true);}};ads.bt1={slot:function(){return'/2916070/dz2_bumper_text_ad';},size:function(){return'fluid';},tags:function(article,index){if((article.partner&&article.partner.isSponsoringArticle)){return makeTags(article,'platinum');}else if(index==1){return makeTags(article,'gold',true);}else{return makeTags(article,null,true);}}};ads.bt2={slot:function(){return'/2916070/dz2_bumper_text_ad';},size:function(){return'fluid';},tags:function(article,index){if((article.partner&&article.partner.isSponsoringArticle)){return makeTags(article,'platinum');}else{return makeTags(article,null,true);}}};ads.sb1={tags:function(article,index){if((article.partner&&article.partner.isSponsoringArticle)){return makeTags(article,'platinum');}else{return makeTags(article,null,true);}},slot:function(article,index){if(index==0||index==1||(article.partner&&article.partner.isSponsoringArticle)){return'/2916070/dz2_article_halfpage_new';}else if(index==2){return'2916070/dz2_article_medrect_1';}else{return'/2916070/dz2_article_medrect_house';}},size:function(article,index){if(index==0||index==1||(article.partner&&article.partner.isSponsoringArticle)){return[[300,250],[300,600]];}else{return[300,250];}}};ads.sb2={tags:function(article,index){return makeTags(article,null,true);},slot:_.constant('/2916070/dz2_article_medrect_house'),size:_.constant([300,250])};ads.secondArea={show:function(){return width>=768;},tags:function(article){return makeTags(article,'gold',true);},slot:_.constant('/2916070/dz2_article_billboard_2'),size:function(){if(width>1024){return[970,250];}else if(width<768){return[320,50];}else{return[728,90];}}};return ads;}});TH.directive('articleType',function(DZArticleType){return{scope:{type:'='},template:'<span>{{articleTypeLabel}}</span>',link:function($scope){var articleTypes=DZArticleType.get();var articleTypeLabel=function(name){var type=_.findWhere(articleTypes,{name:name});return type?type.label:"Not set";};$scope.articleTypeLabel=articleTypeLabel($scope.type);}}});TH.directive('widgetComponentsSlider',function(SliderService){return{link:function($scope,$element){var slider=SliderService.register($scope,$element);$scope.close=slider.close;}}});TH.directive('sliderToggle',function(SliderService,$location){return{restrict:'A',scope:{slider:'@sliderToggle',data:'=sliderData',activateParams:'&activateWithUrlParams'},link:function($scope,$element){$element.on('click',function(){SliderService.open($scope.slider,$scope.data);});if($scope.activateParams()){var match=true;_.each($scope.activateParams(),function(v,k){match=match&&($location.search()[k]==v);});if(match){SliderService.open($scope.slider,$scope.data);}}}}});TH.factory('SliderService',function(TH$Util,$compile){var sliders={};function Slider($scope,$element){this.open=function(data){TH$Util.apply($scope,function(){$scope._ready=true;$('body').css('overflow','hidden');$scope._sliderOpen=true;if(data){_.forEach(data,function(v,k){$scope[k]=v;});}
TH.broadcast('TextAreaFocus');});};this.close=function(){$scope._sliderOpen=false;$('body').css('overflow','auto');};}
return{register:function($scope,$element){var slider=new Slider($scope,$element);sliders[$scope.name]=slider;return slider;},open:function(name,data){if(sliders[name]){sliders[name].open(data);}},close:function(name){if(sliders[name]){sliders[name].close();}}};});TH.factory('HeaderScrollService',function($interval,TH$Util){var $header;var $scope;var $trigger;var $blackBarScope;var infoBarService;var minScroll,maxOffset,offsetFifth,maxScroll,initialPosition,initialSize,minSize,sizeDiff,scrollToSizeFactor,scrollToPosFactor,fadeFactor,initialLogoPadding,imageSize=0,affixElements=[];var initialized=false;function sizeAsInt(size){return parseInt(/\d+/.exec(size)[0]);}
function calc(){if(!$header){return;}
if(!$trigger){maxOffset=330;}else{var tPos=$trigger.offset();maxOffset=tPos.top-minSize;}
offsetFifth=maxOffset/5;maxScroll=maxOffset+minScroll;scrollToSizeFactor=sizeDiff/maxOffset;scrollToPosFactor=initialPosition/maxOffset;fadeFactor=1/(maxScroll-2*offsetFifth);if(!initialized){init();initialized=true;}}
function init(){applyWidth();if(initialized||!$header){return;}
$scope.following=function(value,event){$(event.target).html(value);};$scope.setSearchStatus=function(val){if(infoBarService)infoBarService.setStatus(val);}
minScroll=0;initialLogoPadding=20;initialPosition=$header.position().top;initialSize=sizeAsInt($header.css('height'));minSize=sizeAsInt($header.css('min-height'));sizeDiff=initialSize-minSize;applyBlackBarPad(115,$scope.width);function applyWidth(){$scope.width=Math.max(document.documentElement.clientWidth,window.innerWidth||0);$(window).resize(function(){$scope.$apply(function(){$scope.width=Math.max(document.documentElement.clientWidth,window.innerWidth||0);});});}
function applySize(size){$header.css('height',size+'px');$scope.headerSize=size;$scope.trigger=($trigger)?true:false;$scope.linkPadding=size/2-8;TH.broadcast('HeaderSizeChanged',initialSize-size);}
var lastScrolled;function applyImageStyle(scrolled,size,margin){margin=($trigger)?margin:0;var defPadding=8;var dim=(size+initialPosition+margin+2);if(dim<88){dim=86;}
var padding=(defPadding*dim/(initialSize+50));$scope.logoStyle={width:dim+2+'px',height:dim+'px',padding:(padding*(4/defPadding))+'px '+(padding*(1/defPadding))+'px '+(padding*(4/defPadding))+'px '+padding+'px'};var gap=(!$trigger||scrolled==0)?17:11;if($scope.width<768){gap-=9;}
$scope.leftMargin=(dim+gap)+'px';if($blackBarScope){$blackBarScope.dim=dim+23;applyBlackBarPad($blackBarScope.dim,$scope.width);}
imageSize=dim;}
function applyBlackBarPad(dim,width){}
function applyMargin(margin){if($trigger)$header.css('margin-top',margin+'px');if($trigger){$header.css('margin-top',margin+'px');$scope.showHamburguer=margin<=-initialPosition;}}
function applyFade(fade){if(!$scope.applyFades){fade=1;}
TH$Util.apply($scope,function(){$scope.startStyle={'z-index':fade>=0.5?3:2};$scope.cNavStyle={display:fade<0.5?'block':'none','z-index':fade<0.5?1:2};});}
$scope.headerSize=initialSize;var lastScroll=0;function checkScroll(resize){var scrolled=$(window).scrollTop();if(scrolled==lastScroll&&!resize){return;}
$scope.closeAdditional=scrolled>lastScroll;calc();lastScroll=scrolled;if(scrolled<minScroll){applySize(initialSize);applyMargin(0);applyFade(1);applyImageStyle(scrolled,initialSize,0);}else if(scrolled>maxScroll){applySize(minSize);applyMargin(-initialPosition);applyFade(0);applyImageStyle(scrolled,minSize,-initialPosition);}else{var size=minSize+((maxOffset-scrolled+minScroll)*scrollToSizeFactor);var margin;if(scrolled<(minScroll+initialPosition)){margin=-scrolled+minScroll;}else{margin=-initialPosition;}
applySize(size);applyMargin(margin);applyImageStyle(scrolled,size,margin);if((scrolled-minScroll)<offsetFifth){applyFade(1);}
else{applyFade(1);}}
_.each(affixElements,function(check){check(resize);});}
$(window).scroll(function(){checkScroll(false);});$(window).resize(function(){checkScroll(true);});$interval(function(){checkScroll(false);},100,0,false);applyFade(1);initialized=true;}
function calculateOffsetDiff($el,type){var ret=0;var padding=$el.css('padding-'+type);if(padding){padding=parseInt(padding.replace('px',''));if(padding){ret+=padding;}}
var border=$el.css('border-'+type+'-width');if(border){border=parseInt(border.replace('px',''));if(border){ret+=border;}}
return ret;}
var service={setInfoBar:function(_infoBarService){infoBarService=_infoBarService},setHeader:function($el,$sc){$header=$el;$scope=$sc;init();},setTrigger:function($el,$scope){$trigger=$el;init();},setBlackBarScope:function($scope){$blackBarScope=$scope;},getHeight:function(){return imageSize;},addAffix:function($scope,$element,ref){if(!ref){ref='parent';}
var refIsParent=ref=='parent';var css={};var status;var marginAt;function applyStatus(newStatus,windowScroll,minTop,contentHeight,elHeight){switch(newStatus){case'relative':css={position:'relative',top:'',left:'',width:'','margin-top':''};break;case'fixed':css={position:'fixed',top:minTop+'px',left:$element.offset().left,width:$element.width()+'px','margin-top':''};break;case'margin':marginAt=windowScroll;var marginTop=contentHeight-elHeight;css={position:'relative',top:'',left:'',width:'','margin-top':marginTop+'px'};break;}
$element.css(css);}
function checkPosition(resize){var windowScroll=$(window).scrollTop();if(status=='margin'&&windowScroll>(marginAt+500)){return;}
var $content;if(refIsParent){$content=$element.parent();}else{$content=$element.parent().find(ref);}
var contentHeight=$content.height();var elHeight=$element.height();if(contentHeight<elHeight-10){return;}
var minTop=service.getHeight()+10;var contentTop=$content.offset().top;if(refIsParent){var padTop=calculateOffsetDiff($content,'top');var padBottom=calculateOffsetDiff($content,'bottom');contentTop+=padTop;contentHeight-=(padTop+padBottom);}
var newStatus;var reapply=false;if(resize&&status=='fixed'){newStatus='relative';reapply=true;}else{if(contentTop-windowScroll<minTop){newStatus='fixed';}else{newStatus='relative';}
if(windowScroll+minTop+elHeight>=contentTop+contentHeight){newStatus='margin';}}
if(newStatus!=status){applyStatus(newStatus,windowScroll,minTop,contentHeight,elHeight);if(reapply){newStatus='fixed';applyStatus(newStatus,windowScroll,minTop,contentHeight,elHeight);}}
status=newStatus;}
affixElements.push(checkPosition);if($scope){$scope.$on('$destroy',function(){affixElements=_.without(affixElements,checkPosition);});}}};return service;});TH.directive('widgetHeaderHeaderV2',function(HeaderScrollService,$timeout,$rootScope,$location){return{restrict:'A',link:function($scope,$element){HeaderScrollService.setHeader($element,$scope);$rootScope.model.portal=$rootScope.model.portal||_.findWhere($rootScope.portals,{shortTitle:$location.search().portal});var lastOut=0;var isHover=false;$scope.hover={active:false,dropdown:false,portal:null};$scope.hover.active=false;$scope.hoverPortal=function(portal){var wait=lastOut>(new Date().getTime()-500)?0:500;$scope.hover.portal=portal;isHover=true;$timeout(function(){if((isHover||$scope.hover.dropdown)&&(!$scope.hover.portal||$scope.hover.portal==portal)){$scope.hover.active=true;}},wait);};$scope.outOfPortal=function(){lastOut=new Date().getTime();isHover=false;$timeout(function(){if(!isHover){$scope.hover.active=false;}},100);};$scope.isActivePortal=function(portalId){return(($scope.hover.active||$scope.hover.dropdown)&&($scope.hover.portal&&$scope.hover.portal==portalId))||($rootScope.model.portal&&$rootScope.model.portal.id==portalId);};}}});TH.directive('widgetHeaderBlackBar',function(HeaderScrollService){return{restrict:'A',link:function($scope,$element){HeaderScrollService.setBlackBarScope($scope);}}});TH.directive('headerChangeTrigger',function(HeaderScrollService){return{restrict:'A',link:function($scope,$element){HeaderScrollService.setTrigger($element,$scope);}}});TH.directive('headerAffixElement',function(HeaderScrollService){return{restrict:'A',scope:{ref:'@headerAffixElement'},link:function($scope,$element){HeaderScrollService.addAffix($scope,$element,$scope.ref);}}});TH.factory('SideBarService',function(TH$Util,TH$Request,$location,TapBarService,$rootScope){var adId=0;return TH$Util.serviceBuilder().props({list:[],active:{value:null,listen:function(node){this.ctx.active=node;TapBarService.show(node);}},loaded:0,exclude:[],blocked:true}).props('ctx',{pageSize:20,active:null,loading:false,hasMore:true,isPreview:false,mode:null,filter:{value:null,listen:function(){this.props(null);if(this.ctx.active){this.list=[this.ctx.active];}
this.load();}},edition:{value:null,listen:function(){this.resetCtx();this.unblock();}},portal:{value:null,listen:function(){this.resetCtx();}},type:{value:'article',listen:function(){this.resetCtx();}},search:{value:'',listen:function(){this.resetCtx();}},loaded:0}).props('fn',{loader:_.unfulfilled,scrollCheck:_.noop,onSelected:null}).methods({resetCtx:function(){this.props(null);this.list=[];this.ctx.hasMore=true;this.load();},unblock:function(){this.blocked=false;TH.broadcast('thIfScrollCheck');},load:function(){if(this.blocked||!this.ctx.hasMore||this.ctx.loading||this.ctx.isPreview||$rootScope.botInfo.isRenderBot||this.fn.loader==_.unfulfilled){return;}
this.ctx.loaded++;this.ctx.loading=true;var data;if(this.ctx.edition){data={edition:this.ctx.edition}}else{data={'filter':this.ctx.filter,'mode':this.ctx.mode};if(this.ctx.portal){data.portal=this.ctx.portal.id;}else if(TH$Request.model.portal){data.portal=TH$Request.model.portal.id;}
if(this.ctx.type){data.ctype=this.ctx.type;}
if(this.ctx.search){data.searchTerm=this.ctx.search;}
var last=_.findLast(this.list,function(n){return n.id>0});if(last){data.from=last.id;}
data.page=Math.round(this.list.length/this.ctx.pageSize)+1;}
var self=this;this.fn.loader(data).then(function(data){if(self.ctx.edition){self.list=data.nodes;self.ctx.hasMore=false;self.ctx.loading=false;}else{var startLen=self.list.length;_.each(data.nodes,function(node,i){if(!_.findWhere(self.list,{id:node.id})){self.list.push(node);var ad=self.getAd(i+startLen);if(ad){self.list.push(ad);}}});self.ctx.hasMore=data.nodes.length>=self.ctx.pageSize;self.ctx.loading=false;self.fn.scrollCheck();}});},find:function(fromId,up){if(this.blocked){this.unblock();return;}
var foundCurrent=false;var id=null;var edition=this.ctx.edition;_.each(up?_.reverse(this.list):this.list,function(node){if(node.type!='article'&&!edition){return;}
if(id){return;}else if(foundCurrent){id=node.id;}else if(!foundCurrent&&fromId==node.id){foundCurrent=true;}});return id;},findNext:function(fromId){return this.find(fromId,false);},findPrevious:function(fromId){return this.find(fromId,true);},getAd:function(i){return null;},isActive:function(node){return this.ctx.active&&this.ctx.active.id==node.id;},isExcluded:function(id){return _.indexOf(this.exclude,id)>=0;},clicked:function(node){if(this.fn.onSelected){this.fn.onSelected(node);}else{$location.path(node.url);}}}).build();});TH.directive('sidebarClick',function(SideBarService,TH$Util){return{restrict:'A',scope:{'sidebarClick':'='},link:function(scope,element,attrs){var fn=_.fix(SideBarService.clicked,scope.sidebarClick);element.bind('click',function(){TH$Util.apply(scope,fn);return false;});}}});TH.directive('widgetSidebarTapBar',function(TH$LocalStorage,$timeout){return{restrict:'A',link:function($scope,$element){function getPosition(){var $header=$('.mainHeader');var $stickyBar=$('.container-fluid.containerSticky');return $header.offset().top-$(window).scrollTop()+$header.height()+
($stickyBar.is(':visible')?$stickyBar.height():0);}
function getPadding(position){var $logo=$('div.logo');var logoLeft=$logo.offset().left;if(logoLeft>$element.width()-30){return 0;}else{return $logo.height()-position;}}
function checkPosition(){applyPosition();window.setTimeout(applyPosition,250);}
function applyPosition(){var position=getPosition()+1;$element.css({top:position+'px','padding-top':getPadding(position)+'px'});}
$element.mouseenter(function(){if(!$scope.edition&&$element.is('.expanded')){$('body').css('overflow','hidden');}});$element.mouseleave(function(){if(!$scope.edition){$('body').css('overflow','');}});$scope.tap=function(){if(!($scope.edition&&$scope.width>1024)){$element.toggleClass('expanded');}
TH$LocalStorage.preference('tapBar.expanded',$element.is('.expanded'));if($scope.edition&&!$element.is('.expanded')){$element.addClass('tapNotExpanded');}else{$element.removeClass('tapNotExpanded');}
TH.broadcast('TapBarStatusChange',$element.is('.expanded'));if(!$scope.edition){($element.is('.expanded'))?$('body').css('overflow','hidden'):$('body').css('overflow','');}};if($scope.edition){$element.css({'border-right-width':'0'});if($scope.width>576)$element.addClass('expanded');$timeout(function(){if($scope.width>1024)$('.tap').hide();},10)}
TH.on('HeaderSizeChanged',checkPosition);checkPosition();}}});TH.directive('sidebarList',function($window,$timeout){var $w=$($window);return{restrict:'A',controller:function($scope,$element,$attrs){var ctrl=this;var items=[];var positions=null;var lastCalcSize;function getPositions(){if(positions){return positions;}
positions=_.reduce(items,function(map,item){map[item.id]=item.top();return map;},{});var min=_.min(positions);if(min<0){_.map(positions,function(p){return p-min;});}
return positions;}
ctrl.addItem=function(item){items.push(item);positions=null;};ctrl.position=function(item){return getPositions()[item.id];};ctrl.scrollTo=function(pos){$element.animate({scrollTop:pos},500);};ctrl.size=function(){return $element.height();};ctrl.scrollTop=function(){return $element.scrollTop();};}}});TH.directive('sidebarItem',function(TapBarService){return{restrict:'A',require:'^sidebarList',scope:{'item':'=sidebarItem'},link:function(scope,element,attrs,sidebarList){var item=scope.item;var handler={id:item.id};handler.moveTo=function(){sidebarList.scrollTo(handler.top());};handler.top=function(){return Math.round(element.position().top);};handler.visible=function(){var pos=sidebarList.position(handler);var sbSize=sidebarList.size();var sbTop=sidebarList.scrollTop();function check(y){return y>sbTop&&y<(sbTop+sbSize);}
return check(pos)&&check(pos+element.height());};handler.show=function(){var pos=sidebarList.position(handler);var sbSize=sidebarList.size();var sbTop=sidebarList.scrollTop();if(pos<sbTop){sidebarList.scrollTo(pos);}else if(pos+element.height()>sbTop+sbSize){sidebarList.scrollTo((pos-sbSize)+element.height());}};TapBarService.dom.elements[item.id]=handler;sidebarList.addItem(handler);}}});TH.factory('TapBarService',function(TH$Util){return TH$Util.serviceBuilder().props('dom',{elements:{}}).methods({show:function(node){if(this.dom.elements[node.id]&&!this.dom.elements[node.id].visible()){this.dom.elements[node.id].show();}}}).build();});