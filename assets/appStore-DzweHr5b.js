import{aH as m}from"./index-TTTR5tOc.js";const l=async n=>await(await fetch(`resources/${n}`)).json(),I=async()=>await l("config.json"),y=async(n,t)=>await l(`indicators/indicators-${n}-ADM${t}.json`),f=async(n,t)=>await l(`geojson/geoBoundaries-${n}-ADM${t}_simplified.geojson`),w=m("app",{state:()=>({loading:!0,appConfig:null,selectedCountryId:"",selectedIndicator:"",admin1Indicators:{},admin1Geojson:{},admin2Indicators:{},admin2Geojson:{}}),getters:{selectedIndicators:n=>{const{selectedCountryId:t,admin1Indicators:o,admin2Indicators:e}=n;if(!t)return Object.assign({},...Object.values(o));const i=Object.entries(o).filter(([s,a])=>s!==t).map(([s,a])=>a);return Object.assign({},e[t],...i)},selectedFeatures:n=>{const{selectedCountryId:t,admin1Geojson:o,admin2Geojson:e}=n;if(!t)return Object.values(o).flatMap(s=>s.features);const i=Object.entries(o).filter(([s,a])=>s!=t).flatMap(([s,a])=>a.features);return[...e.features,...i]}},actions:{async initialiseData(){this.appConfig=await I();const n={},t={},o=1;for(const e of this.appConfig.countries)n[e]=await y(e,o),t[e]=await f(e,o);this.selectedIndicator=Object.keys(this.appConfig.indicators)[0],Object.assign(this.admin1Indicators,n),Object.assign(this.admin1Geojson,t),this.loading=!1},async genData(){this.loading=!0;const n=["MWI","TZI"];for(const e of n){console.log("generating for "+e);const s=(await f(e,2)).features,a={},c=(r,d)=>Math.random()*(d-r)+r;s.forEach(r=>{const d=r.properties.shapeID,u=c(.01,.03),g=c(.001,.006),p=c(40,70),j=c(3,10);a[d]={FOI:{mean:u,sd:g},p9:{mean:p,sd:j}}}),console.log("writing for "+e);var t=new Blob([JSON.stringify(a,null,4)],{type:"application/json"}),o=document.createElement("a");o.href=window.URL.createObjectURL(t),o.download=`indicators-${e}-ADM2.json`,o.click()}this.loading=!1}}});export{w as u};