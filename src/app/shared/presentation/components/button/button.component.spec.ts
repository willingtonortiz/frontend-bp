import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Component } from '@angular/core';

import { ButtonComponent } from './button.component';

@Component({
  template: ` <app-button>Click me!</app-button> `,
})
class TestHostComponent {}

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;
  let component: ButtonComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonComponent, TestHostComponent],
    });
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should emit the click event', fakeAsync(() => {
    spyOn(component, 'onClick');
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    button?.click();

    tick();

    expect(component.onClick).toHaveBeenCalled();
  }));

  it('should render its children', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('button')?.textContent).toContain(
      'Click me!'
    );
  });
});
