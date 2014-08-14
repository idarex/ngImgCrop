'use strict';

crop.factory('cropAreaRectangle', ['cropArea', function(CropArea) {
  var CropAreaRectangle = function() {
    CropArea.apply(this, arguments);

    this._resizeCtrlBaseRadius = 10;
    this._resizeCtrlNormalRatio = 0.75;
    this._resizeCtrlHoverRatio = 1;
    this._iconMoveNormalRatio = 0.9;
    this._iconMoveHoverRatio = 1.2;

    this._resizeCtrlNormalRadius = this._resizeCtrlBaseRadius*this._resizeCtrlNormalRatio;
    this._resizeCtrlHoverRadius = this._resizeCtrlBaseRadius*this._resizeCtrlHoverRatio;

    this._posDragStartX=0;
    this._posDragStartY=0;
    this._posResizeStartX=0;
    this._posResizeStartY=0;
    this._posResizeStartSize={w: 0, h: 0};

    this._resizeCtrlIsHover = -1;
    this._areaIsHover = false;
    this._resizeCtrlIsDragging = -1;
    this._areaIsDragging = false;
  };

  CropAreaRectangle.prototype = new CropArea();

  CropAreaRectangle.prototype._calcRectangleCorners=function() {
    var size = this.getSize();
    var se = this.getSouthEastBound();
     return [
      [size.x, size.y], //northwest
      [se.x, size.y], //northeast
      [size.x, se.y], //southwest
      [se.x, se.y] //southeast
     ];
   };

   CropAreaRectangle.prototype._calcRectangleDimensions=function() {
    var size = this.getSize();
    var se = this.getSouthEastBound();
    return {
      left: size.x,
      top: size.y,
      right: se.x,
      bottom: se.y
    };
  };

  CropAreaRectangle.prototype._isCoordWithinArea=function(coord) {
    var rectangleDimensions=this._calcRectangleDimensions();
    return (coord[0]>=rectangleDimensions.left&&coord[0]<=rectangleDimensions.right&&coord[1]>=rectangleDimensions.top&&coord[1]<=rectangleDimensions.bottom);
  };

  CropAreaRectangle.prototype._isCoordWithinResizeCtrl=function(coord) {
    var resizeIconsCenterCoords=this._calcRectangleCorners();
    var res=-1;
    for(var i=0,len=resizeIconsCenterCoords.length;i<len;i++) {
      var resizeIconCenterCoords=resizeIconsCenterCoords[i];
      if(coord[0] > resizeIconCenterCoords[0] - this._resizeCtrlHoverRadius && coord[0] < resizeIconCenterCoords[0] + this._resizeCtrlHoverRadius &&
         coord[1] > resizeIconCenterCoords[1] - this._resizeCtrlHoverRadius && coord[1] < resizeIconCenterCoords[1] + this._resizeCtrlHoverRadius) {
        res=i;
        break;
      }
    }
    return res;
  };

  CropAreaRectangle.prototype._drawArea=function(ctx,center,size){
    ctx.rect(size.x,size.y,size.w,size.h);
  };

  CropAreaRectangle.prototype.draw=function() {
    CropArea.prototype.draw.apply(this, arguments);

    var center=this.getCenterPoint();
    // draw move icon
    this._cropCanvas.drawIconMove([center.x, center.y], this._areaIsHover?this._iconMoveHoverRatio:this._iconMoveNormalRatio);

    // draw resize thumbs
    var resizeIconsCenterCoords=this._calcRectangleCorners();
    for(var i=0,len=resizeIconsCenterCoords.length;i<len;i++) {
      var resizeIconCenterCoords=resizeIconsCenterCoords[i];
      this._cropCanvas.drawIconResizeCircle(resizeIconCenterCoords, this._resizeCtrlBaseRadius, this._resizeCtrlIsHover===i?this._resizeCtrlHoverRatio:this._resizeCtrlNormalRatio);
    }
  };

  CropAreaRectangle.prototype._sizeFromInputCorners = function (northWestCorner, southEastCorner) {
    return {x: northWestCorner.x,
            y: northWestCorner.y,
            w: southEastCorner.x - northWestCorner.x,
            h: southEastCorner.y - northWestCorner.y};
  };

  CropAreaRectangle.prototype._aspectPadding = function (northWestCorner, southEastCorner) {
    var calcSize, padding =  {x: 0, y: 0},
        w = southEastCorner.x - northWestCorner.x,
        h = southEastCorner.y - northWestCorner.y;
    if (this._aspect) {
      if (h * this._aspect > w) {
        // Width is too small
        calcSize = h * this._aspect;
        padding = { x: calcSize - w, y: 0};
      } else {
        // Height is too small
        calcSize = w / this._aspect;
        padding = {x: 0 , y: calcSize - h};
      }
    }
    return padding;
  };

  CropAreaRectangle.prototype.processMouseMove=function(mouseCurX, mouseCurY) {
    var cursor='default';
    var res=false;

    var padding, aspectedCorner, size;

    this._resizeCtrlIsHover = -1;
    this._areaIsHover = false;

    if (this._areaIsDragging) {
      this.setCenterPoint({x: mouseCurX - this._posDragStartX,
                           y: mouseCurY - this._posDragStartY});
      this._areaIsHover = true;
      cursor='move';
      res=true;
      this._events.trigger('area-move');
    } else if (this._resizeCtrlIsDragging>-1) {
      var s = this.getSize();
      var se = this.getSouthEastBound();
      switch(this._resizeCtrlIsDragging) {
        case 0: // Top Left
          padding = this._aspectPadding({x: mouseCurX, y: mouseCurY}, { x: se.x, y: se.y});
          aspectedCorner = {x: mouseCurX - padding.x, y: mouseCurY - padding.y};
          size = this._sizeFromInputCorners({x: aspectedCorner.x, y: aspectedCorner.y}, {x: se.x, y: se.y});
          cursor = 'nwse-resize';
          break;
        case 1: // Top Right
          padding = this._aspectPadding({x: s.x, y: mouseCurY}, {x: mouseCurX, y: se.y});
          aspectedCorner = {x: mouseCurX + padding.x, y: mouseCurY - padding.y};
          size = this._sizeFromInputCorners({x: s.x, y: aspectedCorner.y}, {x: aspectedCorner.x, y: se.y});
          cursor = 'nesw-resize';
          break;
        case 2: // Bottom Left
          padding = this._aspectPadding({x: mouseCurX, y: s.y}, {x: se.x, y: mouseCurY});
          aspectedCorner = {x: mouseCurX - padding.x, y: mouseCurY + padding.y};
          size = this._sizeFromInputCorners({x: aspectedCorner.x, y: s.y}, {x: se.x, y: aspectedCorner.y});
          cursor = 'nesw-resize';
          break;
        case 3: // Bottom Right
          padding = this._aspectPadding({x: s.x, y: s.y}, {x: mouseCurX, y: mouseCurY});
          aspectedCorner = {x: mouseCurX + padding.x, y: mouseCurY + padding.y};
          size = this._sizeFromInputCorners({x: s.x, y: s.y}, {x: aspectedCorner.x, y: aspectedCorner.y});
          cursor = 'nwse-resize';
          break;
      }
      this.setSize(size);

      this._resizeCtrlIsHover = this._resizeCtrlIsDragging;
      res=true;
      this._events.trigger('area-resize');
    } else {
      var hoveredResizeBox=this._isCoordWithinResizeCtrl([mouseCurX,mouseCurY]);
      if (hoveredResizeBox>-1) {
        switch(hoveredResizeBox) {
          case 0:
            cursor = 'nwse-resize';
            break;
          case 1:
            cursor = 'nesw-resize';
            break;
          case 2:
            cursor = 'nesw-resize';
            break;
          case 3:
            cursor = 'nwse-resize';
            break;
        }
        this._areaIsHover = false;
        this._resizeCtrlIsHover = hoveredResizeBox;
        res=true;
      } else if(this._isCoordWithinArea([mouseCurX,mouseCurY])) {
        cursor = 'move';
        this._areaIsHover = true;
        res=true;
      }
    }

    angular.element(this._ctx.canvas).css({'cursor': cursor});

    return res;
  };

  CropAreaRectangle.prototype.processMouseDown=function(mouseDownX, mouseDownY) {
    var isWithinResizeCtrl=this._isCoordWithinResizeCtrl([mouseDownX,mouseDownY]);
    if (isWithinResizeCtrl>-1) {
      this._areaIsDragging = false;
      this._areaIsHover = false;
      this._resizeCtrlIsDragging = isWithinResizeCtrl;
      this._resizeCtrlIsHover = isWithinResizeCtrl;
      this._posResizeStartX=mouseDownX;
      this._posResizeStartY=mouseDownY;
      this._posResizeStartSize = this._size;
      this._events.trigger('area-resize-start');
    } else if (this._isCoordWithinArea([mouseDownX,mouseDownY])) {
      this._areaIsDragging = true;
      this._areaIsHover = true;
      this._resizeCtrlIsDragging = -1;
      this._resizeCtrlIsHover = -1;
      var center = this.getCenterPoint();
      this._posDragStartX = mouseDownX - center.x;
      this._posDragStartY = mouseDownY - center.y;
      this._events.trigger('area-move-start');
    }
  };

  CropAreaRectangle.prototype.processMouseUp=function(/*mouseUpX, mouseUpY*/) {
    if(this._areaIsDragging) {
      this._areaIsDragging = false;
      this._events.trigger('area-move-end');
    }
    if(this._resizeCtrlIsDragging>-1) {
      this._resizeCtrlIsDragging = -1;
      this._events.trigger('area-resize-end');
    }
    this._areaIsHover = false;
    this._resizeCtrlIsHover = -1;

    this._posDragStartX = 0;
    this._posDragStartY = 0;
  };


  return CropAreaRectangle;
}]);
