(this["webpackJsonphuman-music"]=this["webpackJsonphuman-music"]||[]).push([[0],{77:function(t,e){},91:function(t,e,i){},92:function(t,e,i){},93:function(t,e,i){"use strict";i.r(e);var s=i(43),a=i.n(s),r=i(3),n=i.n(r),o=i(5),h=i(4),u=i(7),c=i.n(u),l=c.a.createContext(null),d=i(44),m=i(0),b=i(1),E=["#09090935","#fae2b735","#49719d35"],v=function(){function t(e,i){Object(m.a)(this,t),this.step=0,this.cellSize=void 0,this.sketch=void 0,this.automata=void 0,this.sketch=e,this.automata=i,this.cellSize=this.sketch.width/i.size}return Object(b.a)(t,[{key:"draw",value:function(){for(var t=0;t<this.automata.size;t++){this.sketch.noFill(),this.sketch.stroke(E[this.automata.state[t]]);for(var e=0;e<25/window.devicePixelRatio;e++)this.sketch.line(this.cellSize*t+this.cellSize/2+(2*Math.random()*this.cellSize-this.cellSize),this.cellSize*this.step+this.cellSize/2+(2*Math.random()*this.cellSize-this.cellSize),this.cellSize*t+this.cellSize/2+(2*Math.random()*this.cellSize-this.cellSize),this.cellSize*this.step+this.cellSize/2+(2*Math.random()*this.cellSize-this.cellSize))}this.step*this.cellSize>=this.sketch.height?(this.sketch.background(9,9,9,235),this.step=0):this.step++}}]),t}();v.Builder=function(){function t(){Object(m.a)(this,t),this.sketch=void 0,this.automata=void 0}return Object(b.a)(t,[{key:"withSketch",value:function(t){return this.sketch=t,this}},{key:"withAutomata",value:function(t){return this.automata=t,this}},{key:"build",value:function(){if(null===this.automata)throw new Error("Must pass a cellular automata upon building");if(null===this.sketch)throw new Error("Must pass a p5 sketch upon building");return new v(this.sketch,this.automata)}}]),t}();var A=i(13),f=i(24),p=function(){function t(e,i,s,a,r,n){Object(m.a)(this,t),this.note="",this.lastNote="",this.voice="",this.lastVoice="",this.currentChord="",this.chords=[""],this.instrument=void 0,this.automata=void 0,this.chordsDistance=8,this.voicesDistance=4,this.noteDistance=1,this.chordOctave=3,this.voiceOctave=5,this.noteOctave=4,this.step=0,this.instrument=e,this.automata=i,this.chordOctave=s,this.voiceOctave=a,this.noteOctave=r,this.chords=n}return Object(b.a)(t,[{key:"play",value:function(){this.playChord(),this.playNote(),this.playVoice(),this.step++}},{key:"playNote",value:function(){if(0!=this.leeDistance(1)){var t=f.a.get(this.currentChord).notes,e=this.leeDistance(1)%(2*t.length),i=e>=t.length?t.length-e%t.length-1:e;if(this.note=t[i%t.length],this.step%this.noteDistance==0&&this.note!=this.lastNote){var s=A.a(this.note).transpose(12*this.noteOctave).toFrequency();this.instrument.triggerAttackRelease(s,5,void 0,.75),this.lastNote=this.note}}}},{key:"playVoice",value:function(){if(0!=this.leeDistance(2)){var t=f.a.get(this.currentChord).notes,e=this.leeDistance(2)%(2*t.length),i=e>=t.length?t.length-e%t.length-1:e;if(this.voice=t[i%t.length],this.step%this.voicesDistance==0&&3==this.automata.states&&this.voice!=this.lastVoice){var s=A.a(this.voice).transpose(12*this.voiceOctave).toFrequency();this.instrument.triggerAttackRelease(s,5,void 0,.5)}this.lastVoice=this.voice}}},{key:"playChord",value:function(){var t=this,e=this.leeDistance(0)%(2*this.chords.length),i=e>=this.chords.length?this.chords.length-e%this.chords.length-1:e,s=this.chords[i%this.chords.length];if(this.step%this.chordsDistance==0){this.currentChord=s;var a=f.a.get(s).notes.map((function(e){return A.a(e).transpose(12*t.chordOctave).toFrequency()}));this.instrument.triggerAttackRelease(a,5,void 0,.25)}}},{key:"leeDistance",value:function(t){var e=this;return this.automata.state.reduce((function(i,s,a){var r=Math.abs(e.automata.state[a]-e.automata.previousState[a]),n=Math.min(r,e.automata.states-r);return e.automata.state[a]!=t?i:i+n}),0)}},{key:"stop",value:function(){this.instrument.releaseAll(),this.instrument.dispose(),this.note="",this.lastNote="",this.step=0}}]),t}();p.Builder=function(){function t(){Object(m.a)(this,t),this.automata=void 0,this.chords=[["C0major","F0major","G0major","D0m","A0m","E0m"],["C0major","F0major","A0m","E0m"],["C0major","G0major","D0m","E0m"],["G0major","C0major","D0major","A0m","E0m","B0m"],["G0major","C0major","E0m","B0m"],["G0major","D0major","A0m","B0m"],["D0major","G0major","A0major","E0m","B0m","F#0m"],["D0major","G0major","B0m","F#0m"],["D0major","A0major","E0m","F#0m"],["A0major","D0major","E0major","B0m","F#0m","C#0m"],["A0major","D0major","F#0m","C#0m"],["A0major","E0major","B0m","C#0m"],["E0major","A0major","B0major","F#0m","C#0m","G#0m"],["E0major","A0major","C#0m","G#0m"],["E0major","B0major","F#0m","G#0m"],["B0major","E0major","F#0major","C#0m","G#0m","Eb0m"],["B0major","E0major","G#0m","Eb0m"],["B0major","F#0major","C#0m","Eb0m"],["F#0major","B0major","C#0major","G#0m","Eb0m","Bb0m"],["F#0major","B0major","Eb0m","Bb0m"],["F#0major","C#0major","G#0m","Bb0m"]]}return Object(b.a)(t,[{key:"withAutomata",value:function(t){return this.automata=t,this}},{key:"build",value:function(){var t=Object(o.a)(n.a.mark((function t(){var e,i,s,a,r;return n.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(null!==this.automata){t.next=2;break}throw new Error("Must pass a cellular automata upon building");case 2:return e=new A.b({urls:{C1:"C1.mp3","D#1":"Ds1.mp3","F#1":"Fs1.mp3",A1:"A1.mp3",C2:"C2.mp3","D#2":"Ds2.mp3","F#2":"Fs2.mp3",A2:"A2.mp3",C3:"C3.mp3","D#3":"Ds3.mp3","F#3":"Fs3.mp3",A3:"A3.mp3",C4:"C4.mp3","D#4":"Ds4.mp3","F#4":"Fs4.mp3",A4:"A4.mp3",C5:"C5.mp3","D#5":"Ds5.mp3","F#5":"Fs5.mp3",A5:"A5.mp3"},baseUrl:"https://tonejs.github.io/audio/salamander/"}).toDestination(),t.next=5,A.c();case 5:return i=this.chords[Math.floor(Math.random()*this.chords.length)],s=Math.round(2*Math.random())+2,a=Math.round(Math.random())+4,r=Math.round(2*Math.random())+3,t.abrupt("return",new p(e,this.automata,r,a,s,i));case 10:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()}]),t}();var g,I,C,j=i(18),x=i.n(j),y=i(47),Y=i(6),w=function(t){t.setup=function(){t.createCanvas(x()("#sketch").width(),x()("#sketch").height()),t.background(9,9,9),t.frameRate(3)},t.updateWithProps=function(e){t.resizeCanvas(x()("#sketch").width(),x()("#sketch").height()),e.newAutomata&&(t.clear(),t.background(9,9,9),function(t,e){S.apply(this,arguments)}(t,e.newAutomata))},t.draw=function(){var t,e,i;null===(t=I)||void 0===t||t.draw(),null===(e=g)||void 0===e||e.evolve(),null===(i=C)||void 0===i||i.play()}};function S(){return(S=Object(o.a)(n.a.mark((function t(e,i){var s;return n.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.noLoop(),null===(s=C)||void 0===s||s.stop(),g=null,I=null,C=null,g=i,Math.floor(6*Math.random()),I=(new v.Builder).withSketch(e).withAutomata(i).build(),t.next=10,(new p.Builder).withAutomata(g).build();case 10:C=t.sent,e.loop();case 12:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function k(){var t=Object(u.useReducer)((function(t){return t+1}),0),e=Object(h.a)(t,2),i=e[0],s=e[1];return c.a.useEffect((function(){var t=Object(y.a)((function(){s()}),200),e=function(){t()};return window.addEventListener("resize",e),function(){return window.removeEventListener("resize",e)}}),[]),Object(Y.jsx)(l.Consumer,{children:function(t){return Object(Y.jsx)("div",{className:"CellularAutomataSketch",id:"sketch",children:Object(Y.jsx)(d.a,{customClass:"canvas",sketch:w,newAutomata:t,ignored:i})})}})}i(91);var O=i.p+"static/media/github.41bf9875.png",N=function(){function t(e,i,s,a,r,n){Object(m.a)(this,t),this.states=void 0,this.size=void 0,this.radius=void 0,this.rule=void 0,this._state=void 0,this.tempState=void 0,this.neighbourhoodCode=void 0,this.lookupTable=void 0,this.states=e,this.size=i,this.radius=s,this.rule=a,this._state=r,this.lookupTable=n,this.tempState=Array.from({length:i}),this.neighbourhoodCode=Array.from({length:i})}return Object(b.a)(t,[{key:"state",get:function(){return this._state}},{key:"previousState",get:function(){return this.tempState}},{key:"evolve",value:function(){var t=this;this.state.forEach((function(e,i){t.evolveCellAt(i)}));var e=this.tempState;this.tempState=this._state,this._state=e}},{key:"evolveCellAt",value:function(t){var e=this.lookupTable.length-this.computeCodeFor(t)-1;this.tempState[t]=e>=0?this.lookupTable[e]:0}},{key:"computeCodeFor",value:function(t){var e,i=Math.pow(this.states,2*this.radius),s=0;if(0===t)for(var a=-this.radius;a<=this.radius;a++)e=this.wrappedIndex(a),s+=i*this._state[e],i/=this.states;else{e=this.wrappedIndex(t-this.radius-1);var r=i*this._state[e];e=this.wrappedIndex(t+this.radius);var n=this._state[e];s=(this.neighbourhoodCode[t-1]-r)*this.states+n}return this.neighbourhoodCode[t]=s,s}},{key:"wrappedIndex",value:function(t){return t<0?t+this.size:t>=this.size?t-this.size:t}}]),t}();N.Builder=function(){function t(){Object(m.a)(this,t),this.states=2,this.size=100,this.rule=0,this.randomInitialConfiguration=!1}return Object(b.a)(t,[{key:"withStates",value:function(t){if(t<1)throw new Error("Number of states must be greater than 1");return this.states=t,this}},{key:"withSize",value:function(t){if(this.size=t,t<=10)throw new Error("Size of cellular automata must be greater than 10");return this}},{key:"withRule",value:function(t){if(this.rule=t,t<0)throw new Error("Rule must be a positive number");return this}},{key:"withRandomInitialConfiguration",value:function(){return this.randomInitialConfiguration=!0,this}},{key:"build",value:function(){for(var t=this,e=Array.from(BigInt(this.rule).toString(this.states)),i=Array.from({length:e.length}),s=0;s<e.length;s++){var a=e[s];i[s]=a>="0"&&a<="9"?+e[s]-0:+e[s]-NaN}var r=this.randomInitialConfiguration?Array.from({length:this.size},(function(){return Math.round(Math.random())})):Array.from({length:this.size},(function(e,i){return i===Math.floor(t.size/2)?1:0}));return new N(this.states,this.size,1,this.rule,r,i)}}]),t}();var L,D,z,B=function(){function t(e,i,s,a,r,n){Object(m.a)(this,t),this.states=void 0,this.size=void 0,this.radius=void 0,this.rule=void 0,this._state=void 0,this.tempState=void 0,this.neighbourhoodCode=void 0,this.lookupTable=void 0,this.states=e,this.size=i,this.radius=s,this.rule=a,this._state=r,this.lookupTable=n,this.tempState=Array.from({length:i}),this.neighbourhoodCode=Array.from({length:i})}return Object(b.a)(t,[{key:"state",get:function(){return this._state}},{key:"previousState",get:function(){return this.tempState}},{key:"evolve",value:function(){var t=this;this.state.forEach((function(e,i){t.evolveCellAt(i)}));var e=this.tempState;this.tempState=this._state,this._state=e}},{key:"evolveCellAt",value:function(t){var e=this.lookupTable.length-this.computeCodeFor(t)-1;this.tempState[t]=e>=0?this.lookupTable[e]:0}},{key:"computeCodeFor",value:function(t){var e,i=2*this.radius+1,s=0;if(0===t)for(var a=-this.radius;a<i;a++)e=this.wrappedIndex(a),s+=this._state[e];else{e=this.wrappedIndex(t-this.radius-1);var r=this._state[e];e=this.wrappedIndex(t+this.radius);var n=this._state[e];s=this.neighbourhoodCode[t-1]-r+n}return this.neighbourhoodCode[t]=s,s}},{key:"wrappedIndex",value:function(t){return t<0?t+this.size:t>=this.size?t-this.size:t}}]),t}();!function(t){t[t.UNIDIMENSIONAL=0]="UNIDIMENSIONAL",t[t.BIDIMENSIONAL=1]="BIDIMENSIONAL"}(L||(L={})),function(t){t[t.TOTALISTIC=0]="TOTALISTIC",t[t.ELEMENTARY=1]="ELEMENTARY"}(D||(D={})),function(t){t[t.EXTRA_SMALL=0]="EXTRA_SMALL",t[t.SMALL=1]="SMALL",t[t.MEDIUM=2]="MEDIUM",t[t.LARGE=3]="LARGE",t[t.EXTRA_LARGE=4]="EXTRA_LARGE"}(z||(z={}));var R=function t(){Object(m.a)(this,t)};R.Builder=function(){function t(){Object(m.a)(this,t),this.dimensions=L.UNIDIMENSIONAL,this.type=D.ELEMENTARY,this.states=2,this.size=100,this.rule=0,this.randomInitialConfiguration=!1}return Object(b.a)(t,[{key:"withDimensions",value:function(t){if(t===L.BIDIMENSIONAL)throw new Error("Bi-dimensional automata not implemented yet");return this.dimensions=t,this}},{key:"withType",value:function(t){return this.type=t,this}},{key:"withStates",value:function(t){if(t<1)throw new Error("Number of states must be greater than 1");return this.states=t,this}},{key:"withSize",value:function(t){var e=document.getElementById("sketch"),i=null===e?0:e.clientWidth;switch(t){case z.EXTRA_SMALL:this.size=i/30;break;case z.SMALL:this.size=i/15;break;case z.MEDIUM:this.size=i/5;break;case z.LARGE:this.size=i/2;break;case z.EXTRA_LARGE:this.size=i/1}return this.size=201,this}},{key:"withRule",value:function(t){if(this.rule=t,t<0)throw new Error("Rule must be a positive number");return this}},{key:"withRandomInitialConfiguration",value:function(){return this.randomInitialConfiguration=!0,this}},{key:"build",value:function(){return this.type===D.TOTALISTIC?this.buildTotallistic1D():this.buildElementary1D()}},{key:"buildTotallistic1D",value:function(){for(var t=this,e=Array.from(BigInt(this.rule).toString(this.states)),i=Array.from({length:e.length}),s=0;s<e.length;s++)i[s]=+e[s]-0;var a=this.randomInitialConfiguration&&Math.random()>.5?Array.from({length:this.size},(function(){return Math.round(Math.random())})):Array.from({length:this.size},(function(e,i){return i===Math.floor(t.size/2)?1:0}));return new B(this.states,this.size,1,this.rule,a,i)}},{key:"buildElementary1D",value:function(){for(var t=this,e=Array.from(BigInt(this.rule).toString(this.states)),i=Array.from({length:e.length}),s=0;s<e.length;s++){var a=e[s];i[s]=a>="0"&&a<="9"?+e[s]-0:+e[s]-NaN}var r=this.randomInitialConfiguration&&Math.random()>.5?Array.from({length:this.size},(function(){return Math.round(Math.random())})):Array.from({length:this.size},(function(e,i){return i===Math.floor(t.size/2)?1:0}));return new N(this.states,this.size,1,this.rule,r,i)}}]),t}();var G=function(){function t(){Object(m.a)(this,t)}return Object(b.a)(t,[{key:"randomAutomata",value:function(){var t=Math.random()<.5?D.ELEMENTARY:D.TOTALISTIC,e=1+Math.ceil(2*Math.random()),i=0;switch(t){case D.ELEMENTARY:i=Math.pow(e,Math.pow(e,3))-1;break;case D.TOTALISTIC:i=Math.pow(e,3*e)-1}for(;;){for(var s=Math.round(Math.random()*i),a=(new R.Builder).withSize(z.MEDIUM).withStates(e).withType(t).withRandomInitialConfiguration().withDimensions(L.UNIDIMENSIONAL).withRule(s).build(),r=new Set,n=0;n<100;n++)r.add(this.leeDistance(a)),a.evolve();if(r.size>=20&&r.size<=50)return(new R.Builder).withSize(z.MEDIUM).withStates(e).withType(t).withRandomInitialConfiguration().withDimensions(L.UNIDIMENSIONAL).withRule(s).build()}}},{key:"leeDistance",value:function(t){return t.state.reduce((function(e,i,s){var a=Math.abs(t.state[s]-t.previousState[s]),r=Math.min(a,t.states-a);return 0==t.state[s]?e:e+r}),0)}}]),t}();function M(){var t=Object(u.useState)(!1),e=Object(h.a)(t,2),i=e[0],s=e[1],a=Object(u.useState)(null),r=Object(h.a)(a,2),c=r[0],d=r[1],m=new G;function b(){return(b=Object(o.a)(n.a.mark((function t(){return n.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,A.d();case 2:s(!0),E();case 4:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function E(){return v.apply(this,arguments)}function v(){return v=Object(o.a)(n.a.mark((function t(){var e;return n.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=m.randomAutomata(),d(e);case 2:case"end":return t.stop()}}),t)}))),v.apply(this,arguments)}return Object(Y.jsxs)(l.Provider,{value:c,children:[Object(Y.jsx)("meta",{name:"viewport",content:"width=device-width, height=device-height, initial-scale=1.0, viewport-fit=cover"}),Object(Y.jsxs)("body",{className:"HumanMusic",children:[Object(Y.jsxs)("div",{className:"Headers",children:[Object(Y.jsx)("img",{src:"data:image/png;base64,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",className:"EarthRadioLogo",alt:"Earth"}),Object(Y.jsx)("h1",{className:"Title",children:"Human Music"}),Object(Y.jsx)("h2",{className:"Subtitle",children:"by Earth Radio"})]}),Object(Y.jsxs)("div",{className:"Automata",children:[Object(Y.jsx)("div",{className:"flip-card",children:Object(Y.jsxs)("div",{className:"flip-card-inner",children:[Object(Y.jsx)("div",{className:"flip-card-front",children:Object(Y.jsx)(k,{})}),Object(Y.jsx)("div",{className:"flip-card-back",children:Object(Y.jsx)("p",{className:"PlayingRule",children:i?"Playing rule: "+(null===c||void 0===c?void 0:c.rule):"--"})})]})}),Object(Y.jsx)("div",{className:"Controllers",children:i?Object(Y.jsx)("button",{className:"ruleButton",onClick:E,children:"Randomise"}):Object(Y.jsx)("button",{className:"startButton",onClick:function(){return b.apply(this,arguments)},children:"Start"})})]}),Object(Y.jsxs)("div",{className:"Misc",children:[Object(Y.jsx)("a",{className:"GitHubLink",href:"https://github.com/juankysoriano/human-music",children:Object(Y.jsx)("img",{className:"GitHubLogo",alt:"GitHub",src:O})}),Object(Y.jsx)("p",{className:"Dad",children:"A mi padre \u2665"})]})]})]})}i(92);a.a.render(Object(Y.jsx)(M,{}),document.getElementById("root"))}},[[93,1,2]]]);
//# sourceMappingURL=main.5df37bff.chunk.js.map