import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {showAlert} from "../../services/utils";
import {AlertController} from "@ionic/angular";
import {EventFormDataService} from "../../services/event-form-data.service";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-event-images-input',
  templateUrl: './event-images-input.component.html',
  styleUrls: ['./event-images-input.component.scss'],
  imports: [
    NgIf,
    NgForOf
  ]
})
export class EventImagesInputComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  imagesPreview: string[] = [];

  constructor(
    private alertController: AlertController,
    private eventFormDataService: EventFormDataService
  ) { }

  ngOnInit() {
    const images = this.eventFormDataService.getImages();
    this.imagesPreview = images.map(image =>
      typeof image === 'string' ? image : URL.createObjectURL(image)
    );
  }

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
        const currentImages = this.eventFormDataService.getImages();
        const updatedImages = [...currentImages, ...validImages];
        this.eventFormDataService.setImages(updatedImages);
        this.imagesPreview = updatedImages.map(image =>
          typeof image === 'string' ? image : URL.createObjectURL(image)
        );
        console.log('Imágenes válidas seleccionadas:', validImages);
      }
    }
  }

  removeImage(index: number) {
    const currentImages = this.eventFormDataService.getImages();
    currentImages.splice(index, 1);
    this.eventFormDataService.setImages(currentImages);

    this.imagesPreview = currentImages.map(image =>
      typeof image === 'string' ? image : URL.createObjectURL(image)
    );
  }

}
