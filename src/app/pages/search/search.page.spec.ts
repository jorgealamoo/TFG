import {ComponentFixture, TestBed} from "@angular/core/testing";
import {SearchPage} from "./search.page";
import {IonicModule} from "@ionic/angular";
import {SupabaseService} from "../../services/supabase.service";
import {NO_ERRORS_SCHEMA} from "@angular/core";

const supabaseMock = {
  getRecommendedEvents: jest.fn(),
  searchEventsPaginated: jest.fn(),
};

const flush = () => new Promise(r => setTimeout(r));

describe('SearchPage', () => {
  let fixture: ComponentFixture<SearchPage>;
  let component: SearchPage;

  const initInfiniteScroll = () => {
    component.infiniteScroll = { disabled: false } as any;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), SearchPage],
      providers: [{ provide: SupabaseService, useValue: supabaseMock }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPage);
    component = fixture.componentInstance;
    initInfiniteScroll();
  });

  afterEach(() => jest.resetAllMocks());

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('ionViewWillEnter loads recommended events and sets offset', async () => {
    supabaseMock.getRecommendedEvents.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    await component.ionViewWillEnter();
    await flush();

    expect(component.searchResults).toEqual([{ id: 1 }, { id: 2 }]);
    expect(component.offset).toBe(2);
    expect(component.currentQuery).toBe('');
    expect(component.infiniteScroll.disabled).toBe(true);
  });

  it('onSearch with empty query clears results and disables scroll', async () => {
    component.searchResults = [{ id: 1 }];
    component.infiniteScroll.disabled = false;

    await component.onSearch('');
    await flush();

    expect(component.searchResults).toEqual([]);
    expect(component.infiniteScroll.disabled).toBe(true);
  });

  it('onSearch fetches events and updates state', async () => {
    supabaseMock.searchEventsPaginated.mockResolvedValue([{ id: 10 }]);

    await component.onSearch('music');
    await flush();

    expect(component.currentQuery).toBe('music');
    expect(component.offset).toBe(1);
    expect(component.searchResults).toEqual([{ id: 10 }]);
    expect(component.infiniteScroll.disabled).toBe(true);
  });

  it('loadMoreEvents appends new events and toggles infinite scroll', async () => {
    component.currentQuery = 'tech';
    component.searchResults = [{ id: 1 }];
    component.offset = 1;
    supabaseMock.searchEventsPaginated.mockResolvedValue([{ id: 2 }, { id: 3 }]);

    const ev = { target: { complete: jest.fn() } } as any;

    await component.loadMoreEvents(ev);
    await flush();

    expect(component.searchResults).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(component.offset).toBe(3);
    expect(component.infiniteScroll.disabled).toBe(true);
    expect(ev.target.complete).toHaveBeenCalled();
  });

  it('loadMoreEvents disables scroll when returned fewer than limit', async () => {
    component.currentQuery = 'art';
    component.searchResults = [{ id: 1 }];
    component.offset = 1;
    supabaseMock.searchEventsPaginated.mockResolvedValue([{ id: 2 }]);

    const ev = { target: { complete: jest.fn() } } as any;

    await component.loadMoreEvents(ev);
    await flush();

    expect(component.infiniteScroll.disabled).toBe(true);
  });

  it('loadMoreEvents exits early when already loading', async () => {
    component.loading = true;
    const ev = { target: { complete: jest.fn() } } as any;

    await component.loadMoreEvents(ev);

    expect(ev.target.complete).toHaveBeenCalled();
  });
});
