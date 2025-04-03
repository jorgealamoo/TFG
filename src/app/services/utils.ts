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
