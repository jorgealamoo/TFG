import {AlertController} from "@ionic/angular";

export async function showAlert(alertController: AlertController, header: string, message: string) {
  const alert = await alertController.create({
    header,
    message,
    buttons: ['OK'],
  });
  await alert.present();

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
