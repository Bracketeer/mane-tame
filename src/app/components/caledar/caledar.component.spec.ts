import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaledarComponent } from './caledar.component';

describe('CaledarComponent', () => {
  let component: CaledarComponent;
  let fixture: ComponentFixture<CaledarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaledarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaledarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
