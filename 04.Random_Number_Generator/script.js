const mininput=document.getElementById("min-no");
const maxinput=document.getElementById("max-no");
const mybutton=document.getElementById("bttn");
let rm=0;

mybutton.onclick=function()
{

       min=mininput.value;
        min=Number(min);
        max=maxinput.value;
        max=Number(max);
    
        rm=Math.floor(Math.random()*(max-min))+min;
        result.textContent=`Random Number from ${min} to ${max}:${rm}`;
}