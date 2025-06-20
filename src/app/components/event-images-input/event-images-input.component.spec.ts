import {EventImagesInputComponent} from "./event-images-input.component";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {AlertController} from "@ionic/angular";
import {EventFormDataService} from "../../services/event-form-data.service";
import {showAlert} from "../../services/utils";

jest.mock('../../services/utils', () => ({
  showAlert: jest.fn()
}));

describe('EventImagesInputComponent', () => {
  let component: EventImagesInputComponent;
  let fixture: ComponentFixture<EventImagesInputComponent>;
  let alertController: AlertController;
  let eventFormDataService: EventFormDataService;

  const dummyImages = ['https://dummyimage.com/100x100', new File(['dummy'], 'file.png', { type: 'image/png' })];

  beforeEach(waitForAsync(() => {
    const eventFormDataServiceMock = {
      getImages: jest.fn().mockReturnValue(dummyImages),
      setImages: jest.fn()
    };

    const alertControllerMock = {
      create: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [EventImagesInputComponent],
      providers: [
        { provide: EventFormDataService, useValue: eventFormDataServiceMock },
        { provide: AlertController, useValue: alertControllerMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventImagesInputComponent);
    component = fixture.componentInstance;
    alertController = TestBed.inject(AlertController);
    eventFormDataService = TestBed.inject(EventFormDataService);

    global.URL.createObjectURL = jest.fn((file: File) => 'blob:url/' + file.name);
  });

  it('should create component and initialize imagesPreview on ngOnInit', () => {
    component.ngOnInit();
    expect(eventFormDataService.getImages).toHaveBeenCalled();
    expect(component.imagesPreview.length).toBe(dummyImages.length);
    expect(component.imagesPreview[0]).toBe(dummyImages[0]);
    expect(component.imagesPreview[1]).toBe('blob:url/file.png');
  });

  it('should trigger file input click on triggerFileInput call', () => {
    const nativeElementMock = {
      click: jest.fn()
    };
    component.fileInput = { nativeElement: nativeElementMock } as any;

    component.triggerFileInput();
    expect(nativeElementMock.click).toHaveBeenCalled();
  });

  describe('onFileChange', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should show alert for invalid files and not add them', async () => {
      const eventMock = {
        target: {
          files: [
            new File([''], 'test.txt', { type: 'text/plain' })
          ]
        }
      };

      (showAlert as jest.Mock).mockResolvedValue(undefined);

      await component.onFileChange(eventMock);

      expect(showAlert).toHaveBeenCalledWith(expect.anything(), 'Invalid File', 'You must select an image file.');
      expect(eventFormDataService.setImages).not.toHaveBeenCalled();
    });

    it('should add valid image files and update imagesPreview', async () => {
      const initialImages = ['existing-image.png'];
      eventFormDataService.getImages = jest.fn().mockReturnValue(initialImages);
      eventFormDataService.setImages = jest.fn();

      const validFile = new File([''], 'photo.jpg', { type: 'image/jpeg' });
      const eventMock = {
        target: {
          files: [validFile]
        }
      };

      await component.onFileChange(eventMock);

      expect(eventFormDataService.getImages).toHaveBeenCalled();
      expect(eventFormDataService.setImages).toHaveBeenCalled();

      const setImagesMock = eventFormDataService.setImages as jest.Mock;
      const setImagesArg = setImagesMock.mock.calls[0][0];

      expect(setImagesArg.length).toBe(initialImages.length + 1);

      expect(
        setImagesArg.some(
          (f: any) => typeof f === 'object' && 'name' in f && f.name.includes('photo.jpg')
        )
      ).toBe(true);

      expect(component.imagesPreview.length).toBe(setImagesArg.length);
      expect(component.imagesPreview.some(url => url.startsWith('blob:url/'))).toBe(true);
    });

    it('should handle multiple files and filter invalid ones', async () => {
      eventFormDataService.getImages = jest.fn().mockReturnValue([]);
      eventFormDataService.setImages = jest.fn();

      const validFile1 = new File([''], 'img1.png', { type: 'image/png' });
      const validFile2 = new File([''], 'img2.jpeg', { type: 'image/jpeg' });
      const invalidFile = new File([''], 'doc.pdf', { type: 'application/pdf' });

      const eventMock = {
        target: {
          files: [validFile1, invalidFile, validFile2]
        }
      };

      (showAlert as jest.Mock).mockResolvedValue(undefined);

      await component.onFileChange(eventMock);

      expect(showAlert).toHaveBeenCalledTimes(1);
      expect(eventFormDataService.setImages).toHaveBeenCalled();

      const setImagesMock = eventFormDataService.setImages as jest.Mock;
      const updatedImages = setImagesMock.mock.calls[0][0];

      expect(updatedImages.length).toBe(2);
      expect(updatedImages.some((f: File) => f.name.includes('img1.png'))).toBe(true);
      expect(updatedImages.some((f: File) => f.name.includes('img2.jpeg'))).toBe(true);
      expect(updatedImages.some((f: File) => f.name.includes('doc.pdf'))).toBe(false);
    });
  });

  it('should remove image at index and update imagesPreview', () => {
    const currentImages = ['img1', 'img2', 'img3'];
    eventFormDataService.getImages = jest.fn().mockReturnValue([...currentImages]);
    eventFormDataService.setImages = jest.fn();

    component.imagesPreview = [...currentImages];
    component.removeImage(1);

    expect(eventFormDataService.getImages).toHaveBeenCalled();
    expect(eventFormDataService.setImages).toHaveBeenCalledWith(['img1', 'img3']);
    expect(component.imagesPreview).toEqual(['img1', 'img3']);
  });
});
