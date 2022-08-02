[Scrolly Telling]::Story(
  "Particles",
  "[]",
  "scrollY"
)


let strInp = 
{
    "vizType": "Particles",
    "datasets": "[{ \"foo\": \"bar\" }]",
    "motionTrigger": "scrollY"
}



// input formats
// full
{
  "vizType": "Particles",
  "datasets": "[{ \"foo\": \"bar\" }]",
  "motionTrigger": "scrollY",
  "tweenMethod": "linear"
}



lerp
- scrollX
- scrollY



step
- delay
- duration


(
  "Particles",
  "[{ \"foo\": \"bar\" }]",
  "scrollY",
  "linear"
)