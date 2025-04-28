import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class EventFormDataService {
  private eventData = {
    uuid: '',
    creatorUser: '',
    title: '',
    description: '',
    categories: [] as string[],
    location: '',
    date: '',
    hour: '',
    privacy: '',
    shoppingList: [] as { name: string; price: number }[],
    totalPrice: 0,
    maxParticipants: 0,
    maxParticipantsEnabled: true,
    participants: [] as string[],
    images: [] as (File | string)[],
    splitCostsEnabled: true,
    entryPrice: 0
  };

  constructor() {}

  setData<K extends keyof typeof this.eventData>(key: K, value: typeof this.eventData[K]) {
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
      uuid: '',
      creatorUser: '',
      title: '',
      description: '',
      categories: [],
      location: '',
      date: '',
      hour: '',
      privacy: '',
      shoppingList: [],
      totalPrice: 0,
      maxParticipants: 0,
      maxParticipantsEnabled: true,
      participants: [],
      images: [],
      splitCostsEnabled: true,
      entryPrice: 0
    };
  }

}
