(this.webpackJsonpsmashrankingsbrazil=this.webpackJsonpsmashrankingsbrazil||[]).push([[0],{14:function(e,t,a){},15:function(e,t,a){},16:function(e,t,a){"use strict";a.r(t);var o=a(0),i=a.n(o),n=a(8),r=a.n(n),l=(a(14),a(2)),s=a(3),c=a(5),d=a(4),p=a(6),g=(a(15),a(1)),h=function(e){function t(){var e,a;Object(l.a)(this,t);for(var o=arguments.length,i=new Array(o),n=0;n<o;n++)i[n]=arguments[n];return(a=Object(c.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(i)))).state={selectedLeague:0,players:[]},a}return Object(p.a)(t,e),Object(s.a)(t,[{key:"componentDidUpdate",value:function(e){e!==this.props&&this.updateData()}},{key:"updateData",value:function(){var e=this;fetch("https://cdn.jsdelivr.net/gh/joaorb64/tournament_api@master/out/"+this.props.contacts[this.state.selectedLeague].id+".json").then((function(e){return e.json()})).then((function(t){if(t){var a=[];Object.keys(t).forEach((function(e){a.push(t[e])})),e.setState({players:a})}})).catch(console.log)}},{key:"selectLeague",value:function(e){e!=this.state.selectedLeague&&(this.state.selectedLeague=e,this.updateData())}},{key:"getCharName",value:function(e){return e.toLowerCase().replace(/ /g,"_")}},{key:"getTwitterHandle",value:function(e){var t=e.split("/");return t[t.length-1]}},{key:"render",value:function(){var e,t,a,o=this;return console.log(this.state.players),i.a.createElement("div",{style:{textAlign:"center",fontFamily:"SmashFont"}},i.a.createElement("div",{class:"btn-group btn-group-justified col-12",role:"group",style:{marginTop:10,padding:"0 10px"}},this.props.contacts.map((function(e,t){return i.a.createElement("button",{onClick:function(){return o.selectLeague(t)},type:"button",class:"btn btn-danger",style:{flexGrow:1,flexBasis:0,overflow:"hidden",textOverflow:"ellipsis"}},i.a.createElement("div",{style:{width:"32px",height:"32px",display:"inline-block",backgroundSize:"contain",backgroundRepeat:"no-repeat",backgroundPosition:"center",verticalAlign:"inherit",backgroundColor:"white",borderRadius:"100%",marginRight:"5px",backgroundImage:"url(https://cdn.jsdelivr.net/gh/joaorb64/tournament_api@master/icon/".concat(e.id,".png)")}}),e.name)}))),i.a.createElement("ul",{class:"list-group",style:{padding:"10px"}},this.state.players.length>3?i.a.createElement("div",{class:"row no-gutters"},i.a.createElement("div",{class:"col-md-8",style:{paddingRight:"5px"}},i.a.createElement("li",{key:this.state.selectedLeague+"_0",class:"slide-fade list-group-item",style:(e={backgroundColor:"#f0f0f0",borderRadius:"10px",border:0,marginBottom:"5px",width:"100%",height:"512px",lineHeight:"48px",padding:0,display:"flex",alignSelf:"center",overflow:"hidden"},Object(g.a)(e,"backgroundColor","#f7c407"),Object(g.a)(e,"animationDelay","0s"),e)},i.a.createElement("div",{style:{backgroundImage:"url(./portraits-full/".concat(this.getCharName(this.state.players[0].mains[0].name),".png)"),display:"flex",width:"100%",backgroundPosition:"center",backgroundSize:"cover",filter:"drop-shadow(10px 10px 0px #000000AF)"}},i.a.createElement("div",{style:{paddingLeft:"40px",paddingRight:"40px",paddingTop:"20px",display:"flex",backgroundColor:"#f0f0f0",height:"80px",position:"absolute",left:"-30px",right:"-30px",bottom:0}},i.a.createElement("div",{style:{flexGrow:1,fontSize:"3.2rem",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}},this.state.players[0].name))),i.a.createElement("div",{style:{width:"300px",height:"300px",position:"absolute",backgroundColor:"#f0f0f0",top:-150,left:-150,transform:"rotate(-45deg)"}}),i.a.createElement("div",{style:{width:"150px",height:"150px",position:"absolute",top:0,left:"-20px",fontSize:"8rem",lineHeight:"150px"}},"1"),i.a.createElement("div",{style:{fontSize:"3rem",position:"absolute",right:"0px",bottom:"80px",backgroundColor:"black",color:"white",padding:"10px"}},this.state.players[0].score," pts."),this.state.players[0].twitter?i.a.createElement("div",{style:{backgroundImage:"url(https://avatars.io/twitter/".concat(this.getTwitterHandle(this.state.players[0].twitter),")"),width:"128px",height:"128px",backgroundSize:"cover",backgroundPosition:"center",borderRadius:"100%",position:"absolute",right:10,top:10,border:"5px #f0f0f0 solid"}}):null),i.a.createElement("div",{class:"d-md-block",style:{display:"none",width:5}})),i.a.createElement("div",{class:"col-md-4"},i.a.createElement("div",{class:""},i.a.createElement("li",{key:this.state.selectedLeague+"_1",class:"slide-fade list-group-item",style:(t={backgroundColor:"#f0f0f0",borderRadius:"10px",border:0,marginBottom:"5px",width:"100%",height:"302px",lineHeight:"48px",padding:0,display:"flex",alignSelf:"center",overflow:"hidden"},Object(g.a)(t,"backgroundColor","#b9b9b9"),Object(g.a)(t,"animationDelay",1/30+"s"),t)},i.a.createElement("div",{style:{backgroundImage:"url(./portraits-full/".concat(this.getCharName(this.state.players[1].mains[0].name),".png)"),display:"flex",width:"100%",backgroundPosition:"center",backgroundSize:"cover",filter:"drop-shadow(10px 10px 0px #000000AF)"}},i.a.createElement("div",{style:{paddingLeft:"40px",paddingRight:"40px",paddingTop:"10px",display:"flex",backgroundColor:"#f0f0f0",height:"60px",position:"absolute",left:"-30px",right:"-30px",bottom:0}},i.a.createElement("div",{style:{flexGrow:1,fontSize:"2.0rem",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}},this.state.players[1].name))),i.a.createElement("div",{style:{width:"200px",height:"200px",position:"absolute",backgroundColor:"#f0f0f0",top:-100,left:-100,transform:"rotate(-45deg)"}}),i.a.createElement("div",{style:{width:"100px",height:"100px",position:"absolute",top:0,left:"-10px",fontSize:"5rem",lineHeight:"100px"}},"2"),i.a.createElement("div",{style:{fontSize:"2rem",position:"absolute",right:"0px",bottom:"60px",backgroundColor:"black",color:"white",padding:"0px 10px"}},this.state.players[1].score," pts."),this.state.players[1].twitter?i.a.createElement("div",{style:{backgroundImage:"url(https://avatars.io/twitter/".concat(this.getTwitterHandle(this.state.players[1].twitter),")"),width:"96px",height:"96px",backgroundSize:"cover",backgroundPosition:"center",borderRadius:"100%",position:"absolute",right:10,top:10,border:"5px #f0f0f0 solid"}}):null)),i.a.createElement("div",{class:""},i.a.createElement("li",{key:this.state.selectedLeague+"_2",class:"slide-fade list-group-item",style:(a={backgroundColor:"#f0f0f0",borderRadius:"10px",border:0,marginBottom:"5px",width:"100%",height:"205px",lineHeight:"48px",padding:0,display:"flex",alignSelf:"center",overflow:"hidden"},Object(g.a)(a,"backgroundColor","#c55d30"),Object(g.a)(a,"animationDelay",2/30+"s"),a)},i.a.createElement("div",{style:{backgroundImage:"url(./portraits-full/".concat(this.getCharName(this.state.players[2].mains[0].name),".png)"),display:"flex",width:"100%",backgroundPosition:"center",backgroundSize:"cover",filter:"drop-shadow(10px 10px 0px #000000AF)"}},i.a.createElement("div",{style:{paddingLeft:"40px",paddingRight:"40px",paddingTop:"4px",display:"flex",backgroundColor:"#f0f0f0",height:"50px",position:"absolute",left:"-30px",right:"-30px",bottom:0}},i.a.createElement("div",{style:{flexGrow:1,fontSize:"2.0rem",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}},this.state.players[2].name))),i.a.createElement("div",{style:{width:"160px",height:"160px",position:"absolute",backgroundColor:"#f0f0f0",top:-80,left:-80,transform:"rotate(-45deg)"}}),i.a.createElement("div",{style:{width:"80px",height:"80px",position:"absolute",top:0,left:"-8px",fontSize:"4rem",lineHeight:"80px"}},"3"),i.a.createElement("div",{style:{fontSize:"1.6rem",position:"absolute",right:"0px",bottom:"50px",backgroundColor:"black",color:"white",padding:"0px 10px"}},this.state.players[2].score," pts."),this.state.players[2].twitter?i.a.createElement("div",{style:{backgroundImage:"url(https://avatars.io/twitter/".concat(this.getTwitterHandle(this.state.players[2].twitter),")"),width:"84px",height:"84px",backgroundSize:"cover",backgroundPosition:"center",borderRadius:"100%",position:"absolute",right:10,top:10,border:"5px #f0f0f0 solid"}}):null)))):null,this.state.players.slice(3).map((function(e,t){return i.a.createElement("li",{key:o.state.selectedLeague+"_"+t,class:"slide-fade list-group-item",style:{backgroundColor:"#f0f0f0",borderRadius:"10px",border:0,marginBottom:"5px",width:"100%",height:"42px",lineHeight:"48px",padding:0,display:"flex",alignSelf:"center",overflow:"hidden",animationDelay:(t+3)/30+"s"}},i.a.createElement("div",{style:{width:"45px",textAlign:"center",fontSize:"1.2rem"}},e.rank),e.twitter?i.a.createElement("div",{style:{backgroundImage:"url(https://avatars.io/twitter/".concat(o.getTwitterHandle(e.twitter),")"),width:"64px",height:"48px",display:"inline-block",backgroundSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center",backgroundColor:"white"}}):i.a.createElement("div",{style:{width:"64px",height:"48px",display:"inline-block"}}),i.a.createElement("div",{style:{flexGrow:1,overflow:"hidden",textOverflow:"ellipsis"}},e.name),i.a.createElement("div",{style:{width:"128px",padding:"5px"}},i.a.createElement("div",{style:{backgroundColor:"black",color:"white",height:"32px",lineHeight:"32px",fontSize:"1.2rem"}},e.score," pts.")),e.mains.length>0?i.a.createElement("div",{style:{backgroundImage:"url(./portraits-small/".concat(o.getCharName(e.mains[0].name),".png)"),width:"128px",backgroundPosition:"center",backgroundSize:"cover",backgroundColor:"#ababab"}}):i.a.createElement("div",{style:{backgroundImage:"url(./portraits-small/".concat("random",".png)"),width:"128px",backgroundPosition:"center",backgroundSize:"cover",backgroundColor:"#ababab"}}))}))))}}]),t}(o.Component),u=function(e){function t(){var e,a;Object(l.a)(this,t);for(var o=arguments.length,i=new Array(o),n=0;n<o;n++)i[n]=arguments[n];return(a=Object(c.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(i)))).state={leagues:[]},a}return Object(p.a)(t,e),Object(s.a)(t,[{key:"componentWillMount",value:function(){var e=this;fetch("https://cdn.jsdelivr.net/gh/joaorb64/tournament_api@master/leagues.json").then((function(e){return e.json()})).then((function(t){t.leagues.forEach((function(t){fetch("https://cdn.jsdelivr.net/gh/joaorb64/tournament_api@master/league_info/"+t+".json").then((function(e){return e.json()})).then((function(a){e.state.leagues.push({id:t,name:a.name}),e.setState(e.state)}))}))})).catch(console.log)}},{key:"componentDidMount",value:function(){document.getElementById("myVideo").play()}},{key:"render",value:function(){return i.a.createElement("div",null,i.a.createElement("video",{loop:!0,muted:!0,autoplay:!0,oncanplay:"this.play()",onloadedmetadata:"this.muted=true",id:"myVideo"},i.a.createElement("source",{src:"./background.mp4",type:"video/mp4"})),i.a.createElement("div",{class:"container",style:{backgroundColor:"#2a2335",marginBottom:"128px"}},i.a.createElement(h,{contacts:this.state.leagues})),i.a.createElement("nav",{class:"navbar fixed-bottom",style:{color:"white",backgroundColor:"#be2018",fontFamily:"SmashFont",fontSize:"15px",textAlign:"right",display:"inline"}},"By Jo\xe3o Ribeiro Bezerra (joaorb64@gmail.com, @joao_shino)"))}}]),t}(o.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(i.a.createElement(u,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},9:function(e,t,a){e.exports=a(16)}},[[9,1,2]]]);
//# sourceMappingURL=main.77581bc6.chunk.js.map