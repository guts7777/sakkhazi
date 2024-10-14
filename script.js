const sakk_tabla = document.getElementById('sakk_tabla');
const feher_leutott = document.getElementById('feher_leutott');
const fekete_leutott = document.getElementById('fekete_leutott');

const babuk = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

let kijelolt_babu = null;
let aktualis_jatekos = 'feher';

function tabla_feltoltese() 
{
    sakk_tabla.innerHTML = '';
    for (let sor = 0; sor < 8; sor++) 
    {
        for (let oszlop = 0; oszlop < 8; oszlop++)     
        {
            const cella = document.createElement('div');
            cella.classList.add('cella');
            cella.classList.add((sor + oszlop) % 2 === 0 ? 'feher' : 'fekete');
            cella.dataset.sor = sor;
            cella.dataset.oszlop = oszlop;
            cella.textContent = babuk[sor][oszlop];
            cella.addEventListener('click', cella_kattintas);
            sakk_tabla.appendChild(cella);
        }
    }
}

function cella_kattintas(event) 
{
    const cella = event.target;
    const sor = parseInt(cella.dataset.sor);
    const oszlop = parseInt(cella.dataset.oszlop);
    const babu = babuk[sor][oszlop];

    if (kijelolt_babu) 
    {
        if (babu && babu !== kijelolt_babu.babu) 
        {
            if ((aktualis_jatekos === 'feher' && babu.charCodeAt(0) >= 9818) ||
                (aktualis_jatekos === 'fekete' && babu.charCodeAt(0) <= 9817)) 
            {
                leutott_babu_hozzaadasa(babu);
            }
        }
        if (ervenyes_lepes(kijelolt_babu, sor, oszlop)) 
        {
            babuk[kijelolt_babu.sor][kijelolt_babu.oszlop] = '';
            babuk[sor][oszlop] = kijelolt_babu.babu;
            kijelolt_babu = null;
            aktualis_jatekos = aktualis_jatekos === 'feher' ? 'fekete' : 'feher';
            tabla_feltoltese();
        }
    } 
    else if (babu && ((aktualis_jatekos === 'feher' && babu.charCodeAt(0) <= 9817) ||
                        (aktualis_jatekos === 'fekete' && babu.charCodeAt(0) >= 9818))) 
    {
        kijelolt_babu = { babu, sor, oszlop };
        cella.classList.add('kijelolt');
    }
}

function leutott_babu_hozzaadasa(babu) 
{
    const leutott_div = aktualis_jatekos === 'feher' ? feher_leutott : fekete_leutott;
    const babu_elem = document.createElement('div');
    babu_elem.textContent = babu;
    leutott_div.appendChild(babu_elem);
}

function ervenyes_lepes(kijelolt_babu, sor, oszlop) 
{
    const babu = kijelolt_babu.babu;
    const sor_kulonbseg = Math.abs(sor - kijelolt_babu.sor);
    const oszlop_kulonbseg = Math.abs(oszlop - kijelolt_babu.oszlop);

    switch (babu) {
        case '♙':
            return ervenyes_gyalog_lepes(kijelolt_babu, sor, oszlop);
        case '♟':
            return ervenyes_gyalog_lepes(kijelolt_babu, sor, oszlop, true);
        case '♖':
        case '♜':
            return sor_kulonbseg === 0 || oszlop_kulonbseg === 0;
        case '♘':
        case '♞':
            return sor_kulonbseg === 2 && oszlop_kulonbseg === 1 || sor_kulonbseg === 1 && oszlop_kulonbseg === 2;
        case '♗':
        case '♝':
            return sor_kulonbseg === oszlop_kulonbseg;
        case '♕':
        case '♛':
            return sor_kulonbseg === oszlop_kulonbseg || sor_kulonbseg === 0 || oszlop_kulonbseg === 0;
        case '♔':
        case '♚':
            return sor_kulonbseg <= 1 && oszlop_kulonbseg <= 1;
        default:
            return false;
    }
}

function ervenyes_gyalog_lepes(kijelolt_babu, sor, oszlop, fekete = false) 
{
    const irany = fekete ? 1 : -1;
    const kezdosor = fekete ? 1 : 6;
    const sor_kulonbseg = sor - kijelolt_babu.sor;
    const oszlop_kulonbseg = Math.abs(oszlop - kijelolt_babu.oszlop);

    if (oszlop_kulonbseg === 0 && babuk[sor][oszlop] === '') 
    {
        if (sor_kulonbseg === irany) return true;
        if (sor_kulonbseg === 2 * irany && kijelolt_babu.sor === kezdosor) return true;
    } 
    else if (oszlop_kulonbseg === 1 && sor_kulonbseg === irany && babuk[sor][oszlop] !== '') 
    {
        return true;
    }
    return false;
}

tabla_feltoltese();