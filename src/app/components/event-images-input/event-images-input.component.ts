import {Component, ElementRef, ViewChild} from '@angular/core';
import {showAlert} from "../../services/utils";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-event-images-input',
  templateUrl: './event-images-input.component.html',
  styleUrls: ['./event-images-input.component.scss'],
})
export class EventImagesInputComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  async onFileChange(event: any) {
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      const validImages: File[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.type.startsWith('image/')) {
          validImages.push(file);
        } else {
          await showAlert(this.alertController, "Invalid File", "You must select an image file.")
        }
      }

      if (validImages.length > 0) {
        console.log('Imágenes válidas seleccionadas:', validImages);
      }
    }
  }

  constructor(private alertController: AlertController) { }


}
