(this.webpackJsonpsmashrankingsbrazil=this.webpackJsonpsmashrankingsbrazil||[]).push([[0],{13:function(e,t,a){},14:function(e,t,a){},15:function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),r=a(7),c=a.n(r),s=(a(13),a(1)),i=a(2),l=a(4),u=a(3),d=a(5),p=(a(14),function(e){function t(){var e,a;Object(s.a)(this,t);for(var n=arguments.length,o=new Array(n),r=0;r<n;r++)o[r]=arguments[r];return(a=Object(l.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(o)))).state={selectedLeague:0,players:[]},a}return Object(d.a)(t,e),Object(i.a)(t,[{key:"componentDidUpdate",value:function(e){e!==this.props&&this.updateData()}},{key:"updateData",value:function(){var e=this;fetch("https://cdn.jsdelivr.net/gh/joaorb64/tournament_api/out/"+this.props.contacts[this.state.selectedLeague]+".json").then((function(e){return e.json()})).then((function(t){if(t){var a=[];Object.keys(t).forEach((function(e){a.push(t[e])})),e.setState({players:a})}})).catch(console.log)}},{key:"selectLeague",value:function(e){e!=this.state.selectedLeague&&(this.state.selectedLeague=e,this.updateData())}},{key:"getCharName",value:function(e){return e.toLowerCase().replace(/ /g,"_")}},{key:"render",value:function(){var e=this;return console.log(this.state.players),o.a.createElement("div",{style:{textAlign:"center",fontFamily:"SmashFont"}},o.a.createElement("div",{class:"btn-group",role:"group",style:{margin:10}},this.props.contacts.map((function(t,a){return o.a.createElement("button",{onClick:function(){return e.selectLeague(a)},type:"button",class:"btn btn-danger"},t)}))),o.a.createElement("ul",{class:"list-group",style:{padding:"10px"}},this.state.players.map((function(t,a){return o.a.createElement("li",{key:e.state.selectedLeague+"_"+a,class:"slide-fade list-group-item",style:{backgroundColor:"#f0f0f0",borderRadius:"10px",border:0,marginBottom:"5px",width:"512px",height:"42px",lineHeight:"48px",padding:0,display:"flex",alignSelf:"center",overflow:"hidden",animationDelay:a/30+"s"}},o.a.createElement("div",{style:{width:"45px",textAlign:"center",fontSize:"1.2rem"}},t.rank),o.a.createElement("div",{style:{flexGrow:1}},t.name),t.mains.length>0?o.a.createElement("div",{style:{backgroundImage:"url(./portraits-small/".concat(e.getCharName(t.mains[0].name),".png)"),width:"128px",backgroundPosition:"center",backgroundSize:"cover",backgroundColor:"#ababab"}}):o.a.createElement("div",{style:{backgroundImage:"url(./portraits-small/".concat("random",".png)"),width:"128px",backgroundPosition:"center",backgroundSize:"cover",backgroundColor:"#ababab"}}))}))))}}]),t}(n.Component)),h=function(e){function t(){var e,a;Object(s.a)(this,t);for(var n=arguments.length,o=new Array(n),r=0;r<n;r++)o[r]=arguments[r];return(a=Object(l.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(o)))).state={leagues:[]},a}return Object(d.a)(t,e),Object(i.a)(t,[{key:"componentWillMount",value:function(){var e=this;fetch("https://cdn.jsdelivr.net/gh/joaorb64/tournament_api/leagues.json").then((function(e){return e.json()})).then((function(t){e.setState({leagues:t.leagues})})).catch(console.log)}},{key:"componentDidMount",value:function(){document.getElementById("myVideo").play()}},{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement("video",{loop:!0,muted:!0,autoplay:!0,oncanplay:"this.play()",onloadedmetadata:"this.muted=true",id:"myVideo"},o.a.createElement("source",{src:"./background.mp4",type:"video/mp4"})),o.a.createElement("div",{class:"container",style:{backgroundColor:"#2a2335"}},o.a.createElement(p,{contacts:this.state.leagues})))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(o.a.createElement(h,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},8:function(e,t,a){e.exports=a(15)}},[[8,1,2]]]);
//# sourceMappingURL=main.d1b4011e.chunk.js.map