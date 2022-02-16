var startQuizBtn = document.getElementsByClassName('btn btn-primary');

var ct = document.getElementsByClassName('c-t');
var ps = document.getElementsByClassName('p-s');
var qb = document.getElementsByClassName('q-b');
var ur = document.getElementsByClassName('u-r');

for (let indx = 0; indx < startQuizBtn.length; indx ++){
    startQuizBtn[indx].addEventListener('click', (event) => {
        var parm1 = ct[indx].innerHTML ;
        var parm2 = ps[indx].innerHTML ;
        var parm3 = btoa(qb[indx].innerHTML) ;
        var parm4 = ur[indx].innerHTML;
        if (parm3 == btoa('None')){
            parm3 = btoa("/files/dawah-33.png"); // default quiz banner image..
        }
        console.log(parm4);
        if (parm4 == 'Administrator'){
            window.open('https://ao-erpnext.sky.slnee.com/culturequiz/culturequiz?competition_name=' + parm1 + '&passing_score=' + parm2 + '&quiz_banner=' + parm3, "_blank",
            "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
        } else {
            window.location.replace('https://ao-erpnext.sky.slnee.com/culturequiz/culturequiz?competition_name=' + parm1 + '&passing_score=' + parm2 + '&quiz_banner=' + parm3 )
        }
    });
}



