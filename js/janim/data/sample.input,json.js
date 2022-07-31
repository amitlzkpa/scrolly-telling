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