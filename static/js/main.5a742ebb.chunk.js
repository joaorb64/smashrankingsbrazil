(this.webpackJsonpsmashrankingsbrazil=this.webpackJsonpsmashrankingsbrazil||[]).push([[0],{10:function(e,t,a){e.exports={teste:"contacts_teste__1i2X6","teste-menu":"contacts_teste-menu__3GCjV",title:"contacts_title__3KfmP",listItem:"contacts_listItem__CzeRn",listItemParent:"contacts_listItemParent__3ZZLw",listItemChild:"contacts_listItemChild__3Awjv",top3container:"contacts_top3container__yH4aZ"}},25:function(e,t,a){e.exports={mapCharIcon:"map_mapCharIcon__1_Xh9"}},26:function(e,t,a){e.exports=a(38)},31:function(e,t,a){},32:function(e,t,a){},38:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(22),l=a.n(o),i=(a(31),a(3)),s=a(4),c=a(6),u=a(5),d=a(7),m=(a(32),a(10)),p=a.n(m),h=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(c.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).state={selectedLeague:0,players:[],top3Colors:["#D6AF36","#D7D7D7","#A77044"],top3Colors2:["#AF9500","#B4B4B4","#6A3805"],top3Colors3:["#C9B037","#A7A7AD","#824A02"]},a}return Object(d.a)(t,e),Object(s.a)(t,[{key:"componentDidUpdate",value:function(e){e!==this.props&&this.updateData()}},{key:"componentDidMount",value:function(){this.props.contacts.length>0&&this.updateData()}},{key:"updateData",value:function(){var e=this;fetch("https://raw.githubusercontent.com/joaorb64/tournament_api/master/out/"+this.props.contacts[this.state.selectedLeague].id+".json").then((function(e){return e.json()})).then((function(t){if(t){var a=[];Object.keys(t).forEach((function(e){t[e].avatar?t[e].avatar="https://raw.githubusercontent.com/joaorb64/tournament_api/master/".concat(t[e].avatar):t[e].twitter&&(t[e].avatar="https://avatars.io/twitter/".concat(this.getTwitterHandle(t[e].twitter))),t[e].mains||(t[e].mains=[]),0==t[e].mains.length&&t[e].mains.push({name:"Random",icon:""}),t[e].rank&&(t[e].score=t[e].rank[this.props.contacts[this.state.selectedLeague].id].score,t[e].ranking=t[e].rank[this.props.contacts[this.state.selectedLeague].id].rank,t[e].ranking&&a.push(t[e]))}),e),a.sort((function(e,t){return Number(e.ranking)-Number(t.ranking)})),e.setState({players:a})}})).catch(console.log)}},{key:"selectLeague",value:function(e){e!=this.state.selectedLeague&&(this.state.selectedLeague=e,this.updateData())}},{key:"getCharName",value:function(e){return e.toLowerCase().replace(/ /g,"_")}},{key:"getTwitterHandle",value:function(e){var t=e.split("/");return t[t.length-1]}},{key:"normalizePlayerName",value:function(e){return e.normalize("NFKD").replace(/ /g,"_").replace(RegExp("[^0-9a-zA-Z_-]"),"").replace("|","")}},{key:"openPlayerModal",value:function(e){window.playerModal&&(window.playerModal.player=this.normalizePlayerName(e.name),window.playerModal.fetchPlayer())}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{style:{textAlign:"center",fontFamily:"SmashFont"}},r.a.createElement("div",{class:"col-12",style:{padding:"0 10px"}},r.a.createElement("div",{class:"dropdown"},r.a.createElement("button",{class:p.a.teste+" btn btn-secondary col-12 dropdown-toggle",type:"button",id:"dropdownMenuButton","data-toggle":"dropdown","aria-haspopup":"true","aria-expanded":"false"},this.props.contacts.length>0?r.a.createElement("div",{class:p.a.title},r.a.createElement("div",{style:{width:"32px",height:"32px",display:"inline-block",backgroundSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center",verticalAlign:"inherit",backgroundColor:"white",borderRadius:"100%",marginRight:"10px",backgroundImage:"url(https://raw.githubusercontent.com/joaorb64/tournament_api/master/league_icon/".concat(this.props.contacts[this.state.selectedLeague].id,".png)")}}),this.props.contacts[this.state.selectedLeague].name):"Loading..."),r.a.createElement("div",{class:p.a["teste-menu"]+" dropdown-menu col-12","aria-labelledby":"dropdownMenuButton"},this.props.contacts.map((function(t,a){return r.a.createElement("a",{class:"dropdown-item "+p.a.teste,href:"#",onClick:function(){return e.selectLeague(a)}},r.a.createElement("div",{style:{width:"32px",height:"32px",display:"inline-block",backgroundSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center",verticalAlign:"inherit",backgroundColor:"white",borderRadius:"100%",marginRight:"10px",backgroundImage:"url(https://raw.githubusercontent.com/joaorb64/tournament_api/master/league_icon/".concat(t.id,".png)")}}),t.name)}))))),r.a.createElement("ul",{class:"list-group",style:{padding:"10px"}},r.a.createElement("div",{class:"row no-gutters",style:{margin:"0 -4px"}},this.state.players.slice(0,3).map((function(t,a){return r.a.createElement("div",{class:"col-md-4 "+p.a.listItemParent,style:{padding:"0px 4px",cursor:"pointer"},"data-toggle":"modal","data-target":"#playerModal",onClick:function(){return e.openPlayerModal(t)}},r.a.createElement("li",{key:e.state.selectedLeague+"_"+a,class:p.a.top3container+" slide-fade list-group-item",style:{backgroundColor:e.state.top3Colors[a],borderRadius:"10px",border:0,marginBottom:"5px",width:"100%",lineHeight:"48px",padding:0,display:"flex",alignSelf:"center",overflow:"hidden",animationDelay:a/30+"s"}},r.a.createElement("div",{style:{backgroundColor:e.state.top3Colors2[a],position:"absolute",top:0,bottom:0,left:0,right:0,clipPath:"polygon(0 0, 0% 100%, 100% 100%)"}}),r.a.createElement("div",{style:{backgroundColor:e.state.top3Colors3[a],position:"absolute",top:0,bottom:0,left:0,right:0,clipPath:"polygon(0 60%, 0% 100%, 100% 100%)"}}),r.a.createElement("div",{style:{backgroundImage:"url(".concat("","/portraits-full/").concat(e.getCharName(t.mains[0].name),".png)"),display:"flex",width:"100%",backgroundPosition:"center",backgroundSize:"cover",filter:"drop-shadow(10px 10px 0px #000000AF)"}},r.a.createElement("div",{class:p.a.listItemChild,style:{backgroundColor:"#f0f0f0",alignItems:"center",display:"flex",flexDirection:"column",height:"60px",position:"absolute",left:"0px",right:"0px",bottom:0,justifyContent:"center"}},r.a.createElement("div",{style:{flexGrow:0,fontSize:"2rem",lineHeight:"2rem",width:"100%",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}},t.name),r.a.createElement("div",{style:{flexGrow:0,fontSize:"1rem",lineHeight:"1rem",width:"100%",color:"darkgray",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}},t.full_name))),r.a.createElement("div",{style:{width:"200px",height:"200px",position:"absolute",backgroundColor:"#f0f0f0",top:-100,left:-100,transform:"rotate(-45deg)"}}),r.a.createElement("div",{style:{width:"100px",height:"100px",position:"absolute",top:0}},r.a.createElement("div",{style:{width:100,height:100,backgroundImage:"url(".concat("","/icons/rank").concat(a+1,".png)"),backgroundSize:"cover",position:"absolute",left:-10,top:-10}})),r.a.createElement("div",{style:{position:"absolute",left:"0px",right:"0px",bottom:"60px",color:"white",display:"flex",whiteSpace:"nowrap",lineHeight:"32px"}},r.a.createElement("div",{style:{display:"flex",flexGrow:1,flexWrap:"wrap",alignSelf:"flex-end",padding:"10px",filter:"drop-shadow(2px 2px 0px black)"}},t.mains.length>0?t.mains.slice(1).map((function(t){return r.a.createElement("div",{style:{backgroundImage:"url(http://braacket.com/".concat(e.getCharName(t.icon),")"),width:"32px",height:"32px",backgroundPosition:"center",backgroundSize:"cover",flexGrow:0,display:"inline-block"}})})):null),r.a.createElement("div",{class:"",style:{width:"64px",display:"flex",justifyContent:"center",alignItems:"center",padding:"8px",alignSelf:"flex-end"}},t.state?r.a.createElement("div",{class:"state-flag",style:{backgroundImage:"url(https://raw.githubusercontent.com/joaorb64/tournament_api/master/state_icon/".concat(t.state,".png)"),width:"100%",height:"47px",display:"inline-block",backgroundSize:"contain",backgroundRepeat:"no-repeat",backgroundPosition:"center",paddingTop:"32px"}},t.state):null),r.a.createElement("div",{style:{fontSize:"2rem",backgroundColor:"black",color:"white",textAlign:"right",alignSelf:"flex-end",padding:"10px"}},t.score," pts.")),t.avatar?r.a.createElement("a",{href:t.twitter},r.a.createElement("div",{style:{backgroundImage:"url(".concat(t.avatar,")"),width:"96px",height:"96px",backgroundSize:"cover",backgroundPosition:"center",borderRadius:"100%",position:"absolute",right:10,top:10,border:"5px #f0f0f0 solid"}},t.twitter?r.a.createElement("div",{style:{width:"100%",height:"100%",display:"flex",alignItems:"flex-end",justifyContent:"flex-end",margin:"5px"}},r.a.createElement("div",{style:{backgroundImage:"url(/icons/twitter.svg)",width:32,height:32,bottom:0,right:0}})):null)):null))}))),this.state.players.slice(3).map((function(t,a){return r.a.createElement("li",{key:e.state.selectedLeague+"_"+a,class:"slide-fade "+p.a.listItem+" list-group-item",style:{animationDelay:(a+3)/30+"s",cursor:"pointer"},"data-toggle":"modal","data-target":"#playerModal",onClick:function(){return e.openPlayerModal(t)}},r.a.createElement("div",{class:"player-ranking",style:{width:"45px",textAlign:"center",fontSize:"1.2rem"}},t.ranking),t.avatar?r.a.createElement("a",{href:t.twitter},r.a.createElement("div",{class:"player-avatar",style:{backgroundImage:"url(".concat(t.avatar,")"),width:"64px",height:"100%",display:"inline-block",backgroundSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center",backgroundColor:"white"}},t.twitter?r.a.createElement("div",{style:{width:"100%",height:"100%",display:"flex",alignItems:"flex-end",justifyContent:"flex-end"}},r.a.createElement("div",{style:{backgroundImage:"url(/icons/twitter.svg)",width:16,height:16,bottom:0,right:0,margin:"2px"}})):null)):r.a.createElement("div",{class:"player-avatar",style:{width:"64px",height:"48px",display:"inline-block",backgroundSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center"}}),r.a.createElement("div",{class:"state-flag-container",style:{width:"64px",display:"flex",justifyContent:"center",alignItems:"center",padding:"8px"}},t.state?r.a.createElement("div",{class:"state-flag",style:{backgroundImage:"url(https://raw.githubusercontent.com/joaorb64/tournament_api/master/state_icon/".concat(t.state,".png)"),width:"100%",height:"100%",display:"inline-block",backgroundSize:"contain",backgroundRepeat:"no-repeat",backgroundPosition:"center"}},t.state):null),r.a.createElement("div",{class:"player-name-container",style:{display:"flex",flexGrow:1,overflow:"hidden",textOverflow:"ellipsis",justifyContent:"center"}},r.a.createElement("div",{class:"player-name",style:{overflow:"hidden",textOverflow:"ellipsis",overflowWrap:"break-word",lineHeight:"1.6rem"}},t.name),r.a.createElement("div",{class:"player-name-small",style:{overflow:"hidden",textOverflow:"ellipsis",color:"darkgray",fontSize:"0.8rem",whiteSpace:"nowrap",lineHeight:"0.8rem"}},t.full_name)),r.a.createElement("div",{class:"player-score",style:{width:"128px",padding:"5px",display:"flex",flexDirection:"column",justifyContent:"center",flexShrink:0}},r.a.createElement("div",{style:{backgroundColor:"black",flexGrow:1,display:"flex"}},r.a.createElement("div",{style:{backgroundColor:"black",color:"white",fontSize:"1.2rem",lineHeight:"1.2rem",flexGrow:1,alignSelf:"center",width:"100%"}},t.score," pts."))),r.a.createElement("div",{class:"player-main",style:{display:"flex",width:"128px"}},t.mains.length>0?r.a.createElement("div",{style:{backgroundImage:"url(".concat("","/portraits-small/").concat(e.getCharName(t.mains[0].name),".png)"),width:"128px",backgroundPosition:"center",backgroundSize:"cover",backgroundColor:"#ababab",overflow:"hidden"}},r.a.createElement("div",{style:{overflow:"hidden",display:"flex",height:"100%",alignItems:"flex-end",justifyContent:"flex-end"}},t.mains.slice(1).map((function(t){return r.a.createElement("div",{class:"player-main-mini",style:{backgroundImage:"url(http://braacket.com/".concat(e.getCharName(t.icon),")"),width:"24px",height:"24px",backgroundPosition:"center",backgroundSize:"cover",flexGrow:0,display:"flex",flexShrink:1}})})))):r.a.createElement("div",{style:{backgroundImage:"url(".concat("","/portraits-small/","random",".png)"),width:"128px",backgroundPosition:"center",backgroundSize:"cover",backgroundColor:"#ababab"}})))}))))}}]),t}(n.Component),g=a(12),b=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(c.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).state={},a}return Object(d.a)(t,e),Object(s.a)(t,[{key:"componentDidUpdate",value:function(e){}},{key:"render",value:function(){return r.a.createElement("nav",{class:"navbar navbar-expand-md navbar-dark",style:{color:"white",backgroundColor:"#be2018",fontFamily:"SmashFont"}},r.a.createElement(g.b,{class:"navbar-brand",style:{color:"white"},to:"/home/"},"Power Rankings Brasil"),r.a.createElement("button",{class:"navbar-toggler",type:"button","data-toggle":"collapse","data-target":"#navbarNav","aria-controls":"navbarNav","aria-expanded":"false"},r.a.createElement("span",{class:"navbar-toggler-icon",style:{fontFamily:"'Montserrat', sans-serif"}})),r.a.createElement("div",{class:"collapse navbar-collapse",id:"navbarNav"},r.a.createElement("ul",{class:"navbar-nav"},r.a.createElement(g.c,{className:"nav-item nav-link",activeClassName:"nav-item nav-link active",to:"/home/"},r.a.createElement("div",{class:"nav-link"},"Home")),r.a.createElement(g.c,{className:"nav-item nav-link",activeClassName:"nav-item nav-link active",to:"/map/"},r.a.createElement("div",{class:"nav-link"},"Mapa")),r.a.createElement(g.c,{className:"nav-item nav-link",activeClassName:"nav-item nav-link active",to:"/about/"},r.a.createElement("div",{class:"nav-link"},"Sobre")))))}}]),t}(n.Component),f=a(11),y=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(c.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).state={tournaments:null,tournamentColor:{S:"red",A:"orange",B:"brown",C:"darkbrown",D:"gray"}},a}return Object(d.a)(t,e),Object(s.a)(t,[{key:"componentDidUpdate",value:function(e){}},{key:"componentDidMount",value:function(){var e=this;fetch("https://raw.githubusercontent.com/joaorb64/tournament_api/master/out/tournament/prbth.json").then((function(e){return e.json()})).then((function(t){e.state.tournaments=Object.keys(t).map((function(e){return t[e]})),e.state.tournaments.forEach((function(e){e.rank||(e.player_number>=65?e.rank="S":e.player_number>=49?e.rank="A":e.player_number>=33?e.rank="B":e.player_number>=25?e.rank="C":e.rank="D")})),e.state.tournaments=Object.values(e.state.tournaments).sort((function(e,t){return e.name>t.name?1:-1})),console.log(e.state.tournaments),e.setState(e.state)})).catch(console.log)}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{class:"slide-fade list-group-item",style:{backgroundColor:"#f0f0f0",borderRadius:"10px",border:0,marginBottom:"5px",width:"100%",padding:"30px",alignSelf:"center"}},r.a.createElement("h2",null,"Sobre"),r.a.createElement("p",null,"(Em constru\xe7\xe3o)"),r.a.createElement("h2",null,"Meus dados no ranking est\xe3o vazios!"),r.a.createElement("p",null,"Primeiramente, entre em contato com o TO da sua regi\xe3o. Ele poder\xe1 adicionar seu twitter e seus mains ao braacket da sua liga local."),r.a.createElement("p",null,"Para adi\xe7\xe3o de nome completo e estado, pe\xe7a para que o TO entre em contato com ",r.a.createElement("a",{href:"https://twitter.com/piuzera_"},"Piu"),"."),r.a.createElement("p",null,"Para outros casos individuais, utilize o seguinte link para enviar mudan\xe7as: ",r.a.createElement("a",{href:"https://forms.gle/57aGTDPFvwzRNvB59"},"Forms")),r.a.createElement("h2",null,"Metodologia do ranking"),r.a.createElement("p",null,"Campeonatos utilizados para c\xe1lculo do ranking nacional:"),r.a.createElement("table",{class:"table table-striped table-sm"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",{scope:"col"},"Nome"),r.a.createElement("th",{scope:"col"},"Jogadores"),r.a.createElement("th",{scope:"col"},"Tier"))),r.a.createElement("tbody",null,null!=this.state.tournaments?this.state.tournaments.map((function(t){return r.a.createElement("tr",null,r.a.createElement("td",null,t.name),r.a.createElement("td",null,t.player_number),r.a.createElement("td",{style:{color:e.state.tournamentColor[t.rank]}},r.a.createElement("b",null,t.rank)))})):null)))}}]),t}(n.Component),v=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(c.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).state={playerData:null},a}return Object(d.a)(t,e),Object(s.a)(t,[{key:"componentDidUpdate",value:function(e){this.props}},{key:"componentDidMount",value:function(){window.playerModal=this}},{key:"fetchPlayer",value:function(){var e=this;null!=this.player&&(this.setState({playerData:null}),fetch("https://raw.githubusercontent.com/joaorb64/tournament_api/master/player_data/"+this.player+"/data.json").then((function(e){return e.json()})).then((function(t){e.setState({playerData:t})})))}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{class:"modal fade",id:"playerModal",tabindex:"-1",role:"dialog","aria-hidden":"true"},r.a.createElement("div",{class:"modal-dialog modal-dialog-centered modal-lg",role:"document"},r.a.createElement("div",{class:"modal-content"},r.a.createElement("div",{class:"modal-header"},r.a.createElement("h5",{class:"modal-title",id:"exampleModalLongTitle"},"Player"),r.a.createElement("button",{type:"button",class:"close","data-dismiss":"modal","aria-label":"Close"},r.a.createElement("span",{"aria-hidden":"true"},"\xd7"))),r.a.createElement("div",{class:"modal-body"},this.state.playerData?r.a.createElement("div",null,this.state.playerData.name,Object.values(this.state.playerData.rank).map((function(t,a){return e.props.leagues?r.a.createElement("div",null,e.props.leagues.find((function(t){return t.id==Object.keys(e.state.playerData.rank)[a]})).name," - [",t.rank,"] - ",t.score," pts"):r.a.createElement("div",null,Object.keys(e.state.playerData.rank)[a]," - [",t.rank,"] - ",t.score," pts")}))):null),r.a.createElement("div",{class:"modal-footer"}))))}}]),t}(n.Component),k=a(14),w=a.n(k),x=(a(37),a(25)),E=a.n(x),j=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(c.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).state={leagues:{}},a.mymap=null,a.estados=null,a.markers=[],a}return Object(d.a)(t,e),Object(s.a)(t,[{key:"componentDidUpdate",value:function(e){this.props!==e&&(this.state.leagues=e.leagues,this.updateData())}},{key:"updateData",value:function(){var e=this;0!=this.state.leagues.length&&Object.keys(this.state.leagues).forEach((function(t){fetch("https://raw.githubusercontent.com/joaorb64/tournament_api/master/out/"+e.props.leagues[t].id+".json").then((function(e){return e.json()})).then((function(a){if(a){var n=[];Object.keys(a).forEach((function(e){a[e].avatar?a[e].avatar="https://raw.githubusercontent.com/joaorb64/tournament_api/master/".concat(a[e].avatar):a[e].twitter&&(a[e].avatar="https://avatars.io/twitter/".concat(this.getTwitterHandle(a[e].twitter))),a[e].mains||(a[e].mains=[]),0==a[e].mains.length&&a[e].mains.push({name:"Random",icon:""}),a[e].rank&&(a[e].score=a[e].rank[this.props.leagues[t].id].score,a[e].ranking=a[e].rank[this.props.leagues[t].id].rank,a[e].ranking&&n.push(a[e]))}),e),n.sort((function(e,t){return Number(e.ranking)-Number(t.ranking)})),e.state.leagues[t].players=n,e.setState(e.state);var r=e.municipios.find((function(a){return a.nome==e.props.leagues[t].city}));if(r&&e.props.leagues[t].players){var o=w.a.icon({iconUrl:"http://braacket.com/"+e.props.leagues[t].players[0].mains[0].icon,iconSize:[32,32],className:E.a.mapCharIcon}),l=w.a.marker([r.latitude,r.longitude],{icon:o}).addTo(e.mymap);e.markers.push(l)}}})).catch(console.log)}))}},{key:"getTwitterHandle",value:function(e){var t=e.split("/");return t[t.length-1]}},{key:"componentDidMount",value:function(){var e=this;this.state.leagues=this.props.leagues;var t=w.a.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{minZoom:2,maxZoom:19,id:"osm.streets"});this.mymap=w.a.map("mapid",{attributionControl:!1,center:[-29.0529434318608,152.01910972595218],zoom:10}),t.addTo(this.mymap),fetch("/geojson/municipios.json").then((function(e){return e.json()})).then((function(t){e.municipios=t,e.estados=new w.a.GeoJSON.AJAX("/geojson/brazil-states.geojson"),e.estados.on("data:loaded",(function(){e.estados.addTo(e.mymap),e.mymap.fitBounds(e.estados.getBounds()),e.updateData()}))}))}},{key:"render",value:function(){return r.a.createElement("div",{class:"slide-fade list-group-item",style:{backgroundColor:"#f0f0f0",borderRadius:"10px",border:0,marginBottom:"5px",width:"100%",padding:"30px",alignSelf:"center"}},r.a.createElement("div",{id:"mapid",style:{height:"500px"}}))}}]),t}(n.Component),C=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(c.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).state={leagues:[]},a}return Object(d.a)(t,e),Object(s.a)(t,[{key:"componentWillMount",value:function(){var e=this;fetch("https://raw.githubusercontent.com/joaorb64/tournament_api/master/leagues.json").then((function(e){return e.json()})).then((function(t){var a=[];Object.keys(t).forEach((function(n){a.push(fetch("https://raw.githubusercontent.com/joaorb64/tournament_api/master/league_info/"+n+".json").then((function(e){return e.json()})).then((function(a){e.state.leagues.push({id:n,name:a.name,state:t[n].state,city:t[n].city})})))})),Promise.all(a).then((function(){e.setState(e.state)}))})).catch(console.log)}},{key:"componentDidMount",value:function(){document.getElementById("myVideo").play()}},{key:"render",value:function(){var e=this;return r.a.createElement("div",null,r.a.createElement("video",{loop:!0,muted:!0,autoplay:!0,oncanplay:"this.play()",onloadedmetadata:"this.muted=true",id:"myVideo"},r.a.createElement("source",{src:"/background.mp4",type:"video/mp4"})),r.a.createElement(g.a,{basename:""},r.a.createElement(b,null),r.a.createElement("div",{class:"container",style:{marginBottom:"128px",paddingTop:"10px"}},r.a.createElement(f.d,null,r.a.createElement(f.b,{path:"/home/",exact:!0,render:function(t){return r.a.createElement(h,{contacts:e.state.leagues})}}),r.a.createElement(f.b,{path:"/map/",exact:!0,render:function(t){return r.a.createElement(j,{leagues:e.state.leagues})}}),r.a.createElement(f.b,{path:"/about/",exact:!0,render:function(e){return r.a.createElement(y,null)}}),r.a.createElement(f.a,{to:"/home/"})))),r.a.createElement("nav",{class:"navbar fixed-bottom",style:{color:"white",backgroundColor:"#be2018",fontFamily:"SmashFont",fontSize:"15px",textAlign:"right",display:"inline"}},"By Jo\xe3o Ribeiro Bezerra (joaorb64@gmail.com, @joao_shino)"),r.a.createElement(v,{leagues:this.state.leagues}))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(r.a.createElement(C,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[26,1,2]]]);
//# sourceMappingURL=main.5a742ebb.chunk.js.map