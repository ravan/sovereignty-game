# SVG Geeko Styling

## Danling Geeko

```
body{margin:0;padding:0; min-height:100vh;
  display:grid; place-content:center; color:white; background-color:#0c322c}

svg{height:100vh; width:100vw;}

svg * { transform-box: fill-box;}

 
.dg-body{ transform-origin:top right;  animation: branch-sway 5s infinite}

@keyframes branch-sway{
  0%,100%{transform: rotate(-1deg)}
  50%{  transform: rotate(1deg)}
}


.dg-frontleg{transform-origin:10% 10%;}
.dg-backleg{transform-origin:20% 100%;}
.dg-backleg, .dg-backleg :last-child,  .dg-backleg :nth-child(2),
.dg-frontleg, .dg-frontleg :last-child { animation: sway 6s infinite;}
@keyframes sway{50%{transform:rotate(10deg)}}
.dg-backleg{animation-delay:-6s}
.dg-backleg :nth-child(2),
.dg-frontleg{animation-delay:-6s; }
.dg-backleg{ animation-delay:-3s}

.dg-head{transform-origin:50% 50%; animation: bop 6s infinite; transition-delay:-1s;}

@keyframes bop{50%{transform:rotate(-15deg) translate(0%, 0%)}}

#gc-eyelids{animation: blink 2s infinite; clip-path: url(#dg-eyeball)}
@keyframes blink{
  0%,25%{stroke-width: 0}
  50%{stroke-width: 120}
  75%,100%{stroke-width: 0}
}
#gc-pupil{animation: look 4s infinite}

.dg-pupil{animation: look 4s infinite; transform-origin:50% 50%;}

@keyframes look{
    0%{transform:translate(-5%, -5%)}
    50%{transform:translate(10%, 85%)}
    100%{transform:translate(-5%, -5%)}
}



#gc-eyelids{animation: blink 2s infinite}
@keyframes blink{
  0%,25%{stroke-width: 0}
  50%{stroke-width: 120}
  75%,100%{stroke-width: 0}
} 



.dg-eyelids{animation: blink2 2s infinite}
@keyframes blink2{
  0%,25%{stroke-width: 0}
  50%{stroke-width: 240}
  75%,100%{stroke-width: 0}
}
```

## Sitting Geeko

```
body{margin:0;padding:0; min-height:100vh;
  display:grid; place-content:center; color:white; background-color:#0c322c}

svg{height:100vh; width:100vw;}

svg * { transform-box: fill-box;}


#climbing-geeko{
  transform-origin:bottom right;
  animation: branch-sway 5s infinite
}

@keyframes branch-sway{
  0%,100%{transform: rotate(-1deg)}
  50%{  transform: rotate(1deg)}
}

#gc-leaves-1{transform-origin:top right;}
#gc-leaves-2{transform-origin:50% 100%;}
#gc-leaves-1,
#gc-leaves-2{ animation: sway 6s infinite;}
@keyframes sway{50%{transform:rotate(10deg)}}



#gc-eyelids{animation: blink 2s infinite}
@keyframes blink{
  0%,35%{stroke-width: 0}
  50%{stroke-width: 120}
  65%,100%{stroke-width: 0}
}

#gl-pupil,
#gc-pupil{animation: look 4s infinite}

@keyframes look{
    0%{transform:translate(-5%, -5%)}
    50%{transform:translate(10%, 85%)}
    100%{transform:translate(-5%, -5%)}
}








/*NEW CSS */
#gl-head{animation: sway 5s infinite; transform-origin:bottom left;}

#gl-eyelids{animation: blink 3s infinite}
```

## Sitting Up Geeko

```
body{margin:0;padding:0; min-height:100vh;
  display:grid; place-content:center; color:white; background-color:#0c322c}

svg{height:100vh; width:100vw;}

svg * { transform-box: fill-box;}


 

 
#gp-tail{ animation: sway 6s infinite;}
#gp-pupil{animation: look 4s infinite}
#gp-head{ animation: sway 6s infinite ;  transform-origin:bottom left;}
@keyframes sway{50%{transform:rotate(10deg)}}
#gp-eyelids{animation: blink 2s infinite}



@keyframes blink{
  0%,35%{stroke-width: 0}
  50%{stroke-width: 120}
  65%,100%{stroke-width: 0}
}



@keyframes look{
    0%{transform:translate(-5%, -5%)}
    50%{transform:translate(10%, 85%)}
    100%{transform:translate(-5%, -5%)}
}








/*NEW CSS */
#gl-head{animation: sway 5s infinite; transform-origin:bottom left;}

#gl-eyelids{animation: blink 3s infinite}
```

## Swaying Geeko

```
body{margin:0;padding:0; min-height:100vh;
  display:grid; place-content:center; color:white; background-color:#0c322c}

svg{height:100vh; width:100vw;}

svg * { transform-box: fill-box;}


#climbing-geeko{
  transform-origin:bottom right;
  animation: branch-sway 5s infinite
}

@keyframes branch-sway{
  0%,100%{transform: rotate(-1deg)}
  50%{  transform: rotate(1deg)}
}

#gc-leaves-1{transform-origin:top right;}
#gc-leaves-2{transform-origin:50% 100%;}
#gc-leaves-1,
#gc-leaves-2{ animation: sway 6s infinite;}
@keyframes sway{50%{transform:rotate(10deg)}}



#gc-eyelids{animation: blink 2s infinite}
@keyframes blink{
  0%,25%{stroke-width: 0}
  50%{stroke-width: 120}
  75%,100%{stroke-width: 0}
}

#gc-pupil{animation: look 4s infinite}

@keyframes look{
    0%{transform:translate(-5%, -5%)}
    50%{transform:translate(10%, 85%)}
    100%{transform:translate(-5%, -5%)}
}
```
