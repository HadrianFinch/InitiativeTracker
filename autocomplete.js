const popupCharacterThreshold = 2;

function StartsWithUppercase(word)
{
    return word.charAt(0) === word.charAt(0).toUpperCase();
}

function AddAutocompleteToTextarea(textarea, wordList, wordCompleteCallback)
{
    var word = "";
    var foundWord = "";
    textarea.addEventListener("keyup", (e) =>
    {
        if (e.key == "Enter")
        {
            if (foundWord != "")
            {
                e.preventDefault();
                console.log("completing word");

                textarea.value = textarea.value.substr(0, textarea.value.length - (word.length + 1)) + foundWord;
                
                wordCompleteCallback(foundWord);
            }
            word = "";
            foundWord = "";
        }
        else if (e.key == " ")
        {
            word = "";
            foundWord = "";
        }
        else if (StartsWithUppercase(e.key))
        {
            // its not a letter if it starts with an upper case
        }
        else
        {
            word += e.key;
            if (word.length >= popupCharacterThreshold)
            {
                
                foundWord = wordList.find((e) => {
                    if (e.substr(0, word.length) == word)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                });

                if ((foundWord != null) && (word.length <= foundWord.length))
                {
                    // word was sucessfully found!
                }
                else
                {
                    foundWord = "";
                }
            }
        }
    });
}

(() => {
    // AddAutocompleteToTextarea(document.querySelector("textarea"), ["prone", "stunned", "blinded"], (word) => {});
})();