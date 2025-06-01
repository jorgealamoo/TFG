import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss'],
  imports: [
    NgClass
  ]
})
export class ProfileImageComponent {
  @Input() imageUrl: string = "assets/images/default_profile_image.png";
  @Input() editable: boolean = false;
  @Output() imageChange = new EventEmitter<File>();

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  constructor() { }

  triggerFileInput() {
    this.fileInputRef.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
        this.imageChange.emit(file);
      };
      reader.readAsDataURL(file);
    }
  }
}
