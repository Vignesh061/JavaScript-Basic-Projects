const decreamentbtn =document.getElementById("decreamentbtn")
const resetbtn=document.getElementById("resetbtn")
const increamentbtn=document.getElementById("increamentbtn")
const mylable=document.getElementById("mylabel")
let count = 0;

increamentbtn.onclick = function()
{
    count++
    mylable.textContent=count;
}
decreamentbtn.onclick = function(){
    count--;
    mylable.textContent=count;
}
resetbtn.onclick=function()
{
    count=0;
    mylable.textContent=count;
}