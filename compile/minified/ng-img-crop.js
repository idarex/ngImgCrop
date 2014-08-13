/*! ngImgCrop v0.2.0 License: MIT */!function(){"use strict";var e=angular.module("ngImgCrop",[]);e.factory("cropAreaCircle",["cropArea",function(e){var t=function(){e.apply(this,arguments),this._boxResizeBaseSize=20,this._boxResizeNormalRatio=.9,this._boxResizeHoverRatio=1.2,this._iconMoveNormalRatio=.9,this._iconMoveHoverRatio=1.2,this._boxResizeNormalSize=this._boxResizeBaseSize*this._boxResizeNormalRatio,this._boxResizeHoverSize=this._boxResizeBaseSize*this._boxResizeHoverRatio,this._posDragStartX=0,this._posDragStartY=0,this._posResizeStartX=0,this._posResizeStartY=0,this._posResizeStartSize=0,this._boxResizeIsHover=!1,this._areaIsHover=!1,this._boxResizeIsDragging=!1,this._areaIsDragging=!1};return t.prototype=new e,t.prototype._calcCirclePerimeterCoords=function(e){var t=this._size/2,i=e*(Math.PI/180),s=this._x+t*Math.cos(i),r=this._y+t*Math.sin(i);return[s,r]},t.prototype._calcResizeIconCenterCoords=function(){return this._calcCirclePerimeterCoords(-45)},t.prototype._isCoordWithinArea=function(e){return Math.sqrt((e[0]-this._x)*(e[0]-this._x)+(e[1]-this._y)*(e[1]-this._y))<this._size/2},t.prototype._isCoordWithinBoxResize=function(e){var t=this._calcResizeIconCenterCoords(),i=this._boxResizeHoverSize/2;return e[0]>t[0]-i&&e[0]<t[0]+i&&e[1]>t[1]-i&&e[1]<t[1]+i},t.prototype._drawArea=function(e,t,i){e.arc(t[0],t[1],i/2,0,2*Math.PI)},t.prototype.draw=function(){e.prototype.draw.apply(this,arguments),this._cropCanvas.drawIconMove([this._x,this._y],this._areaIsHover?this._iconMoveHoverRatio:this._iconMoveNormalRatio),this._cropCanvas.drawIconResizeBoxNESW(this._calcResizeIconCenterCoords(),this._boxResizeBaseSize,this._boxResizeIsHover?this._boxResizeHoverRatio:this._boxResizeNormalRatio)},t.prototype.processMouseMove=function(e,t){var i="default",s=!1;if(this._boxResizeIsHover=!1,this._areaIsHover=!1,this._areaIsDragging)this._x=e-this._posDragStartX,this._y=t-this._posDragStartY,this._areaIsHover=!0,i="move",s=!0,this._events.trigger("area-move");else if(this._boxResizeIsDragging){i="nesw-resize";var r,o,a;o=e-this._posResizeStartX,a=this._posResizeStartY-t,r=o>a?this._posResizeStartSize+2*a:this._posResizeStartSize+2*o,this._size=Math.max(this._minSize,r),this._boxResizeIsHover=!0,s=!0,this._events.trigger("area-resize")}else this._isCoordWithinBoxResize([e,t])?(i="nesw-resize",this._areaIsHover=!1,this._boxResizeIsHover=!0,s=!0):this._isCoordWithinArea([e,t])&&(i="move",this._areaIsHover=!0,s=!0);return this._dontDragOutside(),angular.element(this._ctx.canvas).css({cursor:i}),s},t.prototype.processMouseDown=function(e,t){this._isCoordWithinBoxResize([e,t])?(this._areaIsDragging=!1,this._areaIsHover=!1,this._boxResizeIsDragging=!0,this._boxResizeIsHover=!0,this._posResizeStartX=e,this._posResizeStartY=t,this._posResizeStartSize=this._size,this._events.trigger("area-resize-start")):this._isCoordWithinArea([e,t])&&(this._areaIsDragging=!0,this._areaIsHover=!0,this._boxResizeIsDragging=!1,this._boxResizeIsHover=!1,this._posDragStartX=e-this._x,this._posDragStartY=t-this._y,this._events.trigger("area-move-start"))},t.prototype.processMouseUp=function(){this._areaIsDragging&&(this._areaIsDragging=!1,this._events.trigger("area-move-end")),this._boxResizeIsDragging&&(this._boxResizeIsDragging=!1,this._events.trigger("area-resize-end")),this._areaIsHover=!1,this._boxResizeIsHover=!1,this._posDragStartX=0,this._posDragStartY=0},t}]),e.factory("cropAreaSquare",["cropArea",function(e){var t=function(){e.apply(this,arguments),this._resizeCtrlBaseRadius=10,this._resizeCtrlNormalRatio=.75,this._resizeCtrlHoverRatio=1,this._iconMoveNormalRatio=.9,this._iconMoveHoverRatio=1.2,this._resizeCtrlNormalRadius=this._resizeCtrlBaseRadius*this._resizeCtrlNormalRatio,this._resizeCtrlHoverRadius=this._resizeCtrlBaseRadius*this._resizeCtrlHoverRatio,this._posDragStartX=0,this._posDragStartY=0,this._posResizeStartX=0,this._posResizeStartY=0,this._posResizeStartSize=0,this._resizeCtrlIsHover=-1,this._areaIsHover=!1,this._resizeCtrlIsDragging=-1,this._areaIsDragging=!1};return t.prototype=new e,t.prototype._calcSquareCorners=function(){var e=this._size/2;return[[this._x-e,this._y-e],[this._x+e,this._y-e],[this._x-e,this._y+e],[this._x+e,this._y+e]]},t.prototype._calcSquareDimensions=function(){var e=this._size/2;return{left:this._x-e,top:this._y-e,right:this._x+e,bottom:this._y+e}},t.prototype._isCoordWithinArea=function(e){var t=this._calcSquareDimensions();return e[0]>=t.left&&e[0]<=t.right&&e[1]>=t.top&&e[1]<=t.bottom},t.prototype._isCoordWithinResizeCtrl=function(e){for(var t=this._calcSquareCorners(),i=-1,s=0,r=t.length;r>s;s++){var o=t[s];if(e[0]>o[0]-this._resizeCtrlHoverRadius&&e[0]<o[0]+this._resizeCtrlHoverRadius&&e[1]>o[1]-this._resizeCtrlHoverRadius&&e[1]<o[1]+this._resizeCtrlHoverRadius){i=s;break}}return i},t.prototype._drawArea=function(e,t,i){var s=i/2;e.rect(t[0]-s,t[1]-s,i,i)},t.prototype.draw=function(){e.prototype.draw.apply(this,arguments),this._cropCanvas.drawIconMove([this._x,this._y],this._areaIsHover?this._iconMoveHoverRatio:this._iconMoveNormalRatio);for(var t=this._calcSquareCorners(),i=0,s=t.length;s>i;i++){var r=t[i];this._cropCanvas.drawIconResizeCircle(r,this._resizeCtrlBaseRadius,this._resizeCtrlIsHover===i?this._resizeCtrlHoverRatio:this._resizeCtrlNormalRatio)}},t.prototype.processMouseMove=function(e,t){var i="default",s=!1;if(this._resizeCtrlIsHover=-1,this._areaIsHover=!1,this._areaIsDragging)this._x=e-this._posDragStartX,this._y=t-this._posDragStartY,this._areaIsHover=!0,i="move",s=!0,this._events.trigger("area-move");else if(this._resizeCtrlIsDragging>-1){var r,o;switch(this._resizeCtrlIsDragging){case 0:r=-1,o=-1,i="nwse-resize";break;case 1:r=1,o=-1,i="nesw-resize";break;case 2:r=-1,o=1,i="nesw-resize";break;case 3:r=1,o=1,i="nwse-resize"}var a,n=(e-this._posResizeStartX)*r,h=(t-this._posResizeStartY)*o;a=n>h?this._posResizeStartSize+h:this._posResizeStartSize+n;var c=this._size;this._size=Math.max(this._minSize,a);var _=(this._size-c)/2;this._x+=_*r,this._y+=_*o,this._resizeCtrlIsHover=this._resizeCtrlIsDragging,s=!0,this._events.trigger("area-resize")}else{var g=this._isCoordWithinResizeCtrl([e,t]);if(g>-1){switch(g){case 0:i="nwse-resize";break;case 1:i="nesw-resize";break;case 2:i="nesw-resize";break;case 3:i="nwse-resize"}this._areaIsHover=!1,this._resizeCtrlIsHover=g,s=!0}else this._isCoordWithinArea([e,t])&&(i="move",this._areaIsHover=!0,s=!0)}return this._dontDragOutside(),angular.element(this._ctx.canvas).css({cursor:i}),s},t.prototype.processMouseDown=function(e,t){var i=this._isCoordWithinResizeCtrl([e,t]);i>-1?(this._areaIsDragging=!1,this._areaIsHover=!1,this._resizeCtrlIsDragging=i,this._resizeCtrlIsHover=i,this._posResizeStartX=e,this._posResizeStartY=t,this._posResizeStartSize=this._size,this._events.trigger("area-resize-start")):this._isCoordWithinArea([e,t])&&(this._areaIsDragging=!0,this._areaIsHover=!0,this._resizeCtrlIsDragging=-1,this._resizeCtrlIsHover=-1,this._posDragStartX=e-this._x,this._posDragStartY=t-this._y,this._events.trigger("area-move-start"))},t.prototype.processMouseUp=function(){this._areaIsDragging&&(this._areaIsDragging=!1,this._events.trigger("area-move-end")),this._resizeCtrlIsDragging>-1&&(this._resizeCtrlIsDragging=-1,this._events.trigger("area-resize-end")),this._areaIsHover=!1,this._resizeCtrlIsHover=-1,this._posDragStartX=0,this._posDragStartY=0},t}]),e.factory("cropArea",["cropCanvas",function(e){var t=function(t,i){this._ctx=t,this._events=i,this._minSize=80,this._cropCanvas=new e(t),this._image=new Image,this._x=0,this._y=0,this._size=200};return t.prototype.getImage=function(){return this._image},t.prototype.setImage=function(e){this._image=e},t.prototype.getX=function(){return this._x},t.prototype.setX=function(e){this._x=e,this._dontDragOutside()},t.prototype.getY=function(){return this._y},t.prototype.setY=function(e){this._y=e,this._dontDragOutside()},t.prototype.getSize=function(){return this._size},t.prototype.setSize=function(e){this._size=Math.max(this._minSize,e),this._dontDragOutside()},t.prototype.getPosition=function(){return{left:this._x-this._size/2,top:this._y-this._size/2,width:this._size,height:this._size}},t.prototype.getMinSize=function(){return this._minSize},t.prototype.setMinSize=function(e){this._minSize=e,this._size=Math.max(this._minSize,this._size),this._dontDragOutside()},t.prototype._dontDragOutside=function(){var e=this._ctx.canvas.height,t=this._ctx.canvas.width;this._size>t&&(this._size=t),this._size>e&&(this._size=e),this._x<this._size/2&&(this._x=this._size/2),this._x>t-this._size/2&&(this._x=t-this._size/2),this._y<this._size/2&&(this._y=this._size/2),this._y>e-this._size/2&&(this._y=e-this._size/2)},t.prototype._drawArea=function(){},t.prototype.draw=function(){this._cropCanvas.drawCropArea(this._image,[this._x,this._y],this._size,this._drawArea)},t.prototype.processMouseMove=function(){},t.prototype.processMouseDown=function(){},t.prototype.processMouseUp=function(){},t}]),e.factory("cropCanvas",[function(){var e=[[-.5,-2],[-3,-4.5],[-.5,-7],[-7,-7],[-7,-.5],[-4.5,-3],[-2,-.5]],t=[[.5,-2],[3,-4.5],[.5,-7],[7,-7],[7,-.5],[4.5,-3],[2,-.5]],i=[[-.5,2],[-3,4.5],[-.5,7],[-7,7],[-7,.5],[-4.5,3],[-2,.5]],s=[[.5,2],[3,4.5],[.5,7],[7,7],[7,.5],[4.5,3],[2,.5]],r=[[-1.5,-2.5],[-1.5,-6],[-5,-6],[0,-11],[5,-6],[1.5,-6],[1.5,-2.5]],o=[[-2.5,-1.5],[-6,-1.5],[-6,-5],[-11,0],[-6,5],[-6,1.5],[-2.5,1.5]],a=[[-1.5,2.5],[-1.5,6],[-5,6],[0,11],[5,6],[1.5,6],[1.5,2.5]],n=[[2.5,-1.5],[6,-1.5],[6,-5],[11,0],[6,5],[6,1.5],[2.5,1.5]],h={areaOutline:"#fff",resizeBoxStroke:"#fff",resizeBoxFill:"#444",resizeBoxArrowFill:"#fff",resizeCircleStroke:"#fff",resizeCircleFill:"#444",moveIconFill:"#fff"};return function(c){var _=function(e,t,i){return[i*e[0]+t[0],i*e[1]+t[1]]},g=function(e,t,i,s){c.save(),c.fillStyle=t,c.beginPath();var r,o=_(e[0],i,s);c.moveTo(o[0],o[1]);for(var a in e)a>0&&(r=_(e[a],i,s),c.lineTo(r[0],r[1]));c.lineTo(o[0],o[1]),c.fill(),c.closePath(),c.restore()};this.drawIconMove=function(e,t){g(r,h.moveIconFill,e,t),g(o,h.moveIconFill,e,t),g(a,h.moveIconFill,e,t),g(n,h.moveIconFill,e,t)},this.drawIconResizeCircle=function(e,t,i){var s=t*i;c.save(),c.strokeStyle=h.resizeCircleStroke,c.lineWidth=2,c.fillStyle=h.resizeCircleFill,c.beginPath(),c.arc(e[0],e[1],s,0,2*Math.PI),c.fill(),c.stroke(),c.closePath(),c.restore()},this.drawIconResizeBoxBase=function(e,t,i){var s=t*i;c.save(),c.strokeStyle=h.resizeBoxStroke,c.lineWidth=2,c.fillStyle=h.resizeBoxFill,c.fillRect(e[0]-s/2,e[1]-s/2,s,s),c.strokeRect(e[0]-s/2,e[1]-s/2,s,s),c.restore()},this.drawIconResizeBoxNESW=function(e,s,r){this.drawIconResizeBoxBase(e,s,r),g(t,h.resizeBoxArrowFill,e,r),g(i,h.resizeBoxArrowFill,e,r)},this.drawIconResizeBoxNWSE=function(t,i,r){this.drawIconResizeBoxBase(t,i,r),g(e,h.resizeBoxArrowFill,t,r),g(s,h.resizeBoxArrowFill,t,r)},this.drawCropArea=function(e,t,i,s){var r=e.width/c.canvas.width,o=e.height/c.canvas.height,a=t[0]-i/2,n=t[1]-i/2;c.save(),c.strokeStyle=h.areaOutline,c.lineWidth=2,c.beginPath(),s(c,t,i),c.stroke(),c.clip(),i>0&&c.drawImage(e,a*r,n*o,i*r,i*o,a,n,i,i),c.beginPath(),s(c,t,i),c.stroke(),c.clip(),c.restore()}}}]),e.factory("cropHost",["$document","cropAreaCircle","cropAreaSquare",function(e,t,i){var s=function(e){var t=e.getBoundingClientRect(),i=document.body,s=document.documentElement,r=window.pageYOffset||s.scrollTop||i.scrollTop,o=window.pageXOffset||s.scrollLeft||i.scrollLeft,a=s.clientTop||i.clientTop||0,n=s.clientLeft||i.clientLeft||0,h=t.top+r-a,c=t.left+o-n;return{top:Math.round(h),left:Math.round(c)}};return function(r,o,a){function n(){h.clearRect(0,0,h.canvas.width,h.canvas.height),null!==c&&(h.drawImage(c,0,0,h.canvas.width,h.canvas.height),h.save(),h.fillStyle="rgba(0, 0, 0, 0.65)",h.fillRect(0,0,h.canvas.width,h.canvas.height),h.restore(),_.draw())}var h=null,c=null,_=null,g=[100,100],u=[300,300],p=200,l=function(){if(null!==c){_.setImage(c);var e=[c.width,c.height],t=c.width/c.height,i=e;i[0]>u[0]?(i[0]=u[0],i[1]=i[0]/t):i[0]<g[0]&&(i[0]=g[0],i[1]=i[0]/t),i[1]>u[1]?(i[1]=u[1],i[0]=i[1]*t):i[1]<g[1]&&(i[1]=g[1],i[0]=i[1]*t),r.prop("width",i[0]).prop("height",i[1]).css({"margin-left":-i[0]/2+"px","margin-top":-i[1]/2+"px"}),_.setX(h.canvas.width/2),_.setY(h.canvas.height/2),_.setSize(Math.min(200,h.canvas.width/2,h.canvas.height/2))}else r.prop("width",0).prop("height",0).css({"margin-top":0});n()},z=function(e){if(null!==c){var t,i,r=s(h.canvas);"touchmove"===e.type?(t=e.changedTouches[0].pageX,i=e.changedTouches[0].pageY):(t=e.pageX,i=e.pageY),_.processMouseMove(t-r.left,i-r.top),n()}},v=function(e){if(e.preventDefault(),e.stopPropagation(),null!==c){var t,i,r=s(h.canvas);"touchstart"===e.type?(t=e.changedTouches[0].pageX,i=e.changedTouches[0].pageY):(t=e.pageX,i=e.pageY),_.processMouseDown(t-r.left,i-r.top),n()}},f=function(e){if(null!==c){var t,i,r=s(h.canvas);"touchend"===e.type?(t=e.changedTouches[0].pageX,i=e.changedTouches[0].pageY):(t=e.pageX,i=e.pageY),_.processMouseUp(t-r.left,i-r.top),n()}};this.getResultImageDataURI=function(){var e,t;return t=angular.element("<canvas></canvas>")[0],e=t.getContext("2d"),t.width=p,t.height=p,null!==c&&e.drawImage(c,(_.getX()-_.getSize()/2)*(c.width/h.canvas.width),(_.getY()-_.getSize()/2)*(c.height/h.canvas.height),_.getSize()*(c.width/h.canvas.width),_.getSize()*(c.height/h.canvas.height),0,0,p,p),t.toDataURL()},this.getAreaCoords=function(){return _.getPosition()},this.setNewImageSource=function(e){if(c=null,l(),a.trigger("image-updated"),e){var t=new Image;t.onload=function(){a.trigger("load-done"),c=t,l(),a.trigger("image-updated")},t.onerror=function(){a.trigger("load-error")},a.trigger("load-start"),t.src=e}},this.setMaxDimensions=function(e,t){if(u=[e,t],null!==c){var i=h.canvas.width,s=h.canvas.height,o=[c.width,c.height],a=c.width/c.height,p=o;p[0]>u[0]?(p[0]=u[0],p[1]=p[0]/a):p[0]<g[0]&&(p[0]=g[0],p[1]=p[0]/a),p[1]>u[1]?(p[1]=u[1],p[0]=p[1]*a):p[1]<g[1]&&(p[1]=g[1],p[0]=p[1]*a),r.prop("width",p[0]).prop("height",p[1]).css({"margin-left":-p[0]/2+"px","margin-top":-p[1]/2+"px"});var l=h.canvas.width/i,z=h.canvas.height/s,v=Math.min(l,z);_.setX(_.getX()*l),_.setY(_.getY()*z),_.setSize(_.getSize()*v)}else r.prop("width",0).prop("height",0).css({"margin-top":0});n()},this.setAreaMinSize=function(e){e=parseInt(e,10),isNaN(e)||(_.setMinSize(e),n())},this.setResultImageSize=function(e){e=parseInt(e,10),isNaN(e)||(p=e)},this.setAreaType=function(e){var s=_.getSize(),r=_.getMinSize(),o=_.getX(),g=_.getY(),u=t;"square"===e&&(u=i),_=new u(h,a),_.setMinSize(r),_.setSize(s),_.setX(o),_.setY(g),null!==c&&_.setImage(c),n()},h=r[0].getContext("2d"),_=new t(h,a),e.on("mousemove",z),r.on("mousedown",v),e.on("mouseup",f),e.on("touchmove",z),r.on("touchstart",v),e.on("touchend",f),this.destroy=function(){e.off("mousemove",z),r.off("mousedown",v),e.off("mouseup",z),e.off("touchmove",z),r.off("touchstart",v),e.off("touchend",z),r.remove()}}}]),e.factory("cropPubSub",[function(){return function(){var e={};this.on=function(t,i){return t.split(" ").forEach(function(t){e[t]||(e[t]=[]),e[t].push(i)}),this},this.trigger=function(t,i){return angular.forEach(e[t],function(e){e.call(null,i)}),this}}}]),e.directive("imgCrop",["$timeout","cropHost","cropPubSub",function(e,t,i){return{restrict:"E",scope:{image:"=",resultImage:"=",changeOnFly:"=",areaCoords:"=",areaType:"@",areaMinSize:"=",resultImageSize:"=",onChange:"&",onLoadBegin:"&",onLoadDone:"&",onLoadError:"&"},template:"<canvas></canvas>",controller:["$scope",function(e){e.events=new i}],link:function(i,s){var r,o=i.events,a=new t(s.find("canvas"),{},o),n=function(e){var t=a.getResultImageDataURI();r!==t&&(r=t,angular.isDefined(e.resultImage)&&(e.resultImage=t),h(e),e.onChange({$dataURI:e.resultImage}))},h=function(e){var t=a.getAreaCoords();e.areaCoords=t},c=function(t){return function(){e(function(){i.$apply(function(e){t(e)})})}};o.on("load-start",c(function(e){e.onLoadBegin({})})).on("load-done",c(function(e){e.onLoadDone({})})).on("load-error",c(function(e){e.onLoadError({})})).on("area-move area-resize",c(function(e){e.changeOnFly&&n(e)})).on("area-move-end area-resize-end image-updated",c(function(e){n(e)})),i.$watch("image",function(){a.setNewImageSource(i.image)}),i.$watch("areaType",function(){a.setAreaType(i.areaType),n(i)}),i.$watch("areaMinSize",function(){a.setAreaMinSize(i.areaMinSize),n(i)}),i.$watch("resultImageSize",function(){a.setResultImageSize(i.resultImageSize),n(i)}),i.$watch(function(){return[s[0].clientWidth,s[0].clientHeight]},function(e){a.setMaxDimensions(e[0],e[1]),n(i)},!0),i.$on("$destroy",function(){a.destroy()})}}}])}();