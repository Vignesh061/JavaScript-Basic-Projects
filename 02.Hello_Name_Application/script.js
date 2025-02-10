const btnelement=document.getElementById("btnelement");
const updatecontent=document.getElementById("updatecontent");

btnelement.onclick=function()
{
    const yourname=window.prompt("Eneter Your Name:");
    updatecontent.textContent=yourname;
}

