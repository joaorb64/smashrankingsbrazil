(this.webpackJsonpsmashrankingsbrazil=this.webpackJsonpsmashrankingsbrazil||[]).push([[0],{11:function(e,t,a){e.exports={teste:"contacts_teste__1i2X6","teste-menu":"contacts_teste-menu__3GCjV",title:"contacts_title__3KfmP",listItem:"contacts_listItem__CzeRn",listItemParent:"contacts_listItemParent__3ZZLw",listItemChild:"contacts_listItemChild__3Awjv"}},23:function(e,t,a){e.exports=a(35)},28:function(e,t,a){},29:function(e,t,a){},35:function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),r=a(20),l=a.n(r),i=(a(28),a(4)),c=a(5),s=a(7),d=a(6),u=a(8),p=(a(29),a(11)),m=a.n(p),h=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,o=new Array(n),r=0;r<n;r++)o[r]=arguments[r];return(a=Object(s.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(o)))).state={selectedLeague:0,players:[],top3Colors:["#D6AF36","#D7D7D7","#A77044"],top3Colors2:["#AF9500","#B4B4B4","#6A3805"],top3Colors3:["#C9B037","#A7A7AD","#824A02"]},a}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidUpdate",value:function(e){e!==this.props&&this.updateData()}},{key:"componentDidMount",value:function(){this.props.contacts.length>0&&this.updateData()}},{key:"updateData",value:function(){var e=this;fetch("https://raw.githubusercontent.com/joaorb64/tournament_api/master/out/"+this.props.contacts[this.state.selectedLeague].id+".json").then((function(e){return e.json()})).then((function(t){if(t){var a=[];Object.keys(t).forEach((function(e){t[e].avatar?t[e].avatar="https://raw.githubusercontent.com/joaorb64/tournament_api/master/".concat(t[e].avatar):t[e].twitter&&(t[e].avatar="https://avatars.io/twitter/".concat(this.getTwitterHandle(t[e].twitter))),t[e].mains||(t[e].mains=[]),0==t[e].mains.length&&t[e].mains.push({name:"Random",icon:""}),t[e].score||t[e].rank&&(t[e].score=t[e].rank[this.props.contacts[this.state.selectedLeague].id].score),a.push(t[e])}),e),a.sort((function(e,t){return parseInt(e.score)>parseInt(t.score)?-1:parseInt(e.score)<parseInt(t.score)?1:0})),e.setState({players:a})}})).catch(console.log)}},{key:"selectLeague",value:function(e){e!=this.state.selectedLeague&&(this.state.selectedLeague=e,this.updateData())}},{key:"getCharName",value:function(e){return e.toLowerCase().replace(/ /g,"_")}},{key:"getTwitterHandle",value:function(e){var t=e.split("/");return t[t.length-1]}},{key:"normalizePlayerName",value:function(e){return e.normalize("NFKD").replace(/ /g,"_").replace("[^0-9a-zA-Z_-]","").replace("|","")}},{key:"openPlayerModal",value:function(e){window.playerModal&&(window.playerModal.player=this.normalizePlayerName(e.name),window.playerModal.fetchPlayer())}},{key:"render",value:function(){var e=this;return o.a.createElement("div",{style:{textAlign:"center",fontFamily:"SmashFont"}},o.a.createElement("div",{class:"col-12",style:{padding:"0 10px"}},o.a.createElement("div",{class:"dropdown"},o.a.createElement("button",{class:m.a.teste+" btn btn-secondary col-12 dropdown-toggle",type:"button",id:"dropdownMenuButton","data-toggle":"dropdown","aria-haspopup":"true","aria-expanded":"false"},this.props.contacts.length>0?o.a.createElement("div",{class:m.a.title},o.a.createElement("div",{style:{width:"32px",height:"32px",display:"inline-block",backgroundSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center",verticalAlign:"inherit",backgroundColor:"white",borderRadius:"100%",marginRight:"10px",backgroundImage:"url(https://raw.githubusercontent.com/joaorb64/tournament_api/master/league_icon/".concat(this.props.contacts[this.state.selectedLeague].id,".png)")}}),this.props.contacts[this.state.selectedLeague].name):"Loading..."),o.a.createElement("div",{class:m.a["teste-menu"]+" dropdown-menu col-12","aria-labelledby":"dropdownMenuButton"},this.props.contacts.map((function(t,a){return o.a.createElement("a",{class:"dropdown-item "+m.a.teste,href:"#",onClick:function(){return e.selectLeague(a)}},o.a.createElement("div",{style:{width:"32px",height:"32px",display:"inline-block",backgroundSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center",verticalAlign:"inherit",backgroundColor:"white",borderRadius:"100%",marginRight:"10px",backgroundImage:"url(https://raw.githubusercontent.com/joaorb64/tournament_api/master/league_icon/".concat(t.id,".png)")}}),t.name)}))))),o.a.createElement("ul",{class:"list-group",style:{padding:"10px"}},o.a.createElement("div",{class:"row no-gutters",style:{margin:"0 -4px"}},this.state.players.slice(0,3).map((function(t,a){return o.a.createElement("div",{class:"col-md-4 "+m.a.listItemParent,style:{padding:"0px 4px",cursor:"pointer"},"data-toggle":"modal","data-target":"#playerModal",onClick:function(){return e.openPlayerModal(t)}},o.a.createElement("li",{key:e.state.selectedLeague+"_"+a,class:"slide-fade list-group-item",style:{backgroundColor:e.state.top3Colors[a],borderRadius:"10px",border:0,marginBottom:"5px",width:"100%",height:"302px",lineHeight:"48px",padding:0,display:"flex",alignSelf:"center",overflow:"hidden",animationDelay:a/30+"s"}},o.a.createElement("div",{style:{backgroundColor:e.state.top3Colors2[a],position:"absolute",top:0,bottom:0,left:0,right:0,clipPath:"polygon(0 0, 0% 100%, 100% 100%)"}}),o.a.createElement("div",{style:{backgroundColor:e.state.top3Colors3[a],position:"absolute",top:0,bottom:0,left:0,right:0,clipPath:"polygon(0 60%, 0% 100%, 100% 100%)"}}),o.a.createElement("div",{style:{backgroundImage:"url(".concat("","/portraits-full/").concat(e.getCharName(t.mains[0].name),".png)"),display:"flex",width:"100%",backgroundPosition:"center",backgroundSize:"cover",filter:"drop-shadow(10px 10px 0px #000000AF)"}},o.a.createElement("div",{class:m.a.listItemChild,style:{backgroundColor:"#f0f0f0",alignItems:"center",display:"flex",flexDirection:"column",height:"60px",position:"absolute",left:"0px",right:"0px",bottom:0,justifyContent:"center"}},o.a.createElement("div",{style:{flexGrow:0,fontSize:"2rem",lineHeight:"2rem",width:"100%",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}},t.name),o.a.createElement("div",{style:{flexGrow:0,fontSize:"1rem",lineHeight:"1rem",width:"100%",color:"darkgray",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}},t.full_name))),o.a.createElement("div",{style:{width:"200px",height:"200px",position:"absolute",backgroundColor:"#f0f0f0",top:-100,left:-100,transform:"rotate(-45deg)"}}),o.a.createElement("div",{style:{width:"100px",height:"100px",position:"absolute",top:0,left:"-10px",fontSize:"5rem",lineHeight:"100px"}},a+1),o.a.createElement("div",{style:{position:"absolute",left:"0px",right:"0px",bottom:"60px",color:"white",display:"flex",whiteSpace:"nowrap",lineHeight:"32px"}},o.a.createElement("div",{style:{display:"flex",flexGrow:1,flexWrap:"wrap",alignSelf:"flex-end",padding:"10px",filter:"drop-shadow(2px 2px 0px black)"}},t.mains.length>0?t.mains.slice(1).map((function(t){return o.a.createElement("div",{style:{backgroundImage:"url(http://braacket.com/".concat(e.getCharName(t.icon),")"),width:"32px",height:"32px",backgroundPosition:"center",backgroundSize:"cover",flexGrow:0,display:"inline-block"}})})):null),o.a.createElement("div",{style:{fontSize:"2rem",backgroundColor:"black",color:"white",textAlign:"right",alignSelf:"flex-end",padding:"10px"}},t.score," pts.")),t.avatar?o.a.createElement("div",{style:{backgroundImage:"url(".concat(t.avatar,")"),width:"96px",height:"96px",backgroundSize:"cover",backgroundPosition:"center",borderRadius:"100%",position:"absolute",right:10,top:10,border:"5px #f0f0f0 solid"}}):null))}))),this.state.players.slice(3).map((function(t,a){return o.a.createElement("li",{key:e.state.selectedLeague+"_"+a,class:"slide-fade "+m.a.listItem+" list-group-item",style:{animationDelay:(a+3)/30+"s",cursor:"pointer"},"data-toggle":"modal","data-target":"#playerModal",onClick:function(){return e.openPlayerModal(t)}},o.a.createElement("div",{class:"player-ranking",style:{width:"45px",textAlign:"center",fontSize:"1.2rem"}},a+4),t.avatar?o.a.createElement("div",{class:"player-avatar",style:{backgroundImage:"url(".concat(t.avatar,")"),width:"64px",height:"48px",display:"inline-block",backgroundSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center",backgroundColor:"white"}}):o.a.createElement("div",{class:"player-avatar",style:{width:"64px",height:"48px",display:"inline-block",backgroundSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center"}}),o.a.createElement("div",{class:"state-flag-container",style:{width:"64px",display:"flex",justifyContent:"center",alignItems:"center",padding:"8px"}},t.state?o.a.createElement("div",{class:"state-flag",style:{backgroundImage:"url(https://raw.githubusercontent.com/joaorb64/tournament_api/master/state_icon/".concat(t.state,".png)"),width:"100%",height:"100%",display:"inline-block",backgroundSize:"contain",backgroundRepeat:"no-repeat",backgroundPosition:"center"}}):null),o.a.createElement("div",{class:"player-name-container",style:{display:"flex",flexGrow:1,overflow:"hidden",textOverflow:"ellipsis",justifyContent:"center"}},o.a.createElement("div",{class:"player-name",style:{overflow:"hidden",textOverflow:"ellipsis",overflowWrap:"break-word",lineHeight:"1.6rem"}},t.name),o.a.createElement("div",{class:"player-name-small",style:{overflow:"hidden",textOverflow:"ellipsis",color:"darkgray",fontSize:"0.8rem",whiteSpace:"nowrap",lineHeight:"0.8rem"}},t.full_name)),o.a.createElement("div",{class:"player-score",style:{width:"128px",padding:"5px",display:"flex",flexDirection:"column",justifyContent:"center",flexShrink:0}},o.a.createElement("div",{style:{backgroundColor:"black",flexGrow:1,display:"flex"}},o.a.createElement("div",{style:{backgroundColor:"black",color:"white",fontSize:"1.2rem",lineHeight:"1.2rem",flexGrow:1,alignSelf:"center",width:"100%"}},t.score," pts."))),o.a.createElement("div",{class:"player-main",style:{display:"flex",width:"128px"}},t.mains.length>0?o.a.createElement("div",{style:{backgroundImage:"url(".concat("","/portraits-small/").concat(e.getCharName(t.mains[0].name),".png)"),width:"128px",backgroundPosition:"center",backgroundSize:"cover",backgroundColor:"#ababab",overflow:"hidden"}},o.a.createElement("div",{style:{overflow:"hidden",display:"flex",height:"100%",alignItems:"flex-end",justifyContent:"flex-end"}},t.mains.slice(1).map((function(t){return o.a.createElement("div",{class:"player-main-mini",style:{backgroundImage:"url(http://braacket.com/".concat(e.getCharName(t.icon),")"),width:"24px",height:"24px",backgroundPosition:"center",backgroundSize:"cover",flexGrow:0,display:"flex",flexShrink:1}})})))):o.a.createElement("div",{style:{backgroundImage:"url(".concat("","/portraits-small/","random",".png)"),width:"128px",backgroundPosition:"center",backgroundSize:"cover",backgroundColor:"#ababab"}})))}))))}}]),t}(n.Component),g=a(13),b=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,o=new Array(n),r=0;r<n;r++)o[r]=arguments[r];return(a=Object(s.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(o)))).state={},a}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidUpdate",value:function(e){}},{key:"render",value:function(){return o.a.createElement("nav",{class:"navbar navbar-expand-md navbar-dark",style:{color:"white",backgroundColor:"#be2018",fontFamily:"SmashFont"}},o.a.createElement(g.b,{class:"navbar-brand",style:{color:"white"},to:"/home/"},"Power Rankings Brasil"),o.a.createElement("button",{class:"navbar-toggler",type:"button","data-toggle":"collapse","data-target":"#navbarNav","aria-controls":"navbarNav","aria-expanded":"false"},o.a.createElement("span",{class:"navbar-toggler-icon",style:{fontFamily:"'Montserrat', sans-serif"}})),o.a.createElement("div",{class:"collapse navbar-collapse",id:"navbarNav"},o.a.createElement("ul",{class:"navbar-nav"},o.a.createElement(g.c,{className:"nav-item nav-link",activeClassName:"nav-item nav-link active",to:"/home/"},o.a.createElement("div",{class:"nav-link"},"Home")),o.a.createElement(g.c,{className:"nav-item nav-link",activeClassName:"nav-item nav-link active",to:"/about/"},o.a.createElement("div",{class:"nav-link"},"Sobre")))))}}]),t}(n.Component),f=a(10),y=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,o=new Array(n),r=0;r<n;r++)o[r]=arguments[r];return(a=Object(s.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(o)))).state={tournaments:null},a}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidUpdate",value:function(e){}},{key:"componentDidMount",value:function(){var e=this;fetch("https://raw.githubusercontent.com/joaorb64/tournament_api/master/out/tournament/prbth.json").then((function(e){return e.json()})).then((function(t){e.state.tournaments=Object.keys(t).map((function(e){return t[e]})),e.state.tournaments.forEach((function(e){e.rank||(e.player_number>=65?e.rank="S":e.player_number>=49?e.rank="A":e.player_number>=33?e.rank="B":e.player_number>=25?e.rank="C":e.rank="D")})),e.setState(e.state)})).catch(console.log)}},{key:"render",value:function(){return o.a.createElement("div",{class:"slide-fade list-group-item",style:{backgroundColor:"#f0f0f0",borderRadius:"10px",border:0,marginBottom:"5px",width:"100%",padding:"30px",alignSelf:"center"}},o.a.createElement("h2",null,"Sobre"),o.a.createElement("p",null,"(Em constru\xe7\xe3o)"),o.a.createElement("h2",null,"Meus dados no ranking est\xe3o vazios!"),o.a.createElement("p",null,"Primeiramente, entre em contato com o TO da sua regi\xe3o. Ele poder\xe1 adicionar seu twitter e seus mains ao braacket da sua liga local."),o.a.createElement("p",null,"Para adi\xe7\xe3o de nome completo e estado, pe\xe7a para que o TO entre em contato com ",o.a.createElement("a",{href:"https://twitter.com/piuzera_"},"Piu"),"."),o.a.createElement("p",null,"Para outros casos individuais, utilize o seguinte link para enviar mudan\xe7as: ",o.a.createElement("a",{href:"https://forms.gle/57aGTDPFvwzRNvB59"},"Forms")),o.a.createElement("h2",null,"Metodologia do ranking"),o.a.createElement("p",null,"Campeonatos utilizados para c\xe1lculo do ranking nacional (tier):"),o.a.createElement("ul",null,null!=this.state.tournaments?this.state.tournaments.map((function(e){return o.a.createElement("li",null,e.name+" ("+e.rank+")")})):null))}}]),t}(n.Component),v=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,o=new Array(n),r=0;r<n;r++)o[r]=arguments[r];return(a=Object(s.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(o)))).state={playerData:null},a}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidUpdate",value:function(e){this.props}},{key:"componentDidMount",value:function(){window.playerModal=this}},{key:"fetchPlayer",value:function(){var e=this;null!=this.player&&(this.setState({playerData:null}),fetch("https://raw.githubusercontent.com/joaorb64/tournament_api/master/player_data/"+this.player+"/data.json").then((function(e){return e.json()})).then((function(t){e.setState({playerData:t})})))}},{key:"render",value:function(){var e=this;return o.a.createElement("div",{class:"modal fade",id:"playerModal",tabindex:"-1",role:"dialog","aria-hidden":"true"},o.a.createElement("div",{class:"modal-dialog modal-dialog-centered modal-lg",role:"document"},o.a.createElement("div",{class:"modal-content"},o.a.createElement("div",{class:"modal-header"},o.a.createElement("h5",{class:"modal-title",id:"exampleModalLongTitle"},"Player"),o.a.createElement("button",{type:"button",class:"close","data-dismiss":"modal","aria-label":"Close"},o.a.createElement("span",{"aria-hidden":"true"},"\xd7"))),o.a.createElement("div",{class:"modal-body"},this.state.playerData?o.a.createElement("div",null,this.state.playerData.name,Object.values(this.state.playerData.rank).map((function(t,a){return o.a.createElement("div",null,Object.keys(e.state.playerData.rank)[a]," - [",t.rank,"] - ",t.score," pts")}))):null),o.a.createElement("div",{class:"modal-footer"},o.a.createElement("button",{type:"button",class:"btn btn-secondary","data-dismiss":"modal"},"Close"),o.a.createElement("button",{type:"button",class:"btn btn-primary"},"Save changes")))))}}]),t}(n.Component),k=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,o=new Array(n),r=0;r<n;r++)o[r]=arguments[r];return(a=Object(s.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(o)))).state={leagues:[]},a}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentWillMount",value:function(){var e=this;fetch("https://raw.githubusercontent.com/joaorb64/tournament_api/master/leagues.json").then((function(e){return e.json()})).then((function(t){Object.keys(t).forEach((function(t){fetch("https://raw.githubusercontent.com/joaorb64/tournament_api/master/league_info/"+t+".json").then((function(e){return e.json()})).then((function(a){e.state.leagues.push({id:t,name:a.name})})).then((function(){e.setState(e.state)}))}))})).catch(console.log)}},{key:"componentDidMount",value:function(){document.getElementById("myVideo").play()}},{key:"render",value:function(){var e=this;return o.a.createElement("div",null,o.a.createElement("video",{loop:!0,muted:!0,autoplay:!0,oncanplay:"this.play()",onloadedmetadata:"this.muted=true",id:"myVideo"},o.a.createElement("source",{src:"./background.mp4",type:"video/mp4"})),o.a.createElement(g.a,{basename:""},o.a.createElement(b,null),o.a.createElement("div",{class:"container",style:{marginBottom:"128px",paddingTop:"10px"}},o.a.createElement(f.d,null,o.a.createElement(f.b,{path:"/home/",exact:!0,render:function(t){return o.a.createElement(h,{contacts:e.state.leagues})}}),o.a.createElement(f.b,{path:"/about/",exact:!0,render:function(e){return o.a.createElement(y,null)}}),o.a.createElement(f.a,{to:"/home/"})))),o.a.createElement("nav",{class:"navbar fixed-bottom",style:{color:"white",backgroundColor:"#be2018",fontFamily:"SmashFont",fontSize:"15px",textAlign:"right",display:"inline"}},"By Jo\xe3o Ribeiro Bezerra (joaorb64@gmail.com, @joao_shino)"),o.a.createElement(v,null))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(o.a.createElement(k,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[23,1,2]]]);
//# sourceMappingURL=main.7478a427.chunk.js.map