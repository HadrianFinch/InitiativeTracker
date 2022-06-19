function sortTable(table)
{
    var table, rows, switching, i, x, y, shouldSwitch;
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching)
    {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++)
        {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[0];
            y = rows[i + 1].getElementsByTagName("TD")[0];
            // Check if the two rows should switch place:
            if (parseInt(x.firstChild.value) < parseInt(y.firstChild.value))
            {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch)
        {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function CreateTD()
{
    return document.createElement("td");
}

function AddRow()
{
    var elm = document.createElement("tr");
    elm.classList.add("inititiveSlot");

    var tds = [CreateTD(), CreateTD(), CreateTD(), CreateTD(), CreateTD()];

    var initInput = document.createElement("input");
    initInput.type = "number";
    initInput.classList.add("inititive");
    tds[0].appendChild(initInput);
    
    var nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.classList.add("name");
    tds[1].appendChild(nameInput);

    var hpBox = document.createElement("div");
    hpBox.classList.add("hpBox");

    var buttons = document.createElement("div");
    var healBtn = document.createElement("button");
    healBtn.classList.add("heal");
    healBtn.innerHTML = "heal";
    
    buttons.appendChild(healBtn);

    var hpChangesBox = document.createElement("input");
    hpChangesBox.type = "number";

    buttons.appendChild(hpChangesBox);
    
    var damageButton = document.createElement("button");
    damageButton.classList.add("damage");
    damageButton.innerHTML = "damage";

    buttons.appendChild(damageButton);

    hpBox.appendChild(buttons);

    var hpInfo = document.createElement("div");
    var h1 = document.createElement("h1");
    h1.innerHTML = "0 /";
    hpInfo.appendChild(h1);

    var maxHPinput = document.createElement("input");
    maxHPinput.type = "number";

    hpInfo.appendChild(maxHPinput);

    hpBox.appendChild(hpInfo);

    tds[2].appendChild(hpBox);

    var textarea = document.createElement("textarea");
    textarea.classList.add("notes");

    tds[3].appendChild(textarea);

    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "<i class=\"fa fa-trash\"></i>";
    deleteButton.style.backgroundColor = "#00000000";
    deleteButton.style.border = "none";
    tds[4].appendChild(deleteButton);

    // elm.innerHTML = "<td><input class=\"inititive\" type=\"number\"></td>\
    // <td><input class=\"name\" type=\"text\"></td>\
    // <td>\
    //     <div class=\"hpBox\">\
    //         <div>\
    //             <button class=\"heal\">Heal</button>\
    //             <input type=\"number\">\
    //             <button class=\"damage\">Damage</button>\
    //         </div>\
    //         <div>\
    //             <h1>55/</h1>\
    //             <input type=\"number\">\
    //         </div>\
    //     </div>\
    // </td>\
    // <td><textarea class=\"notes\"></textarea></td>";

    var table = document.querySelector("table");

    elm.appendChild(tds[0]);
    elm.appendChild(tds[1]);
    elm.appendChild(tds[2]);
    elm.appendChild(tds[3]);
    elm.appendChild(tds[4]);

    table.appendChild(elm);
    
    var sort = () => 
    {
        sortTable(table);
    };

    initInput.addEventListener("focusout", sort);
    initInput.addEventListener("keyup", (e) => {if (e.key === "Enter") {e.preventDefault(); sort();}});

    healBtn.addEventListener("click", () => 
    {
        var currentHP = parseInt(h1.innerHTML.substring(0, h1.innerHTML.length - 2));
        var maxHP = parseInt(maxHPinput.value);

        if (((hpChangesBox.value != "") && (hpChangesBox.value != null)) && ((maxHPinput.value != "") && (maxHPinput.value != null)))
        {
            var proposedHP = clamp((currentHP + parseInt(hpChangesBox.value)), 0, maxHP);
    
            h1.innerHTML = proposedHP + " /";
            hpChangesBox.value = "";
        }
    });
    damageButton.addEventListener("click", () => 
    {
        var currentHP = parseInt(h1.innerHTML.substring(0, h1.innerHTML.length - 2));
        var maxHP = parseInt(maxHPinput.value);

        if (((hpChangesBox.value != "") && (hpChangesBox.value != null)) && ((maxHPinput.value != "") && (maxHPinput.value != null)))
        {
            var proposedHP = clamp((currentHP - parseInt(hpChangesBox.value)), 0, maxHP);
    
            h1.innerHTML = proposedHP + " /";
            hpChangesBox.value = "";
        }
    });

    deleteButton.addEventListener("click", () => 
    {
        elm.remove();
    });
}

var currentTurn = 0;
var round = 1;

(() => 
{
    AddRow();
    
    const table = document.querySelector("table");

    document.querySelector(".addSlot").addEventListener("click", () => {AddRow();});
    document.querySelector(".nextTurn").addEventListener("click", () => 
    {
        currentTurn = ((currentTurn + 1) % (table.children.length));
        if (currentTurn == 0)
        {
            currentTurn++;
            round++;
        }

        for (let i = 1 ; i < table.children.length; i++)
        {
            const slot = table.children[i];
            if (i == currentTurn)
            {
                slot.classList.add("active");
            }
            else
            {
                slot.classList.remove("active");
            }
        }

        document.querySelector(".nextTurn").innerHTML = "<i class=\"fa fa-arrow-right\"></i> Next Turn<br>Round: " + round;
    });
})();


var popup = document.querySelector(".popup");
var popupOpen = false;

popup.addEventListener("click", () => 
{
    SetPopupState(!popupOpen);
});

for (let i = 0; i < popup.children[1].children.length; i++)
{
    const child = popup.children[1].children[i];
    child.addEventListener("click", (e) => {e.stopPropagation();});
}

function SetPopupState(state)
{
    popupOpen = state;
    if (state)
    {
        popup.classList.add("active");
    }
    else
    {
        popup.classList.remove("active");
    }
}
