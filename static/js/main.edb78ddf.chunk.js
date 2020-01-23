(this.webpackJsonpsmashrankingsbrazil=this.webpackJsonpsmashrankingsbrazil||[]).push([[0],{14:function(e,t,a){},15:function(e,t,a){},16:function(e,t,a){"use strict";a.r(t);var n=a(0),i=a.n(n),r=a(8),o=a.n(r),l=(a(14),a(2)),s=a(3),c=a(5),d=a(4),p=a(6),h=(a(15),a(1)),g=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,i=new Array(n),r=0;r<n;r++)i[r]=arguments[r];return(a=Object(c.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(i)))).state={selectedLeague:0,players:[]},a}return Object(p.a)(t,e),Object(s.a)(t,[{key:"componentDidUpdate",value:function(e){e!==this.props&&this.updateData()}},{key:"updateData",value:function(){var e=this;fetch("https://raw.githubusercontent.com/joaorb64/tournament_api/master/out/"+this.props.contacts[this.state.selectedLeague].id+".json").then((function(e){return e.json()})).then((function(t){if(t){var a=[];Object.keys(t).forEach((function(e){t[e].avatar?t[e].avatar="https://raw.githubusercontent.com/joaorb64/tournament_api/master/".concat(t[e].avatar):t[e].twitter&&(t[e].avatar="https://avatars.io/twitter/".concat(this.getTwitterHandle(t[e].twitter))),t[e].mains||(t[e].mains=[]),0==t[e].mains.length&&t[e].mains.push({name:"Random",icon:""}),a.push(t[e])}),e),a.sort((function(e,t){return parseInt(e.score)>parseInt(t.score)?-1:parseInt(e.score)<parseInt(t.score)?1:0})),e.setState({players:a})}})).catch(console.log)}},{key:"selectLeague",value:function(e){e!=this.state.selectedLeague&&(this.state.selectedLeague=e,this.updateData())}},{key:"getCharName",value:function(e){return e.toLowerCase().replace(/ /g,"_")}},{key:"getTwitterHandle",value:function(e){var t=e.split("/");return t[t.length-1]}},{key:"normalizePlayerName",value:function(e){return e.toLowerCase().normalize("NFKD").replace("[ ]+","_").replace("[^0-9a-zA-Z_-]","")}},{key:"render",value:function(){var e,t,a,n=this;return console.log(this.state.players),i.a.createElement("div",{style:{textAlign:"center",fontFamily:"SmashFont"}},i.a.createElement("div",{class:"btn-group btn-group-justified col-12",role:"group",style:{marginTop:10,padding:"0 10px"}},this.props.contacts.map((function(e,t){return i.a.createElement("button",{onClick:function(){return n.selectLeague(t)},type:"button",class:"btn btn-danger",style:{flexGrow:1,flexBasis:0,overflow:"hidden",textOverflow:"ellipsis"}},i.a.createElement("div",{style:{width:"32px",height:"32px",display:"inline-block",backgroundSize:"contain",backgroundRepeat:"no-repeat",backgroundPosition:"center",verticalAlign:"inherit",backgroundColor:"white",borderRadius:"100%",marginRight:"5px",backgroundImage:"url(https://raw.githubusercontent.com/joaorb64/tournament_api/master/league_icon/".concat(e.id,".png)")}}),e.name)}))),i.a.createElement("ul",{class:"list-group",style:{padding:"10px"}},this.state.players.length>3?i.a.createElement("div",{class:"row no-gutters"},i.a.createElement("div",{class:"col-md-8 firstplayer-col",style:{paddingRight:"5px"}},i.a.createElement("li",{key:this.state.selectedLeague+"_0",class:"slide-fade list-group-item",style:(e={backgroundColor:"#f0f0f0",borderRadius:"10px",border:0,marginBottom:"5px",width:"100%",height:"512px",lineHeight:"48px",padding:0,display:"flex",alignSelf:"center",overflow:"hidden"},Object(h.a)(e,"backgroundColor","#f7c407"),Object(h.a)(e,"animationDelay","0s"),e)},i.a.createElement("div",{style:{backgroundImage:"url(./portraits-full/".concat(this.getCharName(this.state.players[0].mains[0].name),".png)"),display:"flex",width:"100%",backgroundPosition:"center",backgroundSize:"cover",filter:"drop-shadow(10px 10px 0px #000000AF)"}},i.a.createElement("div",{style:{backgroundColor:"#f0f0f0",alignItems:"center",display:"flex",flexDirection:"column",height:"80px",position:"absolute",left:"0px",right:"0px",bottom:0,justifyContent:"center"}},i.a.createElement("div",{style:{flexGrow:0,fontSize:"3.2rem",lineHeight:"3.2rem",width:"100%",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}},this.state.players[0].name),i.a.createElement("div",{style:{flexGrow:0,fontSize:"1.2rem",lineHeight:"1.2rem",width:"100%",color:"darkgray",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}},this.state.players[0].full_name))),i.a.createElement("div",{style:{width:"300px",height:"300px",position:"absolute",backgroundColor:"#f0f0f0",top:-150,left:-150,transform:"rotate(-45deg)"}}),i.a.createElement("div",{style:{width:"150px",height:"150px",position:"absolute",top:0,left:"-20px",fontSize:"8rem",lineHeight:"150px"}},"1"),i.a.createElement("div",{style:{position:"absolute",left:"0px",right:"0px",bottom:"80px",color:"white",display:"flex",whiteSpace:"nowrap"}},i.a.createElement("div",{style:{display:"flex",flexGrow:1,flexWrap:"wrap",alignSelf:"flex-end",padding:"10px",filter:"drop-shadow(2px 2px 0px black)"}},this.state.players[0].mains.length>0?this.state.players[0].mains.slice(1).map((function(e){return i.a.createElement("div",{style:{backgroundImage:"url(http://braacket.com/".concat(n.getCharName(e.icon),")"),width:"32px",height:"32px",backgroundPosition:"center",backgroundSize:"cover",flexGrow:0,display:"inline-block"}})})):null),i.a.createElement("div",{style:{fontSize:"3rem",backgroundColor:"black",color:"white",textAlign:"right",alignSelf:"flex-end",padding:"10px"}},this.state.players[0].score," pts.")),this.state.players[0].avatar?i.a.createElement("div",{style:{backgroundImage:"url(".concat(this.state.players[0].avatar,")"),width:"128px",height:"128px",backgroundSize:"cover",backgroundPosition:"center",borderRadius:"100%",position:"absolute",right:10,top:10,border:"5px #f0f0f0 solid"}}):null),i.a.createElement("div",{class:"d-md-block",style:{display:"none",width:5}})),i.a.createElement("div",{class:"col-md-4"},i.a.createElement("div",{class:""},i.a.createElement("li",{key:this.state.selectedLeague+"_1",class:"slide-fade list-group-item",style:(t={backgroundColor:"#f0f0f0",borderRadius:"10px",border:0,marginBottom:"5px",width:"100%",height:"302px",lineHeight:"48px",padding:0,display:"flex",alignSelf:"center",overflow:"hidden"},Object(h.a)(t,"backgroundColor","#b9b9b9"),Object(h.a)(t,"animationDelay",1/30+"s"),t)},i.a.createElement("div",{style:{backgroundImage:"url(./portraits-full/".concat(this.getCharName(this.state.players[1].mains[0].name),".png)"),display:"flex",width:"100%",backgroundPosition:"center",backgroundSize:"cover",filter:"drop-shadow(10px 10px 0px #000000AF)"}},i.a.createElement("div",{style:{backgroundColor:"#f0f0f0",alignItems:"center",display:"flex",flexDirection:"column",height:"60px",position:"absolute",left:"0px",right:"0px",bottom:0,justifyContent:"center"}},i.a.createElement("div",{style:{flexGrow:0,fontSize:"2rem",lineHeight:"2rem",width:"100%",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}},this.state.players[1].name),i.a.createElement("div",{style:{flexGrow:0,fontSize:"1rem",lineHeight:"1rem",width:"100%",color:"darkgray",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}},this.state.players[1].full_name))),i.a.createElement("div",{style:{width:"200px",height:"200px",position:"absolute",backgroundColor:"#f0f0f0",top:-100,left:-100,transform:"rotate(-45deg)"}}),i.a.createElement("div",{style:{width:"100px",height:"100px",position:"absolute",top:0,left:"-10px",fontSize:"5rem",lineHeight:"100px"}},"2"),i.a.createElement("div",{style:{position:"absolute",left:"0px",right:"0px",bottom:"60px",color:"white",display:"flex",whiteSpace:"nowrap",lineHeight:"32px"}},i.a.createElement("div",{style:{display:"flex",flexGrow:1,flexWrap:"wrap",alignSelf:"flex-end",padding:"10px",filter:"drop-shadow(2px 2px 0px black)"}},this.state.players[1].mains.length>0?this.state.players[1].mains.slice(1).map((function(e){return i.a.createElement("div",{style:{backgroundImage:"url(http://braacket.com/".concat(n.getCharName(e.icon),")"),width:"32px",height:"32px",backgroundPosition:"center",backgroundSize:"cover",flexGrow:0,display:"inline-block"}})})):null),i.a.createElement("div",{style:{fontSize:"2rem",backgroundColor:"black",color:"white",textAlign:"right",alignSelf:"flex-end",padding:"10px"}},this.state.players[1].score," pts.")),this.state.players[1].avatar?i.a.createElement("div",{style:{backgroundImage:"url(".concat(this.state.players[1].avatar,")"),width:"96px",height:"96px",backgroundSize:"cover",backgroundPosition:"center",borderRadius:"100%",position:"absolute",right:10,top:10,border:"5px #f0f0f0 solid"}}):null)),i.a.createElement("div",{class:""},i.a.createElement("li",{key:this.state.selectedLeague+"_2",class:"slide-fade list-group-item",style:(a={backgroundColor:"#f0f0f0",borderRadius:"10px",border:0,marginBottom:"5px",width:"100%",height:"205px",lineHeight:"48px",padding:0,display:"flex",alignSelf:"center",overflow:"hidden"},Object(h.a)(a,"backgroundColor","#c55d30"),Object(h.a)(a,"animationDelay",2/30+"s"),a)},i.a.createElement("div",{style:{backgroundImage:"url(./portraits-full/".concat(this.getCharName(this.state.players[2].mains[0].name),".png)"),display:"flex",width:"100%",backgroundPosition:"center",backgroundSize:"cover",filter:"drop-shadow(10px 10px 0px #000000AF)"}},i.a.createElement("div",{style:{backgroundColor:"#f0f0f0",alignItems:"center",display:"flex",flexDirection:"column",height:"50px",position:"absolute",left:"0px",right:"0px",bottom:0,justifyContent:"center"}},i.a.createElement("div",{style:{flexGrow:0,fontSize:"2rem",lineHeight:"2rem",width:"100%",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}},this.state.players[2].name),i.a.createElement("div",{style:{flexGrow:0,fontSize:"1rem",lineHeight:"1rem",width:"100%",color:"darkgray",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}},this.state.players[2].full_name))),i.a.createElement("div",{style:{width:"160px",height:"160px",position:"absolute",backgroundColor:"#f0f0f0",top:-80,left:-80,transform:"rotate(-45deg)"}}),i.a.createElement("div",{style:{width:"80px",height:"80px",position:"absolute",top:0,left:"-8px",fontSize:"4rem",lineHeight:"80px"}},"3"),i.a.createElement("div",{style:{position:"absolute",left:"0px",right:"0px",bottom:"50px",color:"white",display:"flex",whiteSpace:"nowrap",lineHeight:"24px"}},i.a.createElement("div",{style:{display:"flex",flexGrow:1,flexWrap:"wrap",alignSelf:"flex-end",padding:"10px",filter:"drop-shadow(2px 2px 0px black)"}},this.state.players[2].mains.length>0?this.state.players[2].mains.slice(1).map((function(e){return i.a.createElement("div",{style:{backgroundImage:"url(http://braacket.com/".concat(n.getCharName(e.icon),")"),width:"32px",height:"32px",backgroundPosition:"center",backgroundSize:"cover",flexGrow:0,display:"inline-block"}})})):null),i.a.createElement("div",{style:{fontSize:"1.6rem",backgroundColor:"black",color:"white",textAlign:"right",alignSelf:"flex-end",padding:"10px"}},this.state.players[2].score," pts.")),this.state.players[2].avatar?i.a.createElement("div",{style:{backgroundImage:"url(".concat(this.state.players[2].avatar,")"),width:"84px",height:"84px",backgroundSize:"cover",backgroundPosition:"center",borderRadius:"100%",position:"absolute",right:10,top:10,border:"5px #f0f0f0 solid"}}):null)))):null,this.state.players.slice(3).map((function(e,t){return i.a.createElement("li",{key:n.state.selectedLeague+"_"+t,class:"slide-fade list-group-item",style:{backgroundColor:"#f0f0f0",borderRadius:"10px",border:0,marginBottom:"5px",width:"100%",height:"42px",lineHeight:"48px",padding:0,display:"flex",alignSelf:"center",overflow:"hidden",animationDelay:(t+3)/30+"s"}},i.a.createElement("div",{class:"player-ranking",style:{width:"45px",textAlign:"center",fontSize:"1.2rem"}},t+4),e.avatar?i.a.createElement("div",{class:"player-avatar",style:{backgroundImage:"url(".concat(e.avatar,")"),width:"64px",height:"48px",display:"inline-block",backgroundSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center",backgroundColor:"white"}}):i.a.createElement("div",{class:"player-avatar",style:{width:"64px",height:"48px",display:"inline-block",backgroundSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center"}}),i.a.createElement("div",{class:"state-flag-container",style:{width:"64px",display:"flex",justifyContent:"center",alignItems:"center",padding:"8px"}},e.state?i.a.createElement("div",{class:"state-flag",style:{backgroundImage:"url(https://raw.githubusercontent.com/joaorb64/tournament_api/master/state_icon/".concat(e.state,".png)"),width:"100%",height:"100%",display:"inline-block",backgroundSize:"contain",backgroundRepeat:"no-repeat",backgroundPosition:"center"}}):null),i.a.createElement("div",{style:{display:"flex",flexGrow:1,overflow:"hidden",textOverflow:"ellipsis",justifyContent:"center"}},i.a.createElement("div",{class:"player-name",style:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flexShrink:0}},e.name),i.a.createElement("div",{class:"player-name-small",style:{overflow:"hidden",textOverflow:"ellipsis",color:"darkgray",paddingLeft:5,fontSize:"0.8rem",whiteSpace:"nowrap"}},e.full_name)),i.a.createElement("div",{class:"player-score",style:{width:"128px",padding:"5px",display:"flex",flexDirection:"column",justifyContent:"center",flexShrink:0}},i.a.createElement("div",{style:{backgroundColor:"black",flexGrow:1,display:"flex"}},i.a.createElement("div",{style:{backgroundColor:"black",color:"white",fontSize:"1.2rem",lineHeight:"1.2rem",flexGrow:1,alignSelf:"center",width:"100%"}},e.score," pts."))),i.a.createElement("div",{class:"player-main",style:{display:"flex",width:"128px"}},e.mains.length>0?i.a.createElement("div",{style:{backgroundImage:"url(./portraits-small/".concat(n.getCharName(e.mains[0].name),".png)"),width:"128px",backgroundPosition:"center",backgroundSize:"cover",backgroundColor:"#ababab"}}):i.a.createElement("div",{style:{backgroundImage:"url(./portraits-small/".concat("random",".png)"),width:"128px",backgroundPosition:"center",backgroundSize:"cover",backgroundColor:"#ababab"}}),i.a.createElement("div",{style:{position:"absolute",display:"flex",right:0,bottom:0}},e.mains.slice(1).map((function(e){return i.a.createElement("div",{style:{backgroundImage:"url(http://braacket.com/".concat(n.getCharName(e.icon),")"),width:"24px",height:"24px",backgroundPosition:"center",backgroundSize:"cover",flexGrow:0,display:"inline-block"}})})))))}))))}}]),t}(n.Component),u=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,i=new Array(n),r=0;r<n;r++)i[r]=arguments[r];return(a=Object(c.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(i)))).state={leagues:[]},a}return Object(p.a)(t,e),Object(s.a)(t,[{key:"componentWillMount",value:function(){var e=this;fetch("https://raw.githubusercontent.com/joaorb64/tournament_api/master/leagues.json").then((function(e){return e.json()})).then((function(t){Object.keys(t).forEach((function(t){fetch("https://raw.githubusercontent.com/joaorb64/tournament_api/master/league_info/"+t+".json").then((function(e){return e.json()})).then((function(a){e.state.leagues.push({id:t,name:a.name}),e.setState(e.state)}))}))})).catch(console.log)}},{key:"componentDidMount",value:function(){document.getElementById("myVideo").play()}},{key:"render",value:function(){return i.a.createElement("div",null,i.a.createElement("video",{loop:!0,muted:!0,autoplay:!0,oncanplay:"this.play()",onloadedmetadata:"this.muted=true",id:"myVideo"},i.a.createElement("source",{src:"./background.mp4",type:"video/mp4"})),i.a.createElement("div",{class:"container",style:{backgroundColor:"#2a2335",marginBottom:"128px"}},i.a.createElement(g,{contacts:this.state.leagues})),i.a.createElement("nav",{class:"navbar fixed-bottom",style:{color:"white",backgroundColor:"#be2018",fontFamily:"SmashFont",fontSize:"15px",textAlign:"right",display:"inline"}},"By Jo\xe3o Ribeiro Bezerra (joaorb64@gmail.com, @joao_shino)"))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(i.a.createElement(u,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},9:function(e,t,a){e.exports=a(16)}},[[9,1,2]]]);
//# sourceMappingURL=main.edb78ddf.chunk.js.map