import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProducerContactPage } from './producer-contact.page';

describe('ProducerContactPage', () => {
  let component: ProducerContactPage;
  let fixture: ComponentFixture<ProducerContactPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducerContactPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
