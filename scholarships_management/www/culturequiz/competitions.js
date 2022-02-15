var startQuizBtn = document.getElementsByClassName('btn btn-primary');

var ct = document.getElementsByClassName('c-t');
var ps = document.getElementsByClassName('p-s');
var qb = document.getElementsByClassName('q-b');

for (let indx = 0; indx < startQuizBtn.length; indx ++){
    startQuizBtn[indx].addEventListener('click', (event) => {
        var parm1 = ct[indx].innerHTML ;
        var parm2 = ps[indx].innerHTML ;
        var parm3 = qb[indx].innerHTML ;
        if (parm3 == 'None'){
            parm3 = "/files/dawah-33.png";
        }
        window.location.replace('https://ao-erpnext.sky.slnee.com/culturequiz/culturequiz?competition_name=' + parm1 + '&passing_score=' + parm2 + '&quiz_banner=' + parm3)
    });
}



