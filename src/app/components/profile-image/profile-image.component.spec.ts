import {ProfileImageComponent} from "./profile-image.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {DebugElement} from "@angular/core";

describe('ProfileImageComponent', () => {
  let component: ProfileImageComponent;
  let fixture: ComponentFixture<ProfileImageComponent>;
  let debugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileImageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileImageComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default image', () => {
    fixture.detectChanges();
    const imgEl = debugEl.nativeElement.querySelector('img');
    expect(imgEl.src).toContain('assets/images/default_profile_image.png');
  });

  it('should trigger file input when editable and container is clicked', () => {
    component.editable = true;
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.profile-image-container');
    const spy = jest.spyOn(component, 'triggerFileInput');

    container.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should NOT show upload button if editable is false', () => {
    component.editable = false;
    fixture.detectChanges();

    const button = debugEl.nativeElement.querySelector('.edit-button');
    expect(button).toBeFalsy();
  });

  it('should trigger file input click when triggerFileInput is called', () => {
    const mockInput = {
      nativeElement: {
        click: jest.fn()
      }
    };

    component.fileInputRef = mockInput as any;
    component.triggerFileInput();

    expect(mockInput.nativeElement.click).toHaveBeenCalled();
  });

  it('should update imageUrl and emit imageChange on file selection', (done) => {
    const mockFile = new File(['dummy'], 'photo.png', { type: 'image/png' });
    const event = {
      target: {
        files: [mockFile]
      }
    } as unknown as Event;

    const emitSpy = jest.spyOn(component.imageChange, 'emit');

    class MockFileReader {
      result: string | ArrayBuffer | null = 'data:image/png;base64,fakedata';
      onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;

      readAsDataURL(_file: File) {
        if (this.onload) {
          this.onload.call(
            this as any,
            { target: this } as unknown as ProgressEvent<FileReader>
          );
        }
      }
    }

    jest.spyOn(window as any, 'FileReader').mockImplementation(() => new MockFileReader() as any);

    component.onFileSelected(event);

    setTimeout(() => {
      expect(component.imageUrl).toBe('data:image/png;base64,fakedata');
      expect(emitSpy).toHaveBeenCalledWith(mockFile);
      done();
    }, 0);
  });
});
