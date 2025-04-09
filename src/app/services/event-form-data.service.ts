import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class EventFormDataService {
  private eventData = {
    title: '',
    description: '',
    categories: [] as string[],
    location: '',
    date: '',
    hour: '',
    privacy: '',
    shoppingList: [] as { name: string; quantity: string }[],
    maxParticipants: '',
    participants: [] as string[],
    images: [] as (File | string)[]
  };

  constructor() {}

  setData(key: keyof typeof this.eventData, value: any) {
    this.eventData[key] = value;
  }

  getData() {
    return this.eventData;
  }
  addItemToShoppingList(item: any) {
    this.eventData.shoppingList.push(item);
  }

  addParticipant(participant: any) {
    this.eventData.participants.push(participant);
  }

  setImages(images: (File | string)[]) {
    this.eventData.images = images;
  }

  getImages(): (File | string)[] {
    return this.eventData.images;
  }

  addImage(image: File | string) {
    this.eventData.images.push(image);
  }

  removeImage(index: number) {
    this.eventData.images.splice(index, 1);
  }

  clearEventData() {
    this.eventData = {
      title: '',
      description: '',
      categories: [],
      location: '',
      date: '',
      hour: '',
      privacy: '',
      shoppingList: [],
      maxParticipants: '',
      participants: [],
      images: []
    };
  }

}
