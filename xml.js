function LoadinitiativeOrderFromXml(xmlText)
{
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlText, "text/xml");

    var slots = [];
    var turn = 0;
    var currentRound = 0;

    var slotElms = xmlDoc.getElementsByTagName("slot");
    for (let i = 0; i < slotElms.length; i++)
    {
        const elm = slotElms[i];

        const slot = {};
        slot.initiative = parseInt(elm.getAttribute("initiative"));
        slot.name = elm.getAttribute("name");
        slot.currentHP = parseInt(elm.getAttribute("currentHP"));
        slot.maxHP = parseInt(elm.getAttribute("maxHP"));
        slot.notes = elm.getAttribute("notes");

        slot.ac = elm.getAttribute("AC");
        if ((slot.ac == null) || (slot.ac == ""))
        {
            slot.ac = null;
        }
        else
        {
            slot.ac = parseInt(slot.ac);
        }

        slot.conditions = JSON.parse(elm.getAttribute("conditions"));

        slots.push(slot);
    }

    turn = parseInt(xmlDoc.getElementsByTagName("initiative")[0].getAttribute("currentTurn"));
    currentRound = parseInt(xmlDoc.getElementsByTagName("initiative")[0].getAttribute("currentTurn"));
    
    var table = document.querySelector("table");
    for (let i = 1; i < table.children.length; i++)
    {
        const existingRow = table.children[i];
        existingRow.remove();
    }

    for (let i = 0; i < slots.length; i++)
    {
        const slot = slots[i];
        AddRow(slot.initiative, slot.name, slot.ac, slot.currentHP, slot.maxHP, slot.notes, slot.conditions);
    }

    currentTurn = turn;
    round = currentRound;

    UpdateCurrentTurnDisplay();
}

function loadFileToText(filePickerElm, callback)
{
    var file;
    var files = filePickerElm.files;
    if (files.length == 0)
    {
        return;
    }
    
    file = files[0];

    xmlFileName = file.name;
    
    let reader = new FileReader();

    reader.onload = function(e)
    {
        var filedata = e.target.result;
  
        // This is a regular expression to identify carriage 
        // Returns and line breaks
        var lines = filedata.split(/\r\n|\n/);
        var text = lines.join('\n');

        callback(text);
    };
  
    reader.onerror = (e) => alert(e.target.error.name);
    
    reader.readAsText(file);
}

function Download(filename, text)
{
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent)
    {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else
    {
        pom.click();
    }
}

function SaveinitiativeToFile()
{
    const slots = [];
    var turn = currentTurn;
    var currentRound = round;


    var table = document.querySelector("table");
    for (let i = 1; i < table.children.length; i++)
    {
        const row = table.children[i];

        const slot = {};
        slot.initiative = row.querySelector(".initiative").value;
        slot.name = row.querySelector(".name").value;
        slot.currentHP = row.querySelector(".hpBox div:nth-child(2) h1").innerHTML;
        slot.maxHP = row.querySelector(".hpBox div:nth-child(2) input").value;
        slot.notes = row.querySelector(".notes").value;
        slot.ac = row.querySelector(".ACBox input").value;

        const conditionsElm = row.querySelector(".conditions ul")
        slot.conditions = [];
        for (let i = 0; i < conditionsElm.children.length; i++)
        {
            const elm = conditionsElm.children[i].firstChild;
            if (elm.checked)
            {
                slot.conditions.push(true);
            }
            else
            {
                slot.conditions.push(false);
            }
        }

        slot.currentHP = slot.currentHP.substr(0, slot.currentHP.length - 2);

        slots.push(slot);
    }

    const slotLines = [];
    for (let i = 0; i < slots.length; i++)
    {
        const slot = slots[i];
        var line = `    <slot initiative=\"${slot.initiative}\" name=\"${slot.name}\" AC=\"${slot.ac}\" currentHP=\"${slot.currentHP}\" maxHP=\"${slot.maxHP}\" notes=\"${slot.notes}\" conditions=\"${JSON.stringify(slot.conditions)}\"></slot>`;
        slotLines.push(line);
    }

    var xmlString = `<initiative currentTurn=\"${turn}\" round=\"${currentRound}\">\n`;
    for (let i = 0; i < slotLines.length; i++)
    {
        const line = slotLines[i];
        xmlString += line + "\n";
    }

    xmlString += "</initiative>";

    Download(`${slots.length} turn combat.initiative`, xmlString);
}

(() => {
    var loadButton = document.querySelector(".loadinitiative");
    var saveButton = document.querySelector(".saveinitiative");
    
    var filePicker = document.querySelector("#filepicker");
    
    filePicker.addEventListener("change", () => 
    {
        loadFileToText(filePicker, (text) =>
        {
            LoadinitiativeOrderFromXml(text);
        });
    });

    loadButton.addEventListener("click", () => 
    {
        filePicker.click();
    });

    saveButton.addEventListener("click", () => 
    {
        SaveinitiativeToFile();
    });
})();
// LoadinitiativeOrderFromXml("<initiative>\
// <slot initiative=\"12\" name=\"spooky Firemage\" currentHP=\"35\" maxHP=\"67\" notes=\"\"></slot>\
// </initiative>");
