import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.component.html',
  styleUrls: ['./grocery-list.component.scss']
})
export class GroceryListComponent implements OnInit {

  items = [
    { item: '', amount: '' },
    { item: '', amount: '' },
  ]

  constructor() { }

  ngOnInit() {
  }

  inputFocused(index: number) {
    // the timeout is for clicking buttons when a field needs to get deleted. originally it was so fast that the button didn't click. The timeout needs to match inputBlurred otherwise there's a flash.
    setTimeout(() => {
      if (this.items.length == index + 1) {
        this.items.push({ item: '', amount: '' })
      }
    }, 200);
  }

  // inputBlurred is called when input fields are unfocused and used to remove empty input fields. 
  inputBlurred() {
    // the timeout is for clicking buttons when a field needs to get deleted. originally it was so fast that the button didn't click.
    setTimeout(() => {
      // check if the input field 1 before the last is empty. If so, remove the last item
      for (let i = this.items.length - 1; i >= 0; --i) {
        if (i >= 2) {
          // only if the current item is empty and the previous item is empty
          if (!this.items[i].item && !this.items[i - 1].item) {
            this.items.splice(i, 1);
          }
        }
      }

      // check if there's an empty in between 2 filled inputs
      for (let i = this.items.length - 1; i >= 0; --i) {
        if (i > 0 && i < this.items.length - 1) {
          if (this.items[i + 1].item && this.items[i - 1].item && !this.items[i].item) {
            this.items.splice(i, 1);
          }
        }
      }

      // check if the first input is empty with a filled input after it
      if (!this.items[0].item && this.items[1].item) {
        this.items.splice(0, 1);
      }
    }, 200);

  }

  // print generates a new window for the user to print their shopping list
  print() {
    // count is 1 because this is simply for display purposes
    let count = 1;
    let printContents = '';
    this.items.forEach((element) => {
      if (element.item) {
        printContents += `${element.amount} &nbsp; <strong>${element.item}</strong><br />`;
      }
    });
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
      <head>
        <title>Grocery List</title>
      </head>
      <body onload="window.print();window.close()">${printContents}</body>
    </html>
    `);
    popupWin.print();
    popupWin.close();
  }

  // export creates a text file that can be used to save the list for a later import
  export() {
    // map our item array into a string.
    // prepend our string with a super secret byte sequence so that other files cannot be read mistakenly
    let text = "\xAA\xF3\x23\x14\x99\x78\xA2\x66";
    this.items.forEach(element => {
      if (element.item) {
        text += `${element.amount}\t${element.item}\n`;
      }
    });
    // remove the last \n
    text = text.slice(0, -1);
    // save the file
    let blob = new Blob([text], { type: "text/plan;charset=utf-8" });
    saveAs(blob, "grocerylist.txt");
  }

  // import parses a text file and enters the data into this.items. The function is called from "importClicked()".
  import(event) {
    // standard file upload check
    if (event.target.files && event.target.files[0]) {
      let fr = new FileReader();

      fr.onload = (e: any) => {
        let text = e.target.result;

        // verify our file
        let verifyText = text.split("\x66");
        if(verifyText[0] != "\xAA\xF3\x23\x14\x99\x78\xA2") {
          console.log("file verification failed.");
          return;
        }

        // split by our \n delimiter. each line is an item
        let lines = verifyText[1].split('\n');
        let items = [];
        lines.forEach(l => {
          // split by \t: to the left is amount, to the right is the item name
          let s = l.split('\t');
          items.push({ item: s[1], amount: s[0] });
        })
        // push a new line for another entry
        items.push({ item: '', amount: '' });

        this.items = items;
      }

      fr.readAsText(event.target.files[0]);
    }

  }

  // importClicked is called when the import button is clicked and is simply a middle-man to the import() function.
  // This is done to hide the standard file input HTML because it's ugly.
  importClicked(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  // clears the fields
  clear() {
    this.items = [
      { item: '', amount: '' },
      { item: '', amount: '' }
    ]
  }

}
