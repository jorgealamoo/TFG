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
    participants: [] as string[]
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

}
