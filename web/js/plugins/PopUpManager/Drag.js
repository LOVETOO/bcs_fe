var Drag={obj:null,init:function(B,A){B.onmousedown=Drag.start;B.root=A;B.root.onDragStart=new Function();B.root.onDragEnd=new Function();B.root.onDrag=new Function()},start:function(D){var A=Drag.obj=this;Drag.fixPos(A.root);D=Drag.fixEvent(D);var C=parseInt(A.root.style.top);var B=parseInt(A.root.style.left);A.root.onDragStart(B,C,D.pageX,D.pageY);A.lastMouseX=D.pageX;A.lastMouseY=D.pageY;document.onmousemove=Drag.drag;document.onmouseup=Drag.end;return false},drag:function(H){H=Drag.fixEvent(H);var E=Drag.obj;var B=H.pageY;var C=H.pageX;var G=parseInt(E.root.style.top);var F=parseInt(E.root.style.left);var D,A;D=F+C-E.lastMouseX;A=G+(B-E.lastMouseY);E.root.style.left=D+"px";E.root.style.top=A+"px";E.lastMouseX=C;E.lastMouseY=B;E.root.onDrag(D,A,H.pageX,H.pageY);return false},end:function(){document.onmousemove=null;document.onmouseup=null;Drag.obj.root.onDragEnd(parseInt(Drag.obj.root.style.left),parseInt(Drag.obj.root.style.top));Drag.obj=null},fixEvent:function(A){if(typeof A=="undefined"){A=window.event}if(typeof A.layerX=="undefined"){A.layerX=A.offsetX}if(typeof A.layerY=="undefined"){A.layerY=A.offsetY}if(typeof A.pageX=="undefined"){A.pageX=A.clientX+document.body.scrollLeft-document.body.clientLeft}if(typeof A.pageY=="undefined"){A.pageY=A.clientY+document.body.scrollTop-document.body.clientTop}return A},fixPos:function(C){var B=document.all&&C.currentStyle.top||window.getComputedStyle(C,null).top;var A=document.all&&C.currentStyle.left||window.getComputedStyle(C,null).left;if(A.indexOf("%")!=-1){A=getClient().w*parseInt(A)/100}if(B.indexOf("%")!=-1){B=getClient().h*parseInt(B)/100}B=parseInt(B)||0;A=parseInt(A)||0;C.style.left=A+"px";C.style.top=B+"px"}};var getClient=function(A){if(A){w=A.clientWidth;h=A.clientHeight}else{w=(window.innerWidth)?window.innerWidth:(document.documentElement&&document.documentElement.clientWidth)?document.documentElement.clientWidth:document.body.offsetWidth;h=(window.innerHeight)?window.innerHeight:(document.documentElement&&document.documentElement.clientHeight)?document.documentElement.clientHeight:document.body.offsetHeight}return{w:w,h:h}};