import { Component, OnInit } from '@angular/core';
import {QuillEditorComponent} from "ngx-quill";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  imports: [
    QuillEditorComponent,
    FormsModule
  ]
})
export class RichTextEditorComponent {

  constructor() { }

  content: string = '';

  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, false] }],
      ['link']
    ]
  };

}
