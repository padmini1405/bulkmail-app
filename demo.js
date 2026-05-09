const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", function(event){
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.onload = function(event){
        const data = event.target.result;
        const workBook = XLSX.read(data, {type : "binary"});
        console.log(workBook);
        const sheetName = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[sheetName]
        const emailList = XLSX.utils.sheet_to_json(workSheet, {header : 'A'})
        console.log(emailList);
    }

    reader.readAsBinaryString(file);
})