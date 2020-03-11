/*
 Highcharts JS v7.0.1 (2018-12-19)

 (c) 2016-2018 Highsoft AS
 Authors: Jon Arild Nygard

 License: www.highcharts.com/license
*/
(function(h){"object"===typeof module&&module.exports?module.exports=h:"function"===typeof define&&define.amd?define(function(){return h}):h("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(h){var y=function(){return function(f){var v=this,k=v.graphic,h=f.animatableAttribs,t=f.onComplete,w=f.css,A=f.renderer;v.shouldDraw()?(k||(v.graphic=k=A[f.shapeType](f.shapeArgs).add(f.group)),k.css(w).attr(f.attribs).animate(h,f.isNew?!1:void 0,t)):k&&k.animate(h,void 0,function(){v.graphic=k=k.destroy();
    "function"===typeof t&&t()});k&&k.addClass(v.getClassName(),!0)}}(),C=function(f){var h=f.deg2rad,k=f.find,J=f.isArray,t=f.isNumber,w=function(a,d){d=t(d)?d:14;d=Math.pow(10,d);return Math.round(a*d)/d},A=function(a,d){var e=d[0]-a[0];a=d[1]-a[1];return[[-a,e],[a,-e]]},q=function(a,d){a=a.map(function(a){return a[0]*d[0]+a[1]*d[1]});return{min:Math.min.apply(this,a),max:Math.max.apply(this,a)}},E=function(a,d){var e=a[0];a=a[1];var m=h*-d;d=Math.cos(m);m=Math.sin(m);return[w(e*d-a*m),w(e*m+a*d)]},
    z=function(a,d,e){a=E([a[0]-d[0],a[1]-d[1]],e);return[a[0]+d[0],a[1]+d[1]]},B=function(a){var d,e=a.axes;J(e)||(e=[],d=d=a.concat([a[0]]),d.reduce(function(a,d){var m=A(a,d)[0];k(e,function(a){return a[0]===m[0]&&a[1]===m[1]})||e.push(m);return d}),a.axes=e);return e},G=function(a,d){a=B(a);d=B(d);return a.concat(d)};return{getBoundingBoxFromPolygon:function(a){return a.reduce(function(a,e){var d=e[0];e=e[1];a.left=Math.min(d,a.left);a.right=Math.max(d,a.right);a.bottom=Math.max(e,a.bottom);a.top=
        Math.min(e,a.top);return a},{left:Number.MAX_VALUE,right:-Number.MAX_VALUE,bottom:-Number.MAX_VALUE,top:Number.MAX_VALUE})},getPolygon:function(a,d,e,m,f){var k=[a,d],h=a-e/2;a+=e/2;e=d-m/2;d+=m/2;return[[h,e],[a,e],[a,d],[h,d]].map(function(a){return z(a,k,-f)})},isPolygonsColliding:function(a,d){var e=G(a,d);return!k(e,function(e){var f=q(a,e);e=q(d,e);return!!(e.min>f.max||e.max<f.min)})},movePolygon:function(a,d,e){return e.map(function(e){return[e[0]+a,e[1]+d]})},rotate2DToOrigin:E,rotate2DToPoint:z}}(h);
    (function(f,h,k){function v(g,c){var b=!1,a=g.rect,e=g.polygon,d=g.lastCollidedWith,f=function(c){var b;b=c.rect;(b=!(b.left>a.right||b.right<a.left||b.top>a.bottom||b.bottom<a.top))&&(g.rotation%90||c.roation%90)&&(b=D(e,c.polygon));return b};d&&((b=f(d))||delete g.lastCollidedWith);b||(b=!!C(c,function(c){var b=f(c);b&&(g.lastCollidedWith=c);return b}));return b}function t(g){var c=4*g,b=Math.ceil((Math.sqrt(c)-1)/2),a=2*b+1,d=Math.pow(a,2),e=!1,a=a-1;1E4>=g&&("boolean"===typeof e&&c>=d-a&&(e={x:b-
        (d-c),y:-b}),d-=a,"boolean"===typeof e&&c>=d-a&&(e={x:-b,y:-b+(d-c)}),d-=a,"boolean"===typeof e&&(e=c>=d-a?{x:-b+(d-c),y:b}:{x:b,y:b-(d-c-a)}),e.x*=5,e.y*=5);return e}function w(g,c,b){var a=2*Math.max(Math.abs(b.top),Math.abs(b.bottom));b=2*Math.max(Math.abs(b.left),Math.abs(b.right));return Math.min(0<b?1/b*g:1,0<a?1/a*c:1)}function A(a,c,b){b=b.reduce(function(a,c){c=c.dimensions;var b=Math.max(c.width,c.height);a.maxHeight=Math.max(a.maxHeight,c.height);a.maxWidth=Math.max(a.maxWidth,c.width);
        a.area+=b*b;return a},{maxHeight:0,maxWidth:0,area:0});b=Math.max(b.maxHeight,b.maxWidth,.85*Math.sqrt(b.area));var g=a>c?a/c:1;a=c>a?c/a:1;return{width:b*g,height:b*a,ratioX:g,ratioY:a}}function q(a,c,b,d){var g=!1;e(a)&&e(c)&&e(b)&&e(d)&&-1<a&&-1<c&&d>b&&(g=b+c%a*((d-b)/(a-1)));return g}function E(a,c){var b,g=[];for(b=1;1E4>b;b++)g.push(a(b,c));return function(a){return 1E4>=a?g[a-1]:!1}}function z(a,c){var b=c.width/2,g=-(c.height/2),d=c.height/2;return!(-(c.width/2)<a.left&&b>a.right&&g<a.top&&
        d>a.bottom)}function B(g,c){var b=c.placed,d=c.field,e=c.rectangle,f=c.polygon,k=c.spiral,h=1,p={x:0,y:0},n=g.rect=a({},e);g.polygon=f;for(g.rotation=c.rotation;!1!==p&&(v(g,b)||z(n,d));)p=k(h),m(p)&&(n.left=e.left+p.x,n.right=e.right+p.x,n.top=e.top+p.y,n.bottom=e.bottom+p.y,g.polygon=L(p.x,p.y,f)),h++;return p}function G(a,c){var b,g,d;m(a)&&m(c)&&(b=c.bottom-c.top,g=c.right-c.left,c=a.ratioX,d=a.ratioY,b=g*c>b*d?g:b,a=y(a,{width:a.width+b*c*2,height:a.height+b*d*2}));return a}var a=f.extend,d=
        f.isArray,e=f.isNumber,m=f.isObject,y=f.merge,F=f.noop,C=f.find,K=k.getBoundingBoxFromPolygon,M=k.getPolygon,D=k.isPolygonsColliding,L=k.movePolygon,I=f.Series;f.seriesType("wordcloud","column",{allowExtendPlayingField:!0,animation:{duration:500},borderWidth:0,clip:!1,colorByPoint:!0,minFontSize:1,maxFontSize:25,placementStrategy:"center",rotation:{from:0,orientations:2,to:90},showInLegend:!1,spiral:"rectangular",style:{fontFamily:"sans-serif",fontWeight:"900"},tooltip:{followPointer:!0,pointFormat:'\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.weight}\x3c/b\x3e\x3cbr/\x3e'}},
        {animate:I.prototype.animate,animateDrilldown:F,animateDrillupFrom:F,bindAxes:function(){var g={endOnTick:!1,gridLineWidth:0,lineWidth:0,maxPadding:0,startOnTick:!1,title:null,tickPositions:[]};I.prototype.bindAxes.call(this);a(this.yAxis.options,g);a(this.xAxis.options,g)},deriveFontSize:function(a,c,b){a=e(a)?a:0;c=e(c)?c:1;b=e(b)?b:1;return Math.floor(Math.max(b,a*c))},drawPoints:function(){var d=this,c=d.hasRendered,b=d.xAxis,f=d.yAxis,k=d.group,h=d.options,t=h.animation,v=h.allowExtendPlayingField,
                p=d.chart.renderer,n=p.text().add(k),q=[],z=d.placementStrategy[h.placementStrategy],y,C=h.rotation,F=d.points.map(function(a){return a.weight}),D=Math.max.apply(null,F),H=d.points.sort(function(a,c){return c.weight-a.weight}),u;H.forEach(function(c){var b=d.deriveFontSize(1/D*c.weight,h.maxFontSize,h.minFontSize),b=a({fontSize:b+"px"},h.style);n.css(b).attr({x:0,y:0,text:c.name});b=n.getBBox(!0);c.dimensions={height:b.height,width:b.width}});u=A(b.len,f.len,H);y=E(d.spirals[h.spiral],{field:u});
                H.forEach(function(b){var g=d.deriveFontSize(1/D*b.weight,h.maxFontSize,h.minFontSize),g=a({fontSize:g+"px",fill:b.color},h.style),f=z(b,{data:H,field:u,placed:q,rotation:C}),r={align:"center","alignment-baseline":"middle",x:f.x,y:f.y,text:b.name,rotation:f.rotation},n=M(f.x,f.y,b.dimensions.width,b.dimensions.height,f.rotation),l=K(n),x=B(b,{rectangle:l,polygon:n,field:u,placed:q,spiral:y,rotation:f.rotation}),w;!x&&v&&(u=G(u,l),x=B(b,{rectangle:l,polygon:n,field:u,placed:q,spiral:y,rotation:f.rotation}));
                    if(m(x)){r.x+=x.x;r.y+=x.y;l.left+=x.x;l.right+=x.x;l.top+=x.y;l.bottom+=x.y;f=u;if(!e(f.left)||f.left>l.left)f.left=l.left;if(!e(f.right)||f.right<l.right)f.right=l.right;if(!e(f.top)||f.top>l.top)f.top=l.top;if(!e(f.bottom)||f.bottom<l.bottom)f.bottom=l.bottom;u=f;q.push(b);b.isNull=!1}else b.isNull=!0;t&&(w={x:r.x,y:r.y},c?(delete r.x,delete r.y):(r.x=0,r.y=0));b.draw({animatableAttribs:w,attribs:r,css:g,group:k,renderer:p,shapeArgs:void 0,shapeType:"text"})});n=n.destroy();b=w(b.len,f.len,u);
                d.group.attr({scaleX:b,scaleY:b})},hasData:function(){return m(this)&&!0===this.visible&&d(this.points)&&0<this.points.length},placementStrategy:{random:function(a,c){var b=c.field;c=c.rotation;return{x:Math.round(b.width*(Math.random()+.5)/2)-b.width/2,y:Math.round(b.height*(Math.random()+.5)/2)-b.height/2,rotation:q(c.orientations,a.index,c.from,c.to)}},center:function(a,c){c=c.rotation;return{x:0,y:0,rotation:q(c.orientations,a.index,c.from,c.to)}}},pointArrayMap:["weight"],spirals:{archimedean:function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                c){var b=c.field;c=!1;var b=b.width*b.width+b.height*b.height,d=.8*a;1E4>=a&&(c={x:d*Math.cos(d),y:d*Math.sin(d)},Math.min(Math.abs(c.x),Math.abs(c.y))<b||(c=!1));return c},rectangular:function(a,c){a=t(a,c);c=c.field;a&&(a.x*=c.ratioX,a.y*=c.ratioY);return a},square:t},utils:{extendPlayingField:G,getRotation:q,isPolygonsColliding:D,rotate2DToOrigin:k.rotate2DToOrigin,rotate2DToPoint:k.rotate2DToPoint},getPlotBox:function(){var a=this.chart,c=a.inverted,b=this[c?"yAxis":"xAxis"],c=this[c?"xAxis":
                "yAxis"];return{translateX:(b?b.left:a.plotLeft)+(b?b.len:a.plotWidth)/2,translateY:(c?c.top:a.plotTop)+(c?c.len:a.plotHeight)/2,scaleX:1,scaleY:1}}},{draw:h,shouldDraw:function(){return!this.isNull},weight:1})})(h,y,C)});
//# sourceMappingURL=wordcloud.js.map